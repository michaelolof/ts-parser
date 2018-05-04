import { ClassDeclaration, VariableDeclaration } from "typescript";
import { Class } from './Class';
import { Variable } from './Variable';
export declare type Mixin = Class | Variable;
export declare type MixinDeclaration = ClassDeclaration | VariableDeclaration;
