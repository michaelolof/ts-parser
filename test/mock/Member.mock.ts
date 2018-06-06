class MemberSetOne {
  private age:number
  
  constructor(public firstName:string, public lastName:string, age:number) {
    this.age = age;
  }

  getAge() {
    return this.age;
  }

  get fullName() {
    return this.firstName + " " + this.lastName;
  }

  set fullName(name:string) {
    const names = name.split(" ");
    this.firstName = names[0];
    this.lastName = names[1];
  }

  set location(id:number) {
    console.log("Shit! I'm lost")
  }

  static LogIt() {
    return "MemberSetOne static logger"
  }

}