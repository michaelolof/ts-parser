"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var typescript_1 = require("typescript");
var ThisCall = (function () {
    function ThisCall(element) {
        this.element = element;
        this.name = element.expression["name"].escapedText;
        this.code = element.getFullText().trim();
    }
    ThisCall.Find = function (body) {
        var calls = _1.find(body, condition);
        return calls;
        function condition(node) {
            if (node.kind === typescript_1.SyntaxKind.ThisKeyword
                && node.parent
                && typescript_1.isPropertyAccessExpression(node.parent) && node.parent.parent) {
                if (node.parent.name.escapedText === "constructor" && node.parent.parent.parent) {
                    if (typescript_1.isExpressionStatement(node.parent.parent.parent)) {
                        return new StaticPropertyThisCall(node.parent.parent.parent);
                    }
                    if (typescript_1.isCallExpression(node.parent.parent.parent)) {
                        return new StaticMethodThisCall(node.parent.parent.parent);
                    }
                }
                if (typescript_1.isExpressionStatement(node.parent.parent)) {
                    return new IntsancePropertyThisCall(node.parent.parent);
                }
                if (typescript_1.isCallExpression(node.parent.parent)) {
                    return new InstanceMethodThisCall(node.parent.parent);
                }
            }
            return undefined;
        }
    };
    return ThisCall;
}());
exports.ThisCall = ThisCall;
var MethodThisCall = (function (_super) {
    __extends(MethodThisCall, _super);
    function MethodThisCall(element) {
        var _this = _super.call(this, element) || this;
        _this.element = element;
        _this.type = "method";
        return _this;
    }
    MethodThisCall.prototype.inferSignature = function () {
        return this.element.arguments.length;
    };
    return MethodThisCall;
}(ThisCall));
exports.MethodThisCall = MethodThisCall;
var PropertyThisCall = (function (_super) {
    __extends(PropertyThisCall, _super);
    function PropertyThisCall(element) {
        var _this = _super.call(this, element) || this;
        _this.element = element;
        _this.type = "property";
        return _this;
    }
    PropertyThisCall.prototype.inferSignature = function () {
        return "any";
    };
    return PropertyThisCall;
}(ThisCall));
exports.PropertyThisCall = PropertyThisCall;
var InstanceMethodThisCall = (function (_super) {
    __extends(InstanceMethodThisCall, _super);
    function InstanceMethodThisCall(element) {
        var _this = _super.call(this, element) || this;
        _this.accessor = "instance";
        return _this;
    }
    return InstanceMethodThisCall;
}(MethodThisCall));
exports.InstanceMethodThisCall = InstanceMethodThisCall;
var StaticMethodThisCall = (function (_super) {
    __extends(StaticMethodThisCall, _super);
    function StaticMethodThisCall(element) {
        var _this = _super.call(this, element) || this;
        _this.element = element;
        _this.accessor = "static";
        return _this;
    }
    return StaticMethodThisCall;
}(MethodThisCall));
exports.StaticMethodThisCall = StaticMethodThisCall;
var IntsancePropertyThisCall = (function (_super) {
    __extends(IntsancePropertyThisCall, _super);
    function IntsancePropertyThisCall(element) {
        var _this = _super.call(this, element) || this;
        _this.element = element;
        _this.accessor = "instance";
        return _this;
    }
    return IntsancePropertyThisCall;
}(PropertyThisCall));
exports.IntsancePropertyThisCall = IntsancePropertyThisCall;
var StaticPropertyThisCall = (function (_super) {
    __extends(StaticPropertyThisCall, _super);
    function StaticPropertyThisCall(element) {
        var _this = _super.call(this, element) || this;
        _this.element = element;
        _this.accessor = "static";
        return _this;
    }
    return StaticPropertyThisCall;
}(PropertyThisCall));
exports.StaticPropertyThisCall = StaticPropertyThisCall;
//# sourceMappingURL=Statement.js.map