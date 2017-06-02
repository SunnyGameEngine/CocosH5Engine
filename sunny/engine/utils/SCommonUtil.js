/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SCommonUtil
 */
const engine = require("../core/SPredefine");

engine.CommonUtil = function CommonUtil() { };
engine.CommonUtil.xyToInt = function (x, y) {
    return (x << 16) | y;
};
engine.CommonUtil.getXFromInt = function (value) {
    return value >> 16;
};
engine.CommonUtil.getYFromInt = function (value) {
    return value & 0xffff;
};
engine.CommonUtil.bytesToString = function (bytes) {
    if (bytes < 1024)
        return bytes + "b";
    else if (bytes < 10240)
        return (bytes / 1024).toFixed(2) + "kb";
    else if (bytes < 102400)
        return (bytes / 1024).toFixed(1) + "kb";
    else if (bytes < 1048576)
        return (bytes >> 10) + "kb";
    else if (bytes < 10485760)
        return (bytes / 1048576).toFixed(2) + "mb";
    else if (bytes < 104857600)
        return (bytes / 1048576).toFixed(1) + "mb";
    else
        return String(bytes >> 20) + "mb";
};
engine.CommonUtil.getAngle = function (Ax, Ay, Bx, By) {
    var tempXDistance = Bx - Ax;
    var tempYDistance = By - Ay;

    var rotation = Math.round(Math.atan2(tempYDistance, tempXDistance) * 57.33); //弧度化角度
    rotation = (rotation + 360) % 360;

    return rotation;
};
engine.CommonUtil.getRotate = function (Ax, Ay, Bx, By) {
    var tempXDistance = Bx - Ax;
    var tempYDistance = By - Ay;
    return Math.atan2(tempYDistance, tempXDistance);
};
engine.CommonUtil.getRotateByAngle = function (angle) {
    return angle * Math.PI / 180;
};
engine.CommonUtil.getAngleByRotate = function (rotate) {
    return Math.round(rotate * 180 / Math.PI);
};
engine.CommonUtil.getDistance = function (ax, ay, bx, by) {
    return (Math.sqrt(((ax - bx) * (ax - bx)) + ((ay - by) * (ay - by))));
};
engine.CommonUtil.angleToRadian = function (angle) {
    return angle * (Math.PI / 180);
};
engine.CommonUtil.radianToAngle = function (radian) {
    return engine.CommonUtil.fixAngle(radian * (180 / Math.PI));
};
engine.CommonUtil.fixAngle = function (angle) {
    return (angle + 360) % 360;
};
engine.CommonUtil.sind = function (angle) {
    return Math.sin(engine.CommonUtil.angleToRadian(angle));
};
engine.CommonUtil.cosd = function (angle) {
    return Math.cos(engine.CommonUtil.angleToRadian(angle));
};
engine.CommonUtil.tand = function (angle) {
    return Math.tan(engine.CommonUtil.angleToRadian(angle));
};
engine.CommonUtil.asind = function (radian) {
    return engine.CommonUtil.radianToAngle(Math.acos(radian));
};
engine.CommonUtil.acosd = function (radian) {
    return engine.CommonUtil.radianToAngle(Math.acos(radian));
};
engine.CommonUtil.atand = function (radian) {
    return engine.CommonUtil.radianToAngle(Math.acos(radian));
};
engine.CommonUtil.atan2d = function (y, x) {
    return engine.CommonUtil.radianToAngle(Math.atan2(y, x));
};
engine.CommonUtil.getDxByAngle = function (value, angle) {
    return engine.CommonUtil.cosd(angle) * value;
};
engine.CommonUtil.getDyByAngle = function (value, angle) {
    return engine.CommonUtil.sind(angle) * value;
};
engine.CommonUtil.urlAppendTimestamp = function (url) {
    if (cc.game.config['noCache'] && typeof url === 'string') {
        if(_noCacheRex.test(url))
            url += '&_t=' + (new Date() - 0);
        else
            url += '?_t=' + (new Date() - 0);
    }
    return url;
};
module.exports = engine.CommonUtil;