var cga = require('./cgaapi')(function(){
	console.log('黑一 起始地点：艾尔莎岛 里堡 营地 （或医院） 或 肯吉罗岛')
	
	var minHp = 0.5;//50%hp提醒
	var minMp = 0.2;//10%mp提醒
	
	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name) ? true : false;
	
	cga.callHosiptal = false;
	cga.exitPos = null;
	
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
		cga.walkList([
			[36, 87, '肯吉罗岛'],
			[424, 345, '黑龙沼泽1区'],
		], (r)=>{
			cga.exitPos = cga.GetMapXY();
			var randomSpace = cga.getRandomSpace(cga.exitPos.x, cga.exitPos.y);
			cga.WalkTo(randomSpace[0], randomSpace[1]);
			setTimeout(cb, 1000, true);
		});
	}
	
	var hosiptal_to_gongfang = (cb)=>{

		cga.walkList([
			[0, 20, '圣骑士营地'],
			[87, 72, '工房'],
			[21, 22],
			[20, 22],
			[21, 22],
			[20, 22],
			[21, 22],
		], (r)=>{
			cga.TurnTo(21, 24);
			cga.sellStone(()=>{
				setTimeout(()=>{
					cga.SayWords('卖石完毕...', 0, 3, 1);
					cb(true);
				}, 5000);
			});
		});
	}
		
	var gongfang_to_out = (cb)=>{

		cga.walkList([
			[30, 37, '圣骑士营地'],
			[36, 87, '肯吉罗岛'],
			[424, 345, '黑龙沼泽1区'],
		], (r)=>{
			cga.exitPos = cga.GetMapXY();
			var randomSpace = cga.getRandomSpace(cga.exitPos.x, cga.exitPos.y);
			cga.WalkTo(randomSpace[0], randomSpace[1]);
			setTimeout(cb, 1000, true);
		});
	}

	var out_to_hosiptal = (cb)=>{

		var walkTo = [
			[551, 332, '圣骑士营地'],
			[95, 72, '医院'],
			[9, 11],
		];
		if(cga.exitPos==null){
			var objs = cga.getMapObjects();
			var xy = cga.GetMapXY();
			for(var i in objs){
				if(cga.isDistanceClose(objs[i].mapx, objs[i].mapy, xy.x, xy.y))
					cga.exitPos = {x:objs[i].mapx, y:objs[i].mapy};
			}
		}
		if(cga.exitPos!=null && cga.GetMapName() == '黑龙沼泽1区'){
			walkTo.unshift([cga.exitPos.x,cga.exitPos.y, '']);
		}
		cga.walkList(walkTo, (r, reason)=>{
			if(!r && reason === 4){
				out_to_hosiptal(cb);
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
				process.exit(1);
				return;
			}
			
			if( playerinfo.hp < playerinfo.maxhp * minHp ||
				playerinfo.mp < playerinfo.maxmp * minMp || 
				petinfo.hp < petinfo.maxhp * minHp ||
				petinfo.mp < petinfo.maxmp * minMp || 
				cga.callHosiptal || 
				cga.GetMapName() == '肯吉罗岛' ){

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
		
	var wait = ()=>{
		cga.WalkTo(96, 86);
		cga.waitTeammates(teammates, (r)=>{
			if(r){
				loop();
				return;
			}
			setTimeout(wait, 1000);
		});
	}
		
	var loop = ()=>{

		var map = cga.GetMapName();
		
		if(map == '医院')
		{
			hosiptal_to_gongfang(()=>{
				gongfang_to_out(()=>{
					startBattle();
				});
			});
		}
		else if(map == '工房')
		{
			gongfang_to_out(()=>{
				startBattle();
			});
		}
		else if(map == '黑龙沼泽1区')
		{
			startBattle();
		}
		else if(map == '圣骑士营地')
		{
			yd_to_out(()=>{
				startBattle();
			});
		}
		else if(map == '艾尔莎岛' || map == '里谢里雅堡')
		{
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