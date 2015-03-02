
background =function (x,y){
        var canvas = $("#canvas");
        var pos=canvas.css('background-position').split(" ");
        
        pos[0]=parseFloat(pos[0]);
        pos[1]=parseFloat(pos[1]);


       if(pos[0]+x>-500 && pos[0]+x<=0)
            pos[0]+=x;
       if(pos[1]+y>-500 && pos[1]+y<=0)
            pos[1]+=y;
        
       
        
        canvas.css('background-position',Math.round(Number(pos[0]))+'px '+Math.round(Number(pos[1]))+'px');
        
        
    }

bulletCollision = function (a,k){
    for (var key in clients) {
        if((k != key )&&clients[key].position.x-20<=a.x && clients[key].position.x+20 >=a.x &&
            clients[key].position.y-20<=a.y && clients[key].position.y+20 >=a.y){
            return key;
        }
    }

    if((k != 'own' )&& raster.position.x-20<=a.x && raster.position.x+20 >=a.x &&
            raster.position.y-20<=a.y && raster.position.y+20 >=a.y){
            return 'you';
    }
    return false;
}

takeBullet = function (key){
    if(key!='own' && key!='you'){
        clients[key].setImage(document.getElementById('dmg'));
        setTimeout(function(){
            clients[key].setImage(document.getElementById('oman'));
        },100);

        socket.emit('dmg',{id: key})

    }else{
        raster.setImage(document.getElementById('dmg'));
        setTimeout(function(){
            raster.setImage(document.getElementById('mona'));
        },100);
    }

    
}
// Checks for player-player movement collision. Fires every frame
// Todo: rename to movePlayerCollision or something
// Returns true if player can move in that direction, else if it cannot
collisionPlayers = function (a,key){
    
    // When key D is pressed (right)
    if(key=='d'){
        // Iterate trough all clients
        // Todo: only visible ? 
        for (var key in clients) {
            if(a.x+20+step >= clients[key].position.x && a.x+20+step <= clients[key].position.x 
                && (a.y + 20 <= clients[key].position.y+40 && a.y + 20 >= clients[key].position.y-10))
                return false;
        
        }
    }else if(key=='a'){
       for (var key in clients) {
            if(a.x-20+step >= clients[key].position.x && a.x-20+step <= clients[key].position.x +10
                && (a.y +20 <= clients[key].position.y+40 && a.y +20 >= clients[key].position.y-10))
                return false;
        
        }
    }else if(key=='w'){
        for (var key in clients) {
            if(a.y-step-10 >= clients[key].position.y && a.y-step-10 <= clients[key].position.y +10
                && (a.x  <= clients[key].position.x+30 && a.x >= clients[key].position.x-30))
                return false;
        
        }
    }else if(key=='s'){
        for (var key in clients) {
            if(a.y+20+step >= clients[key].position.y && a.y+20+step <= clients[key].position.y+20 
                && (a.x <= clients[key].position.x+30 && a.x  >= clients[key].position.x-30))
                return false;
        
        }

    }

    //*/
    return true;

}

// Moves the player by value
movePlayer = function (raster){
    var p = raster.position;
    
    // Nessesary parses
    p.x = Math.round(Number(p.x));
    p.y = Math.round(Number(p.y));

    // Variable to store info about if any key was pressed
    var keyPressed = false;
    
    // "A" button pressed ("LEFT")
    // the second condition are the corners of map
    // Todo: variable based second condition
    if(Key.isDown('a') && p.x>20) {
        keyPressed = true;

        // Looks for collision when moved to right ('a' button)
        if(collisionPlayers(p,'a')){
            //raster.rotate(-3);

            // If player isnt moving inside of one of the corners, scroll the background and view
            if(p.x>250 && p.x<=750){
                view.scrollBy({x:-step,y:0});
                background(step,0);
            }
            

            // Update player position
            p.x -= step;   

            // Emit the direction of movement
            socket.emit('move',{left: true});
        }
        
     }

    // "D" button pressed ("RIGHT")
    if(Key.isDown('d') && p.x<980) {
        keyPressed = true;
        if(collisionPlayers(p,'d')){
        
        
          //  raster.rotate(3);
            if(p.x>=250 && p.x<750){
                view.scrollBy({x:step,y:0});
                background(-step,0); 
            }
            
            p.x += step;

            socket.emit('move',{right:true});  
        }

    }

    // "W" button pressed ("UP")
    if(Key.isDown('w') &&  p.y>20) {
        keyPressed = true;
       if(collisionPlayers(p,'w')){

           if(p.y>250 && p.y<750){
                view.scrollBy({x:0,y:-step});
                background(0,step);
            }
            p.y -= step;

            socket.emit('move',{up: true});
        }

    }

    // "S" button pressed ("DOWN")
    if(Key.isDown('s') && p.y<980) {
        keyPressed = true;
        if(collisionPlayers(p,'s')){

            if(p.y>250 && p.y<750){
                view.scrollBy({x:0,y:step});
                background(0,-step);
            }
            
            p.y += step;

            socket.emit('move',{down: true});
        }

    }
    // Very important.
    p.x = Math.round(Number(p.x));
    p.y = Math.round(Number(p.y));

    if(p.x>250 && p.x < 750 & p.y>250 && p.y<750){
        view.center = p;
        text.fillColor = "white";
    }else{
        text.fillColor = "red";
    }
    
   
    text.position = {x:raster.position.x, y:raster.position.y-30};
    text.content = raster.position.x + ":" + raster.position.y
    if(keyPressed==true){
        crossHair = view.center+mousePosition;

         var degree = Math.round(Math.atan2(crossHair.x-raster.position.x,crossHair.y-raster.position.y) * 180/Math.PI);
        raster.setRotation(-degree);
        socket.emit('sight',{rotation:-degree});
    }


}
moveFriend = function (data){

    if(data.left == true) {
        clients[data.id].position.x -= step;   
     }

    if(data.right == true) {
        clients[data.id].position.x += step;
    }

    if(data.up == true) {
        clients[data.id].position.y -= step;
    }

    if(data.down == true) {
        clients[data.id].position.y += step;
    }
        clients[data.id].position.y = Math.round(Number(clients[data.id].position.y));
        clients[data.id].position.x = Math.round(Number(clients[data.id].position.x));
        coords[data.id].position = {x:clients[data.id].position.x, y:clients[data.id].position.y-30};
        coords[data.id].content = clients[data.id].position.x + ":" + clients[data.id].position.y;

}
    