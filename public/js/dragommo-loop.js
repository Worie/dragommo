
// consider onload somehow things below

    
ready = false;

onMouseMove = function onMouseMove(event){

if(!ready)
  return;
     // console.log(view.bounds.x+":"+view.bounds.x+"\n"+player.raster.position.x+":"+player.raster.position.y+"\n\n")
  	mousePosition = event.point;
   	var degree = Math.round(Math.atan2(event.point.x-Math.round(player.raster.position.x),event.point.y-Math.round(player.raster.position.y)) * 180/Math.PI);
   	player.setRotation(-degree)
   	socket.emit('sight',{rotation:-degree});
   	mousePosition = event.point - view.center ;
   	crossHair = event.point;
}

onMouseDown = function onMouseDown(){
  // dirty

  //intervals, gosh
  if(next == true ){
        
        shotBullet(crossHair,0,player.raster);
        //shotBullet(crossHair,20,player.raster);

        next=false;
      }
};
onFrame = function onFrame(event) {

if(!ready)
  return;

	

// consider removing clients bullet collision (dangerous to be honest)
    
	player.move();

   if(Key.isDown('space')){
        if(next == true ){
    		
    		shotBullet(crossHair,0,player.raster);
    		//shotBullet(crossHair,20,player.raster);

		    next=false;
    	}

	}


} // onFrame(){}




 