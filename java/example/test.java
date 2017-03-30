 public static void main(String[] args) {
        //百度地图 BD09 坐标 转 WGS84
        double[] lngLat_wgs84 = CoordinateTransform.transformBD09ToWGS84(120.644049, 31.285887);
        System.out.println("lng :" + lngLat_wgs84[0] + ",lat :" + lngLat_wgs84[1]);

        //WGS84  坐标 转 百度地图 BD09
        double[] lngLat_bd09 = CoordinateTransform.transformWGS84ToBD09(lngLat_wgs84[0], lngLat_wgs84[1]);
        System.out.println("lng :" + lngLat_bd09[0] + ",lat :" + lngLat_bd09[1]);

        //火星坐标（GCJ02） 坐标 转 WGS84
        lngLat_wgs84 = CoordinateTransform.transformGCJ02ToWGS84(120.644049, 31.285887);
        System.out.println("lng :" + lngLat_wgs84[0] + ",lat :" + lngLat_wgs84[1]);

        //WGS84 转  火星坐标（GCJ02）
        double[] lngLat_gcj02 = CoordinateTransform.transformWGS84ToGCJ02(lngLat_wgs84[0], lngLat_wgs84[1]);
        System.out.println("lng :" + lngLat_gcj02[0] + ",lat :" + lngLat_gcj02[1]);

        //百度地图 BD09 坐标 转 火星坐标（GCJ02）
        lngLat_gcj02 = CoordinateTransform.transformBD09ToGCJ02(120.644049, 31.285887);
        System.out.println("lng :" + lngLat_gcj02[0] + ",lat :" + lngLat_gcj02[1]);

        //火星坐标（GCJ02） 坐标 转 百度地图 BD09
        lngLat_bd09 = CoordinateTransform.transformGCJ02ToBD09(lngLat_gcj02[0], lngLat_gcj02[1]);
        System.out.println("lng :" + lngLat_bd09[0] + ",lat :" + lngLat_bd09[1]);
}