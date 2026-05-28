import { Context } from "grammy";
import { InlineQueryResultArticle } from "grammy/types";
import { isInBlacklist } from "../../services/blacklist.service";
import {
    formatSelfCheckHtml,
    noLinkPreview,
    selfCheckButtonMarkup,
} from "../../utils/blacklist-message.util";

export default async function selfInline(context: Context) {
    if (!context.from || !context.inlineQuery) return;

    let inList = false;
    let errorText: string | null = null;

    try {
        inList = await isInBlacklist(context.from.id);
    } catch (e) {
        errorText = e instanceof Error ? e.message : "unknown error";
    }

    const messageText = formatSelfCheckHtml(context.from, inList, errorText);

    const results: InlineQueryResultArticle[] = [
        {
            type: "article",
            id: "self_" + Date.now(),
            title: "👤 Проверить себя",
            description: errorText
                ? "⚠️ Ошибка загрузки списка"
                : inList
                  ? "🚫 В blacklist"
                  : "✅ Не в blacklist",
            input_message_content: {
                message_text: messageText,
                parse_mode: "HTML",
                ...noLinkPreview,
            },
            reply_markup: selfCheckButtonMarkup,
        },
    ];

    await context.answerInlineQuery(results, {
        cache_time: 0,
        is_personal: true,
    });
}
