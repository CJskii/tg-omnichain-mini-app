# Mini-App

This is the frontend component of the Telegram Omnichain Mini-App, built using Next.js. The mini-app provides a user interface for interacting with various blockchain functionalities such as connecting an EVM wallet, minting NFTs, and performing various transactions.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Usage](#usage)
- [Folder Structure](#folder-structure)

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tg-omnichain-mini-app.git
   ```
2. **Navigate to the `mini-app` directory:**
   ```bash
   cd tg-omnichain-mini-app/mini-app
   ```
3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

To start the development server, use:

```bash
npm run dev
# or
yarn dev
```

This command will run the app on [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Scripts

- **`dev`**: Runs the app in development mode.
- **`dev:https`**: Runs the app in development mode with HTTPS enabled.
- **`build`**: Builds the app for production.
- **`start`**: Starts the production server.
- **`lint`**: Runs the linter.

## Dependencies

Here are the main dependencies used in the project:

- **[@telegram-apps/sdk-react](https://www.npmjs.com/package/@telegram-apps/sdk-react)**: SDK for integrating Telegram mini-apps into React.
- **[@telegram-apps/telegram-ui](https://www.npmjs.com/package/@telegram-apps/telegram-ui)**: Provides UI components for the Telegram mini-apps.
- **[@tonconnect/ui-react](https://www.npmjs.com/package/@tonconnect/ui-react)**: UI components for TON blockchain connectivity.
- **[next](https://www.npmjs.com/package/next)**: React framework for building server-rendered applications.
- **[react-icons](https://www.npmjs.com/package/react-icons)**: Provides popular icons as React components.
- **[tailwindcss](https://www.npmjs.com/package/tailwindcss)**: Utility-first CSS framework for styling the application.

### Dev Dependencies

- **[@types/node](https://www.npmjs.com/package/@types/node)**: TypeScript definitions for Node.js.
- **[@types/react](https://www.npmjs.com/package/@types/react)**: TypeScript definitions for React.
- **[eslint](https://www.npmjs.com/package/eslint)**: Tool for identifying and fixing problems in JavaScript code.
- **[tailwindcss](https://www.npmjs.com/package/tailwindcss)**: A utility-first CSS framework for custom designs.

## Environment Variables

- **`.env.local`**: Environment-specific variables for local development.

Make sure to set up the necessary environment variables in a `.env.local` file for proper integration with the Telegram SDK and blockchain APIs.

## Features

- **EVM Wallet Connection**: Connects users' Ethereum Virtual Machine wallets using Web3 Bridge.
- **Approve Transaction**: Allow user to approve token spending through smart contract.
- **Minting NFTs**: Enables users to mint NFTs directly through the mini-app.
- **Bridging NFTs**: Enables users to bridge minted NFTs through the mini-app
- **UI Components**: Utilizes `@telegram-apps/telegram-ui` for a consistent user interface.
- **Responsive Design**: Built with Tailwind CSS for a responsive and mobile-friendly interface.

## Usage

- The application is integrated with the Telegram SDK to provide an enhanced user experience within the Telegram app environment.
- Components from `@telegram-apps/telegram-ui` are used to build a consistent and familiar interface for users interacting with blockchain functionalities.

## Folder Structure

- **`/pages`**: Next.js pages for routing.
- **`/components`**: Reusable UI components.
- **`/_assets`**: Static assets like images and SVGs.
- **`/styles`**: Global and component-specific styles using Tailwind CSS.

## Notes

- The application is built using Next.js 14.2.4, React 18, and TypeScript.
- Tailwind CSS is used for styling to allow rapid UI development with utility classes.
