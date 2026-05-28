import { Bot, Context } from "grammy";
import Config from "../config";
import { inlineComposer } from "./composers/inline";

export const bot: Bot<Context> = new Bot<Context>(Config.TELEGRAM_BOT_TOKEN);

export async function createBot() {
    const bot = new Bot<Context>(Config.TELEGRAM_BOT_TOKEN);

    // Композиторы
    bot.use(inlineComposer());

    // Старт
    bot.start({
        onStart: (botInfo) => {
            console.log(`Бот @${botInfo.username} запущен!`);
        }
    });

    // Обработчик ошибок без краша
    bot.catch((err) => {
        console.error(err);
    });
}