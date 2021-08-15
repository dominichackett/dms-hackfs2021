export const DMS_CONTRACT = '0x52b48Dc7B0D7C5897116E9d8c7157e6335Fd28Ae';
export const DMS_ABI =[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "l",
        "type": "uint256"
      }
    ],
    "name": "ArrayLength",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkFulfilled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "vault",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "checkInInterval",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dateEmitted",
        "type": "uint256"
      }
    ],
    "name": "CheckVaultAtInterval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "vault",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "trustee",
        "type": "string"
      }
    ],
    "name": "NewTrustee",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "trustees",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "vault",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "keys",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "checkInInterval",
        "type": "uint256"
      }
    ],
    "name": "createVault",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vault",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "trustee",
        "type": "string"
      }
    ],
    "name": "getVaultKey",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_requestId",
        "type": "bytes32"
      }
    ],
    "name": "fulfill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawLink",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];