import * as fs from 'fs';

export const listFoldersIn = (folder: string): string[] => {
    return fs
        .readdirSync(folder, { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => item.name);
};
