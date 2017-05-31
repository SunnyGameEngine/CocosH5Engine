const engine = require("../core/SClass");

cc.Class({
    extends: cc.Component,

    _mapLayer: null,

    // use this for initialization
    onLoad: function () {
        this._mapLayer = new engine.SceneMapLayer(this.node);
    }
});
