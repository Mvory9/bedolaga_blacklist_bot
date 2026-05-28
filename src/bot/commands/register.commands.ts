import { Bot, Context } from "grammy";

export async function registerBotCommands(bot: Bot<Context>) {
    await bot.api.setMyCommands([
        { command: "start", description: "Как пользоваться ботом" },
        { command: "help", description: "Справка по проверке blacklist" },
    ]);
}
