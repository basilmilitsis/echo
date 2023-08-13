import * as fs from 'fs';
import path from 'node:path';

export const loadTemplate = (loadFrom: string, relativePath: string): string => {
    const finalPath = path.join(loadFrom, relativePath);
    return fs.readFileSync(finalPath, 'utf-8');
};
