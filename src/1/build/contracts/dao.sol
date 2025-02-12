// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// ============================================================================
// ONE DAO 
// ============================================================================

// ARCHITECTURE 
// --------------------
// The ONE DAO follows a modular architecture with:
// 1. Governance Token (1.token.sol) - For voting rights
// 2. DAO Contract (this file) - For proposal and voting logic
// 3. Access Control - For role management
// 4. Emergency Controls - For system safety

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// IMPLEMENTATION
// -------------------
// 1. Deploy governance token (1.token.sol)
// 2. Deploy DAO with token address
// 3. Configure voting parameters
// 4. Grant roles to trusted agents
// 5. Begin governance process

contract ONEDao is AccessControl, Pausable {
    // ROLE CONFIGURATION
    // -----------------
    // Admin: Can execute proposals and manage parameters
    // Agent: Can participate in specialized operations
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    
    // GOVERNANCE PARAMETERS
    // --------------------
    // proposalThreshold: Minimum tokens needed to create proposal (prevents spam)
    // votingPeriod: Number of blocks voting remains open
    // quorumPercentage: Minimum participation required (1-100)
    uint256 public proposalThreshold;    
    uint256 public votingPeriod;         
    uint256 public quorumPercentage;     
    
    // PROPOSAL STRUCTURE
    // -----------------
    // id: Unique identifier
    // proposer: Address that created the proposal
    // description: Proposal details (preferably IPFS hash)
    // forVotes/againstVotes: Vote tallies
    // startBlock/endBlock: Voting period
    // executed: Prevents double execution
    // hasVoted: Prevents double voting
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    // STATE MANAGEMENT
    // ---------------
    // proposals: All proposals mapped by ID
    // proposalCount: Total number of proposals (also used for IDs)
    // governanceToken: ERC20 token used for voting
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    ERC20 public governanceToken;

    // EVENTS
    // ------
    // ProposalCreated: Emitted when new proposal is created
    // VoteCast: Emitted when a vote is cast
    // ProposalExecuted: Emitted when proposal passes and is executed
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string description
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        bool support
    );
    event ProposalExecuted(uint256 indexed proposalId);

    // INITIALIZATION
    // -------------
    // _governanceToken: Address of deployed token contract
    // _proposalThreshold: Minimum tokens to propose
    // _votingPeriod: Blocks until voting ends
    // _quorumPercentage: Required participation (1-100)
    constructor(
        address _governanceToken,
        uint256 _proposalThreshold,
        uint256 _votingPeriod,
        uint256 _quorumPercentage
    ) {
        governanceToken = ERC20(_governanceToken);
        proposalThreshold = _proposalThreshold;
        votingPeriod = _votingPeriod;
        quorumPercentage = _quorumPercentage;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // CORE FUNCTIONS
    // -------------

    // Proposal Creation
    // ----------------
    // Requires:
    // - Sufficient tokens
    // - Valid description
    // Returns: Unique proposal ID
    function propose(string calldata description) 
        external 
        returns (uint256)
    {
        require(
            governanceToken.balanceOf(msg.sender) >= proposalThreshold,
            "ONEDao: insufficient tokens to propose"
        );

        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.startBlock = block.number;
        proposal.endBlock = block.number + votingPeriod;

        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }

    // Vote Casting
    // -----------
    // Requires:
    // - Active proposal
    // - No previous vote
    // - Voting power (tokens)
    function castVote(uint256 proposalId, bool support) 
        external 
    {
        Proposal storage proposal = proposals[proposalId];
        require(block.number <= proposal.endBlock, "ONEDao: voting is closed");
        require(!proposal.hasVoted[msg.sender], "ONEDao: already voted");
        
        uint256 votes = governanceToken.balanceOf(msg.sender);
        require(votes > 0, "ONEDao: no voting power");

        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }

        emit VoteCast(msg.sender, proposalId, support);
    }

    // Proposal Execution
    // -----------------
    // Requires:
    // - Admin role
    // - Voting ended
    // - Not already executed
    // - Quorum reached
    // - More for votes than against
    function executeProposal(uint256 proposalId) 
        external 
        onlyRole(ADMIN_ROLE)
    {
        Proposal storage proposal = proposals[proposalId];
        require(block.number > proposal.endBlock, "ONEDao: voting still active");
        require(!proposal.executed, "ONEDao: already executed");

        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        uint256 totalSupply = governanceToken.totalSupply();
        
        require(
            (totalVotes * 100) / totalSupply >= quorumPercentage,
            "ONEDao: quorum not reached"
        );
        require(
            proposal.forVotes > proposal.againstVotes,
            "ONEDao: proposal failed"
        );

        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }

    // ADMIN FUNCTIONS
    // --------------
    // Governance parameter management
    // Only callable by admin role
    function setProposalThreshold(uint256 newThreshold) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        proposalThreshold = newThreshold;
    }

    function setVotingPeriod(uint256 newPeriod) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        votingPeriod = newPeriod;
    }

    function setQuorumPercentage(uint256 newPercentage) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(newPercentage <= 100, "ONEDao: invalid percentage");
        quorumPercentage = newPercentage;
    }

    // EMERGENCY CONTROLS
    // ----------------
    // Pause: Stops all state-changing functions
    // Unpause: Resumes normal operation
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
} 