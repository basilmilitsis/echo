import { listFilesIn } from "./listFiles";

export const ensureCurrentlyInProjectRoot = (): void => {
    if (listFilesIn(process.cwd()).findIndex(x => x === "package.json") === -1) {
        throw new Error('Not in project root');
    }
}