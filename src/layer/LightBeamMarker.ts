import { Layer } from "./Layer";
/**
 * LightBeamMarker类 
 */
export class LightBeamMarker extends Layer {
 
  lightBeamMarker!: altizure.LightBeamMarkerOptions;
  loptions:any;
	/**
	 * 初始化构造AltizureProjectMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.LightBeamMarkerOptions) {
    super(); 
    this.loptions  = option;
    this.lightBeamMarker = new altizure.LightBeamMarker(this.loptions);
	}

	remove(): number {
		console.log("remove");
    console.log(this);  
		this.removeFrom(this.map);

		return 0;
	}

	/**
	 * 绘制图层
	 */
	refresh(): any { 
    //this.addTo(this.map); 
		//return this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
  }  
}
