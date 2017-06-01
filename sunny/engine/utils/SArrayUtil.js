/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SArrayUtil
 */
const engine = require("../core/SPredefine");

engine.ArrayUtil = function ArrayUtil() { };

engine.ArrayUtil.getRectangularSpiralArray = function (target, centerX, centerY, radius, reject, process) {
    radius = Math.ceil(radius);//向上取半径值
    var result = [];
    var resultSet = [];
    var key;
    var i;
    var j;

    for (i = 0; i <= radius; i++) {
        //上
        for (j = -i; j <= i; j++) {
            pushResult(j, -i);
        }

        //右
        for (j = -i; j <= i; j++) {
            pushResult(i, j);
        }

        //下
        for (j = i; j >= -i; j--) {
            pushResult(j, i);
        }

        //左
        for (j = i; j >= -i; j--) {
            pushResult(-i, j);
        }
    }

    function pushResult(x, y) {
        key = x + "_" + y;
        if (resultSet.indexOf(key) == -1 && (reject == null || !reject.call(target, centerX, centerY, x, y))) {
            result.push([x, y]);
            resultSet.push(key);
            if (process != null)
                process.call(target, centerX, centerY, x, y);
        }
    }

    return result;
}