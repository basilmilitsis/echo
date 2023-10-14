import path from 'node:path';
import ejs from 'ejs';
import yaml from 'js-yaml';
import { Disk } from './Disk';
import { Logger } from './Logger';

const logPath = (depth: number, icon: string, name: string) => {
    const pathPrefix = depth > 0 ? '   '.repeat(depth) : '';
    Logger.log(pathPrefix, `  ${icon}`, name);
};

export class Writer {
    constructor(
        private _path: string,
        private _depth: number = 0
    ) {}

    title(title: string): Writer {
        Logger.title(title);
        Logger.log('Writing files...');
        Logger.blankLine();
        return this;
    }
    close(): void {
        Logger.seperator();
    }

    path(): string {
        return this._path;
    }

    ensureFolder(name: string, content: (content: Writer) => void): Writer {
        const folderPath = path.join(this._path, name);
        if (!Disk.exists(folderPath)) {
            Disk.createFolder(folderPath);
        }
        logPath(this._depth, '📁', name);
        content(new Writer(folderPath, this._depth + 1));
        return this;
    }

    existingFolder(name: string, content: (content: Writer) => void): Writer {
        const folderPath = path.join(this._path, name);
        if (!Disk.exists(folderPath)) {
            throw new Error(`Folder ${folderPath} does not exist`);
        }
        logPath(this._depth, '📁', name);
        content(new Writer(folderPath, this._depth + 1));
        return this;
    }
    createFolder(name: string, content: (content: Writer) => void): Writer {
        const folderPath = path.join(this._path, name);
        if (Disk.exists(folderPath)) {
            throw new Error(`Folder ${folderPath} already exists`);
        }
        Disk.createFolder(folderPath);
        logPath(this._depth, '📁', name);
        content(new Writer(folderPath, this._depth + 1));
        return this;
    }

    private createFile(fileName: string, content: string): void {
        const filePath = path.join(this._path, fileName);
        if (Disk.exists(filePath)) {
            throw new Error(`File ${filePath} already exists`);
        }
        Disk.writeFile(filePath, content);
    }
    private replaceFile(fileName: string, content: string): void {
        const filePath = path.join(this._path, fileName);
        if (!Disk.exists(filePath)) {
            throw new Error(`File ${filePath} does not exist`);
        }
        Disk.writeFile(filePath, content);
    }
    private ensureFile(fileName: string, content: string): void {
        const filePath = path.join(this._path, fileName);
        Disk.writeFile(filePath, content);
    }
    private readFile(fileName: string): string {
        const filePath = path.join(this._path, fileName);
        if (!Disk.exists(filePath)) {
            throw new Error(`File ${filePath} does not exist`);
        }
        return Disk.readFile(filePath);
    }

    createStringFile(fileName: string, contents: string): Writer {
        this.createFile(fileName, contents);
        logPath(this._depth, '📄', fileName);
        return this;
    }

    createTemplateFile<T>(fileName: string, templatePath: string, model: T): Writer {
        const templateFile = Disk.readFile(templatePath);
        this.createFile(fileName, ejs.render(templateFile, model));
        logPath(this._depth, '📄', fileName);
        return this;
    }
    replaceTemplateFile<T>(fileName: string, templatePath: string, model: T): Writer {
        const templateFile = Disk.readFile(templatePath);
        this.replaceFile(fileName, ejs.render(templateFile, model));
        logPath(this._depth, '📄', fileName);
        return this;
    }
    ensureTemplateFile<T>(fileName: string, templatePath: string, model: T): Writer {
        const templateFile = Disk.readFile(templatePath);
        this.ensureFile(fileName, ejs.render(templateFile, model));
        logPath(this._depth, '📄', fileName);
        return this;
    }

    updateJsonFile<T>(fileName: string, replaceWith: (originalContents: T) => T): Writer {
        const originalContents = this.readFile(fileName);
        const newContents = replaceWith(JSON.parse(originalContents) as T);
        this.replaceFile(fileName, JSON.stringify(newContents, null, 2));
        logPath(this._depth, '📄', fileName);
        return this;
    }

    updateYamlFile<T>(fileName: string, replaceWith: (originalContents: T) => T): Writer {
        const originalContents = this.readFile(fileName);
        const newContents = replaceWith(yaml.load(originalContents) as T);
        this.replaceFile(fileName, yaml.dump(newContents, { indent: 2 }));
        logPath(this._depth, '📄', fileName);
        return this;
    }
}
