var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	var loop = ()=>{
		cga.walkRandomMaze(null, (err)=>{
			loop();
		});
	}
	loop();
});