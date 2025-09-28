/**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD-09）、国测局坐标（火星坐标，GCJ-02）、和 WGS-84 坐标系之间的转换
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bd09togcj02 = bd09togcj02;
    exports.gcj02tobd09 = gcj02tobd09;
    exports.wgs84togcj02 = wgs84togcj02;
    exports.gcj02towgs84 = gcj02towgs84;
    // 定义一些常量
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lng 百度经度
     * @param bd_lat 百度纬度
     * @returns 转换后的坐标 [lng, lat]
     */
    function bd09togcj02(bd_lng, bd_lat) {
        var lng = +bd_lng;
        var lat = +bd_lat;
        var x = lng - 0.0065;
        var y = lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即 谷歌、高德 转 百度
     * @param lng GCJ-02经度
     * @param lat GCJ-02纬度
     * @returns 转换后的坐标 [lng, lat]
     */
    function gcj02tobd09(lng, lat) {
        var latNum = +lat;
        var lngNum = +lng;
        var z = Math.sqrt(lngNum * lngNum + latNum * latNum) + 0.00002 * Math.sin(latNum * x_PI);
        var theta = Math.atan2(latNum, lngNum) + 0.000003 * Math.cos(lngNum * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
    }
    /**
     * WGS-84 转 GCJ-02
     * @param lng WGS-84经度
     * @param lat WGS-84纬度
     * @returns 转换后的坐标 [lng, lat]
     */
    function wgs84togcj02(lng, lat) {
        var latNum = +lat;
        var lngNum = +lng;
        if (out_of_china(lngNum, latNum)) {
            return [lngNum, latNum];
        }
        else {
            var dlat = transformlat(lngNum - 105.0, latNum - 35.0);
            var dlng = transformlng(lngNum - 105.0, latNum - 35.0);
            var radlat = latNum / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = latNum + dlat;
            var mglng = lngNum + dlng;
            return [mglng, mglat];
        }
    }
    /**
     * GCJ-02 转换为 WGS-84
     * @param lng GCJ-02经度
     * @param lat GCJ-02纬度
     * @returns 转换后的坐标 [lng, lat]
     */
    function gcj02towgs84(lng, lat) {
        var latNum = +lat;
        var lngNum = +lng;
        if (out_of_china(lngNum, latNum)) {
            return [lngNum, latNum];
        }
        else {
            var dlat = transformlat(lngNum - 105.0, latNum - 35.0);
            var dlng = transformlng(lngNum - 105.0, latNum - 35.0);
            var radlat = latNum / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = latNum + dlat;
            var mglng = lngNum + dlng;
            return [lngNum * 2 - mglng, latNum * 2 - mglat];
        }
    }
    function transformlat(lng, lat) {
        var latNum = +lat;
        var lngNum = +lng;
        var ret = -100.0 + 2.0 * lngNum + 3.0 * latNum + 0.2 * latNum * latNum + 0.1 * lngNum * latNum + 0.2 * Math.sqrt(Math.abs(lngNum));
        ret += (20.0 * Math.sin(6.0 * lngNum * PI) + 20.0 * Math.sin(2.0 * lngNum * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(latNum * PI) + 40.0 * Math.sin(latNum / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(latNum / 12.0 * PI) + 320 * Math.sin(latNum * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }
    function transformlng(lng, lat) {
        var latNum = +lat;
        var lngNum = +lng;
        var ret = 300.0 + lngNum + 2.0 * latNum + 0.1 * lngNum * lngNum + 0.1 * lngNum * latNum + 0.1 * Math.sqrt(Math.abs(lngNum));
        ret += (20.0 * Math.sin(6.0 * lngNum * PI) + 20.0 * Math.sin(2.0 * lngNum * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lngNum * PI) + 40.0 * Math.sin(lngNum / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lngNum / 12.0 * PI) + 300.0 * Math.sin(lngNum / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }
    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng 经度
     * @param lat 纬度
     * @returns 是否在国外
     */
    function out_of_china(lng, lat) {
        var latNum = +lat;
        var lngNum = +lng;
        // 纬度 3.86~53.55, 经度 73.66~135.05 
        return !(lngNum > 73.66 && lngNum < 135.05 && latNum > 3.86 && latNum < 53.55);
    }
    // 为了保持向后兼容性，同时导出对象形式
    var coordtransform = {
        bd09togcj02: bd09togcj02,
        gcj02tobd09: gcj02tobd09,
        wgs84togcj02: wgs84togcj02,
        gcj02towgs84: gcj02towgs84
    };
    exports.default = coordtransform;
    var globalObj = (typeof window !== 'undefined' && window) ||
        (typeof global !== 'undefined' && global) ||
        (typeof self !== 'undefined' && self) ||
        {};
    // Provide browser global compatibility
    if (typeof globalObj === 'object') {
        globalObj.coordtransform = coordtransform;
    }
});
//# sourceMappingURL=index.js.map