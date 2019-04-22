import { Layer } from "./Layer";
/**
 * AltizureProjectMarker类 
 */
export class CameraMarker extends Layer {
 
  cameraMarker!: altizure.CameraMarker;
  coptions:any;
	/**
	 * 初始化构造AltizureProjectMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.CameraMarkerOptions) {
    super(); 
    this.coptions  = option;
		this.cameraMarker = new altizure.CameraMarker(this.coptions);
	}

	remove(): number {
		console.log("remove");
    console.log(this);  
		this.removeFrom(this.map);

		return 0;
	}

  rotate( ){
    let cmark =this.cameraMarker;
    let map = this.map;
    let m = 1 
    setInterval(function(){    
      cmark.euler = {z: Math.PI/m};  
      map.sandbox.camera.flyToCamToEarth(cmark.camToEarth);
      m++;
    }, 2000);
   /*  this.cameraMarker.euler = {y: Math.PI/4};  
    this.map.sandbox.camera.flyToCamToEarth(this.cameraMarker.camToEarth); */
  }
	/**
	 * 绘制图层
	 */
	refresh(): any { 
    //this.addTo(this.map);  
  }  
}
