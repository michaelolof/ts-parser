import { ThisCall } from './Statement';
import { Range } from "./utilities";

export class SymbolizedHolder {
  constructor(
    public readonly holderName:string,
    public readonly holderRange:Range,
    public readonly filePath:string,
    public readonly type: "mixin" | "client",
    public readonly members:SymbolizedMember[],
    public readonly mixins?:string[],
  ){}

  getMemberProperties(): SymbolizedMemberArray {
    const propMembers = new SymbolizedMemberArray();
    for(let member of this.members) {
      if( member.type === "property" ) propMembers.push( member );
    }
    return propMembers;
  }

  getMemberMethods(): SymbolizedMemberArray {
    const methodMembers = new SymbolizedMemberArray();
    for(let member of this.members) {
      if( member.type === "method" ) methodMembers.push( member );
    }
    return methodMembers;
  }

  /**
   * Checks if the client has member with the same name.
   */
  
}

export class SymbolArray<T> {

  array:T[]

  constructor(...symbol:T[]) {
    this.array = symbol;
  }

  *[Symbol.iterator]() {
    for(let val of this.array) {
      yield val;
    }
  }

  push(...symbol:T[]) {
    this.array.push( ...symbol );
  }

  forEach( calback:(value:T, index:number) => void) {
    this.array.forEach( calback );
  }

  *[Symbol.toStringTag]() {
    return this.array.toString();
  }

  get length() {
    return this.array.length;
  }

  contains( member:T, condition:(thisMeber:T, member:T) => boolean ) {
    for(let m of this.array) {
      if( condition( m, member ) ) return true
    }
    return false;
  }

}

export class SymbolizedHolderArray extends SymbolArray<SymbolizedHolder> {


  findClients():SymbolizedHolderArray {
    const clients = new SymbolizedHolderArray();
    for(let symbol of this.array ) {
      if( symbol.type === "client") clients.push( symbol );
    }
    return clients;
  }

  getSymbolByName(name:string):SymbolizedHolder | undefined {
    for(let symbol of this.array) {
      if( symbol.holderName === name ) return symbol;
    }
    return undefined
  }

}

export class SymbolizedMember {
  constructor(
    public type:"property" | "method",
    public memberName:string,
    public memberRange:Range,
    public signature:string,
    public accessor:"static" | "instance",
    public methodThisCalls?:ThisCall[],
    public methodsNoOfArguments?:number,
  ){}
}

export class SymbolizedMemberArray extends SymbolArray<SymbolizedMember> {
  doesntHaveMember(member:SymbolizedMember) {
    return this.array.filter( arrMember => arrMember.memberName !== member.memberName && arrMember.signature !== member.signature)
  }
  
  hasThisCallMember(thisCall:ThisCall) {
    for(let m of this.array) {
      if( m.memberName === thisCall.name ) {
        return true
      }
    }
    return false;
  }
}
