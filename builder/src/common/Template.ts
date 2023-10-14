import path from 'node:path';
import ejs from 'ejs';
import { Disk } from './Disk';

export class Template {
    static makeFolder(path: string): void {
        Disk.createFolder(path);
    }
    static makeFile(path: string): void {
        Disk.writeFile(path, '');
    }
    static write<T extends Object>(outputPath: string, loadTemplatPath: string, model: T): void {
        const templateFile = Disk.readFile(loadTemplatPath);
        Disk.writeFile(outputPath, ejs.render(templateFile, model));
    }

    static templatePath(loadFrom: string, relativePath: string): string {
        return path.join(loadFrom, relativePath);
    }
}
