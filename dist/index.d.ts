/**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD-09）、国测局坐标（火星坐标，GCJ-02）、和 WGS-84 坐标系之间的转换
 */
export type Coordinate = [number, number];
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lng 百度经度
 * @param bd_lat 百度纬度
 * @returns 转换后的坐标 [lng, lat]
 */
export declare function bd09togcj02(bd_lng: number, bd_lat: number): Coordinate;
/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即 谷歌、高德 转 百度
 * @param lng GCJ-02经度
 * @param lat GCJ-02纬度
 * @returns 转换后的坐标 [lng, lat]
 */
export declare function gcj02tobd09(lng: number, lat: number): Coordinate;
/**
 * WGS-84 转 GCJ-02
 * @param lng WGS-84经度
 * @param lat WGS-84纬度
 * @returns 转换后的坐标 [lng, lat]
 */
export declare function wgs84togcj02(lng: number, lat: number): Coordinate;
/**
 * GCJ-02 转换为 WGS-84
 * @param lng GCJ-02经度
 * @param lat GCJ-02纬度
 * @returns 转换后的坐标 [lng, lat]
 */
export declare function gcj02towgs84(lng: number, lat: number): Coordinate;
declare const coordtransform: {
    bd09togcj02: typeof bd09togcj02;
    gcj02tobd09: typeof gcj02tobd09;
    wgs84togcj02: typeof wgs84togcj02;
    gcj02towgs84: typeof gcj02towgs84;
};
export default coordtransform;
//# sourceMappingURL=index.d.ts.map