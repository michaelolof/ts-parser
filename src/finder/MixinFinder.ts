import { Mixin, MixinDeclaration } from "..";
import { SourceFile, Node, VariableDeclaration } from 'typescript';
import { flexibleFind } from './Finder';
import { issa } from "../utilities";
import { Class } from '../Class';
import { Variable } from '../Variable';

export class MixinFinder {
  allMixins:Mixin[];

  private constructor() {
  }

  static async New(source:SourceFile) {
    const finder = new MixinFinder();
    const condition = (node:Node) => {
      if( issa._class( node) ) return new Class( node, source.fileName )
      else return new Variable( node as VariableDeclaration, source.fileName )
    };
    let allMixins = await flexibleFind<Mixin>( source, condition );
    if( allMixins === undefined ) allMixins = [];
    finder.allMixins = allMixins;
    return finder;
  }

  /**
   * Returns a mixin by name from the array of allMixins if found.
   * Returns undefined if not found.
   */
  findMixin(name:string) {
    for( let mixin of this.allMixins ) {
      if( mixin.name === name ) return mixin
    }
    return undefined  
  }

}