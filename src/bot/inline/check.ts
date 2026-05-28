import { Context } from "grammy";
import { InlineQueryResultArticle } from "grammy/types";

const BLACKLIST_URL =
    "https://raw.githubusercontent.com/Blin4ickUSE/ban-vpn/refs/heads/main/blacklist.txt";

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
        const res = await fetch(BLACKLIST_URL, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const text = await res.text();
        const set = new Set(
            text
                .split(/\r?\n/)
                .map((line) => (line.split("#")[0] ?? "").trim())
                .map((line) => {
                    const m = line.match(/^\d+$/);
                    return m ? m[0] : "";
                })
                .filter(Boolean)
        );

        isBlacklisted = set.has(query);
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
                      ? `🚫 ID: ${query}\nСтатус: *В BLACKLIST*`
                      : `✅ ID: ${query}\nСтатус: *Не найден в blacklist*`,
                ...(errorText ? {} : { parse_mode: "Markdown" as const }),
            },
        },
    ];

    await context.answerInlineQuery(results, {
        cache_time: 0,
        is_personal: true,
    });
}