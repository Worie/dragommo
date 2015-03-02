
	player = new player({x: 500,y:500},'mona',socket,view);

function onMouseMove(event){
	mousePosition = event.point;
   	var degree = Math.round(Math.atan2(event.point.x-player.raster.position.x,event.point.y-player.raster.position.y) * 180/Math.PI);
   	player.raster.setRotation(-degree)
   	socket.emit('sight',{rotation:-degree});
   	mousePosition = event.point - view.center ;
   	crossHair = event.point;
}

function onFrame(event) {

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
                
            }else{
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
    
    		var path = new Path();
    
     
		    path.strokeColor = 'red';
		    var start = player.raster.position;
		    // Move to start and draw a line from there
		    path.moveTo(start);
		    path.strokeWidth = 3;
		    // Note the plus operator on Point objects.
		    // PaperScript does that for us, and much more!
		    path.lineTo(start + {x: 0, y: 20});
		    path.setRotation(player.raster.rotation);
		    //path.destination = new Point(0,1) * view.size;
		    var d = (crossHair - player.raster.position);
		    
		    if(Math.abs(d.x) > Math.abs(d.y)){
		      d/=Math.abs(d.x);
		    }else{
		      d/=Math.abs(d.y);
		    }
		    //path.destination = {x: Math.round(d.x),y:Math.round(d.y)};
		    d*=1000;
		    path.destination = d;
		    path.key  = 'own';

		    bullets[bullets.length] = path;
		    
		    socket.emit('bullet',{x: d.x,y:d.y});
		    next=false;
    	}

	}

} // onFrame(){}

 