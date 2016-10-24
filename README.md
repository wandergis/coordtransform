# coordtransform 坐标转换
****
一个提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换的工具模块。

python版本：https://github.com/wandergis/coordTransform_py

命令行版本：https://github.com/wandergis/coordtransform-cli
****
## **支持node、浏览器（AMD方式和直接引用方式）**
- GitHub地址：https://github.com/wandergis/coordtransform
- npm地址：https://www.npmjs.com/package/coordtransform
- 项目主页：http://wandergis.github.io/coordtransform/

## 为什么写这个模块

随着移动互联网的兴起，几乎每一个app都会去收集用户位置，如果恰好你在处理与地理定位相关的代码，并且不了解地理坐标系的话，肯定要被我大天朝各种坐标系搞晕。写这个模块的目的也是因为项目中app获取的坐标是百度sdk获取的，在做webgis可视化的时候各种偏，各种坐标不对，叠加错位。

## 当前互联网地图的坐标系现状
### 地球坐标 (WGS84)
- 国际标准，从 GPS 设备中取出的数据的坐标系
- 国际地图提供商使用的坐标系

### 火星坐标 (GCJ-02)也叫国测局坐标系
- 中国标准，从国行移动设备中定位获取的坐标数据使用这个坐标系
- 国家规定： 国内出版的各种地图系统（包括电子形式），必须至少采用GCJ-02对地理位置进行首次加密。

###百度坐标 (BD-09)
- 百度标准，百度 SDK，百度地图，Geocoding 使用
- (本来就乱了，百度又在火星坐标上来个二次加密)

## 开发过程需要注意的事
- 从设备获取经纬度（GPS）坐标

    		如果使用的是百度sdk那么可以获得百度坐标（bd09）或者火星坐标（GCJ02),默认是bd09
    		如果使用的是ios的原生定位库，那么获得的坐标是WGS84
    		如果使用的是高德sdk,那么获取的坐标是GCJ02
- 互联网在线地图使用的坐标系

		火星坐标系：
    			iOS 地图（其实是高德）
    			Google国内地图（.cn域名下）
    			搜搜、阿里云、高德地图、腾讯
		百度坐标系：
    			当然只有百度地图
		WGS84坐标系：
    			国际标准，谷歌国外地图、osm地图等国外的地图一般都是这个
# 举个例子
笔者所在的公司app使用的是百度的sdk,需要对定位坐标做web可视化效果，百度地图提供的js api满足不了需求，选用leaflet来做可视化，这里要说到百度地图了，它使用的坐标系和切图的原点都不一致，并且其加偏还是非线性的，因此无法利用常用的加载方法去加载，放弃使用它的底图，选用了符合标准的高德底图，高德底图使用的是国测局坐标也就是GCJ02坐标系，如果简单的将app获取的经纬度叠加上去，就有可能你本来在百度大厦的位置就显示在西二旗地铁站了甚至更远，因此需要将bd09转成gcj02坐标系，这个时候这个库就有了用武之地，对点批量转换再加载到底图上，就可以让点显示在本应该出现的位置。

	另外如果你拿到了一些WGS84的坐标，想加载到各种底图上就可以根据这个库在底图坐标系和你的数据坐标系之间进行转换。希望对大家有用吧。

****


### 安装（install）

```
npm install coordtransform
```


### 示例用法（Example&Usage）
1 NodeJs用法

```
//国测局坐标(火星坐标,比如高德地图在用),百度坐标,wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)
var coordtransform=require('coordtransform');
//百度经纬度坐标转国测局坐标
var bd09togcj02=coordtransform.bd09togcj02(116.404, 39.915);
//国测局坐标转百度经纬度坐标
var gcj02tobd09=coordtransform.gcj02tobd09(116.404, 39.915);
//wgs84转国测局坐标
var wgs84togcj02=coordtransform.wgs84togcj02(116.404, 39.915);
//国测局坐标转wgs84坐标
var gcj02towgs84=coordtransform.gcj02towgs84(116.404, 39.915);
console.log(bd09togcj02);
console.log(gcj02tobd09);
console.log(wgs84togcj02);
console.log(gcj02towgs84);
//result
//bd09togcj02:   [ 116.39762729119315, 39.90865673957631 ]
//gcj02tobd09:   [ 116.41036949371029, 39.92133699351021 ]
//wgs84togcj02:  [ 116.41024449916938, 39.91640428150164 ]
//gcj02towgs84:  [ 116.39775550083061, 39.91359571849836 ]
```
2 浏览器用法
直接引用目录内的index.js，会有一个coordtransform的全局对象暴露出来，也支持用AMD加载器加载

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>coordTransform</title>
</head>
<body>
<h1>请按F12打开控制台查看结果</h1>
<script src="index.js"></script>
<script>
    //国测局坐标(火星坐标,比如高德地图在用),百度坐标,wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)
    //百度经纬度坐标转国测局坐标
    var bd09togcj02 = coordtransform.bd09togcj02(116.404, 39.915);
    //国测局坐标转百度经纬度坐标
    var gcj02tobd09 = coordtransform.gcj02tobd09(116.404, 39.915);
    //wgs84转国测局坐标
    var wgs84togcj02 = coordtransform.wgs84togcj02(116.404, 39.915);
    //国测局坐标转wgs84坐标
    var gcj02towgs84 = coordtransform.gcj02towgs84(116.404, 39.915);
    console.log(bd09togcj02);
    console.log(gcj02tobd09);
    console.log(wgs84togcj02);
    console.log(gcj02towgs84);
    //result
    //bd09togcj02:   [ 116.39762729119315, 39.90865673957631 ]
    //gcj02tobd09:   [ 116.41036949371029, 39.92133699351021 ]
    //wgs84togcj02:  [ 116.41024449916938, 39.91640428150164 ]
    //gcj02towgs84:  [ 116.39775550083061, 39.91359571849836 ]
</script>
</body>
</html>
```
### todos
- 墨卡托坐标
- geojson转换
- 批量转换
- turf插件
- leaflet插件

### sometipes
对于做GIS的人来说，底图对我们还是很重要的，有时候看国外的底图很好看，换上之后发现坐标位置全部不对，因此写了这个包帮助大家完成坐标的转换，也准备写成一个leaflet的扩展，方便大家的使用，喜欢的童鞋请star，O(∩_∩)O
