import { Node, SourceFile, ClassDeclaration } from "typescript"
import { Class } from '../Class';
import { find } from './Finder';
import { issa } from "../utilities";

export class ClassFinder {
  
  allClasses:Class[]

  private constructor() {}

  static async New(source:SourceFile):Promise<ClassFinder> {
    const finder = new ClassFinder();
    const instantiator = (dec:Node) => new Class( dec as ClassDeclaration, source.fileName );
    finder.allClasses = await find<Class>( source, issa._class, instantiator ) 
    return finder;
  }

}