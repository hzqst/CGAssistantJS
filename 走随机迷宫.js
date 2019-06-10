var cga = require('./cgaapi')(function(){
	var loop = ()=>{
		cga.walkRandomMaze('', (r)=>{
			if(r == true)
				loop();
		});
	}
	loop();
});