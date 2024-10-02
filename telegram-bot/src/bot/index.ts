import { Bot, InlineKeyboard } from "grammy";
import "dotenv/config";
import { constructUrl } from "../utils/app-url";
import { botConfig } from "../config/bot";

const TELEGRAM_BOT_TOKEN = botConfig.TELEGRAM_BOT_TOKEN;
const GAME_NAME = botConfig.APP_NAME;

const bot = new Bot(TELEGRAM_BOT_TOKEN || "");

const setBotCommands = async () => {
  await bot.api.setMyCommands([
    { command: "start", description: "Start the bot and get information" },
    { command: "help", description: "Get help and information" },
    { command: "info", description: "Information about the bot" },
    { command: "app", description: "Launch mini-app" },
  ]);
};

bot.command("start", async (ctx) => {
  await ctx.reply(
    `Welcome to the Omnichain bot! 🎮\nUse the button below to start the /app or check /help for more options.`,
    {
      reply_markup: new InlineKeyboard().webApp(
        `🚀 Start ${GAME_NAME}`,
        constructUrl({
          botName: "OmniTransferBot",
          uid: ctx.chat?.id.toString(),
        })
      ),
    }
  );
});

bot.command("app", async (ctx) => {
  return ctx.reply("Click on the button to launch", {
    reply_markup: new InlineKeyboard().webApp(
      `🚀 Start ${GAME_NAME}`,
      constructUrl({ botName: "OmniTransferBot", uid: ctx.chat?.id.toString() })
    ),
  });
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    "Here are the commands you can use:\n" +
      "/start - Start the bot and get information\n" +
      "/info - Information about this bot\n" +
      "/app - Launch the NFT minting application\n"
  );
});

bot.command("info", async (ctx) => {
  await ctx.reply(
    `This bot is a cross-chain NFT minting application.\n` +
      `Launch the app to start minting NFTs.`,
    {
      reply_markup: new InlineKeyboard().webApp(
        `🚀 Start ${GAME_NAME}`,
        constructUrl({
          botName: "OmniTransferBot",
          uid: ctx.chat?.id.toString(),
        })
      ),
    }
  );
});

// Callback query for inline game button
// bot.on("callback_query:game_short_name", async (ctx) => {
//   await ctx.answerCallbackQuery({ url: EXTERNAL_URL });

//   console.log("Callback function called");
// });

const startBot = async () => {
  try {
    await setBotCommands();
    console.log("Bot commands set!");

    bot.start();
    console.log("Bot started!");

    console.log(constructUrl({ botName: GAME_NAME, uid: "123" }));
  } catch (error) {
    console.error("Error starting bot:", error);
  }
};

startBot();
