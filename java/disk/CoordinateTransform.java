package com.gaeainfo.crawler.util;

/**
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 *
 * @author Daniel
 * @since 2016/7/27 0027
 */
public class CoordinateTransform {
    private static final double x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    private static final double PI = 3.1415926535897932384626;
    private static final double a = 6378245.0;
    private static final double ee = 0.00669342162296594323;

    /**
     * 百度坐标（BD09）转 GCJ02
     *
     * @param lng 百度经度
     * @param lat 百度纬度
     * @return GCJ02 坐标：[经度，纬度]
     */
    public static double[] transformBD09ToGCJ02(double lng, double lat) {
        double x = lng - 0.0065;
        double y = lat - 0.006;
        double z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
        double theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
        double gcj_lng = z * Math.cos(theta);
        double gcj_lat = z * Math.sin(theta);
        return new double[]{gcj_lng, gcj_lat};
    }

    /**
     * GCJ02 转百度坐标
     *
     * @param lng GCJ02 经度
     * @param lat GCJ02 纬度
     * @return 百度坐标：[经度，纬度]
     */
    public static double[] transformGCJ02ToBD09(double lng, double lat) {
        double z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        double theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        double bd_lng = z * Math.cos(theta) + 0.0065;
        double bd_lat = z * Math.sin(theta) + 0.006;
        return new double[]{bd_lng, bd_lat};
    }

    /**
     * GCJ02 转 WGS84
     *
     * @param lng 经度
     * @param lat 纬度
     * @return WGS84坐标：[经度，纬度]
     */
    public static double[] transformGCJ02ToWGS84(double lng, double lat) {
        if (outOfChina(lng, lat)) {
            return new double[]{lng, lat};
        } else {
            double dLat = transformLat(lng - 105.0, lat - 35.0);
            double dLng = transformLng(lng - 105.0, lat - 35.0);
            double radLat = lat / 180.0 * PI;
            double magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            double sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
            dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
            double mgLat = lat + dLat;
            double mgLng = lng + dLng;
            return new double[]{lng * 2 - mgLng, lat * 2 - mgLat};
        }
    }

    /**
     * WGS84 坐标 转 GCJ02
     *
     * @param lng 经度
     * @param lat 纬度
     * @return GCJ02 坐标：[经度，纬度]
     */
    public static double[] transformWGS84ToGCJ02(double lng, double lat) {
        if (outOfChina(lng, lat)) {
            return new double[]{lng, lat};
        } else {
            double dLat = transformLat(lng - 105.0, lat - 35.0);
            double dLng = transformLng(lng - 105.0, lat - 35.0);
            double redLat = lat / 180.0 * PI;
            double magic = Math.sin(redLat);
            magic = 1 - ee * magic * magic;
            double sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
            dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(redLat) * PI);
            double mgLat = lat + dLat;
            double mgLng = lng + dLng;
            return new double[]{mgLng, mgLat};
        }
    }

    /**
     * 百度坐标BD09 转 WGS84
     *
     * @param lng 经度
     * @param lat 纬度
     * @return WGS84 坐标：[经度，纬度]
     */
    public static double[] transformBD09ToWGS84(double lng, double lat) {
        double[] lngLat = transformBD09ToGCJ02(lng, lat);

        return transformGCJ02ToWGS84(lngLat[0], lngLat[1]);
    }

    /**
     * WGS84 转 百度坐标BD09
     *
     * @param lng 经度
     * @param lat 纬度
     * @return BD09 坐标：[经度，纬度]
     */
    public static double[] transformWGS84ToBD09(double lng, double lat) {
        double[] lngLat = transformWGS84ToGCJ02(lng, lat);

        return transformGCJ02ToBD09(lngLat[0], lngLat[1]);
    }

    private static double transformLat(double lng, double lat) {
        double ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    ;

    private static double transformLng(double lng, double lat) {
        double ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

    ;

    /**
     * 判断坐标是否不在国内
     *
     * @param lng 经度
     * @param lat 纬度
     * @return 坐标是否在国内
     */
    public static boolean outOfChina(double lng, double lat) {
        return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271);
    }
}
