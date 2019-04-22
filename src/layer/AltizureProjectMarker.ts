import { Layer } from "./Layer";
/**
 * AltizureProjectMarker类 
 */
export class AltizureProjectMarker extends Layer {
 
  altizureProjectMarker!: altizure.AltizureProjectMarker;
  aoptions:any;
	/**
	 * 初始化构造AltizureProjectMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.APMOptions) {
    super(); 
    this.aoptions  = option;
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
		return this.map.sandbox.add('AltizureProjectMarker',this.aoptions )  
  }  
}
