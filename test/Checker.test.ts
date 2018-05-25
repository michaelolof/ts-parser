import { SymbolizedHolder, SymbolizedHolderArray, SymbolizedMemberArray } from '../src/Checker';
import { Mixin } from '../src/Mixin';
import { program, mockFiles } from './index.test';
import { expect } from 'chai';

describe("(class) => SymbolizedHolder", () => {

  const mixinHolders:SymbolizedHolder[] = [];

  before( async () => {
    const source = program.getSourceFile( mockFiles.checker );
    const mixins = await Mixin.Find( source );
    mixins
    .map( async mixin => await mixin.toSymbolizedHolder("mixin", program.getTypeChecker() ) )
    .map( async holder => mixinHolders.push( await holder ) );
  })

  describe("(method) => getMemberProperties()", () => {
    let props:SymbolizedMemberArray;
    before( () => { props = mixinHolders[0].getMemberProperties() })
    
    it("(mock#1 SymbolizedHolderOne) should return an array of 4 members", () => {
      expect( props.length ).to.be.equal( 4 );
    });

    it("(mock#1 SymbolizedHolderOne) should return correct names for each member", () => {
      expect( props.array[0].memberName ).to.be.deep.equal("firstName");
      expect( props.array[1].memberName ).to.be.deep.equal("lastName");
      expect( props.array[2].memberName ).to.be.deep.equal("age");
      expect( props.array[3].memberName ).to.be.deep.equal("fullName");
    });

    it("(mock#1 SymbolizedHolderOne) should return correct signatures each member", () => {
      expect( props.array[0].signature ).to.be.deep.equal("string");
      expect( props.array[1].signature ).to.be.deep.equal("string");
      expect( props.array[2].signature ).to.be.deep.equal("number");
      expect( props.array[3].signature ).to.be.deep.equal("string");
    });
  });

  

})