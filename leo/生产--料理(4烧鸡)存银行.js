//该脚本为自动做烧鸡脚本,使用此脚本的厨师最好把银行开到80格。
//需要厨师伐木2级，狩猎4级，否则无法运行
require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var bankSize = 80; //银行大小
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('高仿红叶の单人全自动烧鸡采集制作脚本，启动~');

	var doctorName = '医道之殇';
	var itemName = '烧鸡';
	var skillLevel = 4;
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
	var shouLieSkillLevel = 4;
	if(!shouLieSkill){
		console.error('提示：没有狩猎技能！');
		return;
	}
	if(shouLieSkill.lv<shouLieSkillLevel){
		console.error('提示：狩猎技能等级不足，至少要'+shouLieSkillLevel+'级技能！');
		return;
	}

	var faMuSkill = cga.findPlayerSkill('伐木');
	var faMuSkillLevel = 2;
	if(!faMuSkill){
		console.error('提示：没有伐木技能！');
		return;
	}
	if(faMuSkill.lv<faMuSkillLevel){
		console.error('提示：伐木技能等级不足，至少要'+faMuSkillLevel+'级技能！');
		return;
	}

  var countNo = 1;

	var main = async () => {
		await leo.waitAfterBattle()
		await leo.logBack()
		await leo.checkHealth(doctorName)

		//1. 鸡肉
		if(cga.getItemCount('鸡肉')<160){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.goto(n => n.falan.wout)
            await leo.autoWalk([436, 44])
            await leo.log('到达位置，开始狩猎【鸡肉】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.reject());
				}
				if(cga.getItemCount('鸡肉') >= 160){
					 return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
            await leo.dropItem('鸡肉',40)
            await leo.dropItem('蕃茄',40)
            await leo.log('离开位置，完成狩猎【鸡肉】，数量为【'+cga.getItemCount('鸡肉')+'】')
            await leo.logBack()
          await leo.checkHealth(doctorName)
            await leo.goto(n=>n.castle.x)
            await leo.autoWalk([31,77])
            await leo.sell(30, 77, (item)=>{return item.name == '蕃茄' && item.count == 40})
            await leo.delay(500)
		}

		//2. 盐
		if(cga.getItemCount('盐')<160
			&& cga.getItemCount('鸡肉')>=160){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.autoWalk([157, 93])
            await leo.turnDir(0)
            await leo.delay(400)
            await leo.turnDir(4)
            await leo.delay(400)
            await leo.turnDir(5)
            await leo.delay(400)
            await leo.autoWalkList([[190, 116,'盖雷布伦森林'],[204, 209]])
            await leo.log('到达位置，开始狩猎【盐】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
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
            await leo.log('离开位置，完成狩猎【盐】，数量为【'+cga.getItemCount('盐')+'】')
		}

		//3.柠檬草
		if(cga.getItemCount('柠檬草')<160
			&& cga.getItemCount('盐')>=160
			&& cga.getItemCount('鸡肉')>=160){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.goto(n => n.falan.wout)
            await leo.autoWalk([515, 100])
            await leo.log('到达位置，开始采花【柠檬草】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.reject());
				}
				if(cga.getItemCount('柠檬草') >= 160){
					 return leo.reject();
				}
				cga.StartWork(faMuSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('柠檬草',40)
            await leo.log('离开位置，完成采花【柠檬草】，数量为【'+cga.getItemCount('柠檬草')+'】')
		}

		//4.胡椒
		if(cga.getItemCount('胡椒')<160
			&& cga.getItemCount('柠檬草')>=160
			&& cga.getItemCount('盐')>=160
			&& cga.getItemCount('鸡肉')>=160){
			var count = 160 - cga.getItemCount('胡椒');
			await leo.logBack()
			await leo.goto(n=>n.teleport.yer)
			await leo.autoWalkList([[32,65,'旧金山酒吧'],[18,11]])
			await leo.buy(0,[{index: 3, count:count}])
			await leo.delay(1000)
            await leo.log('离开位置，完成购买【胡椒】，数量为【'+cga.getItemCount('胡椒')+'】')
		}

		if(cga.getItemCount('胡椒')>=160
			&& cga.getItemCount('盐')>=160
			&& cga.getItemCount('鸡肉')>=160
			&& cga.getItemCount('柠檬草')>=160){
			await leo.log('材料已集齐，开始制作烧鸡')
			await leo.logBack()
            await leo.goto(n=>n.castle.x)
            await leo.autoWalk([34,88])
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 50){
					console.log('魔力不足');
					return leo.supplyDir(0);
				}
				if(cga.getItemCount('柠檬草') < 20){
					 return leo.reject();
				}
				return leo.todo()
				.then(()=>leo.craft(itemName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.pile(true)
			await leo.delay(500)
			await leo.goto(n=>n.falan.bank)
			await leo.turnDir(0)
            await leo.saveToBankAll('烧鸡', 3)
			await leo.log('本轮采集+烧鸡制造完成')
            await leo.log('非4转厨师单人全自动采集制作烧鸡，完成第' + (countNo++) + '次')
		}
		 else{
			    await leo.log('材料不足，跳过制作，开启重新采集！')
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