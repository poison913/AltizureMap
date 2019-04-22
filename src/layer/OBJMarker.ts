import { Layer } from "./Layer";
import { AltizureProjectMarker } from "./AltizureProjectMarker";

/**
 * OBJMarker类 
 */
export class OBJMarker extends Layer {
 
  ibjMarker!: altizure.OBJMarker;
	ioptions:any;
	posecnt:number;
	/**
	 * 初始化构造TagMarker类
	 * @param earth 标记附加的地球
	 * @param crs 数据参考坐标系
	 */
	constructor(option :altizure.OBJMarkerOptions) {
    super(); 
		this.ioptions  = option;
		this.posecnt = 0;
		this.ibjMarker = new altizure.OBJMarker(this.ioptions);
	}

	remove(): number {
		console.log("remove");
		console.log(this);  
		this.ibjMarker.destruct();
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
	
	/**
	 * 移动
	 * @param points 路径点 
	 * @param turnTime 时间，单位毫秒
	 * @param speed veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
	 * @param amark 场景
	 */
	move(points:Array<altizure.LngLatAlt>, turnTime: number,speed:string,amark:altizure.AltizureProjectMarker,sandbox:altizure.Sandbox){
		let path = new Array<altizure.LngLatAlt>();
		if(points.length<2){
			console.log("路径点数要大于2");
			return;
		} 
		let frequency = 	100 ; // 插值点数  
		//根据距离获取插值点
		let pathdis = new Array<number>();//各段距离 
		let pathfrequency = new Array<number>();//各段插值点数
		let disall = 0 ;//总距离
		for(let i = 0 ; i < points.length - 1; i++){
			let dis = Math.abs(sandbox.calculateDistanceBetweenTwoPoints( points[i+1],points[i]));
			pathdis.push(dis);
			disall += dis;
		}  
		for(let i = 0 ; i < pathdis.length; i++){ 
			pathfrequency.push(Math.round(pathdis[i]/disall *  frequency) ) ;
		} 
		for(let i = 0 ; i < points.length - 1; i++){ 
			for(let j = 0 ; j < pathfrequency[i]; j++){
				let lng =points[i].lng + (points[i+1].lng - points[i].lng)/pathfrequency[i]*j;
				let lat =points[i].lat +  (points[i+1].lat - points[i].lat)/pathfrequency[i]*j;
				let alt = points[i].alt +  (points[i+1].alt - points[i].alt)/pathfrequency[i]*j;
				
				path.push({lng:lng,lat:lat,alt:alt})
			}  
		}
		//获取高度
		try
		{ 
			let alts = amark.pickDepthMap(path); 
			for(let i = 0 ; i < alts.length; i++){ 
				path[i].alt = alts[i] ;
			} 
		}catch 				
		{

		}
		this.MuiltiPose(path,turnTime/frequency,speed,points)
	}
  //移动
	public MuiltiPose(aps: Array<altizure.LngLatAlt>, turnTime: number,speed:string,pointangle:Array<altizure.LngLatAlt> )  {
		let array1:Array<object> = new Array<object>(); 
		let Multiple = 1;
		if(speed =="veryslow"){
				Multiple = 4;
		}else if(speed =="slow"){
				Multiple = 2;
		}else if(speed =="fast"){
				Multiple = 0.5;
		}else if(speed =="veryfast"){
				Multiple = 0.25;
		}  
		let omark  = this;
		//转换角度
		for(let i = 0 ; i < pointangle.length-1; i++){ 
			if(this.posecnt <aps.length && pointangle[i].lat == aps[this.posecnt].lat && pointangle[i].lng == aps[this.posecnt].lng)
			{
				this.ibjMarker.euler = {z:this.GetAngle(pointangle[i],pointangle[i+1])}
			}
		} 
		this.ibjMarker.position = aps[omark.posecnt];
		let poseout;
		if(this.posecnt <aps.length ){
				poseout = setTimeout(function(){omark.MuiltiPose(aps,turnTime,speed,pointangle)},turnTime*Multiple) ;
				this.posecnt++;
		}else{
				clearTimeout(poseout);
				this.posecnt = 0;
		}
}
public GetAngle(  pntFirst:altizure.LngLatAlt,   pntNext:altizure.LngLatAlt)
{
		let dRotateAngle = Math.atan2(Math.abs(pntFirst.lng - pntNext.lng), Math.abs(pntFirst.lat - pntNext.lat));
		if (pntNext.lng >= pntFirst.lng)
		{
				if (pntNext.lat >= pntFirst.lat)
				{
				}
				else
				{
						dRotateAngle = Math.PI - dRotateAngle;
						//dRotateAngle = 2*Math.PI - dRotateAngle;
				}
		}
		else            
		{
				if (pntNext.lat >= pntFirst.lat)
				{
						dRotateAngle = 2 * Math.PI - dRotateAngle;
						//dRotateAngle =  Math.PI/4 - dRotateAngle;
				}
				else                
				{
						dRotateAngle = Math.PI + dRotateAngle;
						//dRotateAngle = Math.PI + dRotateAngle;
				}
		}
		//dRotateAngle = dRotateAngle * 180 / Math.PI;
		return dRotateAngle;
} 
}
