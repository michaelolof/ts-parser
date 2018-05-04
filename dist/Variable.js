"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./utilities");
var Member_1 = require("./Member");
var Variable = (function () {
    function Variable(variable, filePath) {
        this.element = variable;
        this.filePath = filePath;
    }
    Object.defineProperty(Variable.prototype, "name", {
        get: function () {
            return this.element.name["escapedText"];
        },
        enumerable: true,
        configurable: true
    });
    Variable.prototype.isOf = function (type) {
        return this instanceof type;
    };
    Variable.prototype.getNameRange = function () {
        return utilities_1.getInlineRangeFromPosition(this.element.name);
    };
    Variable.prototype.getMembers = function () {
        if (this.__members)
            return this.__members;
        var memberElements = this.element.initializer["properties"];
        this.__members = [];
        for (var _i = 0, memberElements_1 = memberElements; _i < memberElements_1.length; _i++) {
            var memberElement = memberElements_1[_i];
            var member = new Member_1.VariableMember(memberElement, this.filePath);
            this.__members.push(member);
        }
        return this.__members;
    };
    Variable.prototype.getMethods = function () {
        var members = this.getMembers();
        return Member_1.Method.getMethods(members);
    };
    Variable.prototype.getMembersSymbol = function () {
        if (this.element.initializer["symbol"] === undefined)
            return undefined;
        return this.element.initializer["symbol"].members;
    };
    return Variable;
}());
exports.Variable = Variable;
//# sourceMappingURL=Variable.js.map