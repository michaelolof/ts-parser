import { ImportDeclaration, Identifier, Node, SyntaxKind } from 'typescript';
import { ImportResolver } from "./ImportResolver";

export class Import {

  readonly filePath:string
  readonly importDeclaration:ImportDeclaration;
  readonly moduleDeclaration:string;
  readonly moduleName:string;
  private __format:ImportFormat|undefined;
  
  constructor(importDeclaration:ImportDeclaration, filePath:string) {
    this.filePath = filePath;
    this.importDeclaration = importDeclaration;
    this.moduleDeclaration = this.importDeclaration.moduleSpecifier["text"] as string;
    const moduleNameArr = this.moduleDeclaration.split("/");
    this.moduleName = moduleNameArr[ moduleNameArr.length - 1 ];
  }

  get format():ImportFormat {
    if( this.__format === undefined ) {
      this.getImportedObjects()
      return this.__format!
    }
    return this.__format;
  }

  /**
   * Returns an array of all the objects imported.
   */
  getImportedObjects():ImportedObject[] {
    let namedBindings = this.importDeclaration!.importClause!.namedBindings;
    
    if (namedBindings === undefined) {
      var namedBindingsElements = [ this.importDeclaration.importClause ];
      this.__format = ImportFormat.Default;
    } else if( namedBindings["elements"] ) {
      namedBindingsElements = namedBindings["elements"];
      this.__format = ImportFormat.Object;
    } else if( namedBindings["name"] ) {
      namedBindingsElements = [ namedBindings as any ]
      this.__format = ImportFormat.Namespaced;
    } else {
      throw new RangeError("Import format is not recognized.")
    }

    const importMembers: ImportedObject[] = [];
    for (let namedBindingsElement of namedBindingsElements) {
      const propertyName = namedBindingsElement!["propertyName"] as Identifier;
      const name = namedBindingsElement!["name"] as Identifier;
      let memberName:string|undefined, memberAlias:string|undefined;

      if( this.__format === ImportFormat.Namespaced ) {
        memberName = undefined;
        memberAlias = name.escapedText as string;
      } else if( propertyName && name ) {
        memberName = propertyName.escapedText as string;
        memberAlias = name.escapedText as string;
      } else if( name ) {
        memberName = name.escapedText as string;
        memberAlias = undefined;
      }

      const importMember = new ImportedObject( this, memberName, memberAlias );
      importMembers.push( importMember )
    }
    return importMembers;
  }

  resolvePath(extension:string) {
    return new ImportResolver( this.filePath ).resolve(this.moduleDeclaration, extension);
  }

  static isAImport(node:Node):node is ImportDeclaration {
    return node.kind === SyntaxKind.ImportDeclaration;
  }

    /**
   * Locates a module in the source document. Returns the Import object if found and undefined if not found.
   */
  static findModule(name: string, imports:Import[]) {
    for( let imp of imports ) {
      if( imp.moduleName === name ) return imp;
    }
    return undefined;
  }

    /**
   * Locates and returns an imported object if found and undefined if not found.
   */
  static findObject(name:string, imports:Import[]):ImportedObject|undefined {
    for(let imp of imports) {
      const members = imp.getImportedObjects()
      for(let member of members) {
        if( member.alias ) {
          if( member.alias === name ) {
            return member;          }
        } else {
          if( member.name === name ) {
            return member;
          }
        }        
      }
    }
    return undefined;
  }


}

export enum ImportFormat {
  Default, // import a from "module"
  Object, // import { a, b } from "module"
  Namespaced, // import * as a from "module"
}

export class ImportedObject {
  
  /**
   * Refers to the location of the file in which the imported object is being used or imported to.
   */
  readonly toLocation:string
  /**
   * Refers to the location of the file in which the imported object was originally declared in
   * or imported from.
   */
  readonly fromLocation:string
  readonly name?:string;
  readonly alias?:string;
  
  constructor( parentImport:Import, name?:string, alias?:string) {
    this.name = name;
    this.alias = alias;
    this.toLocation = parentImport.filePath;
    this.fromLocation = parentImport.resolvePath("ts")
  }

  getAlias():string | Error {
    if( this.alias ) return this.alias
    else if( this.name ) return this.name;
    else return new Error("both this.alias and this.name are undefined. This function cannot work unless at least one of them is defined.")
  }


}