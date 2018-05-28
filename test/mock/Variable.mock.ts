
interface Negotiator {
  price:number 
  buy():void
  name:string;
}

interface Controller {
  price:string
  name:string;
  control():void
}

const User:Negotiator | Controller  = {
  price: 2,
  name: "John Doe",
  buy: () => console.log("I am buying"),
  control: () => console.log("Shoes are coming"),
}

const AnotherUser:Negotiator & Controller = {
  price: 2,
  name: "John Doe",
  buy: () => console.log("I am buying"),
  control: () => console.log("Shoes are coming"),
}