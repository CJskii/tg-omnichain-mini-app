const ENVIRONMENT = process.env.NODE_ENV || "development";

interface botConfigType {
  [key: string]: {
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_APP_EXTERNAL_URL: string;
    TELEGRAM_APP_INTERNAL_URL: string;
    APP_NAME: string;
  };
}

const config: botConfigType = {
  development: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_API_KEY,
    TELEGRAM_APP_EXTERNAL_URL: process.env.TELEGRAM_APP_EXTERNAL_URL,
    TELEGRAM_APP_INTERNAL_URL: "https://t.me/OmniTransferBot",
    APP_NAME: "minter",
  },
  production: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_API_KEY,
    TELEGRAM_APP_EXTERNAL_URL: process.env.TELEGRAM_APP_EXTERNAL_URL,
    TELEGRAM_APP_INTERNAL_URL: "https://t.me/OmniTransferBot",
    APP_NAME: "minter",
  },
};

const botConfig = config[ENVIRONMENT];
export { botConfig };
