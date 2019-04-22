(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["hky"] = factory();
	else
		root["hky"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Layer; });
/**
 * 抽象类：图层类
 */
var Layer = /** @class */ (function () {
    function Layer() {
        this.visible = false;
    }
    // 方法
    /**
     * 加载到地图
     * @param map 地图容器
     */
    Layer.prototype.addTo = function (map) {
        map.addLayer(this);
        this.map = map;
        return Promise.resolve(this);
    };
    /**
     * 获取地图容器
     */
    Layer.prototype.getMap = function () {
        return this.map;
    };
    /**
     * 移除图层
     * @param map 所在地图容器
     */
    Layer.prototype.removeFrom = function (map) {
        if (map) {
            map.removeLayer(this);
        }
        return this;
    };
    return Layer;
}());



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GeojsonLayer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Geojson图层类，暂仅支持多边形
 */
var GeojsonLayer = /** @class */ (function (_super) {
    __extends(GeojsonLayer, _super);
    /**
     * 初始化构造Geojson类
     * @param url geosjon数据请求Http地址
     * @param crs 数据参考坐标系
     */
    function GeojsonLayer(url, crs) {
        var _this = _super.call(this) || this;
        _this.geoJsonHttpUrl = url;
        //this.json = JSON.parse(jsonstr) ;
        _this.crs = crs;
        _this.polygons = new Array();
        return _this;
    }
    GeojsonLayer.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.polygons.forEach(function (_) { return _.destruct(); });
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    GeojsonLayer.prototype.refresh = function () {
        var _this = this;
        fetch(this.geoJsonHttpUrl, {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }).then(function (response) {
            response.json().then(function (json) {
                var polygonMarkers = altizure.GeoJson.polygonsFromGeoJson(json, _this.map.sandbox, {
                    top: 20,
                    bottom: 0.1,
                    color: 0xffffff * Math.random(),
                    opacity: 0.2
                });
                _this.polygons = polygonMarkers;
                //定位
                if (polygonMarkers.length > 0) {
                    var pose = Object.assign({}, _this.polygons[0].position);
                    pose.alt = pose.alt + 1000;
                    pose.tilt = 45;
                    _this.map.flyTo(pose, 1000);
                }
            });
        });
    };
    return GeojsonLayer;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LightBeamMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * LightBeamMarker类
 */
var LightBeamMarker = /** @class */ (function (_super) {
    __extends(LightBeamMarker, _super);
    /**
     * 初始化构造AltizureProjectMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function LightBeamMarker(option) {
        var _this = _super.call(this) || this;
        _this.loptions = option;
        _this.lightBeamMarker = new altizure.LightBeamMarker(_this.loptions);
        return _this;
    }
    LightBeamMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    LightBeamMarker.prototype.refresh = function () {
        //this.addTo(this.map); 
        //return this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
    };
    return LightBeamMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OBJMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * OBJMarker类
 */
var OBJMarker = /** @class */ (function (_super) {
    __extends(OBJMarker, _super);
    /**
     * 初始化构造TagMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function OBJMarker(option) {
        var _this = _super.call(this) || this;
        _this.ioptions = option;
        _this.posecnt = 0;
        _this.ibjMarker = new altizure.OBJMarker(_this.ioptions);
        return _this;
    }
    OBJMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.ibjMarker.destruct();
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    OBJMarker.prototype.refresh = function () {
        //this.addTo(this.map);
        //this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
    };
    /**
     * 移动
     * @param points 路径点
     * @param turnTime 时间，单位毫秒
     * @param speed veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
     * @param amark 场景
     */
    OBJMarker.prototype.move = function (points, turnTime, speed, amark, sandbox) {
        var path = new Array();
        if (points.length < 2) {
            console.log("路径点数要大于2");
            return;
        }
        var frequency = 100; // 插值点数  
        //根据距离获取插值点
        var pathdis = new Array(); //各段距离 
        var pathfrequency = new Array(); //各段插值点数
        var disall = 0; //总距离
        for (var i = 0; i < points.length - 1; i++) {
            var dis = Math.abs(sandbox.calculateDistanceBetweenTwoPoints(points[i + 1], points[i]));
            pathdis.push(dis);
            disall += dis;
        }
        for (var i = 0; i < pathdis.length; i++) {
            pathfrequency.push(Math.round(pathdis[i] / disall * frequency));
        }
        for (var i = 0; i < points.length - 1; i++) {
            for (var j = 0; j < pathfrequency[i]; j++) {
                var lng = points[i].lng + (points[i + 1].lng - points[i].lng) / pathfrequency[i] * j;
                var lat = points[i].lat + (points[i + 1].lat - points[i].lat) / pathfrequency[i] * j;
                var alt = points[i].alt + (points[i + 1].alt - points[i].alt) / pathfrequency[i] * j;
                path.push({ lng: lng, lat: lat, alt: alt });
            }
        }
        //获取高度
        try {
            var alts = amark.pickDepthMap(path);
            for (var i = 0; i < alts.length; i++) {
                path[i].alt = alts[i];
            }
        }
        catch (_a) {
        }
        this.MuiltiPose(path, turnTime / frequency, speed, points);
    };
    //移动
    OBJMarker.prototype.MuiltiPose = function (aps, turnTime, speed, pointangle) {
        var array1 = new Array();
        var Multiple = 1;
        if (speed == "veryslow") {
            Multiple = 4;
        }
        else if (speed == "slow") {
            Multiple = 2;
        }
        else if (speed == "fast") {
            Multiple = 0.5;
        }
        else if (speed == "veryfast") {
            Multiple = 0.25;
        }
        var omark = this;
        //转换角度
        for (var i = 0; i < pointangle.length - 1; i++) {
            if (this.posecnt < aps.length && pointangle[i].lat == aps[this.posecnt].lat && pointangle[i].lng == aps[this.posecnt].lng) {
                this.ibjMarker.euler = { z: this.GetAngle(pointangle[i], pointangle[i + 1]) };
            }
        }
        this.ibjMarker.position = aps[omark.posecnt];
        var poseout;
        if (this.posecnt < aps.length) {
            poseout = setTimeout(function () { omark.MuiltiPose(aps, turnTime, speed, pointangle); }, turnTime * Multiple);
            this.posecnt++;
        }
        else {
            clearTimeout(poseout);
            this.posecnt = 0;
        }
    };
    OBJMarker.prototype.GetAngle = function (pntFirst, pntNext) {
        var dRotateAngle = Math.atan2(Math.abs(pntFirst.lng - pntNext.lng), Math.abs(pntFirst.lat - pntNext.lat));
        if (pntNext.lng >= pntFirst.lng) {
            if (pntNext.lat >= pntFirst.lat) {
            }
            else {
                dRotateAngle = Math.PI - dRotateAngle;
                //dRotateAngle = 2*Math.PI - dRotateAngle;
            }
        }
        else {
            if (pntNext.lat >= pntFirst.lat) {
                dRotateAngle = 2 * Math.PI - dRotateAngle;
                //dRotateAngle =  Math.PI/4 - dRotateAngle;
            }
            else {
                dRotateAngle = Math.PI + dRotateAngle;
                //dRotateAngle = Math.PI + dRotateAngle;
            }
        }
        //dRotateAngle = dRotateAngle * 180 / Math.PI;
        return dRotateAngle;
    };
    return OBJMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ParticleEffectsMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * ParticleEffectsMarker类
 */
var ParticleEffectsMarker = /** @class */ (function (_super) {
    __extends(ParticleEffectsMarker, _super);
    /**
     * 初始化构造AltizureProjectMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function ParticleEffectsMarker(option) {
        var _this = _super.call(this) || this;
        _this.coptions = option;
        _this.particleEffectsMarker = new altizure.ParticleEffectsMarker(_this.coptions);
        _this.particleEffectsMarker.animatingTime = -1;
        return _this;
    }
    ParticleEffectsMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.particleEffectsMarker.destruct();
        this.removeFrom(this.map);
        return 0;
    };
    ParticleEffectsMarker.prototype.refresh = function () {
        //this.addTo(this.map);  
    };
    return ParticleEffectsMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TagMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * TagMarker类
 */
var TagMarker = /** @class */ (function (_super) {
    __extends(TagMarker, _super);
    /**
     * 初始化构造TagMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function TagMarker(option) {
        var _this = _super.call(this) || this;
        _this.toptions = option;
        _this.tagMarker = new altizure.TagMarker(_this.toptions);
        return _this;
    }
    TagMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.tagMarker.destruct();
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    TagMarker.prototype.refresh = function () {
        //this.addTo(this.map);
        //this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
    };
    return TagMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextTagMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * TextTagMarker类
 */
var TextTagMarker = /** @class */ (function (_super) {
    __extends(TextTagMarker, _super);
    /**
     * 初始化构造TextTagMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function TextTagMarker(option) {
        var _this = _super.call(this) || this;
        _this.toptions = option;
        _this.textTagMarker = new altizure.TextTagMarker(_this.toptions);
        return _this;
    }
    TextTagMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.textTagMarker.destruct();
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    TextTagMarker.prototype.refresh = function () {
        //this.addTo(this.map);
        //this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
    };
    return TextTagMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map_Map__ = __webpack_require__(13);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Map", function() { return __WEBPACK_IMPORTED_MODULE_0__map_Map__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layer_GeojsonLayer__ = __webpack_require__(1);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "GeojsonLayer", function() { return __WEBPACK_IMPORTED_MODULE_1__layer_GeojsonLayer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__layer_AltizureProjectMarker__ = __webpack_require__(8);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "AltizureProjectMarker", function() { return __WEBPACK_IMPORTED_MODULE_2__layer_AltizureProjectMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__layer_TextTagMarker__ = __webpack_require__(6);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TextTagMarker", function() { return __WEBPACK_IMPORTED_MODULE_3__layer_TextTagMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__layer_CameraMarker__ = __webpack_require__(9);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "CameraMarker", function() { return __WEBPACK_IMPORTED_MODULE_4__layer_CameraMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__layer_ParticleEffectsMarker__ = __webpack_require__(4);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ParticleEffectsMarker", function() { return __WEBPACK_IMPORTED_MODULE_5__layer_ParticleEffectsMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__layer_TagMarker__ = __webpack_require__(5);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TagMarker", function() { return __WEBPACK_IMPORTED_MODULE_6__layer_TagMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__layer_OBJMarker__ = __webpack_require__(3);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "OBJMarker", function() { return __WEBPACK_IMPORTED_MODULE_7__layer_OBJMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__layer_LightBeamMarker__ = __webpack_require__(2);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "LightBeamMarker", function() { return __WEBPACK_IMPORTED_MODULE_8__layer_LightBeamMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__layer_ZoneMarker__ = __webpack_require__(12);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ZoneMarker", function() { return __WEBPACK_IMPORTED_MODULE_9__layer_ZoneMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__layer_PolyLineMarker__ = __webpack_require__(11);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "PolyLineMarker", function() { return __WEBPACK_IMPORTED_MODULE_10__layer_PolyLineMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__layer_PolyCylinderLineMarker__ = __webpack_require__(10);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "PolyCylinderLineMarker", function() { return __WEBPACK_IMPORTED_MODULE_11__layer_PolyCylinderLineMarker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__map_Play__ = __webpack_require__(14);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Play", function() { return __WEBPACK_IMPORTED_MODULE_12__map_Play__["a"]; });
/**
 * 说明编译JavaScript包需要输出的类及变量
 */















/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AltizureProjectMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * AltizureProjectMarker类
 */
var AltizureProjectMarker = /** @class */ (function (_super) {
    __extends(AltizureProjectMarker, _super);
    /**
     * 初始化构造AltizureProjectMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function AltizureProjectMarker(option) {
        var _this = _super.call(this) || this;
        _this.aoptions = option;
        return _this;
    }
    AltizureProjectMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    AltizureProjectMarker.prototype.refresh = function () {
        //this.addTo(this.map); 
        return this.map.sandbox.add('AltizureProjectMarker', this.aoptions);
    };
    return AltizureProjectMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CameraMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * AltizureProjectMarker类
 */
var CameraMarker = /** @class */ (function (_super) {
    __extends(CameraMarker, _super);
    /**
     * 初始化构造AltizureProjectMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function CameraMarker(option) {
        var _this = _super.call(this) || this;
        _this.coptions = option;
        _this.cameraMarker = new altizure.CameraMarker(_this.coptions);
        return _this;
    }
    CameraMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.removeFrom(this.map);
        return 0;
    };
    CameraMarker.prototype.rotate = function () {
        var cmark = this.cameraMarker;
        var map = this.map;
        var m = 1;
        setInterval(function () {
            cmark.euler = { z: Math.PI / m };
            map.sandbox.camera.flyToCamToEarth(cmark.camToEarth);
            m++;
        }, 2000);
        /*  this.cameraMarker.euler = {y: Math.PI/4};
         this.map.sandbox.camera.flyToCamToEarth(this.cameraMarker.camToEarth); */
    };
    /**
     * 绘制图层
     */
    CameraMarker.prototype.refresh = function () {
        //this.addTo(this.map);  
    };
    return CameraMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PolyCylinderLineMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * PolyLineMarker
 */
var PolyCylinderLineMarker = /** @class */ (function (_super) {
    __extends(PolyCylinderLineMarker, _super);
    /**
     * PolyCylinderLineMarker
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function PolyCylinderLineMarker(option) {
        var _this = _super.call(this) || this;
        /*   let pts2 = points
            .map(function(lnglatalt)  {
              return new altizure.LngLatAlt(lnglatalt[0], lnglatalt[1], lnglatalt[2])
            });
          option.points = pts2; */
        _this.ploptions = option;
        _this.polylineMarker = new altizure.PolyCylinderLineMarker(_this.ploptions);
        return _this;
    }
    PolyCylinderLineMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.polylineMarker.destruct();
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    PolyCylinderLineMarker.prototype.refresh = function () {
        //this.addTo(this.map);
        //this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
    };
    return PolyCylinderLineMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PolyLineMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * PolyLineMarker
 */
var PolyLineMarker = /** @class */ (function (_super) {
    __extends(PolyLineMarker, _super);
    /**
     * PolyLineMarker
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function PolyLineMarker(option) {
        var _this = _super.call(this) || this;
        /*   let pts2 = points
            .map(function(lnglatalt)  {
              return new altizure.LngLatAlt(lnglatalt[0], lnglatalt[1], lnglatalt[2])
            });
          option.points = pts2; */
        _this.ploptions = option;
        _this.polylineMarker = new altizure.PolyLineMarker(_this.ploptions);
        return _this;
    }
    PolyLineMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.polylineMarker.destruct();
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    PolyLineMarker.prototype.refresh = function () {
        //this.addTo(this.map);
        //this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
    };
    return PolyLineMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoneMarker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Layer__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * OBJMarker类
 */
var ZoneMarker = /** @class */ (function (_super) {
    __extends(ZoneMarker, _super);
    /**
     * 初始化构造TagMarker类
     * @param earth 标记附加的地球
     * @param crs 数据参考坐标系
     */
    function ZoneMarker(option) {
        var _this = _super.call(this) || this;
        _this.zoptions = option;
        _this.zoneMarker = new altizure.ZoneMarker(_this.zoptions);
        return _this;
    }
    ZoneMarker.prototype.remove = function () {
        console.log("remove");
        console.log(this);
        this.zoneMarker.destruct();
        this.removeFrom(this.map);
        return 0;
    };
    /**
     * 绘制图层
     */
    ZoneMarker.prototype.refresh = function () {
        //this.addTo(this.map);
        //this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
    };
    return ZoneMarker;
}(__WEBPACK_IMPORTED_MODULE_0__Layer__["a" /* Layer */]));



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Map; });
var Map = /** @class */ (function () {
    function Map(id, options) {
        this.iscancel = false;
        this.isflystop = false;
        this.sandbox = new altizure.Sandbox(id, options);
        this.layers = new Array();
        this.divID = id;
        this.posecnt = 0;
        this.SinglePoint = { tilt: 0, north: 0, lng: 0, lat: 0, alt: 0 };
        this.SinglePointendpose = { tilt: 0, north: 0, lng: 0, lat: 0, alt: 0 };
        this.SinglePointbeginTime = 0;
        this.SinglePointendTime = 0;
        this.SinglePointduration = 0;
        this.dispoints = new Array();
        this.reduceNum = 0;
        this.reduceStatue = true;
        this.reduceArray = new Array();
        console.log("map created.");
        window.document.oncontextmenu = function () { return false; };
    }
    /**
     * 删除图层
     * @param layer 待删除的图层
     * @returns 返回图层所在序列
     */
    Map.prototype.removeLayer = function (layer) {
        var layerIndex = this.layers.indexOf(layer);
        if (layerIndex > -1) {
            this.layers.splice(layerIndex, 1);
        }
        return layerIndex;
    };
    Map.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    };
    Map.prototype.flyTo = function (p, duration) {
        this.isflystop = false;
        this.SinglePoint = p;
        this.SinglePointduration = duration;
        this.SinglePointbeginTime = new Date().getTime(); //时间戳
        return this.sandbox.camera.flyTo(p, duration);
    };
    Map.prototype.flystop = function () {
        this.isflystop = true;
        this.SinglePointendTime = new Date().getTime(); //时间戳
        this.SinglePointendpose = this.sandbox.camera.pose;
        return this.sandbox.camera.stop();
    };
    Map.prototype.continueflyTo = function () {
        if (this.SinglePointendTime == 0) {
            console.log("无法继续飞行");
            return Promise.resolve({});
        }
        var array1 = new Array();
        var continueduration = this.SinglePointduration - (this.SinglePointendTime - this.SinglePointbeginTime);
        this.sandbox.camera.pose = this.SinglePointendpose;
        return this.flyTo(this.SinglePoint, continueduration);
    };
    Map.prototype.singlefly = function (flymode, endPoint, turnTime, speed) {
        var Multiple = 1;
        if (speed == "veryslow") {
            Multiple = 4;
        }
        else if (speed == "slow") {
            Multiple = 2;
        }
        else if (speed == "fast") {
            Multiple = 0.5;
        }
        else if (speed == "veryfast") {
            Multiple = 0.25;
        }
        ;
        if (flymode.toLocaleLowerCase() == "fly") {
            this.flyTo(endPoint, Multiple * turnTime);
        }
        else if (flymode.toLocaleLowerCase() == "pose") {
            this.Pose(endPoint);
        }
        else if (flymode.toLocaleLowerCase() == "lineto") {
            this.LineTo(endPoint, turnTime, speed, this);
        }
    };
    /**
     * 单点滑行（LineTo）
     * @param startPoint 开始位置
     * @param endPoint 结束位置
     * @param turnTime 每次飞行时间，单位毫秒
     * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
     */
    Map.prototype.LineTo = function (endPoint, turnTime, speed, map) {
        var pathpoint = 100; //默认100个插值点
        var path = new Array();
        var startPoint = this.sandbox.camera.pose;
        for (var j = 0; j < pathpoint; j++) {
            var lng = startPoint.lng + (endPoint.lng - startPoint.lng) / pathpoint * j;
            var lat = startPoint.lat + (endPoint.lat - startPoint.lat) / pathpoint * j;
            var alt = startPoint.alt + (endPoint.alt - startPoint.alt) / pathpoint * j;
            var tilt = startPoint.tilt + (endPoint.tilt - startPoint.tilt) / pathpoint * j;
            var north = startPoint.north + (endPoint.north - startPoint.north) / pathpoint * j;
            path.push({ lng: lng, lat: lat, alt: alt, tilt: tilt, north: north });
        }
        return this.MuiltiFlyto(path, turnTime, speed);
    };
    Map.prototype.Multipointfly = function (flymode, points, turnTime, speed) {
        if (flymode.toLocaleLowerCase() == "fly") {
            return this.MuiltiFlyto(points, turnTime, speed);
        }
        else if (flymode.toLocaleLowerCase() == "pose") {
            this.MuiltiPose(points, turnTime, speed, this);
        }
        else if (flymode.toLocaleLowerCase() == "lineto") {
            return this.MuiltiLineTo(points, turnTime, speed);
        }
    };
    /**
    * 多点滑行（MuiltiLineTo）
    * @param points 路径点
    * @param turnTime 每次飞行时间，单位毫秒
    * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
    */
    Map.prototype.MuiltiLineTo = function (points, turnTime, speed) {
        var path = new Array();
        if (points.length < 2) {
            console.log("路径点数要大于2");
            return Promise.resolve();
        }
        var frequency = 100; // 插值点数  
        //根据距离获取插值点
        var pathdis = new Array(); //各段距离 
        var pathfrequency = new Array(); //各段插值点数
        var disall = 0; //总距离
        for (var i = 0; i < points.length - 1; i++) {
            var dis = Math.abs(this.sandbox.calculateDistanceBetweenTwoPoints(points[i + 1], points[i]));
            pathdis.push(dis);
            disall += dis;
        }
        //距离为0，特殊分配
        if (disall == 0) {
            for (var i = 0; i < pathdis.length; i++) {
                pathfrequency.push(frequency / points.length);
            }
        }
        else {
            for (var i = 0; i < pathdis.length; i++) {
                if (pathdis[i] == 0) {
                    pathfrequency.push(frequency / points.length);
                }
                else {
                    pathfrequency.push(Math.round(pathdis[i] / disall * frequency));
                }
            }
        }
        for (var i = 0; i < points.length - 1; i++) {
            for (var j = 0; j < pathfrequency[i]; j++) {
                var lng = points[i].lng + (points[i + 1].lng - points[i].lng) / pathfrequency[i] * j;
                var lat = points[i].lat + (points[i + 1].lat - points[i].lat) / pathfrequency[i] * j;
                var alt = points[i].alt + (points[i + 1].alt - points[i].alt) / pathfrequency[i] * j;
                var tilt = points[i].tilt + (points[i + 1].tilt - points[i].tilt) / pathfrequency[i] * j;
                var north = points[i].north + (points[i + 1].north - points[i].north) / pathfrequency[i] * j;
                path.push({ lng: lng, lat: lat, alt: alt, tilt: tilt, north: north });
            }
        }
        return this.MuiltiFlyto(path, turnTime, speed);
    };
    /**
    * 多点飞行
    * @param aps 飞行点
    * @param turnTime 每次飞行时间，单位毫秒
    * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
    */
    Map.prototype.MuiltiFlyto = function (aps, turnTime, speed) {
        var array1 = new Array();
        var map = this;
        var Multiple = 1;
        if (speed == "veryslow") {
            Multiple = 4;
        }
        else if (speed == "slow") {
            Multiple = 2;
        }
        else if (speed == "fast") {
            Multiple = 0.5;
        }
        else if (speed == "veryfast") {
            Multiple = 0.25;
        }
        //根据距离获取时间
        var pathdis = new Array(); //各段距离 
        var pathtime = new Array(); //各段时间
        var disall = 0; //总距离
        for (var i = 0; i < aps.length - 1; i++) {
            var dis = Math.abs(map.sandbox.calculateDistanceBetweenTwoPoints(aps[i + 1], aps[i]));
            pathdis.push(dis);
            disall += dis;
        }
        //距离为0，特殊分配
        if (disall == 0) {
            for (var i = 0; i < pathdis.length; i++) {
                pathtime.push(Multiple * turnTime / aps.length);
            }
        }
        else {
            for (var i = 0; i < pathdis.length; i++) {
                if (pathdis[i] == 0) {
                    pathtime.push(Multiple * turnTime / aps.length);
                }
                else {
                    pathtime.push(Math.round(Multiple * turnTime * pathdis[i] / disall));
                }
            }
        }
        //视角切换到第一个点  准备飞行
        map.sandbox.camera.pose = aps[0];
        var _loop_1 = function (i) {
            if (aps.length - 2 == i) {
                array1.push(function () {
                    if (map.reduceStatue) {
                        map.reduceNum = 0;
                        return map.flyTo(aps[i + 1], pathtime[i]);
                    }
                });
            }
            else {
                array1.push(function () {
                    if (map.reduceStatue) {
                        map.reduceNum++;
                        return map.flyTo(aps[i + 1], pathtime[i]);
                    }
                });
            }
        };
        for (var i = 0; i < aps.length - 1; i++) {
            _loop_1(i);
        }
        return this.reduce(array1);
    };
    Map.prototype.flyToCamToEarth = function (mat, duration) {
        return this.sandbox.camera.flyToCamToEarth(mat, duration);
    };
    /**
   * 多点飞行
   * @param aps 飞行点
   * @param turnTime 每次飞行时间，单位毫秒
   * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
   */
    Map.prototype.MuiltiflyToCamToEarth = function (aps, turnTime, speed) {
        var array1 = new Array();
        var map = this;
        var Multiple = 1;
        if (speed == "veryslow") {
            Multiple = 4;
        }
        else if (speed == "slow") {
            Multiple = 2;
        }
        else if (speed == "fast") {
            Multiple = 0.5;
        }
        else if (speed == "veryfast") {
            Multiple = 0.25;
        }
        var _loop_2 = function (i) {
            if (aps.length - 2 == i) {
                array1.push(function () {
                    if (map.reduceStatue) {
                        map.reduceNum = 0;
                        return map.flyToCamToEarth(aps[i + 1], turnTime * Multiple);
                    }
                });
            }
            else {
                array1.push(function () {
                    if (map.reduceStatue) {
                        map.reduceNum++;
                        return map.flyToCamToEarth(aps[i + 1], turnTime * Multiple);
                    }
                });
            }
        };
        for (var i = 0; i < aps.length - 1; i++) {
            _loop_2(i);
        }
        /* aps.forEach(value=>
            array1.push( function() {return map.flyToCamToEarth(value, turnTime*Multiple)})
        );  */
        return this.reduce(array1);
    };
    Map.prototype.reduce = function (arr) {
        var sequence = Promise.resolve();
        this.reduceArray = arr;
        arr.forEach(function (value) {
            return sequence = sequence.then(value);
        });
        /* for(let i = 0 ; i < arr.length;i++){
            if(this.reduceStatue){
                sequence = sequence.then(arr[i]);
                this.reduceNum ++ ;
            }else{
                break;
            }
            if(this.reduceNum ==arr.length ){
                this.reduceNum = 0;
            }
        } */
        return sequence;
    };
    Map.prototype.reduceContinue = function () {
        this.reduceStatue = true;
        var array1 = new Array();
        for (var i = this.reduceNum; i < this.reduceArray.length; i++) {
            array1[i - this.reduceNum] = this.reduceArray[i];
        }
        this.reduceNum = 0;
        //this.reduce(array1);
        this.reduceArray = array1;
        return array1;
    };
    Map.prototype.Pose = function (p) {
        this.sandbox.camera.pose = p;
    };
    /**
     * 多点切换
     * @param aps 飞行点
     * @param turnTime 每次飞行时间，单位毫秒
     * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
     */
    Map.prototype.MuiltiPose = function (aps, turnTime, speed, map) {
        var array1 = new Array();
        var Multiple = 1;
        if (speed == "veryslow") {
            Multiple = 4;
        }
        else if (speed == "slow") {
            Multiple = 2;
        }
        else if (speed == "fast") {
            Multiple = 0.5;
        }
        else if (speed == "veryfast") {
            Multiple = 0.25;
        }
        if (map == null) {
            map = this;
        }
        map.sandbox.camera.pose = aps[map.posecnt];
        var poseout;
        if (map.posecnt < aps.length) {
            poseout = setTimeout(function () { map.MuiltiPose(aps, turnTime, speed, map); }, turnTime * Multiple / aps.length);
            map.posecnt++;
        }
        else {
            clearTimeout(poseout);
            map.posecnt = 0;
        }
    };
    Map.prototype.getView = function () {
        var mapDom = document.getElementById(this.divID);
        var bottomLeft = this.sandbox.window.toLngLatAlt({ x: 0, y: mapDom.clientHeight });
        var topRight = this.sandbox.window.toLngLatAlt({ x: mapDom.clientWidth, y: 0 });
        return [bottomLeft, topRight];
    };
    /**
    * camera针对某个目标进行360度环绕
    * @param tilt 倾角
    * @param circle 圆心位置
    * @param startPosition 环绕起始位置: 30(与正北方向夹角30度)
    * @param direction 环绕方向: Clockwise(顺时针); CounterClockwise(逆时针)
    * @param angularSpeed 角速度: 30(每秒环绕30度)
    * @param turnTime 环绕时间
    * @returns promise
    */
    Map.prototype.circleflyTo = function (tilt, circle, startPosition, direction, angularSpeed, turnTime) {
        //设置起始位置
        var InitPpose = circle;
        InitPpose.tilt = tilt;
        InitPpose.north = startPosition;
        var aps = new Array();
        aps.push(InitPpose);
        var currentNorth = startPosition;
        var muilti = 0;
        muilti = turnTime / 1000 * angularSpeed; //转的角度 
        muilti = muilti / (angularSpeed / 10); //5°飞一次   飞行的次数
        if (direction == "CounterClockwise") {
            for (var i = 0; i < muilti; i++) {
                var position1 = Object.assign({}, InitPpose);
                currentNorth = currentNorth + (angularSpeed / 10);
                if (currentNorth >= 360) {
                    currentNorth = currentNorth - 360;
                }
                position1.north = currentNorth;
                aps.push(position1);
            }
        }
        else {
            for (var i = 0; i < muilti; i++) {
                var position1 = Object.assign({}, InitPpose);
                currentNorth = currentNorth - (angularSpeed / 10);
                if (currentNorth <= 0) {
                    currentNorth = 360 + currentNorth;
                }
                position1.north = currentNorth;
                aps.push(position1);
            }
        }
        //let time = 1000 / angularSpeed * (angularSpeed/10);
        /* if(angularSpeed !=null){
            time = 1/angularSpeed*1000 * 5;
        }else{
            time = turnTime/72;
        } */
        return this.MuiltiLineTo(aps, turnTime, "normal");
    };
    /**
        * camera不动，360度旋转（类似人原地360度旋转）
        * @param tilt 倾角
        * @param circle 圆心位置
        * @param startPosition 环绕起始位置: 30(与正北方向夹角30度)
        * @param direction 环绕方向: Clockwise(顺时针); CounterClockwise(逆时针)
        * @param angularSpeed 角速度: 30(每秒环绕30度)
        * @param turnTime 环绕时间
        */
    Map.prototype.rorateflyTo = function (circle, direction, angularSpeed, turnTime) {
        //设置起始位置
        var InitPpose = circle;
        var map = this;
        var aps = new Array();
        var currentYeuler = 0;
        var muilti = 0;
        muilti = turnTime / 1000 * angularSpeed; //转的角度
        muilti = muilti / 5; //5°飞一次   飞行的次数
        this.Pose(InitPpose);
        var cmarker = new altizure.CameraMarker({
            sandbox: map.sandbox, camToEarth: map.sandbox.camera.mat, showFar: false, showNear: false, color: 0xff0000, showXYZ: false,
            name: "rorateCamera"
        });
        cmarker.euler = { x: Math.PI / 2, y: 0, z: 0 };
        if (direction == "CounterClockwise") {
            for (var i = 0; i < muilti; i++) {
                currentYeuler = currentYeuler + Math.PI * 2 / 360 * 5;
                if (currentYeuler >= Math.PI * 2) {
                    currentYeuler = currentYeuler - Math.PI * 2;
                }
                cmarker.euler = { y: currentYeuler };
                aps.push(cmarker.camToEarth);
            }
        }
        else {
            for (var i = 0; i < muilti; i++) {
                currentYeuler = currentYeuler - Math.PI * 2 / 360 * 5;
                if (currentYeuler <= 0) {
                    currentYeuler = Math.PI * 2 + currentYeuler;
                }
                cmarker.euler = { y: currentYeuler };
                aps.push(cmarker.camToEarth);
            }
        }
        return map.MuiltiflyToCamToEarth(aps, turnTime / muilti, "normal");
    };
    Map.prototype.removerorate = function () {
        this.removeMarker("rorateCamera");
    };
    /**
     * 删除图标
     * @param name 名称
     */
    Map.prototype.removeMarker = function (name) {
        var marks = this.sandbox.markerLayer.children;
        var SelectIndex = new Array();
        for (var i = 0; i < marks.length; i++) {
            if (name == marks[i].name) {
                SelectIndex.push(i);
            }
        }
        if (SelectIndex.length == 0) {
            //if(name != "dis")
            //console.log("没有名称为："+name+" 的图标")
        }
        else {
            for (var i = SelectIndex.length - 1; i >= 0; i--) {
                this.sandbox.markerLayer.removeChild(marks[SelectIndex[i]]);
            }
        }
    };
    /**
     * 气泡
     * @param position 气泡位置
     *  @html 气泡内容
     */
    Map.prototype.popup = function (position, width, height, html, img, audio, video, iscal) {
        if (iscal === void 0) { iscal = false; }
        if (this.popupdiv) {
            this.closepopup();
        }
        var pinDiv = document.createElement("div");
        pinDiv.style.width = width + "px";
        pinDiv.style.height = height + "px";
        pinDiv.classList.add("popup");
        if (video != "" && video != undefined) {
            var videoele = document.createElement("video");
            videoele.src = video;
            videoele.autoplay = true;
            videoele.style.width = "100%";
            pinDiv.appendChild(videoele);
        }
        if (audio != "" && audio != undefined) {
            var audioele = document.createElement("audio");
            audioele.src = audio;
            audioele.style.width = "100%";
            pinDiv.appendChild(audioele);
        }
        if (img != "" && img != undefined) {
            var imgele = document.createElement("img");
            imgele.src = img;
            imgele.style.width = "100%";
            pinDiv.appendChild(imgele);
        }
        var pele = document.createElement("p");
        pele.innerHTML = (html);
        pinDiv.appendChild(pele);
        pinDiv.style.position = "absolute";
        if (iscal) {
            pinDiv.style.background = "white";
            pinDiv.style.color = "blue";
            pinDiv.style.marginTop = "0px";
            var closeDiv = document.createElement("div");
            closeDiv.style.cssFloat = "right";
            closeDiv.style.color = "blue";
            closeDiv.style.cursor = "hand";
            closeDiv.innerHTML = "X";
            closeDiv.style.marginTop = "-38px";
            var domElement_1 = this.sandbox.domElement;
            var map_1 = this;
            closeDiv.onclick = function () {
                domElement_1.iscancel = false;
                map_1.removeMarker("dis");
                map_1.closepopup();
            };
            pinDiv.appendChild(closeDiv);
            //let domElement = this.sandbox.domElement;  
            //let closediv ="<div style='float:right' onclick=function(){}>X</div>"
        }
        document.body.appendChild(pinDiv);
        this.popupdiv = pinDiv;
        var mappopup = this;
        mappopup.updatePosition(position, height);
        this.sandbox.on('cameraChange', function () { mappopup.updatePosition(position, height); });
    };
    Map.prototype.updatePosition = function (position, height) {
        // transforms from earth-space position {lng, lat, alt} to screen-space {x, y}
        var screenPosition = this.sandbox.window.fromLngLatAlt(position);
        if (screenPosition && this.popupdiv) {
            this.popupdiv.style.left = screenPosition.x + 'px';
            this.popupdiv.style.top = (screenPosition.y - height) + 'px';
        }
    };
    Map.prototype.closepopup = function () {
        if (this.popupdiv == null) {
            //console.log("没有气泡框可以删除");
            return;
        }
        document.body.removeChild(this.popupdiv);
        this.popupdiv = null;
        this.sandbox.off('cameraChange', function () { });
    };
    /**
    * 气泡
    * @param position 气泡位置
    *  @html 气泡内容
    */
    Map.prototype.frame = function (video, audio, img, html, width, height) {
        if (this.framediv) {
            this.closeframe();
        }
        var framediv = document.createElement("div");
        framediv.style.width = width + "px";
        framediv.style.height = height + "px";
        framediv.classList.add("frame");
        if (video != "" && video != undefined) {
            var videoele = document.createElement("video");
            videoele.src = video;
            videoele.autoplay = true;
            videoele.style.width = "100%";
            framediv.appendChild(videoele);
        }
        if (audio != "" && audio != undefined) {
            var audioele = document.createElement("audio");
            audioele.src = audio;
            audioele.style.width = "100%";
            framediv.appendChild(audioele);
        }
        if (img != "" && img != undefined) {
            var imgele = document.createElement("img");
            imgele.src = img;
            imgele.style.width = "100%";
            framediv.appendChild(imgele);
        }
        var pele = document.createElement("p");
        pele.innerHTML = ("nbspnbsp" + html);
        framediv.appendChild(pele);
        document.body.appendChild(framediv);
        this.framediv = framediv;
    };
    Map.prototype.closeframe = function () {
        if (this.framediv == null) {
            //console.log("没有气泡框可以删除");
            return;
        }
        document.body.removeChild(this.framediv);
        this.framediv = null;
    };
    Map.prototype.calculateDistance = function () {
        var map = this;
        var domElement = this.sandbox.domElement;
        domElement.map = this;
        domElement.iscancel = false;
        domElement.dispoints = new Array();
        domElement.addEventListener('mousedown', this.handler, false);
    };
    Map.prototype.disablecalculateDistance = function () {
        this.removeMarker("dis");
        this.closepopup();
        var map = this;
        var domElement = this.sandbox.domElement;
        domElement.map = this;
        //domElement.addEventListener('mousedown', function(){}, false)
        domElement.removeEventListener("mousedown", this.handler, false);
    };
    Map.prototype.handler = function (event) {
        var map = this.map;
        var dispoints = this.dispoints;
        /*  if(dispoints.length==0){
             map.removeMarker("dis");
             map.closepopup();
         } */
        if (this.iscancel) {
            return;
        }
        if (event.button === 0) { // left button
            var pt = map.sandbox.pickOnProjects(event);
            if (!pt) {
                console.log("请点击到场景上");
                return;
            }
            else {
                dispoints.push(pt);
                //划线
                if (dispoints.length > 1) {
                    var pts2 = Array();
                    pts2.push(dispoints[dispoints.length - 2]);
                    pts2.push(dispoints[dispoints.length - 1]);
                    var pl2 = new altizure.PolyCylinderLineMarker({
                        name: 'dis',
                        sandbox: map.sandbox,
                        points: pts2,
                        color: 0xb73026,
                        lineWidth: 2
                    });
                }
            }
        }
        else if (event.button == 2) {
            var pt = map.sandbox.pickOnProjects(event);
            if (!pt) {
                console.log("请点击到场景上");
                return;
            }
            else {
                dispoints.push(pt);
                //划线
                if (dispoints.length > 1) {
                    var pts2 = Array();
                    pts2.push(dispoints[dispoints.length - 2]);
                    pts2.push(dispoints[dispoints.length - 1]);
                    var pl2 = new altizure.PolyCylinderLineMarker({
                        name: 'dis',
                        sandbox: map.sandbox,
                        points: pts2,
                        color: 0xb73026,
                        lineWidth: 2
                    });
                    var alldis = 0;
                    for (var i = 0; i < dispoints.length - 1; i++) {
                        alldis += Math.abs(map.sandbox.calculateDistanceBetweenTwoPoints(dispoints[i + 1], dispoints[i]));
                    }
                    ;
                    map.popup(dispoints[dispoints.length - 1], 150, 20, "全长：" + Math.round(alldis) + "米", "", "", "", true);
                    dispoints.splice(0, dispoints.length);
                    this.iscancel = true;
                }
            }
        }
    };
    return Map;
}());



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Play; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layer_ParticleEffectsMarker__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layer_TagMarker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__layer_TextTagMarker__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__layer_LightBeamMarker__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__layer_OBJMarker__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__layer_GeojsonLayer__ = __webpack_require__(1);






var Play = /** @class */ (function () {
    function Play(map, json, amark) {
        this.jsondata = json;
        this.map = map;
        this.amark = amark;
        this.step = 0;
        this.ispause = false;
        this.isend = false;
        this.actionType = "";
        this.actiondetaileType = "";
        this.action = this.jsondata.Presentations.Presentation.actions.action;
    }
    // 方法
    /**
      * 播放
      * @param map 地图容器
      */
    Play.prototype.play = function () {
        //获取初始定位
        var InitCamera = this.jsondata.Presentations.Presentation.settings.InitCamera;
        if (InitCamera != null) {
            this.map.Pose(InitCamera);
        }
        else {
            return "没有初始定位";
        }
        var action = this.jsondata.Presentations.Presentation.actions.action;
        /*  //添加是否完成标识、暂停标识
         for(let i  = 0 ; i <action.length;i++ ){
           action[i].isWorked = false;
           action[i].ispause = false;
         } */
        this.isend = false;
        this.ispause = false;
        this.actions(this.action, this.map, this);
    };
    //开始、继续
    Play.prototype.actions = function (action, map, play) {
        if (play === void 0) { play = this; }
        //循环
        if (this.ispause) {
            return;
        }
        var i = this.step;
        if (i >= action.length) {
            this.isend = true;
            return;
        }
        if (action[i]._type == "viewpoint") { //场景变换
            this.actionType = "viewpoint";
            if (action[i].fly.flyMode.toLocaleLowerCase() == "jumpto") //切换
             {
                this.actiondetaileType = "jumpto";
                var pose = {
                    lng: parseFloat(action[i].lng),
                    lat: parseFloat(action[i].lat),
                    alt: parseFloat(action[i].alt),
                    north: parseFloat(action[i].north),
                    tilt: parseFloat(action[i].tilt)
                };
                map.Pose(pose);
                this.actiondetaileType = "";
                if (parseFloat(action[i].trigger) > 0) {
                    this.step++;
                    setTimeout(function () { play.actions(action, map, play); }, action[i].trigger);
                }
                else if (parseFloat(action[i].trigger) == 0) {
                    this.step++;
                    play.actions(action, map, play);
                }
                else {
                    play.step++;
                    this.ispause = true;
                }
            }
            else if (action[i].fly.flyMode.toLocaleLowerCase() == "flyto") { //飞行
                this.actiondetaileType = "flyto";
                var pose = {
                    lng: parseFloat(action[i].lng),
                    lat: parseFloat(action[i].lat),
                    alt: parseFloat(action[i].alt),
                    north: parseFloat(action[i].north),
                    tilt: parseFloat(action[i].tilt)
                };
                var turnTimef = parseInt(action[i].fly.turnTime);
                if (turnTimef < 0) {
                    console.log("单点飞行：turnTime要大于0");
                    return;
                }
                var Multiple = 1;
                var speed = action[i].fly.speed;
                if (speed == "veryslow") {
                    Multiple = 4;
                }
                else if (speed == "slow") {
                    Multiple = 2;
                }
                else if (speed == "fast") {
                    Multiple = 0.5;
                }
                else if (speed == "veryfast") {
                    Multiple = 0.25;
                }
                else if (speed == "normal") {
                    Multiple = 1;
                }
                else {
                    console.log("单点飞行：speed错误");
                    return;
                }
                map.flyTo(pose, turnTimef * Multiple).then(function () {
                    play.step++;
                    if (play.map.isflystop == true) {
                        return;
                    }
                    play.actiondetaileType = "";
                    if (parseFloat(action[i].trigger) > 0) {
                        setTimeout(function () { play.actions(action, map, play); }, action[i].trigger);
                    }
                    else if (parseFloat(action[i].trigger) == 0) {
                        play.actions(action, map, play);
                    }
                    else {
                        play.ispause = true;
                    }
                });
            }
            else if (action[i].fly.flyMode.toLocaleLowerCase() == "lineto") { //平滑
                this.actiondetaileType = "lineto";
                var pose = {
                    lng: parseFloat(action[i].lng),
                    lat: parseFloat(action[i].lat),
                    alt: parseFloat(action[i].alt),
                    north: parseFloat(action[i].north),
                    tilt: parseFloat(action[i].tilt)
                };
                var turnTimel = parseInt(action[i].fly.turnTime);
                if (turnTimel < 0) {
                    console.log("单点飞行：turnTime要大于0");
                    return;
                }
                var speed = action[i].fly.speed;
                map.LineTo(pose, turnTimel, speed, map).then(function () {
                    play.step++;
                    if (play.map.reduceNum != 0) {
                        return;
                    }
                    play.actiondetaileType = "";
                    if (parseFloat(action[i].trigger) > 0) {
                        setTimeout(function () { play.actions(action, map, play); }, action[i].trigger);
                    }
                    else if (parseFloat(action[i].trigger) == 0) {
                        play.actions(action, map, play);
                    }
                    else {
                        play.ispause = true;
                    }
                });
            }
            else {
                console.log("单点飞行：flyMode错误");
                return;
            }
        }
        else if (action[i]._type == "route") { //多点飞行
            this.actionType = "route";
            //获取点
            var viewpoint = action[i].viewpoint;
            if (viewpoint.length == 0) {
                console.log("多点飞行：flyMode错误");
                return;
            }
            var point_1 = Array();
            viewpoint.forEach(function (element) {
                point_1.push({
                    lng: parseFloat(element.lng),
                    lat: parseFloat(element.lat),
                    alt: parseFloat(element.alt),
                    north: parseFloat(element.north),
                    tilt: parseFloat(element.tilt)
                });
            });
            var turnTimeroute = action[i].fly.turnTime - 0; //parseInt(action[i].fly.turnTime)  ;
            if (turnTimeroute < 0) {
                console.log("多点飞行：turnTime要大于0");
                return;
            }
            var speed = action[i].fly.speed;
            if (action[i].fly.flyMode.toLocaleLowerCase() == "jumpto") //切换
             {
                this.actiondetaileType = "jumpto";
                map.MuiltiPose(point_1, turnTimeroute, speed, map);
                if (parseFloat(action[i].trigger) > 0) {
                    play.actiondetaileType = "";
                    play.step++;
                    setTimeout(function () { play.actions(action, map); }, action[i].trigger);
                }
                else if (parseFloat(action[i].trigger) == 0) {
                    play.step++;
                    play.actions(action, map, play);
                }
                else {
                    play.step++;
                    play.ispause = true;
                }
            }
            else if (action[i].fly.flyMode.toLocaleLowerCase() == "flyto") { //飞行
                this.actiondetaileType = "flyto";
                map.MuiltiFlyto(point_1, turnTimeroute, speed).then(function () {
                    play.step++;
                    if (play.map.reduceNum != 0) {
                        return;
                    }
                    play.actiondetaileType = "";
                    if (parseFloat(action[i].trigger) > 0) {
                        setTimeout(function () { play.actions(action, map, play); }, action[i].trigger);
                    }
                    else if (parseFloat(action[i].trigger) == 0) {
                        play.actions(action, map, play);
                    }
                    else {
                        play.ispause = true;
                    }
                });
            }
            else if (action[i].fly.flyMode.toLocaleLowerCase() == "lineto") { //平滑
                this.actiondetaileType = "lineto";
                map.MuiltiLineTo(point_1, turnTimeroute, speed).then(function () {
                    play.step++;
                    if (play.map.reduceNum != 0) {
                        return;
                    }
                    play.actiondetaileType = "";
                    if (parseFloat(action[i].trigger) > 0) {
                        setTimeout(function () { play.actions(action, map, play); }, action[i].trigger);
                    }
                    else if (parseFloat(action[i].trigger) == 0) {
                        play.actions(action, map, play);
                    }
                    else {
                        play.ispause = true;
                    }
                });
                ;
            }
            else {
                console.log("多点飞行：flyMode错误");
                return;
            }
        }
        else if (action[i]._type == "circle") { //环绕
            this.actionType = "circle";
            var pose = {
                lng: parseFloat(action[i].circle.lng),
                lat: parseFloat(action[i].circle.lat),
                alt: parseFloat(action[i].circle.alt),
                north: parseFloat(action[i].circle.north),
                tilt: parseFloat(action[i].camera.tilt)
            };
            var startPosition = parseFloat(action[i].fly.startPosition);
            var direction = action[i].fly.direction;
            var angularSpeed = parseFloat(action[i].fly.angularSpeed);
            var turnTimeci = parseFloat(action[i].fly.turnTime);
            map.circleflyTo(action[i].camera.tilt, pose, startPosition, direction, angularSpeed, turnTimeci).then(function () {
                play.step++;
                if (play.map.reduceNum != 0) {
                    return;
                }
                play.actionType = "";
                if (parseFloat(action[i].trigger) > 0) {
                    setTimeout(function () { play.actions(action, map, play); }, action[i].trigger);
                }
                else if (parseFloat(action[i].trigger) == 0) {
                    play.actions(action, map, play);
                }
                else {
                    play.ispause = true;
                }
            });
        }
        else if (action[i]._type == "rotate") { //旋转
            this.actionType = "rotate";
            var pose_1 = {
                lng: parseFloat(action[i].camera.lng),
                lat: parseFloat(action[i].camera.lat),
                alt: parseFloat(action[i].camera.alt),
                north: parseFloat(action[i].camera.north),
                tilt: parseFloat(action[i].camera.tilt)
            };
            var direction = action[i].fly.direction;
            var angularSpeed = parseFloat(action[i].fly.angularSpeed);
            var turnTimero = parseFloat(action[i].fly.turnTime);
            map.rorateflyTo(pose_1, direction, angularSpeed, turnTimero).then(function () {
                play.step++;
                if (play.map.reduceNum != 0) {
                    return;
                }
                play.actionType = "";
                if (parseFloat(action[i].trigger) > 0) {
                    setTimeout(function () {
                        map.removerorate();
                        map.Pose(pose_1);
                        play.actions(action, map, play);
                    }, action[i].trigger);
                }
                else if (parseFloat(action[i].trigger) == 0) {
                    map.removerorate();
                    map.Pose(pose_1);
                    play.actions(action, map, play);
                }
                else {
                    play.ispause = true;
                }
            });
        }
        else if (action[i]._type == "particle") { //特效
            var position = {
                lng: parseFloat(action[i].position.lng),
                lat: parseFloat(action[i].position.lat),
                alt: parseFloat(action[i].position.alt)
            };
            var option = {
                position: position,
                sandbox: map.sandbox,
                effect: action[i].effect,
                scale: parseInt(action[i].scale),
                name: action[i].name
            };
            var particle = new __WEBPACK_IMPORTED_MODULE_0__layer_ParticleEffectsMarker__["a" /* ParticleEffectsMarker */](option);
            if (action[i].trigger > 0) {
                play.step++;
                setTimeout(function () {
                    map.removeMarker(action[i].name);
                    play.actions(action, map);
                }, action[i].trigger);
            }
            else if (parseFloat(action[i].trigger) == 0) {
                play.step++;
                map.removeMarker(action[i].name);
                play.actions(action, map, play);
            }
            else {
                play.step++;
                play.ispause = true;
            }
        }
        else if (action[i]._type == "marker") { //图标
            var option = {
                position: action[i].position,
                sandbox: map.sandbox,
                scale: parseFloat(action[i].scale),
                name: action[i].name
            };
            if (action[i].staticType.toLocaleLowerCase() == "imgurl") { //图标
                var option1 = Object.assign({
                    imgUrl: action[i].imgUrl
                }, option);
                var tagMarker = new __WEBPACK_IMPORTED_MODULE_1__layer_TagMarker__["a" /* TagMarker */](option1);
            }
            else if (action[i].staticType.toLocaleLowerCase() == "text") { //文字
                var option1 = Object.assign({
                    text: action[i].text,
                    textStyle: action[i].textStyle
                }, option);
                var textTagMarker = new __WEBPACK_IMPORTED_MODULE_2__layer_TextTagMarker__["a" /* TextTagMarker */](option1);
            }
            else if (action[i].staticType.toLocaleLowerCase() == "lightbeam") { //光标
                var option1 = Object.assign({
                    color: action[i].color
                }, option);
                var lightbeamMarker = new __WEBPACK_IMPORTED_MODULE_3__layer_LightBeamMarker__["a" /* LightBeamMarker */](option1);
            }
            else if (action[i].staticType.toLocaleLowerCase() == "staticobj") { //模型
                var option1 = Object.assign({
                    shape: action[i].shape,
                    objUrl: action[i].objUrl,
                    mtlUrl: action[i].mtlUrl,
                    upDir: action[i].upDir
                }, option);
                var oBJMarker = new __WEBPACK_IMPORTED_MODULE_4__layer_OBJMarker__["a" /* OBJMarker */](option1);
            }
            if (action[i].trigger > 0) {
                play.step++;
                setTimeout(function () {
                    map.removeMarker(action[i].name);
                    play.actions(action, map);
                }, action[i].trigger);
            }
            else if (parseFloat(action[i].trigger) == 0) {
                play.step++;
                map.removeMarker(action[i].name);
                play.actions(action, map, play);
            }
            else {
                play.step++;
                play.ispause = true;
            }
        }
        else if (action[i]._type == "moveObj") { //移动图标
            /* let position = {
              lng:action[i].lng,
              lat:action[i].lat,
              alt:action[i].alt
            }  */
            var position = {
                lng: parseFloat(action[i].lng),
                lat: parseFloat(action[i].lat),
                alt: parseFloat(action[i].alt)
            };
            var option = {
                position: position,
                sandbox: map.sandbox,
                scale: parseInt(action[i].scale),
                shape: action[i].shape,
                objUrl: action[i].objUrl,
                mtlUrl: action[i].mtlUrl,
                upDir: action[i].upDir,
                name: action[i].name
            };
            var obj = new __WEBPACK_IMPORTED_MODULE_4__layer_OBJMarker__["a" /* OBJMarker */](option);
            if (action[i].isMove.toLocaleLowerCase() == "true") {
                var turnTimeobj = parseFloat(action[i].turnTime);
                var speed = action[i].speed;
                obj.move(action[i].points.point, turnTimeobj, speed, this.amark, map.sandbox);
            }
            if (action[i].trigger > 0) {
                play.step++;
                setTimeout(function () {
                    map.removeMarker(action[i].name);
                    play.actions(action, map);
                }, action[i].trigger);
            }
            else if (parseFloat(action[i].trigger) == 0) {
                play.step++;
                map.removeMarker(action[i].name);
                play.actions(action, map, play);
            }
            else {
                play.step++;
                play.ispause = true;
            }
        }
        else if (action[i]._type == "layer") { //图层
            var layer_1;
            if (action[i].staticType.toLocaleLowerCase() == "geojson") {
                layer_1 = new __WEBPACK_IMPORTED_MODULE_5__layer_GeojsonLayer__["a" /* GeojsonLayer */](action[i].url, action[i].crs);
            }
            if (action[i].trigger > 0) {
                play.step++;
                setTimeout(function () {
                    layer_1.remove();
                    play.actions(action, map);
                }, action[i].trigger);
            }
            else if (parseFloat(action[i].trigger) == 0) {
                play.step++;
                layer_1.remove();
                play.actions(action, map, play);
            }
            else {
                play.step++;
                play.ispause = true;
            }
        }
        else if (action[i]._type == "balloon") { //气泡
            var point = {
                lng: parseFloat(action[i].lng),
                lat: parseFloat(action[i].lat),
                alt: parseFloat(action[i].alt)
            };
            map.popup(point, parseInt(action[i].width), parseInt(action[i].height), action[i].htmlPatch.text, action[i].htmlPatch.img, action[i].htmlPatch.audio, action[i].htmlPatch.video);
            if (action[i].trigger > 0) {
                play.step++;
                setTimeout(function () {
                    map.closepopup();
                    play.actions(action, map);
                }, action[i].trigger);
            }
            else if (parseFloat(action[i].trigger) == 0) {
                play.step++;
                map.closepopup();
                play.actions(action, map, play);
            }
            else {
                play.step++;
                play.ispause = true;
            }
        }
        else if (action[i]._type == "frame") { //弹框 
            map.frame(action[i].htmlPatch.video, action[i].htmlPatch.audio, action[i].htmlPatch.img, action[i].htmlPatch.text, parseInt(action[i].width), parseInt(action[i].height));
            if (action[i].trigger > 0) {
                play.step++;
                setTimeout(function () {
                    map.closeframe();
                    play.actions(action, map);
                }, action[i].trigger);
            }
            else if (parseFloat(action[i].trigger) == 0) {
                play.step++;
                map.closeframe();
                play.actions(action, map, play);
            }
            else {
                play.step++;
                this.ispause = true;
            }
        }
    };
    //暂停
    Play.prototype.pause = function () {
        this.ispause = true;
        if (this.actionType == "viewpoint" && this.actiondetaileType == "flyto") {
            this.map.flystop();
        }
        else if ((this.actionType == "viewpoint" && this.actiondetaileType == "lineto")
            || (this.actionType == "route" && (this.actiondetaileType == "flyto" || this.actiondetaileType == "lineto"))
            || (this.actionType == "circle") || (this.actionType == "rotate")) {
            this.map.reduceStatue = false;
        }
    };
    //停止
    Play.prototype.stop = function () {
        this.ispause = true;
        this.isend = true;
        this.step = 0;
        if (this.actionType == "viewpoint" && this.actiondetaileType == "flyto") {
            this.map.flystop();
        }
        else if ((this.actionType == "viewpoint" && this.actiondetaileType == "lineto")
            || (this.actionType == "route" && (this.actiondetaileType == "flyto" || this.actiondetaileType == "lineto"))
            || (this.actionType == "circle") || (this.actionType == "rotate")) {
            this.map.reduceStatue = false;
        }
    };
    //继续
    Play.prototype.contuinueaction = function () {
        var play = this;
        var array = new Array();
        this.removeMarker();
        this.ispause = false;
        if (this.actionType == "viewpoint" && this.actiondetaileType == "flyto") {
            array.push(function () { return play.map.continueflyTo(); });
        }
        else if ((this.actionType == "viewpoint" && this.actiondetaileType == "lineto")
            || (this.actionType == "route" && (this.actiondetaileType == "flyto" || this.actiondetaileType == "lineto"))
            || (this.actionType == "circle") || (this.actionType == "rotate")) {
            //array.push(play.map.reduceContinue());//function() {return play.map.reduceContinue()}
            if (play.map.reduceNum > 0) {
                var arr = play.map.reduceContinue();
                arr.forEach(function (value) {
                    return array.push(value);
                });
            }
        }
        array.push(function () { /* play.step++; */ return play.actions(play.action, play.map, play); });
        this.reduce(array);
    };
    Play.prototype.reduce = function (arr) {
        var sequence = Promise.resolve();
        arr.forEach(function (value) {
            return sequence = sequence.then(value);
        });
        return sequence;
    };
    Play.prototype.getstatue = function () {
        return this.isend;
    };
    Play.prototype.getpausestatue = function () {
        return this.ispause;
    };
    Play.prototype.removeMarker = function () {
        var marks = this.map.sandbox.markerLayer.children;
        for (var i = marks.length - 1; i >= 0; i--) {
            if ("AltizureProjectMarker" != marks[i].name)
                this.map.sandbox.markerLayer.removeChild(marks[i]);
        }
        this.map.closeframe();
        this.map.closepopup();
    };
    return Play;
}());



/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ })
/******/ ]);
});
//# sourceMappingURL=bundle.js.map