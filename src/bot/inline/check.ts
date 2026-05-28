import { Context } from "grammy";
import { InlineQueryResultArticle } from "grammy/types";
import { isInBlacklist } from "../../services/blacklist.service";
import {
    formatIdCheckHtml,
    inlineResultDescription,
    noLinkPreview,
} from "../../utils/blacklist-message.util";

export default async function checkInline(context: Context) {
    if (!context.from || !context.inlineQuery) return;

    const query = (context.inlineQuery.query || "").trim();

    let isBlacklisted = false;
    let errorText: string | null = null;

    try {
        isBlacklisted = await isInBlacklist(query);
    } catch (e) {
        errorText = e instanceof Error ? e.message : "unknown error";
    }

    const messageText = formatIdCheckHtml(query, isBlacklisted, errorText);

    const results: InlineQueryResultArticle[] = [
        {
            type: "article",
            id: "check_" + Date.now(),
            title: `🔎 Проверка ID: ${query}`,
            description: inlineResultDescription(
                errorText
                    ? "⚠️ Ошибка загрузки списка"
                    : isBlacklisted
                      ? "🚫 В blacklist"
                      : "✅ Не в blacklist",
            ),
            input_message_content: {
                message_text: messageText,
                parse_mode: "HTML",
                ...noLinkPreview,
            },
        },
    ];

    await context.answerInlineQuery(results, {
        cache_time: 0,
        is_personal: true,
    });
}
