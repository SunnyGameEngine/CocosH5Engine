const engine = require("../core/SClass");
//var PStats = require('./pstats/pstats');
var macro = require('./SMacro');

// var _fps = document.createElement('div');
// _fps.id = 'fps';

// let stats = PStats.new(_fps, {
//     values: {
//         frame: { desc: 'Frame time (ms)', min: 0, max: 50, average: 500 },
//         fps: { desc: 'Framerate (FPS)', below: 30, average: 500 },
//         draws: { desc: 'Draw call' },
//         logic: { desc: 'Game Logic (ms)', min: 0, max: 50, average: 500, color: '#080' },
//         render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' }
//     },
//     css: '.pstats {left: ' + macro.DIRECTOR_STATS_POSITION.x + 'px; bottom: ' + macro.DIRECTOR_STATS_POSITION.y + 'px;}'
// });

 let _showFPS = false;

// function beforeUpdate () {
//     stats('frame').start();
//     stats('logic').start();
// }

// function afterVisit () {
//     if (cc.director.isPaused()) {
//         stats('frame').start();
//     }
//     else {
//         stats('logic').end();
//     }
//     stats('render').start();
// }

// function afterDraw () {
//     stats('render').end();
//     stats('draws').value = cc.g_NumberOfDraws;
//     stats('frame').end();
//     stats('fps').frame();
//     stats().tick();
// }

engine.profiler = module.exports = {
    isShowingStats () {
        return _showFPS;
    },

    hideStats () {
        // if (_showFPS) {
        //     if (_fps.parentElement === document.body) {
        //         document.body.removeChild(_fps);
        //     }
        //     cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
        //     cc.director.off(cc.Director.EVENT_AFTER_VISIT, afterVisit);
        //     cc.director.off(cc.Director.EVENT_AFTER_DRAW, afterDraw);
        //     _showFPS = false;
        // }
    },

    showStats () {
        // if (!_showFPS) {
        //     if (_fps.parentElement === null) {
        //         document.body.appendChild(_fps);
        //     }
        //     cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
        //     cc.director.on(cc.Director.EVENT_AFTER_VISIT, afterVisit);
        //     cc.director.on(cc.Director.EVENT_AFTER_DRAW, afterDraw);
        //     _showFPS = true;
        // }
    }
}