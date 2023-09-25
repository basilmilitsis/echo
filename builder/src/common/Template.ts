import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';

export class Template {
    static makeFolder(path: string): void {
        fs.mkdirSync(path);
    }

    static templatePath(loadFrom: string, relativePath: string): string {
        return path.join(loadFrom, relativePath);
    }
    static write<T>(outputPath: string, loadTemplatPath: string, model: T): void {
        const templateFile = fs.readFileSync(loadTemplatPath, 'utf-8');
        console.log('writing to: ', outputPath);
        fs.writeFileSync(outputPath, ejs.render(templateFile, model));
    }
}
