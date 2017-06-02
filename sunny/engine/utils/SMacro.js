const engine = require("../core/SPredefine");
engine.macro = {
    IS_COCOS_CREATOR : false,
    IS_ENGINE_EDITOR : false,
    DIRECTOR_STATS_POSITION: cc.p(0, 0)
};
module.exports = engine.macro;
