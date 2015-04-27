raster  = new Raster('background');
raster.scale(3.2);
raster.position = new Point([0,0]);
raster.sendToBack();


// A lot of improvements in front of me
shotBullet = function(ch,mod,raster){
    //if(data.deg == true){


            var data = new Point([ch.x,ch.y]);
            
    /*        var path = new Path();
    
     
            path.strokeColor = 'red';
            var start = player.raster.position;

            path.moveTo(start);
            path.strokeWidth = 5;

            path.lineTo(start + {x: 0, y: 10});
            */


            var path = new Raster('ki_blast');
            path.position = player.raster.position;
            path.scale(1);
          //  path.insertBelow(player.raster);
            //what the
            var sign = 1;
            if(raster.rotation<0){
                var sign = -1;
            }

            path.setRotation((Math.abs(raster.rotation)+mod)*sign);
            //c/onsole.log(path.rotation);
            //path.destination = new Point(0,1) * view.size;
            //data.y-=mod*5;
            var d = (data - raster.position);
            
            if(Math.abs(d.x) > Math.abs(d.y)){
              d/=Math.abs(d.x);
            }else{
              d/=Math.abs(d.y);
            }
            
            //path.destination = {x: Math.round(d.x),y:Math.round(d.y)};
            d*=totalSize;
            //d.y -= mod;
            path.destination = d;
            path.key  = 'own';
            path.vector = {x:d.x/(totalSize/20),y:d.y/(totalSize/20)};
            //bullets[bullets.length] = path;
            
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
    
                  // consider
            socket.emit('bullet',{x: d.x,y:d.y});

    //}else{

    //}
}

bulletCollision = function (a){
    // Change to isClose of paperScript
    var k = a.key;
    var b=a;
    a = a.position;
    for (var key in clients) {
        var p = clients[key].raster.position;
        if((k != key ) && a.isClose(p,20)){
            return key;
        }
    }

    for(var i =0,l=objects.length;i<l;i++){
        if(objects[i].contains(a) || a.isClose(objects[i],b.width/2)){
            //b.vector = {x: -b.vector.x,y:-b.vector.y}; 
            // bounce to improve
            return true;
        }
    }

   var p = player.raster.position;
    if((k != 'own' )&& a.isClose(p,20)){
            return true;
    }


    return false;
}

collisionPlayers = function (a,key){
    var b,step = player.movementSpeed;
    
    if(key=='d'){
        b = (a+{x:step,y:0});
    }else if(key=='a'){
        b = (a+{x:-step,y:0});
    }else if(key=='w'){
        b = (a+{x:0,y:-step});      
    }else if(key=='s'){
        b = (a+{x:0,y:step});
    }

    var t = player.size/2;
    for (var key in clients) {
        var p = clients[key].raster.position;
            if(b.isClose(p,t) && !a.isClose(p,t))
                return false;
        }
     
     for(var i =0,l=objects.length;i<l;i++){

        if(objects[i].Type=='surrounding'){
            if(objects[i].contains(b)){
                console.log('a')
                return false;
            }
        }
    }


    for (var key in bonuses) {
        var p = bonuses[key].raster.position;
            if(b.isClose(p,t) && !a.isClose(p,t)){
                socket.emit('bonus',{key: key});
                bonuses[key].delete();
            }
        }

    return true;

}



client = function (id,position,avatar,name){

    this.raster = new Raster(avatar);
    this.raster.position = position;
    this.raster.scale(0.2);
    this.id = id;
    this.movementSpeed = 5;
    this.avatar = avatar;


     var textField =  new PointText(this.raster.position-{x:0,y:25});
    textField.justification = 'center';
    console.log(name);
    textField.content = ((name =="") ? id:name);
    textField.fillColor = "red";
    this.nickname = textField;

    this.group = new Group(this.raster,this.nickname);
    // Removes client from board
    this.remove = function(){
        // Removes paper.js Raster
        this.raster.remove();
        this.nickname.remove();
        // Completly remove this element
        delete clients[this.id];
    }
    
    // Simulates damage taking
    this.dmg = function(){
        that =this.raster;
        that.avatar = this.avatar;
        // Set the "red" icon
        this.raster.setImage(document.getElementById('dmg'));

        // Set normal icon after 100ms
        setTimeout(function(){
            that.setImage(document.getElementById(that.avatar));
        },15);

        // Emit damage taking to the server
        socket.emit('dmg',{id: this.id})
    }

    this.death = function(a){
        this.place(a);
    };
    

    this.place = function(p){
        //
        this.group.position.x = p.x;
        this.group.position.y = p.y;
    };

    this.move = function(d){

        if(d.left == true) {
            this.group.position.x -= this.movementSpeed;   
         }

        if(d.right == true) {
            this.group.position.x += this.movementSpeed;
        }

        if(d.up == true) {
            this.group.position.y -= this.movementSpeed;
        }

        if(d.down == true) {
            this.group.position.y += this.movementSpeed;
        }
        this.raster.position.y = Math.round(Number(this.raster.position.y));
        this.raster.position.x = Math.round(Number(this.raster.position.x));
        //coords[data.id].position = {x:clients[data.id].position.x, y:clients[data.id].position.y-30};
        //coords[data.id].content = clients[data.id].position.x + ":" + clients[data.id].position.y;

    };

    this.bonus = function(type,value){
        if(type=='bonus'){
            if(value=='speed'){
                this.movementSpeed = 7;
            }

        }
        
      }

    this.bonusEnd = function(type,value){
        if(value=='speed'){
            this.movementSpeed = 5;
        }
    }


}



layer = new Path.Rectangle(new Point([0,0]),new Size(1100,1100));
layer.fillColor = 'red';
layer.opacity = 0.5;
layer.bringToFront();
layer.visible=false;

 Player = function(position,avatar,socket,v,maxLife){
    maxLife = 30; // comment out later
    this.maxLife = maxLife;
    this.life = this.maxLife;

    this.raster = new Raster(avatar);
    this.raster.position = position;
    this.avatar = avatar;
    this.raster.scale(0.2);

    this.size = this.raster.bounds.width;
    this.socket = socket;
    this.view = v;
    this.movementSpeed = 5;
    this.activeWeapon = null;
    this.weapon = new Raster();
    this.weapon.scale(0.2);
    this.weapon.position=this.raster.position+{x:-10,y:0};    
    this.group = new Group(this.raster,this.weapon)

    this.weapons = {};
    this.updateLifeBar = function(){
        $('#hpBar').css('width',this.life/(maxLife-1)*100+'%');
    }
    this.setWeapon = function(obj){
        this.weapons[obj.name] = obj;
    }
    this.activateWeapon = function(a){
        this.activeWeapon = this.weapons[a];
        intervals.time(this.activeWeapon.fireRate);
    }
    this.setRotation = function(a){
        this.weapon.setRotation(a);
        this.raster.setRotation(a);
    }
    
    this.dmg = function(){
        this.life--;
        this.updateLifeBar();
        //var tmp = this.raster;
        that =this.raster;
        that.avatar = this.avatar;
        layer.visible = true;
        //this.raster.setImage(document.getElementById('dmg'));
        //$("#ui").addClass('damage');
        //c/onsole.log(that.avatar);
        var t = setTimeout(function(){
            //$("#ui").removeClass('damage');
            layer.visible = false;
            //c/onsole.log(that.avatar)
        },15);

        
    }

    

    this.death = function(a){
        this.place(a);
        this.life = this.maxLife;
        this.updateLifeBar('max');
    };
  
    this.place = function(p){
        p.x = Number(p.x);
        p.y = Number(p.y);
        this.raster.position = p;
        this.weapon.position = p;

        this.socket.emit('place',{id: this.id, x: p.x , y: p.y});


        var vx,vy;
        vx = p.x - this.view.center.x;
            vy = p.y - this.view.center.y;
        if(p.x<boardSize/2 ){
            vx=boardSize/2-this.view.center.x;
            
        }else if(p.x>totalSize-(boardSize/2)){

            vx=totalSize-(boardSize/2) - this.view.center.x;

        }

        if(p.y<boardSize/2){
            vy=boardSize/2-this.view.center.y;
        }else if(p.y>totalSize-(boardSize/2)){
            vy=totalSize-(boardSize/2) - this.view.center.y;

        }
       
        var t = new Point([vx,vy]);
        this.view.scrollBy(t);


    }
    this.move = function(){

        var p = this.group.position;
        var step = this.movementSpeed;
        // Nessesary parses
        p.x = Math.round(Number(p.x));
        p.y = Math.round(Number(p.y));

        //c/onsole.log(globalToLocal(p));
        // Variable to store info about if any key was pressed
        var keyPressed = false;
        
        // "A" button pressed ("LEFT")
        // the second condition are the corners of map
        // Todo: variable based second condition
        //console.log(raster)
        if(Key.isDown('a') &&  p.x>noname) { //
            keyPressed = true;

            // Looks for collision when moved to right ('a' button)
           if(collisionPlayers(p,'a')){

                // If player isnt moving inside of one of the corners, scroll the background and view
                // p.x>width/2 && p.x<=total-size-width/2
                //if(p.x>boardSize/2 && p.x<=totalSize-(boardSize/2)){


                if(p.x>(boardSize/2) && p.x<totalSize-(boardSize/2) && this.view.center.x>(boardSize/2) ){ 
                    this.view.scrollBy({x:-step,y:0});
                    //this.moveBackground(step,0);
                }
                

                console.log(this.view.center.x)
                // Update player position
                p.x -= step;   

                // Emit the direction of movement
                this.socket.emit('move',{left: true});
            }
            
         }

        // "D" button pressed ("RIGHT")
        if(Key.isDown('d') && p.x<totalSize-noname) {
            keyPressed = true;
            if(collisionPlayers(p,'d')){
                
                    if(p.x>(boardSize/2) && p.x<totalSize-(boardSize/2) && this.view.center.x<totalSize-(boardSize/2) ){
                    this.view.scrollBy({x:step,y:0});
                   // this.moveBackground(-step,0); 
                }
                
                p.x += step;

                this.socket.emit('move',{right:true});  
            }

        }

        // "W" button pressed ("UP")
        if(Key.isDown('w') &&  p.y>noname) {
            keyPressed = true;
           if(collisionPlayers(p,'w')){

               if(p.y>(boardSize/2) && p.y<totalSize-(boardSize/2) && this.view.center.y>(boardSize/2) ){
                    this.view.scrollBy({x:0,y:-step});
                  //  this.moveBackground(0,step);
                }
                p.y -= step;

                this.socket.emit('move',{up: true});
            }

        }

        // "S" button pressed ("DOWN")
        if(Key.isDown('s') && p.y<totalSize-noname) {
            keyPressed = true;
            if(collisionPlayers(p,'s')){

                if(p.y>(boardSize/2) && p.y<totalSize-(boardSize/2) && this.view.center.y<totalSize-(boardSize/2) ){
                    this.view.scrollBy({x:0,y:step});
                 //   this.moveBackground(0,-step);
                }
                
                p.y += step;

                this.socket.emit('move',{down: true});
            }

        }
    /*

        // Very important.
        p.x = Math.round(Number(p.x));
        p.y = Math.round(Number(p.y));

        if(p.x>=(boardSize/2) && p.x <= totalSize-(boardSize/2) && p.y>=(boardSize/2) && p.y<=totalSize-(boardSize/2)){
            this.view.center = p;
            //text.fillColor = "white";
        }
     */   
       
      //  text.position = {x:raster.position.x, y:raster.position.y-30};
      //  text.content = raster.position.x + ":" + raster.position.y
      //c/onsole.log(this.raster.position.x + ":" + this.raster.position.y);
        if(keyPressed==true){
            crossHair = this.view.center+mousePosition;

            var degree = Math.round(Math.atan2(crossHair.x-p.x,crossHair.y-p.y) * 180/Math.PI);
            this.raster.setRotation(-degree);
            this.socket.emit('sight',{rotation:-degree});
            //c/onsole.log(this.view.bounds)
        }

        }

        this.shot = function(){

        };
        this.place({x:500,y:500});


      this.bonus = function(type,value){
        if(type=='bonus'){
            if(value=='speed'){
                this.movementSpeed = 7;
            }

        }else if(type=='weapon'){
            this.weapons[value.name] = value;
            this.updateWeapons(value.name);
            this.activateWeapon(value.name);
        }
        
      }

    this.bonusEnd = function(type,value){
        if(value=='speed'){
            this.movementSpeed = 5;
        }
    }

      this.updateWeapons = function(a){
        //
      };
 }


bonus = function(type,name,position){
    if(type=='weapon'){
        name = name.name;

    }
    this.raster = new Raster(name);
    this.raster.position = new Point([position.x,position.y]);
    this.raster.scale(0.2);
    this.Type = type;
    

    this.delete = function(){
        this.raster.remove();
    };




}