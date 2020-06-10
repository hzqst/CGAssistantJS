require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var isLogBackFirst = true;
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };

	leo.log('红叶の学人物抗性技能脚本，启动~');

	leo.todo().then(()=>{
		if(isLogBackFirst){
			return leo.logBack();
		}else{
			return leo.next();
		}
	})
	.then(()=>{
		return leo.prepare(prepareOptions)	//招魂、治疗、补血、卖石
		.then(()=>leo.goto(n => n.falan.w1))
		.then(()=>leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]]));
	})
	.then(()=>{
		return leo.talkNpc(201, 165,leo.talkNpcSelectorYes,'莎莲娜海底洞窟 地下1楼');
	})
	.then(()=>{
		return leo.autoWalkList([
			[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]
		]);
	})
	.then(()=>leo.turnTo(31, 22))
	.then(()=>leo.say('咒术'))
	.then(()=>{
		return leo.waitNPCDialog(dialog => {
			cga.ClickNPCDialog(1, -1);
			return leo.delay(2000);
		});
	})
	.then(()=>{
		return leo.autoWalkList([
			[38, 37 ,'咒术师的秘密住处'],[10, 0 ,15008],[1, 10 ,15010],[15, 10]
		]);
	})
	.then(()=>leo.log('已经到达学习技能位置!脚本结束'));
	
});