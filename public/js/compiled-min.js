step=10;chatInput=false;mousePosition={};crossHair={x:0,y:0};next=false;bullets=Array();clients=[];objects=[];objects[0]=new Path.Rectangle(100,350,200,20);objects[0].fillColor="black";objects[1]=new Path.Rectangle(285,150,15,200);objects[1].fillColor="black";objects[2]=new Path.Rectangle(650,350,200,20);objects[2].fillColor="black";objects[3]=new Path.Rectangle(650,150,15,200);objects[3].fillColor="black";objects[4]=new Path.Rectangle(100,650,200,20);objects[4].fillColor="black";
objects[5]=new Path.Rectangle(285,650,15,200);objects[5].fillColor="black";objects[6]=new Path.Rectangle(650,650,200,20);objects[6].fillColor="black";objects[7]=new Path.Rectangle(650,650,15,200);objects[7].fillColor="black";
shotBullet=function(ch,mod,raster){var data=new Point([ch.x,ch.y]);var path=new Path;path.strokeColor="red";var start=player.raster.position;path.moveTo(start);path.strokeWidth=5;path.lineTo(start+{x:0,y:10});var sign=1;if(raster.rotation<0)var sign=-1;path.setRotation((Math.abs(raster.rotation)+mod)*sign);var d=data-raster.position;if(Math.abs(d.x)>Math.abs(d.y))d/=Math.abs(d.x);else d/=Math.abs(d.y);d*=1E3;path.destination=d;path.key="own";bullets[bullets.length]=path;socket.emit("bullet",{x:d.x,
y:d.y})};bulletCollision=function(a,k){for(var key in clients){var p=clients[key].raster.position;if(k!=key&&a.isClose(p,20))return key}for(var i=0,l=objects.length;i<l;i++)if(objects[i].contains(a))return true;var p=player.raster.position;if(k!="own"&&a.isClose(p,20))return player.id;return false};
collisionPlayers=function(a,key){var b,step=player.movementSpeed;if(key=="d")b=a+{x:step,y:0};else if(key=="a")b=a+{x:-step,y:0};else if(key=="w")b=a+{x:0,y:-step};else if(key=="s")b=a+{x:0,y:step};var t=player.size/2;for(var key in clients){var p=clients[key].raster.position;if(b.isClose(p,t)&&!a.isClose(p,t))return false}for(var i=0,l=objects.length;i<l;i++)if(objects[i].contains(b))return false;return true};
client=function(id,position,avatar){this.raster=new Raster(avatar);this.raster.position=position;this.raster.scale(.2);this.id=id;this.movementSpeed=5;this.avatar=avatar;var textField=new PointText(this.raster.position-{x:0,y:25});textField.justification="center";textField.content=this.id;textField.fillColor="red";this.nickname=textField;this.group=new Group(this.raster,this.nickname);this.remove=function(){this.raster.remove();this.nickname.remove();delete clients[this.id]};this.dmg=function(){that=
this.raster;that.avatar=this.avatar;this.raster.setImage(document.getElementById("dmg"));setTimeout(function(){that.setImage(document.getElementById(that.avatar))},100);socket.emit("dmg",{id:this.id})};this.death=function(){this.place({x:50,y:50})};this.place=function(p){this.group.position.x=p.x;this.group.position.y=p.y};this.move=function(d){if(d.left==true)this.group.position.x-=this.movementSpeed;if(d.right==true)this.group.position.x+=this.movementSpeed;if(d.up==true)this.group.position.y-=
this.movementSpeed;if(d.down==true)this.group.position.y+=this.movementSpeed;this.raster.position.y=Math.round(Number(this.raster.position.y));this.raster.position.x=Math.round(Number(this.raster.position.x))}};
player=function(position,avatar,socket,v){this.raster=new Raster(avatar);this.raster.position=position;this.avatar=avatar;this.raster.scale(.2);this.size=this.raster.bounds.width;this.socket=socket;this.view=v;this.movementSpeed=5;this.weapon=new Raster;this.weapon.scale(.1);this.weapon.position=this.raster.position+{x:-10,y:0};this.group=new Group(this.raster,this.weapon);this.setRotation=function(a){this.weapon.setRotation(a);this.raster.setRotation(a)};this.dmg=function(){that=this.raster;that.avatar=
this.avatar;this.raster.setImage(document.getElementById("dmg"));var t=setTimeout(function(){that.setImage(document.getElementById(that.avatar))},100)};this.death=function(){this.place({x:50,y:50})};this.setBackground=function(p){var x=p.x;var y=p.y;var canvas=$("#canvas");var pos=canvas.css("background-position").split(" ");pos[0]=parseFloat(pos[0]);pos[1]=parseFloat(pos[1]);if(pos[0]>-500&&pos[0]<=0)pos[0]=x;if(pos[1]>-500&&pos[1]<=0)pos[1]=y;canvas.css("background-position",Math.round(Number(pos[0]))+
"px "+Math.round(Number(pos[1]))+"px")};this.moveBackground=function(x,y){var canvas=$("#canvas");var pos=canvas.css("background-position").split(" ");pos[0]=parseFloat(pos[0]);pos[1]=parseFloat(pos[1]);if(pos[0]+x>-500&&pos[0]+x<=0)pos[0]+=x;if(pos[1]+y>-500&&pos[1]+y<=0)pos[1]+=y;canvas.css("background-position",Math.round(Number(pos[0]))+"px "+Math.round(Number(pos[1]))+"px")};this.place=function(p){p.x=Number(p.x);p.y=Number(p.y);this.raster.position=p;this.weapon.position=p;this.socket.emit("place",
{id:this.id,x:p.x,y:p.y});var vx,vy;vx=p.x-this.view.center.x;vy=p.y-this.view.center.y;if(p.x<250){p.x=0;vx=250-this.view.center.x}else if(p.x>750){p.x=-495;vx=750-this.view.center.x}else p.x/=-2;if(p.y<250){p.y=0;vy=250-this.view.center.y}else if(p.y>750){vy=750-this.view.center.y;p.y=-495}else p.y/=-2;var t=new Point([vx,vy]);this.view.scrollBy(t);this.setBackground(p)};this.move=function(){var p=this.group.position;var step=this.movementSpeed;p.x=Math.round(Number(p.x));p.y=Math.round(Number(p.y));
var keyPressed=false;if(Key.isDown("a")&&p.x>20){keyPressed=true;if(collisionPlayers(p,"a")){if(p.x>250&&p.x<=750){this.view.scrollBy({x:-step,y:0});this.moveBackground(step,0)}p.x-=step;this.socket.emit("move",{left:true})}}if(Key.isDown("d")&&p.x<980){keyPressed=true;if(collisionPlayers(p,"d")){if(p.x>=250&&p.x<750){this.view.scrollBy({x:step,y:0});this.moveBackground(-step,0)}p.x+=step;this.socket.emit("move",{right:true})}}if(Key.isDown("w")&&p.y>20){keyPressed=true;if(collisionPlayers(p,"w")){if(p.y>
250&&p.y<750){this.view.scrollBy({x:0,y:-step});this.moveBackground(0,step)}p.y-=step;this.socket.emit("move",{up:true})}}if(Key.isDown("s")&&p.y<980){keyPressed=true;if(collisionPlayers(p,"s")){if(p.y>250&&p.y<750){this.view.scrollBy({x:0,y:step});this.moveBackground(0,-step)}p.y+=step;this.socket.emit("move",{down:true})}}p.x=Math.round(Number(p.x));p.y=Math.round(Number(p.y));if(p.x>250&&p.x<750&p.y>250&&p.y<750)this.view.center=p;else;if(keyPressed==true){crossHair=this.view.center+mousePosition;
var degree=Math.round(Math.atan2(crossHair.x-p.x,crossHair.y-p.y)*180/Math.PI);this.raster.setRotation(-degree);this.socket.emit("sight",{rotation:-degree})}};this.place({x:500,y:500})};setInterval(function(){next=true},100);var UI=new Group;socket=io.connect(location.host,{"force new connection":true});console.log(location.host);socket.on("sight",function(data){clients[data.id].raster.setRotation(data.rotation)});
socket.on("bullet",function(data){var path=new Path;path.strokeColor="red";var start=clients[data.id].raster.position;path.moveTo(start);path.strokeWidth=5;path.lineTo(start+{x:0,y:10});path.setRotation(clients[data.id].raster.rotation);path.destination={x:Number(data.x),y:Number(data.y)};path.key=data.id;bullets[bullets.length]=path});socket.on("hi",function(data){clients[data.id]=new client(data.id,{x:data.position.x,y:data.position.y},"oman")});
socket.on("death",function(data){if(data.id==player.id)player.death();else clients[data.id].death()});socket.on("you",function(data){player.id=data.id});socket.on("logout",function(data){clients[data.id].remove()});socket.on("new",function(data){socket.emit("hi",{position:{x:player.raster.position.x,y:player.raster.position.y},to:data.id});clients[data.id]=new client(data.id,new Point([500,500]),"oman")});socket.on("move",function(data){clients[data.id].move(data)});socket.on("dmg",function(){player.dmg()});
socket.on("place",function(data){if(data.id==player.id)player.place(data);else clients[data.id].place(data)});player=new player({x:500,y:500},"mona",socket,view);onMouseMove=function onMouseMove(event){mousePosition=event.point;var degree=Math.round(Math.atan2(event.point.x-Math.round(player.raster.position.x),event.point.y-Math.round(player.raster.position.y))*180/Math.PI);player.setRotation(-degree);socket.emit("sight",{rotation:-degree});mousePosition=event.point-view.center;crossHair=event.point};
onFrame=function onFrame(event){for(var i=0;i<bullets.length;i++){var tmp=new Point([bullets[i].destination.x/60,bullets[i].destination.y/60]);bullets[i].position+=tmp;if(bullets[i].position.y>1E3||bullets[i].position.x>1E3||bullets[i].position.y<0||bullets[i].position.x<0){bullets[i].remove();bullets.splice(i,1)}else{var col=bulletCollision(bullets[i].position,bullets[i].key);if(col!=false){if(col==player.id)player.dmg();else if(col!=true)clients[col].dmg();bullets[i].remove();bullets.splice(i,1)}}}player.move();
if(Key.isDown("space"))if(next==true){shotBullet(crossHair,0,player.raster);next=false}};
