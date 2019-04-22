import { Layer } from "./Layer";
/**
 * PolyLineMarker 
 */
export class PolyCylinderLineMarker extends Layer {
 
  polylineMarker!: altizure.PolyCylinderLineMarker;
  ploptions:any;
	/**
	 * PolyCylinderLineMarker
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor( option :altizure.PLCOPtion) {
    super(); 
  /*   let pts2 = points
      .map(function(lnglatalt)  {
        return new altizure.LngLatAlt(lnglatalt[0], lnglatalt[1], lnglatalt[2])
      });
    option.points = pts2; */
		this.ploptions  = option;
    this.polylineMarker = new altizure.PolyCylinderLineMarker(this.ploptions);
   
	}

	remove(): number {
		console.log("remove");
		console.log(this);  
		this.polylineMarker.destruct();
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
