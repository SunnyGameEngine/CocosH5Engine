/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SBlockCombinationSurface
 */
const engine = require("../../core/SPredefine");
require("../../core/SObject");
require("../../utils/SDictionary");

engine.BlockCombinationSurface = engine.Object.extend({
    _container: null,
    _mapWidth: 0,
    _mapHeight: 0,
    _mapCols: 0,
    _mapRows: 0,
    _tileWidth: 0,
    _tileHeight: 0,
    _bufferCols: 0,
    _bufferRows: 0,
    _viewWidth: 0,
    _viewHeight: 0,
    _bufferContainer: null,
    _bufferRect: null,
    _viewX: 0,
    _viewY: 0,
    _viewRect: null,
    _offsetPoint: null,
    _screenRect: null,
    _mapName: null,
    _bufferTilePoint: null,
    _dirUrl: null,
    _config: null,
    _fileVersions: null,
    _leftBorder: 0,
    _topBorder: 0,
    _rightBorder: 0,
    _bottomBorder: 0,
    _leftCols: null,
    _rightCols: null,
    _topRows: null,
    _bottomRows: null,
    _inited: null,
    _smallMapBitmapData: null,
    _smallMapParser: null,
    _loadPriority: null,
    _tiles: null,
    _updatable: true,//false,
    _lastStartTileX: -1,
    _lastStartTileY: -1,
    _lastViewX: -1,
    _lastViewY: -1,
    _startTileX: -1,
    _startTileY: -1,
    _transparent: null,
    _isDisposed: null,
    _smallMapResourceId: null,
    _smallMapVersion: null,
    _pretreatmentNum: 1,
    _pretreatmentWidth: 0,
    _pretreatmentHeight: 0,

    ctor: function (container) {
        this._container = container;
        this._bufferContainer = new cc.Node();
        this._container.addChild(this._bufferContainer);
        this._bufferContainer.setAnchorPoint(0, 0);
        this._bufferContainer.setPosition(0, 0);
        var self = this;
        engine.Object.prototype.ctor.call(self);
        this._screenRect = new cc.rect(0, 0, 0, 0);
        this._viewRect = new cc.rect(0, 0, 0, 0);
        this._bufferRect = new cc.rect(0, 0, 0, 0);
        this._offsetPoint = new cc.p(0, 0);
    },

    setConfig: function (dirUrl, config) {
        this._dirUrl = dirUrl;
        this._config = config;
        this.parseMapData();
    },

    parseMapData: function () {
        this._loadPriority = -10;
        //   this._fileVersions = {};
        //   for each (var tileXML in this._config.tile)
        //   {
        //     var version = (SShellVariables.useCache ? String(tileXML.@version) : String(Math.random()));
        //     this._fileVersions[String(tileXML.@id)] = {url: String(tileXML.@url), version: version};
        //   }

        // 从配置文件中获取地图基本信息
        this._mapWidth = parseInt(this._config.get("map_width"));
        this._mapHeight = parseInt(this._config.get("map_height"));

        this._tileWidth = parseInt(this._config.get("slice_width"));
        this._tileHeight = parseInt(this._config.get("slice_height"));

        this._pretreatmentWidth = this._pretreatmentNum * this._tileWidth;
        this._pretreatmentHeight = this._pretreatmentNum * this._tileHeight;

        this._mapCols = Math.ceil(this._mapWidth / this._tileWidth);
        this._mapRows = Math.ceil(this._mapHeight / this._tileHeight);

        //cc.log("地图数据：", this._mapWidth, this._mapHeight, this._tileWidth, this._tileHeight,this._pretreatmentWidth, this._pretreatmentHeight, this._mapCols, this._mapRows);

        //   this._mapName = this._config.@name;
        //   this._smallMapResourceId = this._config.sm.@url;
        //   this._smallMapVersion = (SShellVariables.useCache ? String(this._config.sm.@version) : String(Math.random()));

        //      SCallPool.getInstance().addCall(SResourceManager.CALL_START_BACKGROUND_LOAD, startBackgroundLoad);
        //      SCallPool.getInstance().addCall(SResourceManager.CALL_STOP_BACKGROUND_LOAD, stopBackgroundLoad);

        this._tiles = new engine.Dictionary();
    },

    fillInternal: function () {
        //console.log("fillInternal",this._lastStartTileX,this._lastStartTileY);
        var startRow;
        var endRow;
        var startColmns;
        var endColmns;
        var rowCount;
        var colmnsCount;
        if (this._lastStartTileX == -1 && this._lastStartTileY == -1) //填充全部
        {
            startRow = -this._pretreatmentNum + this._startTileY;
            if (startRow < 0)
                startRow = 0;
            endRow = this._bufferRows + this._pretreatmentNum + this._startTileY;
            if (endRow > this._mapRows)
                endRow = this._mapRows;

            startColmns = -this._pretreatmentNum + this._startTileX;
            if (startColmns < 0)
                startColmns = 0;
            endColmns = this._bufferCols + this._pretreatmentNum + this._startTileX;
            if (endColmns > this._mapCols)
                endColmns = this._mapCols;

            var gridColumns = endColmns - startColmns;
            if (gridColumns < 0)
                gridColumns = 0;
            var gridRows = endRow - startRow;
            if (gridRows < 0)
                gridRows = 0;
            var r = gridColumns > gridRows ? gridColumns : gridRows;
            var halfR = Math.floor(r / 2);
            var centerX = startColmns + Math.floor(gridColumns / 2);
            var centerY = startRow + Math.floor(gridRows / 2);

            //console.log("初始绘制：", this._bufferRows,this._bufferCols,centerX, centerY, halfR);
            engine.ArrayUtil.getRectangularSpiralArray(this, centerX, centerY, halfR, this.fillReject, this.fillProcess);
        }
        else //填充局部
        {
            var tileXDelta = this._startTileX - this._lastStartTileX;
            var tileYDelta = this._startTileY - this._lastStartTileY;
            //console.log("fillInternalDelta",tileXDelta,tileYDelta);

            if (tileYDelta > 0) //下边新增
            {
                startRow = (this._bufferRows - tileYDelta) - this._pretreatmentNum + this._startTileY;
                if (startRow < 0)
                    startRow = 0;
                endRow = this._bufferRows + this._pretreatmentNum + this._startTileY;
                if (endRow > this._mapRows)
                    endRow = this._mapRows;

                startColmns = -this._pretreatmentNum + this._startTileX;
                if (startColmns < 0)
                    startColmns = 0;
                endColmns = this._bufferCols + this._pretreatmentNum + this._startTileX;
                if (endColmns > this._mapCols)
                    endColmns = this._mapCols;

                for (rowCount = startRow; rowCount < endRow; rowCount++) //从上到下 
                {
                    for (colmnsCount = endColmns - 1; colmnsCount >= startColmns; colmnsCount--) //顺时针则从右到左 
                    {
                        this.copyTileImage(colmnsCount, rowCount);
                    }
                }
            }
            else if (tileYDelta < 0) //上边新增
            {
                tileYDelta = -tileYDelta;

                startRow = -this._pretreatmentNum + this._startTileY;
                if (startRow < 0)
                    startRow = 0;
                endRow = tileYDelta + this._pretreatmentNum + this._startTileY;
                if (endRow > this._mapRows)
                    endRow = this._mapRows;

                startColmns = -this._pretreatmentNum + this._startTileX;
                if (startColmns < 0)
                    startColmns = 0;
                endColmns = this._bufferCols + this._pretreatmentNum + this._startTileX;
                if (endColmns > this._mapCols)
                    endColmns = this._mapCols;

                for (rowCount = endRow - 1; rowCount >= startRow; rowCount--) //从下到上
                {
                    for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) //顺时针则从左到右
                    {
                        this.copyTileImage(colmnsCount, rowCount);
                    }
                }
            }

            if (tileXDelta > 0) //右边新增
            {
                startRow = -this._pretreatmentNum + this._startTileY;
                if (startRow < 0)
                    startRow = 0;
                endRow = this._bufferRows + this._pretreatmentNum + this._startTileY;
                if (endRow > this._mapRows)
                    endRow = this._mapRows;

                startColmns = (this._bufferCols - tileXDelta) - this._pretreatmentNum + this._startTileX;
                if (startColmns < 0)
                    startColmns = 0;
                endColmns = this._bufferCols + this._pretreatmentNum + this._startTileX;
                if (endColmns > this._mapCols)
                    endColmns = this._mapCols;

                for (rowCount = startRow; rowCount < endRow; rowCount++) //顺时针则从上到下
                {
                    for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) //从左到右
                    {
                        this.copyTileImage(colmnsCount, rowCount);
                    }
                }
            }
            else if (tileXDelta < 0) //左边新增
            {
                tileXDelta = -tileXDelta;

                startRow = -this._pretreatmentNum + this._startTileY;
                if (startRow < 0)
                    startRow = 0;
                endRow = this._bufferRows + this._pretreatmentNum + this._startTileY;
                if (endRow > this._mapRows)
                    endRow = this._mapRows;

                startColmns = -this._pretreatmentNum + this._startTileX;
                if (startColmns < 0)
                    startColmns = 0;
                endColmns = tileXDelta + this._pretreatmentNum + this._startTileX;
                if (endColmns > this._mapCols)
                    endColmns = this._mapCols;

                for (rowCount = endRow - 1; rowCount >= startRow; rowCount--) //顺时针则从下到上
                {
                    for (colmnsCount = endColmns - 1; colmnsCount >= startColmns; colmnsCount--) //从右到左
                    {
                        this.copyTileImage(colmnsCount, rowCount);
                    }
                }
            }
        }
    },

    fillReject: function (centerX, centerY, x, y) {
        var colmnsIndex = centerX + x;
        var rowIndex = centerY + y;

        var startRow;
        var endRow;
        var startColmns;
        var endColmns;

        startRow = -this._pretreatmentNum + this._startTileY;
        if (startRow < 0)
            startRow = 0;
        endRow = this._bufferRows + this._pretreatmentNum + this._startTileY;
        if (endRow > this._mapRows)
            endRow = this._mapRows;

        startColmns = -this._pretreatmentNum + this._startTileX;
        if (startColmns < 0)
            startColmns = 0;
        endColmns = this._bufferCols + this._pretreatmentNum + this._startTileX;
        if (endColmns > this._mapCols)
            endColmns = this._mapCols;

        //console.log(colmnsCount, startColmns, endColmns, rowCount, startRow, endRow);
        if (colmnsIndex >= startColmns && colmnsIndex < endColmns && rowIndex >= startRow && rowIndex < endRow)
            return false;
        return true;
    },

    fillProcess: function (centerX, centerY, x, y) {
        var colmnsIndex = centerX + x;
        var rowIndex = centerY + y;
        this.copyTileImage(colmnsIndex, rowIndex);
    },

    copyTileImage: function (colmnsIndex, rowIndex) {
        //console.log("绘制：", colmnsIndex, rowIndex,this._bufferRect.x,this._bufferRect.y);
        var ix = colmnsIndex;
        var iy = rowIndex;
        if (engine.macro.IS_COCOS_CREATOR) {
            this.loadSlice(this._dirUrl + "/slices/" + ix + "_" + iy, ix, iy);
        }
        else {
            this.loadSlice(this._dirUrl + "/slices/" + ix + "_" + iy + ".jpg", ix, iy);
        }
    },

    loadSlice: function (sliceUrl, tileX, tileY) {
        var itemX = tileX * this._tileWidth;
        var itemY = this._mapHeight - tileY * this._tileHeight - this._tileHeight;
        //console.log("瓦片位置：",itemX,itemY);

        var that = this;

        var resId = this.getTileResId(tileX, tileY);
        var sliceItem = this._tiles.objectForKey(resId);
        if (sliceItem) {
            sliceItem.setPosition(itemX, itemY);
            if(sliceItem.parent != that._bufferContainer)
            {
                that._bufferContainer.addChild(sliceItem);
            }
        }
        else {
                var sliceItem = new cc.Node();
                sliceItem.setAnchorPoint(0, 0);
                sliceItem.setPosition(itemX, itemY);
                that._bufferContainer.addChild(sliceItem);
                that._tiles.setObject(resId, sliceItem);

                engine.ResourceManager.getInstance().loadRes(sliceUrl, (err, texture) => {
                if (err) {
                    cc.error(err);
                }
                else {
                    //cc.log("加载完成：",resId,slicePath);
                    //texture=that.colorSprite(new cc.Size(256,256),new cc.Color(0,255,0,255))

                    var sliceItem = that._tiles.objectForKey(resId);
                    var sprite = sliceItem.addComponent(cc.Sprite);
                    sprite.spriteFrame = new cc.SpriteFrame(texture);

                }
            });


            /*  cc.loader.loadRes(slicePath, function (err, img) {
                  if (err) {
                      cc.log(err, slicePath);
                  }
                  else {
                      //   cc.log(slicePath, "ok");
                      var texture2d = new cc.Texture2D();
                      texture2d.initWithElement(img);
                      texture2d.handleLoadedTexture();
                      sliceItem = new cc.Sprite(texture2d);
                      sliceItem.setAnchorPoint(0, 0);
                      sliceItem.setPosition(itemX, itemY);
                      that._bufferContainer.addChild(sliceItem);
  
                      that.tilessssss.setObject(slicePath,sliceItem);
                  }
              });*/
        }
    },

    /**
 * 创建单一颜色的精灵
 * @param size {cc.Size} 尺寸
 * @param color {cc.Color} 颜色
 * @returns {cc.Sprite}
 */
    colorSprite: function (size, color) {
        var buffer = new Uint8Array(4);
        buffer[0] = color.r;
        buffer[1] = color.g;
        buffer[2] = color.b;
        buffer[3] = color.a;

        var tex = new cc.Texture2D();
        tex.initWithData(buffer, cc.Texture2D.PIXEL_FORMAT_RGBA8888, 1, 1, size);
        return tex;


        // var render = new cc.RenderTexture(size.width, size.height);
        // render.beginWithClear(color.r, color.g, color.b, color.a);
        // render.visit();
        // render.end();
        // return render.getSprite().texture;
    },

    getViewUIPos : function() {
        var pos = engine.CommonUtil.convertToUI({x:this._viewX, y:this._viewY});
        return pos;
    },

    getViewGLPos : function() {
        var pos = {x:this._viewX, y:this._viewY};
        return pos;
    },

    setViewUIPos: function (viewX, viewY) {
        var pos = engine.CommonUtil.convertToGL({x:viewX, y:viewY});
        this.setViewGLPos(pos.x,pos.y);
    },

    setViewGLPos: function (viewX, viewY) {
        this._viewX = viewX;
        this._viewY = viewY;

        if (!this._updatable)
            return;

        var isRefreshScreen = true;
        if (this._viewX == this._lastViewX && this._viewY == this._lastViewY) {
            isRefreshScreen = false;
        }

        this._lastViewX = this._viewX;
        this._lastViewY = this._viewY;

        if (isRefreshScreen) {
            this._screenRect.x = -this._viewX;
            this._screenRect.y = this._viewY;

            //console.log("刷新缓冲区",this._viewX,this._viewY,this._tileWidth,this._tileHeight);
            // 计算出缓冲区开始的区块索引
            this._startTileX = Math.floor(this._screenRect.x / this._tileWidth);
            this._startTileY = Math.floor((this._screenRect.y - this._viewHeight) / this._tileHeight);

            var isRefreshBuffer = true;

            //剩余值
            this._offsetPoint.x = this._screenRect.x % this._tileWidth;
            this._offsetPoint.y = this._screenRect.y % this._tileHeight;

            // 如果缓冲区的区块索引与上一帧相同，则本帧无需刷新缓冲区
            var tileXDelta = this._startTileX - this._lastStartTileX;
            if (tileXDelta < 0)
                tileXDelta = -tileXDelta;
            var tileYDelta = this._startTileY - this._lastStartTileY;
            if (tileYDelta < 0)
                tileYDelta = -tileYDelta;
            if (tileXDelta == 0 && tileYDelta == 0) {
                isRefreshBuffer = false;
            }
            else if (tileXDelta > this._bufferCols * 0.5 || tileYDelta > this._bufferRows * 0.5) //移动超过半屏当做是切换镜头
            {
                this._lastStartTileX = -1;
                this._lastStartTileY = -1;
            }
            //console.log("isRefreshBuffer",this._viewX,this._viewY,this._startTileX,this._startTileY);

            this._viewRect.x = this._offsetPoint.x - this._pretreatmentWidth;
            this._viewRect.y = this._offsetPoint.y + this._pretreatmentHeight;

            var buffPosX = -this._screenRect.x;
            var buffPosY = this._screenRect.y - this._mapHeight;
            //console.log("刷新坐标",buffPosX,buffPosY,this._viewX,this._viewY);
            this._bufferContainer.setPosition(buffPosX, buffPosY);

            // 加载地图区块到缓冲区中
            if (isRefreshBuffer) {
                this.refreshBuffer();
            }

            this._lastStartTileX = this._startTileX;
            this._lastStartTileY = this._startTileY;
        }
    },

    refreshBuffer: function () {
        if (!this._updatable)
            return;
        //计算出当前缓冲区矩形的X,Y坐标
        this._bufferRect.x = this._startTileX * this._tileWidth;
        this._bufferRect.y = this._startTileY * this._tileHeight;
        //console.log("buffRect:",this._bufferRect.x,this._bufferRect.y);

        // this._bufferBitmapData.lock();
        //如果是滚动刷新缓冲区
        if (this._lastStartTileX == -1 && this._lastStartTileY == -1) //填充全部
        {
            // this._bufferBitmapData.fillRect(this._bufferBitmapData.rect, 0);
        }
        else {
            var tileXDelta = this._startTileX - this._lastStartTileX;
            var tileYDelta = this._startTileY - this._lastStartTileY;
            //  this._bufferBitmapData.scroll(-tileXDelta * this._tileWidth, -tileYDelta * this._tileHeight);
        }

        //var time = getTimer();
        //将缓冲区对应的地图区块读入缓冲区中 
        this.clearPeripheral();
        this.fillInternal();
        //      time = getTimer() - time;
        //      if (time >= 5)
        //        SDebug.warningPrint(this, String(this) + "refreshBuffer消耗严重！当前为：" + time);
        // this._bufferBitmapData.unlock();
    },

    clearPeripheral: function () {
        var startRow;
        var endRow;
        var startColmns;
        var endColmns;
        var rowCount;
        var colmnsCount;
        if (this._lastStartTileX == -1 && this._lastStartTileY == -1) //清除全部
        {
            //上方
            startRow = 0;
            endRow = this._startTileY - this._pretreatmentNum;

            startColmns = 0;
            endColmns = this._mapCols;

            for (rowCount = startRow; rowCount < endRow; rowCount++) {
                for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                    this.clearTile(colmnsCount, rowCount);
                }
            }

            //下方
            startRow = this._bufferRows + this._pretreatmentNum + this._startTileY;
            endRow = this._mapRows;

            startColmns = 0;
            endColmns = this._mapCols;

            for (rowCount = startRow; rowCount < endRow; rowCount++) {
                for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                    this.clearTile(colmnsCount, rowCount);
                }
            }

            //左方
            startRow = 0;
            endRow = this._mapRows;

            startColmns = 0;
            endColmns = this._startTileX - this._pretreatmentNum;

            for (rowCount = startRow; rowCount < endRow; rowCount++) {
                for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                    this.clearTile(colmnsCount, rowCount);
                }
            }

            //右方
            startRow = 0;
            endRow = this._mapRows;

            startColmns = this._bufferCols + this._pretreatmentNum + this._startTileX;
            endColmns = this._mapCols;

            for (rowCount = startRow; rowCount < endRow; rowCount++) {
                for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                    this.clearTile(colmnsCount, rowCount);
                }
            }
        }
        else //清除局部
        {
            var tileXDelta = this._startTileX - this._lastStartTileX;
            var tileYDelta = this._startTileY - this._lastStartTileY;

            if (tileYDelta < 0) //清除缓冲区下方几排
            {
                startRow = this._bufferRows + this._pretreatmentNum + this._startTileY;
                endRow = this._bufferRows + this._pretreatmentNum + this._startTileY - tileYDelta;

                if (tileXDelta < 0) //右方
                {
                    startColmns = this._startTileX - this._pretreatmentNum;
                    endColmns = this._bufferCols + this._startTileX + this._pretreatmentNum - tileXDelta;
                }
                else //左方
                {
                    startColmns = this._startTileX - this._pretreatmentNum - tileXDelta;
                    endColmns = this._bufferCols + this._startTileX + this._pretreatmentNum;
                }

                for (rowCount = startRow; rowCount < endRow; rowCount++) {
                    for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                        this.clearTile(colmnsCount, rowCount);
                    }
                }
            }
            else if (tileYDelta > 0) //清除缓冲区上方几排
            {
                startRow = this._startTileY - this._pretreatmentNum - tileYDelta;
                endRow = this._startTileY - this._pretreatmentNum;

                if (tileXDelta < 0) //右方
                {
                    startColmns = this._startTileX - this._pretreatmentNum;
                    endColmns = this._bufferCols + this._startTileX + this._pretreatmentNum - tileXDelta;
                }
                else //左方
                {
                    startColmns = this._startTileX - this._pretreatmentNum - tileXDelta;
                    endColmns = this._bufferCols + this._startTileX + this._pretreatmentNum;
                }

                for (rowCount = startRow; rowCount < endRow; rowCount++) {
                    for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                        this.clearTile(colmnsCount, rowCount);
                    }
                }
            }

            if (tileXDelta < 0) //清除缓冲区右方几排
            {
                if (tileYDelta < 0) //下方
                {
                    startRow = this._startTileY - this._pretreatmentNum;
                    endRow = this._bufferRows + this._startTileY + this._pretreatmentNum - tileYDelta;
                }
                else //上方
                {
                    startRow = this._startTileY - this._pretreatmentNum - tileYDelta;
                    endRow = this._bufferRows + this._startTileY + this._pretreatmentNum;
                }

                startColmns = this._bufferCols + this._pretreatmentNum + this._startTileX;
                endColmns = this._bufferCols + this._pretreatmentNum + this._startTileX - tileXDelta;

                for (rowCount = startRow; rowCount < endRow; rowCount++) {
                    for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                        this.clearTile(colmnsCount, rowCount);
                    }
                }
            }
            else if (tileXDelta > 0) //清除缓冲区左方几排
            {
                if (tileYDelta < 0) //下方
                {
                    startRow = this._startTileY - this._pretreatmentNum;
                    endRow = this._bufferRows + this._startTileY + this._pretreatmentNum - tileYDelta;
                }
                else //上方
                {
                    startRow = this._startTileY - this._pretreatmentNum - tileYDelta;
                    endRow = this._bufferRows + this._startTileY + this._pretreatmentNum;
                }

                startColmns = this._startTileX - this._pretreatmentNum - tileXDelta;
                endColmns = this._startTileX - this._pretreatmentNum;

                for (rowCount = startRow; rowCount < endRow; rowCount++) {
                    for (colmnsCount = startColmns; colmnsCount < endColmns; colmnsCount++) {
                        this.clearTile(colmnsCount, rowCount);
                    }
                }
            }
        }
    },

    clearTile: function (tileX, tileY) {
        if (tileX < 0 || tileY < 0)
            return;
        if (tileX >= 0 && tileX < this._mapCols && tileY >= 0 && tileY < this._mapRows) {
            var resId = this.getTileResId(tileX, tileY);
            var sliceItem = this._tiles.objectForKey(resId);
            if (sliceItem) {
                if (sliceItem.parent) {
                    sliceItem.parent.removeChild(sliceItem);
                    //console.log("移除瓦片！",tileX,tileY);
                }
            }

            // var tile = this._tiles.getValue(tileId);
            // if (tile) {
            //     tile.removeOnComplete(this.onTileResourceParserComplete);
            //     tile.destroy();
            //     this._tiles.deleteValue(tileId);
            // }
        }
        // else {
        //     console.error("地图删除区域不在范围内！");
        // }
    },

    getTileResId: function (tileX, tileY) {
        var resId = tileX + "_" + tileY;
        return resId;
    },

    setViewSize: function (viewWidth, viewHeight) {
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;

        this._viewRect.x = 0;
        this._viewRect.y = 0;
        this._viewRect.width = this._viewWidth;
        this._viewRect.height = this._viewHeight;
        this._screenRect.x = 0;
        this._screenRect.y = 0;
        this._screenRect.width = this._viewWidth;
        this._screenRect.height = this._viewHeight;
        this.updateBufferSize();
        if (this._updatable)
            this.updateCamera();
    },

    updateBufferSize: function () {
        this._bufferCols = Math.ceil(this._viewWidth / this._tileWidth);
        this._bufferRows = Math.ceil(this._viewHeight / this._tileHeight);
        //      _bufferCols = _bufferCols > _mapCols ? _mapCols : _bufferCols;
        //      _bufferRows = _bufferRows > _mapRows ? _mapRows : _bufferRows;

        if (this._bufferCols > 0 && this._bufferRows > 0) {
            /*if (this._bufferBitmapData)
                this._bufferBitmapData.dispose();
            this._bufferBitmapData = new BitmapData((this._bufferCols + 2 * this._pretreatmentNum) * this._tileWidth, (this._bufferRows + 2 * this._pretreatmentNum) * this._tileHeight, this._transparent, 0);
            this._bufferRect = this._bufferBitmapData.rect.clone();

            this._bufferBitmap.bitmapData = this._bufferBitmapData;*/

            this._lastStartTileX = -1;
            this._lastStartTileY = -1;
            this._lastViewX = -1;
            this._lastViewY = -1;
        }
    },

    updateCamera: function () {
        //var viewX = SSceneRender.getInstance().viewX;
        //var viewY = SSceneRender.getInstance().viewY;
        //this.focus(viewX, viewY);
    }
});
