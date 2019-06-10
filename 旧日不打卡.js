var cga = require('./cgaapi')(function(){
	console.log('旧日 起始地点：艾尔莎岛')
	
	var minHp = 0.5;//50%hp提醒
	var minPetHp = 0.5;//宠物50%hp提醒
	var minMp = 0.2;//10%mp提醒
	var teammates = ['hzqst', '你萌死了', '小苹花', '我本帅哥', '仅此而已&' ]//队长名字和队员名字
	var daka = false;//是否打卡
	
	cga.callHosiptal = false;
	
	var playerinfo = cga.GetPlayerInfo();
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name) ? true : false
	
	cga.listen = ()=>{
		cga.AsyncWaitChatMsg((r)=>{

			if(cga.isTeamLeader){
				if(r.msg && r.msg.indexOf('需要回补') >= 0 && r.msg.indexOf('[GP]') >= 0){
					cga.callHosiptal = true;
				}
			}
		
			cga.listen();
		}, 1000);
	}
	
	cga.jiuri = ()=>{
		
		cga.SayWords('旧日 开始...', 0, 3, 1);
		
		var falan_to_yd = cga.travel.falan.toCamp;
		
		var stone_to_jiuri = (cb)=>{
			
			var to_jiuri = ()=>{
				cga.walkList([
					[102, 91],
					[106, 87],
					[114, 87],
					[119, 82],
				], ()=>{
					cga.TurnTo(120, 81);
					cga.AsyncWaitNPCDialog(function(dlg){
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitMovement({map:'旧日之地', delay:1000, timeout:5000}, function(r){
							cga.walkList([
								[45, 47, null],
							], ()=>{
								cga.TurnTo(45, 46);
								cga.AsyncWaitNPCDialog(function(dlg){
									cga.ClickNPCDialog(1, 0);
									cga.AsyncWaitMovement({map:'迷宫入口', delay:1000, timeout:5000}, function(r){
										cb(true);
									});
								});
							});
						});
					});
				});
			}
			
			cga.travel.falan.toStone('C', ()=>{
				var pl = cga.GetPlayerInfo();
				if(pl.punchclock > 0 && !pl.usingpunchclock && daka == true){
					cga.travel.falan.toCastleClock((r)=>{
						cga.walkList([
							[41, 83],
							[41, 91],
						], ()=>{
							falan_to_yd(()=>{
								to_jiuri(cb);
							});
						});
					});
				} else {
					falan_to_yd(()=>{
						to_jiuri(cb);
					});
				}					
			});
		}
		
		var jiuri_to_hosiptal = (cb)=>{
			cga.travel.falan.toCastleHospital((r)=>{
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		}
				
		var goodToGo = ()=>{
			cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false);
			cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true);
			if(cga.isTeamLeader){
				cga.SayWords('开始遇敌...', 0, 3, 1);
				cga.walkList([
				[9, 5, '旧日迷宫第1层'],
				], (result)=>{
					
					if(result == false){
						
					}
					
					cga.freqMove(0, function(){
						
						if(cga.isInBattle())
							return true;
						
						var playerinfo = cga.GetPlayerInfo();
						var petinfo = cga.GetPetInfo(playerinfo.petid);
						var teamplayers = cga.getTeamPlayers();
						if( playerinfo.hp < playerinfo.maxhp * minHp ||
							playerinfo.mp < playerinfo.maxmp * minMp || 
							petinfo.hp < petinfo.maxhp * minPetHp ||
							petinfo.mp < petinfo.maxmp * minMp || 
							cga.callHosiptal ||
							teamplayers.length < teammates.length || 
							cga.GetMapName() == '迷宫入口' ){
								
							jiuri_to_hosiptal((err)=>{
								cga.TurnTo(36,87);
								cga.SayWords('开始补给...', 0, 3, 1);
								setTimeout(()=>{
									cga.SayWords('补给完毕!', 0, 3, 1);
									cga.callHosiptal = false;
									cga.jiuri();
								}, 5000);
							});
							return false;
						}
						
						return true;
					});
				});
			} else {
				var waitSupply = ()=>{
					
					if(cga.isInBattle()){
						setTimeout(waitSupply, 1000);
						return;
					}
					
					var playerinfo = cga.GetPlayerInfo();
					var petinfo = cga.GetPetInfo(playerinfo.petid);
					var teamplayers = cga.getTeamPlayers();

					if(playerinfo.mp < playerinfo.maxmp * minMp)
					{
						cga.SayWords('人物蓝量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(playerinfo.hp < playerinfo.maxhp * minHp)
					{
						cga.SayWords('人物血量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(petinfo.mp < petinfo.maxmp * minMp)
					{
						cga.SayWords('宠物蓝量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(petinfo.hp < petinfo.maxhp * minPetHp)
					{
						cga.SayWords('宠物血量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(!teamplayers.length)
					{
						cga.SayWords('队长不在，回补', 0, 3, 1);
						cga.callHosiptal = true;
					}
					
					if(cga.callHosiptal){							
						jiuri_to_hosiptal(()=>{
							cga.TurnTo(36,87);
							cga.SayWords('开始补给...', 0, 3, 1);
							setTimeout(()=>{
								cga.SayWords('补给完毕!', 0, 3, 1);
								cga.callHosiptal = false;
								cga.jiuri();
							}, 5000);
						});
					} else {
						setTimeout(waitSupply, 1000);
					}
				}
				
				setTimeout(waitSupply, 1000);
			}
		}
				
		var startBattle = ()=>{
			
			var playerinfo = cga.GetPlayerInfo();
			
			var teamplayers = cga.getTeamPlayers();

			if(teammates[0] == playerinfo.name){
				cga.WalkTo(7, 7);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						goodToGo();
						return;
					}
					setTimeout(startBattle, 1000);
				});
			} else {
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						goodToGo();
						return;
					}
					setTimeout(startBattle, 1000);
				});
			}
		}
		
		var needSupplyInitial = ()=>{
			var playerinfo = cga.GetPlayerInfo();
				var petinfo = cga.GetPetInfo(playerinfo.petid);
				if( playerinfo.hp < playerinfo.maxhp ||
					playerinfo.mp < playerinfo.maxmp || 
					petinfo.hp < petinfo.maxhp ||
					petinfo.mp < petinfo.maxmp)
					return true;
			
			return false;			
		}
		
		var map = cga.GetMapName();
		if(map == '迷宫入口'){
			startBattle();
		} else {
			if(needSupplyInitial()){
				jiuri_to_hosiptal(()=>{
					cga.SayWords('开始补给...', 0, 3, 1);
					setTimeout(()=>{
						cga.SayWords('补给完毕!', 0, 3, 1);
						stone_to_jiuri(()=>{
							startBattle();
						});
					}, 5000);
				});
			} else {
				stone_to_jiuri(()=>{
					startBattle();
				});
			}
		}
	}
	
	cga.listen();
	
	cga.jiuri();
});