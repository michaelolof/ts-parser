"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
function getInlineRangeFromPosition(namedElement, source, name) {
    if (source === void 0) { source = namedElement.getSourceFile(); }
    if (name === void 0) { name = namedElement.escapedText; }
    var endPosition = source.getLineAndCharacterOfPosition(namedElement.end);
    var startPosition = { line: endPosition.line, character: endPosition.character - name.length };
    return {
        start: startPosition,
        end: endPosition,
    };
}
exports.getInlineRangeFromPosition = getInlineRangeFromPosition;
function createErrorDiagnostic(source, range, message, code) {
    return {
        range: range,
        message: message,
        code: code,
        severity: Severity.Error,
        source: source,
    };
}
exports.createErrorDiagnostic = createErrorDiagnostic;
function cleanUpFilePath(filePath) {
    if (filePath.startsWith("file:///"))
        filePath = filePath.substr(8);
    filePath = filePath.replace("%3A", ":");
    return filePath;
}
exports.cleanUpFilePath = cleanUpFilePath;
var issa;
(function (issa) {
    function variable(node) {
        var otherTruths = node["initializer"] && node["type"] && node["initializer"].kind === typescript_1.SyntaxKind.ObjectLiteralExpression;
        if (otherTruths) {
            return typescript_1.isVariableDeclaration(node);
        }
        else
            return false;
    }
    issa.variable = variable;
    function _class(node) {
        return node.kind === typescript_1.SyntaxKind.ClassDeclaration;
    }
    issa._class = _class;
    function mixin(node) {
        return issa.variable(node) || issa._class(node);
    }
    issa.mixin = mixin;
})(issa = exports.issa || (exports.issa = {}));
var Severity;
(function (Severity) {
    Severity[Severity["Warning"] = 0] = "Warning";
    Severity[Severity["Error"] = 1] = "Error";
})(Severity = exports.Severity || (exports.Severity = {}));
function getImportFromSourceByModuleName(moduleName, source) {
    var importTokens = source["imports"];
    for (var _i = 0, importTokens_1 = importTokens; _i < importTokens_1.length; _i++) {
        var token = importTokens_1[_i];
        var path = token["text"];
        if (path.endsWith(moduleName))
            return token.parent;
    }
    return undefined;
}
exports.getImportFromSourceByModuleName = getImportFromSourceByModuleName;
//# sourceMappingURL=utilities.js.map