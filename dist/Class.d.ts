import { ClassDeclaration, Symbol, TypeChecker, SourceFile, Node } from 'typescript';
import { SymbolizedMemberArray } from './Checker';
import { ClassMember, Method } from './Member';
import { Range } from './utilities';
export declare class Class {
    readonly element: ClassDeclaration;
    readonly filePath: string;
    private __members;
    mixinNames?: string[];
    constructor(element: ClassDeclaration, filePath: string);
    readonly name: string;
    getNameRange(source?: SourceFile): Range;
    getMembers(): ClassMember[];
    getMember(name: string): ClassMember | undefined;
    getMethods(): Method[];
    getMembersSymbol(): Map<string, Symbol> | undefined;
    getMembersSymbolizedMemberArray(checker: TypeChecker): Promise<SymbolizedMemberArray>;
    hasMembersUsingDecorator(decoratorName: string): ClassMember[];
    getMemberUsingDecorator(decoratorName: string, memberName: string): ClassMember | undefined;
    isOf(type: any): this is Class;
    hasMemberByNameAndAccessor(name: string, accessor: "static" | "instance"): ClassMember | undefined;
    static IsAClass(node: Node): node is ClassDeclaration;
    static Find(source: SourceFile): Promise<Class[] | undefined>;
}
