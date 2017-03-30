#CoordinateTransform 坐标转换
****
提供百度坐标（BD09）、WGS84坐标、国测局坐标（火星坐标，GCJ02）系之间的转换的工具模块
会有偏移，但是还能接受

### WGS84
- 国际标准，从 GPS 设备中取出的数据的坐标系
- 国际地图提供商使用的坐标系

### 火星坐标 (GCJ-02)
- 中国标准，从国行移动设备中定位获取的坐标数据使用这个坐标系
- 国家规定： 国内出版的各种地图系统（包括电子形式），必须至少采用GCJ-02对地理位置进行首次加密。

### 百度坐标 (BD-09)
- 百度标准，百度 SDK，百度地图


### 用法（Using）

1 JavaScript
引用disk下面的 CoordinateTransform.js

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>坐标转换JS使用例子</title>
</head>
<body>
	<h1>提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换，会有偏差，但是偏差在可接受范围之内</h1>
	<h1>结果请在控制台查看（Results please view the console）</h1>

</body>
<script type="text/javascript" src="../disk/CoordinateTransform.js"></script>
<script type="text/javascript">

	//百度地图 BD09 坐标 转 WGS84 
	var lngLat_wgs84 = CoordinateTransform.transformBD09ToWGS84(120.644049,31.285887);
	console.log(lngLat_wgs84);

	//WGS84  坐标 转 百度地图 BD09 
	var lngLat_bd09 = CoordinateTransform.transformWGS84ToBD09(lngLat_wgs84[0],lngLat_wgs84[1]);
	console.log(lngLat_bd09);

	//火星坐标（GCJ02） 坐标 转 WGS84 
	lngLat_wgs84 = CoordinateTransform.transformGCJ02ToWGS84(120.644049,31.285887);
	console.log(lngLat_wgs84);

	//WGS84 转  火星坐标（GCJ02）
	var lngLat_gcj02 = CoordinateTransform.transformWGS84ToGCJ02(lngLat_wgs84[0],lngLat_wgs84[1]);
	console.log(lngLat_gcj02);

	//百度地图 BD09 坐标 转 火星坐标（GCJ02） 
	lngLat_gcj02 = CoordinateTransform.transformBD09ToGCJ02(120.644049,31.285887);
	console.log(lngLat_gcj02);

	//火星坐标（GCJ02） 坐标 转 百度地图 BD09
	lngLat_bd09 = CoordinateTransform.transformGCJ02ToBD09(lngLat_gcj02[0],lngLat_gcj02[1]);
	console.log(lngLat_bd09);
</script>
</html>
```

2 Java

将disk下的CoordinateTransform.java放入项目
```
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
```
> 本项目也是之前借鉴过网上的资料，并不是我个人完全独立完成的，我只是上次项目需要然后就整理了一下，封装给自己用了，若原作者（我也是不知是谁～）不希望我这样公开，请联系我，我会立马删除次项目

`有空会加入其他坐标系的转换...持续更新` 
`Email:jinshouw@163.com`
