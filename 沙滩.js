//begin from 艾尔莎岛 医院

var cga = require('./cgaapi')(function(){
	console.log('沙滩 起始地点：艾尔莎岛 里堡 营地 （或医院） 或 肯吉罗岛')
	
	var minHp = 0.5;//50%hp提醒
	var minMp = 0.2;//10%mp提醒
	
	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name) ? true : false;
	
	cga.callHosiptal = false;
	
	if(cga.isTeamLeader)
	{	
		cga.waitTeammateSay((player, msg)=>{

			if(!cga.callHosiptal && msg.indexOf('需要回补') >= 0){
				cga.callHosiptal = true;
			}
			
			return true;
		});
	}

	var yd_to_out = (cb)=>{
		const walkTo = [
			[37, 87],
			[36, 87, '肯吉罗岛'],
			[467, 201],
		];
		cga.walkList(walkTo, function(r){
			if(!r){
				cb(false);
				return;
			}
			cb(true);
		});
	}
	
	var falan_to_yd = cga.travel.falan.toCamp;
	
	var hosiptal_to_gongfang = (cb)=>{
		const walkTo = [
			[0, 20, '圣骑士营地'],
			[87, 72, '工房'],
			[21, 22],
			[20, 22],
			[21, 22],
			[20, 22],
			[21, 22],
		];
		cga.walkList(walkTo, function(r){
			if(!r){
				cb(false);
				return;
			}
			cga.TurnTo(21, 24);
			cga.sellStone(function(){
				setTimeout(()=>{
					cga.SayWords('卖石完毕...', 0, 3, 1);
					cb(true);
				}, 5000);
			});
		});
	}
	
	var gongfang_to_out = (cb)=>{
		const walkTo = [
			[30, 37, '圣骑士营地'],
			[81, 87],
			[37, 87],
			[36, 87, '肯吉罗岛'],
			[467, 201],
		];
		cga.walkList(walkTo, function(r){
			if(!r){
				cb(false);
				return;
			}
			cb(true);
		});
	}
			
	var out_to_hosiptal = (cb)=>{
		const walkTo = [
			[551, 332, '圣骑士营地'],
			[95, 72, '医院'],
			[9, 11],
			[9, 12],
			[9, 11],
			[9, 12],
			[9, 11],
		];
		cga.walkList(walkTo, function(r){
			if(!r){
				cb(false);
				return;
			}
			cb(true);
		});
	}

	var startBattle = ()=>{
		var xy = cga.GetMapXY();
		var dir = cga.getRandomSpaceDir(xy.x, xy.y);
		cga.freqMove(dir, function(){
			
			if(cga.isInBattle())
				return true;

			var playerinfo = cga.GetPlayerInfo();
			var petinfo = cga.GetPetInfo(playerinfo.petid);
			
			if(playerinfo.health > 0){
				cga.LogBack();
				process.exit(1);
				return;
			}
			
			if( playerinfo.hp < playerinfo.maxhp * minHp ||
				playerinfo.mp < playerinfo.maxmp * minMp || 
				petinfo.hp < petinfo.maxhp * minHp ||
				petinfo.mp < petinfo.maxmp * minMp || 
				cga.callHosiptal ){
					
				out_to_hosiptal((err)=>{
					cga.TurnTo(11,11);
					cga.SayWords('开始补给...', 0, 3, 1);
					setTimeout(()=>{
						cga.SayWords('补给完毕!', 0, 3, 1);
						cga.callHosiptal = false;			
						loop();
					}, 5000);
				});
				
				return false;
			}
			
			return true;
		});
	}
	
	var loop = ()=>{
		var map = cga.GetMapName();
		if(map == '医院'){
			hosiptal_to_gongfang(()=>{
				gongfang_to_out(()=>{
					startBattle();
				});
			});
		} else if(map == '工房'){
			gongfang_to_out(()=>{
				startBattle();
			});
		} else if(map == '肯吉罗岛'){
			startBattle();
		} else if(map == '圣骑士营地'){
			yd_to_out(()=>{
				startBattle();
			});
		} else if(map == '艾尔莎岛' || map == '里谢里雅堡'){
			cga.travel.falan.toCamp(()=>{
				var teamplayersnow = cga.getTeamPlayers();
				if(cga.isTeamLeader && teamplayersnow.length < teammates.length)
				{
					wait();
				}
				else
				{
					loop();
				}
			});
		}	
	}
	
	loop();
});