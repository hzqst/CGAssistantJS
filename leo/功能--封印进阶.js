require('./common').then(async (cga)=>{
	await leo.log('红叶の封印进阶脚本，启动~');

	if(leo.isInTeam()){
        await leo.leaveTeam()
    }
    if(cga.GetPlayerInfo().gold<20000){
        await leo.getMoneyFromBank(20000)
    }
    await leo.goto(n=>n.castle.f1)
    await leo.autoWalkList([
    	[74, 19,'里谢里雅堡 2楼'],[32,71,'客房'],[9,4]
    ])
    await leo.talkNpc(10, 4, (dialog) => {
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