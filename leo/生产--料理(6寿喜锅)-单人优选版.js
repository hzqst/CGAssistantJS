//该脚本为自动做寿喜锅脚本,使用此脚本的厨师最好把银行开到80格。
require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	var bankSize = 80; //银行大小
	leo.monitor.config.healSelf = true;//自动治疗自己
	console.log('单人全自动寿喜锅采集制作脚本，启动~');

	var doctorName = '123321';
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

  var countNo = 1;

	var main = async () => {
		await leo.waitAfterBattle()
		await leo.logBack()
		await leo.checkHealth(doctorName)

		//0.做好的先存银行
		if(cga.getItemCount('寿喜锅')>=3){
			await leo.goto(n=>n.falan.bank)
			await leo.turnDir(0)
			await leo.saveToBankAll('寿喜锅', 3)
			await leo.delay(5000)
			await leo.todo(()=>{
				if(cga.getItemCount('寿喜锅') >= 3){
						console.log('银行已满，需要优先处理！')
						.then(()=>leo.exit());
				}
				else
						{
						return leo.logBack();
						}
			})
		}
		if (cga.getInventoryItems().length == 20) {
					console.log('物品栏已满，需要优先处理！')
					.then(()=>leo.exit());
		}

		//1.牛肉-盐
		if(cga.getItemCount('盐')<160
			|| cga.getItemCount('牛肉')<160 ){
			await leo.goto(n=>n.teleport.kili)
			await leo.autoWalkList([[79, 76,'索奇亚'],[332, 390]])
			console.log('到达位置，开始狩猎【牛肉&盐】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
						console.log('魔力不足');
						return leo.logBack()
						.then(()=>leo.checkHealth(doctorName))
						.then(()=>leo.reject());
				}	
				if(cga.getItemCount('盐')>=160){
						return leo.dropItem('盐',40)
						.then(()=>leo.autoWalk([359, 375]))
						.then(()=>leo.reject());
			  }
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
						console.log('魔力不足');
						return leo.logBack()
						.then(()=>leo.checkHealth(doctorName))
						.then(()=>leo.reject());
				}	
				if(cga.getItemCount('牛肉')>=160){
						return leo.reject();
			        }
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('盐',40)
			await leo.dropItem('牛肉',40)
		}

		//2.葱
		if(cga.getItemCount('葱')<160
			&& cga.getItemCount('盐')>=160
			&& cga.getItemCount('牛肉')>=160){
			await leo.logBack()
			await leo.autoWalk([157, 93])
			await leo.turnDir(0)
			await leo.delay(400)
			await leo.turnDir(4)
			await leo.delay(400)
			await leo.turnDir(5)
			await leo.delay(400)
			await leo.autoWalkList([[190, 116,'盖雷布伦森林'],[231, 222,'布拉基姆高地'],[61, 195]])
// 防止之前扔40一组盐的时间过长，造成有另外的零头牛肉和盐采集到
			await leo.dropItem('牛肉',40)
			await leo.dropItem('盐',40)
			console.log('到达位置，开始狩猎【葱】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.reject());
				}
				if(cga.getItemCount('葱') >= 160){
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('葱',40)
		}

		//3.酱油 -- 采集
		if(cga.getItemCount('酱油')<160
			&& cga.getItemCount('葱')>=160
			&& cga.getItemCount('盐')>=160
			&& cga.getItemCount('牛肉')>=160){
			await leo.logBack()
			await leo.goto(n=>n.teleport.aleut)
			await leo.autoWalkList([[66, 64,'芙蕾雅'],[624, 110]])
			await leo.dropItem('葱',40)
			console.log('到达位置，开始狩猎【酱油】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.reject());
				}
				if(cga.getItemCount('酱油') >= 160){
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('酱油',40)
		}

		//4.砂糖 -- 维村买糖
		if(cga.getItemCount('葱')>=160
			&& cga.getItemCount('盐')>=160
			&& cga.getItemCount('酱油')>=160
			&& cga.getItemCount('牛肉')>=160){
			await leo.logBack()
			await leo.goto(n=>n.castle.x)
			await leo.autoWalk([34,88])
			await leo.supplyDir(0)
			await leo.delay(1000)
			await leo.autoWalkList([
						[41, 50,'里谢里雅堡 1楼'],
						[45, 20,'启程之间'],
						[8, 23]
						])
			await leo.talkNpc(8, 22, leo.talkNpcSelectorYes, '维诺亚村的传送点')
			await leo.dropItem('酱油',40)
			await leo.autoWalkList([
						[5, 1,'村长家的小房间'],
						[9, 5,'村长的家'],
						[11, 6]])
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 100){
					console.log('魔力不足，重启脚本');
					return leo.reject();
				}
				if(cga.getItemCount('酱油') < 20){
					return leo.reject();
				}
				if(cga.getItemCount('砂糖') < 20){
						return leo.delay(500)
						.then(()=> leo.buy(0,[{index: 0, count:40}]))
						.then(()=> leo.delay(1000))
						.then(()=> leo.next());
				}
				return leo.todo()
				.then(()=>leo.craft(itemName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.logBack()
			await leo.goto(n=>n.falan.bank)
			await leo.turnDir(0)
			await leo.saveToBankAll('寿喜锅', 3)
			await leo.todo(()=>{
				if(cga.getItemCount('寿喜锅') >= 3){
						console.log('银行已满，打卡下班回家啦！')
						.then(()=>leo.exit());
				}
				else
						{
						return leo.next();
						}
			})
			console.log('本轮采集+寿喜锅制造完成')
			console.log('4转厨师单人全自动采集制作寿喜锅，完成第' + (countNo++) + '次')
		}
		else{
				console.log('材料不足，跳过制作，开启重新采集！')
				}
	}
    leo.loop(async ()=>{
        try{
            await main();
        }catch(e){
            console.log('出错，重新开始：', e);
        }
    })
});