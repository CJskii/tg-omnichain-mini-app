const ENVIRONMENT = process.env.NODE_ENV || "development";

interface serverConfigType {
  [key: string]: {
    allowedOrigins: string[];
    port: number | string;
    callbackBaseUrl: string;
    sourceBaseUrl: string;
    web3BridgeBaseUrl: string;
  };
}

const config: serverConfigType = {
  development: {
    allowedOrigins: [
      "http://localhost:3000",
      "https://omni.loca.lt",
      "http://localhost:3002",
      "https://cowbird-fun-ostrich.ngrok-free.app",
    ],
    port: 3001,
    callbackBaseUrl: "http://localhost:3001", // callback server URL
    sourceBaseUrl: "http://localhost:3001", // tx source json server URL
    web3BridgeBaseUrl: "http://localhost:3002", // web3 bridge frontend URL
  },
  production: {
    allowedOrigins: [process.env.TELEGRAM_APP_EXTERNAL_URL || ""],
    port: process.env.PORT || 3001,
    callbackBaseUrl: process.env.NODE_SERVER_URL, // callback server URL
    sourceBaseUrl: process.env.NODE_SERVER_URL, // tx source json server URL
    web3BridgeBaseUrl: process.env.BRIDGE_URL, // web3 bridge frontend URL
  },
};

const serverConfig = config[ENVIRONMENT];
export { serverConfig };
