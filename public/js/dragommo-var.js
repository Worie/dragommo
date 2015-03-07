


 step = 10;

 chatInput = false;
 mousePosition = {};
 crossHair = {x: 0,y:0}

 next= false;
 bullets = Array();
 clients = [];
 objects = [];

 objects[0] = new Path.Rectangle(100,250,200,15);
 objects[0].fillColor = "black";
 objects[1] = new Path.Rectangle(285,50,15,200);
 objects[1].fillColor = "black";


 objects[2] = new Path.Rectangle(650,250,200,15);
 objects[2].fillColor = "black";
 objects[3] = new Path.Rectangle(650,50,15,200);
 objects[3].fillColor = "black";

 objects[4] = new Path.Rectangle(100,550,200,15);
 objects[4].fillColor = "black";
 objects[5] = new Path.Rectangle(285,550,15,200);
 objects[5].fillColor = "black";

 objects[6] = new Path.Rectangle(650,550,200,15);
 objects[6].fillColor = "black";
 objects[7] = new Path.Rectangle(650,550,15,200);
 objects[7].fillColor = "black";