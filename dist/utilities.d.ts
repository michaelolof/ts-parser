import { Identifier, VariableDeclaration, Node, ClassDeclaration, SourceFile } from 'typescript';
import { MixinDeclaration } from './Mixin';
export declare function getInlineRangeFromPosition(namedElement: Identifier, source?: SourceFile, name?: string): Range;
export declare function createErrorDiagnostic(source: string, range: Range, message: string, code?: string): Diagnostic;
export declare function cleanUpFilePath(filePath: string): string;
export declare namespace issa {
    function variable(node: Node): node is VariableDeclaration;
    function _class(node: Node): node is ClassDeclaration;
    function mixin(node: Node): node is MixinDeclaration;
}
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
