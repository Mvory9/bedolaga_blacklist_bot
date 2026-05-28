import { User } from "grammy/types";
import { BLACKLIST_REPO_URL } from "../services/blacklist.service";
import { escapeHtml } from "./escape-html.util";

export const BOT_REPO_URL = "https://github.com/Mvory9/bedolaga_blacklist_bot";

export const ADD_TO_BLACKLIST_GUIDE_URL = "https://t.me/c/2941121338/98424/434891";

export function inlineResultDescription(statusLine: string) {
    return statusLine;
}

function inlineMessageLinksLineHtml() {
    return (
        `\n\n<a href="${ADD_TO_BLACKLIST_GUIDE_URL}">📝 Как добавить в blacklist</a>` +
        `\n<a href="${BLACKLIST_REPO_URL}">📎 Репозиторий blacklist</a>` +
        `\n<a href="${BOT_REPO_URL}">🤖 Репозиторий бота</a>`
    );
}

export function formatIdCheckHtml(id: string, inList: boolean, errorText: string | null) {
    if (errorText) {
        return (
            `⚠️ Не удалось проверить ID: ${escapeHtml(id)}\n\n` +
            `Причина: ${escapeHtml(errorText)}` +
            inlineMessageLinksLineHtml()
        );
    }

    const status = inList
        ? `🚫 <b>ID:</b> <code>${escapeHtml(id)}</code>\n<b>Статус:</b> <b>В BLACKLIST</b>`
        : `✅ <b>ID:</b> <code>${escapeHtml(id)}</code>\n<b>Статус:</b> <b>Не найден в blacklist</b>`;

    return status + inlineMessageLinksLineHtml();
}

export function formatSelfCheckHtml(from: User, inList: boolean, errorText: string | null) {
    const id = String(from.id);
    const firstName = from.first_name ? escapeHtml(from.first_name) : "—";
    const lastName = from.last_name ? escapeHtml(from.last_name) : "—";
    const username = from.username ? `@${escapeHtml(from.username)}` : "—";

    const header = "👤 <b>Проверка себя</b>";
    const profile =
        `\n\n<b>ID:</b> <code>${escapeHtml(id)}</code>` +
        `\n<b>Имя:</b> ${firstName}` +
        `\n<b>Фамилия:</b> ${lastName}` +
        `\n<b>Username:</b> ${username}`;

    if (errorText) {
        return (
            `⚠️ ${header}${profile}\n\n<b>Ошибка:</b> ${escapeHtml(errorText)}` +
            inlineMessageLinksLineHtml()
        );
    }

    const status = inList
        ? `\n\n<b>Статус:</b> <b>В BLACKLIST</b>`
        : `\n\n<b>Статус:</b> <b>Не найден в blacklist</b>`;

    const emoji = inList ? "🚫" : "✅";
    return `${emoji} ${header}${profile}${status}` + inlineMessageLinksLineHtml();
}

export const inlineResultReplyMarkup = {
    inline_keyboard: [[{ text: "👤 Проверить себя", callback_data: "self_check" }]],
};

export const noLinkPreview = {
    link_preview_options: { is_disabled: true },
};
