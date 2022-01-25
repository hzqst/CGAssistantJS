require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	var isLogBackFirst = true;
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };

	leo.log('红叶の士兵学宠物4级技能脚本，启动~');

	leo.todo().then(()=>{
		if(isLogBackFirst){
			return leo.logBack();
		}else{
			return leo.next();
		}
	})
	.then(()=>{
		return leo.prepare(prepareOptions)	//招魂、治疗、补血、卖石
		.then(()=>leo.goto(n => n.castle.x))
		.then(()=>leo.autoWalk([48,51]));
	})
	.then(()=>{
		console.log(leo.logTime()+'拿【古文明字典】');
		return leo.talkNpc(6,leo.talkNpcSelectorYes);
	})
	.then(()=>{
		return leo.autoWalkList([
			[41,50,'里谢里雅堡 1楼'],[45,20,'启程之间'],[8,33]
		]);
	})
	.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes,'奇利村的传送点'))
	.then(()=>{
		return leo.autoWalkList([
			[7,6,'*'],[7,1,'*'],[1,8,'奇利村'],[60,45,'索奇亚'],[295,225]
		]);
	})
	.then(()=>{
		console.log(leo.logTime()+'拿【风的石板】');
		return leo.talkNpc(0,leo.talkNpcSelectorYes);
	})
	.then(()=>{
		return leo.autoWalkList([
			[356,334,'角笛大风穴'],[133,26,'索奇亚'],[512,234]
		]);
	})
	.then(()=>{
		console.log(leo.logTime()+'拿【火的石板】');
		return leo.talkNpc(6,leo.talkNpcSelectorYes);
	})
	.then(()=>leo.autoWalk([581,424]))
	.then(()=>{
		console.log(leo.logTime()+'拿【水的石板】');
		return leo.talkNpc(6,leo.talkNpcSelectorYes);
	})
	.then(()=>{
		return leo.autoWalkList([
			[626,300],[629,300]
		]);
	})
	.then(()=>{
		console.log(leo.logTime()+'输入“大地”交出【水的石板】进入哈贝鲁村');
		return leo.say('大地')
		.then(()=>leo.talkNpc(leo.talkNpcSelectorYes,'哈贝鲁村'));
	})
	.then(()=>leo.autoWalk([20,85]))
	.then(()=>leo.turnDir(4))
	.then(()=>leo.log('已经到达学习技能位置!脚本结束'));
	
});