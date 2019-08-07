var Async = require('async');
var supplyMode = require('./../公共模块/高地回补');
var teamMode = require('./../公共模块/组队模式');
var logbackEx = require('./../公共模块/登出防卡住');

var battleAreaArray = [
{
	name : '刀鸡',
	pos : [34, 188],
	dir : 0,
},
{
	name : '黄金龙骨',
	pos : [135, 175],
	dir : 6,
},
{
	name : '银狮',
	pos : [147, 117],
	dir : 2,
},
]

var cga = global.cga;
var configTable = global.configTable;

var battleWrapper = (isLeader)=>{
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

	if(isLeader)
	{
		if( ctx.result == 'supply' ){

			supplyMode.func(loop);
			
			return false;
		}
		else if( ctx.result == 'logback' ){
			
			logbackEx.func(loop);
			
			return false;
		}
	}
	
	return true;
}

var loop = ()=>{
	var map = cga.GetMapName();
	var mapindex = cga.GetMapIndex().index3;
	
	if(cga.isTeamLeader == true || !cga.getTeamPlayers().length){
		if(map == '医院' && mapindex == 59539){
			cga.walkList([
			[28, 52, '艾夏岛'],
			[190, 116, '盖雷布伦森林'],
			[231, 222, '布拉基姆高地'],
			thisobj.battleArea.pos,
			], loop);
			return;
		} 
		if(map == '布拉基姆高地')
		{
			cga.freqMove(thisobj.battleArea.dir, ()=>{
				
				if(cga.isInNormalState()) {
					if(!battleWrapper(true))
						return false;
				}
				
				return true;
			});
			return;
		}
		if(map == '艾尔莎岛' && teamMode.is_enough_teammates()){
			cga.travel.newisland.toStone('D', ()=>{
				cga.walkList([
					[190, 116, '盖雷布伦森林'],
					[231, 222, '布拉基姆高地'],
					thisobj.battleArea.pos,
				], loop);
			});
			return;
		}
	} else {
		if(cga.isInNormalState()) {
			if(!battleWrapper(false))
				return;
		}
		
		setTimeout(loop, 1500);
		return;
	}

	if(cga.needSupplyInitial() && supplyMode.isInitialSupply())
	{
		supplyMode.func(loop);
		return;
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
					
					return true;
				}
				
				return false;
			});
		}], cb);
	},
	execute : ()=>{
		callSubPlugins('init');
		logbackEx.init();
		loop();
	},
}

module.exports = thisobj;