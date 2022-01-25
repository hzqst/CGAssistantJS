require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	leo.monitor.config.healSelf = true;//自动治疗自己

	leo.log('红叶の原地伐木脚本，启动~');

	var skill = cga.findPlayerSkill('伐木');
		
	if(!skill){
		console.error('提示：没有伐木技能！');
		return;
	}
	
	leo.todo()
	.then(()=>{
		return leo.loop(()=>{
			if(cga.GetPlayerInfo().mp < 1){
				return leo.log('魔力不足')
				.then(()=>leo.reject());
			}
			var emptyIndexes = leo.getEmptyBagIndexes();
			if (emptyIndexes.length == 0) {
				return leo.log('已经满包')
				.then(()=>leo.reject());
			}
			cga.StartWork(skill.index, 0);
			return leo.waitWorkResult()
			.then(()=>leo.pile(true))
			.then(()=>leo.delay(500));
		});
	})
	.then(()=>leo.log('脚本结束'));
});