require('./common').then(cga => {
	
	leo.log('红叶の问阿蒙拿称号脚本，启动~');
	
	var playerinfo = cga.GetPlayerInfo();
	var title = leo.getPlayerSysTitle(playerinfo.titles);

	leo.todo()
	.then(()=>leo.goto(n => n.falan.e1))
	.then(()=>leo.autoWalk([230, 84]))
	.then(()=>leo.turnDir(6))
	.then(()=>{
		playerinfo = cga.GetPlayerInfo();
		var newTitle = leo.getPlayerSysTitle(playerinfo.titles);
		if(title==newTitle){
			return leo.log('未获得新称号，当前人物称号为【'+newTitle+'】');
		}else{
			return leo.log('获得新称号【'+newTitle+'】');
		}
	})
	.then(()=>leo.done());
	
});