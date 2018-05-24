import { InterfaceClassMember } from '../src/Member';
import { program, mockFiles } from './index.test';
import { findWhere } from '../src';
import { isClassDeclaration } from 'typescript';
import { Class } from '../src/Class';
import { expect } from 'chai';


describe("(class) => InterfaceClassMember.ts", () => {
  let members:InterfaceClassMember[] = [];

  before(async () => {
    const source = program.getSourceFile( mockFiles.interfaceClassMember );
    const _members = await InterfaceClassMember.FindWhere( source, "ClassMemberTester", program.getTypeChecker() );
    members = _members || []
    const cls = await findWhere( source, node => {
      if( isClassDeclaration( node ) && node.name.escapedText === "ClassMemberTester" ) {
        return new Class( node, source.fileName );
      }
    })
    // console.log( cls.getMembers().map( m => m.name ) );
  })

  describe("(propery) InterfaceClassMember.name", () => {
    it("should return the correct name for all members.", () => {
      expect( members[0].name ).to.be.deep.equal( "firstname" )
      expect( members[1].name ).to.be.deep.equal( "lastname" )
    })
  });

  describe("(method) InterfaceClassMember.getSymbolSignature()", () => {
    it("should...", () => {
      expect( members[0].getSymbolSignature(program.getTypeChecker()) ).to.deep.equal( "string" )
      expect( members[1].getSymbolSignature(program.getTypeChecker()) ).to.deep.equal( "string" )
      expect( members[2].getSymbolSignature(program.getTypeChecker()) ).to.deep.equal( "number" )
      expect( members[3].getSymbolSignature(program.getTypeChecker()) ).to.deep.equal( "string" )
      expect( members[4].getSymbolSignature(program.getTypeChecker()) ).to.deep.equal( "() => number" )
      expect( members[5].getSymbolSignature(program.getTypeChecker()) ).to.deep.equal( "string" )
    })
  });

})