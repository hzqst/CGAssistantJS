//该脚本为自动做寿喜锅脚本,使用此脚本的厨师最好把银行开到80格。
require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var bankSize = 80; //银行大小
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('红叶の单人全自动寿喜锅采集制作脚本，启动~');

	var doctorName = '医道之殇';
	var itemName = '寿喜锅';
	var skillLevel = 6;
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
	var shouLieSkillLevel = 5;
	if(!shouLieSkill){
		console.error('提示：没有狩猎技能！');
		return;
	}
	if(shouLieSkill.lv<shouLieSkillLevel){
		console.error('提示：狩猎技能等级不足，至少要'+shouLieSkillLevel+'级技能！');
		return;
	}

  var count = 1;

	var main = async () => {
		await leo.waitAfterBattle()
		//1.酱油
		if(cga.getItemCount('酱油')<80){
			var count = 80 - cga.getItemCount('酱油');
			await leo.logBack()
			await leo.goto(n=>n.teleport.yer)
			await leo.autoWalkList([[32, 65,'旧金山酒吧'],[18,11]])
			await leo.buy(0,[{index: 2, count:count}])
		}
		//2.砂糖
		if(cga.getItemCount('砂糖')<80){
			var count = 80 - cga.getItemCount('砂糖');
			await leo.logBack()
			await leo.goto(n=>n.castle.x)
			await leo.autoWalkList([
			[41, 50,'里谢里雅堡 1楼'],
			[45, 20,'启程之间'],
			[8, 23]
		  ])
		  await leo.talkNpc(8, 22, leo.talkNpcSelectorYes, '维诺亚村的传送点')
			await leo.autoWalkList([
			[5, 1,'村长家的小房间'],
			[9, 5,'村长的家'],
			[11, 6]])
			await leo.buy(0,[{index: 0, count:count}])
		}
		//3.葱
		if(cga.getItemCount('葱')<80){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.autoWalk([157, 93])
            await leo.turnDir(0)
            await leo.delay(500)
            await leo.autoWalkList([[190, 116,'盖雷布伦森林'],[231, 222,'布拉基姆高地'],[61, 195]])
            await leo.log('到达位置，开始狩猎【葱】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('葱');
				if (count >= 80) {
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('葱',40)
		}
		//4.牛肉-盐
		if(cga.getItemCount('牛肉')<80){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.goto(n=>n.teleport.kili)
            await leo.autoWalkList([[79, 76,'索奇亚'],[330, 390]])
            await leo.log('到达位置，开始狩猎【牛肉&盐】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('牛肉');
				if (count >= 80) {
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('牛肉',40)
			await leo.dropItem('盐',40)
		}

		if(cga.getItemCount('葱')>=80 
			&& cga.getItemCount('盐')>=80 
			&& cga.getItemCount('酱油')>=80 
			&& cga.getItemCount('牛肉')>=80 
			&& cga.getItemCount('砂糖')>=80){
			await leo.log('材料已集齐，开始去制造寿喜锅')
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.goto(n=>n.falan.bank)
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 200){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.goto(n=>n.falan.bank));
				}
				var count = cga.getItemCount('葱');
				if (count < 20) {
					return leo.reject();
				}
				return leo.turnDir(0)
				.then(()=>leo.craft(itemName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.pile(true)
			await leo.delay(500)
			await leo.turnDir(0)
      await leo.saveToBankAll('寿喜锅', 3)
			await leo.log('本轮采集+寿喜锅制造完成')
      await leo.log('4转厨师单人全自动采集制作寿喜锅，完成第' + (count++) + '次')
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