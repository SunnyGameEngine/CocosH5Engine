/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SSceneMapLayer
 */
const engine = require("../../core/SPredefine");
require("../../core/SObject");
const path = require('path');

engine.SceneMapLayer = engine.Object.extend({
    _container: null,
    _surface: null,
    _tttttt: 0,

    ctor: function (container) {
        this._super();
        this._container = container;

        this._surface = new engine.EarthSurface(this._container);
    },

    loadMap: function (configUrl) {
        cc.log("loadMap...");

        configUrl = configUrl.replace(/\\/g, '/');
        var self = this;
        engine.ProtobufManager.getInstance().buildMessage(configUrl, "com.black8.game.proto.MapConfigMessage", function (err, proto) {
            if (err) {
                cc.error(err);
            }
            else {
                cc.log("loadProto finish!", typeof proto);

                var dirUrl = configUrl.substring(0, configUrl.lastIndexOf("/"));
                self._surface.setConfig(dirUrl, proto);

                // var dirPath = path.dirname(configPath);
                // cc.log(dirPath, widthCount, heightCount);

                self._surface.focus(0, 0);
                cc.director.getScheduler().scheduleUpdate(self, 0, false);
            }
        });
    },

    update: function (dt) {
        this._surface.focus(this._tttttt, 0);
        this._tttttt += 2;
    }
});