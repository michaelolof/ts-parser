import { ImportDeclaration, SourceFile, Node } from "typescript";
import { ImportedObject, Import, finder } from "../../tsmix";

export class ImportFinder {

  imports:Import[];

  private constructor() {
  }

  static async New(source:SourceFile): Promise<ImportFinder> {
    const importFinder = new ImportFinder();
    const instantiator = (dec:Node) => new Import( dec as ImportDeclaration, source.fileName );
    importFinder.imports = await finder.find<Import>( source, Import.isAImport, instantiator, false ); 
    return importFinder;
  }

  /**
   * Locates a module in the source document. Returns the Import object if found and undefined if not found.
   */
  findModule(name: string) {
    const imports = this.imports;
    for( let imp of imports ) {
      if( imp.moduleName === name ) return imp;
    }
    return undefined;
  }

  /**
   * Locates and returns an imported object if found and undefined if not found.
   */
  findObject(name:string):ImportedObject|undefined {
    for(let imp of this.imports) {
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


