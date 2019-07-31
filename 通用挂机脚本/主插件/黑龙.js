var Async = require('async');
var supplyMode = require('./../公共模块/营地回补');
var sellStore = require('./../公共模块/营地卖石');
var sellStore2 = require('./../公共模块/里堡卖石');
var teamMode = require('./../公共模块/组队模式');

var cga = global.cga;
var configTable = global.configTable;
var sellStoreArray = ['不卖石', '卖石'];

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
	cga.walkRandomMaze(null, (r, err)=>{
		//龙顶?

		if(r == false && err.message == '无法找到迷宫的出口' && cga.GetMapName().indexOf('黑龙沼泽') >= 0)
		{
			cb(true);
			return;
		}
		walkMazeForward(cb);
	}, {
		layerNameFilter : (layerIndex)=>{
			return '黑龙沼泽'+(layerIndex + 1)+'区';
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
	cga.walkRandomMaze(null, (r, err)=>{
		walkMazeBack(cb);
	}, {
		layerNameFilter : (layerIndex)=>{
			return layerIndex > 1 ? ('黑龙沼泽'+(layerIndex - 1)+'区') : '肯吉罗岛';
		},
		entryTileFilter : (e)=>{
			return (cga.GetMapName() == '黑龙沼泽1区') ? (e.colraw == 0) : (e.colraw == 0x2EE0);
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
				var xy = cga.GetMapXY();
				var dir = cga.getRandomSpaceDir(xy.x, xy.y);
				cga.freqMove(dir, (r)=>{
			
					if(!cga.isInNormalState())
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
										
					if(ctx.result == null && cga.GetMapName() == '肯吉罗岛')
						ctx.result = 'supply';
					
					if(ctx.result == null && !r)
						ctx.result = 'supply';
					
					if(ctx.result == 'supply' && supplyMode.isLogBack())
						ctx.result = 'logback';
					
					if( ctx.result == 'supply' ){

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
	
			if(ctx.result == 'supply' && supplyMode.isLogBack())
				ctx.result = 'logback';
			
			if( ctx.result == 'supply' ){
				//cga.SayWords(ctx.reason, 0, 3, 1);
			}
			else if( ctx.result == 'logback' ){
				/*cga.SayWords(ctx.reason, 0, 3, 1);
				cga.LogBack();
				setTimeout(loop, 1500);
				return;*/
			}
		}
		setTimeout(loop, 1500);
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
	
	cga.travel.falan.toCamp(()=>{
		cga.walkList([
		cga.isTeamLeader ? [96, 86] : [97, 86],
		], ()=>{
			teamMode.wait_for_teammates(loop);
		});
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();
		
		if(map == '肯吉罗岛' )
			return 1;
		
		if(map.indexOf('黑龙沼泽') >= 0)
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
			pair.field = '黑龙练级层数';
			pair.value = pair.value + '层';
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
		
		if(!thisobj.sellStore){
			console.error('读取配置：是否卖石失败！');
			return false;
		}
		
		configTable.layerLevel = obj.layerLevel;
		thisobj.layerLevel = obj.layerLevel
		
		if(!thisobj.layerLevel){
			console.error('读取配置：黑龙练级层数失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([supplyMode.inputcb, teamMode.inputcb, (cb2)=>{
			var sayString = '【黑龙插件】请选择是否卖石: 0不卖石 1卖石';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg)=>{
				var val = parseInt(msg);
				if(val >= 0 && val <= 1){
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

module.exports = thisobj;