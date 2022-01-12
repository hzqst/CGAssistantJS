require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	await leo.log('红叶の驯兽进阶脚本，启动~');

	if(leo.isInTeam()){
        await leo.leaveTeam()
    }
    if(cga.GetPlayerInfo().gold<20000){
        await leo.getMoneyFromBank(20000)
    }
    await leo.goto(n => n.falan.w1)
    await leo.autoWalkList([[73, 60,'职业公会'] , [13 , 10]])
    await leo.talkNpc(6, (dialog) => {
		if(dialog && dialog.message && dialog.message.indexOf('我想提升阶级') >= 0){
			cga.ClickNPCDialog(0, 2);
			return true;
		}
		if(dialog && dialog.message && dialog.message.indexOf('个金币') >= 0){
			cga.ClickNPCDialog(0, 0);
			return false;
		}
		return false;
	})
	console.log(leo.logTime()+'已完成');
});