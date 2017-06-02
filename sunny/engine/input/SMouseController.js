/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SMouseController
 */
const engine = require("../core/SPredefine");
engine.MouseController = engine.Object.extend({
    _leftDownX : -1,
    _leftDownY : -1,
    _downTargetX : 0,
    _downTargetY : 0,
    _posGetter : null,
    _posSetter : null,

    ctor: function (target) {
        //判断当前平台是否支持鼠标事件
        if ("mouse" in cc.sys.capabilities) {
            var self = this;
            var listener = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                target: target,
                onMouseDown: function (event) {      //鼠标事件【按下】
                    self._leftDownX = -1;
                    self._leftDownY = -1;
                    var pos = event.getLocation();
                    var button = event.getButton();
                    if (button == cc.Event.EventMouse.BUTTON_LEFT) {            //左键
                        //cc.log("左键按下", + pos.x + " " + pos.y);
                        self._leftDownX = pos.x;
                        self._leftDownY = pos.y;
                    } else if (button == cc.Event.EventMouse.BUTTON_RIGHT) {     //右键
                        //cc.log("右键按下", + pos.x + " " + pos.y);
                    } else if (button == cc.Event.EventMouse.BUTTON_MIDDLE) {    //滚轮
                        //cc.log("中间滚轮键按下");
                    }
                    if(self._posGetter)
                    {
                        var p = self._posGetter();
                        self._downTargetX=p.x;
                        self._downTargetY=p.y;
                    }
                    else
                    {
                        self._downTargetX=target.x;
                        self._downTargetY=target.y;
                    }
                },
                onMouseUp: function (event) {        //鼠标事件【抬起】
                    self._leftDownX = -1;
                    self._leftDownY = -1;
                },
                onMouseMove: function (event) {      //鼠标事件【移动】
                    var pos = event.getLocation();
                    //cc.log("鼠标当前位置：", pos.x, pos.y);
                    if (self._leftDownX > -1 && self._leftDownY > -1) {
                        var x = pos.x - self._leftDownX + self._downTargetX;
                        var y = pos.y - self._leftDownY + self._downTargetY;
                        if(self._posSetter)
                        {
                            self._posSetter(x,y);
                        }
                        else
                        {
                            target.x = x;
                            target.y = y;
                        }
                    }
                },
                onMouseScroll: function (event) {    //鼠标事件【滚轮滚动】
                    var pos = cc.p(event.getScrollX(), event.getScrollY());
                    //cc.log("鼠标滚轮滚动x :", pos.x + "y:" + pos.y);
                }
            });
            cc.eventManager.addListener(listener, target);
        }
        else {
            cc.log("不支持鼠标事件");
        }
    },

    setPosGetter : function(func)
    {
        this._posGetter=func; 
    },

    setPosSetter : function(func)
    {
        this._posSetter=func; 
    }
});
