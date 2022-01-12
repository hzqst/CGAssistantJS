require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	console.log('红叶の穿墙脚本，请注意人物的方向，启动~');

	//方向0-东 2-南 4-西 6-北
	var direction = cga.GetPlayerInfo().direction;
	var times = 1;	//移动次数

	leo.todo().then(()=>leo.forceMove(direction,times))
	.then(()=>console.log("完成"));
	
});