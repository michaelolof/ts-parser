"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Class_1 = require("./Class");
var Variable_1 = require("./Variable");
exports.Mixin = {
    IsAMixin: function (node) {
        return Variable_1.Variable.IsAVariable(node) || Class_1.Class.IsAClass(node);
    }
};
//# sourceMappingURL=Mixin.js.map