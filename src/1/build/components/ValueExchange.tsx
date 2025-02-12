import { useState } from 'react';
import { useContract } from '../web/useContract';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';

enum ValueType {
  KNOWLEDGE,
  EDUCATION,
  TECHNOLOGY,
  CERTIFICATION,
  TOKEN
}

export const ValueExchange = () => {
  const { contract } = useContract('ONEValue');
  const [to, setTo] = useState('');
  const [valueType, setValueType] = useState<ValueType>(ValueType.KNOWLEDGE);
  const [amount, setAmount] = useState('');
  const [metadata, setMetadata] = useState('');

  const handleExchange = async () => {
    try {
      const tx = await contract.exchangeValue(
        to,
        valueType,
        amount,
        metadata
      );
      await tx.wait();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Exchange Value</h2>
      
      <div className="space-y-2">
        <label>Recipient Address</label>
        <Input 
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x..."
        />
      </div>

      <div className="space-y-2">
        <label>Value Type</label>
        <Select
          value={valueType}
          onChange={(e) => setValueType(Number(e.target.value))}
        >
          <option value={ValueType.KNOWLEDGE}>Knowledge</option>
          <option value={ValueType.EDUCATION}>Education</option>
          <option value={ValueType.TECHNOLOGY}>Technology</option>
          <option value={ValueType.CERTIFICATION}>Certification</option>
          <option value={ValueType.TOKEN}>Token</option>
        </Select>
      </div>

      <div className="space-y-2">
        <label>Amount</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label>Metadata</label>
        <Input
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder="Additional information..."
        />
      </div>

      <Button onClick={handleExchange}>
        Exchange Value
      </Button>
    </div>
  );
}; 