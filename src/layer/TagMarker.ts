import { Layer } from "./Layer";
/**
 * TagMarker类 
 */
export class TagMarker extends Layer {
 
  tagMarker!: altizure.TagMarker;
  toptions:any;
	/**
	 * 初始化构造TagMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.TagMarkerOptions) {
    super(); 
		this.toptions  = option;
		this.tagMarker = new altizure.TagMarker(this.toptions);
	}

	remove(): number {
		console.log("remove");
		console.log(this);  
		this.tagMarker.destruct();
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
