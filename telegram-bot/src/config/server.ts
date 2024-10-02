const ENVIRONMENT = process.env.NODE_ENV || "development";

interface serverConfigType {
  [key: string]: {
    allowedOrigins: string[];
    port: number | string;
    callbackBaseUrl: string;
    sourceBaseUrl: string;
    frontendBaseUrl: string;
  };
}

const config: serverConfigType = {
  development: {
    allowedOrigins: [
      "http://localhost:3000",
      "https://omni.loca.lt",
      "http://localhost:5173",
      "https://rttwhwmrbr.eu.loclx.io",
    ],
    port: 3001,
    callbackBaseUrl: "http://localhost:3001", // callback server URL
    sourceBaseUrl: "http://localhost:3001", // tx source json server URL
    frontendBaseUrl: "http://localhost:5173", // web3 bridge frontend URL
  },
  production: {
    allowedOrigins: ["web3 bridge frontend URL"],
    port: process.env.PORT || 3001,
    callbackBaseUrl: "https://your-production-domain.com", // callback server URL
    sourceBaseUrl: "https://your-production-domain.com", // tx source json server URL
    frontendBaseUrl: "https://your-frontend-domain.com", // web3 bridge frontend URL
  },
};

const serverConfig = config[ENVIRONMENT];
export { serverConfig };
