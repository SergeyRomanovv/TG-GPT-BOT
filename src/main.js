import config from "config";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { ogg } from "./service/ogg.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));

bot.on(message("text"), async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

bot.on(message("voice"), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = String(ctx.message.from.id);
    console.log("userId", userId);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);
    await ctx.reply(mp3Path, userId);
  } catch (error) {
    console.log("ERROR while voice message", error.message);
  }
});

bot.command("start", async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
