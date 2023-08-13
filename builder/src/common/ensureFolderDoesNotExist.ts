import * as fs from "fs";

export const ensureFolderDoesNotExist = (path: string): void => {
    if (fs.existsSync(path)) {
        throw new Error(`Folder already exists: ${path}`);
    }
}