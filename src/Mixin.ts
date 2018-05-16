import { ClassDeclaration, VariableDeclaration, Node, SourceFile} from "typescript";
import { Class } from './Class';
import { Variable } from './Variable';
import { find } from './utilities';
   

export type Mixin = Class | Variable
export type MixinDeclaration = ClassDeclaration | VariableDeclaration;
export const Mixin = {
  IsAMixin(node:Node): node is MixinDeclaration {
    return  Variable.IsAVariable( node ) || Class.IsAClass( node );
  },

  Find( source:SourceFile ) {
    return find<Mixin>( source, node => {
      if( Class.IsAClass( node ) ) return new Class( node, source.fileName )
      else if ( Variable.IsAVariable( node ) ) return new Variable( node, source.fileName );
      else return undefined;
    })
  },

  FindWhere(source:SourceFile, whereCondition:(mixin:Mixin) => boolean ):Mixin | undefined {
    let mixin:Mixin | undefined = undefined;
    find<Mixin>( source, node => {
      if( Class.IsAClass( node ) ) {
        const cls = new Class( node, source.fileName );
        if( whereCondition( cls ) ) {
          mixin = cls;
          return cls;
        }
        else return undefined
      } 
      else 
      if( Variable.IsAVariable( node ) ) {
        const variable = new Variable( node, source.fileName );
        if( whereCondition( variable ) ) {
          mixin = variable;
          return mixin;
        }
        else return undefined;
      }
      else return undefined;
    });
    return mixin;
  }
}

