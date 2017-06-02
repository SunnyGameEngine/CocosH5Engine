/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * STextLoader
 */
const engine = require("../core/SPredefine");
engine.TextLoader = engine.Object.extend({
    ctor: function () {
    },

    load : function(item, callback) {
        var url = item.url;
        if (CC_JSB) {
            var result = jsb.fileUtils.getStringFromFile(url);
            if (typeof result === 'string' && result) {
                callback(null, result);
            }
            else {
                callback(new Error('Download text failed: ' + url));
            }
        }
        else {
            var urlAppendTimestamp = engine.CommonUtil.urlAppendTimestamp;

            var xhr = cc.loader.getXMLHttpRequest();
            var errInfo = 'Load ' + url + ' failed!';
            var navigator = window.navigator;

            url = urlAppendTimestamp(url);

            xhr.open('GET', url, true);
            if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                // IE-specific logic here
                xhr.setRequestHeader('Accept-Charset', 'utf-8');
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 0) {
                            callback(null, xhr.responseText);
                        }
                        else {
                            callback({status:xhr.status, errorMessage:errInfo});
                        }
                    }
                };
            } else {
                if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
                xhr.onload = function () {
                    if(xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 0) {
                            callback(null, xhr.responseText);
                        }
                        else {
                            callback({status:xhr.status, errorMessage:errInfo});
                        }
                    }
                };
                xhr.onerror = function(){
                    callback({status:xhr.status, errorMessage:errInfo});
                };
            }
            xhr.send(null);
        }
    }
});
