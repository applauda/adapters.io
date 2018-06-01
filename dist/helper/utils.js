"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var intToHexString = function (number) {
    var c = Number(number);
    var rgbDec = [(c & 0xff0000) >> 16, (c & 0x00ff00) >> 8, (c & 0x0000ff)];
    return "#" + rgbDec.map(function (d) {
        var hex = d.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join('');
};
var colors = {
    intToHexString: intToHexString,
};
exports.colors = colors;
