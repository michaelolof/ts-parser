import { Variable } from '../src/Variable';
import { program, mockFiles } from './index.test';

describe("(class) Variable", () => {

  let variables:Variable[]

  before( async () => {
    const source = program.getSourceFile( mockFiles.variable )
    variables = await Variable.Find( source ); 
  });

  describe("Variable.getImplementedInterface()", () => {
    it("should...", () => {
      const variableOne = variables[0];
      variableOne.getImplementedInterface();
    });
  });

});