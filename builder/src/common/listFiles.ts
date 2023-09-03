import * as fs from 'fs';

export const listFilesIn = (folder: string, endingWith: string = ''): string[] => {
    return fs
        .readdirSync(folder, { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .filter(item => item.name.endsWith(endingWith))
        .map((item) => item.name);
};
