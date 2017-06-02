/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SBufferUtil
 */
const engine = require("../core/SPredefine");

engine.BufferUtil = function BufferUtil() { };

engine.BufferUtil.str2Uint8Array = function(strData) {
    if (!strData)
        return null;

    var arrData = new Uint8Array(strData.length);
    for (var i = 0; i < strData.length; i++) {
        arrData[i] = strData.charCodeAt(i) & 0xff;
    }
    return arrData;
}