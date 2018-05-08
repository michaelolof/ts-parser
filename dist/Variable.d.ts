import { Range } from './utilities';
import { VariableMember, Method } from './Member';
import { VariableDeclaration, Symbol, SourceFile, Node, TypeChecker } from 'typescript';
import { SymbolizedMemberArray } from './Checker';
export declare class Variable {
    readonly element: VariableDeclaration;
    readonly filePath: string;
    private __members;
    constructor(variable: VariableDeclaration, filePath: string);
    readonly name: string;
    isOf(type: any): this is Variable;
    getNameRange(): Range;
    getMembers(): VariableMember[];
    getMethods(): Method[];
    getMembersSymbol(): Map<string, Symbol> | undefined;
    getMembersSymbolizedMemberArray(checker: TypeChecker): Promise<SymbolizedMemberArray>;
    static IsAVariable(node: Node): node is VariableDeclaration;
    static Find(source: SourceFile): Promise<Variable[] | undefined>;
}
