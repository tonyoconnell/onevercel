import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle, Check, Copy, QrCode, ExternalLink } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { toast } from "sonner";

interface CryptoPaymentProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess?: (txData: TransactionData) => void;
}

interface CryptoAPIResponse {
  bitcoin: Record<string, number>;
  ethereum: Record<string, number>;
  solana: Record<string, number>;
}

interface TransactionData {
  hash: string;
  confirmations: number;
  [key: string]: any;
}

type CryptoCurrency = 'BTC' | 'ETH' | 'SOL';

interface CryptoConfig {
  address: string;
  network?: string;
  explorer?: string;
  qrPrefix?: string;
}

const CRYPTO_CONFIG: Record<CryptoCurrency, CryptoConfig> = {
  BTC: {
    address: "YOUR_BTC_ADDRESS",
    network: "Bitcoin",
    explorer: "https://blockchain.info/tx",
    qrPrefix: "bitcoin:"
  },
  ETH: {
    address: "YOUR_ETH_ADDRESS",
    network: "Ethereum",
    explorer: "https://etherscan.io/tx",
    qrPrefix: "ethereum:"
  },
  SOL: {
    address: "YOUR_SOL_ADDRESS",
    network: "Solana",
    explorer: "https://solscan.io/tx",
    qrPrefix: "solana:"
  }
};

interface CryptoPrices {
  BTC: number;
  ETH: number;
  SOL: number;
}

export default function CryptoPayment({ 
  orderId, 
  amount, 
  currency = "USD",
  onSuccess 
}: CryptoPaymentProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency>("BTC");
  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const [senderAddress, setSenderAddress] = useState("");
  const [status, setStatus] = useState<"pending" | "verifying" | "completed" | "failed">("pending");
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get crypto price and calculate amount
  useEffect(() => {
    async function getCryptoAmount() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=${currency.toLowerCase()}`
        );
        const data = (await response.json()) as CryptoAPIResponse;
        const prices: CryptoPrices = {
          BTC: data.bitcoin[currency.toLowerCase()] ?? 0,
          ETH: data.ethereum[currency.toLowerCase()] ?? 0,
          SOL: data.solana[currency.toLowerCase()] ?? 0
        };
        const cryptoPrice = prices[selectedCrypto];
        setCryptoAmount((amount / cryptoPrice).toFixed(8));
      } catch (err) {
        setError("Failed to fetch crypto price. Please try again.");
        toast.error("Failed to fetch crypto price");
      } finally {
        setIsLoading(false);
      }
    }
    getCryptoAmount();
  }, [amount, currency, selectedCrypto]);

  // Verify payment
  async function verifyPayment(e: React.FormEvent) {
    e.preventDefault();
    setStatus("verifying");
    setError("");
    setIsLoading(true);

    try {
      const config = CRYPTO_CONFIG[selectedCrypto];
      if (!config.explorer) {
        throw new Error("Explorer URL not configured");
      }

      const response = await fetch(`${config.explorer}/api/tx/${senderAddress}`);
      const txData = (await response.json()) as TransactionData;

      if (txData.confirmations > 0) {
        setStatus("completed");
        localStorage.setItem(`payment_${orderId}`, JSON.stringify({
          orderId,
          amount,
          cryptoAmount,
          cryptoCurrency: selectedCrypto,
          senderAddress,
          txId: txData.hash,
          status: "completed",
          timestamp: Date.now()
        }));
        toast.success("Payment verified successfully!");
        onSuccess?.(txData);
      } else {
        setStatus("failed");
        setError("Payment not found or insufficient confirmations");
        toast.error("Payment verification failed");
      }
    } catch (err) {
      setStatus("failed");
      setError("Failed to verify payment. Please try again or contact support.");
      toast.error("Verification error");
    } finally {
      setIsLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  function getQRValue() {
    const config = CRYPTO_CONFIG[selectedCrypto];
    const prefix = config.qrPrefix || "";
    return `${prefix}${config.address}${cryptoAmount ? `?amount=${cryptoAmount}` : ""}`;
  }

  function openExplorer() {
    const config = CRYPTO_CONFIG[selectedCrypto];
    if (senderAddress && config.explorer) {
      window.open(`${config.explorer}/${senderAddress}`, '_blank');
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Crypto Payment</h2>
          <p className="text-muted-foreground">
            Amount: {amount} {currency}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Select Cryptocurrency</Label>
            <Select
              value={selectedCrypto}
              onValueChange={(value: CryptoCurrency) => setSelectedCrypto(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {cryptoAmount && (
            <div className="space-y-2">
              <Label>Send Exactly</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <span className="font-mono">{cryptoAmount} {selectedCrypto}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(cryptoAmount)}
                  disabled={isLoading}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>To Address</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="font-mono truncate">
                {CRYPTO_CONFIG[selectedCrypto].address}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(CRYPTO_CONFIG[selectedCrypto].address)}
                disabled={isLoading}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQR(!showQR)}
                disabled={isLoading}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showQR && (
            <div className="flex justify-center p-4">
              <div className="p-4 bg-white rounded-xl">
                <QRCodeSVG
                  value={getQRValue()}
                  size={200}
                  level="H"
                />
              </div>
            </div>
          )}

          {status === "pending" && (
            <form onSubmit={verifyPayment} className="space-y-4">
              <div>
                <Label>Your Transaction ID</Label>
                <div className="flex gap-2">
                  <Input
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    placeholder="Enter your transaction ID"
                    required
                    disabled={isLoading}
                  />
                  {senderAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={openExplorer}
                      disabled={isLoading}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Payment"
                )}
              </Button>
            </form>
          )}

          {status === "verifying" && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
              <p>Verifying payment...</p>
            </div>
          )}

          {status === "completed" && (
            <div className="text-center text-green-500 p-4">
              <Check className="h-8 w-8 mx-auto mb-2" />
              <p>Payment verified successfully!</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 p-2 bg-red-50 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 