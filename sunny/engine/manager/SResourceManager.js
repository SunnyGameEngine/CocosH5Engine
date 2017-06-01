/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SResourceManager
 */
const engine = require("../core/SPredefine");

engine.ResourceManager = engine.Object.extend({
    // 所有正在进行中的资源加载请求
    // 之所以弄一个这个东西，是为了避免对同一资源同时发起多个加载请求
    _loadRequestQueue: [],

    // 保存actor动作所有默认动画资源
    _actorDefaultAnimClips: [],

    ctor: function () {
        if (engine.ResourceManager._singleton)
            throw new Error("只能通过getInstance()来获取ResourceManager实例！");
    },

    /**
     * 初始化
     * @param completeCallback 初始化完成后的回调
     */
    init: function (completeCallback) {
        this._loadActorDefaultAnimClips(completeCallback);
    },

    /**
     * 加载资源（用法同cc.loader.loadRes）
     * @param url 要加载的资源的路径，相对于resources目录
     * @param type 要加载的资源的类型，可选
     * @param completeCallback 加载完成（包括成功和失败）之后的回调
     */
    loadRes: function (url, type, completeCallback) {
        if (!completeCallback && type && !cc.isChildClassOf(type, cc.RawAsset)) {
            completeCallback = type;
            type = null;
        }

        // 添加一个加载请求
        this._addLoadRequest(url, type, completeCallback);
    },

    /**
     * 尝试从cc.loader的缓存（内存）中获取指定资源
     */
    getCachedRes: function (url, type) {
        return cc.loader.getRes(url, type);
    },

    /**
     * 判断指定资源是否已存在于cc.loader的缓存（内存）中
     */
    hasCachedRes: function (url, type) {
        return (this.getResFromCache(url, type) != null);
    },

    /**
     * 新增一个资源加载请求
     * @param url
     * @param type
     * @param completeCallback
     */
    _addLoadRequest: function (url, type, completeCallback) {
        var isRequestExits = false;
        var request = null;

        for (var i = 0; i < this._loadRequestQueue.length; i++) {
            request = this._loadRequestQueue[i];
            if (request.url === url && request.type === type) {
                isRequestExits = true;
                break;
            }
        }

        if (!isRequestExits) {
            // 构建一个资源请求
            request = {};
            request.url = url;
            request.type = type;
            request.callbacks = [];// 对于每个元素，均包含要加载的资源的路径、类型以及针对该资源的回调列表

            // 将该请求加入资源请求队列中
            this._loadRequestQueue.push(request);
        }

        // 添加回调
        request.callbacks.push(completeCallback);

        // 这里作了一个优化：
        // 如果cc.loader的缓存（内存）中已有要加载的资源，就不必再去访问服务器了，此处直接触发回调
        var asset = this.getCachedRes(url, type);
        if (asset) {
            this._invokeRequestCallbacks(request, null, asset);
        }
        else {
            if (request.callbacks.length == 1) { // 在当前加载请求被加入至请求队列之前，还没有针对该资源的正在进行中的加载
                /*cc.loader.loadRes(url, type, (err, asset) => {
                    this._invokeRequestCallbacks(request, err, asset);
                });*/

                cc.loader.load(url, null, (err, asset) => {
                    this._invokeRequestCallbacks(request, err, asset);
                });
            }
        }
    },

    _invokeRequestCallbacks: function (request, err, asset) {
        while (request.callbacks.length > 0) {
            var cb = request.callbacks.shift();
            if (cb) {
                cb(err, asset);
            }
        }
    },

    /**
     * 加载actor所有动作的默认动画资源
     * @param completeCallback 加载完成后的回调，包含一个回调参数err
     */
    _loadActorDefaultAnimClips: function (completeCallback) {
        // 共只有4个默认状态
        var states = ['stand', 'run', 'sit', 'attack'];

        // 共5个方向
        var directions = [Direction.Up, Direction.UpRight, Direction.Right, Direction.DownRight, Direction.Down];

        // id
        var actorId = 'default';

        // 要加载的clip的数目
        var totalClipNumber = states.length * directions.length;

        // 已成功加载的clip的数目
        var loadedClipNumber = 0;

        // 逐个加载
        for (var i = 0; i < states.length; i++) {
            var stateName = states[i];
            for (var j = 0; j < directions.length; j++) {
                var direction = directions[j];
                var clipPath = Util.getActorAnimClipPath(actorId, stateName, direction);

                this.loadRes(clipPath, cc.AnimationClip, (err, clip) => {
                    if (err) {
                        cc.error(err.message);
                        if (completeCallback) {
                            completeCallback(err);
                        }
                        return;
                    }

                    // 将clip保存下来
                    this._actorDefaultAnimClips.push(clip);

                    loadedClipNumber++;
                    if (loadedClipNumber >= totalClipNumber) {
                        // 加载完成，调用回调
                        if (completeCallback) {
                            completeCallback(null);
                        }
                    }
                });
            }
        }
    },

    /**
     * 获取actor动作默认动画资源
     * @returns {properties._actorDefaultAnimClips|{default, visible, serializable}}
     */
    getActorDefaultAnimClips: function () {
        return this._actorDefaultAnimClips;
    },

    loadBinary:function(url,callback)
    {
        var loader = new engine.BinaryLoader();
        loader.load(url, callback);
    }
});

engine.ResourceManager._instance = null;
engine.ResourceManager._singleton = true;
engine.ResourceManager.getInstance = function () {
    if (!engine.ResourceManager._instance) {
        engine.ResourceManager._singleton = false;
        engine.ResourceManager._instance = new engine.ResourceManager();
        engine.ResourceManager._singleton = true;
    }
    return engine.ResourceManager._instance;
}
