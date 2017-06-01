/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SScene
 */
const engine = require("../core/SPredefine");
engine.Scene = engine.Object.extend({
    _mapContainer:null,
    _mapLayer:null,
    ctor: function () {
        this._super();

        var scene = new cc.Scene();
        cc.director.runScene(scene);

        this._mapContainer = new cc.Node();
        this._mapLayer = new engine.SceneMapLayer(this._mapContainer);
        scene.addChild(this._mapContainer);
    },

    getMapLayer : function()
    {
        return this._mapLayer;
    }
});