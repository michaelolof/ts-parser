import { Decorator as ts_Decorator, Node, SourceFile } from 'typescript';
export declare class Decorator {
    readonly decoratorElement: ts_Decorator;
    readonly filePath: string;
    constructor(decoratorElement: ts_Decorator, filePath: string);
    readonly name: string;
    getArguments(): string[];
    static IsADecorator(node: Node): node is ts_Decorator;
    static Find(source: SourceFile): Promise<Decorator[] | undefined>;
}
