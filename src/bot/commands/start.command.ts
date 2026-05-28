import { Context } from "grammy";
import { helpMessageHtml } from "./help-message.util";

export async function startCommand(ctx: Context) {
    await ctx.reply(helpMessageHtml(ctx.me.username), { parse_mode: "HTML" });
}
