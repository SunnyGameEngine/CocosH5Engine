/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SObject
 */
const engine = require("./SPredefine");
require("../core/SClass");

engine.Object = engine.Class.extend({
    ctor: function () {
        // var self = this;
        // engine.Object.prototype.ctor.call(self);
    },

    getClass: function () {
        return this["constructor"];
    }
});

engine.Object.create = function () {
    return new engine.Object();
};
