/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SObject
 */
const engine = require("./SClass");

engine.Object = engine.Class.extend({
    ctor: function () {
    },

    getClass: function () {
        return this["constructor"];
    }
});

engine.Object.create = function () {
    return new engine.Object();
};
