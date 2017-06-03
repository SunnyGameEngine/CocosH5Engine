const engine = require("../core/SPredefine");

cc.Class({
    extends: cc.Component,

    _mapLayer: null,

    // use this for initialization
    onLoad: function () {
        engine.macro.IS_COCOS_CREATOR = true;
        engine.macro.DIRECTOR_STATS_POSITION=new cc.p(0,300);

        var self = this;
            engine.ProtobufManager.getInstance().loadProto("proto/map_config",(err,builder) => {
                if (err) {
                }
                else
                {
                    self._mapLayer = new engine.SceneMapLayer(this.node);
                    var configUrl = "maps/test/map";
                    self._mapLayer.loadMap(configUrl);

                    self._profiler = new engine.Profiler();
                    self._profiler.showStats();
                }
            });
        }
});
