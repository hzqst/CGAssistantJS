var cga = require('./cgaapi')(function(){
	console.log('开始执行模块：刷双百-鹿皮，请先修改下面的角色名列表');
	
	var trade_player = '东仙队长';//交易的制造号
	var trade_count = 5;//一次交易5组鹿皮

	var healme = function(cb){
		
		var skill_heal = cga.findPlayerSkill('治疗');
		if(!skill_heal){
			throw new Error('你没有治疗技能');
			return;
		}
		var requiremp = 25 + skill_heal.lv * 5;
		
		if (cga.GetPlayerInfo().mp < requiremp){
			cb(false);
			return;
		}

		cga.StartWork(skill_heal.index, skill_heal.lv-1);
		cga.AsyncWaitPlayerMenu(function(players){
			cga.PlayerMenuSelect(0);
			cga.AsyncWaitUnitMenu(function(units){
				cga.UnitMenuSelect(0);
				cga.AsyncWaitWorkingResult(function(r){
					if(cga.GetPlayerInfo().health != 0)
						healme(cb);
					else
						cb(true);
				});
			});
		});
	}	
	
	var skill = cga.findPlayerSkill('狩猎');
	var skill2 = cga.findPlayerSkill('狩猎体验');
	if(!skill && !skill2){
		throw new Error('你没有狩猎或狩猎体验技能');
		return;
	}
	var useskill = skill2 ? skill2 : skill;
	var doWork = null;

	var waitEnd = function(cb2){
		cga.AsyncWaitWorkingResult(function(r){
			var playerInfo = cga.GetPlayerInfo();
			if(playerInfo.mp == 0)
			{
				cb2();
				return;
			}
			var items = cga.getInventoryItems();
			var count = cga.getItemCount('鹿皮');
			if(items.length >= 20 || count >= trade_count * 40)
			{
				cb2();
				return;
			}
			
			for(var i in items){
				if(items[i].name == '传说中的鹿皮' && items[i].count == 40)
					cga.DropItem(items[i].pos);
			}

			cga.StartWork(useskill.index, 0);
			waitEnd(cb2);
		}, 10000);
	}
	
	var trade = ()=>{

		var count = cga.getItemCount('鹿皮');
		if(count < 20){
			//没鹿皮了
			setTimeout(doWork, 1000);
			return;
		}
		
		cga.travel.falan.toFabricStore((r)=>{

			var wait_trade_player = ()=>{
				
				var teamplayers = cga.getTeamPlayers();
								
				if(!(teamplayers.length >= 2 && teamplayers[1].is_me)){
					if(!teamplayers.length){
						doWork();
						return;
					}
					setTimeout(wait_trade_player, 1000);
					return;
				}
				
				var count = 0;
				var stuff = 
				{
					itemFilter : (item)=>{
						if(item.name == '鹿皮' && item.count >= 20 && count < trade_count){
							count ++;
							return true;
						}
						return false;
					}
				}

				cga.trade(trade_player, stuff, null, (result)=>{
					console.log(result);
					setTimeout(trade, 1000);
				});
			}
			
			var wait_team_player = ()=>{
				
				cga.WalkTo(8, 8);
				
				cga.addTeammate(trade_player, (r)=>{
					if(r){
						wait_trade_player();						
						return;
					}

					setTimeout(wait_team_player, 1000);
				});
			}
			
			setTimeout(wait_team_player, 1000);
		});
	}

	doWork = ()=>{
		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < playerInfo.maxmp)
		{
			cga.travel.falan.toCastleHospital(()=>{
				setTimeout(doWork, 3000);
			});
			return;
		}
		
		if(cga.GetPlayerInfo().health != 0){
			healme(doWork);
			return;
		}
		
		var items = cga.getInventoryItems();
		var count = cga.getItemCount('鹿皮');
		if(items.length >= 20 || count >= trade_count * 40)
		{
			trade();
			return;
		}
		
		cga.travel.falan.toStone('E1', ()=>{
			cga.walkList([
			[281, 88, '芙蕾雅'],
			[596, 247]
			], ()=>{
				cga.StartWork(useskill.index, 0);
				waitEnd(trade);
			});
		});
	}
	
	doWork();
});