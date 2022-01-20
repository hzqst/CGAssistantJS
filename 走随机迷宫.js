var cga = require('./cgaapi')(function(){
	var loop = ()=>{
		cga.walkRandomMaze(null, (err)=>{
			loop();
		});
	}
	loop();
});