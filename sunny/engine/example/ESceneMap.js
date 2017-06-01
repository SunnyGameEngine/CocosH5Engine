const engine = require("../core/SPredefine");

cc.Class({
    extends: cc.Component,

    _mapLayer: null,

    // use this for initialization
    onLoad: function () {
        this._mapLayer = new engine.SceneMapLayer(this.node);
    }
});
