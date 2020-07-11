require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('红叶の挖谢尔哈特矿脚本，启动~');

	var itemName = '谢尔哈特矿';
	var itemName2 = '谢尔哈特矿条';
	var skillLevel = 9;
	var fullCount = 3;
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
			await leo.autoWalk([11,18])
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
		await leo.autoWalk([166,107])
		await leo.talkNpc(0,leo.talkNpcSelectorYes,'坎那贝拉村')
		await leo.autoWalkList([[38,44,'医院'],[20,17]])
		await leo.supplyDir(0)
		await leo.delay(5000)
		await leo.autoWalkList([
			[15,25,'坎那贝拉村'],[13,48,'米内葛尔岛'],[472,282,'海峡通道'],[44,44]
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