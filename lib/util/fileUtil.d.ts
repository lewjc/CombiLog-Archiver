export declare function createLogFile(directory: string, fileName: string): void;
export declare function writeToLogFile(directory: string, fileName: string, content: string): void;
export declare function createDirectory(parent: string, dir: string): void;
export declare function getFileContents(path: string): Promise<string | null>;
export declare function getLogStructure(dir: string): Promise<object | null>;
export declare function checkHotRecords(): void;
