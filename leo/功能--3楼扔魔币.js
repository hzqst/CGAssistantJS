require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	var times = 1;	//扔魔币次数
	var target = [79,7];	//扔魔币时人物坐标
	leo.log('红叶の3楼扔魔币脚本，启动~');

	leo.todo()
	.then(()=>{
		var mapInfo = cga.getMapInfo();
		if(mapInfo.name != '市场三楼 - 修理专区'){
			return leo.goto(n => n.falan.m1);
		}
	})
	.then(()=>{
		leo.loop(
			()=>leo.todo()
			.then(()=>{
				if(times-->0){
					return leo.autoWalk([83,12])
					.then(()=>leo.turnDir(0))
					.then(()=>{
						var playerinfo = cga.GetPlayerInfo();
						var gold = playerinfo.gold;
						var needGold = 1000000 - gold;
						return leo.moveGold(needGold,cga.MOVE_GOLD_FROMBANK);
					})
					.then(()=>leo.autoWalk(target))
					.then(()=>leo.turnDir(6))
					.then(()=>leo.moveGold(1000000,cga.MOVE_GOLD_DROP))
					.then(()=>leo.done());
				}else{
					leo.log('已完成');
					return leo.reject();
				}
			})
			
		)
	})

	
});