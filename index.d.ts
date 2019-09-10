type LngLatTuple = [number, number]
/** @deprecated 换用小驼峰风格命名 */
export function bd09togcj02(lng: number, lat: number): LngLatTuple
/** @deprecated 换用小驼峰风格命名 */
export function gcj02tobd09(lng: number, lat: number): LngLatTuple
/** @deprecated 换用小驼峰风格命名 */
export function wgs84togcj02(lng: number, lat: number): LngLatTuple
/** @deprecated 换用小驼峰风格命名 */
export function gcj02towgs84(lng: number, lat: number): LngLatTuple

/** BD09 => GCJ02 */
export function bd09ToGcj02(lng: number, lat: number): LngLatTuple
/** GCJ02 => BD09 */
export function gcj02ToBd09(lng: number, lat: number): LngLatTuple
/** WGS84 => GCJ02 */
export function wgs84ToGcj02(lng: number, lat: number): LngLatTuple
/** GCJ02 => WGS84 */
export function gcj02ToWgs84(lng: number, lat: number): LngLatTuple
/**
 * BD09 => WGS84  
 * 是使用其他方法"拼"出来的, 误差较大
 */
export function bd09ToWgs84(lng: number, lat: number): LngLatTuple
/**
 * WGS84 => BD09  
 * 是使用其他方法"拼"出来的, 误差较大
 */
export function wgs84ToBd09(lng: number, lat: number): LngLatTuple