import { Bot, Context } from "grammy";
import Config from "../config";
import { registerBotCommands } from "./commands/register.commands";
import { commandsComposer } from "./composers/commands";
import { inlineComposer } from "./composers/inline";

export const bot: Bot<Context> = new Bot<Context>(Config.TELEGRAM_BOT_TOKEN);

export async function createBot() {
    const bot = new Bot<Context>(Config.TELEGRAM_BOT_TOKEN);

    bot.use(commandsComposer());
    bot.use(inlineComposer());

    bot.start({
        onStart: async (botInfo) => {
            await registerBotCommands(bot);
            console.log(`Бот @${botInfo.username} запущен!`);
        },
    });

    // Обработчик ошибок без краша
    bot.catch((err) => {
        console.error(err);
    });
}