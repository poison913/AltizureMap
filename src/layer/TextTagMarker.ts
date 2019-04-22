import { Layer } from "./Layer";
/**
 * TextTagMarker类 
 */
export class TextTagMarker extends Layer {
 
  textTagMarker!: altizure.TextTagMarker;
  toptions:any;
	/**
	 * 初始化构造TextTagMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.TextTagMarkerOptions) {
    super(); 
		this.toptions  = option;
		this.textTagMarker = new altizure.TextTagMarker(this.toptions);
	}

	remove(): number {
		console.log("remove");
		console.log(this);  
		this.textTagMarker.destruct();
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
