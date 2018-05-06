import { Identifier, Node, SourceFile, ImportDeclaration } from 'typescript';
export declare function getInlineRangeFromPosition(namedElement: Identifier, source?: SourceFile, name?: string): Range;
export declare function createErrorDiagnostic(source: string, range: Range, message: string, code?: string): Diagnostic;
export declare function cleanUpFilePath(filePath: string): string;
export declare function find<T>(source: SourceFile, condition: (node: Node) => (T | undefined), deepFind?: boolean): Promise<T[] | undefined>;
export declare function getImportFromSourceByModuleName(moduleName: string, source: SourceFile): ImportDeclaration | undefined;
export declare type Diagnostic = {
    range: Range;
    message: string;
    code?: string;
    severity: Severity;
    source: string;
};
export declare enum Severity {
    Warning = 0,
    Error = 1,
}
export declare type Position = {
    line: number;
    character: number;
};
export declare type Range = {
    start: Position;
    end: Position;
};
