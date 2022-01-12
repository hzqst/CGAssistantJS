require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	
	leo.log('红叶の东门银行脚本，启动~');
	
	
	if(leo.getMapInfo().name == '召唤之间'){
		await leo.talkNpcAt(4,9)
		await leo.talkNpcAt(4,9)
		await leo.logBack()
	}
	await leo.loop(async()=>{
		if(leo.getMapInfo().name == '银行') {
			return leo.reject();
		}
		try{
			await leo.goto(n => n.falan.bank)
			await leo.turnDir(0)
			
		}catch(e){
			console.log(leo.logTime()+'出错，e:' + e);
		}
		await leo.delay(1000)
	})
	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true);	//开启队聊
	cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);	//开启组队
	cga.EnableFlags(cga.ENABLE_FLAG_CARD, false);		//开启名片
	cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);		//开启交易
	await leo.log('已到达东门银行')

});