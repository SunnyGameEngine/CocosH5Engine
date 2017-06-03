/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SStartup
 */
const engine = require("./SPredefine");
engine.Startup = engine.Object.extend({
    ctor: function () {
        this._super();
        cc.game.run({
            "debugMode" : 1,
            "noCache": false,
            "showFPS" : false,
            "frameRate" : 60,
            "id" : "gameCanvas",
            "renderMode" : 0,
            "engineDir":"./src/cocos2d_engine",

            "modules" : ["cocos2d"],

            "jsList" : [
                /*"./src/com/black8/sunny/engine/Engine.js"*/
            ]
        },function(){
            if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
                document.body.removeChild(document.getElementById("cocosLoading"));

                //load resources
                //cc.LoaderScene.preload(g_resources, function () {
                //    cc.director.runScene(new MyScene());
                //}, this);

                var designSize = cc.size(1200, 800);
                var policy = new cc.ResolutionPolicy(cc.ContainerStrategy.EQUAL_TO_FRAME, cc.ContentStrategy.EXACT_FIT);
                cc.view.setDesignResolutionSize(designSize.width, designSize.height, policy);//cc.ResolutionPolicy.SHOW_ALL
                cc.view.resizeWithBrowserSize(false);
                cc.director.setDisplayStats(false);

                engine.SceneManager.getInstance().activateScene();

                engine.profiler.showStats();
            }
        );
    }
});