import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { I1Value, I1Value__factory } from '../typechain-types';

describe('I1Value', () => {
  let i1Value: I1Value;
  let owner: SignerWithAddress;
  let provider: SignerWithAddress;
  let consumer: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const ValueType = {
    KNOWLEDGE: 0,
    EDUCATION: 1,
    TECHNOLOGY: 2,
    INFERENCE: 3,
    TOKEN: 4
  };

  beforeEach(async () => {
    // Get signers
    [owner, provider, consumer, ...addrs] = await ethers.getSigners();

    // Deploy contract
    const I1ValueFactory = await ethers.getContractFactory('I1Value');
    i1Value = await I1ValueFactory.deploy();
    await i1Value.deployed();

    // Verify provider capabilities
    await i1Value.verifyCapability(provider.address, ValueType.KNOWLEDGE);
    
    // Purchase access rights for consumer
    await i1Value.connect(consumer).purchaseAccess(ValueType.KNOWLEDGE, {
      value: ethers.utils.parseEther('1.0')
    });

    // Transfer initial tokens to provider
    await i1Value.transfer(
      provider.address,
      ethers.utils.parseEther('1000.0')
    );
  });

  describe('Value Exchange', () => {
    it('should exchange value between provider and consumer', async () => {
      const amount = ethers.utils.parseEther('100.0');
      const metadata = 'AI consultation';

      // Get initial balances
      const providerInitialBalance = await i1Value.balanceOf(provider.address);
      const consumerInitialBalance = await i1Value.balanceOf(consumer.address);
      const providerInitialRep = await i1Value.reputation(provider.address);

      // Execute exchange
      await i1Value.connect(provider).exchangeValue(
        consumer.address,
        ValueType.KNOWLEDGE,
        amount,
        metadata
      );

      // Verify balances
      const fee = amount.mul(2).div(100); // 2% fee
      const reward = amount.mul(5).div(100); // 5% base reward
      
      expect(await i1Value.balanceOf(provider.address))
        .to.equal(providerInitialBalance.sub(amount).add(reward));
      
      expect(await i1Value.balanceOf(consumer.address))
        .to.equal(consumerInitialBalance.add(amount.sub(fee)));

      // Verify reputation increase
      expect(await i1Value.reputation(provider.address))
        .to.be.above(providerInitialRep);
    });

    it('should fail if provider not verified', async () => {
      await expect(
        i1Value.connect(consumer).exchangeValue(
          provider.address,
          ValueType.KNOWLEDGE,
          ethers.utils.parseEther('100.0'),
          'test'
        )
      ).to.be.revertedWith('Provider not verified');
    });

    it('should fail if consumer lacks access rights', async () => {
      await expect(
        i1Value.connect(provider).exchangeValue(
          addrs[0].address,
          ValueType.KNOWLEDGE,
          ethers.utils.parseEther('100.0'),
          'test'
        )
      ).to.be.revertedWith('Consumer lacks access rights');
    });
  });

  describe('Access Rights', () => {
    it('should allow purchasing access rights', async () => {
      const cost = await i1Value.accessCosts(ValueType.EDUCATION);
      
      await i1Value.connect(consumer).purchaseAccess(
        ValueType.EDUCATION,
        { value: cost }
      );

      const accessExpiry = await i1Value.accessRights(
        consumer.address,
        ValueType.EDUCATION
      );
      
      expect(accessExpiry).to.be.above(0);
    });

    it('should fail with insufficient payment', async () => {
      const cost = await i1Value.accessCosts(ValueType.EDUCATION);
      
      await expect(
        i1Value.connect(consumer).purchaseAccess(
          ValueType.EDUCATION,
          { value: cost.sub(1) }
        )
      ).to.be.revertedWith('Insufficient payment');
    });
  });

  describe('Governance', () => {
    it('should allow owner to update access costs', async () => {
      const newCost = ethers.utils.parseEther('2.0');
      
      await i1Value.updateAccessCost(ValueType.KNOWLEDGE, newCost);
      
      expect(await i1Value.accessCosts(ValueType.KNOWLEDGE))
        .to.equal(newCost);
    });

    it('should allow owner to add value to pools', async () => {
      const amount = ethers.utils.parseEther('1000000.0');
      const initialPool = await i1Value.valuePools(ValueType.KNOWLEDGE);
      
      await i1Value.addValueToPool(ValueType.KNOWLEDGE, amount);
      
      expect(await i1Value.valuePools(ValueType.KNOWLEDGE))
        .to.equal(initialPool.add(amount));
    });

    it('should fail if non-owner tries to verify capability', async () => {
      await expect(
        i1Value.connect(consumer).verifyCapability(
          provider.address,
          ValueType.EDUCATION
        )
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Provider Stats', () => {
    it('should return correct provider stats', async () => {
      const [rep, caps] = await i1Value.getProviderStats(provider.address);
      
      expect(caps[ValueType.KNOWLEDGE]).to.be.true;
      expect(caps[ValueType.EDUCATION]).to.be.false;
      expect(rep).to.equal(await i1Value.reputation(provider.address));
    });
  });
}); 