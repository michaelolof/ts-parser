import { SymbolizedHolderArray, SymbolizedMember, SymbolizedHolder } from './Checker';
import { Mixin } from './Mixin';
import { Program as tsProgram, TypeChecker, } from 'typescript';
import { ThisCall } from './Statement';

export class Program {
  
  private program:tsProgram;
  checker:TypeChecker;
  
  constructor(program:tsProgram, public rootFiles?:ReadonlyArray<string>) {
    this.program = program;
    this.checker = program.getTypeChecker();
  }

  async getTypes(transform:TransformedUseLintTree) {
    let rootFiles = this.rootFiles;
    if( rootFiles === undefined ) rootFiles = this.program.getRootFileNames();
    
    const holders = new SymbolizedHolderArray();

    for(let file of rootFiles) {
      const source = this.program.getSourceFile( file );
      if( source === undefined ) { 
        console.error("source not found"); 
        continue; 
      }

      // Find all classes or variables in the file.
      const allClassesOrVariables = await Mixin.Find( source );
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
          const signature = member.getSymbolSignature( this.checker, classOrVariable.element );
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
            memberRange: member.getNameRange(),
            signature,
            type,
            accessor,
            methodThisCalls,
            methodsNoOfArguments
          })
        }
        holders.push( new SymbolizedHolder (
          classOrVariable.name,
          classOrVariable.getNameRange(),
          file,
          found.type,
          symbolizedMembers,
          found.mixins,
        ));
      }

    }

    return holders;
  }

}


export interface UseDecoratorSourceLintTree {
  filePath:string,
  clients: UseDecoratorSourceLintTreeClient[]
}

export interface UseDecoratorSourceLintTreeClient {
  name:string,
  mixins: UseDecoratorSourceLintTreeMixin[],
}

export interface UseDecoratorSourceLintTreeMixin {
  /**
   * If name is undefined, then don't lint it.
   * 
   */
  name:string|undefined,
  alias:string|undefined
  filePath:string
}


export interface TransformedUseLintTree {
  [filePath:string]: LintableArray
}

export interface Lintable {
  name:string,
  type:"client" | "mixin"
  mixins?:string[]
}

export class LintableArray {

  private hash:{[x:string]:Lintable} = {};

  constructor(...values:Lintable[]) {
    if( values === undefined ) return;
    for(let val of values) {
      this.hash[ JSON.stringify(val) ] = val;
    }
  }
  
  push(value:Lintable) {
    this.hash[ JSON.stringify(value) ] = value;
  }

  getTypeByName(name:string):string | undefined {
    const lintable = this.findByName( name );
    if( lintable ) return lintable.type;
    else return undefined;
  }

  findByName(name:string):Lintable | undefined {
    for(let hashVal in this.hash ) {
      const lintable = this.hash[ hashVal ];
      if( lintable.name === name ) return lintable
    }
    return undefined  
  }
 
  hasName(name:string):boolean {
    if( this.findByName( name ) ) return true;
    else return false; 
  }

  *[Symbol.iterator]() {
    for( let hashVals in this.hash ) {
      const val = this.hash[ hashVals ];
      yield val;
    }
  }
}
