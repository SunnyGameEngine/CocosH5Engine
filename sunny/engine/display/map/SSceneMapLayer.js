/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SSceneMapLayer
 */
const engine = require("../../core/SClass");
engine.SceneMapLayer = engine.Object.extend({
    _container: null,
    _surface:null,
    _tttttt:0,

    ctor: function (container) {
        this._container = container;
        var self = this;
        engine.Object.prototype.ctor.call(self);

        this._surface = new engine.BlockCombinationSurface(this._container);

        cc.director.getScheduler().scheduleUpdate(this, 0, false);
    },

    update: function (dt) {
        this._surface.focus(this._tttttt,0);
        this._tttttt+=2;
    }
});