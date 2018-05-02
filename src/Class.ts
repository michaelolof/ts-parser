import * as ts from 'typescript';
import * as tsmix from '../tsmix';
import { Range, TextDocument } from 'vscode-languageserver/lib/main';
import { getInlineRangeFromPosition } from './utilities';
import { SymbolizedMemberArray } from './Checker';

export class Class {
  
  readonly element:ts.ClassDeclaration;
  readonly filePath:string;
  private __members:tsmix.ClassMember[]
  mixinNames?:string[];

  constructor(classDeclaration:ts.ClassDeclaration, filePath:string) {
    this.element = classDeclaration;
    this.filePath = filePath;
  }

  get name() {
    return this.element.name!.escapedText as string
  }

  getNameRange(textDocument:TextDocument):Range {
    return getInlineRangeFromPosition( textDocument, this.element.name! );
  }

  /**
   * Returns an array of ClassMembers if found and undefined if not found.
   */
  getMembers() {
    if( this.__members ) return this.__members;

    const memberElements = this.element.members
    this.__members = [];
    for( let memberElement of memberElements ) {
      const member = new tsmix.ClassMember( memberElement, this.filePath );
      this.__members.push( member );
    }
    return this.__members;
  }

  /**
   * Returns a ClassMember instance if found and undefined if not found.
   */
  getMember(name:string) {
    let members:tsmix.ClassMember[] = this.__members;
    if( members === undefined ) members = this.getMembers();
    for(let member of members) {
      if( member.name === name ) return member;
    }
    return undefined;
  }

  getMethods() {
    const members = this.getMembers();
    return tsmix.Method.getMethods( members );
  }

  getMembersSymbol():Map<string,ts.Symbol> {
    return this.element["symbol"].members
  }

  async getMembersSymbolizedMemberArray(document:TextDocument, checker:ts.TypeChecker) {
    const members = this.getMembers();
    const rtn = new SymbolizedMemberArray();
    for(let member of members) { 
      rtn.push( await member.getSymbolizedMember(document, checker, this.element ) )
    }
    return rtn;
  }

  /**
   * Returns an array of tsmix.ClassMember if found and an empty array if not found.
   */
  hasMembersUsingDecorator(decoratorName:string):tsmix.ClassMember[] {
    const members = this.getMembers();
    const membersUsingDecorators:tsmix.ClassMember[] = []
    for(let member of members) {
      if( member.isUsingDecorator( decoratorName ) ) {
        membersUsingDecorators.push( member )
      }
    }
    return membersUsingDecorators;
  }

  getMemberUsingDecorator(decoratorName:string, memberName:string):tsmix.ClassMember|undefined {
    const member = this.getMember( memberName );
    if( member === undefined ) return undefined;
    if( member.isUsingDecorator( decoratorName) ) return member;   
    else return undefined;
  }

  isOf(type:any):this is Class {
    return this instanceof type
  }

  hasMemberByNameAndAccessor(name:string, accessor:"static"|"instance"):tsmix.ClassMember | undefined {
    const members = this.getMembers();
    for(let member of members ) {
      if( member.name === name && member.getAccessor() === accessor ) return member
    }
    return undefined;
  }

  
}



