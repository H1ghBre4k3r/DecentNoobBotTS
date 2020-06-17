import dotenv from "dotenv";
import fs from "fs";
import { join } from "path";

dotenv.config();

(async () => {
    init();
})();

/**
 * Initialize everything.
 */
async function init(): Promise<void> {
    await readDirectory(__dirname);
}

/**
 * Read a directory recursively and import all files in there.
 * @param dir
 */
async function readDirectory(dir: string): Promise<void> {
    if (dir.includes("node_modules")) {
        return;
    }
    const paths = fs.readdirSync(dir, {
        withFileTypes: true
    });
    const promises: Promise<void>[] = [];
    for (const p of paths) {
        if (!p.isDirectory()) {
            promises.push(import(join(dir, p.name)));
        } else {
            promises.push(readDirectory(join(dir, p.name)));
        }
    }
    Promise.all(promises);
}
