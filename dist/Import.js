"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var ImportResolver_1 = require("./ImportResolver");
var Import = (function () {
    function Import(importDeclaration, filePath) {
        this.filePath = filePath;
        this.importDeclaration = importDeclaration;
        this.moduleDeclaration = this.importDeclaration.moduleSpecifier["text"];
        var moduleNameArr = this.moduleDeclaration.split("/");
        this.moduleName = moduleNameArr[moduleNameArr.length - 1];
    }
    Object.defineProperty(Import.prototype, "format", {
        get: function () {
            if (this.__format === undefined) {
                this.getImportedObjects();
                return this.__format;
            }
            return this.__format;
        },
        enumerable: true,
        configurable: true
    });
    Import.prototype.getImportedObjects = function () {
        var namedBindings = this.importDeclaration.importClause.namedBindings;
        if (namedBindings === undefined) {
            var namedBindingsElements = [this.importDeclaration.importClause];
            this.__format = ImportFormat.Default;
        }
        else if (namedBindings["elements"]) {
            namedBindingsElements = namedBindings["elements"];
            this.__format = ImportFormat.Object;
        }
        else if (namedBindings["name"]) {
            namedBindingsElements = [namedBindings];
            this.__format = ImportFormat.Namespaced;
        }
        else {
            throw new RangeError("Import format is not recognized.");
        }
        var importMembers = [];
        for (var _i = 0, namedBindingsElements_1 = namedBindingsElements; _i < namedBindingsElements_1.length; _i++) {
            var namedBindingsElement = namedBindingsElements_1[_i];
            var propertyName = namedBindingsElement["propertyName"];
            var name = namedBindingsElement["name"];
            var memberName = void 0, memberAlias = void 0;
            if (this.__format === ImportFormat.Namespaced) {
                memberName = undefined;
                memberAlias = name.escapedText;
            }
            else if (propertyName && name) {
                memberName = propertyName.escapedText;
                memberAlias = name.escapedText;
            }
            else if (name) {
                memberName = name.escapedText;
                memberAlias = undefined;
            }
            var importMember = new ImportedObject(this, memberName, memberAlias);
            importMembers.push(importMember);
        }
        return importMembers;
    };
    Import.prototype.resolvePath = function (extension) {
        return new ImportResolver_1.ImportResolver(this.filePath).resolve(this.moduleDeclaration, extension);
    };
    Import.isAImport = function (node) {
        return node.kind === typescript_1.SyntaxKind.ImportDeclaration;
    };
    Import.findModule = function (name, imports) {
        for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
            var imp = imports_1[_i];
            if (imp.moduleName === name)
                return imp;
        }
        return undefined;
    };
    Import.findObject = function (name, imports) {
        for (var _i = 0, imports_2 = imports; _i < imports_2.length; _i++) {
            var imp = imports_2[_i];
            var members = imp.getImportedObjects();
            for (var _a = 0, members_1 = members; _a < members_1.length; _a++) {
                var member = members_1[_a];
                if (member.alias) {
                    if (member.alias === name) {
                        return member;
                    }
                }
                else {
                    if (member.name === name) {
                        return member;
                    }
                }
            }
        }
        return undefined;
    };
    return Import;
}());
exports.Import = Import;
var ImportFormat;
(function (ImportFormat) {
    ImportFormat[ImportFormat["Default"] = 0] = "Default";
    ImportFormat[ImportFormat["Object"] = 1] = "Object";
    ImportFormat[ImportFormat["Namespaced"] = 2] = "Namespaced";
})(ImportFormat = exports.ImportFormat || (exports.ImportFormat = {}));
var ImportedObject = (function () {
    function ImportedObject(parentImport, name, alias) {
        this.name = name;
        this.alias = alias;
        this.toLocation = parentImport.filePath;
        this.fromLocation = parentImport.resolvePath("ts");
    }
    ImportedObject.prototype.getAlias = function () {
        if (this.alias)
            return this.alias;
        else if (this.name)
            return this.name;
        else
            return new Error("both this.alias and this.name are undefined. This function cannot work unless at least one of them is defined.");
    };
    return ImportedObject;
}());
exports.ImportedObject = ImportedObject;
//# sourceMappingURL=Import.js.map