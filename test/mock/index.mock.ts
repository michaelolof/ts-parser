
import * as path from "path";
import use from "typescript-mix"

class Mock {
  constructor(public caller: string) { }
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