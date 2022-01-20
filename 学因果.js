var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	
	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false;
	
	var task = cga.task.Task('大小宝箱', [
	{//0
		intro: '1.前往雪拉威森塔52层与纳利米（101.64）对话，选“是”获得【红色蜡烛】；选“否”获得【白色蜡烛】。',
		workFunc: function(cb2){
						
			var go = ()=>{
				cga.walkList([
				[90, 99, '国民会馆'],
				[108, 39, '雪拉威森塔１层'],
				[73, 60],
				[75, 50, '雪拉威森塔５０层'],
				[63, 34, '雪拉威森塔５１层'],
				[141, 65, '雪拉威森塔５１层', 151, 103],
				[151, 99],
				[153, 99, '雪拉威森塔５１层', 78, 106],
				[75, 116],
				[149, 108, '雪拉威森塔５２层'],
				[101, 64],
				], ()=>{
					cga.walkTeammateToPosition([
					[101, 64],
					[101, 65],
					], ()=>{
						cga.cleanInventory(1, ()=>{
							cga.turnTo(102, 64);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(32, 0);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(4, 0);
										cga.AsyncWaitNPCDialog(()=>{
											cga.SayWords('请选择“是”路线，完成请说“1”！', 0, 3, 1);
											setTimeout(()=>{
												cga.SayWords('1', 0, 3, 1);
											}, 1500);
										});
									});
								});
							});
						});
					});
					
					cga.waitTeammateSayNextStage(teammates, cb2);
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.cleanInventory(1, ()=>{
						cga.turnTo(102, 64);
						cga.AsyncWaitNPCDialog((err)=>{
							if(err){
								retry();
								return;
							}
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(4, 0);
									setTimeout(()=>{
										cga.SayWords('1', 0, 3, 1);
										cb2(true);
									}, 1500);
								});
							});
						});
					});
				}
				
				cga.waitForLocation({mapname : '雪拉威森塔５２层', pos : [102, 64]}, retry);
			}
			
			var wait3 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						go2();
						return;
					}
					setTimeout(wait3, 1000);
				});
			}
			
			var wait2 = ()=>{
				var retry = ()=>{
					cga.turnTo(165, 154);
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							retry();
							return;								
						}
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitMovement({map:'利夏岛', delay:1000, timeout:5000}, wait3);
						});
					});
				}
				
				cga.waitForLocation({mapname : '艾尔莎岛', pos : [165, 154]}, retry);
			}
		
			var wait = ()=>{
				cga.WalkTo(93, 63);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						go();
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			if(cga.isTeamLeader){
				cga.travel.newisland.toLiXiaIsland(()=>{
					wait();
				});
			} else {
				wait2();
			}
		}
	},
	{//1
		intro: '◆【红色蜡烛】路线：至雪拉威森塔54层（88.44）处调查宝箱，获得【藏宝图】',
		workFunc: function(cb2){
			var go = ()=>{
				cga.walkList([
				[70, 105, '雪拉威森塔５３层'],
				[118, 137, '雪拉威森塔５４层'],
				[85, 44],
				], ()=>{
					cga.walkTeammateToPosition([
					[85, 44],
					[85, 45],
					], ()=>{
						cga.cleanInventory(1, ()=>{
							cga.turnTo(84, 44);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, 0);
								setTimeout(()=>{
									cga.SayWords('请拿取藏宝图，完成请说“1”！', 0, 3, 1);
									setTimeout(()=>{
										cga.SayWords('1', 0, 3, 1);
									}, 1500);
								}, 1500);
							});
						});
					});
					cga.waitTeammateSayNextStage(teammates, cb2);
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.cleanInventory(1, ()=>{
						cga.turnTo(84, 44);
						cga.AsyncWaitNPCDialog((err)=>{
							if(err){
								retry();
								return;
							}
							cga.ClickNPCDialog(4, 0);
							setTimeout(()=>{
								cga.SayWords('1', 0, 3, 1);
								cb2(true);
							}, 1500);
						});
					});
				}
				
				cga.waitForLocation({mapname : '雪拉威森塔５４层', pos : [84, 44]}, retry);
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				go2();
			}
		}
	},
	{//2
		intro: '3.返回雪拉威森塔52层与纳利米对话，交出相关【道具】传送至（106.64）处。',
		workFunc: function(cb2){
			var go = ()=>{
				cga.walkList([
				[118, 137, '雪拉威森塔５３层'],
				[70, 105, '雪拉威森塔５２层'],
				[101, 64],
				], ()=>{
					cga.walkTeammateToPosition([
					[101, 64],
					[101, 65],
					], ()=>{
						cga.SayWords('跟NPC对话进入即可学习因果报应！', 0, 3, 1);
						setTimeout(()=>{
							cga.turnTo(102, 64);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, 0);
								cb2(true);
							});
						}, 1500);
					});
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.turnTo(102, 64);
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							retry();
							return;
						}
						cga.ClickNPCDialog(1, 0);
						cb2(true);
					});
				}
				
				cga.waitForLocation({mapname : '雪拉威森塔５２层', pos : [102, 64]}, retry);
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				go2();
			}
		}
	},
	],
	[//任务阶段是否完成
		function(){
			return (cga.getItemCount('红色蜡烛') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('藏宝图') >= 1) ? true : false;
		},
		function(){
			return false;
		},
	]
	);
	
	task.anyStepDone = false;

	task.doTask(()=>{
		console.log('ok');
	});
});