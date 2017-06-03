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
    _tttttt2: 0,

    ctor: function (container) {
        this._super();
        this._container = container;
        this._surface = new engine.EarthSurface(this._container);
    },

    getContainer : function()
    {
        return this._container;
    },

    focus: function (focusX, focusY) {
        
    },

    getViewUIPos : function() {
        return this._surface.getViewUIPos();
    },

    getViewGLPos : function() {
        return this._surface.getViewGLPos();
    },

    setViewUIPos: function (viewX, viewY) {
        this._surface.setViewUIPos(viewX, viewY);
    },

    setViewGLPos: function (viewX, viewY) {
        this._surface.setViewGLPos(viewX, viewY);
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

                var size = cc.director.getWinSize();
                self._surface.setViewSize(size.width, size.height);

                self.setViewUIPos(0, 0);
                //self.setViewUIPos(0, -1060);
                cc.director.getScheduler().scheduleUpdate(self, 0, false);
            }
        });
    },

    update: function (dt) {
        this.setViewUIPos(this._tttttt,this._tttttt2);
        this._tttttt -= 1;
        this._tttttt2 -= 1;
    }
});