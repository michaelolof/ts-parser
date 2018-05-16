import { Decorator as ts_Decorator, Identifier, Node, SyntaxKind, SourceFile } from 'typescript';
import { find } from './utilities';
import { Argument } from './Statement';


export class Decorator {

  readonly decoratorElement:ts_Decorator;
  readonly filePath:string;

  constructor(decoratorElement:ts_Decorator, filePath:string) {
    this.decoratorElement = decoratorElement;
    this.filePath = filePath;
  }

  get name():string {
    let n:string;
    n = this.decoratorElement.expression["escapedText"];
    if( n ) return n;
    n = this.decoratorElement.expression["expression"].escapedText;
    if( n ) return n;
    else throw new RangeError("Cannot get name of decorator. Inspect the object manually and update method").stack
  }

  /**
   * Return an array of string if the decorator has arguments 
   * and an empty array if the decorator is doesn't have any arguments.
   */
  getArguments() {
    const argsObj = this.decoratorElement.expression["arguments"] as Identifier[];
    return argsObj.map( arg => new Argument( arg, this.filePath ) );
  }

  static IsADecorator(node:Node):node is ts_Decorator {
    return node.kind === SyntaxKind.Decorator;
  }

  static Find(source:SourceFile) {
    return find(source, node => {
      if( Decorator.IsADecorator( node ) ) return new Decorator( node, source.fileName );
      else return undefined;
    });
  }

}

