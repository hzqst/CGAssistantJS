require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('红叶の挖达马斯矿脚本，启动~');

	var itemName = '达马斯矿';
	var itemName2 = '达马斯矿条';
	var skillLevel = 8;
	var fullCount = 20;
	var skill = cga.findPlayerSkill('挖掘');
	if(!skill){
		console.error('提示：没有挖掘技能！');
		return;
	}
	if(skill.lv<skillLevel){
		console.error('提示：挖矿技能等级不足，至少要'+skillLevel+'级技能！');
		return;
	}

	var main = async () => {
		await leo.waitAfterBattle()
		if(cga.getInventoryItems().length>=fullCount || leo.getEmptyBagIndexes().length==0){
			//满包，回去压条
			await leo.logBack()
			await leo.gotoAKLF()
			await leo.autoWalk([157,208,'阿凯鲁法工房'])
			await leo.autoWalk([13,18])
			var exchangeCount = cga.getItemCount(itemName) / 20;
			var list = [{index:0, count:exchangeCount}];
			await leo.exchange(4,list)
			await leo.autoWalk([15,24,'阿凯鲁法村'])
			await leo.autoWalk([139,136,'银行'])
			await leo.autoWalk([20,17])
			await leo.turnDir(0)
			await leo.saveToBankAll(itemName2)
			await leo.delay(2000)
			//await leo.autoWalk([8,16,'阿凯鲁法村'])
		}
		await leo.logBack()
		await leo.gotoAKLF()
		await leo.autoWalkList([[192,208,'冒险者旅馆 1楼'],[24,17]])
		await leo.supplyDir(6)
		await leo.delay(5000)
		await leo.autoWalkList([
			[16,23,'阿凯鲁法村'],[178,227,'米内葛尔岛'],
			[283,457,'南恰拉山第1通路'],[8,33]
		])
		await leo.log('到达位置，开始挖【'+itemName+'】')
		await leo.loop(()=>{
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
	}

    leo.loop(async ()=>{
        try{
           await main();
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })
});