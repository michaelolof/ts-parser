"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var utilities_1 = require("./utilities");
var Decorator = (function () {
    function Decorator(decoratorElement, filePath) {
        this.decoratorElement = decoratorElement;
        this.filePath = filePath;
    }
    Object.defineProperty(Decorator.prototype, "name", {
        get: function () {
            var n;
            n = this.decoratorElement.expression["escapedText"];
            if (n)
                return n;
            n = this.decoratorElement.expression["expression"].escapedText;
            if (n)
                return n;
            else
                throw new RangeError("Cannot get name of decorator. Inspect the object manually and update method").stack;
        },
        enumerable: true,
        configurable: true
    });
    Decorator.prototype.getArguments = function () {
        var args = [];
        var argsObj = this.decoratorElement.expression["arguments"];
        if (argsObj) {
            for (var _i = 0, argsObj_1 = argsObj; _i < argsObj_1.length; _i++) {
                var argObj = argsObj_1[_i];
                args.push(argObj.escapedText);
            }
        }
        return args;
    };
    Decorator.IsADecorator = function (node) {
        return node.kind === typescript_1.SyntaxKind.Decorator;
    };
    Decorator.Find = function (source) {
        return utilities_1.find(source, function (node) {
            if (Decorator.IsADecorator(node))
                return new Decorator(node, source.fileName);
            else
                return undefined;
        });
    };
    return Decorator;
}());
exports.Decorator = Decorator;
//# sourceMappingURL=Decorator.js.map