// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract I1Value is ERC20, Ownable, ReentrancyGuard {
    // Value types
    enum ValueType { KNOWLEDGE, EDUCATION, TECHNOLOGY, INFERENCE, TOKEN }
    
    // Exchange event
    event ValueExchanged(
        address indexed from,
        address indexed to,
        ValueType valueType,
        uint256 amount,
        string metadata
    );

    // Capability verification
    event CapabilityVerified(
        address indexed provider,
        ValueType valueType,
        uint256 timestamp
    );

    // Value pools for each type
    mapping(ValueType => uint256) public valuePools;
    
    // Provider capabilities
    mapping(address => mapping(ValueType => bool)) public capabilities;
    
    // Provider reputation
    mapping(address => uint256) public reputation;

    // Access control
    mapping(ValueType => uint256) public accessCosts;
    mapping(address => mapping(ValueType => uint256)) public accessRights;

    constructor() ERC20("I1 Value", "I1") {
        // Initialize value pools
        valuePools[ValueType.KNOWLEDGE] = 1000000 * 10**decimals();
        valuePools[ValueType.EDUCATION] = 1000000 * 10**decimals();
        valuePools[ValueType.TECHNOLOGY] = 1000000 * 10**decimals();
        valuePools[ValueType.INFERENCE] = 1000000 * 10**decimals();
        
        // Set initial access costs
        accessCosts[ValueType.KNOWLEDGE] = 100 * 10**decimals();
        accessCosts[ValueType.EDUCATION] = 200 * 10**decimals();
        accessCosts[ValueType.TECHNOLOGY] = 500 * 10**decimals();
        accessCosts[ValueType.INFERENCE] = 1000 * 10**decimals();
    }

    // Exchange value between members
    function exchangeValue(
        address to,
        ValueType valueType,
        uint256 amount,
        string memory metadata
    ) external nonReentrant {
        require(capabilities[msg.sender][valueType], "Provider not verified");
        require(accessRights[to][valueType] > 0, "Consumer lacks access rights");
        
        // Calculate fees and rewards
        uint256 fee = calculateFee(amount);
        uint256 reward = calculateReward(amount, msg.sender);
        
        // Transfer value
        _transfer(msg.sender, to, amount - fee);
        _transfer(msg.sender, address(this), fee);
        _mint(msg.sender, reward);
        
        // Update reputation
        reputation[msg.sender] += reward;
        
        emit ValueExchanged(msg.sender, to, valueType, amount, metadata);
    }

    // Purchase access rights
    function purchaseAccess(ValueType valueType) external payable {
        require(msg.value >= accessCosts[valueType], "Insufficient payment");
        accessRights[msg.sender][valueType] = block.timestamp + 30 days;
    }

    // Verify provider capabilities
    function verifyCapability(
        address provider,
        ValueType valueType
    ) external onlyOwner {
        capabilities[provider][valueType] = true;
        emit CapabilityVerified(provider, valueType, block.timestamp);
    }

    // Internal calculations
    function calculateFee(uint256 amount) internal pure returns (uint256) {
        return amount * 2 / 100; // 2% fee
    }

    function calculateReward(
        uint256 amount,
        address provider
    ) internal view returns (uint256) {
        uint256 baseReward = amount * 5 / 100; // 5% base reward
        uint256 reputationBonus = reputation[provider] / 1000; // 0.1% per 1000 reputation
        return baseReward + reputationBonus;
    }

    // Governance functions
    function updateAccessCost(
        ValueType valueType,
        uint256 newCost
    ) external onlyOwner {
        accessCosts[valueType] = newCost;
    }

    function addValueToPool(
        ValueType valueType,
        uint256 amount
    ) external onlyOwner {
        valuePools[valueType] += amount;
    }

    // View functions
    function getProviderStats(
        address provider
    ) external view returns (
        uint256 rep,
        bool[] memory caps
    ) {
        rep = reputation[provider];
        caps = new bool[](5);
        for (uint i = 0; i < 5; i++) {
            caps[i] = capabilities[provider][ValueType(i)];
        }
        return (rep, caps);
    }
} 