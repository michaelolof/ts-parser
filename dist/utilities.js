"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function find(source, condition, deepFind) {
    if (deepFind === void 0) { deepFind = true; }
    function find(onFound) {
        function iterator(sourceFile) {
            sourceFile.forEachChild(function (childNode) {
                var con = condition(childNode);
                if (con)
                    onFound(con);
                if (deepFind)
                    iterator(childNode);
            });
        }
        iterator(source);
    }
    var allPromises = [];
    find(function (t) {
        var promise = new Promise(function (resolve, reject) {
            if (t) {
                resolve(t);
            }
            else {
                reject("There was an issue. Sort it out.");
            }
        });
        allPromises.push(promise);
    });
    return Promise.all(allPromises);
}
exports.find = find;
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
var Severity;
(function (Severity) {
    Severity[Severity["Warning"] = 0] = "Warning";
    Severity[Severity["Error"] = 1] = "Error";
})(Severity = exports.Severity || (exports.Severity = {}));
//# sourceMappingURL=utilities.js.map