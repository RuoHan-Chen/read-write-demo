# Read-Write Demo

A Web3 dApp built with Next.js and Viem that allows users to read and write messages to a smart contract on the Sepolia testnet.

## Features

- 🔗 **Wallet Connection**: Connect with MetaMask or other Web3 wallets
- 📖 **Read Messages**: Read current message from the smart contract
- ✍️ **Write Messages**: Update the message in the smart contract (requires wallet connection)
- 🌐 **Sepolia Network**: Deployed on Sepolia testnet
- 💫 **Modern UI**: Clean, responsive design with dark mode support

## Smart Contract

The dApp interacts with a simple `StringStore` contract that has two functions:
- `getMessage()`: Returns the current stored message (view function)
- `setMessage(string)`: Updates the stored message (write function)

**Contract Address**: `0x8407Ea3A24f3756A1dC8B6aAaD9Cc4ED4557F30B`  
**Network**: Sepolia Testnet

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Web3 wallet (MetaMask recommended)
- Sepolia testnet ETH for gas fees

### Installation

1. Clone the repository:
```bash
git clone git@github.com:RuoHan-Chen/read-write-demo.git
cd read-write-demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file and add your Infura API key:
```bash
NEXT_PUBLIC_RPC=your_infura_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask or other Web3 wallet
2. **Read Message**: Click "Read Message" to fetch the current message from the contract
3. **Write Message**: Enter a new message and click "Write Message" to update the contract (requires wallet connection)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Web3**: Viem for Ethereum interactions
- **Styling**: Tailwind CSS
- **Network**: Sepolia testnet via Infura

## Development

The project uses:
- `viem` for Ethereum interactions and wallet connection
- `Next.js` for the React framework
- `TypeScript` for type safety

## License

MIT License
