import { SourceFile, createSourceFile, ScriptTarget } from "typescript";

export function createMockSource(sourceText:string):SourceFile {
  return createSourceFile("mock.source.ts", sourceText, ScriptTarget.Latest );
}