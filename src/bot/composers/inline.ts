import { Composer, Context } from "grammy";
import checkInline from "../inline/check";
import selfInline from "../inline/self";
import { isInBlacklist } from "../../services/blacklist.service";
import {
    formatSelfCheckHtml,
    noLinkPreview,
    selfCheckButtonMarkup,
} from "../../utils/blacklist-message.util";

function isMessageNotModifiedError(e: unknown) {
    const errText = e instanceof Error ? e.message : String(e);
    return errText.includes("message is not modified") || errText.includes("MESSAGE_NOT_MODIFIED");
}

export function inlineComposer(): Composer<Context> {
    const composer = new Composer<Context>();

    composer.on("inline_query", async (ctx) => {
        const query = (ctx.inlineQuery.query || "").trim();

        if (query === "") {
            await selfInline(ctx);
        } else if (/^\d+$/.test(query)) {
            await checkInline(ctx);
        } else {
            await ctx.answerInlineQuery([], { cache_time: 0, is_personal: true });
        }
    });

    composer.callbackQuery("self_check", async (ctx) => {
        const from = ctx.from;
        if (!from) return;

        let inList = false;
        let errorText: string | null = null;

        try {
            inList = await isInBlacklist(from.id);
        } catch (e) {
            errorText = e instanceof Error ? e.message : "unknown error";
        }

        const text = formatSelfCheckHtml(from, inList, errorText);

        try {
            if (ctx.callbackQuery?.inline_message_id) {
                await ctx.api.editMessageTextInline(ctx.callbackQuery.inline_message_id, text, {
                    parse_mode: "HTML",
                    reply_markup: selfCheckButtonMarkup,
                    ...noLinkPreview,
                });
            } else {
                await ctx.editMessageText(text, {
                    parse_mode: "HTML",
                    reply_markup: selfCheckButtonMarkup,
                    ...noLinkPreview,
                });
            }
        } catch (e) {
            if (!isMessageNotModifiedError(e)) throw e;
        }

        await ctx.answerCallbackQuery();
    });

    return composer;
}
