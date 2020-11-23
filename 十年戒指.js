var cga = require('./cgaapi')(function(){

	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	if(!teamplayers.length){
		teammates[0] = playerinfo.name;
	} else {
		for(var i in teamplayers)
			teammates[i] = teamplayers[i].name;
	}
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false
	
	var task = cga.task.Task('十周年戒指', [
	{//0
		intro: '1.前往法兰城里谢里雅堡与追忆之路管理员（30.80）对话，选“是”进入追忆之路。',
		workFunc: function(cb2){
			
			//补血
			if(cga.needSupplyInitial()){
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
		intro: '2.依次挑战追忆之路内的5位BOSS，分别是：露比、法尔肯、帕布提斯马&凯法、犹大、海贼头目、帕鲁凯斯的亡灵（第一形态）',
		workFunc: function(cb2){
			
			var retry = (err)=>{
				if(err){
					cb2(err);
					return;
				}
				console.log('拿戒指')
				cga.cleanInventory(1, ()=>{
					cga.turnTo(15, 4);
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
				cga.waitForLocation({
					mapname : '追忆之路', 
					pos : [15, 4], 
					leaveteam : true, 
					walkto : [15, 5], 
					desired_teamplayers : cga.getTeamPlayers()
				}, retry);
			}

			var go = ()=>{
				console.log('露比')
				cga.walkList([
					[15, 111],
				], ()=>{
					cga.turnTo(15, 110);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, 0);
						cga.waitForBattleEnd(()=>{
							if(cga.GetMapXY().y != 103){
								cb2(new Error('没有打过露比！请检查战斗配置是否有问题！'));
								return;
							}
							console.log('法尔肯')
							cga.walkList([
							[15, 100]
							], ()=>{
								cga.turnTo(15, 99);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(1, 0);
									cga.waitForBattleEnd(()=>{
										if(cga.GetMapXY().y != 92){
											cb2(new Error('没有打过法尔肯！请检查战斗配置是否有问题！'));
											return;
										}
										console.log('犹大')
										cga.walkList([
										[15, 89]
										], ()=>{
											cga.turnTo(15, 88);
											cga.AsyncWaitNPCDialog(()=>{
												cga.ClickNPCDialog(1, 0);
												cga.waitForBattleEnd(()=>{
													if(cga.GetMapXY().y != 81){
														cb2(new Error('没有打过犹大！请检查战斗配置是否有问题！'));
														return;
													}
													console.log('海贼')
													cga.walkList([
													[15, 78]
													], ()=>{
														cga.turnTo(15, 77);
														cga.AsyncWaitNPCDialog(()=>{
															cga.ClickNPCDialog(1, 0);
															cga.waitForBattleEnd(()=>{
																if(cga.GetMapXY().y != 70){
																	cb2(new Error('没有打过海贼！请检查战斗配置是否有问题！'));
																	return;
																}
																console.log('双王')
																cga.walkList([
																[15, 67]
																], ()=>{
																	cga.turnTo(15, 66);
																	cga.AsyncWaitNPCDialog(()=>{
																		cga.ClickNPCDialog(1, 0);
																		cga.waitForBattleEnd(()=>{
																			if(cga.GetMapXY().y != 59){
																				cb2(new Error('没有打过双王！请检查战斗配置是否有问题！'));
																				return;
																			}
																			cga.walkList([//帕鲁凯斯的亡灵
																			[15, 56]
																			], ()=>{
																				cga.turnTo(15, 55);
																				cga.AsyncWaitNPCDialog(()=>{
																					cga.ClickNPCDialog(1, 0);
																					cga.waitForBattleEnd(()=>{
																						if(cga.GetMapXY().y != 48){
																							cb(new Error('没有打过小帕！请检查战斗配置是否有问题！'));
																							return;
																						}
																						cga.walkList([
																							[15, 5],
																						], ()=>{
																							cga.walkTeammateToPosition([
																							[15, 5],
																							[14, 5],
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
	]
	);

	task.doTask();
});