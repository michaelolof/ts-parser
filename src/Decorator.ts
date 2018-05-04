import { Decorator as ts_Decorator, Identifier } from 'typescript';


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
  getArguments():string[] {
    const args:string[] = [];
    const argsObj = this.decoratorElement.expression["arguments"] as Identifier[];
    if( argsObj ) {
      for( let argObj of argsObj ) {
        args.push( argObj.escapedText as string );
      }
    }
    return args;
  }

}

