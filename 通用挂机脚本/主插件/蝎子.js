var Async = require('async');
var supplyMode = require('./../公共模块/矮人回补');
var supplyCastle = require('./../公共模块/里堡回补');
var sellCamp = require('./../公共模块/矮人卖石');
var sellCastle = require('./../公共模块/里堡卖石');
var teamMode = require('./../公共模块/组队模式');
var logbackEx = require('./../公共模块/登出防卡住');

var cga = global.cga;
var configTable = global.configTable;
var sellStoreArray = ['不卖石', '卖石'];

var interrupt = require('./../公共模块/interrupt');

var moveThinkInterrupt = new interrupt();
var playerThinkInterrupt = new interrupt();
var playerThinkRunning = false;

var supplyArray = [supplyMode, supplyCastle];

var getSupplyObject = (map, mapindex)=>{
	if(typeof map != 'string')
		map = cga.GetMapName();
	if(typeof mapindex != 'number')
		mapindex = cga.GetMapIndex().index3;
	return supplyArray.find((s)=>{
		return s.isAvailable(map, mapindex);
	})
}

var sellArray = [sellCamp, sellCastle];

var getSellObject = (map, mapindex)=>{
	if(typeof map != 'string')
		map = cga.GetMapName();
	if(typeof mapindex != 'number')
		mapindex = cga.GetMapIndex().index3;
	return sellArray.find((s)=>{
		return s.isAvailable(map, mapindex);
	})
}

var moveThink = (arg)=>{

	if(moveThinkInterrupt.hasInterrupt())
		return false;

	if(arg == 'freqMoveMapChanged')
	{
		playerThinkInterrupt.requestInterrupt();
		return false;
	}

	return true;
}

var playerThink = ()=>{

	if(!cga.isInNormalState())
		return true;
	
	var playerinfo = cga.GetPlayerInfo();
	var items = cga.GetItemsInfo();
	var ctx = {
		playerinfo : playerinfo,
		petinfo : playerinfo.petid >= 0 ? cga.GetPetInfo(playerinfo.petid) : null,
		teamplayers : cga.getTeamPlayers(),
		dangerlevel : thisobj.getDangerLevel(),
		inventory : items.filter((item)=>{
			return item.pos >= 8 && item.pos < 100;
		}),
		equipment : items.filter((item)=>{
			return item.pos >= 0 && item.pos < 8;
		}),
		result : null,
	}

	teamMode.think(ctx);

	global.callSubPlugins('think', ctx);

	if(cga.isTeamLeaderEx())
	{
		var interruptFromMoveThink = false;
		
		if(ctx.result == null && playerThinkInterrupt.hasInterrupt())
		{
			ctx.result = 'supply';
			interruptFromMoveThink = true;
		}

		var supplyObject = null;

		if(ctx.result == 'supply')
		{
			var map = cga.GetMapName();
			var mapindex = cga.GetMapIndex().index3;
			supplyObject = getSupplyObject(map, mapindex);
			if(supplyObject && supplyObject.isLogBack(map, mapindex))
				ctx.result = 'logback';
		}
		
		if( ctx.result == 'supply' && supplyObject)
		{
			if(interruptFromMoveThink)
			{
				supplyMode.func(loop);
				return false;
			}
			else
			{
				moveThinkInterrupt.requestInterrupt(()=>{
					if(cga.isInNormalState()){
						supplyMode.func(loop);
						return true;
					}
					return false;
				});
				return false;
			}
		}
		else if( ctx.result == 'logback' || ctx.result == 'logback_forced' )
		{
			if(interruptFromMoveThink)
			{
				logbackEx.func(loop);
				return false;
			}
			else
			{
				moveThinkInterrupt.requestInterrupt(()=>{
					if(cga.isInNormalState()){
						logbackEx.func(loop);
						return true;
					}
					return false;
				});
				return false;
			}
		}
	} else {
		if( ctx.result == 'logback_forced' )
		{
			logbackEx.func(loop);
			return false;
		}
	}

	return true;
}

var playerThinkTimer = ()=>{
	if(playerThinkRunning){
		if(!playerThink()){
			console.log('playerThink off');
			playerThinkRunning = false;
		}
	}
	
	setTimeout(playerThinkTimer, 1500);
}

var loop = ()=>{

	var map = cga.GetMapName();
	var mapindex = cga.GetMapIndex().index3;
	var mapXY = cga.GetMapXY();
	
	var isleader = cga.isTeamLeaderEx();
	
	if(isleader && teamMode.is_enough_teammates()){
		if(map == '肯吉罗岛' && cga.travel.camp.getRegion(map, mapXY) == '矮人城镇域'){
			cga.walkList([
				[231, 434, '矮人城镇'],
			], loop);
			return;
		}
		if(map == '矮人城镇'){
			var go = ()=>{
				callSubPluginsAsync('prepare', ()=>{
					if(cga.GetMapName() != '矮人城镇'){
						loop();
						return;
					}
					playerThinkInterrupt.hasInterrupt();//restore interrupt state
					console.log('playerThink on');
					playerThinkRunning = true;
					cga.walkList([
						[110, 191, '肯吉罗岛'],
						[233, 439],
					], ()=>{
						cga.freqMove(0);
					});
				});
			}
			
			supplyMode.func(()=>{
				if(thisobj.sellStore == 1){
					var sellObject = getSellObject(map, mapindex);
					if(sellObject)
					{
						sellObject.func(go);
						return;
					}
				}
				go();
			});
			return;
		}
	} else if(!isleader){
		playerThinkInterrupt.hasInterrupt();//restore interrupt state
		console.log('playerThink on');
		playerThinkRunning = true;
		return;		
	}
	
	if(thisobj.sellStore == 1 && cga.getSellStoneItem().length > 0)
	{
		var sellObject = getSellObject(map, mapindex);
		if(sellObject)
		{
			sellObject.func(loop);
			return;
		}
	}
	
	if(cga.needSupplyInitial())
	{
		var supplyObject = getSupplyObject(map, mapindex);
		if(supplyObject)
		{
			supplyObject.func(loop);
			return;
		}
	}
	
	callSubPluginsAsync('prepare', ()=>{
		cga.travel.falan.toCamp(()=>{
			cga.walkList([
			cga.isTeamLeader ? [96, 86] : [97, 86],
			], ()=>{
				teamMode.wait_for_teammates(()=>{
					cga.walkList([
						[36, 87, '肯吉罗岛'],
						[384, 245, '蜥蜴洞穴'],
						[12, 2, '肯吉罗岛'],
						[231, 434, '矮人城镇'],
					], loop);
				});
			});
		});
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();
		
		if(map == '肯吉罗岛' )
			return 2;
				
		return 0;
	},
	translate : (pair)=>{
		
		if(pair.field == 'sellStore'){
			pair.field = '是否卖石';
			pair.value = pair.value == 1 ? '卖石' : '不卖石';
			pair.translated = true;
			return true;
		}
		
		if(supplyMode.translate(pair))
			return true;
				
		if(teamMode.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{

		if(!supplyMode.loadconfig(obj))
			return false;
		
		if(!teamMode.loadconfig(obj))
			return false;
		
		configTable.sellStore = obj.sellStore;
		thisobj.sellStore = obj.sellStore
		
		if(thisobj.sellStore == undefined){
			console.error('读取配置：是否卖石失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([supplyMode.inputcb, teamMode.inputcb, (cb2)=>{
			var sayString = '【蝎子插件】请选择是否卖石: 0不卖石 1卖石';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 0 && val <= 1){
					configTable.sellStore = val;
					thisobj.sellStore = val;
					
					var sayString2 = '当前已选择:'+sellStoreArray[thisobj.sellStore]+'。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}], cb);
	},
	execute : ()=>{
		playerThinkTimer();
		cga.registerMoveThink(moveThink);
		callSubPlugins('init');
		logbackEx.init();
		loop();
	},
};

module.exports = thisobj;