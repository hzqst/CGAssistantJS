require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	const up = true; //true-上楼，false-下楼

	leo.log('红叶の自动走随机迷宫脚本，启动~');

	//检查是否是随机迷宫，如果地图名称里没有数字，则不是
	var checkMaze = ()=>{
		var mapName = cga.GetMapName();
		var number = mapName.match(/\d+/);
		if(number&&number.length>0){
			return true;
		}else{
			return false;
		}
	}
	
	leo.todo().then(()=>{
		if(checkMaze()){
			return leo.walkRandomMazeUntil(()=>{
				if(!checkMaze()){
					return leo.log('已经走出迷宫');
				}
			},up);
		}else{
			return leo.log('当前不是迷宫地图，或者已经走出迷宫');
		}
	})
	.then(()=>console.log("finish"));
	
});