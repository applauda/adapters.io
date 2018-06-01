"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var log = function (level, tag, message) {
    var rest = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        rest[_i - 3] = arguments[_i];
    }
    return console[level].apply(console[level], ["[" + tag + "] " + message].concat(rest));
}; // eslint-disable-line no-console
function create(tag) {
    return {
        info: function (message) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return log.apply(void 0, ['log', tag, message].concat(rest));
        },
        warn: function (message) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return log.apply(void 0, ['warn', tag, message].concat(rest));
        },
        error: function (message) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return log.apply(void 0, ['error', tag, message].concat(rest));
        },
    };
}
exports.default = create;
