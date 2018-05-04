import { Program as tsProgram, Symbol, TypeChecker, Signature, Node } from 'typescript';
export declare class Program {
    private program;
    checker: TypeChecker;
    constructor(program: tsProgram);
    serializeSymbol(symbol: Symbol): DocEntry;
    serializeClass(symbol: Symbol): DocEntry;
    serializeSignature(signature: Signature): DocEntry;
    isNodeExported(node: Node): boolean;
}
export interface DocEntry {
    name?: string;
    fileName?: string;
    documentation?: string;
    type?: string;
    constructors?: DocEntry[];
    parameters?: DocEntry[];
    returnType?: string;
}
