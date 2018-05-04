import { Identifier, isVariableDeclaration, VariableDeclaration, Node, ClassDeclaration, SyntaxKind, } from 'typescript';
import { MixinDeclaration } from './Mixin';

export function getInlineRangeFromPosition(namedElement:Identifier,  source = namedElement.getSourceFile(), name = namedElement.escapedText as string) {
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
    severity: Severity.Error,
    source,
  }
}

export function cleanUpFilePath(filePath:string) {
  if( filePath.startsWith("file:///") ) filePath = filePath.substr( 8 )
  filePath = filePath.replace( "%3A", ":")
  return filePath; 
}

export namespace issa {
  export function variable(node:Node): node is VariableDeclaration  {
    const otherTruths = node["initializer"] && node["type"] && node["initializer"].kind === SyntaxKind.ObjectLiteralExpression
    if( otherTruths ) {
      return isVariableDeclaration( node );
    }
    else return false
  }

  export function _class(node:Node): node is ClassDeclaration {
    return node.kind === SyntaxKind.ClassDeclaration;
  }

  export function mixin(node:Node): node is MixinDeclaration {
    return  issa.variable( node ) || issa._class( node );
  }
}

export type Diagnostic = {
  range:Range,
  message:string,
  code?:string,
  severity: Severity,
  source:string,
}

export enum Severity {
  Warning,
  Error,
}

export type Position = {
  line:number,
  character:number,
}

export type Range = {
  start:Position,
  end:Position,
}


