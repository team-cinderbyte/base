export declare function editJsonFile<T extends object>(filePath: string, newData: T, options?: {
    merge?: boolean;
    pretty?: boolean;
}): Promise<void>;
