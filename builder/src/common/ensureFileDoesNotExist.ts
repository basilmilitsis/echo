import * as fs from "fs";

export const ensureFileDoesNotExist = (path: string): void => {
    if (fs.existsSync(path)) {
        throw new Error(`File already exists: ${path}`);
    }
}