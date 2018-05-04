"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var Program = (function () {
    function Program(program) {
        this.program = program;
        this.checker = this.program.getTypeChecker();
    }
    Program.prototype.serializeSymbol = function (symbol) {
        return {
            name: symbol.name,
            documentation: typescript_1.displayPartsToString(symbol.getDocumentationComment(this.checker)),
            type: this.checker.typeToString(this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    };
    Program.prototype.serializeClass = function (symbol) {
        var details = this.serializeSymbol(symbol);
        var constructorType = this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType.getConstructSignatures().map(this.serializeSignature);
        return details;
    };
    Program.prototype.serializeSignature = function (signature) {
        return {
            parameters: signature.parameters.map(this.serializeSymbol),
            returnType: this.checker.typeToString(signature.getReturnType()),
            documentation: typescript_1.displayPartsToString(signature.getDocumentationComment(this.checker)),
        };
    };
    Program.prototype.isNodeExported = function (node) {
        return (typescript_1.getCombinedModifierFlags(node) & typescript_1.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === typescript_1.SyntaxKind.SourceFile);
    };
    return Program;
}());
exports.Program = Program;
//# sourceMappingURL=Program.js.map