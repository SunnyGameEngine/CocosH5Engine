/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SBinaryLoader
 */
const engine = require("../core/SPredefine");
engine.BinaryLoader = engine.Object.extend({

    ctor: function () {
        if (CC_JSB) {
        }
        else {
            var navigator = window.navigator;
            var IEFilter = (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent));
            //Compatibility with IE9
            window.Uint8Array = window.Uint8Array || window.Array;
            if (IEFilter) {
                var IEBinaryToArray_ByteStr_Script =
                    '<!-- IEBinaryToArray_ByteStr -->\r\n' +
                    //'<script type='text/vbscript'>\r\n' +
                    'Function IEBinaryToArray_ByteStr(Binary)\r\n' +
                    '   IEBinaryToArray_ByteStr = CStr(Binary)\r\n' +
                    'End Function\r\n' +
                    'Function IEBinaryToArray_ByteStr_Last(Binary)\r\n' +
                    '   Dim lastIndex\r\n' +
                    '   lastIndex = LenB(Binary)\r\n' +
                    '   if lastIndex mod 2 Then\r\n' +
                    '       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n' +
                    '   Else\r\n' +
                    '       IEBinaryToArray_ByteStr_Last = ' + '""' + '\r\n' +
                    '   End If\r\n' +
                    'End Function\r\n';// +
                //'</script>\r\n';

                // inject VBScript
                //document.write(IEBinaryToArray_ByteStr_Script);
                var myVBScript = document.createElement('script');
                myVBScript.type = 'text/vbscript';
                myVBScript.textContent = IEBinaryToArray_ByteStr_Script;
                document.body.appendChild(myVBScript);

                // helper to convert from responseBody to a 'responseText' like thing
                var _convertResponseBodyToText = function (binary) {
                    var byteMapping = {};
                    for (var i = 0; i < 256; i++) {
                        for (var j = 0; j < 256; j++) {
                            byteMapping[String.fromCharCode(i + j * 256)] =
                                String.fromCharCode(i) + String.fromCharCode(j);
                        }
                    }
                    var rawBytes = IEBinaryToArray_ByteStr(binary);
                    var lastChr = IEBinaryToArray_ByteStr_Last(binary);
                    return rawBytes.replace(/[\s\S]/g,
                        function (match) {
                            return byteMapping[match];
                        }) + lastChr;
                };
            }
        }
    },

    load: function (item, callback) {
        var url = item.url;
        if (CC_JSB) {
            var result = jsb.fileUtils.getDataFromFile(url);//Uint8Array
            if (typeof result === 'object' && result instanceof Uint8Array) {
                callback(null, result);
            }
            else {
                callback(new Error('Download text failed: ' + url));
            }
        }
        else {
            var navigator = window.navigator;
            var IEFilter = (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent));
            var xhr = cc.loader.getXMLHttpRequest();
            var errInfo = 'Load ' + url + ' failed!';
            xhr.open('GET', url, true);
            if (IEFilter) {
                // IE-specific logic here
                xhr.setRequestHeader('Accept-Charset', 'x-user-defined');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && (xhr.status === 200 || (CC_TEST && xhr.status === 0))) {
                        var fileContents = _convertResponseBodyToText(xhr['responseBody']);
                        callback(null, engine.BufferUtil.str2Uint8Array(fileContents));
                    }
                    else {
                        callback(errInfo);
                    }
                };
            } else {
                if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=x-user-defined');
                xhr.onload = function () {
                    if (xhr.readyState === 4 && (xhr.status === 200 || (CC_TEST && xhr.status === 0))) {
                        callback(null, engine.BufferUtil.str2Uint8Array(xhr.responseText));
                    }
                    else {
                        callback(errInfo);
                    }
                };
            }
            xhr.send(null);
        }
    }
});
