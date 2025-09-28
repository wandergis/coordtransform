/**
 * TypeScript usage test
 */
import { bd09togcj02, gcj02tobd09, wgs84togcj02, gcj02towgs84, Coordinate } from '../src/index';
import coordtransform from '../src/index';

// Test ES6 named imports
const bd09Result: Coordinate = bd09togcj02(116.404, 39.915);
const gcj02Result: Coordinate = gcj02tobd09(116.404, 39.915);
const wgs84Result: Coordinate = wgs84togcj02(116.404, 39.915);
const gcj02towgs84Result: Coordinate = gcj02towgs84(116.404, 39.915);

console.log('ES6 imports test:');
console.log('bd09togcj02:', bd09Result);
console.log('gcj02tobd09:', gcj02Result);
console.log('wgs84togcj02:', wgs84Result);
console.log('gcj02towgs84:', gcj02towgs84Result);

// Test default import (for backward compatibility)
console.log('\nDefault import test:');
console.log('bd09togcj02:', coordtransform.bd09togcj02(116.404, 39.915));
console.log('gcj02tobd09:', coordtransform.gcj02tobd09(116.404, 39.915));
console.log('wgs84togcj02:', coordtransform.wgs84togcj02(116.404, 39.915));
console.log('gcj02towgs84:', coordtransform.gcj02towgs84(116.404, 39.915));

// Test type checking
const coordinate: Coordinate = [116.404, 39.915];
const [lng, lat] = coordinate;
console.log('\nType checking test:');
console.log(`Coordinate: lng=${lng}, lat=${lat}`);