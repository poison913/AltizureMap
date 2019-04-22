import { Map } from "./Map";
import { Layer } from "../layer/Layer";
import { ParticleEffectsMarker } from "../layer/ParticleEffectsMarker"; 
import { TagMarker } from "../layer/TagMarker"; 
import { TextTagMarker } from "../layer/TextTagMarker";  
import { LightBeamMarker } from "../layer/LightBeamMarker"; 
import { OBJMarker } from "../layer/OBJMarker"; 
import { GeojsonLayer } from "../layer/GeojsonLayer"; 
export class Play { 

  map!: Map;
  layer!: Layer; 
  jsondata:any;
  action:any;
  amark:altizure.AltizureProjectMarker
  step:number;
  ispause:Boolean;//是否暂停
  isend :Boolean;//是否结束
  actionType:string;//当前步骤的类型
  actiondetaileType:string;//当前步骤的具体类型

  constructor(map: Map,json:{},amark:altizure.AltizureProjectMarker) {
    this.jsondata = json;
    this.map = map;
    this.amark = amark;
    this.step = 0;
    this.ispause = false;
    this.isend = false;
    this.actionType ="";
    this.actiondetaileType ="";
    this.action = this.jsondata.Presentations.Presentation.actions.action;
  }

  // 方法
   /**
     * 播放
     * @param map 地图容器
     */
  play( )  {  
    //获取初始定位
    var InitCamera =  this.jsondata.Presentations.Presentation.settings.InitCamera;
    if(InitCamera!= null){
      this.map.Pose(InitCamera);
    }else{
      return "没有初始定位";
    }
    let action = this.jsondata.Presentations.Presentation.actions.action;
   /*  //添加是否完成标识、暂停标识
    for(let i  = 0 ; i <action.length;i++ ){
      action[i].isWorked = false;
      action[i].ispause = false;
    } */
    this.isend = false;
    this.ispause = false;
    this.actions(this.action,this.map,this);
  }
  //开始、继续
  actions(action:any,map:Map,play=this){
    //循环
    if(this.ispause){
      return;
    }
    let i = this.step;
    if(i>=action.length){
      this.isend = true;
      return
    }
    if(action[i]._type=="viewpoint"){//场景变换
      this.actionType = "viewpoint";
      if(action[i].fly.flyMode.toLocaleLowerCase()=="jumpto")//切换
      {
        this.actiondetaileType = "jumpto";
        let pose = {
          lng:parseFloat( action[i].lng),
          lat:parseFloat( action[i].lat),
          alt:parseFloat( action[i].alt),
          north:parseFloat( action[i].north),
          tilt:parseFloat( action[i].tilt)
        }
        map.Pose(pose); 
        this.actiondetaileType = "";
        if(parseFloat(action[i].trigger)>0){ 
          this.step++;
          setTimeout(function(){play.actions(action,map,play)}, action[i].trigger) ;
        }else if(parseFloat(action[i].trigger)==0){
          this.step++;
          play.actions(action,map,play)
        } else { 
          play.step++;
          this.ispause=true;
        }   
      }else if(action[i].fly.flyMode.toLocaleLowerCase()=="flyto"){//飞行
        this.actiondetaileType = "flyto";
        let pose = {
          lng:parseFloat( action[i].lng),
          lat:parseFloat( action[i].lat),
          alt:parseFloat( action[i].alt),
          north:parseFloat( action[i].north),
          tilt:parseFloat( action[i].tilt)
        }
        var turnTimef = parseInt(action[i].fly.turnTime)  ;
        if(turnTimef<0){
          console.log("单点飞行：turnTime要大于0");
          return;
        }
        let Multiple = 1;
        let speed = action[i].fly.speed;
        if(speed =="veryslow"){
            Multiple = 4;
        }else if(speed =="slow"){
            Multiple = 2;
        }else if(speed =="fast"){
            Multiple = 0.5;
        }else if(speed =="veryfast"){
            Multiple = 0.25;
        }else if(speed =="normal"){
          Multiple = 1;
        }else{
            console.log("单点飞行：speed错误");
            return;
        }

        map.flyTo(pose,turnTimef*Multiple).then(function(){ 
          play.step++;
         if(play.map.isflystop == true){
            return;
          } 
          play.actiondetaileType = "";
          if(parseFloat(action[i].trigger)>0){ 
            setTimeout(function(){play.actions(action,map,play)}, action[i].trigger) ;
          }else if(parseFloat(action[i].trigger)==0){ 
            play.actions(action,map,play)
          } else {  
            play.ispause=true;
          }   
        })
      }else if(action[i].fly.flyMode.toLocaleLowerCase()=="lineto"){//平滑
        this.actiondetaileType = "lineto";
        let pose = {
          lng:parseFloat( action[i].lng),
          lat:parseFloat( action[i].lat),
          alt:parseFloat( action[i].alt),
          north:parseFloat( action[i].north),
          tilt:parseFloat( action[i].tilt)
        }
        let turnTimel = parseInt(action[i].fly.turnTime)  ;
        if(turnTimel<0){
          console.log("单点飞行：turnTime要大于0");
          return;
        }
        let  speed = action[i].fly.speed
        map.LineTo(  pose,turnTimel,speed,map).then(function(){ 
          
          play.step++; 
          if(play.map.reduceNum !=0){
            return;
          }
          play.actiondetaileType = "";
          if(parseFloat(action[i].trigger)>0){
            setTimeout(function(){play.actions(action,map,play)}, action[i].trigger) ;
          }else if(parseFloat(action[i].trigger)==0){ 
            play.actions(action,map,play)
          }else {  
            play.ispause=true;
          }   
        });
 
      }else{
        console.log("单点飞行：flyMode错误");
        return;
      }
    }
    else if(action[i]._type=="route"){//多点飞行
      this.actionType = "route";
      //获取点
      let viewpoint = action[i].viewpoint;
      if(viewpoint.length==0){
        console.log("多点飞行：flyMode错误");
        return;
      } 
      let point = Array<altizure.Pose>();
      viewpoint.forEach(element => {
        point.push({
          lng : parseFloat(element.lng),
          lat : parseFloat(element.lat),
          alt : parseFloat(element.alt),
          north : parseFloat(element.north),
          tilt : parseFloat(element.tilt)
        })
      });  
      let turnTimeroute = action[i].fly.turnTime - 0 ;//parseInt(action[i].fly.turnTime)  ;
      if(turnTimeroute<0){
        console.log("多点飞行：turnTime要大于0");
        return;
      }
      let  speed = action[i].fly.speed 
      if(action[i].fly.flyMode.toLocaleLowerCase()=="jumpto")//切换
      {            
        this.actiondetaileType = "jumpto";
        map.MuiltiPose(point,turnTimeroute,speed,map); 
        if(parseFloat(action[i].trigger)>0){ 
          play.actiondetaileType = "";
          play.step++; 
          setTimeout(function(){play.actions(action,map)}, action[i].trigger) ;
        }  else if(parseFloat(action[i].trigger)==0){
          play.step++; 
          play.actions(action,map,play)
        }  else { 
          play.step++;
          play.ispause=true;
        }   
      }else if(action[i].fly.flyMode.toLocaleLowerCase()=="flyto"){//飞行
        this.actiondetaileType = "flyto";
        map.MuiltiFlyto(point,turnTimeroute,speed).then(function(){ 
          play.step++; 
          if(play.map.reduceNum !=0){
            return;
          }
          play.actiondetaileType = "";
          if(parseFloat(action[i].trigger)>0){
            setTimeout(function(){play.actions(action,map,play)}, action[i].trigger) ;
          }else if(parseFloat(action[i].trigger)==0){ 
            play.actions(action,map,play)
          }else {  
            play.ispause=true;
          }   
        });
      }else if(action[i].fly.flyMode.toLocaleLowerCase()=="lineto"){//平滑
        this.actiondetaileType = "lineto";
        map.MuiltiLineTo(point,turnTimeroute,speed).then(function(){ 
          play.step++; 
          if(play.map.reduceNum !=0){
            return;
          }
          play.actiondetaileType = "";
          if(parseFloat(action[i].trigger)>0){
            setTimeout(function(){play.actions(action,map,play)}, action[i].trigger) ;
          }else if(parseFloat(action[i].trigger)==0){ 
            play.actions(action,map,play)
          }else { 
            play.ispause=true;
          }   
        });; 
      }else{
        console.log("多点飞行：flyMode错误");
        return;
      }     
     
    }
    else if(action[i]._type=="circle"){//环绕
      this.actionType = "circle";
      let pose = {
        lng:parseFloat(action[i].circle.lng),
        lat:parseFloat(action[i].circle.lat),
        alt:parseFloat(action[i].circle.alt),
        north:parseFloat(action[i].circle.north),
        tilt:parseFloat(action[i].camera.tilt)
      }
      let startPosition = parseFloat(action[i].fly.startPosition);
      let direction = action[i].fly.direction;
      let angularSpeed = parseFloat(action[i].fly.angularSpeed);
      var turnTimeci = parseFloat(action[i].fly.turnTime);
      map.circleflyTo(action[i].camera.tilt,pose,startPosition,direction,angularSpeed,turnTimeci).then(function(){  
        play.step++;
        if(play.map.reduceNum !=0){
          return;
        }
        play.actionType = "";
        if(parseFloat(action[i].trigger)>0){
          setTimeout(function(){play.actions(action,map,play)}, action[i].trigger) ;
        }else if(parseFloat(action[i].trigger)==0){ 
          play.actions(action,map,play)
        }else {  
          play.ispause=true;
        }   
      });
    }
    else if(action[i]._type=="rotate"){//旋转
      this.actionType = "rotate";
      let pose = {
        lng:parseFloat(action[i].camera.lng),
        lat:parseFloat(action[i].camera.lat),
        alt:parseFloat(action[i].camera.alt),
        north:parseFloat(action[i].camera.north),
        tilt:parseFloat(action[i].camera.tilt)
      } 
      let direction = action[i].fly.direction;
      let angularSpeed = parseFloat(action[i].fly.angularSpeed);
      var turnTimero = parseFloat(action[i].fly.turnTime);
      map.rorateflyTo(pose,direction,angularSpeed,turnTimero).then(function(){  
        play.step++;
        if(play.map.reduceNum !=0){
          return;
        }
        play.actionType = "";
        if(parseFloat(action[i].trigger)>0){
          setTimeout(function(){
            map.removerorate();
            map.Pose(pose);
            play.actions(action,map,play)
          }, action[i].trigger) ;
        }else if(parseFloat(action[i].trigger)==0){ 
            map.removerorate();
            map.Pose(pose);
            play.actions(action,map,play)
        }else {  
          play.ispause=true;
        }   
      })
    }
    else if(action[i]._type=="particle"){//特效
      let position = {
        lng : parseFloat(action[i].position.lng),
        lat : parseFloat(action[i].position.lat),
        alt : parseFloat(action[i].position.alt) 
      }
      let option = {
        position:position,
        sandbox:map.sandbox,
        effect:action[i].effect,
        scale:parseInt( action[i].scale),
        name:action[i].name
      }  
      let particle = new ParticleEffectsMarker(option); 
      if(action[i].trigger>0){
        play.step++;
        setTimeout(function(){
          map.removeMarker(action[i].name);
          play.actions(action,map)}, action[i].trigger) ;
      }  else if(parseFloat(action[i].trigger)==0){
        play.step++;
        map.removeMarker(action[i].name);
        play.actions(action,map,play)
      }  else { 
        play.step++;
        play.ispause=true;
      }   
    }
    else if(action[i]._type=="marker"){//图标
      let option = {
        position:action[i].position,
        sandbox:map.sandbox, 
        scale:parseFloat( action[i].scale),
        name:action[i].name
      }  
      if(action[i].staticType.toLocaleLowerCase()=="imgurl"){//图标
        let option1 = Object.assign({
          imgUrl:action[i].imgUrl
        }, option);  
        let tagMarker = new TagMarker(option1);
      } else if(action[i].staticType.toLocaleLowerCase()=="text"){//文字
        let option1 = Object.assign({
          text:action[i].text,
          textStyle:action[i].textStyle
        }, option);  
        let textTagMarker = new TextTagMarker(option1);
      }else if(action[i].staticType.toLocaleLowerCase()=="lightbeam"){//光标
        let option1 = Object.assign({
          color:action[i].color 
        }, option);  
        let lightbeamMarker = new LightBeamMarker(option1);
      }else if(action[i].staticType.toLocaleLowerCase()=="staticobj"){//模型
        let option1 = Object.assign({
          shape:action[i].shape, 
          objUrl:action[i].objUrl, 
          mtlUrl:action[i].mtlUrl, 
          upDir:action[i].upDir
        }, option);  
        let oBJMarker = new OBJMarker(option1);
      } 
      if(action[i].trigger>0){
        play.step++;
        setTimeout(function(){
          map.removeMarker(action[i].name);
          play.actions(action,map)}, action[i].trigger) ;
      }    else if(parseFloat(action[i].trigger)==0){
        play.step++;
        map.removeMarker(action[i].name);
        play.actions(action,map,play)
      }  else { 
        play.step++;
        play.ispause=true;
      }   
    }
    else if(action[i]._type=="moveObj"){//移动图标
      /* let position = {
        lng:action[i].lng,
        lat:action[i].lat,
        alt:action[i].alt
      }  */
      let position = {
        lng : parseFloat(action[i].lng),
        lat : parseFloat(action[i].lat),
        alt : parseFloat(action[i].alt) 
      }
      let option = {
        position:position,
        sandbox:map.sandbox, 
        scale:parseInt( action[i].scale),
        shape:action[i].shape, 
        objUrl:action[i].objUrl, 
        mtlUrl:action[i].mtlUrl, 
        upDir:action[i].upDir,
        name:action[i].name
      }   
      let obj = new OBJMarker(option);
      if(action[i].isMove.toLocaleLowerCase()=="true"){ 
        let turnTimeobj = parseFloat(action[i].turnTime);
        let  speed = action[i].speed ;  
        obj.move(action[i].points.point,turnTimeobj,speed,this.amark,map.sandbox); 
      } 
      if(action[i].trigger>0){
        play.step++;
        setTimeout(function(){
          map.removeMarker(action[i].name);
          play.actions(action,map)}, action[i].trigger) ;
      }   else if(parseFloat(action[i].trigger)==0){
        play.step++;
        map.removeMarker(action[i].name);
        play.actions(action,map,play)
      }   else { 
        play.step++;
        play.ispause=true;
      }   
    }
    else if(action[i]._type=="layer"){//图层
      let layer ;
      if(action[i].staticType.toLocaleLowerCase()=="geojson"){
        layer = new GeojsonLayer(action[i].url,action[i].crs);
      } 
      if(action[i].trigger>0){
        play.step++; 
        setTimeout(function(){
          layer.remove();
          play.actions(action,map)}, action[i].trigger) ;
      }   else if(parseFloat(action[i].trigger)==0){
        play.step++; 
        layer.remove();
        play.actions(action,map,play)
      }   else { 
        play.step++;
        play.ispause=true;
      }   
    }
    else if(action[i]._type=="balloon"){//气泡
      let point = {
        lng : parseFloat(action[i].lng),
        lat : parseFloat(action[i].lat),
        alt : parseFloat(action[i].alt) 
      }
      map.popup(
        point,parseInt(action[i].width),
        parseInt(action[i].height),
        action[i].htmlPatch.text,
        action[i].htmlPatch.img,
        action[i].htmlPatch.audio,
        action[i].htmlPatch.video
        ) 
      if(action[i].trigger>0){
        play.step++;
        setTimeout(function(){
          map.closepopup();
          play.actions(action,map)}, action[i].trigger) ;
      }   else if(parseFloat(action[i].trigger)==0){
        play.step++;
        map.closepopup();
        play.actions(action,map,play)
      }   else { 
        play.step++;
        play.ispause=true;
      }     
    }else if(action[i]._type=="frame"){//弹框 
      map.frame( 
        action[i].htmlPatch.video,
        action[i].htmlPatch.audio,
        action[i].htmlPatch.img,
        action[i].htmlPatch.text,
        parseInt(action[i].width),
        parseInt(action[i].height)
        ) 
      if(action[i].trigger>0){
        play.step++;
        setTimeout(function(){
          map.closeframe();
          play.actions(action,map)}, action[i].trigger) ;
      }   else if(parseFloat(action[i].trigger)==0){
        play.step++;
        map.closeframe();
        play.actions(action,map,play)
      } else {  
        play.step++;
        this.ispause=true;
      }    
    }
  }
  //暂停
  pause(){
    this.ispause=true;
    if(this.actionType == "viewpoint" && this.actiondetaileType=="flyto"){
      this.map.flystop();
    }else if((this.actionType == "viewpoint" && this.actiondetaileType=="lineto")
    ||(this.actionType == "route" && (this.actiondetaileType=="flyto"||this.actiondetaileType=="lineto"))
    ||(this.actionType == "circle")||(this.actionType == "rotate")
    ){
      this.map.reduceStatue = false;
      }
  }
  //停止
  stop( ){
    this.ispause=true; 
    this.isend = true;
    this.step = 0;
    if(this.actionType == "viewpoint" && this.actiondetaileType=="flyto"){
      this.map.flystop();
    }else if((this.actionType == "viewpoint" && this.actiondetaileType=="lineto")
    ||(this.actionType == "route" && (this.actiondetaileType=="flyto"||this.actiondetaileType=="lineto"))
    ||(this.actionType == "circle")||(this.actionType == "rotate")
    ){
      this.map.reduceStatue = false;
      }
  }
  //继续
  contuinueaction(){
    let play = this;
    let array:Array<object> = new Array<object>();
    this.removeMarker()
    this.ispause=false;
    if(this.actionType == "viewpoint" && this.actiondetaileType=="flyto"){
      array.push(function() {return play.map.continueflyTo()});
    }else 
    if((this.actionType == "viewpoint" && this.actiondetaileType=="lineto")
  ||(this.actionType == "route" && (this.actiondetaileType=="flyto"||this.actiondetaileType=="lineto"))
  ||(this.actionType == "circle")||(this.actionType == "rotate")
  ){
      //array.push(play.map.reduceContinue());//function() {return play.map.reduceContinue()}
      if(play.map.reduceNum>0){ 
        let arr =play.map.reduceContinue();
        arr.forEach(value=>
          array.push(value)
        )   
      }
    }
    array.push(function() {/* play.step++; */ return play.actions(play.action,play.map,play)}); 
    this.reduce(array);
  }
  public reduce(arr:Array<any>) : Promise<void> {
    var sequence = Promise.resolve() 
    arr.forEach(value=>
        sequence = sequence.then(value)
    ) 
    return sequence
}
  getstatue():Boolean{
    return  this.isend ;
  }
  getpausestatue():Boolean{
    return  this.ispause ;
  }

  removeMarker(  )  {
    let marks = this.map.sandbox.markerLayer.children; 
    for(let i=marks.length - 1 ; i>=0 ;i--){
      if("AltizureProjectMarker" != marks[i].name)
        this.map.sandbox.markerLayer.removeChild(marks[i]);
     
  } 
  this.map.closeframe(); 
  this.map.closepopup();
}
}