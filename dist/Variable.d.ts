import { Range } from './utilities';
import { VariableMember, Method } from './Member';
import { VariableDeclaration, Symbol } from 'typescript';
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
}
