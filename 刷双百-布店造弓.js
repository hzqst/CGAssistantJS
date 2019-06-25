var cga = require('./cgaapi')(function(){
	console.log('开始执行模块：刷双百-杖，需要轻木+铜脚本，集合地点 布店');
	
	var craft_count = 0;
	var trade_count = 5;//剩余5个格子以下开始卖东西
	var minimal_mp = 53;//回补最低蓝量
	var skill_name = '造弓';
	var learn_skill_path = [
		[7, 3, '村长的家'],
		[2, 9, '圣拉鲁卡村'],
		[32, 70, '装备品店'],
		[14, 4, '1楼小房间'],
		[9, 3, '地下工房'],
		[22, 23],
	];
	var learn_skill_npc = [23, 24];
	var delete_skill = false;//到6自动删技能

	var copper_movepos = [11, 8];
	var wood_movepos = [4, 8];

	var trade_movefunc = (cb)=>{
		
		if(cga.GetMapName()=='法兰城'){
			cb(true);
			return;
		}
		
		cga.travel.falan.toStone('C', ()=>{
			cga.walkList([
			[41, 98, '法兰城']
			], cb);
		});
	}

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

	var wait_wood = ()=>{
		
		var wait_trade_player = ()=>{
			
			var teamplayers = cga.getTeamPlayers();
							
			if(!(teamplayers.length >= 2 && teamplayers[0].is_me)){
				cga.SayWords('', 0, 3, 1);
				setTimeout(wait_wood, 1000);
				return;
			}

			var stuff = 
			{
				itemFilter : (item)=>{
					if(item.name == '印度轻木'){
						return true;
					}
					return false;
				}
			}

			cga.waitTrade(stuff, null, (result)=>{
				if(result.success == true){
					cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
					cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
					setTimeout(docraft, 1000);
				} else {
					setTimeout(wait_trade_player, 1000);
				}
			});
		}
		
		cga.WalkTo(wood_movepos[0], wood_movepos[1]);
		
		cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);
		
		setTimeout(wait_trade_player, 1000);
	}

	var wait_copper = ()=>{
		
		var wait_trade_player = ()=>{
			
			var teamplayers = cga.getTeamPlayers();

			if(!(teamplayers.length >= 2 && teamplayers[0].is_me)){
				cga.SayWords('', 0, 3, 1);
				setTimeout(wait_copper, 1000);
				return;
			}

			var stuff = 
			{
				itemFilter : (item)=>{
					if(item.name == '铜条'){
						return true;
					}
					return false;
				}
			}

			cga.waitTrade(stuff, null, (result)=>{
				if(result.success == true){
					cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
					cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
					setTimeout(docraft, 1000);
				} else {
					setTimeout(wait_trade_player, 1000);
				}
			});
		}
		
		cga.WalkTo(copper_movepos[0], copper_movepos[1]);
		
		cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);
		
		setTimeout(wait_trade_player, 1000);
	}
		
	var docraft = ()=>{
		var skill = cga.findPlayerSkill(skill_name);
		if(!skill){
			throw new Error('你没有'+skill_name+'技能');
			return;
		}
		var items = cga.getInventoryItems();
		if(items.length > 20 - trade_count){
			doWork();
			return;
		}
		if(cga.GetPlayerInfo().mp < minimal_mp){
			doWork();
			return;
		}
		if(cga.getItemCount('印度轻木') < 20){
			wait_wood();
			return;
		}
		
		if(cga.getItemCount('铜条') < 3){
			wait_copper();
			return;
		}
		
		if(cga.getItemCount('麻布') < 1){
			cga.craft.buyFabricLv1(0, 1, (r)=>{
				docraft();
			});
			return;
		}
		
		var craftItemName = '轻型弓';

		var craft = ()=>{
			
			cga.SetImmediateDoneWork((craft_count > 0) ? true : false);
			
			var r = cga.craftNamedItem(craftItemName);
			if(r != true){
				doWork();
				return;
			}
			
			cga.AsyncWaitWorkingResult(function(r){

				if(r.success){
					craft_count ++;
					console.log('已造' + craft_count + '次！');
				}
				docraft();
			}, 30000);
		}
		
		craft();
	}
	
	var learn = ()=>{
		
		if(cga.GetMapName() == '地下工房'){
			cga.TurnTo(learn_skill_npc[0], learn_skill_npc[1]);
			cga.AsyncWaitNPCDialog(function(dlg){
				cga.ClickNPCDialog(0, 0);
				cga.AsyncWaitNPCDialog(function(dlg2){
					cga.ClickNPCDialog(0, 0);
					setTimeout(doWork, 1000);
				});
			});
		} else {
			cga.travel.falan.toShengLaLuKaCun(()=>{
				cga.walkList(learn_skill_path, learn);
			});
		}
	}
	
	var forget = ()=>{
		cga.travel.falan.toShengLaLuKaCun(()=>{
			cga.walkList(learn_skill_path, ()=>{
				cga.TurnTo(learn_skill_npc[0], learn_skill_npc[1]);
				cga.AsyncWaitNPCDialog(function(dlg){
					cga.ClickNPCDialog(0, 1);
					cga.AsyncWaitNPCDialog(function(dlg2){

						var pattern = '忘记哪个技能？';
						var skill_list = dlg2.message.substr(dlg2.message.indexOf(pattern) + pattern.length);
						var reg = new RegExp(/([^|]+)/g)
						var match = skill_list.match(reg);

						var index = -1;
						for(var i = 0; i < match.length; i += 3){
							if(match[i] == skill_name){
								index = i / 3;
							}
						}
						if(index != -1){
							cga.ClickNPCDialog(0, index);
							cga.AsyncWaitNPCDialog(function(dlg3){
								cga.ClickNPCDialog(4, 0);
								craft_count = 0;
								setTimeout(learn, 1000);
							});
						}
					});
				});
			});
		});
	}
	
	var doWork = ()=>{
		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < minimal_mp)
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
		
		if(delete_skill){
			var skill = cga.findPlayerSkill(skill_name);
			if(!skill){
				learn();
				return;
			} else if(skill.lv == 6){
				forget();
				return;
			}
		}
		
		var items = cga.getInventoryItems();
		if(items.length > 20 - trade_count){
			trade_movefunc(()=>{
				cga.walkList([
				[151, 122]
				], ()=>{
					cga.TurnTo(149, 122);
					var sellarray = cga.findItemArray('轻型弓');
					cga.sellArray(sellarray, ()=>{
						setTimeout(doWork, 1000);
					});
				})
			});	
			return;
		}
		
		cga.travel.falan.toFabricStore(()=>{
			cga.walkList([
			[8, 7]
			], ()=>{
				docraft();
			})
		});
	}
	
	doWork();
});