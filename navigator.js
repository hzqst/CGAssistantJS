var cga = require('./cgaapi')(function(){
	
	if(process.argv[3] == undefined)
	{
		throw new Error('该寻路脚本为CGAssistant内部调用，无法单独使用！');
	}
	
	var x = parseInt(process.argv[3]);
	var y = parseInt(process.argv[4]);
	var entermap = parseInt(process.argv[5]);
	
	var mapname = cga.GetMapName();
	var curXY = cga.GetMapXY();
	
	var Path = cga.calculatePath(curXY.x, curXY.y, x, y, mapname, null, null, []);
	var PF = require('pathfinding');

	if(Path.length > 0)
	{
		for(var i in Path){
			if(Path[i][2] !== undefined || Path[i][5] !== undefined)
				Path[i] = [Path[i][0], Path[i][1]];
		}
		Path.unshift([curXY.x, curXY.y]);
		
		console.log('[PATH BEGIN]');
		console.log(Path);
		console.log('[PATH END]');

		cga.walkList([
		(entermap && entermap != 3) ? [x, y, ''] : [x, y],
		], ()=>{
			
		});
	} else {
		console.log('[PATH BEGIN]');
		console.log(Path);
		console.log('[PATH END]');
	}
});