import { promises as fs } from "node:fs";
import path from "node:path";
export async function editJsonFile(filePath, newData, options) {
    const { merge = false, pretty = true } = options ?? {};
    const resolvedPath = path.resolve(filePath);
    const dir = path.dirname(resolvedPath);
    await fs.mkdir(dir, { recursive: true });
    let finalData = newData;
    if (merge) {
        try {
            const existing = await fs.readFile(resolvedPath, "utf-8");
            const parsed = JSON.parse(existing);
            finalData = { ...parsed, ...newData };
        }
        catch {
            finalData = newData;
        }
    }
    const jsonString = pretty
        ? JSON.stringify(finalData, null, 2)
        : JSON.stringify(finalData);
    await fs.writeFile(resolvedPath, jsonString, "utf-8");
}
//# sourceMappingURL=cookie-cache.js.map