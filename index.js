/**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 */
//UMD魔法代码
// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.coordtransform = factory();
  }
}(this, function () {
  //定义一些常量
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  function Rectangle(lng1, lat1, lng2, lat2) {
    this.west = Math.min(lng1, lng2);
    this.north = Math.max(lat1, lat2);
    this.east = Math.max(lng1, lng2);
    this.south = Math.min(lat1, lat2);
  }
  /**
   * @param {number} lon
   * @param {number} lat
   */
  Rectangle.prototype.contain = function (lon, lat) {
    return this.west <= lon && this.east >= lon && this.north >= lat && this.south <= lat;
  }

  // China region - raw data
  var region = [
    new Rectangle(79.446200, 49.220400, 96.330000, 42.889900),
    new Rectangle(109.687200, 54.141500, 135.000200, 39.374200),
    new Rectangle(73.124600, 42.889900, 124.143255, 29.529700),
    new Rectangle(82.968400, 29.529700, 97.035200, 26.718600),
    new Rectangle(97.025300, 29.529700, 124.367395, 20.414096),
    new Rectangle(107.975793, 20.414096, 111.744104, 17.871542)
  ];
  // China excluded region - raw data
  var exclude = [
    new Rectangle(119.921265, 25.398623, 122.497559, 21.785006),
    new Rectangle(101.865200, 22.284000, 106.665000, 20.098800),
    new Rectangle(106.452500, 21.542200, 108.051000, 20.487800),
    new Rectangle(109.032300, 55.817500, 119.127000, 50.325700),
    new Rectangle(127.456800, 55.817500, 137.022700, 49.557400),
    new Rectangle(131.266200, 44.892200, 137.022700, 42.569200),
    new Rectangle(73.124600, 35.398637, 77.948114, 29.529700),
  ]
  // China excluded region 2, Hongkong etc.
  var EXCLUDE_REGIN_2 = [
    new Rectangle(114.505238, 22.138258, 113.845000, 22.428903),
    new Rectangle(113.97000, 22.507833, 114.450000, 22.428903),
  ];

  function isInChina(lon, lat, excludeRegin2 = true) {
    for (var i = 0; i < region.length; i++) {
      if (region[i].contain(lon, lat)) {
        for (var j = 0; j < exclude.length; j++) {
          if (exclude[j].contain(lon, lat)) {
            return false;
          }
        }
        if (excludeRegin2) {
          for (var j = 0; j < EXCLUDE_REGIN_2.length; j++) {
            if (EXCLUDE_REGIN_2[j].contain(lon, lat)) {
              return false;
            }
          }
        }
        return true;
      }
    }
    return false;
  }

  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param {number} bd_lon
   * @param {number} bd_lat
   * @returns {*[]}
   */
  function bd09togcj02(bd_lon, bd_lat) {
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
   * @param {number} lng
   * @param {number} lat
   * @returns {*[]}
   */
  function gcj02tobd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
  };

  /**
   * WGS84转GCj02
   * @param {number} lng
   * @param {number} lat
   * @returns {*[]}
   */
  function wgs84togcj02(lng, lat) {

    return transform(lng, lat)
  };

  /**
   * GCJ02 转换为 WGS84
   * @param {number} lng
   * @param {number} lat
   * @returns {*[]}
   */
  function gcj02towgs84(lng, lat) {
    var out = transform(lng, lat)
    return [lng * 2 - out[0], lat * 2 - out[1]]
  };

  function transform(lng, lat) {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [mglng, mglat]
  }

  function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  };

  function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
  };

  return {
    // 原始的转换方法
    bd09ToGcj02Raw: bd09togcj02,
    gcj02ToBd09Raw: gcj02tobd09,
    wgs84ToGcj02Raw: wgs84togcj02,
    gcj02ToWgs84Raw: gcj02towgs84,
    // 判断了中国范围的转换方法
    bd09ToGcj02: bd09togcj02,
    gcj02ToBd09: gcj02tobd09,
    wgs84ToGcj02: function (lng, lat) {
      if (!isInChina(lng, lat)) {
        return [lng, lat]
      }
      return wgs84togcj02(lng, lat)
    },
    gcj02ToWgs84: function (lng, lat) {
      if (!isInChina(lng, lat)) {
        return [lng, lat]
      }
      return gcj02towgs84(lng, lat)
    },
    bd09ToWgs84: function (lng, lat) {
      if (!isInChina(lng, lat, false)) {
        return [lng, lat]
      }
      var gcj02 = bd09togcj02(lng, lat)
      return gcj02towgs84(gcj02[0], gcj02[1])
    },
    wgs84ToBd09: function (lng, lat) {
      if (!isInChina(lng, lat, false)) {
        return [lng, lat]
      }
      var gcj02 = wgs84togcj02(lng, lat)
      return gcj02tobd09(gcj02[0], gcj02[1])
    }
  }
}));
