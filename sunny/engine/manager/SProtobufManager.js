/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SProtobufManager
 */
const engine = require("../core/SPredefine");
require("../core/SObject");
require("../utils/SDictionary");
require("./SResourceManager");
var ByteBuffer = require("../protobuf/bytebuffer");
var ProtoBuf = require("../protobuf/protobuf");

engine.ProtobufManager = engine.Object.extend({
    _builder:null,
    _messages:null,

    ctor: function () {
        if (engine.ProtobufManager._singleton)
            throw new Error("只能通过getInstance()来获取ProtobufManager实例！");
        this._messages = new engine.Dictionary();
    },

    loadProto:function(protoUrl,callback)
    {
        var self = this;
        engine.ResourceManager.getInstance().loadRes(protoUrl, function (err, protoData){
             if (err) {
                cc.error(err);
                if(callback)
                {
                    callback(err);
                }
            }
            else
            {
                cc.log("loadProto finish!",protoData);
                self._builder = ProtoBuf.protoFromString(protoData);
                if(callback)
                {
                    callback(null,self._builder);
                }
            }
        });
    },

    loadProtoFile:function(protoUrl,callback)
    {
        var self = this;
        ProtoBuf.loadProtoFile(protoUrl, function (err, protoBuilder){
             if (err) {
                console.error("loadProtoFile failed!",err);
                if(callback)
                {
                    callback(err);
                }
            }
            else
            {
                console.log("loadProtoFile complete!");
                self._builder = protoBuilder;
                if(callback)
                {
                    callback(null,self._builder);
                }
            }
        });
    },

    buildClass:function(className)
    {
        if(this._builder)
        {
            var Message = this._messages.objectForKey(className);
            if(!Message)
            {
                Message = this._builder.build(className);
                if(Message)
                {
                    this._messages.setObject(className,Message);
                    console.log("build proto finish!",className);
                }
                else
                {
                    console.error("build Message failed!");
                }
            }
            return Message;
        }
        else
        {
            console.error("builder not init!");
        }
        return null;
    },

    decodeMessage:function(uint8Array,className)
    {
        var Message = this.buildClass(className);
        if(Message)
        {
            var buffer = uint8Array.buffer;//ArrayBuffer
            var proto = Message.decode(buffer);
            return proto;
        }
        return null;
    },

    buildMessage:function(url,className,callback)
    {
        var self = this;
        engine.ResourceManager.getInstance().loadRes(url, function (err, uint8Array){
            if (err) {
                cc.error(err);
                if(callback)
                {
                    callback(err);
                }
            }
            else
            {
                cc.log("buildMessage finish!",typeof uint8Array,uint8Array);
                if(callback)
                {
                    var proto = self.decodeMessage(uint8Array,className);
                    callback(null,proto);
                }
            }
        });
    }
});

engine.ProtobufManager._instance = null;
engine.ProtobufManager._singleton = true;
engine.ProtobufManager.getInstance = function () {
    if (!engine.ProtobufManager._instance) {
        engine.ProtobufManager._singleton = false;
        engine.ProtobufManager._instance = new engine.ProtobufManager();
        engine.ProtobufManager._singleton = true;
    }
    return engine.ProtobufManager._instance;
}
