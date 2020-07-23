
require('./common').then(cga => {
	leo.monitor.config.healSelf = true;//自动治疗自己
	leo.log('大叔memory尝试自采自造1级装备制作脚本，需要使用leo的模块启动');
	var doctorName = '大叔-医治苍生';
	var countmany = 1; //制作次数
	var skillLevel = 1; //造几级弓， 目前只写了造1级弓的
	var productName="轻型弓" ;
	var skill = cga.findPlayerSkill('造弓');
	if(!skill){
		console.error('提示：没有造弓技能！');
		return;
	}
	if(skill.lv<skillLevel){
		console.error('提示：造弓技能等级不足，至少要'+skillLevel+'级技能！');
		return;
	}
	
	//******挖掘铜的变量定义准备start	
	var shouLieSkill = cga.findPlayerSkill('挖掘');
	var shouLieSkillLevel = 1;
	if(!shouLieSkill){
		console.error('提示：没有挖掘技能！');
		return;
	}
	if(shouLieSkill.lv<shouLieSkillLevel){
		console.error('提示：挖掘技能等级不足，至少要'+shouLieSkillLevel+'级技能！');
		return;
	}

	var count = 1;	
	var count1 =1;
	var count2 =2;
	var countcloth =1; 

	var itemName = '铜';
	var fullCount = 20;
	//******挖掘铜的变量定义结束over
	
	//******伐木 印度轻木的变量定义准备start	
	var famuSkill = cga.findPlayerSkill('伐木');
	var famuSkillLevel = 1;
	if(!famuSkill){
		console.error('提示：没有伐木技能！');
		return;
	}
	if(famuSkill.lv<famuSkillLevel){
		console.error('提示：伐木技能等级不足，至少要'+famuSkillLevel+'级技能！');
		return;
	}

	//******伐木 印度轻木的变量定义结束over
	
	
	var main = async () => {
		///////////////////////////////// 1.铜条模块开始
		
		leo.log('铜条模块开启');	
		
		while(cga.getItemCount('铜条') < 30 && cga.getItemCount('轻型弓') < 1){
			await leo.logBack()
			await leo.checkHealth(doctorName)
			 //飞碟治疗人物，优先找指定名字的医生，如果找不到，则找随机的医生？？？
	
				count1 = cga.getItemCount('铜');
				count2 = cga.getItemCount('铜条');
			while ( count1 < 600 && count2 < 30)
			{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足');
					//.then(()=>leo.reject());
				}
			await leo.logBack()
			await leo.goto(n=>n.falan.wout)		
            await leo.autoWalkList([[351, 145, '国营第24坑道 地下1楼']])
            await leo.log('到达【铜】的位置')
				//	leo.log('判断节点： 555');	
					
				count1 = cga.getItemCount('铜');
				count2 = cga.getItemCount('铜条');
				
				if ( count1 >= 600 || count2 >= 30) {
					//leo.log('判断节点：铜条大于600 或者 铜条超过30');		
									//跳出循环
				} 
				else{
					
				leo.log('开始挖铜')				
				while( cga.getItemCount('铜') < 600 && cga.GetPlayerInfo().mp >= 1) 
					{

						cga.StartWork(shouLieSkill.index, 0);   //开始 挖铜
						await	leo.delay(30000); //等待30秒
							//挖铜不知道有没有这个问题	 这个位置如果不加这个while循环 就会登出城，真奇怪
					}
			
				
				}
				//	return leo.waitWorkResult()
			await	leo.pile(true);
			await	leo.delay(500);
			}
			
			await leo.dropItem('铜',20)
			
			if(count1 >= 20){
			//回去压条
			await leo.logBack()
			await leo.goto(n=>n.falan.w2)    // 从新城去   falan： 法兰城，  w2: 西医附近
		    await leo.autoWalkList([[106, 61,'米克尔工房'],[26, 5]])	
			leo.log('已到达工房，走到铜跟前，准备换铜');			
			var exchangeCount = cga.getItemCount(itemName) / 20;
			var list = [{index:0, count:exchangeCount}];
			await leo.exchange(4,list);
			// 压条结束
			}
		}
		leo.log('铜条已经足够啦');
		///////////////////////////////// 1.铜条模块结束 over
		
		///////////////////////////////// 2.伐木模块开始
			leo.log('伐木模块开启');	
		
		while(cga.getItemCount('印度轻木') < 200 && cga.getItemCount('轻型弓') < 1){
			await leo.logBack()
			await leo.checkHealth(doctorName)


			while (cga.getItemCount('印度轻木') < 200)
			{
				if(cga.GetPlayerInfo().mp < 1){
					return leo.log('魔力不足');
				}
			await leo.logBack()
			await leo.goto(n=>n.falan.wout)		
            await leo.autoWalkList([[362, 184]])
            await leo.log('到达位置')

				if ( cga.getItemCount('印度轻木') >= 200) {
					leo.log('判断节点：印度轻木已>200');		
									//期望跳出循环
									
				} 
				else
				{
					famuSkill = cga.findPlayerSkill('伐木');
					leo.log('开始伐木')
					while( cga.getItemCount('印度轻木') < 200 && cga.GetPlayerInfo().mp >= 1) 
					{

						cga.StartWork(famuSkill.index, 0);   //开始 伐木
						await	leo.delay(50000); //等待50秒
							//	伐木这个位置如果不加这个while循环 就会登出城，真奇怪
					}
				}
				//	return leo.waitWorkResult()
		//	await	leo.pile(true);
		//	await	leo.delay(500);
			}
			
			await leo.dropItem('印度轻木',20)
			
		}
		leo.log('印度轻木已经足够啦');	
		///////////////////////////////// 2.伐木模块结束 over
 
		///////////////////////////////// 3.买布模块开始	
		leo.log('买布模块开始');	
		while(cga.getItemCount('麻布')<10 && cga.getItemCount('轻型弓') < 1){
			var count = 10 - cga.getItemCount('麻布');
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
		while(cga.getItemCount('铜条')>=3 
			&& cga.getItemCount('印度轻木')>=20 
			&& cga.getItemCount('麻布')>=1){
			await leo.log('材料已集齐，开始去制造一级1A 轻型弓')
			await leo.logBack()
			await leo.checkHealth(doctorName)
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 200){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName));
				}
				if (cga.getItemCount('印度轻木') < 20 || cga.getItemCount('铜条') < 3 || cga.getItemCount('麻布') < 1) {
					return leo.reject();
				}
				return leo.turnDir(0)
				.then(()=>leo.craft(productName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.pile(true)
			await leo.delay(500)
			await leo.turnDir(0)
			await leo.log('本轮采集+制造1级弓完成')
			await leo.log('造弓完成第' + (countmany++) + '轮')
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

});
