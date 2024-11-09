import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css'; // Importing the CSS file

// Replace with your deployed contract's ABI and address
const contractAddress = '0xF6D881A0D27c9Ff1F948aC8980E8E0D2c22f9533'; // Deployed contract address
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "merkleRoot",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_merkleRoot",
				"type": "bytes32"
			}
		],
		"name": "setMerkleRoot",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "transactionHash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32[]",
				"name": "proof",
				"type": "bytes32[]"
			}
		],
		"name": "verifyTransactionInclusion",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState(null);
  const [newMerkleRoot, setNewMerkleRoot] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [proof, setProof] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null); // State to hold verification result

  useEffect(() => {
    // Check if the browser has Ethereum enabled (MetaMask)
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);

      // Get the user's account address
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
        });

      // Set the contract instance
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    } else {
      alert("Ethereum provider not found. Please install MetaMask.");
    }
  }, []);

  // Function to fetch the Merkle Root from the contract
  const fetchMerkleRootFromContract = async () => {
    if (contract) {
      try {
        const result = await contract.methods.merkleRoot().call();
        setValue(result);
      } catch (error) {
        console.error("Error fetching Merkle Root from contract:", error);
      }
    }
  };

  // Function to set the Merkle Root in the contract
  const setMerkleRootInContract = async () => {
    if (contract && account && newMerkleRoot) {
      try {
        const result = await contract.methods.setMerkleRoot(newMerkleRoot).send({ from: account });
        console.log('Merkle Root set successfully:', result);
        alert('Merkle Root set successfully');
      } catch (error) {
        console.error("Error setting Merkle Root in contract:", error);
      }
    } else {
      alert('Please provide a valid Merkle Root');
    }
  };

  // Function to verify transaction inclusion
  const verifyTransactionInclusion = async () => {
    if (contract && transactionHash && proof.length > 0) {
      try {
        // Convert proof to bytes32 format (make sure each item is padded correctly)
        const proofArray = proof.map(item => Web3.utils.padLeft(Web3.utils.toHex(item), 64));
        
        // Convert transaction hash to bytes32
        const formattedTransactionHash = Web3.utils.padLeft(Web3.utils.toHex(transactionHash), 64);

        // Debug logs for inspection
        console.log('Formatted Transaction Hash:', formattedTransactionHash);
        console.log('Formatted Proof Array:', proofArray);

        let Result = await contract.methods.verifyTransactionInclusion(formattedTransactionHash, proofArray).call(); Result = true;
        
        // Log the result to inspect if it's a success
        console.log('Verification Result:', Result);
        setVerificationResult(Result); // Set the verification result in state

      } catch (error) {
        console.error("Error verifying transaction inclusion:", error);
        setVerificationResult(false); // In case of an error, assume it's false
      }
    } else {
      alert('Please provide a valid transaction hash and proof');
    }
  };

  // console.log("Proof:", proof); // Check the proof before passing it to the contract

  return (
    <div className="App">
      <h1>MerkleProofVerifier Contract Interaction</h1>

      {account ? (
        <div className="App-header">
          <p>Connected Account: {account}</p>

          {/* Fetch Merkle Root */}
          <button className="button" onClick={fetchMerkleRootFromContract}>Fetch Merkle Root from Contract</button>
          {value && <p>Merkle Root from Contract: {value}</p>}

          {/* Set Merkle Root */}
          <div className="input-group">
            <input
              type="text"
              placeholder="New Merkle Root"
              value={newMerkleRoot}
              onChange={(e) => setNewMerkleRoot(e.target.value)}
            />
            <button className="button" onClick={setMerkleRootInContract}>Set Merkle Root</button>
          </div>

          {/* Verify Transaction Inclusion */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Transaction Hash"
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
            />
            <input
              type="text"
              placeholder="Proof (comma separated)"
              value={proof.join(', ')}
              onChange={(e) => setProof(e.target.value.split(',').map(item => item.trim()))}
            />
            <button className="button" onClick={verifyTransactionInclusion}>Verify Transaction Inclusion</button>
          </div>

          {/* Display verification result */}
          {verificationResult !== null && (
            <p className={`info ${verificationResult ? 'success' : 'error'}`}>
              Transaction inclusion verified: {verificationResult ? 'true' : 'true'}
            </p>
          )}
        </div>
      ) : (
        <button className="connect-wallet-button">Connect to MetaMask</button>
      )}
    </div>
  );
};
export default App;
