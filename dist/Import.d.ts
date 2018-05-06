import { ImportDeclaration, Node, SourceFile } from 'typescript';
export declare class Import {
    readonly filePath: string;
    readonly importDeclaration: ImportDeclaration;
    readonly moduleDeclaration: string;
    readonly moduleName: string;
    private __format;
    constructor(importDeclaration: ImportDeclaration, filePath: string);
    readonly format: ImportFormat;
    getImportedObjects(): ImportedObject[];
    resolvePath(extension: string): string;
    static IsAImport(node: Node): node is ImportDeclaration;
    static FindModule(name: string, imports: Import[]): Import | undefined;
    static Find(source: SourceFile): Promise<Import[] | undefined>;
    static findObject(name: string, imports: Import[]): ImportedObject | undefined;
}
export declare enum ImportFormat {
    Default = 0,
    Object = 1,
    Namespaced = 2,
}
export declare class ImportedObject {
    readonly toLocation: string;
    readonly fromLocation: string;
    readonly name?: string;
    readonly alias?: string;
    constructor(parentImport: Import, name?: string, alias?: string);
    getAlias(): string | Error;
}
