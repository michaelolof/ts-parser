"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var Member_1 = require("./Member");
var utilities_1 = require("./utilities");
var Variable_1 = require("./Variable");
var Class = (function () {
    function Class(element, filePath) {
        this.element = element;
        this.filePath = filePath;
    }
    Object.defineProperty(Class.prototype, "name", {
        get: function () {
            return this.element.name["escapedText"];
        },
        enumerable: true,
        configurable: true
    });
    Class.prototype.getMembers = function () {
        if (this.__members)
            return this.__members;
        var memberElements = this.element.members;
        this.__members = [];
        for (var _i = 0, memberElements_1 = memberElements; _i < memberElements_1.length; _i++) {
            var memberElement = memberElements_1[_i];
            var member = new Member_1.ClassMember(memberElement, this.filePath);
            if (member.name === "constructor")
                continue;
            this.__members.push(member);
        }
        return this.__members;
    };
    Class.prototype.getMembersSymbol = function () {
        if (this.element["symbol"] === undefined)
            return undefined;
        return this.element["symbol"].members;
    };
    Class.prototype.hasMembersUsingDecorator = function (decoratorName) {
        var members = this.getMembers();
        var membersUsingDecorators = [];
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            if (member.isUsingDecorator(decoratorName)) {
                membersUsingDecorators.push(member);
            }
        }
        return membersUsingDecorators;
    };
    Class.prototype.getMemberUsingDecorator = function (decoratorName, memberName) {
        var member = this.getMember(memberName);
        if (member === undefined)
            return undefined;
        if (member.isUsingDecorator(decoratorName))
            return member;
        else
            return undefined;
    };
    Class.prototype.isOf = function (type) {
        return this instanceof type;
    };
    Class.prototype.hasMemberByNameAndAccessor = function (name, accessor) {
        var members = this.getMembers();
        for (var _i = 0, members_2 = members; _i < members_2.length; _i++) {
            var member = members_2[_i];
            if (member.name === name && member.getAccessor() === accessor)
                return member;
        }
        return undefined;
    };
    Class.IsAClass = function (node) {
        return node.kind === typescript_1.SyntaxKind.ClassDeclaration;
    };
    Class.Find = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, utilities_1.find(source, function (node) {
                        if (Class.IsAClass(node)) {
                            return new Class(node, source.fileName);
                        }
                        else
                            return undefined;
                    })];
            });
        });
    };
    return Class;
}());
exports.Class = Class;
Class.prototype.getNameRange = Variable_1.Variable.prototype.getNameRange;
Class.prototype.getMethods = Variable_1.Variable.prototype.getMethods;
Class.prototype.getMember = Variable_1.Variable.prototype.getMember;
Class.prototype.toSymbolizedHolder = Variable_1.Variable.prototype.toSymbolizedHolder;
Class.prototype.getMembersSymbolizedMemberArray = Variable_1.Variable.prototype.getMembersSymbolizedMemberArray;
//# sourceMappingURL=Class.js.map