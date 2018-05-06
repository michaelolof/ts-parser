import { Range } from './utilities';
import { VariableMember, Method } from './Member';
import { VariableDeclaration, Symbol, SourceFile, Node } from 'typescript';
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
    static IsAVariable(node: Node): node is VariableDeclaration;
    static Find(source: SourceFile): Promise<Variable[] | undefined>;
}
