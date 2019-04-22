import { Layer } from "./Layer";
/**
 * OBJMarker类 
 */
export class ZoneMarker extends Layer {
 
  zoneMarker!: altizure.ZoneMarker;
  zoptions:any;
	/**
	 * 初始化构造TagMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.ZoneMarkerOptions) {
    super(); 
		this.zoptions  = option; 
		this.zoneMarker = new altizure.ZoneMarker(this.zoptions);
	}

	remove(): number {
		console.log("remove");
		console.log(this);  
		this.zoneMarker.destruct();
		this.removeFrom(this.map);

		return 0;
	}

	/**
	 * 绘制图层
	 */
	refresh(): void { 
    //this.addTo(this.map);
    
    //this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
  }  
}
