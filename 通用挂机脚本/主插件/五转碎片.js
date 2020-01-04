var Async = require('async');
var supplyMode = require('./../公共模块/营地回补');
var supplyCastle = require('./../公共模块/里堡回补');
var sellCamp = require('./../公共模块/营地卖石');
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

var cachedEntrance = null;
var blacklistEntrance = [];

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

var battleAreaArray = [
{
	name : '地洞',
	range : [450, 600, 200, 300],
},
{
	name : '水洞',
	range : [300, 400, 500, 550],
},
{
	name : '火洞',
	range : [400, 450, 400, 450],
},
{
	name : '风洞',
	range : [300, 450, 150, 300],
}
]

var walkMazeForward = (cb)=>{
	var map = cga.GetMapName();
	if(map == '隐秘之洞地下'+(thisobj.layerLevel)+'层'){
		cb(true);
		return;
	}
	if(map == '肯吉罗岛'){
		cb(false);
		return;
	}
	cga.walkRandomMaze(null, (err)=>{
		if(err && err.message == '无法找到迷宫的出口' && cga.GetMapName().indexOf('隐秘之洞地下') >= 0)
		{
			cb(true);
			return;
		}
		walkMazeForward(cb);
	}, {
		layerNameFilter : (layerIndex)=>{
			return '隐秘之洞地下'+(layerIndex + 1)+'层';
		},
		entryTileFilter : (e)=>{
			return e.colraw == 0x2EE2;
		}
	});
}

var walkMazeBack = (cb)=>{
	var map = cga.GetMapName();
	if(map == '肯吉罗岛'){
		cb(true);
		return;
	}
	cga.walkRandomMaze(null, (err)=>{
		walkMazeBack(cb);
	}, {
		layerNameFilter : (layerIndex)=>{
			return layerIndex > 1 ? ('隐秘之洞地下'+(layerIndex - 1)+'层') : '肯吉罗岛';
		},
		entryTileFilter : (e)=>{
			return (cga.GetMapName() == '隐秘之洞地下1层') ? (e.colraw == 0) : (e.colraw == 0x2EE0);
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
				walkMazeBack(loop);
				return false;
			}
			else
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

var getMazeEntrance = (cb)=>{
		
	if(cachedEntrance)
	{
		cga.downloadMapEx(cachedEntrance.mapx - 12, cachedEntrance.mapy - 12, cachedEntrance.mapx + 12, cachedEntrance.mapy + 12, ()=>{
			var objs = cga.getMapObjects();
			var entrance = objs.find((obj)=>{
				return (obj.cell == 3 && obj.mapx == cachedEntrance.mapx && obj.mapy == cachedEntrance.mapy)
			})
			
			if(entrance == undefined){
				cachedEntrance = null;
				console.log('缓存的迷宫入口失效,重新寻找入口')
				getMazeEntrance(cb);
				return;
			}
			
			cb(entrance);
		});
		return;
	}
	
	console.log('正在下载地图')
	cga.downloadMapEx(
	thisobj.battleArea.range[0],
	thisobj.battleArea.range[1], 
	thisobj.battleArea.range[2], 
	thisobj.battleArea.range[3], ()=>{
		console.log('地图已下载完成')
		
		var objs = cga.getMapObjects();
		console.log(objs.filter((o)=>{
			return o.cell == 3;
		}))
		var entrance = objs.find((obj)=>{

			return (obj.cell == 3 && 
			obj.mapx >= thisobj.battleArea.range[0] &&
			obj.mapx <= thisobj.battleArea.range[1] && 
			obj.mapy >= thisobj.battleArea.range[2] && 
			obj.mapy <= thisobj.battleArea.range[3] && 
			( !blacklistEntrance.length || (blacklistEntrance.length && blacklistEntrance.find((b)=>{
				return b.mapx == obj.mapx && b.mapy == obj.mapy;
			}) == undefined) )
			);
		})
		
		if(entrance == undefined){
			console.log('迷宫入口未找到,等待15秒后重试')
			setTimeout(getMazeEntrance, 15000, cb);
			return;
		}
		
		cachedEntrance = entrance;
		cb(entrance);
	});
}


var loop = ()=>{
		
	var map = cga.GetMapName();
	var mapindex = cga.GetMapIndex().index3;
	var isleader = cga.isTeamLeaderEx();
	
	if(isleader && teamMode.is_enough_teammates()){
		if(map == '医院' && mapindex == 44692){
			if(thisobj.sellStore == 1){
				var sellObject = getSellObject(map, mapindex);
				if(sellObject)
				{
					sellObject.func(loop);
					return;
				}
			}
		} 
		if(map == '工房' && mapindex == 44693){
			cga.walkList([
			[30, 37, '圣骑士营地']
			], loop);
			return;
		}
		if(map == '肯吉罗岛'){
			getSupplyObject().func(loop);
			return;
		}
		if(map == '圣骑士营地'){
			callSubPluginsAsync('prepare', ()=>{
				if(cga.GetMapName() != '圣骑士营地'){
					loop();
					return;
				}
				playerThinkInterrupt.hasInterrupt();//restore interrupt state
				console.log('playerThink on');
				playerThinkRunning = true;
				
				cga.walkList([
					[36, 87, '肯吉罗岛'],
				], ()=>{
					getMazeEntrance((obj)=>{
						cga.walkList([
							[obj.mapx, obj.mapy, '隐秘之洞地下1层']
						], (err)=>{
							console.log(err);
							if(err && err.message == 'Unexcepted map changed.'){
								var xy = cga.GetMapXY();
								cachedEntrance = null;
								blacklistEntrance.push(obj);
								cga.walkList([
								[xy.x, xy.y, '肯吉罗岛'],
								], loop);
								return;
							}
							loop();
						});
					})
				});
			});
			return;
		}
		if(map == '隐秘之洞地下1层')
		{
			playerThinkInterrupt.hasInterrupt();//restore interrupt state
			console.log('playerThink on');
			playerThinkRunning = true;
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
	} else if(!isleader){
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
				teamMode.wait_for_teammates(loop);
			});
		});
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();
		
		if(map == '肯吉罗岛' )
			return 1;
		
		if(map.indexOf('隐秘之洞地下') >= 0)
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
			pair.field = '练级层数';
			pair.value = pair.value + '层';
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'battleArea'){
			pair.field = '练级地点';
			pair.value = battleAreaArray[pair.value];
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
		
		for(var i in battleAreaArray){
			if(i == obj.battleArea){
				configTable.battleArea = i;
				thisobj.battleArea = battleAreaArray[i];
				break;
			}
		}

		if(!thisobj.battleArea){
			console.error('读取配置：练级地点失败！');
			return false;
		}
		
		configTable.layerLevel = obj.layerLevel;
		thisobj.layerLevel = obj.layerLevel
		
		if(!thisobj.layerLevel){
			console.error('读取配置：练级层数失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([supplyMode.inputcb, teamMode.inputcb, (cb2)=>{
			var sayString = '【五转碎片插件】请选择是否卖石: 0不卖石 1卖石';
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
		}, (cb2)=>{
			
			var sayString = '【五转碎片插件】请选择练级地点:';
			for(var i in battleAreaArray){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + battleAreaArray[i].name;
			}
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && battleAreaArray[index - 1]){
					configTable.battleArea = index - 1;
					thisobj.battleArea = battleAreaArray[index - 1];
					
					var sayString2 = '当前已选择:[' + thisobj.battleArea.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}, (cb2)=>{
			var sayString = '【五转碎片插件】请选择练级层数(1~100):';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 1 && val <= 100){
					configTable.layerLevel = val;
					thisobj.layerLevel = val;
					
					var sayString2 = '当前已选择:'+thisobj.layerLevel+'层练级。';
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