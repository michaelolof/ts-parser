import { getInlineRangeFromPosition, Range, find } from './utilities';
import { VariableMember, Method } from './Member';
import { VariableDeclaration, Identifier, Symbol, SourceFile, Node, isVariableDeclaration, SyntaxKind, TypeChecker } from 'typescript';
import { SymbolizedMemberArray, SymbolizedHolder } from './Checker';

export class Variable {
  
  element:VariableDeclaration;
  filePath:string;
  private __members:VariableMember[] | undefined

  constructor(variable:VariableDeclaration, filePath:string) {
    this.element = variable;
    this.filePath = filePath;
  }

  get name() {
    return this.element.name["escapedText"] as string;
  }

  get implementsAnInterface() {
    if( this.element.type ) return true
    else return false;
  }

  isOf(type:any):this is Variable {
    return this instanceof type;
  }

  getNameRange(source?:SourceFile):Range {
    return getInlineRangeFromPosition( this.element.name as Identifier, source );
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

  /**
   * Returns a VariableMember instance if found and undefined if not found.
   */
  getMember(name:string) {
    let members:VariableMember[]|undefined = this.__members;
    if( members === undefined ) members = this.getMembers();
    for(let member of members) {
      if( member.name === name ) return member;
    }
    return undefined;
  }

  getMethods() {
    const members = this.getMembers();
    return Method.getMethods( members );
  }

  getMembersSymbol():Map<string,Symbol> | undefined {
    if( this.element.initializer!["symbol"] === undefined ) return undefined;
    return this.element.initializer!["symbol"].members
  }

  async toSymbolizedHolder(type:"mixin" | "client", checker:TypeChecker) {
    return new SymbolizedHolder(
      this.name,
      this.getNameRange(),
      this.filePath,
      type,
      (await this.getMembersSymbolizedMemberArray(checker) ).array,
    )
  }

  async getMembersSymbolizedMemberArray(checker:TypeChecker) {
    const members = this.getMembers();
    const rtn = new SymbolizedMemberArray();
    for(let member of members) { 
      rtn.push( await member.getSymbolizedMember(checker, this.element ) )
    }
    return rtn;
  }

  static IsAVariable(node:Node):node is VariableDeclaration {
    const otherTruths = node["initializer"] && node["initializer"].kind === SyntaxKind.ObjectLiteralExpression
    if( otherTruths ) {
      return isVariableDeclaration( node );
    }
    else return false
  }

  static Find(source:SourceFile) {
    return find( source, node => {
      if( Variable.IsAVariable(node) ) return new Variable( node, source.fileName );
      else return undefined; 
    })
  }

}