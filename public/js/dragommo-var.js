player = {};



size = {x: 500,y:500};

 step = 10;

 chatInput = false;
 mousePosition = {};
 crossHair = {x: 0,y:0}

 next= false;
 bullets = Array();
 clients = [];
 objects = [];

 objects[0] = new Path.Rectangle(100,350,200,20);
 objects[0].fillColor = "black";
 objects[0].Type = 'surrounding';
 objects[1] = new Path.Rectangle(285,150,15,200);
 objects[1].fillColor = "black";
 objects[1].Type = 'surrounding';


 objects[2] = new Path.Rectangle(650,350,200,20);
 objects[2].fillColor = "black";
 objects[2].Type = 'surrounding';
 objects[3] = new Path.Rectangle(650,150,15,200);
 objects[3].fillColor = "black";
 objects[3].Type = 'surrounding';

 objects[4] = new Path.Rectangle(100,650,200,20);
 objects[4].fillColor = "black";
 objects[4].Type = 'surrounding';
 objects[5] = new Path.Rectangle(285,650,15,200);
 objects[5].fillColor = "black";
 objects[5].Type = 'surrounding';

 objects[6] = new Path.Rectangle(650,650,200,20);
 objects[6].fillColor = "black";
 objects[6].Type = 'surrounding';
 objects[7] = new Path.Rectangle(650,650,15,200);
 objects[7].fillColor = "black";
 objects[7].Type = 'surrounding';


bonuses = {};





