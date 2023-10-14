export class Logger {
    static blankLine(): void {
        console.log();
    }

    static line(): void {
        console.log('---------------------------------------------');
    }

    static seperator(): void {
        Logger.blankLine();
        Logger.line();
        Logger.blankLine();
    }

    static title(...messages: string[]): void {
        Logger.blankLine();
        Logger.line();
        console.log(...messages);
        Logger.line();
        Logger.blankLine();
    }
    static log(...messages: string[]): void {
        console.log(...messages);
    }
}
