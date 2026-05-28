import { Composer, Context } from "grammy";
import { helpCommand } from "../commands/help.command";
import { startCommand } from "../commands/start.command";

export function commandsComposer(): Composer<Context> {
    const composer = new Composer<Context>();

    composer.command("start", startCommand);
    composer.command("help", helpCommand);

    return composer;
}
