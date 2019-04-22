/**
 * Altizure SDK的头文件说明
 */
declare namespace altizure {
	/**
	 * 
	 */
	interface LngLatAlt {
		lng: number;
		lat: number;
		alt: number;
	}

	class LngLatAlt {
		constructor(lng: number, lat: number, alt: number);
	}

	interface Matrix4 {

	}

	interface ProjectMarkerOptions {
		pid: string;
		center: Coord;
		marker?: altizure.AltizureProjectMarker;
	}


	class Earth {
		/**
		 * 
		 * @param divename 绘制地球的divElement的名称
		 * @param earthOptions 创建地球的初始选项
		 */
		constructor(
			divename: string,
			earthOptions?: {
				altlonglat?: { longitude?: number, latitude?: number, altitude?: number },
				orientation?: { northing?: number, tilt?: number },
				renderItems?: { earth?: boolean, featureInView?: boolean },
				develop?: boolean
			});

		/**
		 * 
		 * @param first 
		 * @param second 
		 * @returns 以米为单位的两点间的距离
		 */
		calculateDistanceBetweenTwoPoints(first: LngLatAlt, second: LngLatAlt): number;

		destruct(): void;

		earthToScene(): Matrix4;
	}

	/**
	 * 相机姿势
	 */
	interface Pose extends LngLatAlt {
		/**
		 * 倾角
		 */
		tilt: number,
		/**
		 * 方向
		 */
		north: number
	}


	/**
	 * 初始化选项
	 */
	interface SanboxOptions {
		altizureApi: { key: string, apiUrl?: string, altitoken?: string, region?: string },
		api?: object,
		camera?: { poseTo?: Pose, flyTo?: Pose },
		renderItems?: {
			earth?: boolean, earthUseTexture?: boolean, featureInView?: boolean, orbitRing?: boolean,
			background?: { transparent?: boolean, opacity?: boolean, color?: boolean, image?: boolean },
			quality?: number
		}
	}
	/**
	 * 地图显示的容器
	 * 显示，操作，与多个altizure项目交互，和多个导入的gl元素
	 */
	class Sandbox extends Earth {
		constructor(divname: string, sanboxOptions: SanboxOptions);
    
		/**摄像头 */
		camera: any;

		window: any;
		markerLayer:any;
		/**渲染器的dom元素 */
		domElement:any;
		/**
		 * 加载
		 * @param type 元素类型：‘AltizureProjectMarker’,'OBJMarker'
		 * @param options 选项来创建标记
		 */
		add<T>(type: string, options: object): Promise<T>;

		// polygonsFromGeoJson(geosjon: object, polygonOptions: object): Array<PolygonMarker>;

		/**
		 * 从当前姿势飞行到输入姿势，该过程会花费持续时间（毫秒）
		 * @param p 定位的位置
		 * @param duration 飞行时间
		 */
		flyTo(p: Pose, duration: number): Promise<object>;

		on(eventType: string, handler: Function): void;
		off(eventType: string, handler: Function): void;
		pickOnProjects(event:object): LngLatAlt; 
	}

	interface MarkerOptions {
		position: LngLatAlt,
		earth: Earth,
		sandbox: Sandbox,
		visible?: boolean,
		name?: string,
		interactable?: boolean,
		patrolRoutes?: Function,
	}

	interface Volume {
		top?: number | Array<Array<number>>,
		bottom?: number | Array<Array<number>>,
		color?: number,
		opacity?: number,
		points: Array<Array<LngLatAlt>>,
	}
	// interface PolygonMarkerOptions extends MarkerOptions {
	//     volume: Volume,
	// }

	interface PolygonMarkerOptions {
		volume: Volume,
		sandbox: Sandbox,
		name?: string,
		interactable?: boolean,
	}

	
	interface TextTagMarkerOptions {
		text: string,
		textStyle:object,
		sandbox: Sandbox,
		position: LngLatAlt,
		scale?: Number
	}
	interface TagMarkerOptions {
		imgUrl: string, 
		sandbox: Sandbox,
		position: LngLatAlt,
		scale?: Number
	}
	interface LightBeamMarkerOptions {
		color: object 
	}
	interface OBJMarkerOptions {
		sandbox: Sandbox,
		position: LngLatAlt,
		shape: string, 
		objUrl : string,
		mtlUrl:string,
		upDir:object,
		scale?: Number
	}
	interface CameraMarkerOptions {
		camToEarth: Array<number>, 
		sandbox: Sandbox,
		position: LngLatAlt,
		showNear:	boolean	,  
		showFar: boolean	 ,
		color:	object ,
		fov:	number	 ,
		near:	number	 ,
		far	:number	 ,
		aspect:	number,
		euler:object
	}
	//图标
	class Marker {
		destruct(): void;
		// constructor(markerOptions: markerOptions);
	}
	//面
	class PolygonMarker extends Marker {
		constructor(polygonMarkerOptions: any);
		bottom: Number;
		top: Number;
		position: LngLatAlt;
	}
	//文字标注
	class TextTagMarker extends Marker {
		constructor( textTagMarkerOptions: any);  
	}
	//文字标注
	class TagMarker extends Marker {
		constructor( TagMarkerOptions: any);  
	} 
	class OBJMarker extends Marker {
		constructor( OBJMarkerOptions: any);  
		position :object;
		euler :object
	}
	class LightBeamMarker extends Marker {
		constructor( LightBeamMarkerOptions: any);  
		color:object
	}
	class CameraMarker extends Marker {
		constructor( CameraMarkerOptions: any);  
		euler:object;
		camToEarth: Array<number>;
	}

	
	interface ParticleEffectsMarkerOptions { 
		sandbox: Sandbox,
		position: LngLatAlt,
		scale?: Number
	}
	class ParticleEffectsMarker extends Marker {
		constructor( ParticleEffectsMarkerOptions: any);  
		scale:number;
		animatingTime: number;
	} 
	interface ZoneMarkerOptions {  
		sandbox: Sandbox,
		position: LngLatAlt,
		scale?: Number,
		volume:object,
		tagOrientation:object,
		tagScale:number,
		imgUrl:string,
		textOptions:object
	}
	class ZoneMarker extends PolygonMarker {
		constructor( ZoneMarkerOptions: any);   
	}
	interface SimpleAltizureProjectMarker {
		pid: string
	}

	class AltizureProjectMarker extends Marker {
		constructor(APMOptions: APMOptions);
		/**
		 * 工程坐标定位位置
		 */
		position: altizure.LngLatAlt;
		loadCropMask(): AltizureProjectMarker;

		/**
		 * 隐藏蓝色方框
		 */
		dim(): void;
		initialized: altizure.AltizureProjectMarker;

		pickDepthMap(points:Array<LngLatAlt>):Array<number>;
	}
	
	class PolyLineMarker extends Marker
	{
		constructor(PLOPtion: PLOPtion);
	}
	interface PLOPtion {
		sandbox: Sandbox,
		points: Array<LngLatAlt> ,
		color:Object,
		fenceHeight:number,
		name:string,
		lineWidth:number
	}
	class PolyCylinderLineMarker extends Marker
	{
		constructor(PLOPtion: PLCOPtion);
	}
	interface PLCOPtion {
		sandbox: Sandbox,
		points: Array<LngLatAlt> ,
		color:Object, 
		name:string,
		lineWidth:number
	}
	interface APMOptions {
		earth: Earth;
		projInfo: object;
		partrolRoutes?: object;
		position: LngLatAlt;
		// orientation: Quaternion;
		scale?: object;
	}


	interface Coord {
		x: number;
		y: number;
		z: number;
	}

	interface GeoSystemOptions {
		sandbox: Sandbox,
		base: AltizureProjectMarker,
		baseCenter: Coord,
		EPSG?: String
	}

	class GeoSystem {
		constructor(geoSystemOptions: GeoSystemOptions);
		convert(postion: LngLatAlt): LngLatAlt;
		align(opt: { marker: AltizureProjectMarker, markerCenter: Coord }): void;
	}

	interface polygonOptions {
		top: number,
		bottom: number,
		color: any,
		opacity: number,
	}

	namespace GeoJson {
		function polygonsFromGeoJson(geojson: JSON, sandbox: Sandbox, polygonOptions: polygonOptions): Array<PolygonMarker>;
	}


}