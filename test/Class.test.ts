import { Class } from '../src/Class';
import { expect } from "chai";
import { ClassMember } from '../src/Member';
import { createMockSource, program, mockFiles } from './index.test';
import { SourceFile } from "typescript";

describe("(class) => Class.ts", () => {

  let classOne:Class;
  let classTwo:Class;
  let source:SourceFile
  let mockClasses:Class[];

  before( async () => {
    const sourceText = `
      import * as path from "path";
      import { Assistant, Manager } from "./just-in-time"

      class Mock {
        @use( Assistant, Manager ) this;
        @stuff propertyOne:string|undefined;
        constructor(public caller:string) {}
        @stuff methodOne(name:string) {
          return "name is: " + name;
        }
        static Controller() {
          console.log("I control stuffs");
        }
      }
      
      interface Mover {
        move():void
      }

      interface Stayer {
        stay():never
      }

      interface User extends Mover, Stayer {} 
      class User {
        
      }`;
    source = createMockSource( sourceText );
    const classes = await Class.Find( source );
    if( classes === undefined ) throw new Error("couldn't find a class declaration in " + sourceText );
    classOne = classes[ 0 ];
    mockClasses = await Class.Find( program.getSourceFile( mockFiles.index ) );
    classTwo = mockClasses[0];
  })

  describe("(property) => Class.name", () => {
    it("should be equal to MockClass", () => {
      expect( classOne ).to.not.be.deep.equal( undefined );
      expect(classOne!.name).to.be.deep.equal("Mock")
    })
  });

  describe("(method) => Class.getNameRange(SourceFile?)", () => {

    it("should be equal {start:{line:0, character:6}, end:{line:0, character:15}}", async () => {
      expect( classOne ).to.not.be.deep.equal( undefined );
      const { start, end } = classOne!.getNameRange(source)
      expect( start.line ).to.be.deep.equal( 4 );
      expect( start.character ).to.be.deep.equal( 12 );
      expect( end.line ).to.be.deep.equal( 4 );
      expect( end.character ).to.be.deep.equal( 16 );
    });
  });

  describe("(method) => Class.getMembers()", () => {
    it("should return an array of 4 members", () => {
      expect(classOne.getMembers().length).to.be.deep.equal(4);
    })
  })

  describe("(method) => Class.getMember(string)", () => {
    it("should return a member which is an instance of ClassMember", () => {
      const member = classOne.getMember("methodOne");
      expect(member instanceof ClassMember).to.be.deep.equal(true);
    });

    it("should return undefined.", () => {
      const member = classOne.getMember("fieldTwo");
      expect(member).to.be.deep.equal(undefined);
    });
  });

  describe("(method) => Class.getInterfaceMembers()", () => {
    it("should return an array of 3 members", done => {
      const members = classTwo.getInterfaceMembers(program.getTypeChecker());
      expect( members.length ).to.be.deep.equal( 3 );
      done();
    })
  })

  describe("(method) => Class.getMembersSymbol()", () => {  });

  describe("(method) => Class.getMethods()", () => {
    it("should return an array of 1 member", () => {
      expect( classOne.getMethods().length ).to.be.deep.equal( 2 );
    })
  })


  describe("(method) => Class.hasMemberUsingDecorator()", () => {
    it("should return an array of class members", () => {
      expect( classOne.hasMembersUsingDecorator("stuff").length ).to.be.deep.equal( 2 );
      expect( classOne.hasMembersUsingDecorator("one").length ).to.be.deep.equal( 0 );
    })
  })

  describe("(method) => Class.getMemberUsingDecorator(string, string)", () => {
    it("should return an instance of ClassMember", () => {
      expect( classOne.getMemberUsingDecorator("use", "this")!.name ).to.be.deep.equal( "this" );
      expect( classOne.getMemberUsingDecorator("one", "this") ).to.be.deep.equal( undefined );
      expect( classOne.getMemberUsingDecorator("one", "half") ).to.be.deep.equal( undefined );
    })
  })

  describe("(method) => Class.hasMemberByNameAndAccessor(string, 'static'|'instance')", () => {
    it("should return an instance of ClassMember", () => {
      expect( classOne.hasMemberByNameAndAccessor("propertyOne", "instance") instanceof ClassMember ).to.be.deep.equal( true );
      expect( classOne.hasMemberByNameAndAccessor("Controller", "static") instanceof ClassMember ).to.be.deep.equal( true );
      expect( classOne.hasMemberByNameAndAccessor("methodOne", "instance") instanceof ClassMember ).to.be.deep.equal( true );
      expect( classOne.hasMemberByNameAndAccessor("methodOne", "static") instanceof ClassMember ).to.be.deep.equal( false );
      expect( classOne.hasMemberByNameAndAccessor("xxx", "instance") instanceof ClassMember ).to.be.deep.equal( false );
    })
  })

})