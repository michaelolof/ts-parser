"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Class_1 = require("./Class");
var Variable_1 = require("./Variable");
var utilities_1 = require("./utilities");
exports.Mixin = {
    IsAMixin: function (node) {
        return Variable_1.Variable.IsAVariable(node) || Class_1.Class.IsAClass(node);
    },
    Find: function (source) {
        return utilities_1.find(source, function (node) {
            if (Class_1.Class.IsAClass(node))
                return new Class_1.Class(node, source.fileName);
            else if (Variable_1.Variable.IsAVariable(node))
                return new Variable_1.Variable(node, source.fileName);
            else
                return undefined;
        });
    }
};
//# sourceMappingURL=Mixin.js.map