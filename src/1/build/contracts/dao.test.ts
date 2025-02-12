import { expect } from 'vitest';
import { ethers } from 'hardhat';
import type { Contract } from 'ethers';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('ONEDao', () => {
  let dao: Contract;
  let token: Contract;
  let owner: SignerWithAddress;
  let agent: SignerWithAddress;
  let user: SignerWithAddress;

  const PROPOSAL_THRESHOLD = ethers.utils.parseEther('100');
  const VOTING_PERIOD = 5760; // ~1 day in blocks
  const QUORUM_PERCENTAGE = 10; // 10%

  beforeEach(async () => {
    // Get signers
    [owner, agent, user] = await ethers.getSigners();

    // Deploy token
    const ONEToken = await ethers.getContractFactory('ONEToken');
    token = await ONEToken.deploy();
    await token.deployed();

    // Deploy DAO
    const ONEDao = await ethers.getContractFactory('ONEDao');
    dao = await ONEDao.deploy(
      token.address,
      PROPOSAL_THRESHOLD,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE
    );
    await dao.deployed();

    // Setup roles
    const AGENT_ROLE = await dao.AGENT_ROLE();
    await dao.grantRole(AGENT_ROLE, agent.address);

    // Transfer tokens to users
    await token.transfer(user.address, ethers.utils.parseEther('1000'));
  });

  describe('Governance', () => {
    it('should create proposal when user has enough tokens', async () => {
      const description = 'Test Proposal';
      const tx = await dao.connect(user).propose(description);
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'ProposalCreated');
      expect(event?.args?.proposalId).to.equal(0);
      expect(event?.args?.proposer).to.equal(user.address);
      expect(event?.args?.description).to.equal(description);
    });

    it('should allow voting on active proposals', async () => {
      // Create proposal
      await dao.connect(user).propose('Test Proposal');

      // Cast vote
      const tx = await dao.connect(user).castVote(0, true);
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'VoteCast');
      expect(event?.args?.voter).to.equal(user.address);
      expect(event?.args?.proposalId).to.equal(0);
      expect(event?.args?.support).to.be.true;
    });

    it('should execute successful proposals', async () => {
      // Create proposal
      await dao.connect(user).propose('Test Proposal');

      // Cast vote
      await dao.connect(user).castVote(0, true);

      // Mine blocks to end voting period
      for (let i = 0; i < VOTING_PERIOD + 1; i++) {
        await ethers.provider.send('evm_mine', []);
      }

      // Execute proposal
      const tx = await dao.connect(owner).executeProposal(0);
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'ProposalExecuted');
      expect(event?.args?.proposalId).to.equal(0);
    });
  });

  describe('Access Control', () => {
    it('should restrict admin functions to admin role', async () => {
      await expect(
        dao.connect(user).setProposalThreshold(ethers.utils.parseEther('200'))
      ).to.be.revertedWith(/AccessControl/);
    });

    it('should allow admin to update governance parameters', async () => {
      const newThreshold = ethers.utils.parseEther('200');
      await dao.connect(owner).setProposalThreshold(newThreshold);
      expect(await dao.proposalThreshold()).to.equal(newThreshold);
    });
  });

  describe('Emergency Controls', () => {
    it('should allow admin to pause and unpause', async () => {
      await dao.connect(owner).pause();
      expect(await dao.paused()).to.be.true;

      await dao.connect(owner).unpause();
      expect(await dao.paused()).to.be.false;
    });

    it('should prevent operations when paused', async () => {
      await dao.connect(owner).pause();
      await expect(
        dao.connect(user).propose('Test Proposal')
      ).to.be.revertedWith('Pausable: paused');
    });
  });
}); 