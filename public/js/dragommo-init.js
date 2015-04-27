next = false;
fireRates = function(a){

	this.time = function(a){
		clearInterval(this.i);
		this.i = setInterval(function(){next=true;},a);

	};

	this.i = setInterval(function(){next=true;},a);

};

intervals = new fireRates(1000);


//chatField = new textPoint();
var UI = new Group();

noname=20;
boardSize = 500;
totalSize = 1000;