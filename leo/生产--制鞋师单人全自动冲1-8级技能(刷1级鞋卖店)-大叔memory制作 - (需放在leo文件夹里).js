
require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('大叔memory尝试自采自造1级装备制作脚本，需要使用leo的模块启动');
	var doctorName = '大叔-医治苍生';
	var countmany = 1; //制作次数
	var skillLevel = 1; //这个脚本只造1级的
	var productName="运动鞋" ;
	var skill = cga.findPlayerSkill('制鞋');
	if(!skill){
		console.error('提示：没有制鞋技能！');
		return;
	}
	if(skill.lv<skillLevel){
		console.error('提示：制鞋技能等级不足，至少要'+skillLevel+'级技能！');
		return;
	}
	

	//*****打猎 鹿皮的变量定义准备start	
	var famuSkill = cga.findPlayerSkill('狩猎');
	var famuSkillLevel = 1;
	if(!famuSkill){
		console.error('提示：没有狩猎技能！');
		return;
	}
	if(famuSkill.lv<famuSkillLevel){
		console.error('提示：狩猎技能等级不足，至少要'+famuSkillLevel+'级技能！');
		return;
	}

	//******打猎 鹿皮的变量定义结束over

	
	var main = async () => {
		
		///////////////////////////////// 2. 打猎模块开始
			leo.log('打猎模块开启');	
		
		while(cga.getItemCount('鹿皮') < 300 && cga.getItemCount(productName) < 1){
			await leo.logBack()
			await leo.checkHealth(doctorName)


			while (cga.getItemCount('鹿皮') < 300)
			{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足');
				}
			await leo.logBack()

			await leo.autoWalkList([[130, 50,'盖雷布伦森林'],[175, 182]]) 
            await leo.log('到达位置')

				if ( cga.getItemCount('鹿皮') >= 300) {
					leo.log('判断节点：已>300');		
									//期望跳出循环
									
				} 
				else
				{
					famuSkill = cga.findPlayerSkill('狩猎');
					leo.log('开始打猎')
					while( cga.getItemCount('鹿皮') < 300 && cga.GetPlayerInfo().mp >= 1) 
					{

						cga.StartWork(famuSkill.index, 0);   //开始 
						await	leo.delay(20000); //等待20秒
							//	这个位置如果不加这个while循环 就会登出城
					}
				}	
			}				
		}
		leo.log('已经足够啦');	
		///////////////////////////////// 2.模块结束 over
 
		///////////////////////////////// 3.买布模块开始	
		leo.log('买布模块开始');	
		while(cga.getItemCount('麻布')<60 && cga.getItemCount(productName) < 1){
			var count = 60 - cga.getItemCount('麻布');
			await leo.logBack()
	//		await leo.goto(n=>n.teleport.yer)
			await leo.goto(n=>n.falan.fabric)
			await leo.buy(2,[{index: 0, count:count}])   // index：数字n，  是指购买第n+1位置的物品 . 此处n为0， 则是第一个物品 麻布
						//2 的意思，是指npc在南边（右下）
			await	leo.delay(2000);
		}
		leo.log('麻布已经足够啦');	
		///////////////////////////////// 3.买布模块结束 over

		///////////////////////////////// 4.制作模块开始
		while(cga.getItemCount('鹿皮')>=20 
			&& cga.getItemCount('麻布')>=4){
			await leo.log('材料已集齐，开始去制造一级')
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 200){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName));
				}
				if (cga.getItemCount('鹿皮') < 20 || cga.getItemCount('麻布') < 4 ) {
					return leo.reject();
				}
				return leo.turnDir(0)
				.then(()=>leo.craft(productName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
					////////////////4.2 卖店模块

				/*	
					if( ( ifsell == 1) && (cga.getInventoryEmptySlotCount() <=0 ) ) 
					{	//如果卖店模式 且 身上已满
						await leo.logBack()
						await leo.goto(n => n.falan.sell)
						cga.emogua.sell(156,122,(item)=>{return item.name == productName;} )
						// cga.emogua.sell(6,"","")
						//6是指npc在方向 左上， 也就是北
						await leo.delay(5000)	
					}
				*/
				
					///////////////4.2 卖店模块结束 over	
			})
			await leo.pile(true)
			await leo.delay(500)
			await leo.turnDir(0)
			await leo.log('本轮采集+制造1级装备完成')
			await leo.log('制鞋完成第' + (countmany++) + '轮')
		}
		    await leo.log('制作模块完毕，准备卖店')
		///////////////////////////////// 4.制作模块结束 over

		///////////////////////////////// 5.卖店模块开始
		 leo.log('卖店模块开始');	
		 await leo.goto(n => n.falan.sell)
		 cga.emogua.sell(156,122,(item)=>{return item.name == productName;} )
		// cga.emogua.sell(6,"","")
		 //6是指npc在方向 左上， 也就是北
		await leo.delay(5000)		
		
		///////////////////////////////// 5.卖店模块结束 over	
	}


    leo.loop(async ()=>{
        try{
            await main();			//执行main的函数
			await	leo.delay(5000); //等待5秒
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })

})
