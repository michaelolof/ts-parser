import { getInlineRangeFromPosition, Range } from './utilities';
import { VariableMember, Method } from './Member';
import { VariableDeclaration, Identifier, Symbol } from 'typescript';

export class Variable {
  
  readonly element:VariableDeclaration;
  readonly filePath:string;
  private __members:VariableMember[] | undefined

  constructor(variable:VariableDeclaration, filePath:string) {
    this.element = variable;
    this.filePath = filePath;
  }

  get name() {
    return this.element.name["escapedText"] as string;
  }

  isOf(type:any):this is Variable {
    return this instanceof type;
  }

  getNameRange():Range {
    return getInlineRangeFromPosition( this.element.name as Identifier );
  }

  /**
   * Returns an array of VariableMembers if found and undefined if not found.
   */
  getMembers() {
    if( this.__members ) return this.__members;
    const memberElements = this.element!.initializer!["properties"];
    this.__members = [];
    for( let memberElement of memberElements ) {
      const member = new VariableMember( memberElement, this.filePath );
      this.__members.push( member );
    }
    return this.__members;
  }

  getMethods() {
    const members = this.getMembers();
    return Method.getMethods( members );
  }

  getMembersSymbol():Map<string,Symbol> | undefined {
    if( this.element.initializer!["symbol"] === undefined ) return undefined;
    return this.element.initializer!["symbol"].members
  }

}