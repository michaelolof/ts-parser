import { Method } from ".";
import { Identifier, SourceFile } from "typescript";
import { getInlineRangeFromPosition } from './utilities';

export type ThisCallType = "property" | "method";
export type ThisCallAccessor = "instance" | "static";

export class ThisCall {

  private bracketStartingIndex:number
  private codeWithoutThis:string

  constructor(public readonly code: string) {
  }

  get name() {
    this.codeWithoutThis = this.code.substr(5);
    if( this.type === "method" ) {
      this.bracketStartingIndex = this.codeWithoutThis.indexOf("(");
      const methodName = this.codeWithoutThis.substring( 0, this.bracketStartingIndex );
      return methodName.trim();
    } else return this.codeWithoutThis.trim();
  }

  get type():ThisCallType {
    if (Method.isStringAMethod(this.code)) return "method"
    else return "property";
  }

  get codeFormat() {
    if( this.type === "property" ) return this.code
    else return "this." + this.name + "(...)"
  }

  static Find(source: string):ThisCall[] {
    // const rgx = {
    //   instanceMember: /this\.(?!.*constructor)[\w]+([\s]+)?(\(([\s\w\"\'\`\!\*\,\.\@\%\^\&\|\,\_]+)?\))?/g,
    //   staticMember: /this\.constructor.[\w]+(\(([\s\w\,\.\_]+)?\))?/g,
    // }
    
    const rgx = {
      instanceMember: /this(\s)?\.(?!.*constructor)[\w]+/g,
      staticMember: /this(\s)?\.constructor(\s)?\.[\w]+/g
    }

    const calls: ThisCall[] = [];
    const instancePropertiesAndMethods = Array.from( new Set( source.match(rgx.instanceMember) || [] ) );
    const staticPropertiesAndMethods = Array.from( new Set( source.match(rgx.staticMember) || [] ) );

    if (instancePropertiesAndMethods) { 
      for (let prop of instancePropertiesAndMethods ) {
        calls.push(new ThisCall(prop));
      }
    }

    if (staticPropertiesAndMethods) {
      for (let prop of staticPropertiesAndMethods) {
        calls.push(new ThisCall(prop));
      }
    }

    return calls;   
  }

}

export class Argument {
  constructor(public element:Identifier, public filePath:string) {}
  get name() {
    return (
      this.element.escapedText || this.element["name"].escapedText
    ) as string
  }
  getNameRange(source?:SourceFile) {
    return getInlineRangeFromPosition( this.element, source )
  }
}
