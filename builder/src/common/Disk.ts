import * as fs from 'fs';

export class Disk {
    static exists(path: string): boolean {
        return fs.existsSync(path);
    }

    static readFile(path: string): string {
        return fs.readFileSync(path, 'utf8');
    }

    static writeFile(path: string, content: string): void {
        fs.writeFileSync(path, content);
    }

    static createFolder(path: string): void {
        fs.mkdirSync(path);
    }
}
