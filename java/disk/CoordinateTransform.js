/**
 * Created by Daniel on 2016/7/27.
 * 
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 *
 * 会有偏差，但是偏差在可接受范围之内
 */
(function (root, factory) {
    root.CoordinateTransform = factory();
}(this, function () {
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {[]} GCJ-02 坐标：[经度，纬度]
     */
    var transformBD09ToGCJ02 = function (bd_lon, bd_lat) {
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat]
    };

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {[]}  BD-09 坐标：[经度，纬度]
     */
    var transformGCJ02ToBD09 = function (lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    };

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {[]} GCj02 坐标：[经度，纬度]
     */
    var transformWGS84ToGCJ02 = function (lng, lat) {
        if (outOfChina(lng, lat)) {
            return [lng, lat]
        } else {
            var dLat = transformLat(lng - 105.0, lat - 35.0);
            var dLng = transformLng(lng - 105.0, lat - 35.0);
            var radLat = lat / 180.0 * PI;
            var magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
            dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
            var mgLat = lat + dLat;
            var mgLng = lng + dLng;
            return [mgLng, mgLat]
        }
    };

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {[]} WGS84 坐标：[经度，纬度]
     */
    var transformGCJ02ToWGS84 = function (lng, lat) {
        if (outOfChina(lng, lat)) {
            return [lng, lat]
        } else {
            var dLat = transformLat(lng - 105.0, lat - 35.0);
            var dLng = transformLng(lng - 105.0, lat - 35.0);
            var radLat = lat / 180.0 * PI;
            var magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
            dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
            var mgLat = lat + dLat;
            var mgLng = lng + dLng;
            return [lng * 2 - mgLng, lat * 2 - mgLat]
        }
    };

    /**
     * 百度坐标BD09 转 WGS84
     *
     * @param lng 经度
     * @param lat 纬度
     * @return {[]} WGS84 坐标：[经度，纬度]
     */
    var transformBD09ToWGS84 = function (lng, lat) {
        var lngLat = transformBD09ToGCJ02(lng, lat);
        return transformGCJ02ToWGS84(lngLat[0], lngLat[1]);
    };


    /**
     * WGS84 转 百度坐标BD09
     *
     * @param lng 经度
     * @param lat 纬度
     * @return {[]} BD09 坐标：[经度，纬度]
     */
    var transformWGS84ToBD09 = function (lng, lat) {
        var lngLat = transformWGS84ToGCJ02(lng, lat);

        return transformGCJ02ToBD09(lngLat[0], lngLat[1]);
    };


    var transformLat = function (lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    };

    var transformLng = function (lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    };

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    var outOfChina = function (lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    };

    return {
        transformBD09ToWGS84: transformBD09ToWGS84,
        transformWGS84ToBD09: transformWGS84ToBD09,
        transformGCJ02ToWGS84: transformGCJ02ToWGS84,
        transformWGS84ToGCJ02: transformWGS84ToGCJ02,
        transformBD09ToGCJ02: transformBD09ToGCJ02,
        transformGCJ02ToBD09: transformGCJ02ToBD09
    }
}));