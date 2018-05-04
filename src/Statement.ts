import { find } from ".";
import { 
  Node, SourceFile, SyntaxKind, CallExpression, isCallExpression, isPropertyAccessExpression, 
  isExpressionStatement, ExpressionStatement } from "typescript";

export type ThisCallType = "property" | "method";
export type ThisCallAccessor = "instance" | "static";

export abstract class ThisCall {

  element:CallExpression | ExpressionStatement;
  code:string;
  name:string;
  abstract accessor:"static"|"instance";
  abstract type:"method" | "property";
  abstract inferSignature():number | "any";


  constructor(element:CallExpression | ExpressionStatement ) {
    this.element = element;
    this.name = (element.expression["name"].escapedText as string);
    this.code = element.getFullText().trim();
  }

  static FindAll(body:Node):Promise<ThisCall[] | undefined> {
    const calls = find( body as SourceFile, condition );
    return calls;
    //--------------------------------------------------------
    function condition(node:Node):ThisCall | undefined {
      if( node.kind === SyntaxKind.ThisKeyword 
          && node.parent 
                    
          && isPropertyAccessExpression( node.parent ) && node.parent.parent ) {
            
          if( node.parent.name.escapedText === "constructor" && node.parent.parent.parent ) {
            if( isExpressionStatement( node.parent.parent.parent ) ) {
              return new StaticPropertyThisCall( node.parent.parent.parent );
            }
            if( isCallExpression( node.parent.parent.parent ) ) {
              return new StaticMethodThisCall( node.parent.parent.parent )
            }
          }
          
          if( isExpressionStatement( node.parent.parent ) ) {
            return new IntsancePropertyThisCall( node.parent.parent );
          }
        
          if( isCallExpression( node.parent.parent ) ) {
            return new InstanceMethodThisCall( node.parent.parent );
          }
      }
      return undefined;
    }
  }

}


export abstract class MethodThisCall extends ThisCall {
  abstract accessor:"static" | "instance"
  type: "method";
  constructor( public element:CallExpression ) {
    super( element );
    this.type = "method";
  }

  inferSignature():number {
    return this.element.arguments.length;
  }
}

export abstract class PropertyThisCall extends ThisCall {
  abstract accessor:"static" | "instance"
  type: "property";
  constructor(public element:ExpressionStatement) {
    super( element );
    this.type = "property"
  }
  inferSignature():"any" {
    return "any"
  }
}

export class InstanceMethodThisCall extends MethodThisCall {  
  accessor:"instance" = "instance";
  constructor(element:CallExpression) {
    super( element );
  }
} 

export class StaticMethodThisCall extends MethodThisCall {
  accessor:"static" = "static";
  constructor(public element:CallExpression) {
    super( element);
  }
}

export class IntsancePropertyThisCall extends PropertyThisCall {
  accessor:"instance" = "instance"
  constructor(public element:ExpressionStatement) {
    super( element );
  }
}

export class StaticPropertyThisCall extends PropertyThisCall {
  accessor:"static" = "static"
  constructor(public element:ExpressionStatement) {
    super( element );
  }
}

