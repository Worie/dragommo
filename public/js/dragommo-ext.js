// Changes the position of background to have logically correct value with the view

shotBullet = function(dir){

}

bulletCollision = function (a,k){
    for (var key in clients) {
        var p = clients[key].raster.position;
        if((k != key )&& p.x-20<=a.x && p.x+20 >=a.x &&
            p.y-20<=a.y && p.y+20 >=a.y){
            return key;
        }
    }

    if((k != 'own' )&& player.raster.position.x-20<=a.x && player.raster.position.x+20 >=a.x &&
            player.raster.position.y-20<=a.y && player.raster.position.y+20 >=a.y){
            return player.id;
    }
    return false;
}

collisionPlayers = function (a,key){
    

    // When key D is pressed (right)
    if(key=='d'){
        // Iterate trough all clients
        // Todo: only visible ? 
        for (var key in clients) {
        var p = clients[key].raster.position;
            if(a.x+20+step >= p.x && a.x+20+step <= p.x 
                && (a.y + 20 <= p.y+40 && a.y + 20 >= p.y-10))
                return false;
        
        }
    }else if(key=='a'){
       for (var key in clients) {
        var p = clients[key].raster.position;
            if(a.x-20+step >= p.x && a.x-20+step <= p.x +10
                && (a.y +20 <= p.y+40 && a.y +20 >= p.y-10))
                return false;
        
        }
    }else if(key=='w'){
        for (var key in clients) {
        var p = clients[key].raster.position;
            if(a.y-step-10 >= p.y && a.y-step-10 <= p.y +10
                && (a.x  <= p.x+30 && a.x >= p.x-30))
                return false;
        
        }
    }else if(key=='s'){
        for (var key in clients) {
            var p = clients[key].raster.position;
            if(a.y+20+step >= p.y && a.y+20+step <= p.y+20 
                && (a.x <= p.x+30 && a.x  >= p.x-30))
                return false;
        
        }

    }

    //*/

    
    return true;

}



moveFriend = function (data){
    var p = clients[data.id].raster.position;
    if(data.left == true) {
        p.x -= step;   
     }

    if(data.right == true) {
        p.x += step;
    }

    if(data.up == true) {
        p.y -= step;
    }

    if(data.down == true) {
        p.y += step;
    }
        p.y = Math.round(Number(p.y));
        p.x = Math.round(Number(p.x));
    //    coords[data.id].position = {x:clients[data.id].position.x, y:clients[data.id].position.y-30};
   //     coords[data.id].content = clients[data.id].position.x + ":" + clients[data.id].position.y;

};
    


client = function (id,position,avatar){

    this.raster = new Raster(avatar);
    this.raster.position = position;
    this.raster.scale(0.2);
    this.id = id;

    this.dmg = function(){

        that =this.raster;
        this.raster.setImage(document.getElementById('dmg'));
        var t = setTimeout(function(){
            that.setImage(document.getElementById('oman'));
        },100);

        socket.emit('dmg',{id: this.id})
    }

    this.death = function(){
        console.log("LOL U DIED");
    };
    

    this.place = function(p){
        //
        this.raster.position = p;

    };

    this.move = function(d){

        if(d.left == true) {
            this.raster.position.x -= step;   
         }

        if(d.right == true) {
            this.raster.position.x += step;
        }

        if(d.up == true) {
            this.raster.position.y -= step;
        }

        if(d.down == true) {
            this.raster.position.y += step;
        }
        this.raster.position.y = Math.round(Number(this.raster.position.y));
        this.raster.position.x = Math.round(Number(this.raster.position.x));
        //coords[data.id].position = {x:clients[data.id].position.x, y:clients[data.id].position.y-30};
        //coords[data.id].content = clients[data.id].position.x + ":" + clients[data.id].position.y;

    };



}






 player = function(position,avatar,socket,v){
    this.raster = new Raster(avatar);
    this.raster.position = position;
    //this.id = null;
    //this.raster.setImage(avatar);
    this.raster.scale(0.2);
    this.socket = socket;
    this.view = v;
    

    

    this.dmg = function(){
        //var tmp = this.raster;
        that =this.raster;
        this.raster.setImage(document.getElementById('dmg'));
        var t = setTimeout(function(){
            that.setImage(document.getElementById('mona'));
        },100);

        
    }

    

    this.death = function(){
        console.log('lol u died');
    };
    this.setBackground = function(p){
        var x = p.x;
        var y = p.y;

        var canvas = $("#canvas");
        var pos=canvas.css('background-position').split(" ");
    
        pos[0]=parseFloat(pos[0]);
        pos[1]=parseFloat(pos[1]);


       if(pos[0]>-500 && pos[0]<=0)
            pos[0]=x;
       if(pos[1]>-500 && pos[1]<=0)
            pos[1]=y;
        canvas.css('background-position',Math.round(Number(pos[0]))+'px '+Math.round(Number(pos[1]))+'px');


    };

    this.moveBackground = function(x,y){

        var canvas = $("#canvas");
        var pos=canvas.css('background-position').split(" ");
    
        pos[0]=parseFloat(pos[0]);
        pos[1]=parseFloat(pos[1]);


       if(pos[0]+x>-500 && pos[0]+x<=0)
            pos[0]+=x;
       if(pos[1]+y>-500 && pos[1]+y<=0)
            pos[1]+=y;
        canvas.css('background-position',Math.round(Number(pos[0]))+'px '+Math.round(Number(pos[1]))+'px');
    
    

    };
    this.place = function(p){
        this.raster.position = p;
        if(p.x<250 )
            p.x=0;
        if(p.y<250)
            p.y=0;
        if(p.x>750);
            p.x=-495;
        if(p.y>750)
            p.y=-495;

        this.setBackground(p);
    }
    this.move = function(){

        var p = this.raster.position;
    
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

                // If player isnt moving inside of one of the corners, scroll the background and view
                if(p.x>250 && p.x<=750){
                    this.view.scrollBy({x:-step,y:0});
                    this.moveBackground(step,0);
                }
                

                // Update player position
                p.x -= step;   

                // Emit the direction of movement
                this.socket.emit('move',{left: true});
            }
            
         }

        // "D" button pressed ("RIGHT")
        if(Key.isDown('d') && p.x<980) {
            keyPressed = true;
            if(collisionPlayers(p,'d')){
            
                    if(p.x>=250 && p.x<750){
                    this.view.scrollBy({x:step,y:0});
                    this.moveBackground(-step,0); 
                }
                
                p.x += step;

                this.socket.emit('move',{right:true});  
            }

        }

        // "W" button pressed ("UP")
        if(Key.isDown('w') &&  p.y>20) {
            keyPressed = true;
           if(collisionPlayers(p,'w')){

               if(p.y>250 && p.y<750){
                    this.view.scrollBy({x:0,y:-step});
                    this.moveBackground(0,step);
                }
                p.y -= step;

                this.socket.emit('move',{up: true});
            }

        }

        // "S" button pressed ("DOWN")
        if(Key.isDown('s') && p.y<980) {
            keyPressed = true;
            if(collisionPlayers(p,'s')){

                if(p.y>250 && p.y<750){
                    this.view.scrollBy({x:0,y:step});
                    this.moveBackground(0,-step);
                }
                
                p.y += step;

                this.socket.emit('move',{down: true});
            }

        }
        // Very important.
        p.x = Math.round(Number(p.x));
        p.y = Math.round(Number(p.y));

        if(p.x>250 && p.x < 750 & p.y>250 && p.y<750){
            this.view.center = p;
            //text.fillColor = "white";
        }else{
            //text.fillColor = "red";
        }
        
       
      //  text.position = {x:raster.position.x, y:raster.position.y-30};
      //  text.content = raster.position.x + ":" + raster.position.y
        if(keyPressed==true){
            crossHair = this.view.center+mousePosition;

            var degree = Math.round(Math.atan2(crossHair.x-p.x,crossHair.y-p.y) * 180/Math.PI);
            this.raster.setRotation(-degree);
            this.socket.emit('sight',{rotation:-degree});
        }

        }



        this.view.scrollBy({x:250,y:250});
    this.setBackground({x:-250,y:-250})
 }


