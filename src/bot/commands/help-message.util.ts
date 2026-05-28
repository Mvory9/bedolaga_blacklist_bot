export function helpMessageHtml(botUsername: string) {
    return (
        `👋 <b>Bedolaga Blacklist Bot</b>\n\n` +
        `Проверка через inline в любом чате:\n` +
        `• <code>@${botUsername}</code> — проверить себя\n` +
        `• <code>@${botUsername} 777000</code> — проверить ID`
    );
}
