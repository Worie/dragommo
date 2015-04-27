

socket= io.connect(location.host,{'force new connection':true});

socket.emit('ready',{nick: nickname});
socket.on('sight',function(data){

   clients[data.id].raster.setRotation(data.rotation);
})


socket.on('birth',function(data){
    player = new Player({x:500,y:500},'mona',socket,view);
    player.setWeapon(data.activeWeapon);
    player.activateWeapon(data.activeWeapon.name); 
    ready = true;
});


socket.on('bonus',function(data){
    
    for(var key in bonuses){
        bonuses[key].delete();
    }

    for(var key in data){
        if(data[key].visible==true)
        bonuses[key] = new bonus(data[key].type,data[key].value,data[key].position);
    } 

});

socket.on('bonusUsage',function(data){
    if(data.id==player.id){
        player.bonus(data.bonus.type,data.bonus.value)
    }else{
        clients[data.id].bonus(data.bonus.type,data.bonus.value);
    }
    bonuses[data.key].delete();
});

socket.on('bonusEnd',function(data){
    if(data.id==player.id){
        player.bonusEnd(data.bonus.type,data.bonus.value)
    }else{
        clients[data.id].bonusEnd(data.bonus.type,data.bonus.value);
    }
});

socket.on('bullet',function(data){


    
    /*var path = new Path();
     
    path.strokeColor = 'red';
    var start = clients[data.id].raster.position;
    // Move to start and draw a line from there
    path.moveTo(start);
    path.strokeWidth = 5;
    // Note the plus operator on Point objects.
    // PaperScript does that for us, and much more!
    path.lineTo(start + {x: 0, y: 10});
    */

    var path = new Raster('enemy_blast');
    path.position = clients[data.id].raster.position;
    path.insertBelow(clients[data.id].raster);



    path.setRotation(clients[data.id].raster.rotation);
 
    path.destination = {x: Number(data.x),y:Number(data.y)}
    //path.position = path.destination/40;
    //c/onsole.log(path.destination)
    path.key = data.id;
    path.vector = {x:path.destination.x/(totalSize/20),y:path.destination.y/(totalSize/20)};
    
    
    
            path.on('frame',function(){
            
            
                this.position+=this.vector;

                if(view.bounds.contains(this.position)){
                    this.visible = true;
                }else{
                    this.visible = false;
                }
                
               if(this.position.y>totalSize ||
                  this.position.x>totalSize || 
                  this.position.y<0 ||
                  this.position.x<0 ){
                    this.remove();
                }else{
                    var col = bulletCollision(this);
                    if(col!=false){
                        if(col==player.id){

                        player.dmg();

                      }else if(col!=true){
                         clients[col].dmg();
                      }

                        this.remove();
                       // bullets.splice(i, 1);
                    }
                }


            });
    
    //bullets[bullets.length] = path;
    

    // VERY IMPORTANT IMPROVE ABOVE VECTOR dEST IS USELSES

})

socket.on('hi',function(data){
        clients[data.id]= new client(data.id,{x: data.position.x,y:data.position.y},'oman',data.nick);
});

socket.on('death',function(data){
    //c/onsole.log(data.id+":"+player.id)
    if(data.id==player.id){
        player.death(data.position);

    }else{
        clients[data.id].death(data.position);
    }
});

socket.on('you',function(data){
    player.id= data.id;
    //player.textField.content = data.id;
});

socket.on('logout',function(data){
    clients[data.id].remove();
});

// When someone new has connected, emit your data to him
socket.on('new',function(data){
    socket.emit('hi',{position: {x: player.raster.position.x,y:player.raster.position.y},to: data.id,nick:nickname});
    clients[data.id]= new client(data.id,new Point([500,500]),'oman',data.nick);
});

socket.on('move',function(data){
    clients[data.id].move(data);
});

socket.on('dmg',function(){
    player.dmg();
});

socket.on('place',function(data){
    if(data.id == player.id){
        player.place(data);
    }else{
     clients[data.id].place(data);   
    }
});

