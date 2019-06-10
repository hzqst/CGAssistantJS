//begin from 艾尔莎岛 医院


Array.prototype.contain = function(val)
{
    for (var i = 0; i < this.length; i++)
    {
		if (this[i] == val)
		{
			return true;
		}
    }
	
	return false;
}

var cga = require('./cgaapi')(function(){
	console.log('十年 起始地点：艾尔莎岛')

	var teammates = ['小苹花', '你萌死了']//队长名字和队员名字

	var playerinfo = cga.GetPlayerInfo();
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name) ? true : false
	
	cga.huilang = ()=>{
		
		cga.SayWords('十年 开始...', 0, 3, 1);

		var battleAgain = (cb)=>{

			if(cga.isInBattle()){
				setTimeout(battleAgain, 5000);
				return;
			}
			
			cb(true);
		};
		
		var stone_to_huilang = (cb)=>{
			
			var to_huilang = ()=>{
				cga.walkList([
				[30, 81, null]
				], ()=>{
					cga.TurnTo(30, 79);
					cga.AsyncWaitNPCDialog(function(dlg){
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(function(dlg2){
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(function(dlg3){
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'追忆之路', delay:1000, timeout:5000}, function(r){
									cb(true);
								});
							});
						});
					});
				});
			}
			
			cga.travel.falan.toStone('C', ()=>{
				to_huilang();
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

		var goodToGoLeader = (cb)=>{
			cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false);
			cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true);
			
			cga.AsyncWaitNPCDialog(function(dlg){
				cga.ClickNPCDialog(1, 0);
				setTimeout(battleAgain, 5000, ()=>{
					cga.walkList([
					[15, 100, null]
					], ()=>{
						cga.TurnTo(15, 98);
						cga.AsyncWaitNPCDialog(function(dlg){
							cga.ClickNPCDialog(1, 0);
							setTimeout(battleAgain, 5000, ()=>{
								cga.walkList([
								[15, 89, null]
								], ()=>{
									cga.TurnTo(15, 87);
									cga.AsyncWaitNPCDialog(function(dlg){
										cga.ClickNPCDialog(1, 0);
										setTimeout(battleAgain, 5000, ()=>{
											cga.walkList([
											[15, 78, null]
											], ()=>{
												cga.TurnTo(15, 76);
												cga.AsyncWaitNPCDialog(function(dlg){
													cga.ClickNPCDialog(1, 0);
													setTimeout(battleAgain, 5000, ()=>{
														cga.walkList([
														[15, 67, null]
														], ()=>{
															cga.TurnTo(15, 67);
															cga.AsyncWaitNPCDialog(function(dlg){
																cga.ClickNPCDialog(1, 0);
																setTimeout(battleAgain, 5000, ()=>{
																	cga.walkList([
																	[15, 56, null]
																	], ()=>{
																		cga.TurnTo(15, 54);
																		cga.AsyncWaitNPCDialog(function(dlg){
																			cga.ClickNPCDialog(1, 0);
																			setTimeout(battleAgain, 5000, ()=>{
																				cga.walkList([
																				[15, 5, null],
																				[14, 5, null],
																				[15, 5, null],
																				[14, 5, null],
																				[15, 5, null],
																				], ()=>{
																					cga.TurnTo(15, 4);
																					cga.AsyncWaitNPCDialog(function(dlg){
																						cga.ClickNPCDialog(32, 0);
																						cga.AsyncWaitNPCDialog(function(dlg){
																							cga.ClickNPCDialog(1, 0);
																							setTimeout(cb, 1000, true);
																						});
																					});
																				});
																			});
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		}
		
		var waitToEnd = (cb)=>{

			if(cga.isInBattle()){
				setTimeout(waitToEnd, 5000);
				return;
			}
			
			var pos = cga.GetMapXY();
			if((pos.x == 15 || pos.x == 14) && pos.y == 4)
			{
				cb(true);
				return;
			}
			
			setTimeout(waitToEnd, 5000);
			return;
		};
		
		var goodToGoTeammate = (cb)=>{
			
			setTimeout(waitToEnd, 5000, ()=>{
				cga.TurnTo(15, 4);
				cga.AsyncWaitNPCDialog(function(dlg){
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(function(dlg){
						cga.ClickNPCDialog(1, 0);
						setTimeout(cb, 1000, true);
					});
				});
			});
		}
		
		var startBattle = (cb)=>{
			if(cga.isTeamLeader){
				cga.WalkTo(15, 125);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						goodToGoLeader(cga.huilang);
						return;
					}
					setTimeout(startBattle, 1000, cb);
				});
			} else {
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						goodToGoTeammate(cga.huilang);
						return;
					}
					setTimeout(startBattle, 1000, cb);
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
		if(map == '追忆之路'){
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
		
	cga.huilang();
});