var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	var xy = cga.GetMapXY();
	var dir = cga.getRandomSpaceDir(xy.x, xy.y);
	cga.freqMove(dir);
});