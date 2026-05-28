import { Context } from "grammy";
import { helpMessageHtml } from "./help-message.util";

export async function helpCommand(ctx: Context) {
    await ctx.reply(helpMessageHtml(ctx.me.username), { parse_mode: "HTML" });
}
