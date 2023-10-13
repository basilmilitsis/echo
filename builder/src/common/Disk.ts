import * as fs from 'fs';
import yaml from 'js-yaml';

export class Disk {
    static readFile(path: string): string {
        return fs.readFileSync(path, 'utf8');
    }
    static readFileAsJson<T>(path: string): T {
        return JSON.parse(fs.readFileSync(path, 'utf8'))
    }
    static readFileAsYaml<T>(path: string): T {
        return yaml.load(fs.readFileSync(path, 'utf8')) as T;
    }

    static writeFile(path: string, content: string): void {
        fs.writeFileSync(path, content);
        console.log('writing to: ', path);
    }
    static writeFileJson(path: string, content: object): void {
        fs.writeFileSync(path, JSON.stringify(content, null, 2));
        console.log('writing to: ', path);
    }
    static writeFileYaml(path: string, content: object): void {
        fs.writeFileSync(path, yaml.dump(content, { indent: 2 }));
        console.log('writing to: ', path);
    }

    static createFolder(path: string): void {
        fs.mkdirSync(path);
        console.log('creating folder: ', path);
    }
}
