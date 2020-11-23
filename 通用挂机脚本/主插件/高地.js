var Async = require('async');
var supplyMode = require('./../公共模块/高地回补');
var supplyCastle = require('./../公共模块/里堡回补');
var teamMode = require('./../公共模块/组队模式');
var logbackEx = require('./../公共模块/登出防卡住');

var cga = global.cga;
var configTable = global.configTable;

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

var battleAreaArray = [
{
	name : '刀鸡',
	walkTo : (cb)=>{
		var map = cga.GetMapName();
		var mapindex = cga.GetMapIndex().index3;
		if(map == '医院' && mapindex == 59539){
			cga.walkList([
				[28, 52, '艾夏岛'],
				[190, 116, '盖雷布伦森林'],
				[231, 222, '布拉基姆高地'],
				[34, 188],
			], cb);
		} else {
			cga.travel.newisland.toStone('D', ()=>{
				cga.walkList([
					[190, 116, '盖雷布伦森林'],
					[231, 222, '布拉基姆高地'],
					[34, 188],
				], cb);
			});
		}
	},
	moveDir : 0,
	isDesiredMap : (map)=>{
		return (map == '布拉基姆高地');
	}
},
{
	name : '黄金龙骨',
	walkTo : (cb)=>{
		var map = cga.GetMapName();
		var mapindex = cga.GetMapIndex().index3;
		if(map == '医院' && mapindex == 59539){
			cga.walkList([
				[28, 52, '艾夏岛'],
				[190, 116, '盖雷布伦森林'],
				[231, 222, '布拉基姆高地'],
				[135, 175],
			], cb);
		} else {
			cga.travel.newisland.toStone('D', ()=>{
				cga.walkList([
					[190, 116, '盖雷布伦森林'],
					[231, 222, '布拉基姆高地'],
					[135, 175],
				], cb);
			});
		}
	},
	moveDir : 6,
	isDesiredMap : (map)=>{
		return (map == '布拉基姆高地');
	}
},
{
	name : '银狮',
	walkTo : (cb)=>{
		var map = cga.GetMapName();
		var mapindex = cga.GetMapIndex().index3;
		if(map == '医院' && mapindex == 59539){
			cga.walkList([
				[28, 52, '艾夏岛'],
				[190, 116, '盖雷布伦森林'],
				[231, 222, '布拉基姆高地'],
				[147, 117],
			], cb);
		} else {
			cga.travel.newisland.toStone('D', ()=>{
				cga.walkList([
					[190, 116, '盖雷布伦森林'],
					[231, 222, '布拉基姆高地'],
					[147, 117],
				], cb);
			});
		}
	},
	moveDir : 2,
	isDesiredMap : (map)=>{
		return (map == '布拉基姆高地');
	}
},
{
	name : '低地鸡',
	walkTo : (cb)=>{
		var map = cga.GetMapName();
		var mapindex = cga.GetMapIndex().index3;
		if(map == '医院' && mapindex == 59539){
			cga.walkList([
				[28, 52, '艾夏岛'],
				[190, 116, '盖雷布伦森林'],
				[210, 216],
			], cb);
		} else {
			cga.travel.newisland.toStone('D', ()=>{
				cga.walkList([
					[190, 116, '盖雷布伦森林'],
					[210, 216],
				], cb);
			});
		}
	},
	moveDir : 0,
	isDesiredMap : (map)=>{
		return (map == '盖雷布伦森林');
	}
},
]

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
				supplyObject.func(loop);
				return false;
			}
			else
			{
				moveThinkInterrupt.requestInterrupt(()=>{
					if(cga.isInNormalState()){
						supplyObject.func(loop);
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
	var isleader = cga.isTeamLeaderEx();
	
	if(isleader && teamMode.is_enough_teammates())
	{
		if(thisobj.battleArea.isDesiredMap(map))
		{
			playerThinkInterrupt.hasInterrupt();//restore interrupt state
			console.log('playerThink on');
			playerThinkRunning = true;
			
			cga.freqMove(thisobj.battleArea.moveDir);
			return;
		}
		else
		{
			playerThinkInterrupt.hasInterrupt();//restore interrupt state
			console.log('playerThink on');
			playerThinkRunning = true;
			
			thisobj.battleArea.walkTo(loop);
			return;
		}
	} else if(!isleader){
		playerThinkInterrupt.hasInterrupt();//restore interrupt state
		console.log('playerThink on');
		playerThinkRunning = true;
		return;
	}

	if(cga.needSupplyInitial())
	{
		var sup = getSupplyObject(map, mapindex);
		if(sup)
		{
			sup.func(loop);
			return;
		}
	}

	callSubPluginsAsync('prepare', ()=>{
		cga.travel.newisland.toStone('X', ()=>{
			cga.walkList([
			cga.isTeamLeader ? [144, 106] : [143, 106],
			], ()=>{
				teamMode.wait_for_teammates(loop);
			});
		});
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();

		if(map == '盖雷布伦森林' )
			return 1;

		if(map == '布拉基姆高地' )
			return 2;
		
		return 0;
	},
	translate : (pair)=>{
		
		if(pair.field == 'battleArea'){
			pair.field = '练级地点';
			pair.value = battleAreaArray[pair.value].name;
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
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([supplyMode.inputcb, teamMode.inputcb, (cb2)=>{
			
			var sayString = '【高地插件】请选择练级地点:';
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
		}], cb);
	},
	execute : ()=>{
		playerThinkTimer();
		cga.registerMoveThink(moveThink);
		callSubPlugins('init');
		logbackEx.init();
		loop();
	},
}

module.exports = thisobj;