

socket= io.connect('127.0.0.1',{'force new connection':true});

socket.on('dmg',function(){
    takeBullet('you');
})

socket.on('sight',function(data){

    clients[data.id].setRotation(data.rotation);
})

socket.on('bullet',function(data){
    
    var path = new Path();
     
    path.strokeColor = 'red';
    var start = clients[data.id].position;
    // Move to start and draw a line from there
    path.moveTo(start);
    path.strokeWidth = 3;
    // Note the plus operator on Point objects.
    // PaperScript does that for us, and much more!
    path.lineTo(start + {x: 0, y: 20});
    path.setRotation(clients[data.id].rotation);
 
    path.destination = {x: Number(data.x),y:Number(data.y)}
    //path.position = path.destination/40;
    //console.log(path.destination)
    path.key = data.id;
    bullets[bullets.length] = path;

})

socket.on('hi',function(data){
        clients[data.id]= new Raster('oman');
        clients[data.id].position.x = data.position.x;
        clients[data.id].position.y = data.position.y;
        //console.log(data.position);
        clients[data.id].scale(0.2);
        coords[data.id] = new PointText({  point: view.center,
            justification: 'center',
            fontSize: 14,
            fillColor: 'white'
        });
      //  console.log('Cześć '+data.id+"!")
      clients[data.id].sendToBack();

});

socket.on('death',function(data){
    console.log(data.id+":"+raster.key)
    if(data.id==raster.key){
        //death
        raster.position.x = 0;
        raster.position.y = 0;
    }else{
    
        clients[data.id].position.x = 0;
        clients[data.id].position.y = 0;
    }

});
socket.on('you',function(data){
    raster.key = data.id;
});
socket.on('logout',function(data){
    clients[data.id].remove();
    coords[data.id].remove();
   // console.log('bye bye '+data.id);
});
socket.on('new',function(data){
   // console.log(raster.position);
    socket.emit('hi',{position: {x: raster.position.x,y:raster.position.y},to: data.id});
    
    clients[data.id]= new Raster('oman');
    

    if(typeof data.position !== undefined ){
        clients[data.id].position = new Point([500,500]);

    }else {
        clients[data.id].position = data.position;
    }

    clients[data.id].scale(0.2);
    coords[data.id] = new PointText({  point: view.center,
            justification: 'center',
            fontSize: 14,
            fillColor: 'white'
        });
    console.log('Dzieki serwer! Widze nowego!' +data.id);
    clients[data.id].sendToBack();

});
socket.on('move',function(data){

    moveFriend(data);
});

