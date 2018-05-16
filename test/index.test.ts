import { SourceFile, createSourceFile, ScriptTarget, createProgram } from "typescript";

export function createMockSource(sourceText:string):SourceFile {
  return createSourceFile("mock.source.ts", sourceText, ScriptTarget.Latest );
}


export const mockFiles = {
  index:`C:\\Users\\Michael\\Desktop\\M.O.O\\Programs\\custom-npm-modules\\ts-parser\\test\\mock\\index.mock.ts`,
}

const objectValues = (obj:object) => Object.keys( obj ).map( key => mockFiles[ key ]) as string[];

export const program = createProgram( objectValues( mockFiles ), {} )