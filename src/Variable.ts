import * as ts from 'typescript';
import * as tsmix from "../tsmix"
import { Range, Position, TextDocument } from 'vscode-languageserver/lib/main';
import { getInlineRangeFromPosition } from './utilities';

export class Variable {
  
  readonly element:ts.VariableDeclaration;
  readonly filePath:string;
  private __members:tsmix.VariableMember[]

  constructor(variable:ts.VariableDeclaration, filePath:string) {
    this.element = variable;
    this.filePath = filePath;
  }

  get name() {
    return this.element.name["escapedText"] as string;
  }

  isOf(type:any):this is Variable {
    return this instanceof type;
  }

  getNameRange(textDocument:TextDocument):Range {
    return getInlineRangeFromPosition(textDocument, this.element.name );
  }

  /**
   * Returns an array of VariableMembers if found and undefined if not found.
   */
  getMembers() {
    if( this.__members ) return this.__members;
    const memberElements = this.element!.initializer!["properties"];
    this.__members = [];
    for( let memberElement of memberElements ) {
      const member = new tsmix.VariableMember( memberElement, this.filePath );
      this.__members.push( member );
    }
    return this.__members;
  }

  getMethods() {
    const members = this.getMembers();
    return tsmix.Method.getMethods( members );
  }

  getMembersSymbol():Map<string,ts.Symbol> {
    return this.element.initializer!["symbol"].members
  }

}