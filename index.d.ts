export type LngLatTuple = [number, number]
/** 原始的 BD09 => Gcj02 */
export declare function rawBd09ToGcj02(lng: number, lat: number): LngLatTuple
/** 原始的 Gcj02 => Bd09 */
export declare function rawGcj02ToBd09(lng: number, lat: number): LngLatTuple
/** 原始的 Wgs84 => Gcj02 */
export declare function rawWgs84ToGcj02(lng: number, lat: number): LngLatTuple
/** 原始的 Gcj02 => Wgs84 */
export declare function rawGcj02ToWgs84(lng: number, lat: number): LngLatTuple

/** BD09 => GCJ02 */
export declare function bd09ToGcj02(lng: number, lat: number): LngLatTuple
/** GCJ02 => BD09 */
export declare function gcj02ToBd09(lng: number, lat: number): LngLatTuple
/** WGS84 => GCJ02 (判断了中国范围) */
export declare function wgs84ToGcj02(lng: number, lat: number): LngLatTuple
/** GCJ02 => WGS84 (判断了中国范围) */
export declare function gcj02ToWgs84(lng: number, lat: number): LngLatTuple
/**
 * BD09 => WGS84 (判断了中国范围)
 * 是使用其他方法"拼"出来的, 误差较大
 */
export declare function bd09ToWgs84(lng: number, lat: number): LngLatTuple
/**
 * WGS84 => BD09 (判断了中国范围)
 * 是使用其他方法"拼"出来的, 误差较大
 */
export declare function wgs84ToBd09(lng: number, lat: number): LngLatTuple