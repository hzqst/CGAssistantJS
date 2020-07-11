//该脚本为自动到银行取鱼翅做鱼翅汤脚本,使用此脚本的厨师最好把银行开到80格。
//每次使用脚本前把银行塞满鱼翅，脚本会自动去采集别的材料，然后把所有鱼翅都做成鱼翅汤。
require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var bankSize = 20; //银行大小
	leo.monitor.config.healSelf = false;//自动治疗自己
	leo.log('红叶の自动做鱼翅汤脚本，启动~');

	var doctorName = '医道之殇';
	var itemName = '鱼翅汤';
	var skillLevel = 10;
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

	var main = async () => {
		//await leo.waitAfterBattle()
		//1.胡椒
		if(cga.getItemCount('胡椒')<160){
			var count = 160 - cga.getItemCount('胡椒');
			await leo.logBack()
			await leo.goto(n=>n.teleport.yer)
			await leo.autoWalkList([[32,65,'旧金山酒吧'],[18,11]])
			await leo.buy(0,[{index: 3, count:count}])
		}
		//2.盐
		if(cga.getItemCount('盐')<160){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.autoWalk([157, 93])
            await leo.turnDir(0)
            await leo.delay(500)
            await leo.autoWalkList([[190,116,'盖雷布伦森林'],[204, 209]])
            await leo.log('到达位置，开始狩猎【盐】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('盐');
				if (count >= 160) {
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('盐',40)
		}
		//3.葱
		if(cga.getItemCount('葱')<160){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.autoWalk([157, 93])
            await leo.turnDir(0)
            await leo.delay(500)
            await leo.autoWalkList([[190,116,'盖雷布伦森林'],[231,222,'布拉基姆高地'],[61, 193]])
            await leo.log('到达位置，开始狩猎【葱】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('葱');
				if (count >= 160) {
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('葱',40)
		}
		//4.鸡蛋
		if(cga.getItemCount('鸡蛋')<160){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.goto(n=>n.teleport.kili)
            await leo.autoWalkList([[79,76,'索奇亚'],[297, 361]])
            await leo.log('到达位置，开始狩猎【鸡蛋】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('鸡蛋');
				if (count >= 160) {
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('鸡蛋',40)
		}

		if(cga.getItemCount('胡椒')>=160 
			&& cga.getItemCount('盐')>=160 
			&& cga.getItemCount('葱')>=160 
			&& cga.getItemCount('鸡蛋')>=160){
			await leo.log('材料已集齐，开始去制造鱼翅汤')
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
				var count = cga.getItemCount('鸡蛋');
				if (count < 20) {
					return leo.reject();
				}
				return leo.turnDir(0)
				.then(()=>leo.getFromBank('鱼翅',1))
				.then(()=>leo.craft(itemName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.pile(true)
			await leo.delay(500)
			await leo.turnDir(0)
			await leo.saveToBank(itemName,0,[],bankSize)
			await leo.log('本轮采集+鱼翅汤制造完成')
			await leo.logBack()
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