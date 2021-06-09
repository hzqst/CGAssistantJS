require('./common').then(async (cga)=>{
	
	await leo.log('红叶の问阿蒙拿称号脚本，启动~');
	
	var playerinfo = cga.GetPlayerInfo();
	var title = leo.getPlayerSysTitle(playerinfo.titles);

	await leo.goto(n => n.falan.e1)
	await leo.autoWalk([230, 84])
	await leo.turnDir(6)

	playerinfo = cga.GetPlayerInfo();
	var newTitle = leo.getPlayerSysTitle(playerinfo.titles);
	if(title==newTitle){
		await leo.log('未获得新称号，当前人物称号为【'+newTitle+'】');
	}else{
		await leo.log('获得新称号【'+newTitle+'】');
	}

	let range = 0;
	await leo.autoWalk([234,108])
	await leo.delay(1000)
	await leo.turnDir(0)
	await leo.talkNpc(0, (dialog) => {
		if(dialog && dialog.message){
			range = leo.getPlayerSysTitleRange(dialog.message) || 0;
			cga.ClickNPCDialog(1, -1)
			return false;
		}
		return true;
	})
	await leo.log('当前人物称号进度为【'+range+'/4】')
	
});