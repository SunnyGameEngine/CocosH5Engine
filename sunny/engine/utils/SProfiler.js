/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SStats
 */
const engine = require("../core/SPredefine");
require("../core/SObject");
require('./SStats');
require('./SMacro');

engine.Profiler = engine.Object.extend({
    _showFPS: false,
    _fps: null,
    _stats: null,

    ctor: function () {
        this._super();
    },

    isShowingStats() {
        return this._showFPS;
    },

    hideStats() {
        if (this._showFPS) {
            if (CC_JSB) {
            }
            else {
                if (this._fps && this._fps.parentElement === document.body) {
                    document.body.removeChild(this._fps);
                }
            }
            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            cc.director.off(cc.Director.EVENT_AFTER_VISIT, this.afterVisit, this);
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.afterDraw, this);
            this._showFPS = false;
        }
    },

    showStats() {
        if (!this._showFPS) {
            if (CC_JSB) {
            }
            else {
                if (!this._fps) {
                    this._fps = document.createElement('div');
                    this._fps.id = 'fps';
                    this.init();
                }
                if (this._fps.parentElement === null) {
                    document.body.appendChild(this._fps);
                }
            }
            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            cc.director.on(cc.Director.EVENT_AFTER_VISIT, this.afterVisit, this);
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.afterDraw, this);
            this._showFPS = true;
        }
    },

    init: function () {
        if (CC_JSB) {
        }
        else {
            var statsOcj = new engine.Stats();
            this._stats = statsOcj.pstats.new(this._fps, {
                values: {
                    frame: { desc: 'Frame time (ms)', min: 0, max: 50, average: 500 },
                    fps: { desc: 'Framerate (FPS)', below: 30, average: 500 },
                    draws: { desc: 'Draw call' },
                    logic: { desc: 'Game Logic (ms)', min: 0, max: 50, average: 500, color: '#080' },
                    render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' }
                },
                css: '.pstats {left: ' + engine.macro.DIRECTOR_STATS_POSITION.x + 'px; bottom: ' + engine.macro.DIRECTOR_STATS_POSITION.y + 'px;}'
            });
        }
    },

    beforeUpdate: function () {
        if (this._stats) {
            this._stats('frame').start();
            this._stats('logic').start();
        }
    },

    afterVisit: function () {
        if (this._stats) {
            if (cc.director.isPaused()) {
                this._stats('frame').start();
            }
            else {
                this._stats('logic').end();
            }
            this._stats('render').start();
        }
    },

    afterDraw: function () {
        if (this._stats) {
            this._stats('render').end();
            this._stats('draws').value = cc.g_NumberOfDraws;
            this._stats('frame').end();
            this._stats('fps').frame();
            this._stats().tick();
        }
    }
});
