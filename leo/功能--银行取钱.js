require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	
	var money = 1000000;

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true);	//开启队聊
	cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);	//开启组队
	cga.EnableFlags(cga.ENABLE_FLAG_CARD, true);		//开启名片
	cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);		//开启交易

	leo.log('红叶の东门银行取钱脚本，启动~');
	
	leo.todo()
	.then(()=>leo.goto(n => n.falan.bank))
	.then(()=>leo.turnDir(0))
	.then(()=>leo.moveGold(money,cga.MOVE_GOLD_FROMBANK))
	.then(()=>{
		var playerinfo = cga.GetPlayerInfo();
		return leo.log('已完成，当前人物身上魔币为：'+playerinfo.gold);
	})
	.then(()=>leo.done());
	
});