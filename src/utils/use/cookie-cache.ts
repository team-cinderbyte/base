import { promises as fs } from "node:fs";
import path from "node:path";

export async function editJsonFile<T extends object>(
  filePath: string,
  newData: T,
  options?: {
    merge?: boolean;
    pretty?: boolean;
  },
): Promise<void> {
  const { merge = false, pretty = true } = options ?? {};
  const resolvedPath = path.resolve(filePath);
  const dir = path.dirname(resolvedPath);
  await fs.mkdir(dir, { recursive: true });
  let finalData: any = newData;
  if (merge) {
    try {
      const existing = await fs.readFile(resolvedPath, "utf-8");
      const parsed = JSON.parse(existing);
      finalData = { ...parsed, ...newData };
    } catch {
      finalData = newData;
    }
  }
  const jsonString = pretty
    ? JSON.stringify(finalData, null, 2)
    : JSON.stringify(finalData);
  await fs.writeFile(resolvedPath, jsonString, "utf-8");
}
