import { Bot, InlineKeyboard } from "grammy";
import "dotenv/config";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_API_KEY;
const EXTERNAL_GAME_URL = process.env.GAME_URL;
const GAME_NAME = "minter";

const bot = new Bot(TELEGRAM_BOT_TOKEN || "");

const gameKeyboard = new InlineKeyboard().game(`Start ${GAME_NAME}`);

const setBotCommands = async () => {
  await bot.api.setMyCommands([
    { command: "start", description: "Start the bot and get information" },
    { command: "help", description: "Get help and information" },
    { command: "info", description: "Information about the bot" },
    { command: "game", description: "Start the game" },
  ]);
};

bot.command("start", async (ctx) => {
  await ctx.reply(
    `Welcome to the Omnichain bot! 🎮\nUse the /game command to start playing or check /help for more options.`
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    "Here are the commands you can use:\n" +
      "/start - Start the bot and get information\n" +
      "/info - Information about this bot\n" +
      "/game - Play the game"
  );
});

bot.command("info", async (ctx) => {
  await ctx.reply(
    `This bot is a cross-chain NFT aggregator application.\n` +
      `Play the game: [${GAME_NAME}](${EXTERNAL_GAME_URL}).`
  );
});

bot.command("game", async (ctx) => {
  await ctx.replyWithGame(GAME_NAME, {
    reply_markup: gameKeyboard,
  });
});

// Callback query for inline game button
bot.on("callback_query:game_short_name", async (ctx) => {
  await ctx.answerCallbackQuery({ url: EXTERNAL_GAME_URL });
});

const startBot = async () => {
  try {
    await setBotCommands();
    console.log("Bot commands set!");

    bot.start();
    console.log("Bot started!");
  } catch (error) {
    console.error("Error starting bot:", error);
  }
};

startBot();
