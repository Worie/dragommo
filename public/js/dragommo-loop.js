
// consider onload somehow things below

player = new player({x: 500,y:500},'mona',socket,view);

onMouseMove = function onMouseMove(event){
     // console.log(view.bounds.x+":"+view.bounds.x+"\n"+player.raster.position.x+":"+player.raster.position.y+"\n\n")
  	mousePosition = event.point;
   	var degree = Math.round(Math.atan2(event.point.x-Math.round(player.raster.position.x),event.point.y-Math.round(player.raster.position.y)) * 180/Math.PI);
   	player.setRotation(-degree)
   	socket.emit('sight',{rotation:-degree});
   	mousePosition = event.point - view.center ;
   	crossHair = event.point;
}

onFrame = function onFrame(event) {



	for(var i =0;i<bullets.length;i++){
        var tmp  = new Point([ bullets[i].destination.x/60, bullets[i].destination.y/60])
        bullets[i].position+=tmp;

       if(bullets[i].position.y>1000 || bullets[i].position.x>1000 || bullets[i].position.y<0 || bullets[i].position.x<0 ){
            bullets[i].remove();
            bullets.splice(i, 1);
        }else{
            var col = bulletCollision(bullets[i].position,bullets[i].key);
            if(col!=false){
            	if(col==player.id){
           
                player.dmg();
                
              }else if(col!=true){
            	 clients[col].dmg();
              }

            	bullets[i].remove();
                bullets.splice(i, 1);
        	}
        }


    } 

    
	player.move();

   if(Key.isDown('space')){
        if(next == true ){
    		
    		shotBullet(crossHair,0,player.raster);
    		//shotBullet(crossHair,20,player.raster);

		    next=false;
    	}

	}

} // onFrame(){}




 