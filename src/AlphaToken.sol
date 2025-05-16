// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";
import "../lib/thrackle-io/forte-rules-engine/src/client/RulesEngineClient.sol";

contract AlphaToken is ERC20, Ownable, RulesEngineClient {
    bytes32 public merkleRoot;
    mapping(address => uint256) public totalClaims;
      // Airdrop window
    uint256 public airdropStartTime;
    uint256 public airdropEndTime;
    

    event MerkleRootUpdated(bytes32 newRoot);
    event TokensClaimed(address indexed account, uint256 amount);

    constructor() ERC20("Alpha Token", "ALPHA") Ownable(msg.sender) {}

    function updateMerkleRoot(bytes32 _newRoot) external onlyOwner {
        merkleRoot = _newRoot;
        emit MerkleRootUpdated(_newRoot);
    }

    function claim(uint256 amount, bytes32[] calldata merkleProof) external {
        _invokeRulesEngine(abi.encodeWithSelector(msg.sig, block.timestamp, airdropStartTime, airdropStartTime));

        uint256 totalClaimed = totalClaims[msg.sender] += amount;

        bytes32 node = keccak256(abi.encodePacked(msg.sender, totalClaimed));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid proof");


        _mint(msg.sender, amount);

        emit TokensClaimed(msg.sender, amount);
    }

   
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        _invokeRulesEngine(abi.encodeWithSelector(msg.sig, msg.sender, to, value));
        // Add any transfer validation logic here
        return super.transfer(to, amount);
    }

    function setAirdropWindow(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(_endTime > _startTime, "End time must be after start time");
        airdropStartTime = _startTime;
        airdropEndTime = _endTime;
        emit AirdropWindowSet(_startTime, _endTime);
    }
}
