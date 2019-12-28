var cga = require('./cgaapi')(function(){
	var xy = cga.GetMapXY();
	var dir = cga.getRandomSpaceDir(xy.x, xy.y);
	cga.freqMove(dir);
});