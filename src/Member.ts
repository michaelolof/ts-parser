import { Node, SyntaxKind, MethodDeclaration, SourceFile, Block, TypeChecker, Symbol, Identifier }  from 'typescript';
import { Decorator } from './Decorator';
import { ThisCall } from './Statement';
import { getInlineRangeFromPosition, Range } from './utilities';
import { SymbolizedMember } from './Checker';
import { find } from '.';

export class Member {
  readonly element:Node;
  readonly filePath:string;

  constructor(memberElement:Node, filePath:string) {
    this.element = memberElement;
    this.filePath = filePath;
  }

  get name() {
    if( this.element.kind === SyntaxKind.Constructor ) return "constructor"
    else return this.element["name"].escapedText as string
  }

  isAMethod() {
    return Method.isAMethod( this.element );
  }

  getSymbolSignature( checker:TypeChecker, node?:Node) {
    if( node === undefined ) node = this.element;
    const symbol = this.element[ "symbol" ] as Symbol;
    return checker.typeToString( checker.getTypeOfSymbolAtLocation( symbol, node ) );
  }

  async getSymbolizedMember(checker:TypeChecker, node?:Node) {
    let type:"method"|"property" = "property"
    let methodThisCall:ThisCall[]|undefined = undefined;
    if( this.isAMethod() ) {
      type = "method";
      methodThisCall = await this.getMethodBodyThisCalls();
      var noOfArguments:number|undefined = this.getMethodNumberOfArguments();  
    }
    return new SymbolizedMember( 
      type,
      this.name,
      this.getNameRange(),
      this.getSymbolSignature( checker, node),
      this.getAccessor(),
      methodThisCall,
      noOfArguments,
    );
  }

  getAccessor():"static" | "instance" {
    if( this.element.modifiers ) {
      for(let modifier of this.element.modifiers)
        if( modifier.kind == SyntaxKind.StaticKeyword ) return "static"
    };
    return "instance"
  }

  getNameRange():Range {
    if( this.element.kind === SyntaxKind.Constructor ) return {} as Range
    return getInlineRangeFromPosition( this.element["name"] as Identifier )    
  }

  getMethodBodyThisCalls() {
    const methodBody = (this.element["body"] as Node).getFullText();
    const calls = ThisCall.Find( methodBody );
    return calls;
  }

  getMethodNumberOfArguments() {
    // console.log( this.element );
    return this.element["parameters"].length as number;
  }
}

export class ClassMember extends Member {
  
  getDecorators() {
    const dec:Decorator[] = [];
    const decorators = this.element.decorators;
    if( decorators === undefined ) return dec;

    for(let decorator of decorators ) {
      const d = new Decorator( decorator, this.filePath );
      dec.push( d );
    }
    return dec;
  }

  isUsingDecorator(decoratorName:string):boolean {
    const decorators = this.getDecorators();
    if( decorators.length === 0 ) return false

    for(let decorator of decorators) {
      if( decoratorName === decorator.name ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns an instance of the tsmix.Decorator class if found and undefined if not found.
   */
  getDecorator(decoratorName:string):Decorator | undefined {
    const decorators = this.getDecorators();
    for(let decorator of decorators) {
      if( decoratorName === decorator.name ) return decorator;
    }
    return undefined;
  }

}

export class VariableMember extends Member {}

export class Method extends Member {
  
  constructor(public element:MethodDeclaration, filePath:string) {
    super(element, filePath)
  }
  
  get body():Block|undefined {
    return this.element.body;
  }

  static isAMethod(node:Node) {
    return node.kind === SyntaxKind.MethodDeclaration;
  }

  /**
   * Checks if a string resembles a method call.
   */
  static isStringAMethod(method:string) {
    return ( method.includes("(") && method.includes(")") )
  }

  static getMethods(members:Member[]) {
    const methods:Method[] = [];
    for(let member of members) {
      if( Method.isAMethod(member.element) ) {
        methods.push( new Method( member.element as MethodDeclaration, member.filePath ) );
      }
    }
    return methods;
  }

  static FindAll(source:SourceFile, node?:Node) {
    let n:SourceFile | Node = source;
    if( node ) n = node;
    const condition = (node:Node) => {
      if( Method.isAMethod( node ) ) return new Method( node as MethodDeclaration, source.fileName );
      else return undefined; 
    }
    return find<Method>( n as any, condition );
  }

}



