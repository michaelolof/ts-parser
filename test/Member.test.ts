import { Class } from '../src/Class';
import { program, mockFiles } from './index.test';
import { Member } from '../src/Member';
import { expect } from "chai";

describe("(class) => Member.ts", () => {

  let memberSetOne:Member[]

  before(async () => {
    const source = program.getSourceFile( mockFiles.member )
    const classes = await Class.Find( source );
    memberSetOne = classes[0].getInterfaceMembers( program.getTypeChecker() );
  });

  describe("Member.getType", () => {
    it("should return the correct method type", () => {
      expect( memberSetOne[0].getType() ).to.deep.equal( "property" )
      expect( memberSetOne[1].getType() ).to.deep.equal( "property" )
      expect( memberSetOne[2].getType() ).to.deep.equal( "property" )
      expect( memberSetOne[3].getType() ).to.deep.equal( "method" )
      expect( memberSetOne[4].getType() ).to.deep.equal( "getter" )
      expect( memberSetOne[5].getType() ).to.deep.equal( "setter" )
    });
  });
  


});

