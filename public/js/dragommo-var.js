 step = 5;
 mousePosition = {};
 crossHair = {x: 0,y:0}

 next= false;
 bullets = Array();
 clients = [];
 coords = [];
 raster = new Raster('mona');


 text = new PointText({  point: view.center,
    justification: 'center',
    fontSize: 14,
    fillColor: 'white'
});

// Move the raster to the center of the view
raster.position = new Point([500,500]);
raster.scale(0.2);



