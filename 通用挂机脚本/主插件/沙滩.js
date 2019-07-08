var supplyMode = require('./../公共模块/营地回补');
var sellStore = require('./../公共模块/营地卖石');
var teamMode = require('./../公共模块/组队模式');
var Async = require('async');

var cga = global.cga;
var configTable = global.configTable;

var loop = ()=>{
	var map = cga.GetMapName();
	var mapindex = cga.GetMapIndex().index3;
	
	if(cga.isTeamLeader == true || !cga.getTeamPlayers().length){
		console.log('bbb');
		if(map == '医院' && mapindex == 44692){
			sellStore.object.func(loop);
			return;
		} 
		if(map == '工房'){
			cga.walkList([
			[30, 37, '圣骑士营地']
			], loop);
			return;
		}
		if(map == '肯吉罗岛'){
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
						supplyMode.object.func(loop);
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
			return;
		}
		if(map == '圣骑士营地' && teamMode.object.is_enough_teammates()){
			console.log('aaa');
			cga.walkList([
				[36, 87, '肯吉罗岛'],
				[467, 201],
			], loop);
			return;
		}
	} else {
		console.log('ddd');
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
	console.log('ccc');
	cga.travel.falan.toCamp(()=>{
		cga.walkList([
		cga.isTeamLeader ? [96, 86] : [97, 86],
		], ()=>{
			teamMode.object.wait_for_teammates(loop);
		});
	});
}

module.exports = {
	translate : (pair)=>{
		if(supplyMode.translate(pair))
			return true;
		
		if(sellStore.translate(pair))
			return true;
		
		if(teamMode.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj, cb)=>{

		if(!supplyMode.loadconfig(obj, cb))
			return false;
		
		if(!sellStore.loadconfig(obj, cb))
			return false;
		
		if(!teamMode.loadconfig(obj, cb))
			return false;
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([supplyMode.inputcb, sellStore.inputcb, teamMode.inputcb], cb);
	},
	execute : ()=>{
		loop();
	}
};