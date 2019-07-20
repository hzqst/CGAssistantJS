var Async = require('async');
var sellStore = require('./../公共模块/里堡卖石');
var teamMode = require('./../公共模块/组队模式');

var cga = global.cga;
var configTable = global.configTable;

var battle = (checkTeam)=>{
	var playerinfo = cga.GetPlayerInfo();
	var ctx = {
		playerinfo : playerinfo,
		petinfo : cga.GetPetInfo(playerinfo.petid),
		teamplayers : cga.getTeamPlayers(),
		result : null,
	}

	if(checkTeam === true)
		teamMode.battle(ctx);

	global.callSubPlugins('battle', ctx);

	if( ctx.result == 'supply' || ctx.result == 'logback' ){
		
		cga.LogBack();
		setTimeout(loop, 1500);
		return false;
	}
	
	return true;
}

var loop = ()=>{
	var map = cga.GetMapName();
	var mapindex = cga.GetMapIndex().index3;
	
	if(cga.isTeamLeader == true || !cga.getTeamPlayers().length){
		if(map == '过去与现在的回廊'){
			
			if(!teamMode.is_enough_teammates()){
				if(cga.isTeamLeader == true)
				{
					cga.WalkTo(11, 20);
				}
				else
				{
					if(!battle(false))
						return;
					
					cga.WalkTo(10, 20);
				}
				teamMode.wait_for_teammates(loop);
				return;
			}
			
			cga.freqMove(0, ()=>{
				
				if(!cga.isInBattle()) {
					if(!battle(true))
						return false;
				}
				
				return true;
			});
			return;
		}
	} else {
		if(!cga.isInBattle()) {
			if(!battle(true))
				return;
		}
		
		setTimeout(loop, 1500);
		return;
	}
	if(map != '里谢里雅堡'){
		cga.travel.falan.toStone('C', loop);
		return;
	}
	
	if(cga.needSupplyInitial())
	{
		cga.travel.falan.toCastleHospital(()=>{
			setTimeout(loop, 5000);
		});
		return;
	}

	if(cga.getSellStoneItem().length > 0)
	{
		sellStore.func(loop);
		return;
	}
	
	cga.walkList([
	[52, 72]
	], ()=>{
		cga.TurnTo(54, 72);
		cga.AsyncWaitNPCDialog((dlg)=>{
			cga.ClickNPCDialog(32, 0);
			cga.AsyncWaitNPCDialog((dlg2)=>{
				cga.ClickNPCDialog(4, 0);
				cga.AsyncWaitNPCDialog((dlg3)=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitMovement({map:'过去与现在的回廊', delay:1000, timeout:5000}, loop);
				});
			});
		});
	});
}

module.exports = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();
		
		if(map == '过去与现在的回廊' )
			return 2;
		
		return 0;
	},
	translate : (pair)=>{
		if(sellStore.translate(pair))
			return true;
		
		if(teamMode.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{

		if(!sellStore.loadconfig(obj))
			return false;
		
		if(!teamMode.loadconfig(obj))
			return false;
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([sellStore.inputcb, teamMode.inputcb], cb);
	},
	execute : loop,
};