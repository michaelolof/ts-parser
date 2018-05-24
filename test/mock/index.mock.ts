
import * as path from "path";
import use from "typescript-mix"

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
class User {
  using() {
    console.log("I am using")
  }
}

class DecoratedClass {
  ///@ts-ignore
  @use( First ) this;
  name:string
  age:number
}

