var cga = require('bindings')('node_cga');	
var moment = require('moment');
var PF = require('pathfinding');

var is_array_contain = function(arr, val)
{
    for (var i = 0; i < arr.length; i++)
    {
		if (arr[i] == val)
		{
			return true;
		}
    }
	
	return false;
}

module.exports = function(callback){
	var port = 4396;
	if(process.argv.length >= 3)
		port = process.argv[2];
	cga.AsyncConnect(port, function(result){
		if(!result){
			throw new Error('Failed to connect to game.');
			return;
		}
		callback();
	});
	
	cga.TRADE_STUFFS_ITEM = 1;
	cga.TRADE_STUFFS_PET = 2;
	cga.TRADE_STUFFS_GOLD = 4;

	cga.REQUEST_TYPE_PK = 1;
	cga.REQUEST_TYPE_JOINTEAM = 3;
	cga.REQUEST_TYPE_EXCAHNGECARD = 4;
	cga.REQUEST_TYPE_TRADE = 5;
	cga.REQUEST_TYPE_KICKTEAM = 11;
	cga.REQUEST_TYPE_LEAVETEAM = 12;
	cga.REQUEST_TYPE_TRADE_CONFIRM = 13;
	cga.REQUEST_TYPE_TRADE_REFUSE = 14;
	
	cga.ENABLE_FLAG_PK = 0;
	cga.ENABLE_FLAG_TEAMCHAT = 1;
	cga.ENABLE_FLAG_JOINTEAM = 2;
	cga.ENABLE_FLAG_CARD = 3;
	cga.ENABLE_FLAG_TRADE = 4;
	cga.ENABLE_FLAG_FAMILY = 5;
	
	cga.TRADE_STATE_CANCEL = 0;
	cga.TRADE_STATE_READY = 1;
	cga.TRADE_STATE_CONFIRM = 2;
	cga.TRADE_STATE_SUCCEED = 3;
	
	cga.FL_BATTLE_ACTION_ISPLAYER = 1;
	cga.FL_BATTLE_ACTION_ISDOUBLE = 2;
	cga.FL_BATTLE_ACTION_ISSKILLPERFORMED = 4;
	cga.FL_BATTLE_ACTION_END = 8;

	cga.FL_SKILL_SELECT_TARGET = 0x1;
	cga.FL_SKILL_SELECT_DEAD = 0x2;
	cga.FL_SKILL_TO_PET = 0x4;
	cga.FL_SKILL_TO_SELF = 0x8;
	cga.FL_SKILL_TO_TEAMMATE = 0x10;
	cga.FL_SKILL_TO_ENEMY = 0x20;
	cga.FL_SKILL_SINGLE = 0x40;
	cga.FL_SKILL_MULTI = 0x80;
	cga.FL_SKILL_ALL = 0x100;
	cga.FL_SKILL_BOOM = 0x200;
	cga.FL_SKILL_FRONT_ONLY = 0x400;

	cga.isInBattle = function(){
		return (cga.GetWorldStatus() == 10) ? true : false;
	}
	
	cga.isInNormalState = function(){
		return (cga.GetWorldStatus() == 9 && cga.GetGameStatus() == 3) ? true : false;
	}
	
	//deprecated
	cga.keepStartWork = function(skill_index, subskill_index){
		var started = cga.StartWork(skill_index, subskill_index);
		return setInterval(function(){
			if(cga.GetGameStatus() != 3 || cga.GetWorldStatus() != 9)
				started = false;
			if(!started)
			{
				if(cga.GetGameStatus() == 3 && cga.GetWorldStatus() == 9)
					started = cga.StartWork(skill_index, subskill_index);
			}
		}, 1000);
	}

	cga.getItemCraftInfo = function(itemname){
		var skills = cga.GetSkillsInfo();
		for(var i in skills){
			if(skills[i].type == 1){
				var crafts = cga.GetCraftsInfo(skills[i].index);
				for(var j in crafts){
					if(crafts[j].name == itemname){
						return {skill : skills[i], craft : crafts[j]};
					}
				}
			}
		}
		return null;
	}

	//鉴定物品，参数：物品位置
	//返回：true / false
	cga.assessItem = function(itempos){
		var skill = cga.findPlayerSkill('鉴定');
		if(skill){
			if(cga.StartWork(skill.index, 0))
				return cga.AssessItem(skill.index, itempos);
		}
		return false;
	}
	
	//修理武器，参数：物品位置
	//返回：true / false
	cga.repairWeapon = function(itempos){
		var skill = cga.findPlayerSkill('修理武器');
		if(skill){
			if(cga.StartWork(skill.index, 0))
				return cga.AssessItem(skill.index, itempos);
		}
		return false;
	}
	
	//修理防具，参数：物品位置
	//返回：true / false
	cga.repairArmor = function(itempos){
		var skill = cga.findPlayerSkill('修理防具');
		if(skill){
			if(cga.StartWork(skill.index, 0))
				return cga.AssessItem(skill.index, itempos);
		}
		return false;
	}
	
	//制造物品，参数：物品名
	cga.craftNamedItem = function(itemname){

		var info = cga.getItemCraftInfo(itemname);
		if(!info)
			return new Error('你没有制造 '+itemname+' 的技能');
		
		var items = cga.getInventoryItems();
		var arr = new Array();
		
		for(var j in info.craft.materials){
			var found = false;
			var required_item = info.craft.materials[j].name;
			
			for(var i in items){
				if(items[i].itemid == info.craft.materials[j].itemid &&
				items[i].count >= info.craft.materials[j].count){
					arr.push(items[i].pos);
					found = true;
					break;
				}
			}
			if(!found){
				return new Error('制造' +itemname+' 所需物品 ' +required_item+'不足！');
			}
		}
		//console.log(info.skill.index);
		//console.log(info.craft.index);
		//console.log(arr);
		cga.StartWork(info.skill.index, info.craft.index);
		cga.CraftItem(info.skill.index, info.craft.index, 0, arr);
		return true;
	}

	cga.getInventoryItems = function(){
		var items = cga.GetItemsInfo();
		var newitems = new Array();
		for(var i in items)
		{
			if(items[i].pos >= 8)
				newitems.push(items[i]);
		}
		return newitems;
	}
	
	cga.getEquipItems = function(){
		var items = cga.GetItemsInfo();
		var newitems = new Array();
		for(var i in items)
		{
			if(items[i].pos < 8)
				newitems.push(items[i]);
		}
		return newitems;
	}
	
	cga.getEquipEndurance = (item)=>{
		var regex = item.attr.match(/\$4耐久 (\d+)\/(\d+)/);
		if(regex && regex.length >= 3){
			return [parseInt(regex[1]), parseInt(regex[2])];
		}
		return null;
	}
	
	cga.useItemForMyPet = function(itempos){
		var player = cga.GetPlayerInfo();
		var pet = cga.GetPetInfo(player.petid);
		cga.AsyncUseItemFor(itempos, function(players){
			if(players == false){
				console.log('AsyncUseItemFor failed');
				return;
			}
			for(var i in players){
				if(players[i].name == player.name) {
					cga.AsyncUseItemSelectPlayer(i, function(units) {
						if(units == false) {
							console.log('AsyncUseItemSelectPlayer failed');
							return;
						}
						for(var i in units) {
							if(units[i].name == pet.name) {
								cga.UseItemSelectUnit(units[i].index);
								return;
							}
						}
						console.log('AsyncUseItemSelectPlayer pet not found');
					});
					return;
				}
			}
			console.log('AsyncUseItemFor player not found');
		});
	}
		
	//参数： 方向, 0=右上，2=右下, 4=左下，6=左上
	cga.turnDir = function(dir){
		var xy = cga.GetMapXY();
		var x = xy.x;
		var y = xy.y;
		switch(dir){
			case 0: cga.TurnTo(x+2, y);break;
			case 1: cga.TurnTo(x+2, y+2);break;
			case 2: cga.TurnTo(x, y+2);break;
			case 3: cga.TurnTo(x-2, y+2);break;
			case 4: cga.TurnTo(x-2, y);break;
			case 5: cga.TurnTo(x-2, y-2);break;
			case 6: cga.TurnTo(x, y-2);break;
			case 7: cga.TurnTo(x+2, y-2);break;
			default: throw new Error('Invalid direction');
		}
	}
	
	cga.travel = {};
	
	cga.travel.falan = {};
	
	cga.travel.falan.xy2name = function(x, y){
		if(x == 242 && y == 100)
			return 'E1';
		if(x == 141 && y == 148)
			return 'S1';
		if(x == 63 && y == 79)
			return 'W1';
		if(x == 233 && y == 78)
			return 'E2';
		if(x == 162 && y == 130)
			return 'S2';
		if(x == 72 && y == 123)
			return 'W2';
		return false;
	}
	
	cga.travel.falan.isvalid = function(stone){
		switch(stone.toUpperCase()){
			case 'E': return true;
			case 'S': return true;
			case 'W': return true;
			case 'E1': return true;
			case 'S1': return true;
			case 'W1': return true;
			case 'E2': return true;
			case 'S2': return true;
			case 'W2': return true;
			case 'M1': return true;//市场
			case 'M3': return true;
			case 'C': return true;//里谢里雅堡
		}
		return false;
	}
	
	cga.travel.falan.name2xy = function(stone){
		switch(stone.toUpperCase()){
			case 'E1': return [242, 100];
			break;
			case 'S1': return [141, 148];
			break;
			case 'W1': return [63, 79];
			break;
			case 'E2': return [233, 78];
			break;
			case 'S2': return [162, 130]
			break;
			case 'W2': return [72, 123];
			break;
			case 'M3': return [46, 16];
			break;	
			case 'M1': return [46, 16];
			break;
		}
		return false;
	}

	cga.travel.falan.toStoneInternal = function(stone, cb, r){
		if(!r){
			cb(false);
			return;
		}
		var curXY = cga.GetMapXY();
		var curMap = cga.GetMapName();
		const desiredMap = ['法兰城','里谢里雅堡','艾尔莎岛','市场一楼 - 宠物交易区','市场三楼 - 修理专区'];
		if(curMap == '法兰城'){
			if(stone == 'C'){
				cga.travel.falan.toCastle(cb);
				return;
			}
			
			var curStone = cga.travel.falan.xy2name(curXY.x, curXY.y);
			if(curStone) {
				var turn = false;
				if(stone.length >= 2 && curStone.charAt(1) == stone.charAt(1)) {
					if(curStone == stone){
						cb(true);
						return;
					}
					turn = true;
				} else if(stone.length < 2){
					if(curStone.charAt(0) == stone.charAt(0)){
						cb(true);
						return;
					}
					turn = true;
				}
				if(turn){
					switch(curStone){
						case 'E2':cga.turnDir(6);break;
						case 'S2':cga.turnDir(0);break;
						case 'W2':cga.turnDir(0);break;
						case 'E1':cga.turnDir(0);break;
						case 'S1':cga.turnDir(6);break;
						case 'W1':cga.turnDir(6);break;
					}
					cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
						cga.travel.falan.toStoneInternal(stone, cb, r);
					});
					return;
				}
			}
		}
		
		if(curMap.indexOf('市场') >= 0 && curXY.x == 46 && curXY.y == 16){
			cga.turnDir(6);
			cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
				cga.travel.falan.toStoneInternal(stone, cb, r);
			});
			return;
		}
		if(curMap == '艾尔莎岛' && curXY.x == 140 && curXY.y == 105){
			cga.turnDir(7);
			cga.AsyncWaitNPCDialog(function(dlg){
				cga.ClickNPCDialog(4, -1);
				cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
					cga.travel.falan.toStoneInternal(stone, cb, r);
				});
			});
			return;
		}
		if(curMap == '里谢里雅堡' && curXY.x == 41){//&& curXY.y == 91
			if(stone == 'C'){
				cb(true);
				return;
			}
			var walks = null;
			const walkOutOfCastle_1 = [
				[41, 98, '法兰城'],
				[141, 148]
			];
			const walkOutOfCastle_2 = [
				[40, 98, '法兰城'],
				[162, 130]
			];
			if(stone.length == 1)
				walks = walkOutOfCastle_2;
			else if(stone.length >= 2 && stone.charAt(1) == '1')
				walks = walkOutOfCastle_1; 
			else
				walks = walkOutOfCastle_2;

			cga.walkList(walks, function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.travel.falan.toStoneInternal(stone, cb, true);
			});
			return;
		}
		if(curMap == '里谢里雅堡' && curXY.x >= 33 && curXY.x <= 35 && curXY.y >= 87 && curXY.y <= 90 ){//&& stone == 'C'
			cga.walkList([
			[41, 91],
			]
			, function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.travel.falan.toStoneInternal(stone, cb, true);
			});
			return;
		}
		if(curMap == '里谢里雅堡' && curXY.x == 27 && curXY.y == 82){
			if(stone == 'C'){
				cb(true);
				return;
			}
			var walks = null;
			const walkOutOfCastle_1 = [
				[40, 98, '法兰城'],
				[141, 148]
			];
			const walkOutOfCastle_2 = [
				[40, 98, '法兰城'],
				[162, 130]
			];
			if(stone.length == 1)
				walks = walkOutOfCastle_2;
			else if(stone.length >= 2 && stone.charAt(1) == '1')
				walks = walkOutOfCastle_1;
			else
				walks = walkOutOfCastle_2;

			cga.walkList(walks, function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.travel.falan.toStoneInternal(stone, cb, true);
			});
			return;
		}
		//重新回城
		cga.LogBack();
		cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
			cga.travel.falan.toStoneInternal(stone, cb, r);
		});
	}
	
	//参数1：传送石名称，有效参数：E1 S1 W1 E2 S2 W2 M1(道具-市场1楼) M3(道具-市场3楼)
	//参数2：回调函数function(result), result 为true或false
	cga.travel.falan.toStone = function(stone, cb){
		if(!cga.travel.falan.isvalid(stone)){
			cb(false);
			return;
		}
		
		cga.travel.falan.toStoneInternal(stone, cb, true);
	}
		
	//前往到法兰城东医院
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toEastHospital = function(cb){
		cga.travel.falan.toStone('E', function(r){
			if(!r){
				cb(false);
				return;
			}
			
			cga.walkList([
			[221, 83, '医院']
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		});
	}
	
	//前往到法兰城西医院
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toWestHospital = function(cb){
		cga.travel.falan.toStone('W', function(r){
			if(!r){
				cb(false);
				return;
			}
			
			cga.walkList([
			[82, 83, '医院']
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		});
	}
	
	//前往到法兰城银行
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toBank = function(cb){
		
		if(cga.GetMapName() == '银行'){
			const walkTo = [
				[11, 8],
			];
			cga.walkList(walkTo, function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.TurnTo(12, 8);
				cb(true);
			});
			return;
		}
		
		cga.travel.falan.toStone('E', function(r){
			if(!r){
				cb(false);
				return;
			}

			var xy = cga.GetMapXY();
			var stone = cga.travel.falan.xy2name(xy.x, xy.y);
			cga.walkList([
			[238, 111, '银行'],
			[11, 8],
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.TurnTo(12, 8);
				cb(true);
			});
		});
	}
	
	//从法兰城到里谢里雅堡，启动地点：登出到法兰城即可
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toCastle = function(cb){
		cga.travel.falan.toStone('S', function(r){
			if(!r){
				cb(false);
				return;
			}
			cga.walkList([
			[154, 100, '里谢里雅堡']
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		});
	}
	
	cga.travel.falan.toCastleHospital = function(cb){
		
		if(cga.GetMapName() == '里谢里雅堡'){
			var pos = cga.GetMapXY();
			if(pos.x == 34 && pos.y == 89)
			{
				cga.TurnTo(36, 87);
				cb(true);
				return;
			}
		}
		
		cga.travel.falan.toStone('C', (r)=>{
			if(!r){
				cb(false);
				return;
			}
			cga.walkList([
			[34, 89]
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.TurnTo(36, 87);
				cb(true);
			});	
		});	
	}
	
	cga.travel.falan.toCastleClock = function(cb){
		cga.travel.falan.toStone('C', (r)=>{
			if(!r){
				cb(false);
				return;
			}
			cga.walkList([
			[58, 83]
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.TurnTo(58, 84);
				cga.AsyncWaitNPCDialog(function(dlg){
					if(dlg.options == 12){
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitNPCDialog(function(dlg2){
							cb(true);
						});
					} else {
						cb(true);
					}
				});
			});
		});	
	}

	cga.travel.falan.toCamp = (cb)=>{
		cga.travel.falan.toStone('S', (r)=>{
			if(cga.getItemCount('承认之戒') > 0){
				var list = [
				[153, 241, '芙蕾雅'],
				[513,282, '曙光骑士团营地'],
				[55,47, '辛希亚探索指挥部'],
				[7,4, '辛希亚探索指挥部', 91, 6],
				[95, 9, 27101],
				[8, 21],
				];
				
				var teamplayers = cga.getTeamPlayers();
				var isTeamLeader = teamplayers.length > 0 && teamplayers[0].is_me == true ? true : false;
				
				if(isTeamLeader){
					list.push(
					[8, 21],
					[8, 22],
					[8, 21],
					[8, 22],
					[8, 21],
					);
				}
				
				cga.walkList(list, (r)=>{
					
					var go = ()=>{
						cga.TurnTo(7, 21);
						cga.AsyncWaitMovement({map:'圣骑士营地', delay:1000, timeout:5000}, cb);
					}
					
					if(isTeamLeader){
						setTimeout(()=>{
							cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
							setTimeout(go, 1500);
						}, 1500);
					} else {
						go();
					}
				});
			} else {
				cga.walkList([
				[153, 241, '芙蕾雅'],
				], cb);
			}
		});
	}

	cga.travel.falan.toFabricStore = (cb)=>{
		if(cga.GetMapName()=='流行商店'){
			cb(true);
			return;
		}
		
		cga.travel.falan.toStone('S1', function(r){
			cga.walkList([
				[117, 112, '流行商店'],
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		});
	}
	
	cga.travel.falan.toAssessStore = (cb)=>{
		if(cga.GetMapName()=='凯蒂夫人的店'){
			cb(true);
			return;
		}
		
		cga.travel.falan.toStone('E2', function(r){
			cga.walkList([
				[196, 78, '凯蒂夫人的店'],
			], function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		});
	}
	
	cga.travel.falan.toMineStore = (mine, cb)=>{
		var mineExchange = null;
		if(mine == '铜'){
			mineExchange = (cb2)=>{
				cga.walkList([[26, 5]], function(r){
					cga.TurnTo(26, 4);
					cb2(true);
				});
			}
		}
		if(mine == '铁'){
			mineExchange = (cb2)=>{
				cga.walkList([[28, 6]], function(r){
					cga.TurnTo(28, 5);
					cb2(true);
				});
			}
		}
		if(mine == '银'){
			mineExchange = (cb2)=>{
				cga.walkList([[29, 6]], function(r){
					cga.TurnTo(30, 5);
					cb2(true);
				});
			}
		}
		if(mine == '纯银'){
			mineExchange = (cb2)=>{
				cga.walkList([[27, 7]], function(r){
					cga.TurnTo(27, 5);
					cb2(true);
				});
			}
		}
		if(mine == '金'){
			mineExchange = (cb2)=>{
				cga.walkList([[24, 6]], function(r){
					cga.TurnTo(24, 5);
					cb2(true);
				});
			}
		}
		if(mine == '白金'){
			mineExchange = (cb2)=>{
				cga.walkList([[29, 6]], function(r){
					cga.TurnTo(30, 7);
					cb2(true);
				});
			}
		}
		if(mine == '幻之钢'){
			mineExchange = (cb2)=>{
				cga.walkList([[26, 11]], function(r){
					cga.TurnTo(30, 7);
					cb2(true);
				});
			}
		}
		if(mine == '幻之银'){
			mineExchange = (cb2)=>{
				cga.walkList([[27, 9]], function(r){
					cga.TurnTo(28, 8);
					cb2(true);
				});
			}
		}
		if(mine == '勒格耐席姆'){
			mineExchange = (cb2)=>{
				cga.walkList([[23, 7]], function(r){
					cga.TurnTo(22, 6);
					cb2(true);
				});
			}
		}
		if(mine == '奥利哈钢'){
			mineExchange = (cb2)=>{
				cga.walkList([[26, 12]], function(r){
					cga.TurnTo(27, 12);
					cb2(true);
				});
			}
		}
		if(cga.GetMapName()=='米克尔工房'){
			if(mineExchange){
				mineExchange(()=>{
					cb(true);
				});
			}else{
				cb(true);
			}
			return;
		}
		
		cga.travel.falan.toStone('W1', function(r){
			cga.walkList([
				[100, 61, '米克尔工房'],
			], function(r){
				if(mineExchange){
					mineExchange(()=>{
						cb(true);
					});
				}else{
					cb(true);
				}
			});
		});
	}

	//从法兰城到新城，启动地点：登出到法兰城即可
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toNewIsland = function(cb){
		cga.travel.falan.toStone('C', function(r){
			if(!r){
				cb(false);
				return;
			}
			const walkTo = [
				[28, 88]
			];
			cga.walkList(walkTo, function(r){
				if(!r){
					cb(false);
					return;
				}
				setTimeout(function(){
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(function(dlg2){
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(function(dlg3){
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(function(dlg4){
								cga.ClickNPCDialog(32, -1);
								cga.AsyncWaitNPCDialog(function(dlg5){
									if(dlg5.options == 12){											
										cga.ClickNPCDialog(4, -1);
										cga.AsyncWaitMovement({map:'？'}, function(r){
											const walkTo_1 = [
												[19, 21, '法兰城遗迹'],
												[96, 138, '盖雷布伦森林'],
												[124, 168, '温迪尔平原'],
												[264, 108, '艾尔莎岛'],
												[141, 105]
											];
														
											cga.walkList(walkTo_1, function(r){
												if(!r){
													cb(false);
													return;
												}
												cb(true);
											});
										});
									} else {
										cb(false);
									}
								});
							});
						});
					});
				}, 1000);	
			});
		});	
	}
		
	//前往启程之间
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toTeleRoom = (cb)=>{
		cga.travel.falan.toStone('C', (r)=>{
			if(!r){
				cb(false);
				return;
			}
			cga.walkList([
			[41, 50, '里谢里雅堡 1楼'],
			[45, 20, '启程之间'],
			], (r)=>{
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		});
	}
	
	//前往亚留特村
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toYaliute = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}
			cga.walkList([
			[44, 23]
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				cga.TurnTo(44,20);
				cga.AsyncWaitNPCDialog(function(dlg){
					if(dlg.message.indexOf('费用是') == -1){
						cb(false, new Error('无法使用前往亚留特村的传送石'));
						return;
					}
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'亚留特村的传送点', delay:1000, timeout:5000}, function(r){
						cb(r);
						return;
					});
				});
			});
		});
	}
	
	//去伊尔村
	cga.travel.falan.toYiErCun = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}
			cga.walkList([
			[44, 33]
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				cga.TurnTo(44,32);
				cga.AsyncWaitNPCDialog(function(dlg){
					if(dlg.message.indexOf('个金币') == -1){
						cb(false, new Error('无法使用前往伊尔村的传送石'));
						return;
					}
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'伊尔村的传送点', delay:1000, timeout:5000}, function(r){
						cb(r);
						return;
					});
				});
			});
		});
	}
	
	//去圣拉鲁卡村
	cga.travel.falan.toShengLaLuKaCun = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}
		
			cga.walkList([
			[43, 44],
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				cga.TurnTo(45,42);
				cga.AsyncWaitNPCDialog(function(dlg){
					if(dlg.message.indexOf('个金币') == -1){
						cb(false, new Error('无法使用前往圣拉鲁卡村的传送石'));
						return;
					}
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'圣拉鲁卡村的传送点', delay:1000, timeout:5000}, function(r){
						cb(r);
						return;
					});
				});
			});
		});
	}
		
	//前往维诺亚村
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toWeiNuoYa = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}

			var teamplayers = cga.getTeamPlayers();
			var isTeamLeader = teamplayers.length > 0 && teamplayers[0].is_me == true ? true : false;

			cga.walkList(
			isTeamLeader ? 
			[
			[9, 22],
			[9, 23],
			[9, 22],
			[9, 23],
			[9, 22],
			]
			:
			[
			[9, 22],
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				var go = ()=>{
					cga.TurnTo(8, 22);
					cga.AsyncWaitNPCDialog(function(dlg){
						if(dlg.message.indexOf('费用是') == -1){
							cb(false, new Error('无法使用前往维诺亚村的传送石'));
							return;
						}
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'维诺亚村的传送点', delay:1000, timeout:5000}, function(r){
							cb(r);
							return;
						});
					});
				}
				if(isTeamLeader){
					setTimeout(()=>{
						cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						setTimeout(go, 1500);
					}, 1500);
				} else {
					go();
				}
			});
		});
	}
		
	//前往奇利村
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toQiLiCun = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}
		
			var teamplayers = cga.getTeamPlayers();
			var isTeamLeader = teamplayers.length > 0 && teamplayers[0].is_me == true ? true : false;

			cga.walkList(
			isTeamLeader ? 
			[
			[9, 33],
			[8, 33],
			[9, 33],
			[8, 33],
			[9, 33],
			]
			:
			[
			[9, 33],
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				var go = ()=>{
					cga.TurnTo(8, 32);
					cga.AsyncWaitNPCDialog(function(dlg){
						if(dlg.message.indexOf('利用需要') == -1){
							cb(false, new Error('无法使用前往奇利的传送石'));
							return;
						}
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'奇利村的传送点', delay:1000, timeout:5000}, function(r){
							cb(r);
							return;
						});
					});
				}
				if(isTeamLeader){
					setTimeout(()=>{
						cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						setTimeout(go, 1500);
					}, 1500);
				} else {
					go();
				}
			});
		});
	}
		
	//前往加纳村
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toJiaNaCun = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}
		
			var teamplayers = cga.getTeamPlayers();
			var isTeamLeader = teamplayers.length > 0 && teamplayers[0].is_me == true ? true : false;

			cga.walkList(
			isTeamLeader ? 
			[
			[9, 44],
			[8, 44],
			[9, 44],
			[8, 44],
			[9, 44],
			]
			:
			[
			[9, 44],
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				var go = ()=>{
					cga.TurnTo(8, 43);
					cga.AsyncWaitNPCDialog(function(dlg){
						if(dlg.message.indexOf('费用是') == -1){
							cb(false, new Error('无法使用前往加纳村的传送石'));
							return;
						}
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'加纳村的传送点', delay:1000, timeout:5000}, function(r){
							cb(r);
							return;
						});
					});
				}
				if(isTeamLeader){
					setTimeout(()=>{
						cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						setTimeout(go, 1500);
					}, 1500);
				} else {
					go();
				}
			});
		});
	}
		
	//前往杰诺瓦村
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toJieNuoWa = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}
			
			var teamplayers = cga.getTeamPlayers();
			var isTeamLeader = teamplayers.length > 0 && teamplayers[0].is_me == true ? true : false;

			cga.walkList(
			isTeamLeader ? 
			[
			[15, 4],
			[15, 5],
			[15, 4],
			[15, 5],
			[15, 4],
			]
			:
			[
			[15, 4],
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				
				var go = ()=>{
					cga.TurnTo(16, 4);
					cga.AsyncWaitNPCDialog(function(dlg){
						if(dlg.message.indexOf('费用是') == -1){
							cb(false, new Error('无法使用前往杰诺瓦镇的传送石'));
							return;
						}
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'杰诺瓦镇的传送点', delay:1000, timeout:5000}, function(r){
							cb(r);
							return;
						});
					});
				}
				if(isTeamLeader){
					setTimeout(()=>{
						cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						setTimeout(go, 1500);
					}, 1500);
				} else {
					go();
				}
			});
		});
	}
	
	//前往阿巴尼斯村
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toABNSCun = function(cb){
		cga.travel.falan.toTeleRoom(function(r){
			if(!r){
				cb(r);
				return;
			}
			
			var teamplayers = cga.getTeamPlayers();
			var isTeamLeader = teamplayers.length > 0 && teamplayers[0].is_me == true ? true : false;

			cga.walkList(
			isTeamLeader ? 
			[
			[37, 4],
			[37, 5],
			[37, 4],
			[37, 5],
			[37, 4],
			]
			:
			[
			[37, 4],
			], function(r){
				if(!r){
					cb(r);
					return;
				}
				var go = ()=>{
					cga.TurnTo(38, 4);
					cga.AsyncWaitNPCDialog(function(dlg){
						if(dlg.message.indexOf('利用需要') == -1){
							cb(false, new Error('无法使用前往阿巴尼斯村的传送石'));
							return;
						}
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:'阿巴尼斯村的传送点', delay:1000, timeout:5000}, function(r){
							cb(r);
							return;
						});
					});
				}
				if(isTeamLeader){
					setTimeout(()=>{
						cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						setTimeout(go, 1500);
					}, 1500);
				} else {
					go();
				}
			});
		});
	}

	//前往传送石。出发地：任何地方。
	//参数1：传送石所在城市名，如：法兰城
	//参数2：传送石名称
	//参数3：回调函数function(result), result 为true或false
	cga.travel.toStone = function(city, stone, cb){
		switch(city){
			case '法兰城':
				cga.travel.falan.toStone(stone, cb);
				return;
			case '法兰城到新城':
				cga.travel.falan.toNewIsland(cb);
				return;
		}
		cb(false);
	}
	
	//前往该城市。出发地：任何地方。
	//参数1：城市名，如：艾尔莎岛
	//参数2：回调函数function(result), result 为true或false
	cga.travel.toCity = function(city, cb){
		switch(city){
			case '新城':case '艾尔莎岛':
				cga.travel.falan.toNewIsland(cb);
				return;
		}
		cb(false);
	}
	
	cga.travel.newisland = {};
		
	cga.travel.newisland.isSettled = true;
	
	cga.travel.newisland.xy2name = function(x, y){
		if(x == 140 && y == 105)
			return 'X';
		if(x == 158 && y == 94)
			return 'A';
		if(x == 84 && y == 112)
			return 'B';
		if(x == 164 && y == 159)
			return 'C';
		if(x == 151 && y == 97)
			return 'D';
		return false;
	}
	
	cga.travel.newisland.isvalid = function(stone){
		switch(stone.toUpperCase()){
			case 'A': return true;
			case 'B': return true;
			case 'C': return true;
			case 'D': return true;
			case 'X': return true;
		}
		return false;
	}
	
	cga.travel.newisland.name2xy = function(stone){
		switch(stone.toUpperCase()){
			case 'X': return [140, 105];
			break;
			case 'A': return [158, 94];
			break;
			case 'B': return [84, 112];
			break;
			case 'C': return [164, 159];
			break;
			case 'D': return [151, 97];
			break;
		}
		return false;
	}
	
	cga.travel.newisland.toStoneInternal = (stone, cb, r)=>{
		if(!r){
			cb(false);
			return;
		}
		var curXY = cga.GetMapXY();
		var curMap = cga.GetMapName();
		const desiredMap = ['艾尔莎岛', '艾夏岛'];
		if(curMap == '艾尔莎岛' || curMap == '艾夏岛'){
			
			var curStone = cga.travel.newisland.xy2name(curXY.x, curXY.y);
			if(curStone) {
				//console.log(curStone);
				var turn = false;
				if(stone.length >= 2 && curStone.charAt(1) == stone.charAt(1)) {
					if(curStone == stone){
						cb(true);
						return;
					}
					turn = true;
				} else if(stone.length < 2){
					if(curStone.charAt(0) == stone.charAt(0)){
						cb(true);
						return;
					}
					turn = true;
				}
				if(turn){
					switch(curStone){
						case 'X':{
							cga.walkList([
							[158, 94],
							], ()=>{
								cga.travel.newisland.toStoneInternal(stone, cb, r);
							});
							return;
						}
						case 'A':{
							if(stone == 'X'){
								cga.walkList([
								[140, 105],
								], ()=>{
									cga.travel.newisland.toStoneInternal(stone, cb, r);
								});
								return;
							}
							
							cga.turnDir(6);
							break;
						}
						case 'B':cga.turnDir(4);break;
						case 'C':cga.turnDir(5);break;
						case 'D':cga.turnDir(4);break;
					}
					cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
						cga.travel.newisland.toStoneInternal(stone, cb, r);
					});
					return;
				}
			}
		}

		if(cga.travel.newisland.isSettled){
			cga.LogBack();
			cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
				cga.travel.newisland.toStoneInternal(stone, cb, r);
			});
		}
	}
	
	//参数1：传送石名称，有效参数：A B C D
	//参数2：回调函数function(result), result 为true或false
	cga.travel.newisland.toStone = function(stone, cb){
		if(!cga.travel.newisland.isvalid(stone)){
			cb(false);
			return;
		}
		
		cga.travel.newisland.toStoneInternal(stone, cb, true);
	}
	
	cga.travel.newisland.toPUB = (cb)=>{
		cga.travel.newisland.toStone('B', (r)=>{
			cga.walkList([
			[102,115, '冒险者旅馆'],
			], (r)=>{
				cb(r);
			});
		});
	}
	
	cga.travel.newisland.toLiXiaIsland = (cb)=>{
		cga.travel.newisland.toStone('X', (r)=>{
			var teamplayers = cga.getTeamPlayers();
	
			cga.walkList(
			teamplayers.length > 1 ?
			[
			[165,153],
			[164,153],
			[165,153],
			[164,153],
			[165,153],
			] :
			[
			[165,153],
			]
			, (r)=>{
				cga.TurnTo(165, 155);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						setTimeout(cb, 1500, true);
					});
				});
			});
		});
	}
	
	cga.travel.gelaer = {};
	
	//定居？
	cga.travel.gelaer.isSettled = true;
	
	cga.travel.gelaer.xy2name = function(x, y){
		if(x == 120 && y == 107)
			return 'N';
		if(x == 118 && y == 214)
			return 'S';
		return false;
	}
	
	cga.travel.gelaer.isvalid = function(stone){
		switch(stone.toUpperCase()){
			case 'N': return true;
			case 'S': return true;
		}
		return false;
	}
	
	cga.travel.gelaer.name2xy = function(stone){
		switch(stone.toUpperCase()){
			case 'N': return [120, 107];
			break;
			case 'S': return [118, 214];
			break;
		}
		return false;
	}
	
	cga.travel.gelaer.toStoneInternal = function(stone, cb, r){
		if(!r){
			cb(false);
			return;
		}
		var curXY = cga.GetMapXY();
		var curMap = cga.GetMapName();
		const desiredMap = ['哥拉尔镇'];
		if(curMap == '哥拉尔镇'){
			
			var curStone = cga.travel.gelaer.xy2name(curXY.x, curXY.y);
			if(curStone) {
				//console.log(curStone);
				var turn = false;
				if(stone.length >= 2 && curStone.charAt(1) == stone.charAt(1)) {
					if(curStone == stone){
						cb(true);
						return;
					}
					turn = true;
				} else if(stone.length < 2){
					if(curStone.charAt(0) == stone.charAt(0)){
						cb(true);
						return;
					}
					turn = true;
				}
				if(turn){
					switch(curStone){
						case 'N':cga.turnDir(6);break;
						case 'S':cga.turnDir(0);break;
					}
					cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
						cga.travel.gelaer.toStoneInternal(stone, cb, r);
					});
					return;
				}
			}
		}

		if(cga.travel.gelaer.isSettled){
			cga.LogBack();
			cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, function(r){
				cga.travel.gelaer.toStoneInternal(stone, cb, r);
			});
		}
	}
	
	//参数1：传送石名称，有效参数：N S
	//参数2：回调函数function(result), result 为true或false
	cga.travel.gelaer.toStone = function(stone, cb){
		if(!cga.travel.gelaer.isvalid(stone)){
			cb(false);
			return;
		}
		
		cga.travel.gelaer.toStoneInternal(stone, cb, true);
	}
	
	//前往到法兰城西医院
	//参数1：回调函数function(result), result 为true或false
	cga.travel.gelaer.toHospital = function(cb){
		cga.travel.gelaer.toStone('N', function(r){
			if(!r){
				cb(false);
				return;
			}

			const walkToHospital_1 = [
				[165, 91, '医院']
				[29, 27],
			];

			cga.walkList(walkToHospital_1, function(r){
				if(!r){
					cb(false);
					return;
				}
				cga.TurnTo(30, 26);
				cb(true);
			});
		});
	}
		
	//按照数组中的坐标行走
	//参数1：数组 ，例子: 
	/*const list = [
		[231, 78, null],
		[225, 70, null],
		[222, 69, null],
		[208, 67, null],
		[202, 66, null],
		[194, 58, null],
		[193, 52, null],
		[195, 50, '职业介绍所']
	];*/
	//参数2：回调函数function(result), result 为true或false, reason=2为战斗
	
	cga.calculatePath = (curX, curY, targetX, targetY, targetMap, dstX, dstY, newList)=>{
		var walls = cga.buildMapCollisionMatrix();
		var grid = new PF.Grid(walls.matrix);
		var finder = new PF.AStarFinder({
			allowDiagonal: true,
			dontCrossCorners: true
		});
		
		console.log('x_size ' + walls.x_size);
		console.log('y_size ' + walls.y_size);
		
		console.log('xbot ' + walls.x_bottom);
		console.log('ybot ' + walls.y_bottom);

		var frompos = [curX - walls.x_bottom, curY - walls.y_bottom];
		var topos = [targetX - walls.x_bottom, targetY - walls.y_bottom];
		console.log('from '  + (frompos[0]) + ', '+ frompos[1]);
		console.log('to '  + (topos[0]) +', '+(topos[1]));
		
		if(frompos[0] >= 0 && frompos[0] < walls.x_size && 
		frompos[1] >= 0 && frompos[1] < walls.y_size &&
			topos[0] >= 0 && topos[0] < walls.x_size && 
			topos[1] >= 0 && topos[1] < walls.y_size){
		
			console.log('using AStar path finder...');
			
			var path = finder.findPath(frompos[0], frompos[1], topos[0], topos[1], grid);
			
			var joint = PF.Util.compressPath(path);
			for(var i in joint){
				joint[i][0] += walls.x_bottom;
				joint[i][1] += walls.y_bottom;
				if(joint[i][0] == targetX && joint[i][1] == targetY){
					joint[i][2] = targetMap;
					joint[i][3] = dstX;
					joint[i][4] = dstY;
				}
				joint[i][5] = true;
			}

			console.log('result joints');
				
			console.log(joint);

			newList = joint.concat(newList);
			
			console.log('final list');
			
			console.log(newList);
		} else {
			console.log('failed to use AStar path finder...');
			newList.unshift([targetX, targetY, targetMap, null, null, true]);
		}
		
		return newList;
	}
	
	cga.getMapXY = ()=>{
		var f = cga.GetMapXYFloat();
		return {x: parseInt(f.x/64.0), y:parseInt(f.y/64.0)};
	}
	
	cga.walkList = function(list, cb){
		
		console.log('初始化寻路列表');
		console.log(list);
				
		var walkedList = [];
		var newList = list.slice(0);
		
		var walkCb = function(){

			if(newList.length == 0){
				cb(true);
				return;
			}

			var targetX = newList[0][0];
			var targetY = newList[0][1];
			var targetMap = newList[0][2];
			var dstX = newList[0][3];
			var dstY = newList[0][4];
			var isAStarPath = newList[0][5];
			
			var walked = newList[0].slice(0);
			walkedList.push(walked);
			newList.shift();
			
			var curmap = cga.GetMapName();
			var curpos = cga.GetMapXY();
			var curmapindex = cga.GetMapIndex().index3;

			console.log('当前地图: ' + curmap);
			console.log('当前地图序号: ' + curmapindex);
			console.log('当前坐标: (%d, %d)', curpos.x, curpos.y);
			console.log('目标坐标: (%d, %d)', targetX, targetY);
			console.log('目标地图');
			console.log(targetMap);
			
			var end = ()=>{
				var waitBattle2 = ()=>{
					if(!cga.isInNormalState()){
						setTimeout(waitBattle2, 1500);
						return;
					}
										
					var curpos = cga.GetMapXY();
					if(typeof walkedList[walkedList.length-1][2] != 'string' &&
					typeof walkedList[walkedList.length-1][2] != 'number' &&
						(curpos.x != walkedList[walkedList.length-1][0] || 
						curpos.y != walkedList[walkedList.length-1][1])
						){
						console.log(curpos);
						console.log(walkedList);
						console.log('坐标错误，回滚到上一路径');
						newList.unshift(walkedList.pop());
						walkCb();
						return;
					}
					
					cb(true);
					return;
				}
				setTimeout(waitBattle2, 1500);
			}
			
			var walker = (result, reason)=>{
				//console.log(result);
				//console.log(reason);
				if(result !== true){
					
					if(reason == 4){
						console.log('地图发生非预期的切换！');
						var curmap = cga.GetMapName();
						var curmapindex = cga.GetMapIndex().index3;
						
						console.log('当前地图: ' + curmap);
						console.log('当前地图序号: ' + curmapindex);
					}
					//we are in battle status, wait a second then try again until battle is end
					if(reason == 2){
						
						var waitBattle = ()=>{
							if(!cga.isInNormalState()){
								setTimeout(waitBattle, 1000);
								return;
							}
							
							var curmap = cga.GetMapName();
							var curmapindex = cga.GetMapIndex().index3;
							var curpos = cga.GetMapXY();
							
							console.log('当前地图 ：' + curmap);
							console.log('当前地图序号 ：' + curmapindex);
							console.log('当前坐标：' + curpos.x + ', ' + curpos.y);
							
							if(typeof targetMap == 'string' && curmap == targetMap){
								
								if(newList.length == 0){
									end();
									return;
								}
								
								walkCb();
								return;
							}
							else if(curmapindex == targetMap){
								
								if(newList.length == 0){
									end();
									return;
								}
								
								walkCb();
								return;
							}
							else if(typeof walkedList[walkedList.length-1] != 'undefined' && 
								typeof walkedList[walkedList.length-1][2] == 'string' && 
								walkedList[walkedList.length-1][2] != '' &&
								curmap != walkedList[walkedList.length-1][2])
							{
								console.log('目标地图错误，回滚到上一路径');
								console.log('预期地图 ' + walkedList[walkedList.length-1][2] + ', 当前地图 ' + curmap);
								
								var temp = walkedList.pop();
								newList = cga.calculatePath(curpos.x, curpos.y, temp[0], temp[1], temp[2], null, null, newList);
							}
							else if(typeof walkedList[walkedList.length-2] != 'undefined' && 
								typeof walkedList[walkedList.length-2][2] == 'string' && 
								walkedList[walkedList.length-2][2] != '' && 
								curmap != walkedList[walkedList.length-2][2])
							{
								console.log('目标地图错误，回滚到上上个路径');
								console.log('预期地图 ' + walkedList[walkedList.length-2][2] + ', 当前地图 ' + curmap);
								
								walkedList.pop();
								var temp = walkedList.pop();
								
								newList = cga.calculatePath(curpos.x, curpos.y, temp[0], temp[1], temp[2], null, null, newList);
							} else {
								
								newList = cga.calculatePath(curpos.x, curpos.y, targetX, targetY, targetMap, dstX, dstY, newList);
							}

							walkCb();
						}
						
						setTimeout(waitBattle, 1000);
						return;
					} else if(reason == 3){
						
						console.log('当前寻路卡住，抛出错误！');

					}
					cb(result, reason);
					return;
				}
								
				if(newList.length == 0){
					end();
					return;
				}
				
				walkCb();
			}
				
			if(targetX == curpos.x && targetY == curpos.y){		
				var isEntrance = typeof targetMap == 'string' || typeof targetMap == 'number' || (targetMap instanceof Array) ? true : false;
				if(isEntrance){
					cga.FixMapWarpStuck(1);
					cga.AsyncWalkTo(targetX, targetY, targetMap, null, null, walker);
					return;
				}
				walkCb();
				return;
			}

			if(isAStarPath !== true){
				newList = cga.calculatePath(curpos.x, curpos.y, targetX, targetY, targetMap, dstX, dstY, newList);
				walkCb();
				return;
			}
			
			cga.AsyncWalkTo(targetX, targetY, targetMap, dstX, dstY, walker);
		};
		
		walkCb();
	}
		
	//查找玩家技能，返回技能index，找不到返回-1
	//参数1：技能名
	//参数2：完全匹配
	cga.findPlayerSkill = function(name){
		var match = arguments[1] ? arguments[1] : true;
		var skills = cga.GetSkillsInfo();
		for(var i in skills){
			if(match && skills[i].name == name){
				return skills[i];
			}
			if(!match && skills[i].name.indexOf(name) != -1){
				return skills[i];
			}
		}
		return null;
	}
	
	//查找NPC，返回npc对象，找不到返回false
	//参数1：npc名字
	//参数2：模型id
	cga.findNPC = function(name, model_id){
		var units = cga.GetMapUnits();
		for(var i in units){
			if(units[i].valid == 0)
				continue;
			if(typeof model_id != 'undefined' && units[i].model_id != model_id)
				continue;
			if((units[i].type != 2 && units[i].type != 1) || units[i].model_id == 0)
				continue;
			if(units[i].unit_name == name){
				return units[i];
			}
		}
		return false;
	}
	
	cga.findNPCByPosition = function(name, x, y){
		var units = cga.GetMapUnits();
		for(var i in units){
			if(units[i].valid == 0)
				continue;
			if(units[i].xpos != x || units[i].ypos != y)
				continue;
			if((units[i].type != 2 && units[i].type != 1) || units[i].model_id == 0)
				continue;
			if(units[i].unit_name == name){
				return units[i];
			}
		}
		return false;
	}
	
	cga.findNPCByNameArray = (npcnamearray) =>{

		var npcs = cga.GetMapUnits();

		for(var i in npcs){
			if(npcs[i].valid && (npcs[i].type == 1 || npcs[i].type == 2) && npcs[i].model_id != 0){
				for(var j in npcnamearray){
					if(npcs[i].unit_name == npcnamearray[j])
						return npcs[i];
				}
			}
		}
		return null;
	}
	
	cga.findMultiNPC = (npcname) =>{
		
		var npcs = cga.GetMapUnits();
		var arr = [];
		for(var i in npcs){
			if(npcs[i].valid && (npcs[i].type == 1 || npcs[i].type == 2) && npcs[i].model_id != 0){
				if(npcs[i].unit_name == npcname)
					arr.push(npcs[i]);
			}
		}
		return arr;
	}
	
	//取背包中的物品数量
	//参数1：物品名, 或#物品id
	//参数2：是否包括装备栏
	cga.getItemCount = function(name){
		var includeEquipment = arguments[1] ? arguments[1] : false;
		var items = cga.getInventoryItems();
		var count = 0;
		if(name.charAt(0) == '#'){
			var itemid = parseInt(name.substring(1));
			for(var i in items){
				if(!includeEquipment && items[i].pos < 8)
					continue;
				if(items[i].itemid == itemid)
					count += items[i].count > 0 ? items[i].count : 1;
			}
		} else {
			for(var i in items){
				if(!includeEquipment && items[i].pos < 8)
					continue;
				if(items[i].name == name)
					count += items[i].count > 0 ? items[i].count : 1;
			}
		}
		return count;
	}
	
	//任务
	cga.task = {};
	
	//任务对象构造函数
	cga.task.Task = function(name, stages, requirements){
		
		this.stages = stages;
		this.name = name;
		this.anyStepDone = true;
		
		this.requirements = requirements
		
		this.isDone = function(index){
			for(var i = this.requirements.length - 1; i >= index; --i){
				if(typeof this.requirements[i] == 'function' && this.requirements[i]())
					return true;
			}
			return false;
		}
		
		this.isDoneSingleStep = function(index){
			if(typeof this.requirements[index] == 'function' && this.requirements[index]())
				return true;
			return false;
		}
		
		this.doNext = function(index, cb){
			if(index >= this.stages.length){
				console.log('任务：'+this.name+' 已完成！');
				cb(true);
			} else {
				this.doStage(index, cb);
			}
		}
	
		this.doStage = function(index, cb){
			if(this.anyStepDone){
				if(this.isDone(index)){
					console.log('第'+(index+1)+'/'+stages.length+'阶段已完成，跳过。');
					this.doNext(index+1, cb);
					return;
				}
			} else {
				if(this.isDoneSingleStep(index)){
					console.log('第'+(index+1)+'/'+stages.length+'阶段已完成，跳过。');
					this.doNext(index+1, cb);
					return;
				}
			}
			console.log('开始执行第'+(index+1)+'阶段：');
			console.log(this.stages[index].intro);
			var objThis = this;
			objThis.stages[index].workFunc(function(r){
				if(!r){
					cb(r);
					return;
				}
				console.trace()
				
				if(r === true){
					console.log('第'+(index+1)+'阶段执行完成。');
					objThis.doNext(index + 1, cb);
				} else if( r == 'restart stage' ){
					console.log('第'+(index+1)+'阶段请求重新执行。');
					objThis.doNext(index, cb);
				} else if( r == 'restart task' ){
					console.log('第'+(index+1)+'阶段请求重新执行。');
					objThis.doNext(index, cb);
				} else  {
					throw new Error('invalid input');
				}
			});
		}

		this.doTask = function(cb){
			console.log('任务：'+this.name+' 开始执行，共'+this.stages.length+'阶段。');
			this.doStage( (typeof this.jumpToStep != 'undefined') ? this.jumpToStep : 0, cb);
		}
		
		return this;
	}
	
	//等待NPC出现
	cga.task.waitForNPC = function(name, cb2){
		var waitNpc = ()=>{
			if(cga.findNPC(name) == false){
				setTimeout(waitNpc, 10000);
				cga.SayWords('', 0, 3, 1);
				return;
			}
			
			cb2(true);
		}
		waitNpc();
	}
	
	cga.task.joinJobBattleCommon = function(jobname, cb) {
		return cga.task.Task('就职' + jobname, [
		{
			intro: '1.到法兰城的东医院[224.87]内找护士买“止痛药”',
			workFunc: function(cb2){
				cga.travel.falan.toEastHospital(function(r){
					var npc = cga.findNPC('药剂师波洛姆');
					if(npc == null){
						cb2(false);
						return;
					}
					cga.walkList([
					[npc.xpos-1, npc.ypos]
					], (r)=>{
						cga.TurnTo(npc.xpos, npc.ypos);
						cga.AsyncWaitNPCDialog(function(dlg){
							cga.ClickNPCDialog(0, 0);
							cga.AsyncWaitNPCDialog(function(dlg2){
								cga.BuyNPCStore([{index:1, count:1}]);
								cga.AsyncWaitNPCDialog(function(dlg3){
									if(dlg3.message.indexOf('请保重') >= 0){
										cb2(true);
										return;
									}
								});
							});
						});
					});
				});
			}
		},
		{
			intro: '2.接著再到公会[73.60]，把止痛药交给安布伦后他会给你一张“通行证” ',
			workFunc: function(cb2){
				cga.travel.falan.toStone('W1', function(r){
					cga.walkList([
						[73, 60, '职业公会'],
						[8, 6]
					], (r)=>{
						cga.TurnTo(10, 6);
						cga.AsyncWaitNPCDialog(function(dlg){
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(function(dlg2){
								cb2(true);
							});
						});
					});
				});
			}
		},
		{
			intro: '3、出西门进国营第24坑道（351.146），在一楼左方找哈鲁迪亚说话就可以进入试练洞窟。直闯6F大厅，和波洛米亚（23.15）交谈后就可以拿到推荐信。',
			workFunc: (cb2)=>{
				cga.travel.falan.toStone('W1', function(r){
					cga.walkList([
						[22, 87, '芙蕾雅'],
						[351, 145, '国营第24坑道 地下1楼'],
						[9, 15],
					], (r)=>{
						cga.TurnTo(9, 13);
						cga.AsyncWaitNPCDialog(function(dlg){
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x: 7, y: 15}, function(r){
								cga.walkList([
									[9, 5, '试炼之洞窟 第1层'],
									[33, 31, '试炼之洞窟 第2层'],
									[22, 42, '试炼之洞窟 第3层'],
									[42, 34, '试炼之洞窟 第4层'],
									[27, 12, '试炼之洞窟 第5层'],
									[39, 36, '试炼之洞窟 大厅'],
									[23, 20],
								], (r)=>{
									var job = cga.GetPlayerInfo().job;
									if(job == '游民'){
										cga.walkList([
										[23, 17]
										], (r)=>{
											cga.turnDir(6);
											cga.AsyncWaitNPCDialog(function(dlg2){
												cga.ClickNPCDialog(1, 0);
												setTimeout(cb2, 1000, true);
											});
										});
									} else {
										cga.walkList([
										[22, 12],
										[23, 12],
										], (r)=>{
											cga.SayWords(jobname, 0, 0, 0);
											cga.AsyncWaitNPCDialog(function(dlg2){
												if(dlg2.message.indexOf('那就拿去吧') >= 0){
													cga.ClickNPCDialog(1, 0);
													setTimeout(cb2, 1000, true);
												}
											});
										});
									}
								});
							});
						});
					});
				});
			}	
		}
		],
		[//任务阶段是否完成
			function(){//止痛药
				return (cga.getItemCount('#18233') > 0) ? true : false;
			},
			function(){//试炼洞穴通行证
				return (cga.getItemCount('#18100') > 0) ? true : false;
			},
			function(){
				return false;
			}
		]
		);
	}

	cga.gather = {};
	
	cga.gather.stats = function(itemname, itemgroupnum){
		this.begintime = moment();
		this.prevcount = cga.getItemCount(itemname);
		this.itemname = itemname;
		this.itemgroupnum = itemgroupnum;
		this.printStats = function(){
			var count = cga.getItemCount(this.itemname) - this.prevcount;
			
			console.log('一次采集完成，耗时' + moment.duration(moment() - this.begintime, 'ms').locale('zh-cn').humanize());
			console.log('获得 '+ itemname +' x '+count+'，共 ' + parseInt(count / this.itemgroupnum) + ' 组。');
			
			this.begintime = moment();
		}
		return this;
	}

	cga.craft = {}
	
	cga.craft.buyFabricLv1 = (id, count, cb)=>{
		cga.travel.falan.toFabricStore((r)=>{
			cga.walkList([
			[8, 7],
			], ()=>{
				cga.TurnTo(8, 6);
				cga.AsyncWaitNPCDialog(function(dlg){
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(function(dlg2){
						cga.BuyNPCStore([{index:id, count:count}]);
						cga.AsyncWaitNPCDialog(function(dlg3){
							cb(true);
						});
					});
				});
			});
		});
	}
	
	cga.craft.buyFabricLv1Multi = (arr, cb)=>{
		cga.travel.falan.toFabricStore((r)=>{
			cga.walkList([
			[8, 7],
			], ()=>{
				cga.TurnTo(8, 6);
				cga.AsyncWaitNPCDialog(function(dlg){
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(function(dlg2){
						cga.BuyNPCStore(arr);
						cga.AsyncWaitNPCDialog(function(dlg3){
							cb(true);
						});
					});
				});
			});
		});
	}
	
	//搜索第一个可鉴定的物品
	cga.findAssessableItem = function(){
		var frompos = arguments[0] ? arguments[0] : 8;
		var skill = cga.findPlayerSkill('鉴定');
		var mp = cga.GetPlayerInfo().mp;
		var items = cga.getInventoryItems();
		for(var i in items){
			if(items[i].pos >= frompos && 
				false == items[i].assessed && 
				skill.lv >= items[i].level &&
				mp >= items[i].level * 10){
					
				return items[i];
			}
		}
		return null;
	}
	
	//鉴定背包中所有的物品
	cga.assessAllItems = function(cb){
		if(!cga.findPlayerSkill('鉴定')){
			cb(false, '你没有鉴定技能');
			return;
		}
		var frompos = arguments[1] ? arguments[1] : 8;
		var item = cga.findAssessableItem(frompos);
		if(item)
		{
			//console.log(item);
			if(!cga.assessItem(item.pos)){
				assessAllItems(cb, item.pos + 1);
			}
			else
			{
				cga.AsyncWaitWorkingResult(function(r){
					setTimeout(function(){//delay a bit
						cga.assessAllItems(cb);
					}, 100);
				}, 30000);
			}
		} else {
			cb(true, '鉴定结束，所有物品都已鉴定完成或蓝量不足。');
			return;
		}
	}
	
	cga.findItem = (itemname) =>{
		
		var items = cga.getInventoryItems();
		
		if(itemname.charAt(0) == '#'){
			for(var i in items){
				if(items[i].itemid == itemname.substring(1)){
					return items[i].pos;
				}
			}			
			return -1;
		}
		for(var i in items){
			if(items[i].name == itemname){
				return items[i].pos;
			}
		}
		return -1;
	}
	
	cga.findItemArray = (itemname) =>{
		
		var items = cga.getInventoryItems();
		var arr = [];
		if(typeof itemname =='string' && itemname.charAt(0) == '#'){
			for(var i in items){
				if(items[i].itemid == itemname.substring(1)){
					arr.push({
					itempos : items[i].pos,
					itemid : items[i].itemid,
					count : (items[i].count < 1) ? 1 : items[i].count,
					});
				}
			}			
			return -1;
		}
		for(var i in items){
			if(itemname instanceof RegExp){
				//console.log(itemname.exec(items[i].name));
				if(itemname.exec(items[i].name)){
					arr.push({
					itempos : items[i].pos,
					itemid : items[i].itemid,
					count : (items[i].count < 1) ? 1 : items[i].count,
					});
				}
			}
			else if(typeof itemname =='string'){
				if(items[i].name == itemname){
					arr.push({
					itempos : items[i].pos,
					itemid : items[i].itemid,
					count : (items[i].count < 1) ? 1 : items[i].count,
					});
				}
			}
		}
		return arr;
	}
		
	cga.sellArray = (sellarray, cb)=>{
		cga.AsyncWaitNPCDialog(function(dlg){			
			var numOpt = dlg.message.charAt(dlg.message.length-1);
			cga.ClickNPCDialog(0, numOpt == '3' ? 1 : 0);
			cga.AsyncWaitNPCDialog(function(dlg2){
				cga.SellNPCStore(sellarray);
				cga.AsyncWaitNPCDialog(function(dlg3){
					cb(true);
				});
			});
		});
	}
	
	cga.sellStone = (cb)=>{
		cga.AsyncWaitNPCDialog(function(dlg){			
			var numOpt = dlg.message.charAt(dlg.message.length-1);
			cga.ClickNPCDialog(0, numOpt == '3' ? 1 : 0);
			cga.AsyncWaitNPCDialog(function(dlg2){
				var pattern = /(.+)的卡片/;
				var sellArray = []
				cga.getInventoryItems().forEach((item)=>{
					if(item.name == '魔石' || item.name == '卡片？' || pattern.exec(item.name) )
						sellArray.push({
							itempos : item.pos,
							itemid : item.itemid,
							count : (item.count < 1) ? 1 : item.count,
						});
						
				})

				cga.SellNPCStore(sellArray);
				setTimeout(cb, 1000, true);
			});
		});
	}
	
	cga.getDistance = (x1, y1, x2, y2)=>{
		
		return Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
	}
	
	cga.isDistanceClose = (x1, y1, x2, y2)=>{
		if(x1 - x2 <= 1 && x1 - x2 >= -1 && y1 - y2 <= 1 && y1 - y2 >= -1)
			return true;
		return false;
	}
	
	cga.findBankEmptySlot = (itemname, maxcount) =>{
		
		var banks = cga.GetBankItemsInfo();

		var arr = [];

		for(var i = 0; i < banks.length; ++i){
			arr[banks[i].pos-100] = banks[i];
		}
		
		for(var i = 0; i < 80; ++i){
			if(typeof arr[i] != 'undefined'){
				if(typeof itemname == 'string' && maxcount > 0){
					if(arr[i].name == itemname && arr[i].count < maxcount)
						return 100+i;
				}
			} else {			
				return 100+i;
			}				
		}
		
		return -1;		
	}

	cga.saveToBankOnce = (itemname, maxcount, cb)=>{
		var itempos = cga.findItem(itemname);
		if(itempos == -1){
			cb(false, new Error('包里没有该物品, 无法存放到银行'));
			return;
		}
		
		var emptyslot = cga.findBankEmptySlot(itemname, maxcount);
		if(emptyslot == -1){
			cb(false, new Error('银行没有空位, 无法存放到银行'));
			return;
		}
		
		cga.MoveItem(itempos, emptyslot, -1);
		
		var saveToBank = ()=>{
			if(cga.GetItemInfo(emptyslot))
			{
				cb(true);
			}
			else{
				cb(false);
			}
		}
		
		setTimeout(saveToBank, 500);
	}
	
	cga.saveToBankAll = (itemname, maxcount, cb)=>{
		var repeat = ()=>{
			cga.saveToBankOnce(itemname, maxcount, (r, err)=>{
				if(!r){
					cb(r, err);
					return;
				}
				if(cga.findItem(itemname) == -1){
					cb(true);
					return;
				}				
				repeat();
			});
		}
		
		repeat();		
	}
	
	
	cga.freqMove = function(dir, cb){
		if(!cga.IsInGame()){
			cb(new Error('not in game!'));
			return;
		}
		var freqMoveDirTable = [ 4, 5, 6, 7, 0, 1, 2, 3 ];
		var freqMoveDir = dir;
		var pos = cga.GetMapXY();
		var move = ()=>{
			var result = true;
			try{
				var curpos = cga.GetMapXY();
				if(freqMoveDir == 0){
					if(pos.x > curpos.x)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				else if(freqMoveDir == 4){
					if(pos.x < curpos.x)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				else if(freqMoveDir == 2){
					if(pos.y > curpos.y)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				else if(freqMoveDir == 6){
					if(pos.y < curpos.y)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				else if(freqMoveDir == 1){
					if(pos.x > curpos.x)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				else if(freqMoveDir == 5){
					if(pos.x < curpos.x)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				else if(freqMoveDir == 3){
					if(pos.y > curpos.y)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				else if(freqMoveDir == 7){
					if(pos.y < curpos.y)
						cga.ForceMove(freqMoveDir, false);
					else
						cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
				}
				result = cb();
			}
			catch(e){
				console.log(e);
			}
			
			if(result)
				setTimeout(move, 50);
		}
		setTimeout(move, 50);
	}
	
	cga.getTeamPlayers = ()=>{
		var teaminfo = cga.GetTeamPlayerInfo();
		var units = cga.GetMapUnits();
		var playerinfo = cga.GetPlayerInfo();
		for(var i in teaminfo){
		
			for(var j in units){
				if(units[j].type == 8 && units[j].unit_id == teaminfo[i].unit_id){
					teaminfo[i].name = units[j].unit_name;
					teaminfo[i].nick = units[j].nick_name;
					teaminfo[i].xpos = units[j].xpos;
					teaminfo[i].ypos = units[j].ypos;
					teaminfo[i].injury = units[j].injury;
					teaminfo[i].level = units[j].level;
					break;
				}
			}
			if(playerinfo.unitid == teaminfo[i].unit_id){
				teaminfo[i].name = playerinfo.name;
				teaminfo[i].is_me = true;
			}
		}
		return teaminfo;
	}
		
	cga.tradePlayer = (name, cb)=>{
		var unit = cga.findPlayerUnit(name);
		if(unit == null){
			cb(false);
			return;
		}

		setTimeout(()=>{
			unit = cga.findPlayerUnit(name);
			cga.TurnTo(unit.xpos, unit.ypos);
			setTimeout(()=>{
				cga.DoRequest(cga.REQUEST_TYPE_TRADE);
				cga.AsyncWaitPlayerMenu(function(players){
					for(var i in players){
						if(players[i].name == name){
							cga.PlayerMenuSelect(0);
							cga.AsyncWaitTradeDialog(()=>{
								cb(true);
							}, 1500);
							return;	
						}
					}
					cb(false);
				}, 1500);
			}, 1500);
		}, 1000);
	}
	
	cga.addTeammate = (name, cb)=>{
		var unit = cga.findPlayerUnit(name);
		var mypos = cga.GetMapXY();
		if(unit == null || 
		!cga.isDistanceClose(unit.xpos, unit.ypos, mypos.x, mypos.y) || 
		(unit.xpos == mypos.x && unit.ypos == mypos.y)){
			cb(false);
			return;
		}

		setTimeout(()=>{
			unit = cga.findPlayerUnit(name);
			
			if(unit == null){
				cb(false);
				return;
			}
			
			cga.TurnTo(unit.xpos, unit.ypos);
			setTimeout(()=>{
				cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM);
				cga.AsyncWaitNPCDialog((dlg)=>{
					var stripper = "你要和谁组成队伍？";
					if(dlg.message && dlg.message.indexOf(stripper) >= 0){
						var strip = dlg.message.substr(dlg.message.indexOf(stripper) + stripper.length);
						strip = strip.replace(/\\z/g,"|");
						strip = strip.replace(/\\n/g,"|");
						var reg = new RegExp(/([^|\n]+)/g)
						var match = strip.match(reg);
						console.log(match);
						for(var j = 0; j < match.length; ++j){
							if(match[j] == name){
								console.log(j);
								cga.ClickNPCDialog(0, j);
							}
						}
					}

					setTimeout(()=>{
						var teamPlayers = cga.getTeamPlayers();

						if(teamPlayers.length && teamPlayers[0].name == name){
							cb(true);
							return;
						} else if(teamPlayers.length && teamPlayers[0].name != name){
							cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						}
						
						cb(false);
						return;
					}, 1500);
				}, 1500);
			}, 1500);
		}, 1000);
	}
	
	cga.waitTeammates = (teammates, cb)=>{
		
		cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);
		
		var teamplayers = cga.getTeamPlayers();
		
		if(teamplayers.length == teammates.length){
			for(var i = 0; i < teamplayers.length; ++i){
				if(!is_array_contain(teammates, teamplayers[i].name)){
					//Unknown teammates, kick
					cga.DoRequest(cga.REQUEST_TYPE_KICKTEAM);
					cga.AsyncWaitNPCDialog((dlg)=>{
						var stripper = "你要把谁踢出队伍？";
						if(dlg.message && dlg.message.indexOf(stripper) >= 0){
							var strip = dlg.message.substr(dlg.message.indexOf(stripper) + stripper.length);
							strip = strip.replace(/\\z/g,"|");
							strip = strip.replace(/\\n/g,"|");
							console.log(strip);
							var reg = new RegExp(/([^|\n]+)/g)
							var match = strip.match(reg);
							console.log(match);
							for(var j = 0; j < match.length; ++j){
								if(match[j] == teamplayers[i].name){
									cga.ClickNPCDialog(0, j / 2);
									break;
								}
							}
						}
					});
					cb(false);
					return;
				}
			}
			
			setTimeout(cb, 2000, true);
			return;
		}
		
		cb(false);
	}
		
	cga.waitTeammateSay = (cb)=>{
		cga.AsyncWaitChatMsg((r)=>{
			
			if(!r.msg){
				cga.waitTeammateSay(cb);
				return;
			}
			
			var listen = true;
			var fromTeammate = null;
			var teamplayers = cga.getTeamPlayers();

			if(!teamplayers.length){
				var playerInfo = cga.GetPlayerInfo();
				if(playerInfo.unitid == r.unitid){
					fromTeammate = playerInfo;
					fromTeammate.index = 0;
					fromTeammate.is_me = true;
				}
			}

			for(var i in teamplayers){
				if(teamplayers[i].unit_id == r.unitid){
					fromTeammate = teamplayers[i];
					fromTeammate.index = i;
					break;
				}
			}
			
			if(fromTeammate){
				var msgheader = fromTeammate.name + ': ';
				if(r.msg.indexOf(msgheader) >= 0){
					var msg = r.msg.substr(r.msg.indexOf(msgheader) + msgheader.length);
					listen = cb(fromTeammate, msg);						
				}
			}

			if(listen == true)
				cga.waitTeammateSay(cb);
		}, 1000);
	}
	
	cga.waitForLocation = (obj, cb)=>{
		var name = cga.GetMapName();
		var fpos = cga.GetMapXYFloat();
		var index = cga.GetMapIndex().index3;
		
		var passCheck = true;

		if(typeof obj.mapname == 'string')
		{
			if(name != obj.mapname)
			{
				passCheck = false;
			}
		}
		if(typeof obj.mapindex == 'number')
		{
			if(index != obj.mapindex)
			{
				passCheck = false;
			}
		}
		
		if(obj.moving !== true && !(parseInt(fpos.x) % 64 == 0 && parseInt(fpos.y) % 64 == 0))
		{
			passCheck = false;
		}
		
		if(obj.pos instanceof Array)
		{
			if (!(Math.abs(fpos.x - obj.pos[0] * 64.0) < 1.001 * 64.0 && Math.abs(fpos.y - obj.pos[1] * 64.0) < 1.001 * 64.0))
			{
				passCheck = false;
			}
		}

		if(obj.leaveteam === true)
		{
			var teamplayersnow = cga.getTeamPlayers();

			if(teamplayersnow.length)
				passCheck = false;
			
			if(!passCheck && obj.walkto && !teamplayersnow.length && (index == obj.mapindex || name == obj.mapname))
			{
				cga.WalkTo(obj.walkto[0], obj.walkto[1]);
			}
		}
		
		if(passCheck){
			cb();
			return;
		}
		
		setTimeout(cga.waitForLocation, 1000, obj, cb);
	}
	
	cga.waitForMultipleLocation = (arr)=>{
		var name = cga.GetMapName();
		var fpos = cga.GetMapXYFloat();
		var index = cga.GetMapIndex().index3;

		for(var i = 0; i < arr.length; ++i){
			var obj = arr[i];
		
			var passCheck = true;

			if(typeof obj.mapname == 'string')
			{
				if(name != obj.mapname)
				{
					passCheck = false;
				}
			}
			if(typeof obj.mapindex == 'number')
			{
				if(index != obj.mapindex)
				{
					passCheck = false;
				}
			}
			if(obj.moving !== true && !(parseInt(fpos.x) % 64 == 0 && parseInt(fpos.y) % 64 == 0))
			{
				passCheck = false;
			}
			
			if(obj.pos instanceof Array)
			{
				if (!(Math.abs(fpos.x - obj.pos[0] * 64.0) < 1.001 * 64.0 && Math.abs(fpos.y - obj.pos[1] * 64.0) < 1.001 * 64.0))
				{
					passCheck = false;
				}
			}

			if(obj.leaveteam === true)
			{
				var teamplayersnow = cga.getTeamPlayers();

				if(teamplayersnow.length)
					passCheck = false;
				
				if(!passCheck && obj.walkto && !teamplayersnow.length && (index == obj.mapindex || name == obj.mapname) )
				{
					cga.WalkTo(obj.walkto[0], obj.walkto[1]);
				}
			}
			
			if(passCheck){
				obj.cb();
				return;
			}
		}
		
		setTimeout(cga.waitForMultipleLocation, 1000, arr);
	}
	
	cga.buildMapCollisionMatrix = (exitIsBlocked)=>{
		var wall = cga.GetMapCollisionTable(true);
		var objs = cga.GetMapObjectTable(true);
		var matrix = [];
		for(var y = 0; y < wall.y_size; ++y){
			if(!matrix[y])
				matrix[y] = [];
			for(var x = 0; x < wall.x_size; ++x){
				matrix[y][x] = wall.cell[x + y * wall.x_size];
				if(exitIsBlocked == true){
					if(objs.cell[x + y * objs.x_size] & 0xff){
						matrix[y][x] = 1;
					}
				}
			}
		}
		return {matrix : matrix, x_bottom : wall.x_bottom, y_bottom : wall.y_bottom, x_size : wall.x_size, y_size : wall.y_size};
	}
	
	cga.buildMapObjectMatrix = ()=>{
		var wall = cga.GetMapObjectTable(true);
		var matrix = [];
		for(var y = 0; y < wall.y_size; ++y){
			if(!matrix[y])
				matrix[y] = [];
			for(var x = 0; x < wall.x_size; ++x){
				matrix[y][x] = wall.cell[x + y * wall.x_size] & 0xff;
			}
		}
		return {matrix : matrix, x_bottom : wall.x_bottom, y_bottom : wall.y_bottom, x_size : wall.x_size, y_size : wall.y_size};
	}
	
	cga.getMapObjects = ()=>{
		var wall = cga.GetMapObjectTable(true);
		var objs = [];
		for(var y = 0; y < wall.y_size; ++y){
			for(var x = 0; x < wall.x_size; ++x){
				if((wall.cell[x + y * wall.x_size] & 0xff) != 0)
					objs.push({
						x:x,
						y:y,
						mapx:x+wall.x_bottom,
						mapy:y+wall.y_bottom,
						cell:wall.cell[x + y * wall.x_size] & 0xff,
						rawcell:wall.cell[x + y * wall.x_size]
					});
			}
		}
		return objs;
	}

	cga.findPlayerUnit = (name)=>{
		var units = cga.GetMapUnits();
	
		for(var i = 0; i < units.length; ++i){
			if(units[i].type == 8 && units[i].unit_name == name){
				return units[i];
			}
		}
		return null;
	}
	
	cga.downloadMap = (xsize, ysize, cb)=>{
		var x = 0, y = 0;
		var download = ()=>{
			cga.RequestDownloadMap(x, y, x+24, y+24);
			x += 24;
			if(x > xsize){
				y += 24;
				x  = 0;
			}
			if(y > ysize){
				setTimeout(cb, 1500, true);
				return;
			}
			setTimeout(download, 500);
		}
		download();
	}
	
	cga.downloadMapEx = (xfrom, yfrom, xsize, ysize, cb)=>{
		var x = xfrom, y = yfrom;
		var download = ()=>{
			cga.RequestDownloadMap(x, y, x+24, y+24);
			x += 24;
			if(x > xsize){
				y += 24;
				x  = 0;
			}
			if(y > ysize){
				setTimeout(cb, 1500, true);
				return;
			}
			setTimeout(download, 500);
		}
		download();
	}
	
	cga.walkMaze = (target_map, cb, layerNameFilter)=>{
		
		var walls = cga.buildMapCollisionMatrix();
		
		var objs = cga.getMapObjects();
		
		var pos = cga.GetMapXY();
		
		var newmap = null;
		if(typeof target_map != 'string'){
			var mapname = cga.GetMapName();
			
			var regex = mapname.match(/([^\d]*)(\d+)([^\d]*)/);
			var layerIndex = 0;
			console.log(regex);
			if(regex && regex.length >= 3){
				layerIndex = parseInt(regex[2]);
			}
			
			if(layerIndex == 0){
				cb(false, new Error('无法从地图名中解析出楼层'));
				return;
			}
			
			if(typeof layerNameFilter == 'function')
			{
				newmap = layerNameFilter(layerIndex, regex);
			}
			else
			{
				newmap = regex[1] + (layerIndex + 1);
				if(typeof regex[3] == 'string')
					newmap += regex[3];
			}
		} else {
			newmap = target_map;
		}

		var target = null;
		for(var i in objs){
			if(objs[i].mapx == pos.x && objs[i].mapy == pos.y)
				continue;
			if(objs[i].cell == 3){
				target = objs[i];
				break;
			}
		}
		
		if(target == null){
			cb(false, new Error('无法找到迷宫的出口'));
			return;
		}

		var walklist = cga.calculatePath(pos.x, pos.y, target.mapx, target.mapy, newmap, null, null, []);
		if(walklist.length == 0){
			cb(false, new Error('无法计算到迷宫出口的路径'));
			return;
		}

		cga.walkList(walklist, (r, reason)=>{
			cb(r, reason);
			return;
		});
	}
	
	cga.walkRandomMaze = (target_map, cb, layerNameFilter)=>{
		
		var walls = cga.buildMapCollisionMatrix();
		
		if(walls.matrix[0][0] == 1 
		|| walls.matrix[walls.y_size-1][0] == 1 
		|| walls.matrix[walls.y_size-1][walls.x_size-1] == 1
		|| walls.matrix[0][walls.x_size-1] == 1){
			cga.downloadMap(walls.x_size,walls.y_size, ()=>{
				cga.walkMaze(target_map, cb, layerNameFilter);
			});
		} else {
			cga.walkMaze(target_map, cb, layerNameFilter);
		}
	}
	
	cga.getRandomSpace = (x, y)=>{
		var walls = cga.buildMapCollisionMatrix(true);
		if(walls.matrix[y][x-1] == 0)
			return [x-1, y];
		if(walls.matrix[y][x+1] == 0)
			return [x+1, y];
		if(walls.matrix[y-1][x] == 0)
			return [x, y-1];
		if(walls.matrix[y+1][x] == 0)
			return [x, y+1];
		if(walls.matrix[y+1][x+1] == 0)
			return [x+1,y+1];
		if(walls.matrix[y+1][x-1] == 0)
			return [x-1,y+1];
		if(walls.matrix[y-1][x+1] == 0)
			return [x+1,y-1];
		if(walls.matrix[y-1][x-1] == 0)
			return [x-1,y-1];
		
		return null;
	}
	
	cga.getRandomSpaceDir = (x, y)=>{
		var walls = cga.buildMapCollisionMatrix(true);
		if(walls.matrix[y][x-1] == 0)
			return 4;
		if(walls.matrix[y][x+1] == 0)
			return 0;
		if(walls.matrix[y-1][x] == 0)
			return 6;
		if(walls.matrix[y+1][x] == 0)
			return 2;
		if(walls.matrix[y+1][x+1] == 0)
			return 1;
		if(walls.matrix[y+1][x-1] == 0)
			return 3;
		if(walls.matrix[y-1][x+1] == 0)
			return 7;
		if(walls.matrix[y-1][x-1] == 0)
			return 5;
		
		return null;
	}
		
	cga.tradeInternal = (stuff, checkParty, resolve, playerName) => {
		cga.AsyncWaitTradeDialog((partyName, partyLevel) => {

			if (partyLevel > 0) {
				var getInTradeStuffs = false;
				var receivedStuffs;
				const waitTradeState = () => {
					cga.AsyncWaitTradeState((state) => {
						console.log('AsyncWaitTradeState ' + state);
						if (state == cga.TRADE_STATE_READY) {
							if (!getInTradeStuffs) cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
							waitTradeState();
						} else if (state == cga.TRADE_STATE_SUCCEED || state == cga.TRADE_STATE_CANCEL) {
							resolve({
								success: (state == cga.TRADE_STATE_SUCCEED),
								received: receivedStuffs
							});
						} else if (state == cga.TRADE_STATE_CONFIRM) {
							waitTradeState();
						} else {
							resolve({success: false});
						}
					}, 10000);
				};
				waitTradeState();
				cga.AsyncWaitTradeStuffs((type, args) => {
					console.log('AsyncWaitTradeStuffs');
					getInTradeStuffs = true;
					if (args) {
						if (!checkParty || checkParty(playerName ? playerName : partyName, type, args)) {
							receivedStuffs = args;
							console.log('confirm');
							cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
						} else {
							console.log('refuse');
							cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
						}
					}
				}, 10000);
				const itemFilter = (stuff && typeof stuff.itemFilter == 'function') ? stuff.itemFilter : () => false;
				const petFilter = (stuff && typeof stuff.petFilter == 'function') ? stuff.petFilter : () => false;
				const tradeItems = cga.getInventoryItems().filter(itemFilter).map(e => {
					return {itemid: e.itemid, itempos: e.pos, count: (e.count > 1 ? e.count : 1)};
				});

				cga.TradeAddStuffs(
					tradeItems,
					cga.GetPetsInfo().filter(petFilter).map((p, index) => index),
					(stuff && stuff.amount) ? stuff.amount : 0
				);
			} else {
				console.log('refuse2');
				console.log(partyName);
				console.log(partyLevel);
				cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
				resolve({success: false});
			}
		}, 10000);
	};

	cga.trade = (name, stuff, checkParty, resolve) => {
		cga.AsyncWaitPlayerMenu(players => {
			if (!(players instanceof Array)) players = [];
			var player = players.find((e, index) => typeof name == 'number' ? index == name : e.name == name);
			if (player) {
				cga.tradeInternal(stuff, checkParty, resolve, name);
				cga.PlayerMenuSelect(player.index);
			} else {
				resolve({success: false});
			}
		}, 3000);
		console.log('trade request')
		cga.DoRequest(cga.REQUEST_TYPE_TRADE);
	}

	cga.waitTrade = (stuff, checkParty, resolve) => {
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true)
		cga.tradeInternal(stuff, checkParty, resolve);
	}
		
	return cga;
}