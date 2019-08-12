var Async = require('async');
var supplyMode = require('./../公共模块/营地回补');
var sellStore = require('./../公共模块/营地卖石');
var sellStore2 = require('./../公共模块/里堡卖石');
var teamMode = require('./../公共模块/组队模式');
var logbackEx = require('./../公共模块/登出防卡住');

var cga = global.cga;
var configTable = global.configTable;
var sellStoreArray = ['不卖石', '卖石'];

var interrupt = require('./../公共模块/interrupt');

var moveThinkInterrupt = new interrupt();
var playerThinkInterrupt = new interrupt();
var playerThinkRunning = false;

var walkMazeForward = (cb)=>{
	var map = cga.GetMapName();
	if(map == '蜥蜴洞穴上层第'+(thisobj.layerLevel)+'层'){
		cb(true);
		return;
	}
	if(map == '蜥蜴洞穴'){
		cb(false);
		return;
	}
	cga.walkRandomMaze(null, (err)=>{
		if(err && err.message == '无法找到迷宫的出口' && cga.GetMapName().indexOf('蜥蜴洞穴上层') >= 0)
		{
			cb(true);
			return;
		}
		walkMazeForward(cb);
	}, {
		layerNameFilter : (layerIndex)=>{
			return '蜥蜴洞穴上层第'+(layerIndex + 1)+'层';
		},
		entryTileFilter : (e)=>{
			return e.colraw == 0x2EE2;
		}
	});
}

var walkMazeBack = (cb)=>{
	var map = cga.GetMapName();
	if(map == '蜥蜴洞穴'){
		cb(true);
		return;
	}
	cga.walkRandomMaze(null, (err)=>{
		walkMazeBack(cb);
	}, {
		layerNameFilter : (layerIndex)=>{
			return layerIndex > 1 ? ('蜥蜴洞穴上层第'+(layerIndex - 1)+'层') : '蜥蜴洞穴';
		},
		entryTileFilter : (e)=>{
			return (cga.GetMapName() == '蜥蜴洞穴上层第1层') ? (e.colraw == 0) : (e.colraw == 0x2EE0);
		}
	});
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
	var ctx = {
		playerinfo : playerinfo,
		petinfo : cga.GetPetInfo(playerinfo.petid),
		teamplayers : cga.getTeamPlayers(),
		result : null,
		dangerlevel : thisobj.getDangerLevel(),
	}

	teamMode.think(ctx);

	global.callSubPlugins('think', ctx);

	if(cga.isTeamLeaderEx() && ctx.dangerlevel > 0)
	{
		if(ctx.result == null && playerThinkInterrupt.hasInterrupt())
			ctx.result = 'supply';

		if(ctx.result == 'supply' && supplyMode.isLogBack())
			ctx.result = 'logback';
		
		if( ctx.result == 'supply' )
		{
			moveThinkInterrupt.requestInterrupt(()=>{
				if(cga.isInNormalState()){
					walkMazeBack(loop);
					return true;
				}
				return false;
			});
			return false;
		}
		else if( ctx.result == 'logback' )
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
	
	if(cga.isTeamLeaderEx()){
		if(map == '医院' && mapindex == 44692){
			if(thisobj.sellStore == 1){
				sellStore.func(loop);
			} else {
				cga.walkList([
					[0, 20, '圣骑士营地'],
				], loop);
			}
			return;
		} 
		if(map == '工房'){
			cga.walkList([
			[30, 37, '圣骑士营地']
			], loop);
			return;
		}
		if(map == '肯吉罗岛'){
			supplyMode.func(loop);
			return;
		}
		if(map == '蜥蜴洞穴'){
			cga.walkList([
			[12, 13, '肯吉罗岛'],
			], loop);
			return;
		}
		if(map == '圣骑士营地' && teamMode.is_enough_teammates()){
			console.log('playerThink on');
			playerThinkRunning = true;
			
			cga.walkList([
				[36, 87, '肯吉罗岛'],
				[384, 245, '蜥蜴洞穴'],
				[17, 4, '蜥蜴洞穴上层第1层'],
			], loop);
			return;
		}
		if(map == '蜥蜴洞穴上层第1层')
		{
			walkMazeForward((r)=>{
				if(r != true){
					loop();
					return;
				}
				var xy = cga.GetMapXY();
				var dir = cga.getRandomSpaceDir(xy.x, xy.y);
				cga.freqMove(dir);
			});
			return;
		}
	} else {
		console.log('playerThink on');
		playerThinkRunning = true;
		return;
	}
	
	if(thisobj.sellStore == 1 && cga.getSellStoneItem().length > 0 && map != '圣骑士营地')
	{
		sellStore2.func(loop);
		return;
	}
	
	if(cga.needSupplyInitial() && supplyMode.isInitialSupply() && map != '圣骑士营地')
	{
		supplyMode.func(loop);
		return;
	}
	
	callSubPluginsAsync('prepare', ()=>{
		cga.travel.falan.toCamp(()=>{
			cga.walkList([
			cga.isTeamLeader ? [96, 86] : [97, 86],
			], ()=>{
				teamMode.wait_for_teammates(loop);
			});
		});
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();
		
		if(map == '肯吉罗岛' || map == '蜥蜴洞穴' )
			return 1;
				
		if(map.indexOf('蜥蜴洞穴上层') >= 0)
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
		
		if(pair.field == 'layerLevel'){
			pair.field = '蜥蜴练级层数';
			pair.value = pair.value + '层';
			pair.translated = true;
			return true;
		}

		if(supplyMode.translate(pair))
			return true;
		
		if(sellStore.translate(pair))
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
		
		if(!thisobj.sellStore){
			console.error('读取配置：是否卖石失败！');
			return false;
		}
		
		configTable.layerLevel = obj.layerLevel;
		thisobj.layerLevel = obj.layerLevel
		
		if(!thisobj.layerLevel){
			console.error('读取配置：蜥蜴练级层数失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([supplyMode.inputcb, sellStore.inputcb, teamMode.inputcb, (cb2)=>{
			var sayString = '【蜥蜴插件】请选择是否卖石: 0不卖石 1卖石';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 0 && val <= 1){
					configTable.sellStore = val;
					thisobj.sellStore = val;
					
					var sayString2 = '当前已选择:'+sellStoreArray[thisobj.sellStore]+'。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return true;
				}
				
				return false;
			});
		}, (cb2)=>{
			var sayString = '【蜥蜴插件】请选择蜥蜴练级层数(1~100):';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 1 && val <= 100){
					configTable.layerLevel = val;
					thisobj.layerLevel = val;
					
					var sayString2 = '当前已选择:蜥蜴'+thisobj.layerLevel+'层练级。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return true;
				}
				
				return false;
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