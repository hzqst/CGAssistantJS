var cga = require('./cgaapi')(function(){
	console.log('回廊 起始地点：艾尔莎岛')
	
	var minHp = 0.5;//50%hp提醒
	var minPetHp = 0.3;//宠物30%hp提醒
	var minMp = 0.2;//10%mp提醒
	var teammates = ['hzqst', '你萌死了', '小苹花', '甜贝儿', '约德尔队长'  ]//队长名字和队员名字
	var daka = false;//是否打卡
	
	cga.callHosiptal = false;
	cga.isTeamLeader = false;
	
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

	cga.huilang = ()=>{
		
		cga.SayWords('回廊 开始...', 0, 3, 1);
		
		var stone_to_huilang = (cb)=>{
			
			var to_huilang = ()=>{
				const walkTo = [
					[41, 82, null],
					[51, 72, null],
					[52, 72, null],
				];
				cga.walkList(walkTo, function(r){
					if(!r){
						cb(false);
						return;
					}
					cga.TurnTo(54, 72);
					cga.AsyncWaitNPCDialog(function(dlg){
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(function(dlg2){
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(function(dlg3){
								cga.ClickNPCDialog(4, 0);
								cga.AsyncWaitMovement({map:'过去与现在的回廊', delay:1000, timeout:5000}, function(r){
									cb(true);
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
						to_huilang();
					});
				} else {
					to_huilang();
				}					
			});
		}
		
		var huilang_to_hosiptal = (cb)=>{
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
						teamplayers.length < teammates.length ){
							
						huilang_to_hosiptal((err)=>{
							cga.TurnTo(36,87);
							cga.SayWords('开始补给...', 0, 3, 1);
							setTimeout(()=>{
								cga.SayWords('补给完毕!', 0, 3, 1);
								cga.callHosiptal = false;
								cga.huilang();
							}, 5000);
						});
						return false;
					}
					
					return true;
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
						console.log('supply5');
						cga.SayWords('人物蓝量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(playerinfo.hp < playerinfo.maxhp * minHp)
					{
						console.log('supply4');
						cga.SayWords('人物血量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(petinfo.mp < petinfo.maxmp * minMp)
					{
						console.log('supply3');
						cga.SayWords('宠物蓝量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(petinfo.hp < petinfo.maxhp * minPetHp)
					{
						console.log('supply2');
						cga.SayWords('宠物血量不够，需要回补!', 0, 3, 1);
						cga.callHosiptal = true;
					}
					else if(!teamplayers.length)
					{
						console.log('supply1');
						cga.SayWords('队长不在，回补', 0, 3, 1);
						cga.callHosiptal = true;
					}
					
					if(cga.callHosiptal){							
						huilang_to_hosiptal(()=>{
							cga.TurnTo(36,87);
							cga.SayWords('开始补给...', 0, 3, 1);
							setTimeout(()=>{
								cga.SayWords('补给完毕!', 0, 3, 1);
								cga.callHosiptal = false;
								cga.huilang();
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
				cga.isTeamLeader = true;
				cga.WalkTo(11, 20);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						goodToGo();
						return;
					}
					setTimeout(startBattle, 1000);
				});
			} else {
				cga.isTeamLeader = false;
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
		if(map == '过去与现在的回廊'){
			startBattle();
		} else {
			if(needSupplyInitial()){
				huilang_to_hosiptal(()=>{
					cga.SayWords('开始补给...', 0, 3, 1);
					setTimeout(()=>{
						cga.SayWords('补给完毕!', 0, 3, 1);
						stone_to_huilang(()=>{
							startBattle();
						});
					}, 5000);
				});
			} else {
				stone_to_huilang(()=>{
					startBattle();
				});
			}
		}
	}
	
	cga.listen();
	
	cga.huilang();
});