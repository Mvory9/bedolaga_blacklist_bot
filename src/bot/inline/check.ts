import { Context } from "grammy";
import { InlineQueryResultArticle } from "grammy/types";
import { isInBlacklist } from "../../services/blacklist.service";
import { escapeHtml } from "../../utils/escape-html.util";

export default async function checkInline(context: Context) {
    if (!context.from || !context.inlineQuery) return;

    const query = (context.inlineQuery.query || "").trim();
    if (!/^\d+$/.test(query)) {
        await context.answerInlineQuery([], { cache_time: 0, is_personal: true });
        return;
    }

    let isBlacklisted = false;
    let errorText: string | null = null;

    try {
        isBlacklisted = await isInBlacklist(query);
    } catch (e) {
        errorText = e instanceof Error ? e.message : "unknown error";
    }

    const results: InlineQueryResultArticle[] = [
        {
            type: "article",
            id: "check_" + Date.now(),
            title: `🔎 Проверка ID: ${query}`,
            description: errorText
                ? `⚠️ Ошибка загрузки списка`
                : isBlacklisted
                  ? `🚫 В blacklist`
                  : `✅ Не в blacklist`,
            input_message_content: {
                message_text: errorText
                    ? `⚠️ Не удалось проверить ID: ${query}\n\nПричина: ${errorText}`
                    : isBlacklisted
                      ? `🚫 <b>ID:</b> <code>${escapeHtml(query)}</code>\n<b>Статус:</b> <b>В BLACKLIST</b>`
                      : `✅ <b>ID:</b> <code>${escapeHtml(query)}</code>\n<b>Статус:</b> <b>Не найден в blacklist</b>`,
                ...(errorText ? {} : { parse_mode: "HTML" as const }),
            },
            reply_markup: {
                inline_keyboard: [[{ text: "👤 Проверить себя", callback_data: "self_check" }]],
            },
        },
    ];

    await context.answerInlineQuery(results, {
        cache_time: 0,
        is_personal: true,
    });
}