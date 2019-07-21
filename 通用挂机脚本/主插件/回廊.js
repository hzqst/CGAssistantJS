var Async = require('async');
var sellStore = require('./../公共模块/里堡卖石');
var teamMode = require('./../公共模块/组队模式');

var cga = global.cga;
var configTable = global.configTable;
var sellStoreArray = ['不卖石', '卖石'];

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
				
				if(cga.isInNormalState()) {
					if(!battle(true))
						return false;
				}
				
				return true;
			});
			return;
		}
	} else {
		if(cga.isInNormalState()) {
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
		
		if(pair.field == 'sellStore'){
			pair.field = '是否卖石';
			pair.value = pair.value == 1 ? '卖石' : '不卖石';
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
		
		configTable.sellStore = obj.sellStore;
		thisobj.sellStore = obj.sellStore
		
		if(!thisobj.sellStore){
			console.error('读取配置：是否卖石失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([sellStore.inputcb, teamMode.inputcb, (cb2)=>{
			var sayString = '【回廊插件】请选择是否卖石: 0不卖石 1卖石';
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
		}], cb);
	},
	execute : loop,
};