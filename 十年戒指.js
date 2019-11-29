var cga = require('./cgaapi')(function(){

	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false
	
	var task = cga.task.Task('诅咒的迷宫', [
	{//0
		intro: '1.前往法兰城里谢里雅堡与追忆之路管理员（30.80）对话，选“是”进入追忆之路。',
		workFunc: function(cb2){
			
			//补血
			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cga.travel.newisland.toStone('X', ()=>{
							cb2('restart stage');
						});
					}, 3000);
				});
				return;
			}
			
			//进入追忆之路
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
				[30, 81, null]
				], ()=>{
					cga.TurnTo(30, 79);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'追忆之路', delay:1000, timeout:5000}, ()=>{
									cb2(true);
								});
							});
						});
					});
				});
			});
		},
	},
	{//1
		intro: '2.组队',
		workFunc: function(cb2){
			
			var wait2 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						setTimeout(cb2, 1000, true);
						return;
					}
					setTimeout(wait2, 1000);
				});
			}

			var wait = ()=>{
				cga.WalkTo(15, 125);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						setTimeout(cb2, 1000, true);
						return;
					}
					setTimeout(wait, 1000);
				});
			}
						
			if(cga.isTeamLeader){
				wait();
			} else {
				wait2();
			}
		},
	},
	{//2
		intro: '3.依次挑战追忆之路内的5位BOSS，分别是：露比、法尔肯、帕布提斯马&凯法、犹大、海贼头目、帕鲁凯斯的亡灵（第一形态）',
		workFunc: function(cb2){
			
			var retry = ()=>{
				cga.cleanInventory(1, ()=>{
					cga.TurnTo(15, 4);
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							cga.walkList([ [14, 5], [15, 5] ], retry);
							return;
						}
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'里谢里雅堡', delay:1000, timeout:5000}, ()=>{
								cb2(true);
							});
						});
					});
				});
			}
			
			var wait = ()=>{
				cga.waitForLocation({mapname : '追忆之路', pos : [15, 4], leaveteam : true, walkto : [15, 5]}, retry);
			}

			var go = ()=>{
				cga.walkList([
					[15, 111],
				], ()=>{
					cga.TurnTo(15, 109);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, 0);
						cga.waitForBattleEnd(()=>{
							cga.walkList([
							[15, 100]
							], ()=>{
								cga.TurnTo(15, 98);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(1, 0);
									cga.waitForBattleEnd(()=>{
										cga.walkList([
										[15, 89]
										], ()=>{
											cga.TurnTo(15, 87);
											cga.AsyncWaitNPCDialog(()=>{
												cga.ClickNPCDialog(1, 0);
												cga.waitForBattleEnd(()=>{
													cga.walkList([
													[15, 78]
													], ()=>{
														cga.TurnTo(15, 76);
														cga.AsyncWaitNPCDialog(()=>{
															cga.ClickNPCDialog(1, 0);
															cga.waitForBattleEnd(()=>{
																cga.walkList([
																[15, 67]
																], ()=>{
																	cga.TurnTo(15, 67);
																	cga.AsyncWaitNPCDialog(()=>{
																		cga.ClickNPCDialog(1, 0);
																		cga.waitForBattleEnd(()=>{
																			cga.walkList([
																			[15, 56]
																			], ()=>{
																				cga.TurnTo(15, 54);
																				cga.AsyncWaitNPCDialog(()=>{
																					cga.ClickNPCDialog(1, 0);
																					cga.waitForBattleEnd(()=>{
																						cga.walkList([
																						[15, 5],
																						[14, 5],
																						[15, 5],
																						[14, 5],
																						[15, 5],
																						], retry);
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
						
			if(cga.isTeamLeader){
				go();
			} else {
				wait();
			}
		},
	},
	],
	[//任务阶段是否完成
		function(){
			return false;
		},
		function(){
			return false;
		},
		function(){
			return false;
		},
	]
	);

	task.doTask();
});