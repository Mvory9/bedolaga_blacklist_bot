import { User } from "grammy/types";
import { BLACKLIST_REPO_URL } from "../services/blacklist.service";
import { escapeHtml } from "./escape-html.util";

export function blacklistRepoFooterHtml() {
    return `\n\n📎 <a href="${BLACKLIST_REPO_URL}">Репозиторий blacklist</a>`;
}

export function formatIdCheckHtml(id: string, inList: boolean, errorText: string | null) {
    if (errorText) {
        return (
            `⚠️ Не удалось проверить ID: ${escapeHtml(id)}\n\n` +
            `Причина: ${escapeHtml(errorText)}` +
            blacklistRepoFooterHtml()
        );
    }

    const status = inList
        ? `🚫 <b>ID:</b> <code>${escapeHtml(id)}</code>\n<b>Статус:</b> <b>В BLACKLIST</b>`
        : `✅ <b>ID:</b> <code>${escapeHtml(id)}</code>\n<b>Статус:</b> <b>Не найден в blacklist</b>`;

    return status + blacklistRepoFooterHtml();
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
            blacklistRepoFooterHtml()
        );
    }

    const status = inList
        ? `\n\n<b>Статус:</b> <b>В BLACKLIST</b>`
        : `\n\n<b>Статус:</b> <b>Не найден в blacklist</b>`;

    const emoji = inList ? "🚫" : "✅";
    return `${emoji} ${header}${profile}${status}` + blacklistRepoFooterHtml();
}

export const selfCheckButtonMarkup = {
    inline_keyboard: [[{ text: "👤 Проверить себя", callback_data: "self_check" }]],
};

export const noLinkPreview = {
    link_preview_options: { is_disabled: true },
};
