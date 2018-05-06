import { ClassDeclaration, VariableDeclaration, Node } from "typescript";
import { Class } from './Class';
import { Variable } from './Variable';
export declare type Mixin = Class | Variable;
export declare type MixinDeclaration = ClassDeclaration | VariableDeclaration;
export declare const Mixin: {
    IsAMixin(node: Node): node is MixinDeclaration;
};
