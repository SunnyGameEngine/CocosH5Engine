/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SEarthSurface
 */
const engine = require("../../core/SPredefine");
require("./SBlockCombinationSurface");

engine.EarthSurface = engine.BlockCombinationSurface.extend({
    ctor: function (container) {
        this._super(container);
    }
});