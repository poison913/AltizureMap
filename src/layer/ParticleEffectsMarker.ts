import { Layer } from "./Layer";
/**
 * ParticleEffectsMarker类 
 */
export class ParticleEffectsMarker extends Layer {
 
  particleEffectsMarker!: altizure.ParticleEffectsMarker;
  coptions:any;
	/**
	 * 初始化构造AltizureProjectMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.ParticleEffectsMarkerOptions) {
    super(); 
    this.coptions  = option;
    this.particleEffectsMarker = new altizure.ParticleEffectsMarker(this.coptions);
    this.particleEffectsMarker.animatingTime = -1; 
	}

	remove(): number {
		console.log("remove");
    console.log(this);  
    this.particleEffectsMarker.destruct();
		this.removeFrom(this.map);

		return 0;
	}
 
	refresh(): any { 
    //this.addTo(this.map);  
  }  
}
