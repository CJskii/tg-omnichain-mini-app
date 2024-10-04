# Telegram Bot & Node Server API

This is the backend server and Telegram bot for the mini-app. The server is built using Node.js and Express, serving as a backend for generating URLs for Web3 transactions and handling them. The Telegram bot is used to facilitate interactions within the mini-app.

## Project Structure

The folder structure for the server and bot looks like this:

```
src/
  ├── bot/               # Telegram bot code
  │   └── index.ts       # Main entry point for the bot
  ├── config/            # Configuration files
  │   ├── bot.ts         # Bot configuration (API tokens, etc.)
  │   └── server.ts      # Server configuration (port, allowed origins, etc.)
  ├── server/            # Node server code
  │   ├── routes/        # API route handlers
  │   │   ├── generate-url/
  │   │   │   ├── approve.ts
  │   │   │   ├── mint.ts
  │   │   │   ├── signature.ts
  │   │   │   └── index.ts
  │   │   ├── transaction/
  │   │   │   ├── approve.ts
  │   │   │   ├── mint.ts
  │   │   │   ├── signature.ts
  │   │   │   └── index.ts
  │   └── index.ts       # Main entry point for the server
  └── utils/             # Utility functions
      ├── transactions/  # Transaction-related utilities
      │   ├── approve.ts
      │   ├── mint.ts
      │   ├── signature.ts
      ├── app-url.ts     # mini-app URL generation utilities
      └── websocket.ts   # WebSocket utilities
```

## API Endpoints

### 1. Generate URL Endpoints

These endpoints are used to generate URLs for Web3 transactions, which can then be used in the Web3 bridge interface to execute those transactions.

#### POST `/api/generate-url/signature`

- **Description**: Generates a URL for a signature transaction.
- **Body Parameters**:
  - `botName` (string): The name of the bot.
  - `uid` (string): Unique identifier for the transaction.
  - `txType` (string): The type of transaction.
- **Response**: Returns the generated URL for the signature transaction.

#### POST `/api/generate-url/mint`

- **Description**: Generates a URL for a minting transaction.
- **Body Parameters**:
  - `botName` (string): The name of the bot.
  - `chainId` (number): The ID of the blockchain network.
  - `address` (string): The contract address.
  - `uid` (string): Unique identifier for the transaction.
  - `txType` (string): The type of transaction.
- **Response**: Returns the generated URL for the minting transaction.

#### POST `/api/generate-url/approve`

- **Description**: Generates a URL for an approve transaction.
- **Body Parameters**:
  - `botName` (string): The name of the bot.
  - `chainId` (number): The ID of the blockchain network.
  - `address` (string): The contract address.
  - `uid` (string): Unique identifier for the transaction.
  - `txType` (string): The type of transaction.
  - `spenderAddress` (string): The address of the spender.
- **Response**: Returns the generated URL for the approve transaction.

### 2. Transaction Endpoints

These endpoints are used to fetch transaction JSON data that will be executed through the Web3 bridge.

#### POST `/api/transaction/mint/:uid`

- **Description**: Fetches the JSON data for a minting transaction.
- **URL Parameters**:
  - `uid` (string): Unique identifier for the transaction.
- **Body Parameters**:
  - `chainId` (number): The ID of the blockchain network.
  - `address` (string): The contract address.
- **Response**: Returns the transaction JSON for minting.

#### POST `/api/transaction/approve/:uid`

- **Description**: Fetches the JSON data for an approve transaction.
- **URL Parameters**:
  - `uid` (string): Unique identifier for the transaction.
- **Body Parameters**:
  - `chainId` (number): The ID of the blockchain network.
  - `address` (string): The contract address.
  - `spenderAddress` (string): The address of the spender.
- **Response**: Returns the transaction JSON for approving.

#### POST `/api/transaction/signature/:uid`

- **Description**: Fetches the JSON data for a signature transaction.
- **URL Parameters**:
  - `uid` (string): Unique identifier for the transaction.
- **Body Parameters**: Depends on the transaction type.
- **Response**: Returns the transaction JSON for signature.

### 3. Other Endpoints

#### POST `/api/transaction-callback`

- **Description**: Receives a callback after a transaction is processed.
- **Body Parameters**:
  - `uid` (string): Unique identifier for the transaction.
  - `status` (string): Status of the transaction.
  - `transactionHash` (string): Hash of the processed transaction.
- **Response**: Acknowledges the callback.

#### POST `/api/test`

- **Description**: A simple test endpoint to check if the server is running.
- **Response**: Returns a "Test route hit" message.

## Telegram Bot

The Telegram bot interacts with the server to facilitate transactions through the mini-app. To set up the bot, you will need an API token from the [BotFather](https://core.telegram.org/bots#botfather). The bot can:

- Provide links to initiate Web3 transactions.
- Listen for interactions and notify users.

## Configuration

The server and bot require specific environment variables for configuration. Add these to your `.env` file:

```
NODE_ENV= # development | production
PORT= # Port to run the server
BRIDGE_URL= # URL of the web3 bridge
NODE_SERVER_URL= # URL of the server

# Telegram bot variables

TELEGRAM_BOT_API_KEY= # Telegram bot API key
TELEGRAM_APP_EXTERNAL_URL= # your mini app's external URL
TELEGRAM_GAME_URL= # generated from BotFather
```

## Getting Started

1. **Install Dependencies**:

   ```
   npm install
   ```

2. **Run the Server**:

   ```
   npm run start:server
   ```

3. **Run the Telegram Bot**:

   ```
   npm run start:bot
   ```

4. **Test the Server**:
   ```
   curl -X POST http://localhost:3001/api/test
   ```

## Additional Information

- The bot and server can be expanded to support more chains and transaction types.
- Ensure to handle errors and validate data when making API requests.
- For security, keep the bot API token and other sensitive information private.

## License

This project is licensed under the MIT License.
