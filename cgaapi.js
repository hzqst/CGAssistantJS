var cga = require('bindings')('node_cga');	
var moment = require('moment');
var PF = require('pathfinding');
var Async = require('async');
var request = require('request');
const { createVerify } = require('crypto');

global.is_array_contain = function(arr, val)
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
	var port = null;

	if(process.argv.length >= 3 && parseInt(process.argv[2]) > 0)
		port = parseInt(process.argv[2]);
	else if(process.env.CGA_GAME_PORT && parseInt(process.env.CGA_GAME_PORT) > 0)
		port = parseInt(process.env.CGA_GAME_PORT);

	if(typeof port != 'number')
		throw new Error('获取游戏本地服务端口失败!');

	cga.AsyncConnect(port, function(err){
		if(err){
			throw new Error('无法连接到本地服务端口，可能未附加到游戏或者游戏已经闪退！');
		}
		
		callback();
	});
	
	cga.TRADE_STUFFS_ITEM = 1;
	cga.TRADE_STUFFS_PET = 2;
	cga.TRADE_STUFFS_PETSKILL = 3;
	cga.TRADE_STUFFS_GOLD = 4;

	cga.REQUEST_TYPE_PK = 1;
	cga.REQUEST_TYPE_JOINTEAM = 3;
	cga.REQUEST_TYPE_EXCAHNGECARD = 4;
	cga.REQUEST_TYPE_TRADE = 5;
	cga.REQUEST_TYPE_KICKTEAM = 11;
	cga.REQUEST_TYPE_LEAVETEAM = 12;
	cga.REQUEST_TYPE_TRADE_CONFIRM = 13;
	cga.REQUEST_TYPE_TRADE_REFUSE = 14;
	cga.REQUEST_TYPE_REBIRTH_ON = 16;
	cga.REQUEST_TYPE_REBIRTH_OFF = 17;
	
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
	cga.FL_BATTLE_ACTION_BEGIN = 16;

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
	
	cga.MOVE_GOLD_TOBANK = 1;
	cga.MOVE_GOLD_FROMBANK =  2;
	cga.MOVE_GOLD_DROP = 3
	
	cga.PET_STATE_READY = 1;
	cga.PET_STATE_BATTLE = 2;
	cga.PET_STATE_REST = 3;
	cga.PET_STATE_WALK = 16;
	
	cga.UI_DIALOG_TRADE = 1;
	cga.UI_DIALOG_BATTLE_SKILL = 2;

	//延迟x毫秒
	cga.delay = (millis) => new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, millis);
	});
	
	cga.promisify = (fn, args) => new Promise((resolve, reject) => {
		args.push((err, reason) => {
			console.log(err);
			setTimeout(() => {
				if (err) reject(err);
				else resolve();
			}, 0);
		});
		fn.apply(null, args);
	});
	
	cga.moveThinkFnArray = [];
	
	cga.moveThink = (arg)=>{
		for(var i = 0; i < cga.moveThinkFnArray.length; ++i){
			if(cga.moveThinkFnArray[i](arg) == false){
				return false;
			}
		}
		return true;
	}
	
	cga.isMoveThinking = false;
	
	cga.registerMoveThink = (fn)=>{
		cga.moveThinkFnArray.push(fn);
	}
	
	cga.isTeamLeaderEx = ()=>{
		return (cga.isTeamLeader == true || cga.getTeamPlayers().length <= 1);
	}
	
	cga.getMapInfo = () => {
		const info = cga.GetMapXY();
		info.indexes = cga.GetMapIndex();
		info.name = cga.GetMapName();
		return info;
	};
	
	cga.getOrientation = (x, y) => {
		const p = cga.GetMapXY();
		const xy = Math.max(-1, Math.min(1, x - p.x)).toString() + Math.max(-1, Math.min(1, y - p.y)).toString();
		switch (xy) {
			case '10':
				return 0;
			case '11':
				return 1;
			case '01':
				return 2;
			case '-11':
				return 3;
			case '-10':
				return 4;
			case '-1-1':
				return 5;
			case '0-1':
				return 6;
			case '1-1':
				return 7;
			default:
		}
		return -1;
	}
	
	cga.getOrientationPosition = (orientation, offset)=>{
		const current = cga.GetMapXY();
		switch (orientation) {
			case 0:
				return [current.x + offset, current.y];
			case 1:
				return [current.x + offset, current.y + offset];
			case 2:
				return [current.x, current.y + offset];
			case 3:
				return [current.x - offset, current.y + offset];
			case 4:
				return [current.x - offset, current.y];
			case 5:
				return [current.x - offset, current.y - offset];
			case 6:
				return [current.x, current.y - offset];
			case 7:
				return [current.x + offset, current.y - offset];
			default:
				return new Error('无效参数');
		}
	}
		
	cga.turnDir = cga.turnOrientation = (orientation, offset = 2) => {
		var pos = cga.getOrientationPosition(orientation, offset);
		cga.TurnTo(pos[0], pos[1]);
	}
	
	//转向(x,y)坐标，默认往前一格避免捡起面前的物品
	cga.turnTo = (x, y)=>{
		cga.turnOrientation(cga.getOrientation(x, y));
	}
	
	//判断是否在战斗状态
	cga.isInBattle = function(){
		return (cga.GetWorldStatus() == 10) ? true : false;
	}
	
	//判断是否在正常状态（非切图非战斗状态）
	cga.isInNormalState = function(){
		return (cga.GetWorldStatus() == 9 && cga.GetGameStatus() == 3) ? true : false;
	}
	
	//将字符串转义为windows下合法的文件名
	cga.FileNameEscape = (str)=>{
		return str.replace(/[\\/:\*\?"<>|]/g, (c)=>{return {"\\":'%5C','/':'%2F',':':'%3A','*':'%2A','?':'%3F','"':'%22','<':'%3C','>':'%3E','|':'%7C'}[c];});
	}

	//FileNameEscape的反向操作，反转义
	cga.FileNameUnescape = (str)=>{
		return str.replace(/%(5C|2F|3A|2A|3F|22|3C|3E|7C)/g, (c)=>{ return {'%5C':'\\','%2F':'/','%3A':':','%2A':'*','%3F':'?','%22':'"','%3C':'<','%3E':'>','%7C':'|'}[c];});
	}

	//获取制造某种物品所需要的材料信息，返回材料信息object或null
	cga.getItemCraftInfo = function(filter){
		var result = null;
		cga.GetSkillsInfo().forEach((sk)=>{
			if(sk.type == 1)
			{
				var craftInfo = cga.GetCraftsInfo(sk.index).find((craft)=>{

					if(typeof filter == 'string')
					{
						if(filter.charAt(0) == '#')
							return craft.itemid == parseInt(filter.substring(1));
						else
							return craft.name == filter;
					}
					else if(typeof filter == 'number')
					{
						return craft.itemid == filter;
					}
					else if(typeof filter == 'function')
					{
						return filter(craft);
					}
					
					return false;
				});
				if(craftInfo != undefined){
					result = {craft : craftInfo, skill : sk};
					return false;
				}
			}
		});		
		return result;
	}

	/*鉴定、装饰物品，参数：
		cga.manipulateItemEx({
			itempos : 操作的物品位置,
			immediate : 是否立即完成（高速鉴定）,
		}, cb回调)
	*/
	cga.manipulateItemEx = function(options, cb){
		var skill = cga.findPlayerSkill(options.skill);
		if(!skill){
			cb(new Error('你没有'+skillname+'的技能'));
			return;
		}
		
		cga.SetImmediateDoneWork(options.immediate ? true : false);
		
		cga.StartWork(skill.index, 0);

		if(!cga.AssessItem(skill.index, options.itempos)){
			cb(new Error('无法操作该物品'));
			return;
		}
		
		var beginTime = (new Date()).getTime();
		
		var handler = (err, results)=>{
			if(results){
				cb(null, results);
				return;
			}
			
			var craftStatus = cga.GetCraftStatus();
			
			var curTime = (new Date()).getTime();
			
			if(err){
				if(craftStatus == 0 || craftStatus == 2){
					cga.manipulateItemEx(options, cb);
					return;
				}
				
				//强制重试
				var isImmediate = cga.GetImmediateDoneWorkState();
				if(isImmediate != 2 && curTime > beginTime + 1000 * 120)
				{
					cga.manipulateItemEx(options, cb);
					return;
				}
				else if(isImmediate == 2 && curTime > beginTime + 1000 * 5)
				{
					cga.manipulateItemEx(options, cb);
					return;
				}
				
				cga.AsyncWaitWorkingResult(handler, 1000);
			}
		}
		
		cga.AsyncWaitWorkingResult(handler, 1000);
		return;
	}
	
	//制造物品，参数：物品名，添加的宝石的名字(或物品位置)
	//该API已经弃用，请用cga.craftItemEx
	cga.craftNamedItem = function(craftItemName, extraItemName){
		throw new Error('该API已经弃用，请用cga.craftItemEx')
	}

	/*制造物品，参数：
		cga.craftItemEx({
			craftitem : 制造的物品名,
			extraitem(可选) : 添加宝石
			immediate : 是否立即完成（高速制造）,
		}, cb回调)
	*/
	cga.craftItemEx = function(options, cb){

		var err = null;

		var info = cga.getItemCraftInfo(options.craftitem);
		if(info === null)
			err = new Error('你没有制造 '+options.craftitem+' 的技能');

		if(err){
			cb(err);
			return;
		}

		var inventory = cga.getInventoryItems();
			var itemArray = [];
	
		info.craft.materials.forEach((mat)=>{
			var findRequired = inventory.find((inv)=>{
				return (inv.itemid == mat.itemid && inv.count >= mat.count);
			});
			if(findRequired != undefined){
				itemArray.push(findRequired.pos);
			} else {
				err = new Error('制造' +options.craftitem+'所需物品' +mat.name+'不足！');
				return false;
			}
		});
		
		if(err){
			cb(err);
			return;
		}

		if(typeof options.extraitem == 'string'){
			var findRequired = inventory.find((inv)=>{
				return (inv.name == options.extraitem);
			});
			if(findRequired != undefined){
				itemArray[5] = findRequired.pos;
			} else {
				err = new Error('制造' +options.extraitem+'所需宝石' +options.extraitem+'不足！');
			}
		}
		
		if(err){
			cb(err);
			return;
		}
		
		for(var i = 0; i < 6; ++i)
		{
			if(typeof itemArray[i] != 'number')
				itemArray[i] = -1;
		}
		
		cga.SetImmediateDoneWork(options.immediate ? true : false);
		
		cga.StartWork(info.skill.index, info.craft.index);
		cga.CraftItem(info.skill.index, info.craft.index, 0, itemArray);
		
		var beginTime = (new Date()).getTime();
		
		var handler = (err, results)=>{
			if(results){
				cb(null, results);
				return;
			}
			
			var craftStatus = cga.GetCraftStatus();
			
			var curTime = (new Date()).getTime();
			
			if(err){
				if(craftStatus == 0 || craftStatus == 2){
					cga.craftItemEx(options, cb);
					return;
				}
				
				//强制重试
				var isImmediate = cga.GetImmediateDoneWorkState();
				if(isImmediate != 2 && curTime > beginTime + 1000 * 120)
				{
					cga.craftItemEx(options, cb);
					return;
				}
				else if(isImmediate == 2 && curTime > beginTime + 1000 * 5)
				{
					cga.craftItemEx(options, cb);
					return;
				}
				
				cga.AsyncWaitWorkingResult(handler, 1000);
			}
		}
		
		cga.AsyncWaitWorkingResult(handler, 1000);
	}
	
	//获取物品栏里的物品，返回数组
	cga.getInventoryItems = function(){
		return cga.GetItemsInfo().filter((item)=>{
			return item.pos >= 8 && item.pos < 100;
		});
	}
	
	//获取装备栏里的物品，返回数组
	cga.getEquipItems = function(){
		return cga.GetItemsInfo().filter((item)=>{
			return item.pos >= 0 && item.pos < 8;
		});
	}

	//获取装备耐久，返回数组[当前耐久,最大耐久]
	cga.getEquipEndurance = (item)=>{

		if(item.attr){
			var regex = item.attr.match(/\$4耐久 (\d+)\/(\d+)/);
			if(regex && regex.length >= 3){
				return [parseInt(regex[1]), parseInt(regex[2])];
			}
		}

		return null;
	}
	
	cga.travel = {};
		
	cga.travel.falan = {};

	cga.travel.falan.isSettled = false;
	
	cga.travel.falan.xy2name = (x, y, mapname)=>{
		if(x == 242 && y == 100 && mapname == '法兰城')
			return 'E1';
		if(x == 141 && y == 148 && mapname == '法兰城')
			return 'S1';
		if(x == 63 && y == 79 && mapname == '法兰城')
			return 'W1';
		if(x == 233 && y == 78 && mapname == '法兰城')
			return 'E2';
		if(x == 162 && y == 130 && mapname == '法兰城')
			return 'S2';
		if(x == 72 && y == 123 && mapname == '法兰城')
			return 'W2';
		if(x == 46 && y == 16 && mapname == '市场三楼 - 修理专区')
			return 'M3';
		if(x == 46 && y == 16 && mapname == '市场一楼 - 宠物交易区')
			return 'M1';
		if(x == 151 && y == 122 && mapname == '法兰城')
			return 'B1';
		if(x == 155 && y == 122 && mapname == '法兰城')
			return 'B2';
		return null;
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
			case 'B1': return true;//桥头
			case 'B2': return true;
			case 'C': return true;//里谢里雅堡
		}
		return false;
	}

	cga.travel.falan.toStoneInternal = function(stone, cb){
		var curXY = cga.GetMapXY();
		var curMap = cga.GetMapName();
		const desiredMap = ['法兰城','里谢里雅堡','艾尔莎岛','市场一楼 - 宠物交易区','市场三楼 - 修理专区'];
		if(curMap == '法兰城'){
			if(stone == 'C'){
				cga.travel.falan.toCastle(cb);
				return;
			}
			if(stone == 'B1'){
				cga.walkList([
				[151, 122]
				], cb);
				return;
			}
			if(stone == 'B2'){
				cga.walkList([
				[155, 122]
				], cb);
				return;
			}
			var curStone = cga.travel.falan.xy2name(curXY.x, curXY.y, curMap);
			if(curStone) {
				var turn = false;
				if(stone == 'M1' || stone == 'M3') {
					if(curStone == stone){
						cb(null);
						return;
					}
					turn = true;
				}
				else if(stone.length >= 2 && curStone.charAt(1) == stone.charAt(1)) {
					if(curStone.charAt(0) == 'S' && stone.charAt(0) == 'B'){
						cga.walkList([
						stone == 'B1' ? [151, 122] : [155, 122]
						], cb);
						return;
					}
					if(curStone == stone){
						cb(null);
						return;
					}
					turn = true;
				} else if(stone.length < 2){
					if(curStone.charAt(0) == stone.charAt(0)){
						cb(null);
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
					cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, (err, reason)=>{
						if(err){
							cb(err, reason);
							return;
						}
						cga.travel.falan.toStoneInternal(stone, cb);
					});
					return;
				}
			}
		}
		
		if(curMap.indexOf('市场') >= 0 && curXY.x == 46 && curXY.y == 16){
			if(stone == 'M1' && curMap == '市场一楼 - 宠物交易区'){
				cb(null);
				return;
			}
			if(stone == 'M3' && curMap == '市场三楼 - 修理专区'){
				cb(null);
				return;
			}
			cga.turnDir(6);
			cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, (err, reason)=>{
				if(err){
					cb(err, reason);
					return;
				}
				cga.travel.falan.toStoneInternal(stone, cb);
			});
			return;
		}
		if(curMap == '艾尔莎岛'){
			cga.walkList([
			[140, 105],
			], ()=>{
				cga.turnDir(7);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, (err, reason)=>{
						if(err){
							cb(err, reason);
							return;
						}
						cga.travel.falan.toStoneInternal(stone, cb);
					});
				});
			})
			return;
		}
		if(curMap == '里谢里雅堡'){
			if(stone == 'C'){
				cb(null);
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
			const walkOutOfCastle_3 = [
				[41, 98, '法兰城'],
			];
			if(stone == 'M1')
				walks = walkOutOfCastle_2;
			else if(stone == 'M3')
				walks = walkOutOfCastle_1;
			else if(stone.length >= 2 && stone.charAt(0) == 'B')
				walks = walkOutOfCastle_3; 
			else if(stone.length == 1)
				walks = walkOutOfCastle_2;
			else if(stone.length >= 2 && stone.charAt(1) == '1')
				walks = walkOutOfCastle_1;
			else
				walks = walkOutOfCastle_2;

			cga.walkList(walks, (err, reason)=>{
				if(err){
					cb(err, reason);
					return;
				}
				cga.travel.falan.toStoneInternal(stone, cb);
			});
			return;
		}
		cga.LogBack();
		cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, (err, reason)=>{
			if(err){
				cb(err, reason);
				return;
			}
			cga.travel.falan.toStoneInternal(stone, cb);
		});
	}
	
	//参数1：传送石名称，有效参数：E1 S1 W1 E2 S2 W2 M1(道具-市场1楼) M3(道具-市场3楼)
	//参数2：回调函数function(result), result 为true或false
	cga.travel.falan.toStone = function(stone, cb){
		if(!cga.travel.falan.isvalid(stone)){
			cb(new Error('无效的目的地名称'));
			return;
		}
		
		cga.travel.falan.toStoneInternal(stone, cb, true);
	}
	
	//前往到法兰城东医院
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toEastHospital = (cb)=>{
		cga.travel.falan.toStone('E', ()=>{
			cga.walkList([
			[221, 83, '医院']
			], cb);
		});
	}
	
	//前往到法兰城西医院
	//参数1：回调函数function(result), result 为true或false
	cga.travel.falan.toWestHospital = (cb)=>{
		cga.travel.falan.toStone('W', (r)=>{
			cga.walkList([
			[82, 83, '医院'],
			], cb);
		});
	}
	
	//前往到法兰城银行
	cga.travel.falan.toBank = (cb)=>{
		
		if(cga.GetMapIndex().index3 == 1121){
			cb(null);
			return;
		}
		
		cga.travel.falan.toStone('E', (r)=>{
			cga.walkList([
			[238, 111, '银行'],
			], cb);
		});
	}
	
	//从法兰城到里谢里雅堡，启动地点：登出到法兰城即可
	cga.travel.falan.toCastle = (cb)=>{
		
		if(cga.GetMapName() == '里谢里雅堡'){
			cb(null);
			return;
		}
		
		if(cga.GetMapName() == '法兰城'){
			var curXY = cga.GetMapXY();
			
			var westPath = cga.calculatePath(curXY.x, curXY.y, 141, 88, '里谢里雅堡', null, null, []);
			westPath = PF.Util.expandPath(westPath);
			
			var southPath = cga.calculatePath(curXY.x, curXY.y, 153, 100, '里谢里雅堡', null, null, []);
			southPath = PF.Util.expandPath(southPath);
			
			var eastPath = cga.calculatePath(curXY.x, curXY.y, 165, 88, '里谢里雅堡', null, null, []);
			eastPath = PF.Util.expandPath(eastPath);

			var northPath = cga.calculatePath(curXY.x, curXY.y, 153, 70, '里谢里雅堡', null, null, []);
			northPath = PF.Util.expandPath(northPath);

			var path = westPath;
			var target = [141, 88, '里谢里雅堡'];
			
			if(path.length > southPath.length)
			{
				path = southPath;
				target = [153, 100, '里谢里雅堡'];
			}
			
			if(path.length > eastPath.length)
			{
				path = eastPath;
				target = [165, 88, '里谢里雅堡'];
			}
			
			if(path.length > northPath.length)
			{
				path = northPath;
				target = [153, 70, '里谢里雅堡'];
			}
			
			cga.walkList([target], cb);
		} else {
			cga.travel.falan.toStone('S', ()=>{
				cga.travel.falan.toCastle(cb);
			});
		}
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
			else
			{
				cga.walkList([
				[34, 89]
				], (r)=>{
					cga.TurnTo(36, 87);
					cb(true);
				});
			}
			return;
		}
		
		cga.travel.falan.toStone('C', (r)=>{
			cga.walkList([
			[34, 89]
			], (r)=>{
				cga.TurnTo(36, 87);
				cb(true);
			});
		});	
	}
	
	//前往里堡打卡处并打卡
	cga.travel.falan.toCastleClock = (cb)=>{
		cga.travel.falan.toStone('C', (r)=>{
			cga.walkList([
			[58, 83]
			], (r)=>{
				cga.TurnTo(58, 84);
				cga.AsyncWaitNPCDialog((err, dlg)=>{
					if(dlg.options == 12){
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cb(null);
						});
					} else {
						cb(new Error('没有卡时，无法打卡'));
					}
				});
			});
		});	
	}
	
	cga.travel.camp = {};

	cga.travel.camp.getRegion = (mapname, mapXY)=>{
		if(mapname == '肯吉罗岛')
		{
			if(mapXY.x <= 316 && mapXY.y >= 325)
			{
				return '矮人城镇域';
			}
			if(mapXY.x >= 355 && mapXY.x <= 516 && mapXY.y <= 181)
			{
				return '沼泽洞穴出口域';
			}
			if(mapXY.x < 355 && mapXY.y <= 212)
			{
				return '沼泽洞穴出口域';
			}
			
			return '圣骑士营地域';
		}
		return null;
	}

	//前往圣骑士营地，noWarp为true时只进到曙光骑士团营地
	cga.travel.falan.toCamp = (cb, noWarp)=>{
		var warp = ()=>{
			
			var teamplayers = cga.getTeamPlayers();
			var isTeamLeader = (teamplayers.length > 0 && teamplayers[0].is_me) == true ? true : false;
			
			if(isTeamLeader){
				setTimeout(()=>{
					cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
					setTimeout(warp, 1500);
				}, 1500);
				return;
			}
			
			cga.TurnTo(7, 21);
			cga.AsyncWaitMovement({map:'圣骑士营地', delay:1000, timeout:5000}, cb);
		}

		var castle_2_camp = ()=>{
			
			var shouldWarp = (cga.getItemCount('承认之戒', true) > 0 && noWarp !== true) ? true : false;
			
			var list = shouldWarp ? [
			[55,47, '辛希亚探索指挥部'],
			[7,4, '辛希亚探索指挥部', 91, 6],
			[95, 9, 27101],
			[8, 21],
			] : [
			
			];

			if(cga.GetMapName() == '里谢里雅堡'){
				list.unshift([513, 282, '曙光骑士团营地']);
				list.unshift([153, 241, '芙蕾雅']);
				list.unshift([41, 98, '法兰城']);
			} else if(cga.GetMapName() == '法兰城'){
				list.unshift([513, 282, '曙光骑士团营地']);
				list.unshift([153, 241, '芙蕾雅']);
			} else if(cga.GetMapName() == '芙蕾雅'){
				list.unshift([513, 282, '曙光骑士团营地']);
			}
			
			cga.walkList(list, (shouldWarp) ? warp : cb);
		}
		
		var mapname = cga.GetMapName();
		if(mapname == '圣骑士营地'){
			cb(null);
			return;
		}
		var mapindex = cga.GetMapIndex().index3;
		if(mapindex == 44692){
			cga.walkList([
				[0, 20, '圣骑士营地'],
			], cb);
			return;
		}
		if(mapindex == 44693){
			cga.walkList([
				[30, 37, '圣骑士营地'],
			], cb);
			return;
		}
		if(mapindex == 44698){
			cga.walkList([
				[3, 23, '圣骑士营地'],
			], cb);
			return;
		}
		if(mapindex == 44699){
			cga.walkList([
				[0, 14, '圣骑士营地'],
			], cb);
			return;
		}
		if(mapname == '辛希亚探索指挥部' && cga.GetMapIndex().index3 == 27101){
			cga.walkList([[8, 21]], warp);
			return;
		}
		
		if(mapname == '法兰城' || mapname == '里谢里雅堡' || mapname == '芙蕾雅' || mapname == '曙光骑士团营地'){
			castle_2_camp(null);
		}else{
			cga.travel.falan.toStone('C', castle_2_camp);
		}
	}

	//前往流行商店
	cga.travel.falan.toFashionStore = cga.travel.falan.toFabricStore = (cb)=>{
		if(cga.GetMapName()=='流行商店'){
			cb(null);
			return;
		}
		
		if(cga.GetMapName() == '法兰城'){
			cga.travel.falan.toStone('S1', ()=>{
				cga.walkList([
					[117, 112, '流行商店'],
				], cb);
			});
		} else {
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
					[17, 53, '法兰城'],
					[117, 112, '流行商店'],
				], cb);
			});
		}
	}
	
	//前往凯蒂夫人的店
	cga.travel.falan.toKatieStore = cga.travel.falan.toAssessStore = (cb)=>{
		if(cga.GetMapName()=='凯蒂夫人的店'){
			cb(null);
			return;
		}
		
		if(cga.GetMapName() == '法兰城'){
			cga.travel.falan.toStone('E2', function(r){
				cga.walkList([
					[196, 78, '凯蒂夫人的店'],
				], cb);
			});
		} else {
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
					[65, 53, '法兰城'],
					[196, 78, '凯蒂夫人的店'],
				], cb);
			});
		}
	}
	
	//前往达美姊妹的店
	cga.travel.falan.toDameiStore = cga.travel.falan.toCrystalStore = (cb)=>{
		if(cga.GetMapName()=='达美姊妹的店'){
			cb(null);
			return;
		}
		
		if(cga.GetMapName() == '法兰城'){
			cga.travel.falan.toStone('W1', function(r){
				cga.walkList([
					[94, 78, '达美姊妹的店'],
				], cb);
			});
		} else {
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
					[17, 53, '法兰城'],
					[94, 78, '达美姊妹的店'],
				], cb);
			});
		}
	}
	
	//前往法兰工房，mine为要换的矿名
	cga.travel.falan.toMineStore = (mine, cb)=>{
		var mineExchange = null;
		if(mine == '铜'){
			mineExchange = (cb2)=>{
				cga.walkList([[26, 5]], ()=>{
					cga.turnTo(26, 4);
					cb2(null);
				});
			}
		}
		if(mine == '铁'){
			mineExchange = (cb2)=>{
				cga.walkList([[28, 6]], ()=>{
					cga.turnTo(28, 5);
					cb2(null);
				});
			}
		}
		if(mine == '银'){
			mineExchange = (cb2)=>{
				cga.walkList([[29, 6]], ()=>{
					cga.turnTo(30, 5);
					cb2(null);
				});
			}
		}
		if(mine == '纯银'){
			mineExchange = (cb2)=>{
				cga.walkList([[27, 7]], ()=>{
					cga.turnTo(27, 5);
					cb2(null);
				});
			}
		}
		if(mine == '金'){
			mineExchange = (cb2)=>{
				cga.walkList([[24, 6]], ()=>{
					cga.turnTo(24, 5);
					cb2(null);
				});
			}
		}
		if(mine == '白金'){
			mineExchange = (cb2)=>{
				cga.walkList([[29, 6]], ()=>{
					cga.turnTo(30, 7);
					cb2(null);
				});
			}
		}
		if(mine == '幻之钢'){
			mineExchange = (cb2)=>{
				cga.walkList([[26, 10]], ()=>{
					cga.turnTo(28, 10);
					cb2(null);
				});
			}
		}
		if(mine == '幻之银'){
			mineExchange = (cb2)=>{
				cga.walkList([[27, 9]], ()=>{
					cga.turnTo(28, 8);
					cb2(null);
				});
			}
		}
		if(mine == '勒格耐席鉧'){
			mineExchange = (cb2)=>{
				cga.walkList([[23, 7]], ()=>{
					cga.turnTo(22, 6);
					cb2(null);
				});
			}
		}
		if(mine == '奥利哈钢'){
			mineExchange = (cb2)=>{
				cga.walkList([[26, 12]], ()=>{
					cga.turnTo(27, 12);
					cb2(null);
				});
			}
		}
		if(cga.GetMapName()=='米克尔工房'){
			if(mineExchange){
				mineExchange(cb);
			}else{
				cb(null);
			}
			return;
		}
		
		if(cga.GetMapName() == '法兰城'){
			cga.travel.falan.toStone('W1', function(r){
				cga.walkList([
					[100, 61, '米克尔工房'],
				], ()=>{
					if(mineExchange){
						mineExchange(cb);
					}else{
						cb(null);
					}
				});
			});
		} else {
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
					[17, 53, '法兰城'],
					[100, 61, '米克尔工房'],
				], ()=>{
					if(mineExchange){
						mineExchange(cb);
					}else{
						cb(null);
					}
				});
			});
		}
	}
	
	//前往新城工房，mine为要换的矿名
	cga.travel.falan.toNewMineStore = (mine, cb)=>{
		var mineExchange = null;
		if(mine == '铜'){
			mineExchange = (cb2)=>{
				cga.walkList([[35, 46]], ()=>{
					cga.turnTo(35, 45);
					cb2(null);
				});
			}
		}
		if(mine == '铁'){
			mineExchange = (cb2)=>{
				cga.walkList([[32, 47]], ()=>{
					cga.turnTo(31, 47);
					cb2(null);
				});
			}
		}
		if(mine == '银'){
			mineExchange = (cb2)=>{
				cga.walkList([[42, 51]], ()=>{
					cga.turnTo(41, 51);
					cb2(null);
				});
			}
		}
		if(mine == '纯银'){
			mineExchange = (cb2)=>{
				cga.walkList([[37, 49]], ()=>{
					cga.turnTo(37, 48);
					cb2(null);
				});
			}
		}
		if(mine == '金'){
			mineExchange = (cb2)=>{
				cga.walkList([[40, 50]], ()=>{
					cga.turnTo(39, 49);
					cb2(null);
				});
			}
		}
		if(mine == '白金'){
			mineExchange = (cb2)=>{
				cga.walkList([[38, 43]], ()=>{
					cga.turnTo(39, 44);
					cb2(null);
				});
			}
		}
		if(mine == '幻之钢'){
			mineExchange = (cb2)=>{
				cga.walkList([[26, 10]], ()=>{
					cga.turnTo(28, 10);
					cb2(null);
				});
			}
		}
		if(mine == '幻之银'){
			mineExchange = (cb2)=>{
				cga.walkList([[37, 44]], ()=>{
					cga.turnTo(38, 45);
					cb2(null);
				});
			}
		}
		if(mine == '勒格耐席鉧'){
			mineExchange = (cb2)=>{
				cga.walkList([[33, 46]], ()=>{
					cga.turnTo(33, 45);
					cb2(null);
				});
			}
		}
		if(mine == '奥利哈钢'){
			mineExchange = (cb2)=>{
				cga.walkList([[44, 48]], ()=>{
					cga.turnTo(43, 48);
					cb2(null);
				});
			}
		}
		if(mine == '铝'){
			mineExchange = (cb2)=>{
				cga.walkList([[38, 54]], ()=>{
					cga.turnTo(38, 53);
					cb2(null);
				});
			}
		}
		if(cga.GetMapName()=='画廊'){
			if(mineExchange){
				mineExchange(cb);
			}else{
				cb(null);
			}
			return;
		}
		
		cga.travel.newisland.toStone('B', ()=>{
			cga.walkList([
				[144, 120, '武器工房'],
				[28, 21, '画廊'],
			], ()=>{
				if(mineExchange){
					mineExchange(cb);
				}else{
					cb(null);
				}
			});
		});
	}

	//从法兰城到新城
	cga.travel.falan.toNewIsland = (cb)=>{
		cga.travel.falan.toStone('C', function(r){
			cga.walkList([
				[28, 88]
			], (r)=>{
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, -1);
								cga.AsyncWaitNPCDialog((err, dlg)=>{
									if(dlg && dlg.options == 12){
										cga.ClickNPCDialog(4, -1);
										cga.AsyncWaitMovement({map:'？'}, ()=>{
											cga.walkList([
												[19, 21, '法兰城遗迹'],
												[96, 138, '盖雷布伦森林'],
												[124, 168, '温迪尔平原'],
												[264, 108, '艾尔莎岛'],
											], cb);
										});
									} else {
										cb(new Error('对话失败'));
									}
								});
							});
						});
					});
				}, 1000);	
			});
		});	
	}
	
	//从法兰城到阿凯鲁法
	cga.travel.falan.toAKLF = (cb)=>{
		
		if(cga.GetMapName() == '阿凯鲁法村'){
			cb(null);
			return;
		}
		
		var stage3 = ()=>{
			cga.walkList([
				[20, 53],
			], (r)=>{
				cga.TurnTo(18, 53);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'港湾管理处'}, ()=>{
						cga.walkList([
							[22, 31, '阿凯鲁法'],
							[28, 30],
						], ()=>{
							cga.TurnTo(30, 30);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, -1);
								cga.AsyncWaitMovement({map:'阿凯鲁法村'}, cb);
							});
						});
					});
				});
			});
		}
		
		var retry2 = ()=>{
			cga.TurnTo(71, 26);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				
				if(dlg && dlg.message.indexOf('现在正停靠在阿凯鲁法港') >= 0 && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'往伊尔栈桥'}, ()=>{
						stage3();
					});
					return;
				}
				
				setTimeout(retry2, 5000);
			});
		}
		
		var retry = ()=>{
			cga.TurnTo(53, 50);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				if(dlg && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'艾欧奇亚号'}, retry2);
					return;
				}
				
				setTimeout(retry, 5000);
			});
		}
		
		if(cga.GetMapName() != '伊尔村'){
			cga.travel.falan.toTeleRoom('伊尔村', ()=>{
				cga.walkList([
				[12, 17, '村长的家'],
				[6, 13, '伊尔村'],
				], ()=>{
					cga.travel.falan.toAKLF(cb);
				});
			});
			return;
		}
		
		cga.walkList([
			[58, 71],
		], ()=>{
			cga.turnTo(60, 71);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
				cga.AsyncWaitMovement({map:'伊尔'}, ()=>{
					cga.walkList([
						[30, 21, '港湾管理处'],
						[23, 25],
					], ()=>{
						cga.TurnTo(23, 23);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, -1);
								cga.AsyncWaitMovement({map:'往阿凯鲁法栈桥'}, ()=>{
									cga.walkList([
										[51, 50],
									], retry);
								});
							});
						});
					});
				});
			}, 1000);	
		});
	}
	
	//从法兰城到哥拉尔
	cga.travel.falan.toGelaer = (cb)=>{
		
		if(cga.GetMapName() == '哥拉尔'){
			cb(null);
			return;
		}
		
		var stage3 = ()=>{
			cga.walkList([
				[84, 55],
			], ()=>{
				cga.turnTo(84, 53);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'哥拉尔镇 港湾管理处'}, ()=>{
						cga.walkList([
							[14, 15, '哥拉尔镇'],
							[118, 214],
						], cb);
					});
				});
			});
		}
		
		var retry2 = ()=>{
			cga.TurnTo(71, 26);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				
				if(dlg && dlg.message.indexOf('正停在哥拉尔港') >= 0 && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'往伊尔栈桥'}, ()=>{
						stage3();
					});
					return;
				}
				
				setTimeout(retry2, 5000);
			});
		}
		
		var retry = ()=>{
			cga.TurnTo(53, 50);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				if(dlg && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'铁达尼号'}, retry2);
					return;
				}
				
				setTimeout(retry, 5000);
			});
		}
		
		if(cga.GetMapName() != '伊尔村'){
			cga.travel.falan.toTeleRoom('伊尔村', ()=>{
				cga.walkList([
				[12, 17, '村长的家'],
				[6, 13, '伊尔村'],
				], ()=>{
					cga.travel.falan.toGelaer(cb);
				});
			});
			return;
		}
		
		cga.walkList([
			[58, 71],
		], ()=>{
			cga.turnTo(60, 71);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
				cga.AsyncWaitMovement({map:'伊尔'}, ()=>{
					cga.walkList([
						[30, 21, '港湾管理处'],
						[25, 25],
					], ()=>{
						cga.TurnTo(25, 23);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, -1);
								cga.AsyncWaitMovement({map:'往哥拉尔栈桥'}, ()=>{
									cga.walkList([
										[51, 50],
									], retry);
								});
							});
						});
					});
				});
			}, 1000);	
		});
	}
	
	cga.travel.AKLF = {};
	
	cga.travel.AKLF.isSettled = false;
	
	//从阿凯鲁法到法兰
	cga.travel.AKLF.toFalan = (cb)=>{
		if(cga.GetMapName() != '阿凯鲁法村'){
			cb(new Error('必须从阿凯鲁法村启动'));
			return;
		}

		var stage4 = ()=>{
			cga.walkList([
				[47, 83, '村长的家'],
				[14, 17, '伊尔村的传送点'],
				[20, 10],
			], (r)=>{
				cga.TurnTo(22, 10);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'启程之间'}, ()=>{
						cga.walkList([
							[25, 24, '里谢里雅堡 1楼'],
							[74, 40, '里谢里雅堡'],
						], cb);
					});
				});
			});
		}
		
		var stage3 = ()=>{
			cga.walkList([
				[19, 55],
			], (r)=>{
				cga.TurnTo(19, 53);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'港湾管理处'}, ()=>{
						cga.walkList([
							[9, 22, '伊尔'],
							[24, 19],
						], ()=>{
							cga.TurnTo(24, 17);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, -1);
								cga.AsyncWaitMovement({map:'伊尔村'}, stage4);
							});
						});
					});
				});
			});
		}
		
		var retry2 = ()=>{
			cga.TurnTo(71, 26);
			cga.AsyncWaitNPCDialog((err, dlg)=>{				
				if(dlg && dlg.message.indexOf('现在正停靠在伊尔村') >= 0 && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'往阿凯鲁法栈桥'}, ()=>{
						stage3();
					});
					return;
				}
				
				setTimeout(retry2, 5000);
			});
		}

		var retry = ()=>{
			cga.TurnTo(53, 50);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				if(dlg && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'艾欧奇亚号'}, retry2);
					return;
				}
				
				setTimeout(retry, 5000);
			});
		}
		
		cga.walkList([
			[57, 176],
		], ()=>{
			cga.TurnTo(55, 176);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
				cga.AsyncWaitMovement({map:'阿凯鲁法'}, ()=>{
					cga.walkList([
					[16, 15, '港湾管理处'],
					[15, 12],
					], ()=>{
						cga.TurnTo(17, 12);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, -1);
								cga.AsyncWaitMovement({map:'往伊尔栈桥'}, ()=>{
									cga.walkList([
									[51, 50],
									], retry);
								});
							});
						});
					});
				});
			});
		});
	}
	
	cga.travel.falan.toTeleRoomTemplate = (villageName, npcPos, npcPos2, npcPos3, cb)=>{
		cga.travel.falan.toStone('C', ()=>{
			var teamplayers = cga.getTeamPlayers();
			var isTeamLeader = teamplayers.length > 0 && teamplayers[0].is_me == true ? true : false;
			
			var list = [
			[41, 50, '里谢里雅堡 1楼'],
			[45, 20, '启程之间']
			];
			
			if(isTeamLeader){
				list.push(npcPos);
				list.push(npcPos2);
				list.push(npcPos);
				list.push(npcPos2);				
				list.push(npcPos);
			} else {
				list.push(npcPos);
			}
			
			cga.walkList(list, ()=>{
				var go = ()=>{
					cga.TurnTo(npcPos3[0], npcPos3[1]);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(typeof dlg.message == 'string' && (dlg.message.indexOf('对不起') >= 0 || dlg.message.indexOf('很抱歉') >= 0)){
							cb(new Error('无法使用前往'+villageName+'的传送石'));
							return;
						}
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitMovement({map:villageName+'的传送点', delay:1000, timeout:5000}, cb);
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
	
	//从启程之间传送到指定村落
	cga.travel.falan.toTeleRoom = (villageName, cb)=>{
		
		switch(villageName){
			case '亚留特村':
				cga.travel.falan.toTeleRoomTemplate('亚留特村', [43, 23], [43, 22], [44, 22], cb);
				break;
			case '伊尔村':
				cga.travel.falan.toTeleRoomTemplate('伊尔村', [43, 33], [43, 32], [44, 32], cb);
				break;
			case '圣拉鲁卡村':
				cga.travel.falan.toTeleRoomTemplate('圣拉鲁卡村', [43, 44], [43, 43], [44, 43], cb);
				break;
			case '维诺亚村':
				cga.travel.falan.toTeleRoomTemplate('维诺亚村', [9, 22], [9, 23], [8, 22], cb);
				break;
			case '奇利村':
				cga.travel.falan.toTeleRoomTemplate('奇利村', [9, 33], [8, 33], [8, 32], cb);
				break;
			case '加纳村':
				cga.travel.falan.toTeleRoomTemplate('加纳村', [9, 44], [8, 44], [8, 43], cb);
				break;
			case '杰诺瓦镇':
				cga.travel.falan.toTeleRoomTemplate('杰诺瓦镇', [15, 4], [15, 5], [16, 4], cb);
				break;
			case '阿巴尼斯村':
				cga.travel.falan.toTeleRoomTemplate('阿巴尼斯村', [37, 4], [37, 5], [38, 4], cb);
				break;
			case '蒂娜村':
				cga.travel.falan.toTeleRoomTemplate('蒂娜村', [25, 4], [25, 5], [26, 4], cb);
				break;
			case '魔法大学':
				var mapname = cga.GetMapName();
				if(mapname == '魔法大学'){
					cb(null);
					return;
				}
				else if(mapname == '魔法大学内部'){
					cga.walkList([
					[40, 59, '魔法大学'],
					], cb);
					return;
				}
				cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
					cga.walkList([
					[5, 4, 4313],
					[6, 13, 4312],
					[6, 13, '阿巴尼斯村'],
					[37, 71, '莎莲娜'],
					[118, 100, '魔法大学'],
					], cb);
				});
				break;
			default:
				throw new Error('未知的村子名称:'+villageName);
		}
	}
	
	cga.travel.falan.toTeleRoomPromisify = (city)=>{
		return cga.promisify(cga.travel.falan.toTeleRoom, [city]);
	}
	
	//从法兰坐船前往某城镇
	cga.travel.falan.toCity = function(city, cb){
		switch(city){
			case '新城':case '艾尔莎岛':
				cga.travel.falan.toNewIsland(cb);
				return;
			case '阿凯鲁法':case '阿凯鲁法村':
				cga.travel.falan.toAKLF(cb);
				return;
			case '哥拉尔':case '哥拉尔镇':
				cga.travel.falan.toGelaer(cb);
				return;
		}
		throw new Error('未知的城市名:'+city);
	}
	
	cga.travel.newisland = {};
		
	cga.travel.newisland.isSettled = true;
	
	cga.travel.newisland.xy2name = function(x, y, mapname){
		if(x == 140 && y == 105 && mapname == '艾尔莎岛')
			return 'X';
		if(x == 158 && y == 94 && mapname == '艾尔莎岛')
			return 'A';
		if(x == 84 && y == 112 && mapname == '艾夏岛')
			return 'B';
		if(x == 164 && y == 159 && mapname == '艾夏岛')
			return 'C';
		if(x == 151 && y == 97 && mapname == '艾夏岛')
			return 'D';

		return null;
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

	cga.travel.newisland.toStoneInternal = (stone, cb)=>{
		var curXY = cga.GetMapXY();
		var curMap = cga.GetMapName();
		const desiredMap = ['艾尔莎岛', '艾夏岛'];
		if(curMap == '艾尔莎岛' || curMap == '艾夏岛'){
			
			var curStone = cga.travel.newisland.xy2name(curXY.x, curXY.y, curMap);
			if(curStone !== null) {
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
								cga.travel.newisland.toStoneInternal(stone, cb);
							});
							return;
						}
						case 'A':{
							if(stone == 'X'){
								cga.walkList([
								[140, 105],
								], ()=>{
									cga.travel.newisland.toStoneInternal(stone, cb);
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
					cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, (err, reason)=>{
						if(err){
							cb(err, reason);
							return;
						}
						cga.travel.newisland.toStoneInternal(stone, cb);
					});
					return;
				}
			}
			
			if(curMap == '艾尔莎岛'){
				cga.walkList([
				stone == 'X' ? [140, 105] : [158, 94],
				], ()=>{
					cga.travel.newisland.toStoneInternal(stone, cb);
				});
				return;
			}
		}

		if(cga.travel.newisland.isSettled){
			cga.LogBack();
			cga.AsyncWaitMovement({map:desiredMap, delay:1000, timeout:5000}, (err, reason)=>{
				if(err){
					cb(err, reason);
					return;
				}
				cga.travel.newisland.toStoneInternal(stone, cb);
			});
		}
	}
	
	//参数1：传送石名称，有效参数：A B C D
	//参数2：回调函数function(result), result 为true或false
	cga.travel.newisland.toStone = (stone, cb)=>{
		if(!cga.travel.newisland.isvalid(stone)){
			throw new Error('无效的目的地名称');
			return;
		}

		cga.travel.newisland.toStoneInternal(stone, cb);
	}
	
	//前往新城冒险者旅馆
	cga.travel.newisland.toPUB = (cb)=>{
		cga.travel.newisland.toStone('B', (r)=>{
			cga.walkList([
			[102,115, '冒险者旅馆'],
			], (r)=>{
				cb(r);
			});
		});
	}
	
	//前往新城立夏岛
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
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, 0);
						setTimeout(cb, 1500, true);
					});
				});
			});
		});
	}
	
	cga.travel.gelaer = {};
	
	cga.travel.gelaer.isSettled = false;
	
	cga.travel.gelaer.xy2name = function(x, y, mapname){
		if(x == 120 && y == 107 && mapname == '哥拉尔镇')
			return 'N';
		if(x == 118 && y == 214 && mapname == '哥拉尔镇')
			return 'S';
		return null;
	}
	
	cga.travel.gelaer.isvalid = function(stone){
		switch(stone.toUpperCase()){
			case 'N': return true;
			case 'S': return true;
		}
		return false;
	}

	cga.travel.gelaer.toStoneInternal = (stone, cb)=>{
		var curXY = cga.GetMapXY();
		var curMap = cga.GetMapName();
		if(curMap == '哥拉尔镇'){			
			var curStone = cga.travel.gelaer.xy2name(curXY.x, curXY.y, curMap);
			if(curStone !== null) {
				if(curStone == stone){
					cb(null);
					return;
				}
				
				var desiredTarget = undefined;
				switch(curStone){
					case 'N':
						cga.turnDir(6);
						desiredTarget = [118, 214];
						break;
					case 'S':
						cga.turnDir(0);
						desiredTarget = [120, 107];
						break;
				}
				cga.AsyncWaitMovement({x : desiredTarget[0], y : desiredTarget[1], delay:1000, timeout:5000}, (err, reason)=>{
					if(err){
						cb(err, reason);
						return;
					}
					cga.travel.gelaer.toStoneInternal(stone, cb);
				});
				return;
			} else if(!cga.travel.gelaer.isSettle){
				var northPath = cga.calculatePath(curXY.x, curXY.y, 118, 214, null, null, null, []);
				northPath = PF.Util.expandPath(northPath);
				
				var southPath = cga.calculatePath(curXY.x, curXY.y, 120, 107, null, null, null, []);
				southPath = PF.Util.expandPath(southPath);
				
				var path = northPath;
				var target = [118, 214];

				if(path.length > southPath.length)
				{
					path = southPath;
					target = [120, 107];
				}
				
				cga.walkList([target], ()=>{
					cga.travel.gelaer.toStoneInternal(stone, cb);
				});
				return;
			}
		}

		if(cga.travel.gelaer.isSettled){
			cga.LogBack();
			cga.AsyncWaitMovement({map:'哥拉尔镇', delay:1000, timeout:5000}, (err, reason)=>{
				if(err){
					cb(err, reason);
					return;
				}
				cga.travel.gelaer.toStoneInternal(stone, cb);
			});
		}
	}
	
	//参数1：传送石名称，有效参数：N S
	cga.travel.gelaer.toStone = (stone, cb)=>{
		if(!cga.travel.gelaer.isvalid(stone)){
			throw new Error('无效的目的地名称');
			return;
		}
		
		cga.travel.gelaer.toStoneInternal(stone, cb);
	}
	
	//前往到哥拉尔医院
	cga.travel.gelaer.toHospital = (cb, isPro)=>{
		if(cga.GetMapName() != '哥拉尔镇'){

			if(cga.travel.gelaer.isSettled){
				cga.LogBack();
				setTimeout(cga.travel.gelaer.toHospital, 1000, cb, isPro);
				return;
			}

			cb(new Error('"前往哥拉尔医院"功能必须从哥拉尔镇启动'));
			return;
		}
		cga.travel.gelaer.toStone('N', ()=>{
			cga.walkList([
				[165, 91, '医院'],
				isPro ? [28, 25] : [29, 26],
			], ()=>{
				if(isPro)
					cga.turnTo(28, 24);
				else
					cga.turnTo(30, 26);
				cb(null);
			});
		});
	}

	//前往到哥拉尔银行
	cga.travel.gelaer.toBank = (cb)=>{
		if(cga.GetMapName() != '哥拉尔镇'){

			if(cga.travel.gelaer.isSettled){
				cga.LogBack();
				setTimeout(cga.travel.gelaer.toBank, 1000, cb);
				return;
			}

			cb(new Error('"前往哥拉尔银行"功能必须从哥拉尔镇启动'));
			return;
		}
		cga.travel.gelaer.toStone('N', ()=>{
			cga.walkList([
				[167, 66, '银行'],
				[25, 10],
			], ()=>{
				cga.turnDir(0);
				cb(null);
			});
		});
	}

	//前往鲁米那斯村
	cga.travel.gelaer.toLumi = (cb)=>{
		if(cga.GetMapName() != '哥拉尔镇'){

			if(cga.travel.gelaer.isSettled){
				cga.LogBack();
				setTimeout(cga.travel.gelaer.toLumi, 1000, cb);
				return;
			}

			cb(new Error('"前往鲁米那斯村"功能必须从哥拉尔镇启动'));
			return;
		}
		cga.travel.gelaer.toStone('N', ()=>{
			cga.walkList([
				[176,105,'库鲁克斯岛'],
				[477,525],
			], ()=>{
				cga.turnTo(477, 526);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitMovement({x : 476, y : 528, delay:1000, timeout:5000}, ()=>{
						cga.walkList([
						[322, 883,'鲁米那斯']
						], ()=>{
							cb(null);
						});
					});
				});
			});
		});
	}
	
	cga.travel.lumi = {};
	
	//前往鲁村商店
	cga.travel.lumi.toStore = (cb)=>{
		if(cga.GetMapName() != '鲁米那斯'){
			cb(new Error('必须从鲁米那斯启动'));
			return;
		}
		cga.walkList([
			[88, 51,'杂货店'],
			[11, 12],
		], ()=>{
			cga.turnTo(13, 12);
			cb(null);
		});
	}
	
	//前往鲁村医院
	cga.travel.lumi.toHospital = (cb, isPro)=>{
		if(cga.GetMapName() != '鲁米那斯'){
			cb(new Error('必须从鲁米那斯启动'));
			return;
		}
		cga.walkList(
		[
			[87, 35, '医院'],
			isPro == true ? [17, 5] : [17, 16],
		], ()=>{
			cga.turnDir(0);
			cb(null);
		});
	}

	//从哥拉尔到法兰
	cga.travel.gelaer.toFalan = (cb)=>{
		if(cga.GetMapName() != '哥拉尔镇'){
			cb(new Error('必须从哥拉尔镇启动'));
			return;
		}

		var stage4 = ()=>{
			cga.walkList([
				[47, 83, '村长的家'],
				[14, 17, '伊尔村的传送点'],
				[20, 10],
			], (r)=>{
				cga.TurnTo(22, 10);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'启程之间'}, ()=>{
						cga.walkList([
							[25, 24, '里谢里雅堡 1楼'],
							[74, 40, '里谢里雅堡'],
						], cb);
					});
				});
			});
		}
		
		var stage3 = ()=>{
			cga.walkList([
				[19, 55],
			], (r)=>{
				cga.TurnTo(19, 53);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'港湾管理处'}, ()=>{
						cga.walkList([
							[9, 22, '伊尔'],
							[24, 19],
						], ()=>{
							cga.TurnTo(24, 17);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, -1);
								cga.AsyncWaitMovement({map:'伊尔村'}, stage4);
							});
						});
					});
				});
			});
		}
		
		var retry2 = ()=>{
			cga.TurnTo(71, 26);
			cga.AsyncWaitNPCDialog((err, dlg)=>{				
				if(dlg && dlg.message.indexOf('现在正停靠在伊尔村') >= 0 && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'往哥拉尔栈桥'}, ()=>{
						stage3();
					});
					return;
				}
				
				setTimeout(retry2, 5000);
			});
		}

		var retry = ()=>{
			cga.TurnTo(53, 50);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				if(dlg && dlg.options == 12){
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'铁达尼号'}, retry2);
					return;
				}
				
				setTimeout(retry, 5000);
			});
		}
		
		cga.walkList([
			[96, 211, '哥拉尔镇 港湾管理处'],
			[8, 5],
		], ()=>{
			cga.TurnTo(8, 3);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(32, -1);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'往伊尔栈桥'}, ()=>{
						cga.walkList([
						[51, 50],
						], retry);
					});
				});
			});
		});
	}

	cga.calculatePath = (curX, curY, targetX, targetY, targetMap, dstX, dstY, newList)=>{
		var walls = cga.buildMapCollisionMatrix();
		var grid = new PF.Grid(walls.matrix);
		var finder = new PF.AStarFinder({
			allowDiagonal: true,
			dontCrossCorners: true
		});
		
		//console.log('x_size ' + walls.x_size);
		//console.log('y_size ' + walls.y_size);
		
		//console.log('xbot ' + walls.x_bottom);
		//console.log('ybot ' + walls.y_bottom);

		var frompos = [curX - walls.x_bottom, curY - walls.y_bottom];
		var topos = [targetX - walls.x_bottom, targetY - walls.y_bottom];
		//console.log('寻路起始坐标 ('  + (frompos[0]) + ', '+ (frompos[1]) + ')');
		//console.log('寻路目的坐标 ('  + (topos[0]) +', '+(topos[1]) + ')');
		
		if(frompos[0] >= 0 && frompos[0] < walls.x_size && 
		frompos[1] >= 0 && frompos[1] < walls.y_size &&
			topos[0] >= 0 && topos[0] < walls.x_size && 
			topos[1] >= 0 && topos[1] < walls.y_size){
		
			//console.log('using AStar path finder...');
			
			var path = finder.findPath(frompos[0], frompos[1], topos[0], topos[1], grid);
			
			if(path.length)
			{
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

				//console.log('result joints');					
				//console.log(joint);

				newList = joint.concat(newList);
				
				//console.log('新寻路列表:');			
				//console.log(newList);
				
				return newList;
			}
		}
		
		throw new Error('发现严重错误：寻路失败！');
		//return [];
	}
	
	cga.getMapXY = ()=>{
		var f = cga.GetMapXYFloat();
		return {x: parseInt(f.x/64.0), y:parseInt(f.y/64.0)};
	}
	
	cga.NoRollbackMap = [
	'艾尔莎岛',
	'艾夏岛',
	'利夏岛',
	'法兰城',
	'里谢里雅堡',
	'医院',
	'工房',
	'村长的家',
	'曙光骑士团营地',
	'辛希亚探索指挥部',
	'圣骑士营地',
	'哥拉尔镇',
	'鲁米那斯',
	'阿凯鲁法村',
	'坎那贝拉村',
	'加纳村',
	'奇利村',
	'杰诺瓦镇',
	'伊尔村',
	'伊尔',
	'维诺亚村',
	'乌克兰村',
	'亚留特村',
	'圣拉鲁卡村',
	'地下工房',
	'阿巴尼斯村',
	'魔法大学',
	'魔法大学内部',
	'杂货店',
	'启程之间',
	'追忆之路',
	'港湾管理处',
	'往哥拉尔栈桥',
	'往伊尔栈桥',
	'哥拉尔 港湾管理处',
	];
	
	/*自动寻路走路，调用方式：

		//走到指定地点：
		cga.walkList({
			[坐标x, 坐标y]
		}, cb回调)

		//走到指定地点并切图：
		cga.walkList({
			[坐标x, 坐标y, 地图名]
		}, cb回调)

		//走到指定地点并切图：
		cga.walkList({
			[坐标x, 坐标y, 地图索引]
		}, cb回调)
		
		//走到指定地点并传送至同一张地图的另一坐标（比如辛西娅探索指挥部的楼梯）：
		cga.walkList({
			[坐标x, 坐标y, 地图索引, 传送目标x, 传送目标y]
		}, cb回调)

	*/
	cga.walkList = (list, cb)=>{
		
		//console.log('初始化寻路列表');
		//console.log(list);
		
		if(cga.isMoveThinking){
			throw new Error('发现严重错误：已有walkList在运行中');
		}

		cga.isMoveThinking = true;

		if(!cga.moveThink('walkList')){
			console.log('walkList被中断');
			cga.isMoveThinking = false;
			return;
		}

		var walkedList = [];
		var newList = list.slice(0);
		
		var walkCb = ()=>{

			if(newList.length == 0){
				cga.isMoveThinking = false;
				cb(null);
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

			console.log('当前地图: ' + curmap + ', 序号 ' + curmapindex);
			console.log('当前 (%d, %d) -> 目标 (%d, %d)', curpos.x, curpos.y, targetX, targetY);
			if(targetMap)
			{
				console.log('目标地图');
				console.log(targetMap);
			}
			
			var end = (arg)=>{
				
				if(cga.NoRollbackMap.find((n)=>{
					return n == curmap;
				}) != undefined)
				{
					cga.isMoveThinking = false;
					cb(null);
					return;
				}

				var waitBattle2 = ()=>{
					if(!cga.isInNormalState()){
						setTimeout(waitBattle2, 1500);
						return;
					}

					if(!cga.moveThink('walkList')){
						console.log('walkList被中断');
						cga.isMoveThinking = false;
						return;
					}

					var curpos = cga.GetMapXY();
					if(typeof walkedList[walkedList.length-1][2] != 'string' &&
					typeof walkedList[walkedList.length-1][2] != 'number' &&
						(curpos.x != walkedList[walkedList.length-1][0] || 
						curpos.y != walkedList[walkedList.length-1][1])
						){
						
						//console.log(curpos);
						//console.log(walkedList);
						console.log('坐标错误，回滚到最后一个路径点');
						
						var endpos = walkedList.pop();
						newList = cga.calculatePath(curpos.x, curpos.y, endpos[0], endpos[1], endpos[2], null, null, newList);
						walkCb();
						return;
					}
					
					cga.isMoveThinking = false;
					cb(null);
					return;
				}
				setTimeout(waitBattle2, 1500);
			}
			
			var walker = (err, reason)=>{
				
				if(!cga.moveThink('walkList')){
					console.log('walkList被中断');
					cga.isMoveThinking = false;
					return;
				}

				//console.log(result);
				//console.log(reason);

				if(err){
					
					if(reason == 4){
						//console.log('地图发生非预期的切换！');
						var curmap = cga.GetMapName();
						var curmapindex = cga.GetMapIndex().index3;
						
						console.log('当前地图: ' + curmap);
						console.log('当前地图序号: ' + curmapindex);
					}
				
					//we are in battle status, wait a second then try again until battle is end
					//or we are forcely moved back to an position by server
					if(reason == 2 || reason == 5){
						
						var waitBattle = ()=>{
							if(!cga.isInNormalState()){
								setTimeout(waitBattle, 1000);
								return;
							}
							
							var curmap = cga.GetMapName();
							var curmapindex = cga.GetMapIndex().index3;
							var curpos = cga.GetMapXY();
							
							console.log('战斗回滚');
							console.log('当前地图 ：' + curmap);
							console.log('当前地图序号 ：' + curmapindex);
							console.log('当前坐标：' + curpos.x + ', ' + curpos.y);
							
							if(typeof targetMap == 'string' && curmap == targetMap){
								
								if(newList.length == 0){
									console.log('寻路正常结束1');
									end({ map : targetMap });
									return;
								}
								
								walkCb();
								return;
							}
							else if(typeof targetMap == 'number' && curmapindex == targetMap){
								
								if(newList.length == 0){
									console.log('寻路正常结束2');
									end({ map : targetMap });
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
						
						//console.log('当前寻路卡住，抛出错误！');
						throw new Error('发现严重错误：当前寻路卡住！');
					}

					cga.isMoveThinking = false;
					cb(err, reason);
					return;
				}

				if(newList.length == 0){
					console.log('寻路正常结束3');
					end( {pos : [targetX, targetY], map : targetMap} );
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
		var skill = cga.GetSkillsInfo().find((sk)=>{
			if(match && sk.name == name){
				return true;
			}
			if(!match && sk.name.indexOf(name) != -1){
				return true;
			}
			return false;
		});

		return skill != undefined ? skill : null;
	}
	
	//查找宝箱
	cga.findCrate = function(filter){
		var unit = cga.GetMapUnits().find((u)=>{
			if(u.valid == 2 && u.type == 2 && u.model_id != 0 && (u.flags & 1024) != 0)
				return filter(u);
			
			return false;
		});
		
		return unit != undefined ? unit : null;
	}
	
	//搜索NPC，支持过滤器
	cga.findNPCEx = function(filter){
		var unit = cga.GetMapUnits().find((u)=>{
			if(u.valid == 2 && u.type == 1 && u.model_id != 0 && (u.flags & 4096) != 0)
				return filter(u);
			
			return false;
		});
		
		return unit != undefined ? unit : null;
	}

	//按名称搜索NPC
	cga.findNPC = function(name){
		return cga.findNPCEx((u)=>{
			return (u.unit_name == name);
		});
	}
	
	//按坐标搜索NPC
	cga.findNPCByPosition = function(name, x, y){
		return cga.findNPCEx((u)=>{
			return (u.unit_name == name && x == u.xpos && y == u.ypos);
		});
	}

	//取背包中的物品数量
	//参数1：物品名, 或#物品id，或过滤函数
	//参数2：是否包括装备栏
	cga.getItemCount = function(filter){
		var includeEquipment = arguments[1] === true ? true : false;
		var items = cga.GetItemsInfo();
		var count = 0;
		if(typeof filter == 'string' && filter.charAt(0) == '#'){
			var itemid = parseInt(filter.substring(1));
			items.forEach((item)=>{
				if(!includeEquipment && item.pos < 8)
					return false;
				if(item.itemid == itemid)
					count += item.count > 0 ? item.count : 1;
			});
		} else if(typeof filter == 'number'){
			var itemid = filter;
			items.forEach((item)=>{
				if(!includeEquipment && item.pos < 8)
					return false;
				if(item.itemid == itemid)
					count += item.count > 0 ? item.count : 1;
			});
		} else if(typeof filter == 'function'){
			var itemid = filter;
			items.forEach((item)=>{
				if(!includeEquipment && item.pos < 8)
					return false;
				if(filter(item) == true)
					count += item.count > 0 ? item.count : 1;
			});
		} else {
			items.forEach((item)=>{
				if(!includeEquipment && item.pos < 8)
					return false;
				if(item.name == filter)
					count += item.count > 0 ? item.count : 1;
			});
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
				if(cb)
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
				if(r === false || r instanceof Error){
					if(cb)
						cb(r);
					return;
				}
				//console.trace()
				
				if(r === true || r === null){
					console.log('第'+(index+1)+'阶段执行完成。');
					objThis.doNext(index + 1, cb);
				} else if( r == 'restart stage' ){
					console.log('第'+(index+1)+'阶段请求重新执行。');
					objThis.doNext(index, cb);
				} else if( r == 'restart task' ){
					console.log('第'+(index+1)+'阶段请求重新执行。');
					objThis.doNext(index, cb);
				} else  {
					throw new Error('无效参数');
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
	cga.task.waitForNPC = (filter, cb)=>{
		if(!cga.findNPC(filter)){
			setTimeout(cga.task.waitForNPC, 10000, filter, cb);
			cga.SayWords('', 0, 3, 1);
			return;
		}
		
		cb(null);
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
		
	cga.craft.buyFabricLv1Multi = (arr, cb)=>{
		cga.travel.falan.toFabricStore(()=>{
			cga.walkList([
			[8, 7],
			], ()=>{
				cga.TurnTo(8, 6);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.BuyNPCStore(arr);
						cga.AsyncWaitNPCDialog(()=>{
							cb(null);
						});
					});
				});
			});
		});
	}
	
	cga.craft.buyFabricLv1 = (id, count, cb)=>{
		cga.craft.buyFabricLv1Multi([{index:id, count:count}], cb);
	}
	
	cga.craft.buyFabricLv2Multi = (arr, cb)=>{
		cga.travel.falan.toTeleRoom('维诺亚村', ()=>{
			cga.walkList([
			[5, 1, '村长家的小房间'],
			[0, 5, '村长的家'],
			[9, 16, '维诺亚村'],
			[56, 42, '装备品店'],
			[13, 8],
			], ()=>{
				cga.TurnTo(13, 6);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.BuyNPCStore(arr);
						cga.AsyncWaitNPCDialog(()=>{
							cb(null);
						});
					});
				});
			});
		});
	}
	
	cga.craft.buyFabricLv2 = (id, count, cb)=>{
		cga.craft.buyFabricLv2Multi([{index:id, count:count}], cb);
	}
	
	cga.craft.buyFabricLv3Multi = (arr, cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
			[14, 6, '村长的家'],
			[1, 9, '杰诺瓦镇'],
			[43, 23, '杂货店'],
			[11, 12],
			], ()=>{
				cga.TurnTo(13, 12);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.BuyNPCStore(arr);
						cga.AsyncWaitNPCDialog(()=>{
							cb(null);
						});
					});
				});
			});
		});
	}
	
	cga.craft.buyFabricLv3 = (id, count, cb)=>{
		cga.craft.buyFabricLv3Multi([{index:id, count:count}], cb);
	}
	
	cga.craft.buyFabricLv4Multi = (arr, cb)=>{
		cga.travel.falan.toTeleRoom('魔法大学', ()=>{
			cga.walkList([
			[74, 93, '魔法大学内部'],
			[29, 43, '更衣室'],
			[11, 8],
			], ()=>{
				cga.TurnTo(11, 6);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.BuyNPCStore(arr);
						cga.AsyncWaitNPCDialog(()=>{
							cb(null);
						});
					});
				});
			});
		});
	}
	
	cga.craft.buyFabricLv4 = (id, count, cb)=>{
		cga.craft.buyFabricLv4Multi([{index:id, count:count}], cb);
	}
	
	cga.craft.buyFabricLv5Multi = (arr, cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
			[5, 4, 4313],
			[13, 5],
			], ()=>{
				cga.TurnTo(13, 3);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.BuyNPCStore(arr);
						cga.AsyncWaitNPCDialog(()=>{
							cb(null);
						});
					});
				});
			});
		});
	}
	
	cga.craft.buyFabricLv5 = (id, count, cb)=>{
		cga.craft.buyFabricLv5Multi([{index:id, count:count}], cb);
	}
	
	//搜索第一个可鉴定的物品
	cga.findAssessableItem = ()=>{
		var skill = cga.findPlayerSkill('鉴定');
		var mp = cga.GetPlayerInfo().mp;
		var found = cga.getInventoryItems().find((item)=>{
			return !item.assessed && skill.lv >= item.level && mp >= item.level * 10;
		});
		return found == undefined ? null : found;
	}
	
	//鉴定背包中所有的物品
	cga.assessAllItems = (cb)=>{
		var item = cga.findAssessableItem();
		if(item)
		{
			cga.manipulateItemEx({
				skill : '鉴定',
				itempos : item.pos,
				immediate : true,
			}, (err, results)=>{
				setTimeout(cga.assessAllItems, 500, cb);
			})
		} else {
			cb(null);
			return;
		}
	}
	
	cga.findItem = (filter) =>{
		
		var items = cga.getInventoryItems();
		
		if(typeof filter == 'string' && filter.charAt(0) == '#'){
			var found = items.find((item)=>{
				return item.itemid == parseInt(filter.substring(1));
			})
			
			return found != undefined ? found.pos : -1;
		}
		
		var found = items.find((item)=>{
			if(typeof filter == 'string')
				return item.name == filter;
			else if (typeof filter == 'number')
				return item.itemid == filter;
			else if (typeof filter == 'function')
				return filter(item);
		})
			
		return found != undefined ? found.pos : -1;
	}
	
	//寻找背包里符合条件的物品，并整合成符合cga.SellStore和cga.AddTradeStuffs的数组格式
	cga.findItemArray = (filter) =>{
		
		var arr = [];
		var items = cga.getInventoryItems();
		
		if(typeof filter == 'function'){
			items.forEach((item)=>{
				if(filter(item)){
					arr.push({
					itempos : item.pos,
					itemid : item.itemid,
					count : (item.count < 1) ? 1 : item.count,
					});
				}
			})
			return arr;
		}
		
		if(typeof filter =='string' && filter.charAt(0) == '#'){
			items.forEach((item)=>{
				if(item.itemid == filter.substring(1)){
					arr.push({
					itempos : item.pos,
					itemid : item.itemid,
					count : (item.count < 1) ? 1 : item.count,
					});
				}
			})
			return arr;
		}
		
		items.forEach((item)=>{
			if(filter instanceof RegExp){
				//console.log(itemname.exec(items[i].name));
				if(filter.exec(item.name)){
					arr.push({
					itempos : item.pos,
					itemid : item.itemid,
					count : (item.count < 1) ? 1 : item.count,
					});
				}
			}
			else if(typeof filter =='string'){
				if(item.name == filter){
					arr.push({
					itempos : item.pos,
					itemid : item.itemid,
					count : (item.count < 1) ? 1 : item.count,
					});
				}
			}
		});
		return arr;
	}
	
	//出售物品
	cga.sellArray = (sellarray, cb)=>{
		cga.AsyncWaitNPCDialog((err, dlg)=>{
			var numOpt = dlg.message.charAt(dlg.message.length-1);
			cga.ClickNPCDialog(0, numOpt == '3' ? 1 : 0);
			cga.AsyncWaitNPCDialog(()=>{
				cga.SellNPCStore(sellarray);
				cga.AsyncWaitNPCDialog(()=>{
					cb(true);
				});
			});
		});
	}
	
	//获取背包里能够出售的物品
	cga.getSellStoneItem = ()=>{
		var pattern = /(.+)的卡片/;
		var sellArray = []
		cga.getInventoryItems().forEach((item)=>{
			if(item.name == '魔石' || item.name == '卡片？' || pattern.exec(item.name) ){
				sellArray.push({
					itempos : item.pos,
					itemid : item.itemid,
					count : (item.count < 1) ? 1 : item.count,
				});
			}				
		})		
		return sellArray;
	}
	
	//清理背包里无用的物品
	cga.cleanInventory = (count, cb)=>{
		if(cga.getInventoryItems().length >= 21 - count)
		{
			var items = cga.getSellStoneItem();
			if(items.length > 0){
				cga.DropItem(items[0].itempos);
				if(cb)
					setTimeout(cga.cleanInventory, 500, count, cb);
			} else {
				cb(new Error('没有可以扔的物品了'));
			}
		} else {
			cb(null);
		}
	}
	
	//循环清理背包里无用的物品直到无东西可清
	cga.cleanInventoryEx = (filter, cb)=>{
		var items = cga.getInventoryItems().filter(filter);
		if(items.length > 0){
			cga.DropItem(items[0].pos);
			setTimeout(cga.cleanInventory, 500, count, filter, cb);
		} else {
			cb(null);
		}
	}
	
	//出售魔石
	cga.sellStone = (cb)=>{
		cga.AsyncWaitNPCDialog((err, dlg)=>{
			if(err){
				cb(err);
				return;
			}
			
			var numOpt = dlg.message.charAt(dlg.message.length-1);
			cga.ClickNPCDialog(0, numOpt == '3' ? 1 : 0);
			cga.AsyncWaitNPCDialog(()=>{
				cga.SellNPCStore(cga.getSellStoneItem());
				setTimeout(cb, 1000, null);
			});
		});
	}
	
	//获取坐标之间的距离
	cga.getDistance = (x1, y1, x2, y2)=>{		
		return Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
	}
	
	//判断坐标之间的距离是否小于等于1
	cga.isDistanceClose = (x1, y1, x2, y2)=>{
		if(x1 - x2 <= 1 && x1 - x2 >= -1 && y1 - y2 <= 1 && y1 - y2 >= -1)
			return true;
		return false;
	}

	//寻找银行中的空闲格子
	cga.findBankEmptySlot = (filter, maxcount) =>{
		
		var banks = cga.GetBankItemsInfo();

		var arr = [];

		for(var i = 0; i < banks.length; ++i){
			arr[banks[i].pos-100] = banks[i];
		}
		
		for(var i = 0; i < 80; ++i){
			if(typeof arr[i] != 'undefined'){
				if(typeof filter == 'string' && maxcount > 0){
					if(arr[i].name == filter && arr[i].count < maxcount)
						return 100+i;
				}
				else if(typeof filter == 'number' && maxcount > 0){
					if(arr[i].itemid == filter && arr[i].count < maxcount)
						return 100+i;
				}
				else if(typeof filter == 'function' && maxcount > 0){
					if(filter(arr[i]) && arr[i].count < maxcount)
						return 100+i;
				}
			} else {
				return 100+i;
			}
		}
		
		return -1;
	}
	
	//寻找背包中的空闲格子
	cga.findInventoryEmptySlot = (itemname, maxcount) =>{
		
		var items = cga.GetItemsInfo();

		var arr = [];

		for(var i = 0; i < items.length; ++i){
			arr[items[i].pos-8] = items[i];
		}
		
		for(var i = 0; i < 20; ++i){
			if(typeof arr[i] != 'undefined'){
				if(typeof itemname == 'string' && maxcount > 0){
					if(arr[i].name == itemname && arr[i].count < maxcount)
						return 8+i;
				}
			} else {
				return 8+i;
			}
		}
		
		return -1;
	}

	//获取背包中的空闲格子数量
	cga.getInventoryEmptySlotCount = () =>{
		
		var items = cga.GetItemsInfo();

		var arr = [];

		for(var i = 0; i < items.length; ++i){
			arr[items[i].pos-8] = items[i];
		}
		var count = 0;
		
		for(var i = 0; i < 20; ++i){
			if(!arr[i])
				count ++;
		}
		
		return count;
	}

	//将符合条件的物品存至银行，maxcount为最大堆叠数量
	cga.saveToBankOnce = (filter, maxcount, cb)=>{
		var itempos = cga.findItem(filter);
		if(itempos == -1){
			cb(new Error('包里没有该物品, 无法存放到银行'));
			return;
		}
		
		var emptyslot = cga.findBankEmptySlot(filter, maxcount);
		if(emptyslot == -1){
			cb(new Error('银行没有空位, 无法存放到银行'));
			return;
		}
		
		cga.MoveItem(itempos, emptyslot, -1);
		
		var saveToBank = ()=>{
			if(cga.GetItemInfo(emptyslot))
			{
				cb(null);
			}
			else
			{
				cb(new Error('存银行失败，可能银行格子已满'));
			}
		}
		
		setTimeout(saveToBank, 800);
	}
	
	//循环将符合条件的物品存至银行，maxcount为最大堆叠数量
	cga.saveToBankAll = (filter, maxcount, cb)=>{
		var repeat = ()=>{
			cga.saveToBankOnce(filter, maxcount, (err)=>{
				if(err){
					console.log(err);
					cb(err);
					return;
				}
				if(cga.findItem(filter) == -1){
					cb(null);
					return;
				}				
				setTimeout(repeat, 800);
			});
		}
		
		repeat();		
	}
	
	//原地高速移动，dir为方向
	cga.freqMove = function(dir){
		var freqMoveDirTable = [ 4, 5, 6, 7, 0, 1, 2, 3 ];
		var freqMoveDir = dir;
		var pos = cga.GetMapXY();
		var index3 = cga.GetMapIndex().index3;
		var counter = 0;
		var move = ()=>{
			var result = true;
			try
			{
				var curindex3 = cga.GetMapIndex().index3;
				if(curindex3 == index3)
				{
					var curpos = cga.GetMapXY();
					if(freqMoveDir == 0){
						if(pos.x == curpos.x)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					else if(freqMoveDir == 4){
						if(pos.x == curpos.x)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					else if(freqMoveDir == 2){
						if(pos.y == curpos.y)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					else if(freqMoveDir == 6){
						if(pos.y == curpos.y)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					else if(freqMoveDir == 1){
						if(pos.x == curpos.x)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					else if(freqMoveDir == 5){
						if(pos.x == curpos.x)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					else if(freqMoveDir == 3){
						if(pos.y == curpos.y)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					else if(freqMoveDir == 7){
						if(pos.y == curpos.y)
							cga.ForceMove(freqMoveDir, false);
						else
							cga.ForceMove(freqMoveDirTable[freqMoveDir], false);
					}
					
					counter++;
					if(counter % 4 == 0){
						if(!cga.moveThink('freqMove')){
							console.log('freqMove被中断');
							cga.isMoveThinking = false;
							return;
						}
					}
				}
				else
				{
					if(!cga.moveThink('freqMoveMapChanged')){
						console.log('freqMoveMapChanged被中断');
						cga.isMoveThinking = false;
						return;
					}
					console.log('地图不同，freqMove暂停运行');
				}
			}
			catch(e){
				console.log(e);
			}
			
			setTimeout(move, 300);
		}
		
		move();
	}
	
	//从NPC对话框解析商店购物列表
	cga.parseBuyStoreMsg = (dlg)=>{
		
		if(!dlg.message)
			return null;
		
		var reg = new RegExp(/([^|\n]+)/g)
		var match = dlg.message.match(reg);
		
		if(match.length < 5)
			return null;
		
		var storeItemCount = (match.length - 5) / 6;
		
		var obj = {
			storeid : match[0],
			name : match[1],
			welcome : match[2],
			insuff_funds : match[3],
			insuff_inventory : match[4],
			items : []
		}
		for(var i = 0; i < storeItemCount; ++i){
			obj.items.push({
				index : i,
				name : match[5 + 6 * i + 0],
				image_id : match[5 + 6 * i + 1],
				cost : match[5 + 6 * i + 2],
				attr : match[5 + 6 * i + 3],
				unk1 : match[5 + 6 * i + 4],
				max_buy : match[5 + 6 * i + 5],
			});
		}
		return obj;
	}
	
	//获取队伍成员详细信息
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
				teaminfo[i].level = playerinfo.level;
				teaminfo[i].injury = playerinfo.health > 0 ? 1 : 0;
				teaminfo[i].is_me = true;
			}
		}
		return teaminfo;
	}
	
	//和名字为name的玩家组队（必须在附近1x1范围）
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
				cga.AsyncWaitNPCDialog((err, dlg)=>{
					var stripper = "你要和谁组成队伍？";
					if(dlg && dlg.message && dlg.message.indexOf(stripper) >= 0){
						var strip = dlg.message.substr(dlg.message.indexOf(stripper) + stripper.length);
						strip = strip.replace(/\\z/g,"|");
						strip = strip.replace(/\\n/g,"|");
						var reg = new RegExp(/([^|\n]+)/g)
						var match = strip.match(reg);
						//console.log(match);
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
	
	//等待名字在teammates列表中的的玩家组队，并自动踢出不符合teammates列表的陌生人。
	cga.waitTeammates = (teammates, cb)=>{
				
		var teamplayers = cga.getTeamPlayers();
		
		if(teammates.length == 0 && teamplayers.length == 0)
		{
			setTimeout(cb, 2000, true);
			return;
		}
		
		cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);
		
		if(teamplayers.length == teammates.length){
			for(var i = 0; i < teamplayers.length; ++i){
				if(!is_array_contain(teammates, teamplayers[i].name)){
					//Unknown teammates, kick
					cga.DoRequest(cga.REQUEST_TYPE_KICKTEAM);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						var stripper = "你要把谁踢出队伍？";
						if(dlg && dlg.message && dlg.message.indexOf(stripper) >= 0){
							var strip = dlg.message.substr(dlg.message.indexOf(stripper) + stripper.length);
							strip = strip.replace(/\\z/g,"|");
							strip = strip.replace(/\\n/g,"|");
							console.log(strip);
							var reg = new RegExp(/([^|\n]+)/g)
							var match = strip.match(reg);
							//console.log(match);
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
	
	//监听队友聊天信息
	cga.waitTeammateSay = (cb)=>{
		
		cga.AsyncWaitChatMsg((err, r)=>{
			
			if(!r){
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
					
					if (msg.indexOf('[交易]') == 0)
						msg = msg.substr('[交易]' .length);
					listen = cb(fromTeammate, msg);
				}
			}

			if(listen == true)
				cga.waitTeammateSay(cb);
		}, 1000);
	}
	
	//监听队友聊天信息 队友必须说“1”
	cga.waitTeammateSayNextStage = (teammates, cb)=>{
	
		var teammate_state = {};
		var teammate_ready = 0;

		cga.waitTeammateSay((player, msg)=>{

			if(msg == '1' && teammate_state[player.name] !== true){
				teammate_state[player.name] = true;
				teammate_ready ++;
			}

			if((teammates.length && teammate_ready >= teammates.length) || (!teammates.length && teammate_ready == 1)){
				//all teammates are ready
				cb(true);
				return false;
			}
			
			return true;
		});
	}
	
	//监听队友聊天信息 队友必须说“1”或“2”
	cga.waitTeammateSayNextStage2 = (teammates, cb)=>{
		var teammate_state = {};
		var teammate_ready = 0;
		var teammate_notready = 0;

		cga.waitTeammateSay((player, msg)=>{

			if(teammate_state[player.name] !== true && teammate_state[player.name] !== false){
				if(msg == '1'){
					teammate_state[player.name] = true;
					teammate_ready ++;
				} else if(msg == '2'){
					teammate_state[player.name] = false;
					teammate_notready ++;
				}
			}

			if((teammates.length && teammate_ready >= teammates.length) || (!teammates.length && teammate_ready == 1)){
				//all teammates are ready
				cb(true);
				return false;
			}
			
			if((teammates.length && teammate_ready + teammate_notready >= teammates.length) || (!teammates.length && teammate_ready + teammate_notready == 1)){
				//some teammates are not ready
				cb(false);
				return false;
			}
			
			return true;
		});
	}
	
	//把队友带至posArray指定的位置
	cga.walkTeammateToPosition = (posArray, cb) =>{
		
		console.log('cga.walkTeammateToPosition stage1');
		
		if(cga.getTeamPlayers().length == 0)
		{
			cb(null);
			return;
		}
		
		var index = 0;
		
		var walk = ()=>{
			console.log('cga.walkTeammateToPosition walk');
			
			cga.AsyncWalkTo(posArray[index][0], posArray[index][1], null, null, null, checkTeammateAtPosition);
		}
		
		var checkTeammateAtPosition = (err)=>{
			
			console.log('checkTeammateAtPosition 0');
			
			if(!cga.isInNormalState())
			{
				console.log('checkTeammateAtPosition 1');
				setTimeout(checkTeammateAtPosition, 1000);
				return;
			}
			
			var teamplayers = cga.getTeamPlayers();
			var someoneNotInPosArray = false;
			for(var i in teamplayers) {
				var isInPosArray = false;
				for(var j in posArray) {
					if(teamplayers[i].xpos == posArray[j][0] && teamplayers[i].ypos == posArray[j][1]) {
						isInPosArray = true;
						break;
					}
				}
				
				if(!isInPosArray){
					someoneNotInPosArray = true;
					break;
				}
			}
			
			if(someoneNotInPosArray){
				console.log('someoneNotInPosArray');
				
				index ++;
				if(index > posArray.length - 1)
					index = 0;
				walk();
				return;
			}
			
			cga.waitForChatInput((msg, val)=>{
				if(msg.indexOf('遇敌防卡住') >= 0)
				{
					//restart the walk procedure
					if(!cga.isInNormalState())
					{
						console.log('waitForChatInput 0');
						setTimeout(checkTeammateAtPosition, 1000);
					}
					else
					{
						console.log('waitForChatInput 1');
						//or we are at position
						cb(null);
					}
					return false;
				}
				
				return true;
			});
			
			cga.SayWords('遇敌防卡住', 0, 3, 1);
		}
		
		walk();
	}
	
	//监听自己聊天输入（只支持数字）
	cga.waitForChatInput = (cb)=>{
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				var pattern_number=/^[1-9]\d*$|^0$/;
				
				if(cb(msg, pattern_number.test(msg) ? parseInt(msg) : null ) == false)
					return false;
			}

			return true;
		});
	}
	
	//监听系统消息
	cga.waitSysMsg = (cb)=>{
		cga.AsyncWaitChatMsg((err, r)=>{
			if(!r || r.unitid != -1){
				cga.waitSysMsg(cb);
				return;
			}
			
			listen = cb(r.msg);	

			if(listen == true)
				cga.waitSysMsg(cb);
		}, 1000);
	}
	
	//发送超长聊天信息
	cga.sayLongWords = (words, color, range, size)=>{

		console.log(words);

		var splitCount = words.length / 100;
		if(splitCount == 0)
			splitCount = 1;
		
		for(var i = 0;i < splitCount; ++i){
			cga.SayWords(words.substring(i * 100, i * 100 + 100), color, range, size);
		}		
	}
	
	//监听登录状态
	cga.waitConnState = (cb)=>{
		cga.AsyncWaitConnectionState((err, r)=>{
			if(err){
				cga.waitConnState(cb);
				return;
			}

			if(cb(r) == true)
				cga.waitSysMsg(cb);
		}, 10000);
	}

	/*等待到达某位置，无超时时间限制

		等待到达民家(14,10)，如果解散了队伍则自动走到(13,10)处：
			cga.waitForLocation({mapname : '民家', pos : [14, 10], leaveteam : true, walkto : [13, 10]}, cb);

		等待到达地图索引号为24074的地图的(21,12)处：
			cga.waitForLocation({mapindex: 24074, pos:[21, 12] }, cb);
	*/
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
		
		if(obj.desired_teamplayers != undefined)
		{
			var teamplayersnow = cga.getTeamPlayers();
			
			if(teamplayersnow.length < obj.desired_teamplayers.length)
			{
				cb(new Error('当前队伍人数 '+teamplayersnow.length+' 小于预期值 '+obj.desired_teamplayers.length+', 可能队伍已解散，取消等待。'));
				return;
			}
		}
		
		if(passCheck){
			cb(null);
			return;
		}
		
		setTimeout(cga.waitForLocation, 1000, obj, cb);
	}
	
	/*等待到达某位置，无超时时间限制
		和cga.waitForLocation一样，只是可以等待多个位置，只要满足其中一个就能触发回调。
	*/
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
				if(obj.cb(null) == true)
					return;
			}
		}
		
		if(obj.desired_teamplayers != undefined)
		{
			var teamplayersnow = cga.getTeamPlayers();
			
			if(teamplayersnow.length < obj.desired_teamplayers.length)
			{
				if( obj.cb(new Error('当前队伍人数 '+teamplayersnow.length+' 小于预期值 '+obj.desired_teamplayers.length+', 可能队伍已解散，取消等待。')) == true)
					return;
			}
		}
		
		setTimeout(cga.waitForMultipleLocation, 1000, arr);
	}
	
	cga.cachedMapTileMatrix = null;
	cga.cachedMapTileMatrixTime = 0;
	
	cga.buildMapTileMatrix = ()=>{
		var curtime = (new Date()).getTime();
		if(1 || cga.cachedMapTileMatrix == null || curtime > cga.cachedMapTileMatrixTime + 200)
		{
			var wall = cga.GetMapTileTable(true);
			var matrix = [];
			for(var y = 0; y < wall.y_size; ++y){
				if(!matrix[y])
					matrix[y] = [];
				for(var x = 0; x < wall.x_size; ++x){
					matrix[y][x] = wall.cell[x + y * wall.x_size];
				}
			}
			
			cga.cachedMapTileMatrix = curtime;
			cga.cachedMapTileMatrix = {matrix : matrix, x_bottom : wall.x_bottom, y_bottom : wall.y_bottom, x_size : wall.x_size, y_size : wall.y_size};
		}
		return cga.cachedMapTileMatrix;
	}
	
	cga.cachedMapCollisionRawMatrix = null;
	cga.cachedMapCollisionRawMatrixTime = 0;
	
	cga.buildMapCollisionRawMatrix = ()=>{
		var curtime = (new Date()).getTime();
		if(1 || cga.cachedMapCollisionRawMatrix == null || curtime > cga.cachedMapCollisionRawMatrixTime + 200)
		{
			var wall = cga.GetMapCollisionTableRaw(true);
			var matrix = [];
			for(var y = 0; y < wall.y_size; ++y){
				if(!matrix[y])
					matrix[y] = [];
				for(var x = 0; x < wall.x_size; ++x){
					matrix[y][x] = wall.cell[x + y * wall.x_size];
				}
			}
			
			cga.cachedMapCollisionRawMatrixTime = curtime;
			cga.cachedMapCollisionRawMatrix = {matrix : matrix, x_bottom : wall.x_bottom, y_bottom : wall.y_bottom, x_size : wall.x_size, y_size : wall.y_size};
		}
		
		return cga.cachedMapCollisionRawMatrix;
	}
	
	cga.cachedMapCollisionMatrix = null;
	cga.cachedMapCollisionMatrixTime = 0;
	
	cga.buildMapCollisionMatrix = (exitIsBlocked)=>{
		var curtime = (new Date()).getTime();
		if(1 || cga.cachedMapCollisionMatrix == null || curtime > cga.cachedMapCollisionMatrixTime + 200)
		{
			var wall = cga.GetMapCollisionTable(true);
			var objs = null;
			if(exitIsBlocked == true)
				objs = cga.GetMapObjectTable(true);
			var matrix = [];
			for(var y = 0; y < wall.y_size; ++y){
				if(!matrix[y])
					matrix[y] = [];
				for(var x = 0; x < wall.x_size; ++x){
					matrix[y][x] = wall.cell[x + y * wall.x_size] == 1 ? 1 : 0;
					if(exitIsBlocked == true){
						if(objs.cell[x + y * objs.x_size] & 0xff){
							matrix[y][x] = 1;
						}
					}
				}
			}
		
			cga.cachedMapCollisionMatrixTime = curtime;
			cga.cachedMapCollisionMatrix = {matrix : matrix, x_bottom : wall.x_bottom, y_bottom : wall.y_bottom, x_size : wall.x_size, y_size : wall.y_size};
		}
		
		return cga.cachedMapCollisionMatrix;
	}
	
	cga.cachedMapObjectMatrix = null;
	cga.cachedMapObjectMatrixTime = 0;
	
	cga.buildMapObjectMatrix = ()=>{
		var curtime = (new Date()).getTime();
		if(1 || cga.cachedMapObjectMatrix == null || curtime > cga.cachedMapObjectMatrixTime + 200)
		{
			var wall = cga.GetMapObjectTable(true);
			var matrix = [];
			for(var y = 0; y < wall.y_size; ++y){
				if(!matrix[y])
					matrix[y] = [];
				for(var x = 0; x < wall.x_size; ++x){
					matrix[y][x] = wall.cell[x + y * wall.x_size] & 0xff;
				}
			}
			
			cga.cachedMapObjectMatrixTime = curtime;
			cga.cachedMapObjectMatrix = {matrix : matrix, x_bottom : wall.x_bottom, y_bottom : wall.y_bottom, x_size : wall.x_size, y_size : wall.y_size};
		}
		
		return cga.cachedMapObjectMatrix;
	}
	
	cga.cachedMapObjects = null;
	cga.cachedMapObjectsTime = 0;
	
	cga.getMapObjects = ()=>{
		var curtime = (new Date()).getTime();
		if(1 || cga.cachedMapObjects == null || curtime > cga.cachedMapObjectsTime + 200)
		{
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
			
			cga.cachedMapObjectsTime = curtime;
			cga.cachedMapObjects = objs;
		}
		
		return cga.cachedMapObjects;
	}

	//搜索玩家单位
	cga.findPlayerUnit = (filter)=>{
		var found = cga.GetMapUnits().find((u)=>{
			return u.valid == 2 && u.type == 8 && (u.flags & 256) == 256 && ((typeof filter == 'function' && filter(u)) || (typeof filter == 'string' && filter == u.unit_name)) ;
		});
		return found != undefined ? found : null;
	}
	
	//下载地图的部分区域并等待下载完成
	cga.downloadMapEx = (xfrom, yfrom, xsize, ysize, cb)=>{
		var last_index3 = cga.GetMapIndex().index3;
		var x = xfrom, y = yfrom;
		var recursiveDownload = ()=>{
			cga.RequestDownloadMap(x, y, x+24, y+24);
			x += 24;
			if(x > xsize){
				y += 24;
				x = xfrom;
			}
			if(y - ysize >= 24){
				var waitDownloadEnd = (timeout = 3000) => cga.AsyncWaitDownloadMap((err, msg) => {
					if (err) {
						if(last_index3 != cga.GetMapIndex().index3){
							cb(new Error('地图发生变化，下载失败'));
							return;
						}
						cb(null);
						return;
					}

					if ((msg.xtop >= xsize && msg.ytop >= ysize) || (msg.xbase == 0 && msg.ybase == 0)) {
						waitDownloadEnd(500);
					} else {
						waitDownloadEnd(timeout);
					}
				}, timeout);
				waitDownloadEnd();
				return;
			}
			setTimeout(recursiveDownload, 500);
		}
		recursiveDownload();
	}
	
	//下载整张地图并等待下载完成
	cga.downloadMap = (cb)=>{
		var walls = cga.buildMapCollisionMatrix(true);
		cga.downloadMapEx(0, 0, walls.x_size, walls.y_size, cb);
	}
	
	/*走一层迷宫
		target_map :  走到目标地图就停止，填null则自动解析地图名中的楼层，填''则允许任何形式的地图作为目标楼层。
		filter (可选) : {
			layerNameFilter : 自定义解析地图名的方法
			entryTileFilter : 自定义解析楼梯的方法
		}
	*/
	cga.walkMaze = (target_map, cb, filter)=>{

		var objs = cga.getMapObjects();
		
		var pos = cga.GetMapXY();
		
		var newmap = null;

		if(typeof target_map != 'string'){
			var mapname = cga.GetMapName();
			
			var regex = mapname.match(/([^\d]*)(\d+)([^\d]*)/);
			var layerIndex = 0;

			if(regex && regex.length >= 3){
				layerIndex = parseInt(regex[2]);
			}
			
			if(layerIndex == 0){
				cb(new Error('无法从地图名中解析出楼层'));
				return;
			}
			
			if(filter && (typeof filter.layerNameFilter == 'function'))
			{
				newmap = filter.layerNameFilter(layerIndex, regex);
			}
			else
			{
				newmap = regex[1] + ((layerIndex >= 100) ? (layerIndex + 100) : (layerIndex + 1));
				if(typeof regex[3] == 'string')
					newmap += regex[3];
			}
		} else {
			newmap = target_map;
		}

		var target = null;
		
		if(filter && (typeof filter.entryTileFilter == 'function'))
		{
			var tiles = cga.buildMapTileMatrix();
			var colraw = cga.buildMapCollisionRawMatrix();
			objs.forEach((obj)=>{
				if(target == null && obj.cell == 3 && obj.mapx < colraw.x_size && obj.mapy < colraw.y_size && filter.entryTileFilter({
					tile : tiles.matrix[obj.mapy][obj.mapx],
					colraw : colraw.matrix[obj.mapy][obj.mapx],
					obj : obj,
				}) == true ){
					target = obj;
					return false;
				}
			});
		}
		else
		{
			objs.forEach((obj)=>{
				if(obj.mapx == pos.x && obj.mapy == pos.y)
					return;
				if(target == null && obj.cell == 3){
					target = obj;
					return false;
				}
			});
		}
		
		if(target == null){
			cb(new Error('无法找到迷宫的出口'));
			return;
		}

		var walklist = cga.calculatePath(pos.x, pos.y, target.mapx, target.mapy, newmap, null, null, []);
		if(walklist.length == 0){
			cb(new Error('无法计算到迷宫出口的路径'));
			return;
		}

		cga.walkList(walklist, (err, reason)=>{
			cb(err, reason);
			return;
		});
	}

	//判断当前地图是否已经下载完成
	
	cga.isMapDownloaded = ()=>{
		var tiles = cga.buildMapTileMatrix(true);
		
		for(var y = 0; y < tiles.y_size; ++y){
			for(var x = 0; x < tiles.x_size; ++x){
				if(tiles.matrix[y][x] == 0)
					return false;
			}
		}
		
		return true;
	}
	
	//走一层随机迷宫，和cga.walkMaze的区别是走之前会先下载地图
	
	cga.walkRandomMaze = (target_map, cb, filter)=>{
		if(!cga.isMapDownloaded())
		{
			cga.downloadMap(()=>{
				cga.walkMaze(target_map, cb, filter);
			});
		} 
		else
		{
			cga.walkMaze(target_map, cb, filter);
		}
	}
	
	/**
	 * targetFinder返回unit object 或者 true都将停止搜索
	 * cga.searchMap(units => units.find(u => u.unit_name == '守墓员' && u.type == 1) || cga.GetMapName() == '？？？', result => {
	 * 	console.log(result);
	 * });
	 */
	 //, recursion = true
	cga.searchMap = (targetFinder, cb) => {
		const getMovablePoints = (map, start) => {
			const foundedPoints = {};
			foundedPoints[start.x + '-' + start.y] = start;
			const findByNextPoints = (centre) => {
				const nextPoints = [];
				const push = (p) => {
					if (p.x > map.x_bottom && p.x < map.x_size && p.y > map.y_bottom && p.y < map.y_size) {
						if (map.matrix[p.y][p.x] === 0) {
							const key = p.x + '-' + p.y;
							if (!foundedPoints[key]) {
								foundedPoints[key] = p;
								nextPoints.push(p);
							}
						}
					}
				};
				push({x: centre.x + 1, y: centre.y});
				push({x: centre.x + 1, y: centre.y + 1});
				push({x: centre.x, y: centre.y + 1});
				push({x: centre.x - 1, y: centre.y + 1});
				push({x: centre.x - 1, y: centre.y});
				push({x: centre.x - 1, y: centre.y - 1});
				push({x: centre.x, y: centre.y - 1});
				push({x: centre.x + 1, y: centre.y - 1});
				nextPoints.forEach(findByNextPoints);
			};
			findByNextPoints(start);
			return foundedPoints;
		};
		const getFarthestEntry = (current) => {
			return cga.getMapObjects().filter(e => [3,10].indexOf(e.cell) >= 0 && (e.mapx != current.x || e.mapy != current.y)).sort((a, b) => {
				const distanceA = Math.abs(a.mapx - current.x) + Math.abs(a.mapy - current.y);
				const distanceB = Math.abs(b.mapx - current.x) + Math.abs(b.mapy - current.y);
				return distanceB - distanceA;
			}).shift();
		};
		const getTarget = (noTargetCB) => {
			const target = targetFinder(cga.GetMapUnits());
			if (typeof target == 'object') {
				const walkTo = cga.getRandomSpace(target.xpos,target.ypos);
				if (walkTo) {
					cga.walkList([walkTo], () => cb(null, target));
				} else noTargetCB();
			} else if (target === true) cb(null);
			else noTargetCB();
		};
		const toNextPoint = (points, centre, toNextCB) => {
			const remain = points.filter(p => {
				const xd = Math.abs(p.x - centre.x);
				const yd = Math.abs(p.y - centre.y);
				p.d = xd + yd;
				return !(xd < 12 && yd < 12);
			}).sort((a,b) => a.d - b.d);
			const next = remain.shift();
			if (next) {
				cga.walkList([[next.x,next.y]], () => getTarget(() => toNextPoint(remain,next,toNextCB)));
			} else toNextCB();
		};
		//const start = cga.GetMapXY();
		//let entry = null;
		const findNext = (walls) => {
			const current = cga.GetMapXY();
			//if (!entry && recursion) entry = getFarthestEntry(start);
			toNextPoint(Object.values(getMovablePoints(walls, current)), current, () => {
				cb(null);
			});
		};
		getTarget(() => {
			let walls = cga.buildMapCollisionMatrix();
			if(walls.matrix[0][0] == 1
				|| walls.matrix[walls.y_size-1][0] == 1
				|| walls.matrix[walls.y_size-1][walls.x_size-1] == 1
				|| walls.matrix[0][walls.x_size-1] == 1
			) {
				cga.downloadMap(() => findNext(cga.buildMapCollisionMatrix()));
			} else findNext(walls);
		});
	}
	
	//获取一格(x,y)周围1x1区域内的空闲地形格子
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
	
	//获取一格(x,y)周围1x1区域内的空闲地形格子，并判断其方向
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
	
	cga.tradeInternal = (stuff, checkParty, resolve, playerName, timeout) => {
		
		var savePartyName = null;
		var tradeFinished = false;
		var receivedStuffs = {};
		var beginTime = (new Date()).getTime();
		
		var waitTradeMsg = ()=>{
			
			cga.waitSysMsg((msg)=>{
								
				if(tradeFinished)
					return false;
				
				console.log('waitSysMsg='+msg);
												
				if(msg.indexOf('交易完成') >= 0){
					tradeFinished = true;
					resolve({
						success: true,
						received: receivedStuffs
					});
					return false;
				} else if(msg.indexOf('交易中止') >= 0 || msg.indexOf('因物品栏已满所以无法交易') >= 0){

					cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
					tradeFinished = true;
					resolve({
						success: false,
						received: [],
						reason : 'refused'
					});
					return false;
				} else if(msg.indexOf('没有可交易的对象') >= 0){
					cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
					tradeFinished = true;
					resolve({
						success: false,
						received: [],
						reason : 'no target'
					});
					return false;
				}
				
				return true;
			});	
		}
		
		var waitDialog = ()=>{
			
			if(tradeFinished)
				return;
			
			var getInTradeStuffs = false;
			var tradeStuffsChecked = false;
						
			var waitTradeStuffs = ()=>{

				cga.AsyncWaitTradeStuffs((err, type, args) => {
				
					//console.log(err);
					//console.log(type);
					//console.log(args);

					if(!args){

						if(getInTradeStuffs == false && !tradeFinished)
							waitTradeStuffs();
						
						return;
					}
					
					console.log('AsyncWaitTradeStuffs='+type);
															
					getInTradeStuffs = true;
						
					if(type == cga.TRADE_STUFFS_ITEM){
						receivedStuffs.items = args;
					}else if(type == cga.TRADE_STUFFS_PET){
						receivedStuffs.pet = [];
						receivedStuffs.pet[args.index] = args;
					}else if(type == cga.TRADE_STUFFS_PETSKILL){
						if(!(receivedStuffs.pet instanceof Array))
							receivedStuffs.pet = [];
						if(receivedStuffs.pet[args.index])
							receivedStuffs.pet[args.index].skills = args;
					}else if(type == cga.TRADE_STUFFS_GOLD){
						receivedStuffs.gold = args;
					}
				
				}, 1000);
			}
			
			var waitTradeState = () => {

				cga.AsyncWaitTradeState((err, state) => {

					if(tradeFinished)
						return;
										
					var timeout_trade = (typeof timeout == 'number') ? timeout : 30000;
					if( (new Date()).getTime() > beginTime + timeout_trade){
						tradeFinished = true;
						cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
						resolve({
							success: false,
							received: [],
							reason : 'refused'
						});
						return;
					}
					
					console.log('AsyncWaitTradeState='+state);
					
					if(!err){
						if (state == cga.TRADE_STATE_READY || state == cga.TRADE_STATE_CONFIRM) {
							getInTradeStuffs = true;
							if (!checkParty || tradeStuffsChecked || checkParty(playerName ? playerName : savePartyName, receivedStuffs)) {
								tradeStuffsChecked = true;
								console.log('confirm');
								cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
							} else {
								console.log('refuse');
								cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
							}
						} else if (state == cga.TRADE_STATE_SUCCEED || state == cga.TRADE_STATE_CANCEL) {
							getInTradeStuffs = true;
						}
					}

					waitTradeState();
				}, 1000);
			}

			waitTradeStuffs();
			
			waitTradeState();
			
			const itemFilter = (stuff && typeof stuff.itemFilter == 'function') ? stuff.itemFilter : () => false;
			const petFilter = (stuff && typeof stuff.petFilter == 'function') ? stuff.petFilter : () => false;
			const tradeItems = cga.getInventoryItems().filter(itemFilter).map(e => {
				return {itemid: e.itemid, itempos: e.pos, count: (e.count > 1 ? e.count : 1)};
			});

			cga.TradeAddStuffs(
				tradeItems,
				cga.GetPetsInfo().filter(petFilter).map((p, index) => index),
				(stuff && stuff.gold) ? stuff.gold : 0
			);
		}
		
		cga.AsyncWaitTradeDialog((err, partyName, partyLevel) => {
			
			if(tradeFinished)
				return;
			
			console.log('AsyncWaitTradeDialog='+partyLevel);
			//console.log(partyName);
			//console.log(partyLevel);
			
			savePartyName = partyName;
			
			if (!err && partyLevel > 0) {
				waitDialog();
			} else {
				cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
				tradeFinished = true;
				resolve({success: false, reason : 'trade dialog timeout'});
			}
		}, 10000);
		
		waitTradeMsg();
	};

	//主动向名字为name的玩家发起交易，给他stuff里指定的东西，成功或失败时回调resolve，在checkParty里可以根据对方名字和收到的东西判断同意还是拒绝交易
	/*
	给名字为hzqst的玩家交易3组鹿皮:
		var count = 0;
		cga.positiveTrade('hzqst', {
			itemFilter : (item)=>{
				if(item.name == '鹿皮' && item.count == 40 && count < 3){
					count ++;
					return true;
				}
				return false;
			}		
		},
		null, (arg)=>{
			if(arg.success){
				console.log('交易成功!');
			} else {
				console.log('交易失败! 原因：'+arg.reason);
			}
		});

	给名字为hzqst的玩家交易包里所有的鹿皮，并且对方必须给自己1000金币否则拒绝交易:
		cga.positiveTrade('hzqst', {
			itemFilter : (item)=>{
				return item.name == '鹿皮' && item.count == 40;
			}
		},
		(playerName, receivedStuffs)={
			if(receivedStuffs.gold != 1000){
				console.log('对方没有给自己1000金币!');
				return false;
			}
			return true;
		}, 
		(arg)=>{
			if(arg.success){
				console.log('交易成功!');
			} else {
				console.log('交易失败! 原因：'+arg.reason);
			}
		});

	给名字为hzqst的玩家交易3只哥布林，并且对方必须给自己一只红帽哥布林否则拒绝交易:
		var count = 0;
		cga.positiveTrade('hzqst', {
			petFilter : (pet)=>{
				if(pet.realname == '哥布林' && count < 3){
					count ++;
					return true;
				}
				return false;
			}
		},
		(playerName, receivedStuffs)={
			if(receivedStuffs.pets.find((pet)=>{
				return pet.realname == '红帽哥布林';
			}) == null){
				console.log('对方没有给自己红帽哥布林!');
				return false;
			}
			return true;
		}, 
		(arg)=>{
			if(arg.success){
				console.log('交易成功!');
			} else {
				console.log('交易失败! 原因：'+arg.reason);
			}
		});
	*/
	cga.positiveTrade = (name, stuff, checkParty, resolve, timeout) => {
		cga.AsyncWaitPlayerMenu((err, players) => {
			if(err){
				console.log('player not found')
				resolve({success: false, reason : 'player menu timeout'});
				return;
			}
			
			if (!(players instanceof Array)) players = [];
			var player = players.find((e, index) => typeof name == 'number' ? index == name : e.name == name);
			if (player !== undefined) {
				cga.tradeInternal(stuff, checkParty, resolve, name, timeout);
				cga.PlayerMenuSelect(player.index);
			} else {
				console.log('player not found')
				resolve({success: false, reason : 'player not found'});
			}
		}, 3000);
		
		cga.DoRequest(cga.REQUEST_TYPE_TRADE);
	}
	
	//主动向name玩家发起交易（到开启交易对话框为止），成功或失败时回调resolve
	cga.requestTrade = (name, resolve, timeout) => {
		cga.AsyncWaitPlayerMenu((err, players) => {
			if(err){
				console.log('player not found')
				resolve({success: false, reason : 'player menu timeout'});
				return;
			}
			
			if (!(players instanceof Array)) players = [];
			var player = players.find((e, index) => typeof name == 'number' ? index == name : e.name == name);
			if (player !== undefined) {
				resolve({success: true});
				cga.PlayerMenuSelect(player.index);
			} else {
				console.log('player not found')
				resolve({success: false, reason : 'player not found'});
			}
		}, 3000);
		
		cga.DoRequest(cga.REQUEST_TYPE_TRADE);
	}

	//等待其他玩家向自己发起交易，成功或失败时回调resolve，在checkParty里可以根据对方名字和收到的东西判断同意还是拒绝交易
	/*
	等待任意玩家给自己交易3组鹿皮:		
		cga.waitTrade({},
		(playerName, receivedStuffs)=>{
			if( receivedStuffs.items.filter((item)=>{
				return item.name == '鹿皮' && item.count == 40;
			}).length == 3 )
			{
				return true;
			}
			return false;
		},
		(arg)=>{
			if(arg.success){
				console.log('交易成功!');
			} else {
				console.log('交易失败! 原因：'+arg.reason);
			}
		});
	等待名为hzqst的玩家给自己交易3组鹿皮，并给他1000金币:		
		cga.waitTrade({
			gold : 1000
		},
		(playerName, receivedStuffs)=>{
			if( playerName == 'hzqst' && receivedStuffs.items.filter((item)=>{
				return item.name == '鹿皮' && item.count == 40;
			}).length == 3 )
			{
				return true;
			}
			return false;
		},
		(arg)=>{
			if(arg.success){
				console.log('交易成功!');
			} else {
				console.log('交易失败! 原因：'+arg.reason);
			}
		});
	*/
	cga.waitTrade = (stuff, checkParty, resolve, timeout) => {
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true)
		cga.tradeInternal(stuff, checkParty, resolve, timeout);
	}
	
	//主动向名为name的玩家发起交易并同时等待名为name的玩家向自己发起交易，成功或失败时回调resolve
	cga.trade = (name, stuff, checkParty, resolve, timeout) => {
		
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);
		
		cga.AsyncWaitPlayerMenu((err, players) => {
			if (!(players instanceof Array)) players = [];
			var player = players.find((e, index) => typeof name == 'number' ? index == name : e.name == name);
			if (player) {
				cga.tradeInternal(stuff, checkParty, resolve, name, timeout);
				cga.PlayerMenuSelect(player.index);
			} else {
				console.log('player not found, do nothing');
			}
		}, 3000);
				
		cga.DoRequest(cga.REQUEST_TYPE_TRADE);
	}

	//判断是否是满血满蓝
	cga.needSupplyInitial = (obj)=>{
		var playerinfo = cga.GetPlayerInfo();
		var petinfo = cga.GetPetInfo(playerinfo.petid);
		
		if(!obj)
			obj = {};
		
		if(!obj.playerhp)
			obj.playerhp = 1.0;
		if(!obj.playermp)
			obj.playermp = 1.0;
		if(!obj.pethp)
			obj.pethp = 1.0;
		if(!obj.petmp)
			obj.petmp = 1.0;
		
		if( playerinfo.hp < playerinfo.maxhp * obj.playerhp ||
			playerinfo.mp < playerinfo.maxmp * obj.playermp || 
			petinfo.hp < petinfo.maxhp * obj.playerhp ||
			petinfo.mp < petinfo.maxmp * obj.playermp)
			return true;
		
		return false;
	}

	//判断是否需要找医生治疗
	cga.needDoctor = ()=>{
		var playerinfo = cga.GetPlayerInfo();
		var pets = cga.GetPetsInfo();
		
		if( playerinfo.health > 0)
			return true;

		for(var i = 0;i < pets.length; ++i){
			if(pets[i].health > 0)
				return true;
		}
		
		return false;
	}

	//等待战斗结束
	cga.waitForBattleEnd = (cb, timeout = 30000)=>{
		
		cga.AsyncWaitBattleAction((err, result) => {
			if(err){
				cb(err);
				return;
			}
			if(result == cga.FL_BATTLE_ACTION_END)
			{
				setTimeout(cb, 1000, null, true);
			}
			else
			{
				cga.waitForBattleEnd(cb, timeout);
			}
		}, timeout);
	}

	cga.gui = {};

	cga.gui.port = null;

	cga.gui.init = ()=>{
		if(!cga.gui.port){
			var p = process.env.CGA_GUI_PORT;

			if(!p || !parseInt(p))
				throw new Error('获取CGA主进程本地服务端口失败!');
			
			cga.gui.port = parseInt(p);
		}
	}

	/*
		获取当前附加的进程的信息
		cga.gui.GetGameProcInfo((err, result)=>{
			console.log(result);
		})
	*/
	cga.gui.GetGameProcInfo = (cb)=>{

		cga.gui.init();

		request.get({
			url : "http://127.0.0.1:"+cga.gui.port+'/cga/GetGameProcInfo', 
			json : true,
		},
		function (error, response, body) {
			if(error)
			{
				cb(error);
				return;
			}
			if(response.statusCode && response.statusCode == 200){
				try{
					cb(null, body);
					return;
				}catch(e){
					cb(e);
					return;
				}
			} else {
				cb(new Error('HTTP 请求失败'));
				return;
			}
		});
	}

	/*
		获取玩家设置、物品设置、自动战斗设置
		cga.gui.GetSettings((err, result)=>{
			console.log(result);
		})
	*/
	cga.gui.GetSettings = (cb)=>{

		cga.gui.init();

		request.get({
			url : "http://127.0.0.1:"+cga.gui.port+'/cga/GetSettings', 
			json : true,
		},
		function (error, response, body) {
			if(error)
			{
				cb(error);
				return;
			}
			if(response.statusCode && response.statusCode == 200){
				try{
					cb(null, body);
					return;
				}catch(e){
					cb(e);
					return;
				}
			} else {
				cb(new Error('HTTP 请求失败'));
				return;
			}
		});
	}

	/*
		加载玩家设置、物品设置、自动战斗设置

		开启自动战斗：
		cga.gui.LoadSettings({
			battle : {
				autobattle : true
			}
		}, (err, result)=>{
			console.log(result);
		})

		参数settings的格式见CGA保存出来的玩家设置json文件，不填的选项代表保持不变
	*/
	cga.gui.LoadSettings = (settings, cb)=>{

		cga.gui.init();

		request.post({
			url : "http://127.0.0.1:"+cga.gui.port+'/cga/LoadSettings', 
			json : true,
			body: settings
		},
		function (error, response, body) {
			if(error)
			{
				cb(error);
				return;
			}
			if(response.statusCode && response.statusCode == 200){
				try{
					cb(null, body);
					return;
				}catch(e){
					cb(e);
					return;
				}
			} else {
				cb(new Error('HTTP 请求失败'));
				return;
			}
		});
	}

	/*
		加载脚本
		cga.gui.LoadScript({
			path : "路径",
			autorestart : true, //自动重启脚本开启
			autoterm : true, //自动关闭脚本开启
			injuryprot : true, //受伤保护开启
			soulprot : true, //掉魂受伤保护开启
		}, (err, result)=>{
			console.log(result);
		})
	*/
	cga.gui.LoadScript = (arg, cb)=>{

		cga.gui.init();

		request.post({
			url : "http://127.0.0.1:"+cga.gui.port+'/cga/LoadScript', 
			json : true,
			body: arg
		},
		function (error, response, body) {
			if(error)
			{
				cb(error);
				return;
			}
			if(response.statusCode && response.statusCode == 200){
				try{
					cb(null, body);
					return;
				}catch(e){
					cb(e);
					return;
				}
			} else {
				cb(new Error('HTTP 请求失败'));
				return;
			}
		});
	}

	/*
		加载自动登录设置
		cga.gui.LoadAccount({
			user : "通行证",
			pwd : "密码",
			gid : "子账号",
			game : 4, //区服
			bigserver : 1, //电信or网通
			server : 8, //线路
			character : 1, //左边or右边
			autologin : true, //自动登录开启
			skipupdate : false, //禁用登录器更新开启
		}, (err, result)=>{
			console.log(result);
		})


		调整自动登录到10线
		cga.gui.LoadAccount({
			server : 10,
		}, (err, result)=>{
			console.log(result);
		})
	*/
	cga.gui.LoadAccount = (arg, cb)=>{

		cga.gui.init();

		request.post({
			url : "http://127.0.0.1:"+cga.gui.port+'/cga/LoadAccount', 
			json : true,
			body: arg
		},
		function (error, response, body) {
			if(error)
			{
				cb(error);
				return;
			}
			if(response.statusCode && response.statusCode == 200){
				try{
					cb(null, body);
					return;
				}catch(e){
					cb(e);
					return;
				}
			} else {
				cb(new Error('HTTP 请求失败'));
				return;
			}
		});
	}

	return cga;
}