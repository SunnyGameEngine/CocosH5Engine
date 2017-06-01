/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SSceneManager
 */
const engine = require("../core/SPredefine");
engine.SceneManager = engine.Object.extend({
    _activeScene:null,

    ctor: function () {
        if (engine.SceneManager._singleton)
            throw new Error("只能通过getInstance()来获取SceneManager实例！");
    },

    activateScene:function()
    {
        this._activeScene=new engine.Scene();
    },

    getActiveScene:function()
    {
        return this._activeScene;
    }
});

engine.SceneManager._instance = null;
engine.SceneManager._singleton = true;
engine.SceneManager.getInstance = function () {
    if (!engine.SceneManager._instance) {
        engine.SceneManager._singleton = false;
        engine.SceneManager._instance = new engine.SceneManager();
        engine.SceneManager._singleton = true;
    }
    return engine.SceneManager._instance;
}
