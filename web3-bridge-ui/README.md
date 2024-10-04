# Web3 EVM Bridge

The Web3 EVM Bridge is a Next.js application that facilitates the signing and execution of Ethereum Virtual Machine (EVM) transactions. The application is designed to parse transaction data from URLs, validate JSON structures, and enable users to interact with their wallets on various networks.

## Features

- **Transaction Parsing**: Extracts and structures transaction JSON data from URLs for user interaction.
- **EVM Wallet Integration**: Supports different EVM wallets for signing transactions.
- **Network Compatibility**: Supports multiple EVM-compatible networks.
- **JSON Validation**: Utilizes Zod schema for robust JSON validation to ensure transaction data integrity.
- **Zod Schema Validation**: Validates incoming transaction JSON using Zod to prevent malformed data.
- **Modular UI**: Uses Radix UI and other component libraries for a flexible and dynamic interface.
- **Dark Mode Support**: Built with `next-themes` for dark and light theme toggling.
- **React Query Integration**: For efficient data fetching and caching.
- **Websocket**: Communicate status of the transactions to backend server

## Getting Started

### Prerequisites

- Node.js >= 14.x.x
- NPM >= 6.x.x
- EVM wallet (such as MetaMask) for interaction

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd web3-evm-bridge
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Development

To start the development server, use:

```bash
npm run dev
```

### Build for Production

To build the project for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Project Structure

- **JSON Validation**: This app uses Zod schemas to validate incoming JSON transaction data, ensuring correct data formats and avoiding potential errors during transaction processing.
- **Zod Schema Validation**: Zod is used extensively to validate and enforce the structure of the transaction JSON data, providing a layer of safety before interacting with the blockchain.

## Dependencies

- **Ethers**: Provides a complete and robust library for interacting with the Ethereum blockchain.
- **RainbowKit**: Wallet connection kit to integrate with various EVM-compatible wallets.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Wagmi**: React Hooks for Ethereum.
- **Next.js**: A React framework for building production-grade applications.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

## Usage

1. The bridge listens for incoming transaction URLs.
2. Extracts and validates the JSON structure using Zod schemas.
3. Allows users to interact with their connected EVM wallets to sign and execute transactions.
4. Supports both mainnet and testnet networks.

## Scripts

- `dev`: Starts the Next.js development server.
- `build`: Compiles the application for production.
- `start`: Runs the compiled application in production mode.

## Future Enhancements

- Support for additional EVM networks.
- Enhanced transaction feedback and status updates.
- Improved UI components with more customization.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact

For further information or questions, please contact the repository owner.
