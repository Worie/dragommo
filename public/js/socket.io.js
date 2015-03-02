

socket= io.connect('127.0.0.1',{'force new connection':true});



socket.on('sight',function(data){

   clients[data.id].raster.setRotation(data.rotation);
})

socket.on('bullet',function(data){


    
    var path = new Path();
     
    path.strokeColor = 'red';
    var start = clients[data.id].raster.position;
    // Move to start and draw a line from there
    path.moveTo(start);
    path.strokeWidth = 3;
    // Note the plus operator on Point objects.
    // PaperScript does that for us, and much more!
    path.lineTo(start + {x: 0, y: 20});
    path.setRotation(clients[data.id].raster.rotation);
 
    path.destination = {x: Number(data.x),y:Number(data.y)}
    //path.position = path.destination/40;
    //console.log(path.destination)
    path.key = data.id;
    bullets[bullets.length] = path;
    

})

socket.on('hi',function(data){
        clients[data.id]= new client(data.id,{x: data.position.x,y:data.position.y},'oman');
});

socket.on('death',function(data){
    console.log(data.id+":"+player.id)
    if(data.id==player.id){
        player.death();
    }else{
        clients[data.id].death();
    }
});

socket.on('you',function(data){
    player.id= data.id;
});

socket.on('logout',function(data){
    clients[data.id].raster.remove();
});

socket.on('new',function(data){
    socket.emit('hi',{position: {x: player.raster.position.x,y:player.raster.position.y},to: data.id});
    clients[data.id]= new client(data.id,new Point([500,500]),'oman');
});

socket.on('move',function(data){
    moveFriend(data);
});

socket.on('dmg',function(){
        player.dmg();
});

