import { Layer } from "./Layer";
/**
 * Geojson图层类，暂仅支持多边形
 */
export class GeojsonLayer extends Layer {

	geoJsonHttpUrl: string;
	crs: string;

	polygons!: altizure.PolygonMarker[];

	/**
	 * 初始化构造Geojson类
	 * @param url geosjon数据请求Http地址
	 * @param crs 数据参考坐标系
	 */
	constructor(url: string, crs: string) {
		super();
		this.geoJsonHttpUrl = url;
		this.crs = crs;
		this.polygons = new Array<altizure.PolygonMarker>();
	}

	remove(): number {
		console.log("remove");
		console.log(this);
		this.polygons.forEach(_ => _.destruct());
		this.removeFrom(this.map);

		return 0;
	}

	/**
	 * 绘制图层
	 */
	refresh(): void {
		if (this.map == undefined) return;
		fetch(this.geoJsonHttpUrl, {
			mode: 'cors',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		}).then((response: Response) => {
			response.json().then(
				json => {
					let polygonMarkers = altizure.GeoJson.polygonsFromGeoJson(json, this.map.sandbox, {
						top: 20,
						bottom: 0.1,
						color: 0xffffff * Math.random(),
						opacity: 0.2
					})

					this.polygons = polygonMarkers;
				},
			);
		});
	}
}
