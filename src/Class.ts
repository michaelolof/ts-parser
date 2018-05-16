import { ClassDeclaration, Symbol, TypeChecker, SourceFile, Node, SyntaxKind } from 'typescript';
import { SymbolizedMemberArray, SymbolizedHolder } from './Checker';
import { ClassMember, Method } from './Member';
import { Range } from './utilities';
import { find as _find } from "./utilities"
import { Variable } from './Variable';

export class Class {
  
  private __members:ClassMember[] | undefined;
  mixinNames?:string[];

  constructor(public element:ClassDeclaration, public filePath:string) {}

  get name() {
    return this.element.name!["escapedText"] as string
  }

  /**
   * Returns an array of ClassMembers if found and undefined if not found.
   */
  getMembers() {
    if( this.__members ) return this.__members;

    const memberElements = this.element.members
    this.__members = [];
    for( let memberElement of memberElements ) {
      const member = new ClassMember( memberElement, this.filePath );
      this.__members.push( member );
    }
    return this.__members;
  }

  getAllMembers() {
    console.log( this.element["localSymbol"]["exportSymbol"]["members"].keys() );
    throw new Error("Just die");
  }

  getMembersSymbol():Map<string,Symbol>| undefined {
    if( this.element["symbol"] === undefined ) return undefined;
    return this.element["symbol"].members
  }

  /**
   * Returns an array of tsmix.ClassMember if found and an empty array if not found.
   */
  hasMembersUsingDecorator(decoratorName:string):ClassMember[] {
    const members = this.getMembers();
    const membersUsingDecorators:ClassMember[] = []
    for(let member of members) {
      if( member.isUsingDecorator( decoratorName ) ) {
        membersUsingDecorators.push( member )
      }
    }
    return membersUsingDecorators;
  }

  getMemberUsingDecorator(decoratorName:string, memberName:string):ClassMember|undefined {
    const member = this.getMember( memberName );
    if( member === undefined ) return undefined;
    if( member.isUsingDecorator( decoratorName) ) return member;   
    else return undefined;
  }

  isOf(type:any):this is Class {
    return this instanceof type
  }

  hasMemberByNameAndAccessor(name:string, accessor:"static"|"instance"):ClassMember | undefined {
    const members = this.getMembers();
    for(let member of members ) {
      if( member.name === name && member.getAccessor() === accessor ) return member
    }
    return undefined;
  }

  static IsAClass(node:Node): node is ClassDeclaration {
    return node.kind === SyntaxKind.ClassDeclaration;
  }

  /**
   * Returns an array of all Class found in the source file.
   */
  static async Find(source:SourceFile) {
    return _find( source, (node) => {
      if( Class.IsAClass( node ) ) {
        return new Class( node, source.fileName  );
      }
      else return undefined;
    })
  }
  
}

export interface Class {
  getNameRange(source?:SourceFile):Range
  getMethods():Method[]
  getMember(name:string):ClassMember | undefined
  toSymbolizedHolder(type:"mixin"|"client", checker:TypeChecker): Promise<SymbolizedHolder>
  getMembersSymbolizedMemberArray(checker:TypeChecker):Promise<SymbolizedMemberArray>
}

//@ts-ignore
// Class.prototype.name = Variable.prototype.name
Class.prototype.getNameRange = Variable.prototype.getNameRange
Class.prototype.getMethods = Variable.prototype.getMethods
Class.prototype.getMember = Variable.prototype.getMember as any
Class.prototype.toSymbolizedHolder = Variable.prototype.toSymbolizedHolder
Class.prototype.getMembersSymbolizedMemberArray = Variable.prototype.getMembersSymbolizedMemberArray