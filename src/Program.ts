import { 
  Program as tsProgram, Symbol, displayPartsToString, TypeChecker, Signature, Node, 
  getCombinedModifierFlags, ModifierFlags, SyntaxKind } from 'typescript';
import { TransformedUseLintTree } from './linter/trees';
import { finder, Variable } from '.';
import { issa } from './utilities';
import { Class } from './Class';
import { SymbolizedHolder, SymbolizedMember, SymbolizedHolderArray } from './Checker';
import { ThisCall } from './Statement';
import { TextDocument } from 'vscode-languageserver/lib/main';

export class Program {
  
  private program:tsProgram;
  checker:TypeChecker;
  
  constructor(program:tsProgram) {
    this.program = program;
    this.checker = this.program.getTypeChecker();
  }

  async getTypes(textDocument:TextDocument, transform:TransformedUseLintTree) {
    const rootFiles = this.program.getRootFileNames();
    const self = this;
    const holders = new SymbolizedHolderArray();

    for(let file of rootFiles) {
      const source = this.program.getSourceFile( file );
      if( source === undefined ) { 
        console.error("source not found"); 
        continue; 
      }

      // Find all classes or variables in the file.
      const allClassesOrVariables = 
        await finder.flexibleFind<Class | Variable>( source, condition );
      if( allClassesOrVariables === undefined ) { 
        console.error(`Strange No classes or variable found in file:${file}`);
        continue;
      }

      // Check if class or variable is lintable
      const lintables = transform[ file ]

      for(let classOrVariable of allClassesOrVariables) {
        const found = lintables.findByName( classOrVariable.name );
        if( found === undefined ) continue;

        const symbolizedMembers = [] as SymbolizedMember[];
        const members = classOrVariable.getMembers();
        for(let member of members) {
          const signature = member.getSymbolSignature( self.checker, classOrVariable.element );
          let type:"property" | "method" = "property";
          let methodThisCalls:ThisCall[] | undefined = undefined;
          let methodsNoOfArguments:number|undefined = undefined;
          if( member.isAMethod() ) {
            type = "method";
            methodThisCalls = await member.getMethodBodyThisCalls();
            methodsNoOfArguments = member.getMethodNumberOfArguments();
          }
          let accessor = member.getAccessor();
          symbolizedMembers.push({
            memberName: member.name,
            memberRange: member.getNameRange(textDocument),
            signature,
            type,
            accessor,
            methodThisCalls,
            methodsNoOfArguments
          })
        }
        holders.push( new SymbolizedHolder(
          classOrVariable.name,
          classOrVariable.getNameRange( textDocument ),
          file,
          found.type,
          symbolizedMembers,
          found.mixins,
        ));
      }

    }

    return holders;

    function condition(node:Node):Class | Variable | undefined {
      if( issa.variable( node ) ) return new Variable( node, "" );
      else
      if( issa._class( node ) ) return new Class( node, "" );
      else return undefined;  
    }
  }
  
  serializeSymbol(symbol:Symbol):DocEntry {
    return {
      name: symbol.name,
      documentation: displayPartsToString( symbol.getDocumentationComment( this.checker ) ),
      type: this.checker.typeToString( this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration! ) )
    }
  }

  serializeClass(symbol:Symbol):DocEntry {
    let details = this.serializeSymbol(symbol);

    // get constructor signature.
    const constructorType = this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration! );
    details.constructors = constructorType.getConstructSignatures().map( this.serializeSignature );
    return details;
  }
  
  serializeSignature(signature:Signature):DocEntry {
    return {
      parameters: signature.parameters.map( this.serializeSymbol ),
      returnType: this.checker.typeToString( signature.getReturnType() ),
      documentation: displayPartsToString( signature.getDocumentationComment(this.checker) ),
    }
  }

  isNodeExported(node:Node) {
    return ( getCombinedModifierFlags(node) & ModifierFlags.Export ) !== 0 || (!!node.parent && node.parent.kind === SyntaxKind.SourceFile );
  }
 
}

export interface DocEntry {
  name?:string,
  fileName?:string,
  documentation?:string,
  type?:string,
  constructors?:DocEntry[]
  parameters?:DocEntry[];
  returnType?:string
}
