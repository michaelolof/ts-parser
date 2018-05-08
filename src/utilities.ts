import { Identifier, Node, SyntaxKind, SourceFile, Token, ImportDeclaration, DiagnosticCategory } from 'typescript';

export function getInlineRangeFromPosition(namedElement:Identifier,  source:SourceFile = namedElement.getSourceFile(), name = namedElement.escapedText as string) {
  const endPosition:Position = source.getLineAndCharacterOfPosition( namedElement.end ) 
  const startPosition:Position = { line: endPosition.line, character: endPosition.character - name.length };
  return {
    start: startPosition,
    end: endPosition,
  } as Range
}

export function createErrorDiagnostic(source:string, range:Range, message:string, code?:string):Diagnostic {
  return {
    range,
    message,
    code,
    severity: DiagnosticCategory.Error,
    source,
  }
}

export function cleanUpFilePath(filePath:string) {
  if( filePath.startsWith("file:///") ) filePath = filePath.substr( 8 )
  filePath = filePath.replace( "%3A", ":")
  return filePath; 
}

export function find<T>(source: SourceFile, condition: (node: Node) => (T|undefined), deepFind = true):Promise<T[] | undefined> {
  function find(onFound: (t: T) => void) {
    function iterator(sourceFile: SourceFile | Node) {
      sourceFile.forEachChild(childNode => {
        // Only a class can use a decorator. So we search for classes.
        const con = condition(childNode)
        if( con ) onFound( con );
        if (deepFind) iterator(childNode);
      });
    }
    iterator(source);
  }

  const allPromises: Promise<T>[] = [];

  find(t => {
    const promise = new Promise<T>((resolve, reject) => {
      if (t) {
        resolve(t)
      } else {
        reject("There was an issue. Sort it out.");
      }
    });
    allPromises.push(promise);
  })

  return Promise.all(allPromises);

}


export function extractImportsFromSource(source:SourceFile):ImportDeclaration[]|undefined {
  const imports = source["imports"] as Token<SyntaxKind.ImportDeclaration>[];
  return imports.map( imp => imp.parent as ImportDeclaration )
}
 
export function getImportFromSourceByModuleName(moduleName:string, source:SourceFile):ImportDeclaration|undefined {
  const importTokens = source["imports"] as Token<SyntaxKind.ImportDeclaration>[];
  for(let token of importTokens) {
    const path = token["text"] as string;
    if( path.endsWith( moduleName ) ) return token.parent as ImportDeclaration;
  }
  return undefined;
}

export type Diagnostic = {
  range:Range,
  message:string,
  code?:string,
  severity: DiagnosticCategory,
  source:string,
}


export type Position = {
  line:number,
  character:number,
}

export type Range = {
  start:Position,
  end:Position,
}

