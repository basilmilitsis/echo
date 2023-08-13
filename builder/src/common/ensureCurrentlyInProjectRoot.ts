import { listFiles } from "./listFiles";

export const ensureCurrentlyInProjectRoot = (): void => {
    if (listFiles(process.cwd()).findIndex(x => x === "package.json") === -1) {
        throw new Error('Not in project root');
    }
}