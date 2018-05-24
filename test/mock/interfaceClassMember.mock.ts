
import use from "typescript-mix";

class ClassMemberTester {
  ///@ts-ignore
  @use( {} ) this;
  
  constructor(private firstname:string, private lastname:string, public age:number) {}
  
  get fullName() {
    return this.firstname + " " + this.lastname
  }
  getAge() {
    return this.age
  }

  static Logger() {
    console.log("I am a class member test logger");
  }
  ///@ts-ignore
  @normal decorated:string

}

class A {
  static methodA = () => console.log("shoes")
}

class B implements A {}


