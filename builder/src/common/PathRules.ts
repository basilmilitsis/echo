import * as fs from 'fs';
import { listFilesIn } from './listFiles';

export class PathRules {
    static ensureFileDoesNotExist = (path: string): void => {
        if (fs.existsSync(path)) {
            throw new Error(`File already exists: ${path}`);
        }
    }

    static ensureFolderDoesNotExist = (path: string): void => {
        if (fs.existsSync(path)) {
            throw new Error(`Folder already exists: ${path}`);
        }
    }

    static ensureCurrentlyInProjectRoot = (): void => {
        if (listFilesIn(process.cwd()).findIndex(x => x === "package.json") === -1) {
            throw new Error('Not in project root');
        }
    }

    static ensureFolderExists = (path: string): void => {
        if (!fs.existsSync(path)) {
            throw new Error(`Folder does NOT exist: ${path}`);
        }
    }
}
