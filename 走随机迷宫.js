var cga = require('./cgaapi')(function(){
	var loop = ()=>{
		cga.walkRandomMaze(null, (r)=>{
			if(r == true)
				loop();
		});
	}
	loop();
});