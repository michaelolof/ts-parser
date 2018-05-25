import { SourceFile, createSourceFile, ScriptTarget, createProgram, ModuleKind, ModuleResolutionKind } from "typescript";

export function createMockSource(sourceText:string):SourceFile {
  return createSourceFile("mock.source.ts", sourceText, ScriptTarget.Latest );
}


export const mockFiles = {
  checker: "C:\\Users\\Michael\\Desktop\\M.O.O\\Programs\\custom-npm-modules\\ts-parser\\test\\mock\\Checker.mock.ts",
  class:`C:\\Users\\Michael\\Desktop\\M.O.O\\Programs\\custom-npm-modules\\ts-parser\\test\\mock\\Class.mock.ts`,
  interfaceClassMember: "C:\\Users\\Michael\\Desktop\\M.O.O\\Programs\\custom-npm-modules\\ts-parser\\test\\mock\\InterfaceClassMember.mock.ts",
}

const objectValues = (obj:object) => Object.keys( obj ).map( key => mockFiles[ key ]) as string[];

export const program = createProgram( objectValues( mockFiles ), {
  module: ModuleKind.CommonJS,
  moduleResolution: ModuleResolutionKind.NodeJs,
  noEmit: true,
  lib: ["es2017"],
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  rootDir: ".",
  declaration: true,
  target: ScriptTarget.ESNext,
})