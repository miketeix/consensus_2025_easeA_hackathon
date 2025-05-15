// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";

contract AlphaToken is ERC20, Ownable {
    bytes32 public merkleRoot;
    mapping(address => uint256) public totalClaims;

    event MerkleRootUpdated(bytes32 newRoot);
    event TokensClaimed(address indexed account, uint256 amount);

    constructor() ERC20("Alpha Token", "ALPHA") Ownable(msg.sender) {}

    function updateMerkleRoot(bytes32 _newRoot) external onlyOwner {
        merkleRoot = _newRoot;
        emit MerkleRootUpdated(_newRoot);
    }

    function claim(uint256 amount, bytes32[] calldata merkleProof) external {
        uint256 totalClaimed = totalClaims[msg.sender] += amount;

        bytes32 node = keccak256(abi.encodePacked(msg.sender, totalClaimed));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid proof");

        _mint(msg.sender, amount);

        emit TokensClaimed(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        // Add any transfer validation logic here
        return super.transfer(to, amount);
    }
}
