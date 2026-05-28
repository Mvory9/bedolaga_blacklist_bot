import { Composer, Context } from "grammy";
import checkInline from "../inline/check";

export function inlineComposer(): Composer<Context> {
    const composer = new Composer<Context>();

    // Инлайны
    composer.inlineQuery(/^\d+$/, checkInline);

    return composer;
}