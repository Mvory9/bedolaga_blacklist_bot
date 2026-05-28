export const BLACKLIST_RAW_URL =
    "https://raw.githubusercontent.com/Blin4ickUSE/ban-vpn/refs/heads/main/blacklist.txt";

export const BLACKLIST_REPO_URL = "https://github.com/Blin4ickUSE/ban-vpn";

function parseBlacklistIds(text: string) {
    return new Set(
        text
            .split(/\r?\n/)
            .map((line) => (line.split("#")[0] ?? "").trim())
            .filter((line) => /^\d+$/.test(line))
    );
}

export async function isInBlacklist(id: number | string) {
    const res = await fetch(BLACKLIST_RAW_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();
    const set = parseBlacklistIds(text);
    return set.has(String(id));
}

