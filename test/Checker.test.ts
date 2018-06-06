import { SymbolizedHolder, SymbolizedMemberArray } from '../src/Checker';
import { Mixin } from '../src/Mixin';
import { program, mockFiles } from './index.test';
import { expect } from 'chai';

describe("(class) => SymbolizedHolder", () => {

  const mixinHolders:SymbolizedHolder[] = [];

  before( async () => {
    const source = program.getSourceFile( mockFiles.checker );
    const mixins = await Mixin.Find( source );
    for( let mixin of mixins ) {
      const holder = await mixin.toSymbolizedHolder( "mixin", program.getTypeChecker() )
      mixinHolders.push( holder );
    }
  })

  describe("(method) => getMemberProperties()", () => {
    let props:SymbolizedMemberArray;
    before( () => { props = mixinHolders[0].getMemberProperties() })
    
    it("(mock#1 SymbolizedHolderOne) should return an array of 4 members", () => {
      expect( props.length ).to.be.equal( 3 );
    });

    it("(mock#1 SymbolizedHolderOne) should return correct names for each member", () => {
      expect( props.array[0].memberName ).to.be.deep.equal("firstName");
      expect( props.array[1].memberName ).to.be.deep.equal("lastName");
      expect( props.array[2].memberName ).to.be.deep.equal("age");
    });

    it("(mock#1 SymbolizedHolderOne) should return correct signatures each member", () => {
      expect( props.array[0].signature ).to.be.deep.equal("string");
      expect( props.array[1].signature ).to.be.deep.equal("string");
      expect( props.array[2].signature ).to.be.deep.equal("number");
    });
  });

  describe("(method) => getMemberMethods()", () => {
    let holder:SymbolizedHolder;

    before(() => { holder = mixinHolders[ 1 ] })

    it("should..", () => {
      
    })
  });

})