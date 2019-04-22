import { Layer } from "../layer/Layer";
import { url } from "inspector";
import { parse } from "url";
import { promises } from "fs";
export class Map {
    public sandbox!: altizure.Sandbox;

    /**
     * 图层列表
     */
    layers!: Layer[];
    divID!: string;
    posecnt:number;
    SinglePoint:altizure.Pose;//单点飞行结束点
    SinglePointduration:number ;//单点飞行总共的时间
    SinglePointbeginTime : number;//单点飞行开始时间
    SinglePointendTime : number;//单点飞行暂停时间
    SinglePointendpose:altizure.Pose;//单点飞行暂停时的相机位置
    popupdiv:any;//气泡框
    framediv:any;//弹出框 
    dispoints: Array<altizure.LngLatAlt>;
    map:any;
    iscancel = false ;
    reduceNum:number;//reduce进行到第几个了
    reduceStatue:boolean;//reduce状态
    reduceArray:Array<object>;
    isflystop = false ;

    constructor(id: string, options: altizure.SanboxOptions) {
        this.sandbox = new altizure.Sandbox(id, options);
        this.layers = new Array<Layer>();
        this.divID = id;
        this.posecnt = 0;
        this.SinglePoint = { tilt:0, north:0, lng:0, lat:0, alt:0} ;
        this.SinglePointendpose = { tilt:0, north:0, lng:0, lat:0, alt:0} ;
        this.SinglePointbeginTime = 0;
        this.SinglePointendTime = 0;
        this.SinglePointduration = 0 ;
        this.dispoints = new Array<altizure.LngLatAlt>(); 
        this.reduceNum = 0;
        this.reduceStatue = true;
        this.reduceArray = new Array<object>();
        console.log("map created.");
        window.document.oncontextmenu = function(){ return false; }
    }

    /**
     * 删除图层
     * @param layer 待删除的图层
     * @returns 返回图层所在序列
     */
    public removeLayer(layer: Layer): number {
        const layerIndex = this.layers.indexOf(layer);
        if (layerIndex > -1) {
            this.layers.splice(layerIndex, 1);
        }
        return layerIndex;
    }

    public addLayer(layer: Layer): any {
        this.layers.push(layer);
    }

    public flyTo(p: altizure.Pose, duration: number): Promise<object> {
        this.isflystop = false;
        this.SinglePoint  = p;
        this.SinglePointduration = duration;
        this.SinglePointbeginTime = new Date().getTime();//时间戳
        return this.sandbox.camera.flyTo(p,duration)  
    }
    public flystop(): Promise<object> {
        this.isflystop = true;
        this.SinglePointendTime = new Date().getTime();//时间戳
        this.SinglePointendpose = this.sandbox.camera.pose;
        return this.sandbox.camera.stop();
    }
   public continueflyTo(): Promise<object>{
        if(this.SinglePointendTime == 0){
            console.log("无法继续飞行");
            return  Promise.resolve( {}) ;
        }
        let array1:Array<object> = new Array<object>(); 
        let continueduration = this.SinglePointduration - (this.SinglePointendTime - this.SinglePointbeginTime);
        this.sandbox.camera.pose = this.SinglePointendpose;
        return this.flyTo(this.SinglePoint, continueduration );

   }

   public singlefly(flymode:string, endPoint: altizure.Pose, turnTime: number,speed:string ){
    let Multiple = 1;
    if(speed =="veryslow"){
        Multiple = 4;
    }else if(speed =="slow"){
        Multiple = 2;
    }else if(speed =="fast"){
        Multiple = 0.5;
    }else if(speed =="veryfast"){
        Multiple = 0.25;
    };
    if(flymode.toLocaleLowerCase()=="fly"){
        this.flyTo(endPoint,Multiple*turnTime)
    }else if(flymode.toLocaleLowerCase()=="pose"){
        this.Pose(endPoint )
    }else if(flymode.toLocaleLowerCase()=="lineto"){
        this.LineTo(endPoint,turnTime,speed,this);
    }  

   }


    /**
     * 单点滑行（LineTo）
     * @param startPoint 开始位置
     * @param endPoint 结束位置 
     * @param turnTime 每次飞行时间，单位毫秒
     * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25） 
     */
    public LineTo( endPoint: altizure.Pose, turnTime: number,speed:string,map:any)  {
        let pathpoint = 100 ;//默认100个插值点
        let path = new Array<altizure.Pose>();
        let startPoint = this.sandbox.camera.pose;
        for(let j = 0 ; j < pathpoint; j++){
            let lng = startPoint.lng + (endPoint.lng - startPoint.lng)/pathpoint*j;
            let lat = startPoint.lat + (endPoint.lat - startPoint.lat)/pathpoint*j;
            let alt = startPoint.alt + (endPoint.alt - startPoint.alt)/pathpoint*j;
            let tilt = startPoint.tilt + (endPoint.tilt - startPoint.tilt)/pathpoint*j;
            let north = startPoint.north + (endPoint.north - startPoint.north)/pathpoint*j;
            path.push({lng:lng,lat:lat,alt:alt,tilt:tilt,north:north})
        }  

        return  this.MuiltiFlyto(path,turnTime,speed)
    }

    public Multipointfly(flymode:string,points: Array<altizure.Pose>, turnTime: number,speed:string )  {
        
        if(flymode.toLocaleLowerCase()=="fly"){
            return this.MuiltiFlyto(points, turnTime,speed);
        }else if(flymode.toLocaleLowerCase()=="pose"){
            this.MuiltiPose(points, turnTime,speed,this ) 
        }else if(flymode.toLocaleLowerCase()=="lineto"){
            return this.MuiltiLineTo(points, turnTime,speed);
        }  
    
       }
     /**
     * 多点滑行（MuiltiLineTo）
     * @param points 路径点 
     * @param turnTime 每次飞行时间，单位毫秒
     * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25） 
     */
    public MuiltiLineTo(points: Array<altizure.Pose>, turnTime: number,speed:string ): Promise<void>  {
        let path = new Array<altizure.Pose>();
		if(points.length<2){
			console.log("路径点数要大于2");
			return  Promise.resolve() ;
		} 
		let frequency = 100 ; // 插值点数  
		//根据距离获取插值点
		let pathdis = new Array<number>();//各段距离 
		let pathfrequency = new Array<number>();//各段插值点数
		let disall = 0 ;//总距离
		for(let i = 0 ; i < points.length - 1; i++){
			let dis = Math.abs(this.sandbox.calculateDistanceBetweenTwoPoints( points[i+1],points[i]));
			pathdis.push(dis);
			disall += dis;
        }  
        //距离为0，特殊分配
        if(disall==0){
            for(let i = 0 ; i < pathdis.length ; i++){
                pathfrequency.push(frequency/points.length ) ;
            } 
        }else{ 
            for(let i = 0 ; i < pathdis.length; i++){  
                if(pathdis[i]==0){
                    pathfrequency.push(frequency/points.length) ;
                }else{
                    pathfrequency.push(Math.round(pathdis[i]/disall *  frequency) ) ;
                }
               
            } 
        }
       
		for(let i = 0 ; i < points.length - 1; i++){ 
			for(let j = 0 ; j < pathfrequency[i]; j++){
				let lng =points[i].lng + (points[i+1].lng - points[i].lng)/pathfrequency[i]*j;
				let lat =points[i].lat +  (points[i+1].lat - points[i].lat)/pathfrequency[i]*j;
				let alt = points[i].alt +  (points[i+1].alt - points[i].alt)/pathfrequency[i]*j;
				let tilt = points[i].tilt + (points[i+1].tilt - points[i].tilt)/pathfrequency[i]*j;
                let north = points[i].north + (points[i+1].north - points[i].north)/pathfrequency[i]*j;
                path.push({lng:lng,lat:lat,alt:alt,tilt:tilt,north:north})
			}  
		}
		 
        return this.MuiltiFlyto(path,turnTime,speed)
    }
     /**
     * 多点飞行
     * @param aps 飞行点
     * @param turnTime 每次飞行时间，单位毫秒
     * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25） 
     */
    public MuiltiFlyto(aps: Array<altizure.Pose>, turnTime: number,speed:string ): Promise<void>  {
        let array1:Array<object> = new Array<object>();
        let map = this;
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
        //根据距离获取时间
		let pathdis = new Array<number>();//各段距离 
		let pathtime = new Array<number>();//各段时间
		let disall = 0 ;//总距离
		for(let i = 0 ; i < aps.length - 1; i++){
			let dis = Math.abs(map.sandbox.calculateDistanceBetweenTwoPoints( aps[i+1],aps[i]));
			pathdis.push(dis);
			disall += dis;
        }  
          //距离为0，特殊分配
          if(disall==0){
            for(let i = 0 ; i < pathdis.length ; i++){
                pathtime.push(Multiple*turnTime/aps.length ) ;
            } 
        }else{ 
            for(let i = 0 ; i < pathdis.length; i++){  
                if(pathdis[i]==0){
                    pathtime.push(Multiple*turnTime/aps.length ) ;
                }else{
                    pathtime.push(Math.round(Multiple*turnTime*pathdis[i]/disall) ) ;
                }
               
            } 
        } 
        //视角切换到第一个点  准备飞行
        map.sandbox.camera.pose = aps[0];
        for(let i = 0 ; i < aps.length - 1; i++){
            if( aps.length - 2 == i){
                array1.push( function() {
                    if(map.reduceStatue){
                        map.reduceNum = 0 ; 
                        return map.flyTo(aps[i+1], pathtime[i] )
                    }
                })
            }else{ 
                array1.push( function() {
                    if(map.reduceStatue){
                        map.reduceNum ++ ; 
                        return map.flyTo(aps[i+1], pathtime[i] )
                    }
                })
            }
        }   
        return this.reduce(array1)
         
    }
    public flyToCamToEarth(mat: Array<number>, duration: number): Promise<object> {
        return this.sandbox.camera.flyToCamToEarth(mat,duration);
    }
   
      /**
     * 多点飞行
     * @param aps 飞行点
     * @param turnTime 每次飞行时间，单位毫秒
     * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
     */
    public MuiltiflyToCamToEarth(aps: Array<Array<number>>, turnTime: number,speed:string) : Promise<void>  {
        let array1:Array<object> = new Array<object>();
        let map = this;
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
        for(let i = 0 ; i < aps.length - 1; i++){
            if( aps.length - 2 == i){
                array1.push( function() {
                    if(map.reduceStatue){
                        map.reduceNum = 0 ; 
                        return map.flyToCamToEarth(aps[i+1], turnTime*Multiple )
                    }
                })
            }else{ 
                array1.push( function() {
                    if(map.reduceStatue){
                        map.reduceNum ++ ; 
                        return map.flyToCamToEarth(aps[i+1], turnTime*Multiple )
                    }
                })
            }
        }   
        /* aps.forEach(value=>
            array1.push( function() {return map.flyToCamToEarth(value, turnTime*Multiple)})
        );  */
        return this.reduce(array1) 
    }
    public reduce(arr:Array<any>) : Promise<void> {
        var sequence = Promise.resolve() 
        this.reduceArray = arr;
        arr.forEach(value=>
            sequence = sequence.then(value)
        ) 
        /* for(let i = 0 ; i < arr.length;i++){
            if(this.reduceStatue){ 
                sequence = sequence.then(arr[i]);
                this.reduceNum ++ ;
            }else{
                break;
            }
            if(this.reduceNum ==arr.length ){
                this.reduceNum = 0;
            }
        } */
        return sequence
    }
    public reduceContinue(){
        this.reduceStatue = true;
        let array1:Array<object> = new Array<object>();
        for(let i = this.reduceNum ; i < this.reduceArray.length;i++){
            array1[i-this.reduceNum] = this.reduceArray[i];
        } 
        this.reduceNum  = 0;
        //this.reduce(array1);
        this.reduceArray = array1;
        return  array1;
    }

    public Pose(p: altizure.Pose) {
        this.sandbox.camera.pose = p ;
    } 
 
    /**
     * 多点切换
     * @param aps 飞行点
     * @param turnTime 每次飞行时间，单位毫秒
     * @param speed : veryslow （turnTime*4）; slow（turnTime*2）; normal（turnTime*1）; fast（turnTime*0.5）; veryfast（turnTime*0.25）
     */
    public MuiltiPose(aps: Array<altizure.Pose>, turnTime: number,speed:string,map:any)  {
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
        if(map==null){
            map = this;
        }
        map.sandbox.camera.pose = aps[map.posecnt];
        let poseout;
        if(map.posecnt <aps.length ){
            poseout = setTimeout(function(){map.MuiltiPose(aps,turnTime,speed,map)},turnTime*Multiple/aps.length) ;
            map.posecnt++;
        }else{
            clearTimeout(poseout);
            map.posecnt = 0;
        }
    }
    public getView(): altizure.LngLatAlt[] {
        const mapDom = document.getElementById(this.divID) as HTMLElement;
        const bottomLeft = this.sandbox.window.toLngLatAlt({ x: 0, y: mapDom.clientHeight });
        const topRight = this.sandbox.window.toLngLatAlt({ x: mapDom.clientWidth, y: 0 });
        return [bottomLeft, topRight];
    }  
     /**
     * camera针对某个目标进行360度环绕
     * @param tilt 倾角
     * @param circle 圆心位置
     * @param startPosition 环绕起始位置: 30(与正北方向夹角30度)
     * @param direction 环绕方向: Clockwise(顺时针); CounterClockwise(逆时针)
     * @param angularSpeed 角速度: 30(每秒环绕30度)
     * @param turnTime 环绕时间 
     * @returns promise
     */
    public circleflyTo(tilt: number, circle: altizure.Pose,startPosition:number,direction:string,angularSpeed:number,turnTime:number){
        //设置起始位置
        const InitPpose =  circle;
        InitPpose.tilt = tilt;
        InitPpose.north = startPosition; 
        let aps: Array<altizure.Pose> = new Array<altizure.Pose>();
        aps.push(InitPpose); 
        let currentNorth = startPosition;
        let muilti = 0;
        muilti =turnTime /1000 * angularSpeed; //转的角度 
        muilti = muilti/(angularSpeed/10);//5°飞一次   飞行的次数
        if(direction == "CounterClockwise"){ 
            for(let i=0 ; i< muilti ;i++ ){
                let position1 = Object.assign({}, InitPpose);  
                currentNorth = currentNorth+(angularSpeed/10) ;
                if(currentNorth >= 360){
                    currentNorth = currentNorth - 360;
                }
                position1.north = currentNorth;
                aps.push(position1);
            }
        }else{
            for(let i=0 ; i< muilti ;i++ ){
                let position1 = Object.assign({}, InitPpose); 
                currentNorth = currentNorth-(angularSpeed/10);
                if(currentNorth<=0){
                    currentNorth = 360 + currentNorth ;
                }
                position1.north = currentNorth;
                aps.push(position1);
            }
        }
        //let time = 1000 / angularSpeed * (angularSpeed/10);
        /* if(angularSpeed !=null){
            time = 1/angularSpeed*1000 * 5;
        }else{
            time = turnTime/72;
        } */
        return this.MuiltiLineTo(aps,turnTime,"normal");
    }
 /**
     * camera不动，360度旋转（类似人原地360度旋转）
     * @param tilt 倾角
     * @param circle 圆心位置
     * @param startPosition 环绕起始位置: 30(与正北方向夹角30度)
     * @param direction 环绕方向: Clockwise(顺时针); CounterClockwise(逆时针)
     * @param angularSpeed 角速度: 30(每秒环绕30度)
     * @param turnTime 环绕时间  
     */
    public rorateflyTo( circle: altizure.Pose, direction:string,angularSpeed:number,turnTime:number): Promise<void>{
        //设置起始位置
        const InitPpose =  circle; 
        let map = this;
        let aps: Array<Array<number>> = new Array<Array<number>>();
        let currentYeuler = 0;
        let muilti = 0;
        muilti =turnTime /1000 * angularSpeed; //转的角度
        muilti = muilti/5;//5°飞一次   飞行的次数
        this.Pose(InitPpose);
        let cmarker = new altizure.CameraMarker({
            sandbox: map.sandbox, camToEarth: map.sandbox.camera.mat, showFar: false, showNear: false, color: 0xff0000,showXYZ: false,
            name:"rorateCamera"
        })
        cmarker.euler = {x: Math.PI / 2, y: 0, z: 0}
       
        if(direction == "CounterClockwise"){ 
            for(let i=0 ; i< muilti ;i++ ){ 
                currentYeuler = currentYeuler+Math.PI * 2/360*5 ;
                if(currentYeuler >= Math.PI * 2){
                    currentYeuler = currentYeuler - Math.PI * 2;
                }
                cmarker.euler = {y: currentYeuler}
                aps.push(cmarker.camToEarth);
            }
        }else{
            for(let i=0 ; i< muilti ;i++ ){ 
                currentYeuler = currentYeuler - Math.PI * 2/360*5 ;
                if(currentYeuler<=0){
                    currentYeuler = Math.PI * 2 + currentYeuler ;
                }
                cmarker.euler = {y: currentYeuler}
                aps.push(cmarker.camToEarth);
            }
        }
        return  map.MuiltiflyToCamToEarth(aps,turnTime/muilti,"normal") 
    }

    public removerorate(){
        this.removeMarker("rorateCamera");
    }

    /**
     * 删除图标
     * @param name 名称 
     */
    public removeMarker(name:string )  {
        let marks = this.sandbox.markerLayer.children; 
        let SelectIndex: Array<number> = new Array<number>();  
        for(let i=0 ; i< marks.length ;i++ ){
            if(name == marks[i].name){
                SelectIndex.push(i);
            }
        }
        if(SelectIndex.length==0){
            //if(name != "dis")
             //console.log("没有名称为："+name+" 的图标")
        }else{
            for(let i=SelectIndex.length - 1 ; i>=0 ;i--){
                this.sandbox.markerLayer.removeChild(marks[SelectIndex[i]]);
            }
        }
    }
    /**
     * 气泡
     * @param position 气泡位置
     *  @html 气泡内容
     */
    public popup(position:altizure.LngLatAlt,width:number,height:number,html:string,img:string,audio:string,video:string,iscal=false){
        if(this.popupdiv){
            this.closepopup();
        }
        let pinDiv = <HTMLElement>document.createElement("div");
        pinDiv.style.width = width+"px";
        pinDiv.style.height = height+ "px";
        pinDiv.classList.add("popup");

        if(video!="" && video != undefined){
            let videoele = document.createElement("video");
            videoele.src= video ;
            videoele.autoplay = true;
            videoele.style.width = "100%";
            pinDiv.appendChild(videoele);
        }

        if(audio!=""&& audio != undefined){
            let audioele = document.createElement("audio");
            audioele.src= audio ; 
            audioele.style.width = "100%";
            pinDiv.appendChild(audioele); 
        }

        if(img!=""&& img != undefined){
            let imgele = document.createElement("img");
            imgele.src= img ; 
            imgele.style.width = "100%";
            pinDiv.appendChild(imgele);  
        }
        let pele = document.createElement("p");
        pele.innerHTML = (html); 
        pinDiv.appendChild(pele);  
        pinDiv.style.position = "absolute"; 
        
        if(iscal){
            pinDiv.style.background = "white";
            pinDiv.style.color = "blue";
            pinDiv.style.marginTop="0px";
            let closeDiv = document.createElement("div");
            closeDiv.style.cssFloat = "right"; 
            closeDiv.style.color = "blue";
            closeDiv.style.cursor = "hand";
            closeDiv.innerHTML = "X"; 
            closeDiv.style.marginTop="-38px";
            let domElement = this.sandbox.domElement;  
            let map = this;
            closeDiv.onclick  = function(){
                domElement.iscancel = false;
                map.removeMarker("dis");
                map.closepopup();
            }
            pinDiv.appendChild(closeDiv);  
            //let domElement = this.sandbox.domElement;  
            //let closediv ="<div style='float:right' onclick=function(){}>X</div>"
        } 
        document.body.appendChild(pinDiv);
        this.popupdiv = pinDiv;
        let mappopup = this;
        mappopup.updatePosition(position,height)
        this.sandbox.on('cameraChange', function(){mappopup.updatePosition(position,height)})
    }
    private updatePosition(position:altizure.LngLatAlt,height:number) {
        // transforms from earth-space position {lng, lat, alt} to screen-space {x, y}
        let screenPosition = this.sandbox.window.fromLngLatAlt(position)
        if (screenPosition && this.popupdiv) {
            this.popupdiv.style.left = screenPosition.x  + 'px'
            this.popupdiv.style.top = (screenPosition.y - height) + 'px'
        }
    }
    public closepopup(){
        if(this.popupdiv == null){
            //console.log("没有气泡框可以删除");
            return;
        }
        document.body.removeChild(this.popupdiv);
        this.popupdiv = null;
        this.sandbox.off('cameraChange', function(){});
    }
     /**
     * 气泡
     * @param position 气泡位置
     *  @html 气泡内容
     */
    public frame( video:string,audio:string,img:string,html:string,width:number,height:number ){
        if(this.framediv){
            this.closeframe();
        }
        let framediv = <HTMLElement>document.createElement("div");
        framediv.style.width = width+"px";
        framediv.style.height = height+ "px"; 
        framediv.classList.add("frame");
        if(video!=""&& video != undefined){
            let videoele = document.createElement("video");
            videoele.src= video ;
            videoele.autoplay = true;
            videoele.style.width = "100%";
            framediv.appendChild(videoele);
        }

        if(audio!=""&& audio != undefined){
            let audioele = document.createElement("audio");
            audioele.src= audio ; 
            audioele.style.width = "100%";
            framediv.appendChild(audioele); 
        }

        if(img!=""&& img != undefined){
            let imgele = document.createElement("img");
            imgele.src= img ; 
            imgele.style.width = "100%";
            framediv.appendChild(imgele);  
        }
        let pele = document.createElement("p");
        pele.innerHTML = ("nbspnbsp"+html); 
        framediv.appendChild(pele);  
        document.body.appendChild(framediv);
        this.framediv = framediv; 
    } 
    public closeframe(){
        if(this.framediv == null){
            //console.log("没有气泡框可以删除");
            return;
        }
        document.body.removeChild(this.framediv);
        this.framediv = null; 
    }

    public calculateDistance(){ 
        let map = this;
        let domElement = this.sandbox.domElement; 
        domElement.map = this; 
        domElement.iscancel = false;
        domElement.dispoints = new Array<altizure.LngLatAlt>(); 
        domElement.addEventListener('mousedown', this.handler, false)
    }
    public disablecalculateDistance(){
        this.removeMarker("dis");
        this.closepopup();
        let map = this;
        
        let domElement = this.sandbox.domElement;
        domElement.map = this; 
        //domElement.addEventListener('mousedown', function(){}, false)
        domElement.removeEventListener("mousedown", this.handler,false);
    }
    public handler (event:any) {
        let map = this.map;
        let dispoints = this.dispoints;
       /*  if(dispoints.length==0){
            map.removeMarker("dis");
            map.closepopup();
        } */
        if(this.iscancel)
        {
            return;
        }
        if (event.button === 0) { // left button
            let pt = map.sandbox.pickOnProjects(event)
            if (!pt) {
                console.log("请点击到场景上");
                return
              }else{
                dispoints.push(pt);
                //划线
                if(dispoints.length>1){
                    let pts2  = Array<altizure.LngLatAlt>(); 
                    pts2.push(dispoints[dispoints.length-2]);
                    pts2.push(dispoints[dispoints.length-1]);
                    let pl2 = new altizure.PolyCylinderLineMarker({
                        name: 'dis',
                        sandbox: map.sandbox,
                        points: pts2,
                        color: 0xb73026,  
                        lineWidth:2
                      })
                }
              }
        }else if(event.button == 2) {
            let pt = map.sandbox.pickOnProjects(event)
            if (!pt) {
                console.log("请点击到场景上");
                return
              }else{
                dispoints.push(pt);
                //划线
                if(dispoints.length>1){
                    let pts2  = Array<altizure.LngLatAlt>(); 
                    pts2.push(dispoints[dispoints.length-2]);
                    pts2.push(dispoints[dispoints.length-1]);
                    let pl2 = new altizure.PolyCylinderLineMarker({
                        name: 'dis',
                        sandbox: map.sandbox,
                        points: pts2,
                        color: 0xb73026,  
                        lineWidth:2
                      })
                      let alldis = 0;
                      for(let i = 0 ; i < dispoints.length - 1; i ++){
                        alldis +=Math.abs(map.sandbox.calculateDistanceBetweenTwoPoints( dispoints[i+1],dispoints[i]));
                      };
                      map.popup(dispoints[dispoints.length-1],150,20,"全长："+Math.round(alldis)+"米","","","",true);
                      dispoints.splice(0,dispoints.length);
                      this.iscancel = true;
                }
              }
        }
      }
}

