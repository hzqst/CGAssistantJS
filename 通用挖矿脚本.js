var cga = require('./cgaapi')(function(){
	console.log('开始执行模块：通用挖矿脚本');

	var mineObject = null;
	
	var doneObject = null;
	
	var mineArray = [
	{
		level : 1,
		name : '铜',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[351, 145, '国营第24坑道 地下1楼'],
				], cb);
			});
		}		
	},
	{
		level : 2,
		name : '铁',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[351, 145, '国营第24坑道 地下1楼'],
					[22, 22, '国营第24坑道 地下2楼'],
					[22, 21],
				], (r)=>{
					cga.TurnTo(22, 20);
					setTimeout(()=>{
						cga.walkList([
							[23, 13, '国营第24坑道  地下3楼'],
							[6, 3, '国营第24坑道  地下4楼'],
							[24, 17],
						], cb);
					}, 1000);
				});
			});
		}
	},
	{
		level : 3,
		name : '银',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[351, 145, '国营第24坑道 地下1楼'],
					[22, 22, '国营第24坑道 地下2楼'],
					[22, 21],
				], (r)=>{
					cga.TurnTo(22, 20);
					setTimeout(()=>{
						cga.walkList([
							[23, 13, '国营第24坑道  地下3楼'],
							[29, 3, '国营第24坑道  地下4楼'],
							[19, 36],
						], cb);
					}, 1000);				
				});
			});
		}
	},
	{
		level : 4,
		name : '纯银',
		func : (cb)=>{
			cga.travel.falan.toStone('S', (r)=>{
				cga.walkList([
					[153, 241, '芙蕾雅'],
					[473, 316],
				], function(r){
					cga.TurnTo(471, 316);
					cga.AsyncWaitNPCDialog(function(dlg){
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, function(r){
							cga.walkList([
							[49, 66],
							], cb);	
						});					
					});					
				});
			});
		}
	},
	{
		level : 5,
		name : '金',
		func : (cb)=>{
			cga.travel.falan.toStone('S', (r)=>{
				cga.walkList([
					[153, 241, '芙蕾雅'],
					[473, 316],
				], function(r){
					cga.TurnTo(471, 316);
					cga.AsyncWaitNPCDialog(function(dlg){
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, function(r){
							cga.walkList([
							[52, 11],
							], cb);	
						});					
					});					
				});
			});
		}
	},
	{
		level : 6,
		name : '白金',
		func : (cb)=>{
			cga.travel.falan.toStone('S', (r)=>{
				cga.walkList([
					[153, 241, '芙蕾雅'],
					[473, 316],
				], function(r){
					cga.TurnTo(471, 316);
					cga.AsyncWaitNPCDialog(function(dlg){
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, function(r){
							cga.walkList([
							[8, 69],
							], cb);	
						});					
					});					
				});
			});
		}
	},
	{
		level : 7,
		name : '幻之钢条',
		func : (cb)=>{
			cga.travel.falan.toJieNuoWa((r)=>{
				cga.walkList([
					[14, 6, '村长的家'],
					[1, 9, '杰诺瓦镇'],
					[24, 39, '莎莲娜'],
					[196, 443, '莎莲娜海底洞窟 地下1楼'],
					[14, 41, '莎莲娜海底洞窟 地下2楼'],
					[11, 47],
				], cb);
			});
		}
	},
	{
		level : 8,
		name : '幻之银条',
		func : (cb)=>{
			cga.travel.falan.toJieNuoWa((r)=>{
				cga.walkList([
					[14, 6, '村长的家'],
					[1, 9, '杰诺瓦镇'],
					[24, 39, '莎莲娜'],
					[196, 443, '莎莲娜海底洞窟 地下1楼'],
					[14, 41, '莎莲娜海底洞窟 地下2楼'],
					[11, 47],
				], cb);
			});
		}
	},
	{
		level : 9,
		name : '勒格耐席鉧条',
		func : (cb)=>{
			cga.travel.falan.toABNSCun((r)=>{
				cga.walkList([
					[5, 4, '村长的家'],
					[6, 13, 4312],
					[6, 13, '阿巴尼斯村'],
					[37, 71, '莎莲娜'],
					[258, 180, '莎莲娜西方洞窟'],
					[30, 44, 14001],
					[67, 36],
				], cb);
			});
		}
	},
	{
		level : 10,
		name : '奥利哈钢',
		func : (cb)=>{
			cga.travel.falan.toABNSCun((r)=>{
				cga.walkList([
					[5, 4, '村长的家'],
					[6, 13, 4312],
					[6, 13, '阿巴尼斯村'],
					[37, 71, '莎莲娜'],
					[258, 180, '莎莲娜西方洞窟'],
					[30, 44, 14001],
					[51, 43],
				], cb);
			});
		}
	},
	];
	
	var saveBankObject = {
		name: '存银行',
		func: (cb)=>{
			cga.travel.falan.toMineStore(mineObject.name, ()=>{
				cga.AsyncWaitNPCDialog(function(dlg){
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(function(dlg2){
						var exchangeCount = cga.getItemCount(mineObject.name) / 20;
						var r = cga.BuyNPCStore([{index:0, count:exchangeCount}]);
						cga.AsyncWaitNPCDialog(function(dlg3){
							cga.travel.falan.toBank(()=>{
								cga.AsyncWaitNPCDialog(function(dlg){
									cga.saveToBankAll(mineObject.name+'条', 20, (r)=>{
										cb(r);
									});
								});
							});
						});
					});
				});
			});
		}
	}

	var sellStoreObject = {
		name: '卖店',
		func: (cb)=>{
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
				[30, 79],
				], ()=>{
					cga.TurnTo(30, 77);
					cga.AsyncWaitNPCDialog(function(dlg){			
						cga.ClickNPCDialog(0, 0);
						cga.AsyncWaitNPCDialog(function(dlg2){
							var sellarray = cga.findItemArray(mineObject.name);
							var sellarray2 = sellarray.map((item)=>{
								item.count /= 20;
								return item;
							});
							cga.SellNPCStore(sellarray2);
							cga.AsyncWaitNPCDialog(function(dlg3){
								cga.walkList([
								[27, 82]
								], ()=>{
									cb(true);									
								});
							});
						});
					});
				});
			});
		}
	}

	var skill = cga.findPlayerSkill('挖掘');
	if(!skill){
		throw new Error('你没有挖掘技能');
		return;
	}

	var healme = function(cb){
		
		var skill_heal = cga.findPlayerSkill('治疗');
		if(!skill_heal){
			throw new Error('你没有治疗技能');
			return;
		}
		var requiremp = 25 + skill_heal.lv * 5;
		
		if (cga.GetPlayerInfo().mp < requiremp){
			cb(true);
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
	
	var doWork = null;

	var waitEnd = (cb2)=>{
		cga.AsyncWaitWorkingResult(function(r){
			var playerInfo = cga.GetPlayerInfo();
			if(playerInfo.mp == 0)
			{
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						doWork();
					}, 3000);
				});
				return;
			}
			var items = cga.getInventoryItems();
			if(items.length >= 20)
			{
				doneObject.func(cb2);
				return;
			}
			if(playerInfo.health > 0){
				healme(()=>{
					cga.StartWork(skill.index, 0);
					waitEnd(cb2);
				});
				return;
			}
			waitEnd(cb2);
		}, 10000);
	}

	doWork = ()=>{
		
		if(skill.lv < mineObject.level){
			var errmsg = '挖掘等级不够，挖'+mineObject.name+'需要'+mineObject.level+'级挖掘，而你只有'+skill.lv+'级';
			cga.SayWords(errmsg , 0, 3, 1);
			throw new Error(errmsg);
			return;
		}
		
		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < playerInfo.maxmp)
		{
			cga.travel.falan.toCastleHospital(()=>{
				setTimeout(()=>{
					doWork();
				}, 3000);
			});
			return;
		}
		
		var items = cga.getInventoryItems();
		if(items.length >= 20)
		{
			doneObject.func(doWork);
			return;
		}
		
		mineObject.func(()=>{
			cga.StartWork(skill.index, 0);
			waitEnd((r)=>{
				if(r){
					doWork();
					return;
				}
			});
		});
	}

	var wait2 = ()=>{
		cga.SayWords('欢迎使用CGA通用挖矿脚本，输入1存银行，输入2卖店。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				if(msg == '1'){
					doneObject = saveBankObject;
				}
				else if(msg == '2'){
					doneObject = sellStoreObject;
				}
				
				if(doneObject != null){
					cga.SayWords('您选择了'+doneObject.name+'。', 0, 3, 1);
					doWork();
					return false;
				}
			}

			return true;
		});
	}
	
	cga.SayWords('欢迎使用CGA通用挖矿脚本，输入数字1~10挖1~10级矿。', 0, 3, 1);
	
	cga.waitTeammateSay((player, msg)=>{

		if(player.is_me == true){
			
			for(var i in mineArray){
				if(mineArray[i].level == parseInt(msg)){
					mineObject = mineArray[i];
					break;
				}
			}
			
			if(mineObject != null){
				cga.SayWords('您选择了挖'+mineObject.name+'。', 0, 3, 1);
				wait2();				
				return false;
			}
		}

		return true;
	});
});