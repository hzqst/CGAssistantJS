var Async = require('async');
var supplyMode = require('./../公共模块/营地回补');
var sellStore = require('./../公共模块/营地卖石');
var teamMode = require('./../公共模块/组队模式');

var cga = global.cga;
var configTable = global.configTable;
var exitPos = null;

var walkMazeForward = (cb)=>{
	var map = cga.GetMapName();
	if(map == '黑龙沼泽'+(thisobj.layerLevel)+'区'){
		cb(true);
		return;
	}
	if(map == '肯吉罗岛'){
		cb(false);
		return;
	}
	cga.walkRandomMaze(null, (err)=>{
		walkMazeForward(cb);
	}, (layerIndex)=>{
		return '黑龙沼泽'+(thisobj.layerIndex + 1)+'区';
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
	}, (layerIndex)=>{
		return layerIndex > 1 ? ('黑龙沼泽'+(layerIndex - 1)+'区') : '肯吉罗岛';
	});
}

var loop = ()=>{
	var map = cga.GetMapName();
	var mapindex = cga.GetMapIndex().index3;
	
	if(cga.isTeamLeader == true || !cga.getTeamPlayers().length){
		if(map == '医院' && mapindex == 44692){
			sellStore.func(loop);
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
		if(map == '圣骑士营地' && teamMode.is_enough_teammates()){
			cga.walkList([
				[36, 87, '肯吉罗岛'],
				[424, 345, '黑龙沼泽1区'],
			], loop);
			return;
		}
		if(map == '黑龙沼泽1区')
		{
			walkMazeForward((r)=>{
				//意外传送回肯吉罗岛，迷宫刷新
				if(r != true){
					loop();
					return;
				}
				exitPos = cga.GetMapXY();
				var randomSpace = cga.getRandomSpace(exitPos.x, exitPos.y);
				cga.WalkTo(randomSpace[0], randomSpace[1]);
				setTimeout(()=>{
					cga.freqMove(0, ()=>{
			
						if(!cga.isInBattle())
						{
							var playerinfo = cga.GetPlayerInfo();
							var ctx = {
								playerinfo : playerinfo,
								petinfo : cga.GetPetInfo(playerinfo.petid),
								teamplayers : cga.getTeamPlayers(),
								result : null,
							}
							
							teamMode.battle(ctx);
							
							global.callSubPlugins('battle', ctx);
							
							if( ctx.result == 'supply' ){
								
								//回补路径：先走到exitPos上进入前一层，再往下走直到肯吉罗岛，最后走回营地
								cga.walkList([
								[exitPos.x, exitPos.y, thisobj.layerLevel > 1 ? ('黑龙沼泽'+(thisobj.layerLevel - 1)+'区') : '肯吉罗岛'],
								],
								(r, reason)=>{
									walkMazeBack(()=>{
										supplyMode.func(loop);
									});
								});
								
								return false;
							}
							else if( ctx.result == 'logback' ){
								cga.LogBack();
								setTimeout(loop, 1500);
								return false;
							}
						}
						
						return true;
					});
				}, 1500);
			});
			return;
		}
	} else {
		if(!cga.isInBattle())
		{
			var playerinfo = cga.GetPlayerInfo();
			var ctx = {
				playerinfo : playerinfo,
				petinfo : cga.GetPetInfo(playerinfo.petid),
				teamplayers : cga.getTeamPlayers(),
				result : null,
			}
			
			teamMode.battle(ctx);
			
			global.callSubPlugins('battle', ctx);
			
			if( ctx.result == 'supply' ){
				
			}
			else if( ctx.result == 'logback' ){
				cga.LogBack();
				setTimeout(loop, 1500);
				return;
			}
		}
		setTimeout(loop, 1500);
		return;
	}
	cga.travel.falan.toCamp(()=>{
		cga.walkList([
		cga.isTeamLeader ? [96, 86] : [97, 86],
		], ()=>{
			teamMode.wait_for_teammates(loop);
		});
	});
}

module.exports = {
	translate : (pair)=>{
		
		if(pair.field == 'layerLevel'){
			pair.field = '黑龙练级层数';
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
		
		if(!sellStore.loadconfig(obj))
			return false;
		
		if(!teamMode.loadconfig(obj))
			return false;
		
		configTable.layerLevel = obj.layerLevel;
		thisobj.layerLevel = obj.layerLevel
		
		if(!thisobj.layerLevel){
			console.error('读取配置：黑龙练级层数失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([supplyMode.inputcb, sellStore.inputcb, teamMode.inputcb, (cb2)=>{
			var sayString = '【黑龙插件】请选择黑龙练级层数(1~100), 100代表龙顶:';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg)=>{
				var val = parseInt(msg);
				if(val >= 1 && val <= 100){
					configTable.layerLevel = val;
					thisobj.layerLevel = val;
					
					var sayString2 = '当前已选择:黑龙'+thisobj.layerLevel+'层练级。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return true;
				}
				
				return false;
			});
		}], cb);
	},
	execute : loop,
};