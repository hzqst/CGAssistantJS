//该脚本为自动做法国面包卖店脚本，请注意！
require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var bankSize = 20; //银行大小
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('全自动2级血瓶采集制作贩卖商店脚本，启动~');
	
	var daka = true  //是否打卡(true/false)
	var doctorName = '假医生';
	var itemName = '生命力回复药（150）';
	var skillLevel = 2;
	var skill = cga.findPlayerSkill('制药');
	if(!skill){
		console.error('提示：没有制药技能！');
		return;
	}
	if(skill.lv<skillLevel){
		console.error('提示：制药技能等级不足，至少要'+skillLevel+'级技能！');
		return;
	}

	var famuSkill = cga.findPlayerSkill('伐木');
	var famuSkillLevel = 2;
	if(!famuSkill){
		console.error('提示：没有伐木技能！');
		return;
	}
	if(famuSkill.lv < famuSkillLevel){
		console.error('提示：伐木技能等级不足，至少要'+famuSkillLevel+'级技能！');
		return;
	}

  var countNo = 1;

	var main = async () => {
		await leo.waitAfterBattle()  
		await leo.logBack()		
		await leo.checkHealth(doctorName)
	//检查库存	
		if(cga.getItemCount('生命力回复药（150）') >= 3){
			await leo.goto(n=>n.castle.x)
			await leo.autoWalk([31,77])
			await leo.sell(30, 77, (item)=>{return item.name == '生命力回复药（150）' && item.count == 3})
		    await leo.logBack()}
		//1.苹果薄荷
		if(cga.getItemCount('苹果薄荷')<320){		
			
			await leo.goto(n=>n.castle.x)
			await leo.autoWalk([34,88])
			await leo.supplyDir(0)
			await leo.goto(n=>n.falan.wout)
			await leo.autoWalk([500,85])
			
            await leo.log('到达位置，开始伐木苹果薄荷')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('苹果薄荷');
				if (count >= 320) {
					return leo.reject();
				}
				cga.StartWork(famuSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('苹果薄荷',40)
			
		}
		//2.柠檬草
		if(cga.getItemCount('柠檬草')< 320){
			var mapInfo = cga.getMapInfo();
			if(cga.getItemCount('苹果薄荷') >= 320&& mapInfo.name == '艾尔莎岛'){
				await leo.goto(n=>n.castle.x)
				await leo.autoWalk([34,88])
				await leo.supplyDir(0)
				await leo.goto(n=>n.falan.wout)
				}			
					
			await leo.autoWalk([515, 100])           
            await leo.log('到达位置，开始采花柠檬草')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('柠檬草');
				if (count >= 320) {
					return leo.reject();
				}
				cga.StartWork(famuSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.dropItem('柠檬草',40)
			
		}	
	
	//制造血瓶
		if(cga.getItemCount('苹果薄荷')>= 320&& cga.getItemCount('柠檬草')>=320){
			await leo.log('材料已集齐，开始去制造血瓶')		
			await leo.logBack()	
			
			await leo.goto(n=>n.castle.x)
			
			if(daka){
			await leo.autoWalk([58,83])
		    await leo.talkNpc(58,84,leo.talkNpcSelectorYes)}
			
			await leo.autoWalk([34,88])			
			await leo.supplyDir(0)
			await leo.loop(()=>{				
				if(cga.GetPlayerInfo().mp < 50){
				   console.log('魔力不足');		
				   return leo.supplyDir(0);					
				}				
				var count = cga.getItemCount('苹果薄荷');
				if (count < 10) {
					return leo.reject();
					}
					
				return leo.todo()
				.then(()=>leo.craft(itemName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
				
			})	
//			await leo.dropItem('生命力回复药（150）',3) // 扔掉不成组的，不然卡交易
//			await leo.delay(500)
			await leo.autoWalk([31,77])
			await leo.sell(30, 77, (item)=>{return item.name == '生命力回复药（150）' && item.count == 3})
			await leo.log('本轮采集+血瓶制造贩卖完成')
			await leo.log('药剂师单人全自动采集制作血瓶贩卖商店，完成第' + (countNo++) + '次')
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