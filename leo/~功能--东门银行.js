require('./common').then(cga => {
	
	leo.log('红叶の东门银行脚本，启动~');
	
	leo.todo()
	.then(()=>leo.goto(n => n.falan.bank))
	.then(()=>leo.turnDir(0))
	.then(()=>{
		cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true);	//开启队聊
		cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);	//开启组队
		cga.EnableFlags(cga.ENABLE_FLAG_CARD, true);		//开启名片
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);		//开启交易
		return leo.log('已到达东门银行');
	})
	.then(()=>leo.done());
	
});