import { Node, CallExpression, ExpressionStatement } from "typescript";
export declare type ThisCallType = "property" | "method";
export declare type ThisCallAccessor = "instance" | "static";
export declare abstract class ThisCall {
    element: CallExpression | ExpressionStatement;
    code: string;
    name: string;
    abstract accessor: "static" | "instance";
    abstract type: "method" | "property";
    abstract inferSignature(): number | "any";
    constructor(element: CallExpression | ExpressionStatement);
    static FindAll(body: Node): Promise<ThisCall[] | undefined>;
}
export declare abstract class MethodThisCall extends ThisCall {
    element: CallExpression;
    abstract accessor: "static" | "instance";
    type: "method";
    constructor(element: CallExpression);
    inferSignature(): number;
}
export declare abstract class PropertyThisCall extends ThisCall {
    element: ExpressionStatement;
    abstract accessor: "static" | "instance";
    type: "property";
    constructor(element: ExpressionStatement);
    inferSignature(): "any";
}
export declare class InstanceMethodThisCall extends MethodThisCall {
    accessor: "instance";
    constructor(element: CallExpression);
}
export declare class StaticMethodThisCall extends MethodThisCall {
    element: CallExpression;
    accessor: "static";
    constructor(element: CallExpression);
}
export declare class IntsancePropertyThisCall extends PropertyThisCall {
    element: ExpressionStatement;
    accessor: "instance";
    constructor(element: ExpressionStatement);
}
export declare class StaticPropertyThisCall extends PropertyThisCall {
    element: ExpressionStatement;
    accessor: "static";
    constructor(element: ExpressionStatement);
}
