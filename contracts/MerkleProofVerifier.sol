// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MerkleProofVerifier {
    address public owner;
    bytes32 public merkleRoot;

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can set the Merkle root.");
        _;
    }

    // Constructor to set the owner of the contract
    constructor() {
        owner = msg.sender; // Set the owner to the address deploying the contract
    }

    // Function to set the Merkle root (only accessible by the owner)
    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    // Function to verify a transaction's inclusion in the Merkle tree using the Merkle proof
    function verifyTransactionInclusion(
        bytes32 transactionHash,
        bytes32[] calldata proof
    ) public view returns (bool) {
        bytes32 computedHash = transactionHash;

        // Rebuild the hash from the proof
        for (uint256 i = 0; i < proof.length; i++) {
            // Ensure the smaller hash comes first when combining hashes
            if (computedHash < proof[i]) {
                computedHash = keccak256(abi.encodePacked(computedHash, proof[i]));
            } else {
                computedHash = keccak256(abi.encodePacked(proof[i], computedHash));
            }
        }

        // If the computed hash equals the Merkle root, the transaction is part of the tree
        return computedHash == merkleRoot;
    }
}
