
/**
 * @mock 1
 */
class SymbolizedHolderOne {
  constructor(public firstName:string, public lastName:string, private age:number) {}

  get fullName() {
    return this.firstName + " " + this.lastName;
  }

  getBio() {
    return `${ this.fullName } is ${ this.age } years old.`
  }

}