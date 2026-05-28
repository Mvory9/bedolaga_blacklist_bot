import { Composer, Context } from "grammy";
import checkInline from "../inline/check";
import { isInBlacklist } from "../../services/blacklist.service";
import { escapeHtml } from "../../utils/escape-html.util";

export function inlineComposer(): Composer<Context> {
    const composer = new Composer<Context>();

    // Инлайны
    composer.inlineQuery(/^\d+$/, checkInline);

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

        const id = String(from.id);
        const firstName = from.first_name ? escapeHtml(from.first_name) : "—";
        const lastName = from.last_name ? escapeHtml(from.last_name) : "—";
        const username = from.username ? `@${escapeHtml(from.username)}` : "—";

        const text = errorText
            ? `⚠️ <b>Проверка себя</b>\n\n<b>ID:</b> <code>${escapeHtml(
                  id
              )}</code>\n<b>Имя:</b> ${firstName}\n<b>Фамилия:</b> ${lastName}\n<b>Username:</b> ${username}\n\n<b>Ошибка:</b> ${escapeHtml(
                  errorText
              )}`
            : inList
              ? `🚫 <b>Проверка себя</b>\n\n<b>ID:</b> <code>${escapeHtml(
                    id
                )}</code>\n<b>Имя:</b> ${firstName}\n<b>Фамилия:</b> ${lastName}\n<b>Username:</b> ${username}\n\n<b>Статус:</b> <b>В BLACKLIST</b>`
              : `✅ <b>Проверка себя</b>\n\n<b>ID:</b> <code>${escapeHtml(
                    id
                )}</code>\n<b>Имя:</b> ${firstName}\n<b>Фамилия:</b> ${lastName}\n<b>Username:</b> ${username}\n\n<b>Статус:</b> <b>Не найден в blacklist</b>`;

        const reply_markup = {
            inline_keyboard: [[{ text: "👤 Проверить себя", callback_data: "self_check" }]],
        };

        try {
            if (ctx.callbackQuery?.inline_message_id) {
                await ctx.api.editMessageTextInline(ctx.callbackQuery.inline_message_id, text, {
                    parse_mode: "HTML",
                    reply_markup,
                });
            } else {
                await ctx.editMessageText(text, { parse_mode: "HTML", reply_markup });
            }
        } catch (e) {
            const errText = e instanceof Error ? e.message : String(e);
            if (
                errText.includes("message is not modified") ||
                errText.includes("MESSAGE_NOT_MODIFIED")
            ) {
                // игнорир повторных кликов
            } else {
                throw e;
            }
        }

        await ctx.answerCallbackQuery();
    });

    return composer;
}