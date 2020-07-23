//该脚本为自动做法国面包卖店脚本，请注意！
require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var bankSize = 20; //银行大小
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('红叶の单人全自动法国面包采集制作贩卖商店脚本，启动~');
	
	var daka = true  //是否打卡(true/false)
	var doctorName = '医道之殇';
	var itemName = '法国面包';
	var skillLevel = 2;
	var skill = cga.findPlayerSkill('料理');
	if(!skill){
		console.error('提示：没有料理技能！');
		return;
	}
	if(skill.lv<skillLevel){
		console.error('提示：料理技能等级不足，至少要'+skillLevel+'级技能！');
		return;
	}

	var shouLieSkill = cga.findPlayerSkill('狩猎');
	var shouLieSkillLevel = 3;
	if(!shouLieSkill){
		console.error('提示：没有狩猎技能！');
		return;
	}
	if(shouLieSkill.lv<shouLieSkillLevel){
		console.error('提示：狩猎技能等级不足，至少要'+shouLieSkillLevel+'级技能！');
		return;
	}

  var countNo = 1;

	var main = async () => {
		await leo.waitAfterBattle()
		await leo.checkHealth(doctorName)
	  
		//1.小麦粉
		if(cga.getItemCount('小麦粉')< 200){
		await leo.logBack()
		await leo.goto(n=>n.teleport.yer)
		await leo.autoWalkList([[32, 65,'旧金山酒吧'],[18,11]])
		await leo.buy(0,[{index: 1, count:200}])
        await leo.delay(500)				
		
		}
		//2.牛奶
		if(cga.getItemCount('牛奶')<200){
			await leo.logBack()
			
//			await leo.goto(n=>n.teleport.kili)
            await leo.autoWalkList([[130, 50, '盖雷布伦森林'],[216, 44]])
            await leo.talkNpc(216, 43, leo.talkNpcSelectorNo,'方堡盆地')
            await leo.autoWalk([182, 62])
            await leo.log('到达位置，开始狩猎【牛奶】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('牛奶');
				if (count >= 200) {
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('牛奶',40)
		}
		//3.盐
		if(cga.getItemCount('盐')< 200){
			await leo.logBack()
			await leo.goto(n=>n.castle.x)
			await leo.autoWalk([34,88])
			await leo.supplyDir(0)
			await leo.goto(n=>n.teleport.aleut)
            await leo.autoWalkList([[66, 64,'芙蕾雅'],[715, 134]])
            await leo.log('到达位置，开始狩猎【盐】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				if (cga.getItemCount('盐') >= 200) {
					return leo.reject();
				}		
				
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})			
			await leo.dropItem('盐',40)
		}

		if(cga.getItemCount('小麦粉')>=200
			&& cga.getItemCount('牛奶')>=200
			&& cga.getItemCount('盐')>=200){
			await leo.log('材料已集齐，开始去制造法国面包')
			await leo.logBack()
			
			await leo.goto(n=>n.castle.x)
			if(daka){
			await leo.autoWalk([58,83])
		    await leo.talkNpc(58,84,leo.talkNpcSelectorYes)}
			
			await leo.autoWalk([31,77])
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 200){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.goto(n=>n.castle.x))
					.then(()=>leo.autoWalk([31,77]));
				}
				var count = cga.getItemCount('小麦粉');
				if (count < 20) {
					return leo.reject();
				}
				return leo.todo()
				.then(()=>leo.craft(itemName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.pile(true)
			await leo.delay(500)
//			await leo.dropItem('法国面包',3) // 扔掉不成组的，不然卡交易
//			await leo.delay(500)
			await leo.autoWalk([31,77])
			await leo.sell(30, 77, (item)=>{return item.name == '法国面包' && item.count == 3})
			await leo.log('本轮采集+法国面包制造贩卖完成')
			await leo.log('厨师单人全自动采集制作法国面包贩卖商店，完成第' + (countNo++) + '次')
		}
	}

    leo.loop(async ()=>{
        try{
            await main();
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })
});