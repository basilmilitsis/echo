import * as fs from "fs";

export const ensureFolderExists = (path: string): void => {
    if (!fs.existsSync(path)) {
        throw new Error(`Folder does NOT exist: ${path}`);
    }
}