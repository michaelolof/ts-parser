import * as path from 'path';
import { cleanUpFilePath } from './utilities';

export class ImportResolver {
  private originalPath:string;
  private originalPathArr:string[]
  private currentPath:string;
  private currentPathArr:string[];

  constructor( currentPath:string) {
    currentPath = cleanUpFilePath( currentPath );
    this.originalPath = path.resolve( currentPath );
    this.originalPathArr = this.originalPath.split( path.sep );
    this.currentPathArr = this.originalPathArr.slice();
    this.currentPathArr.pop();
    this.currentPath = this.currentPathArr.join( path.sep );
  }

  resolve( importPath:string, extension = "ts" ) {
    const importPathArr = importPath.split( ImportResolver.IMPORT_PART_SEPERATOR );
    const length = importPathArr.length;
    for( let i=0; i<length; i++ ) {
      let level = importPathArr[i];
      if( level === "." ) {
      } 
      else if( level === ".." ) {
        this.moveUpDirectory();
      }
      else {
        const remainingArr = importPathArr.slice( i, length );
        const remaining = remainingArr.join( path.sep );
        return this.mergeCurrentDirectoryWithModule( remaining, extension );
      } 
    }
    throw new EvalError("module name cannot be resolved.")
  }

  private moveUpDirectory() {
    this.currentPathArr.pop();
    this.currentPath = this.currentPathArr.join( path.sep );
  }

  private mergeCurrentDirectoryWithModule( remaining:string, extension:string ) {
    return this.currentPath + path.sep + remaining + "." + extension
  }

  private static readonly IMPORT_PART_SEPERATOR = "/";


}

