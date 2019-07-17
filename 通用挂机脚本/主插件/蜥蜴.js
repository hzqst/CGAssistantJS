var Async = require('async');
var supplyMode = require('./../公共模块/营地回补');
var sellStore = require('./../公共模块/营地卖石');
var teamMode = require('./../公共模块/组队模式');

var cga = global.cga;
var configTable = global.configTable;

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
		walkMazeForward(cb);
	}, {
		layerNameFilter : (layerIndex)=>{
			return '蜥蜴洞穴上层第'+(layerIndex + 1)+'层';
		},
		entryTileFilter : (e)=>{
			return e.colraw == 0x2EE2 || e.colraw == 0;
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
			return e.colraw == 0x2EE0 || e.colraw == 0;
		}
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
		if(map == '蜥蜴洞穴'){
			cga.walkList([
			[12, 13, '肯吉罗岛'],
			], loop);
			return;
		}
		if(map == '圣骑士营地' && teamMode.is_enough_teammates()){
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
				//意外传送回蜥蜴洞穴，迷宫刷新
				if(r != true){
					loop();
					return;
				}
				var xy = cga.GetMapXY();
				var dir = cga.getRandomSpaceDir(xy.x, xy.y);
				cga.freqMove(dir, (r)=>{
					
					if(cga.isInBattle())
						return true;
				
					var playerinfo = cga.GetPlayerInfo();
					var ctx = {
						playerinfo : playerinfo,
						petinfo : cga.GetPetInfo(playerinfo.petid),
						teamplayers : cga.getTeamPlayers(),
						result : null,
					}
					
					teamMode.battle(ctx);
					
					global.callSubPlugins('battle', ctx);

					if(cga.GetMapName() == '蜥蜴洞穴')
						ctx.result = 'supply';

					if( !r || ctx.result == 'supply' ){

						walkMazeBack(loop);
						
						return false;
					}
					else if( ctx.result == 'logback' ){
						cga.LogBack();
						setTimeout(loop, 1500);
						return false;
					}
					
					return true;
				});
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

var thisobj = {
	translate : (pair)=>{
		
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
		
		if(!sellStore.loadconfig(obj))
			return false;
		
		if(!teamMode.loadconfig(obj))
			return false;
		
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
			var sayString = '【蜥蜴插件】请选择蜥蜴练级层数(1~100):';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg)=>{
				var val = parseInt(msg);
				if(val >= 1 && val <= 100){
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
	execute : loop,
};

module.exports = thisobj;