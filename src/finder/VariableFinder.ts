/**
 * Note about finding Variables.
 * ----------------------------------------------------
 * As far tsmix-linter is concerned when, we say variables we are only
 * interested in variable objects which probably have methods and properties.
 * tsmix-linter is not interested in random ordinary variables like that of strings, numbers,
 * arrays. etc. even though these are accepeted variables in typescript language.
 * 
 * This posses perculiar situation. Ideally we are only interested in variable mixins
 * that is, variable objects that can be used as mixins.
 * In order for tsmix-linter to work well, it is advised that varaible declarations implement
 * an interface. Thus we are poised with 2 scenarios:
 * (1). We enforce our rule, that all variable mixins must implement an interface,
 *      we do this by checking if node["type"] is defined e.g:
 *      (a) node.kind === ts.SyntaxKind.VariableDeclaration && node["initializer"] && node["type"] && node.initializer.kind === ts.SyntaxKind.ObjectLiteralExpression 
 * (2). We don't enforce the rule .
 *      (a) node.kind === ts.SyntaxKind.VariableDeclaration && node["initializer"] && node.initializer.kind === ts.SyntaxKind.ObjectLiteralExpression 
*/
import { Variable } from '../Variable';
import { SourceFile, Node, VariableDeclaration } from 'typescript';
import { find } from './Finder';
import { issa } from '../utilities';

export class VariableFinder {

  allVariables:Variable[];

  private constructor() {}

  static async New(source:SourceFile) {
    const finder = new VariableFinder();
    const instantiator = (dec:Node) => new Variable( dec as VariableDeclaration, source.fileName );
    finder.allVariables = await find<Variable>( source, issa.variable, instantiator );
    return finder;
  }

}