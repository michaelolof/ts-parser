import { ClassDeclaration, VariableDeclaration, Node} from "typescript";
import { Class } from './Class';
import { Variable } from './Variable';
   

export type Mixin = Class | Variable
export type MixinDeclaration = ClassDeclaration | VariableDeclaration;
export const Mixin = {
  IsAMixin(node:Node): node is MixinDeclaration {
    return  Variable.IsAVariable( node ) || Class.IsAClass( node );
  }
}
