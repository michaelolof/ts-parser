import { Decorator as ts_Decorator } from 'typescript';
export declare class Decorator {
    readonly decoratorElement: ts_Decorator;
    readonly filePath: string;
    constructor(decoratorElement: ts_Decorator, filePath: string);
    readonly name: string;
    getArguments(): string[];
}
