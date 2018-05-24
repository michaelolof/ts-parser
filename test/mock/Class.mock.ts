
import * as path from "path";
import use from "typescript-mix"

// #1
export class Mock {
  constructor(public caller: string, private name:string) { }
  methodOne(name: string) {
    return "name is: " + name;
  }
  static Controller() {
    console.log("I control stuffs");
  }
}

interface Mover {
  move(): void
}

interface Stayer {
  stay(): never
}

interface User extends Mover, Stayer { }
// #2
class User { 
  using() {
    console.log("I am using")
  }
}

// #3
class DecoratedClass {
  ///@ts-ignore
  @use( First ) this;
  name:string
  age:number
}

// #4
class Shopper {

  constructor(public name:string) {}

  shop() {
    console.log( this.name, "is going shopping" );
  }

}