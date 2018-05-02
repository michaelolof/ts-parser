import * as ts from 'typescript';
import * as tsmix from "../tsmix";

export class Import {

  readonly filePath:string
  readonly importDeclaration:ts.ImportDeclaration;
  readonly moduleDeclaration:string;
  readonly moduleName:string;
  private __format:ImportFormat;
  
  constructor(importDeclaration:ts.ImportDeclaration, filePath:string) {
    this.filePath = filePath;
    this.importDeclaration = importDeclaration;
    this.moduleDeclaration = this.importDeclaration.moduleSpecifier["text"] as string;
    const moduleNameArr = this.moduleDeclaration.split("/");
    this.moduleName = moduleNameArr[ moduleNameArr.length - 1 ];
  }

  get format():ImportFormat {
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
      const propertyName = namedBindingsElement!["propertyName"] as ts.Identifier;
      const name = namedBindingsElement!["name"] as ts.Identifier;
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
    return new tsmix.ImportResolver( this.filePath ).resolve(this.moduleDeclaration, extension);
  }

  static isAImport(node:ts.Node):boolean {
    return node.kind === ts.SyntaxKind.ImportDeclaration;
  }


}

export enum ImportFormat {
  Default, // import a from "module"
  Object, // import { a, b } from "module"
  Namespaced // import * as a from "module"
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