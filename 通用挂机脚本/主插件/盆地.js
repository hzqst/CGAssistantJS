var Async = require('async');
var supplyCastle = require('./../公共模块/里堡回补');
var teamMode = require('./../公共模块/组队模式');
var logbackEx = require('./../公共模块/登出防卡住');

var cga = global.cga;
var configTable = global.configTable;

var interrupt = require('./../公共模块/interrupt');

var moveThinkInterrupt = new interrupt();
var playerThinkInterrupt = new interrupt();
var playerThinkRunning = false;

var supplyArray = [ supplyCastle ];

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
	name : '门口',
	pos : [155, 147],
	dir : 0,
	isDesiredMap : (map)=>{
		return (map == '方堡盆地');
	}
},
{
	name : '赤熊骷髅海盗',
	pos : [182, 104],
	dir : 0,
	isDesiredMap : (map)=>{
		return (map == '方堡盆地');
	}
},
{
	name : '红螳螂',
	pos : [248, 134],
	dir : 0,
	isDesiredMap : (map)=>{
		return (map == '方堡盆地');
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
		
		if( ctx.result == 'supply' || ctx.result == 'logback' || ctx.result == 'logback_forced' )
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
	var xy = cga.GetMapXY();
	if(cga.isTeamLeaderEx()){
		if(thisobj.battleArea.isDesiredMap(map))
		{
			if(!teamMode.is_enough_teammates())
			{
				//人没满
				if(cga.isTeamLeader == true)
				{
					//队长等待队员
					cga.WalkTo(156, 147);
					teamMode.wait_for_teammates(loop);
					return;
				}
				else
				{
					//队员等待加队长
					cga.WalkTo(155, 147);
					teamMode.wait_for_teammates(loop);
					return;
				}
			}
			else
			{
				//队长：人满了，开始遇敌
				playerThinkInterrupt.hasInterrupt();//restore interrupt state
				console.log('playerThink on');
				playerThinkRunning = true;
				cga.walkList([
					thisobj.battleArea.pos
				], ()=>{
					cga.freqMove(thisobj.battleArea.dir);
				});
				return;
			}
		}
	} else {
		playerThinkInterrupt.hasInterrupt();//restore interrupt state
		console.log('playerThink on');
		playerThinkRunning = true;
		return;
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
		cga.travel.newisland.toStone('X', ()=>{
			cga.walkList([
			[130, 50, '盖雷布伦森林'],
			[216, 44],
			], ()=>{
				cga.TurnTo(216, 43)		
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(8, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0); 
							cga.AsyncWaitMovement({map:'方堡盆地', delay:1000, timeout:5000}, loop);
						});
					});
				});
			});
		});
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();

		if(map == '方堡盆地')
			return 2;
		
		if(map == '盖雷布伦森林')
			return 1;
		
		return 0;
	},
	translate : (pair)=>{
		
		if(pair.field == 'battleArea'){
			pair.field = '练级地点';
			pair.value = battleAreaArray[pair.value].name;
			pair.translated = true;
			return true;
		}
		
		if(teamMode.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{

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
		Async.series([teamMode.inputcb, (cb2)=>{
			
			var sayString = '【盆地插件】请选择练级地点:';
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