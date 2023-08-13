import * as fs from 'fs';

export const listFiles = (folder: string): string[] => {
    return fs
        .readdirSync(folder, { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .map((item) => item.name);
};
