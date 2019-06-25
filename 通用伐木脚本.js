var cga = require('./cgaapi')(function(){
	console.log('开始执行模块：通用伐木脚本');

	var mineObject = null;
	
	var doneObject = null;
	
	var mineArray = [
	{
		level : 1,
		name : '印度轻木',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[361, 184],
				], cb);
			});
		}		
	},
	{
		level : 2,
		name : '枞',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[451, 163],
				], cb);
			});
		}
	},
	{
		level : 3,
		name : '黄月木',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[361, 182],
				], cb);
			});
		}
	},
	{
		level : 4,
		name : '铁杉',
		func : (cb)=>{
			cga.travel.falan.toWeiNuoYa((r)=>{
				cga.walkList([
					[5, 1, '村长家的小房间'],
					[0, 5, '村长的家'],
					[10, 16, '维诺亚村'],
					[67, 46, '芙蕾雅'],
					[416, 440],
				], cb);
			});
		}
	},
	{
		level : 5,
		name : '琵琶木',
		func : (cb)=>{
			cga.travel.falan.toWeiNuoYa((r)=>{
				cga.walkList([
					[5, 1, '村长家的小房间'],
					[0, 5, '村长的家'],
					[10, 16, '维诺亚村'],
					[67, 46, '芙蕾雅'],
					[347, 410],
				], cb);
			});
		}
	},
	{
		level : 6,
		name : '赤松',
		func : (cb)=>{
			cga.travel.falan.toWeiNuoYa((r)=>{
				cga.walkList([
					[5, 1, '村长家的小房间'],
					[0, 5, '村长的家'],
					[10, 16, '维诺亚村'],
					[67, 46, '芙蕾雅'],
					[400, 550],
				], cb);
			});
		}
	},
	{
		level : 10,
		name : '奥利哈钢',
		func : (cb)=>{
			cga.travel.falan.toABNSCun(function(r){
				if(!r){
					cb(r);
					return;
				}
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
			cga.travel.falan.toBank(()=>{
				cga.AsyncWaitNPCDialog(function(dlg){
					cga.saveToBankAll(mineObject.name, 40, (r)=>{
						cb(r);
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

	var skill = cga.findPlayerSkill('伐木');
	if(!skill){
		throw new Error('你没有伐木技能');
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
			var errmsg = '伐木等级不够，挖'+mineObject.name+'需要'+mineObject.level+'级伐木，而你只有'+skill.lv+'级';
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
		cga.SayWords('欢迎使用CGA通用伐木脚本，输入1存银行，输入2卖店。', 0, 3, 1);
		
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
	
	cga.SayWords('欢迎使用CGA通用伐木脚本，输入数字1~10挖1~10级木头。', 0, 3, 1);
	
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