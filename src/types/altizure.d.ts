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
		 * 毫秒
		 */
		tilt: number
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
		points: Array<LngLatAlt>,
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

	class PolygonMarker extends Marker {
		constructor(polygonMarkerOptions: any);
		bottom: Number;
		top: Number;

	}

	class Marker {
		destruct(): void;
		// constructor(markerOptions: markerOptions);
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