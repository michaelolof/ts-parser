import { ClassDeclaration, VariableDeclaration} from "typescript";
import { Class } from './Class';
import { Variable } from './Variable';
   

export type Mixin = Class | Variable
export type MixinDeclaration = ClassDeclaration | VariableDeclaration;

