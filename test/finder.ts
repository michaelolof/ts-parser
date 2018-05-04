import { find } from '../src/finder';
import { Node, createSourceFile, ScriptTarget } from 'typescript';
import { Class } from '../src/Class';
import { Import } from '../src/Import';
import { issa } from '../src';
import { Variable } from '../src/Variable';
import { expect } from "chai"

describe("(function) flexibleFind<T>(SourceFile, (node:Node)=>T|undefined, true):Promise<T[]|undefined>", () => {
  
  it("should return an array of classes, variables imports", async () => {
    
    const sourceText = `
      import * as path from "path";
      import { Assistant, Manager } from "./just-in-time"

      class Mock {
        propertyOne:string|undefined;
        methodOne(name:string) {
          return "name is: " + name;
        }
      }
      
      const name = "Joshua";

      interface Johnson {
        name:string,
        property:string,
        move():Promise<string>
      }

      const MichaelJohnson: Johnson = {
        name = "Michael",
        property = "manager",
        async move() {
          return name + property
        }
      }`;
      const source = createSourceFile( "mock.test.ts", sourceText, ScriptTarget.ESNext );
    
    const interests= await find<Class|Variable|Import>( source, condition );
    expect( interests ).to.not.be.deep.equal( undefined );
    if( interests === undefined ) return;
    expect( interests.length ).to.be.deep.equal( 4 );
    expect( interests[0] instanceof Import ).to.be.deep.equal( true );
    expect( interests[1] instanceof Import ).to.be.deep.equal( true );
    expect( interests[2] instanceof Class ).to.be.deep.equal( true );
    expect( interests[3] instanceof Variable ).to.be.deep.equal( true );
    function condition(node:Node) {
      if( issa._class( node ) ) {
        return new Class( node, source.fileName );
      }
      else
      if( issa.variable( node ) ) {
        return new Variable( node, source.fileName );
      }
      else
      if( Import.isAImport( node ) ) {
        return new Import( node, source.fileName )
      }
      else return undefined;
    }
  })
});