require('./common').then(async (cga)=>{
	var teamLeader = '此处填写队长名称';
	var teamPlayerCount = 4;

	var doctorName = '医道之殇';
    var crystalName = '水火的水晶（5：5）';
	var playerinfo = cga.GetPlayerInfo();
	var playerName = playerinfo.name;
	var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }
    var teamplayers = cga.getTeamPlayers();
    if(isTeamLeader){
    	if(teamplayers.length!=teamPlayerCount){
    		await leo.waitAfterBattle()
    		await leo.logBack()
    		await leo.checkHealth(doctorName)
        	await leo.checkCrystal(crystalName)
        	await leo.goto(n=>n.elsa.x)
        	await leo.autoWalk([150, 94])
        	await leo.buildTeamBlock(teamPlayerCount)
    	}
    }else{
    	if(!leo.isInTeam()){
    		await leo.waitAfterBattle()
    		await leo.logBack()
    		await leo.checkHealth(doctorName)
        	await leo.checkCrystal(crystalName)
        	await leo.goto(n=>n.elsa.x)
        	await leo.autoWalk([150, 95])
        	await leo.enterTeamBlock(teamLeader)
    	}
    }
	
	var teammates = [];
	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false;
	
	var task = cga.task.Task('树精长老的末日', [
	{//0
		intro: '1.前往维诺亚村医院（61.53）与佣兵艾里克（7.5）对话，选“是”获得【火把】。',
		workFunc: function(cb2){
						
			var go_1 = ()=>{
				cga.cleanInventory(1, ()=>{
					cga.TurnTo(7, 5);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.SayWords('拿火把，完成请加队然后说“1”！', 0, 3, 1);
							setTimeout(()=>{
								cga.SayWords('1', 0, 3, 1);						
							}, 1500);
						});
					});
				});
			}
						
			var go = ()=>{
				cga.walkList([
				[5, 1, '村长家的小房间'],
				[0, 5, '村长的家'],
				[10, 16, '维诺亚村'],
				[61, 53, '医院'],
				[6, 5],
				[5, 5],
				[6, 5],
				[5, 5],
				[6, 5],
				], ()=>{
					
					setTimeout(()=>{
						cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						setTimeout(go_1, 1500);
					}, 1500);
					
					cga.waitTeammateSayNextStage(teammates, cb2);
				});
			}
			
			var wait4 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						cga.SayWords('1', 0, 3, 1);
						cb2(true);
						return;
					}
					setTimeout(wait4, 1000);
				});
			}
			
			var go2 = ()=>{

				var retry = ()=>{
					cga.cleanInventory(1, ()=>{
						cga.TurnTo(7, 5);
						cga.AsyncWaitNPCDialog((err)=>{
							if(err){
								retry();
								return;
							}
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, 0);
								setTimeout(()=>{
									cga.WalkTo(5, 5);
									setTimeout(wait4, 1000);
								}, 1000);
							});
						});
					});
				}

				cga.waitForLocation({mapname : '医院', walkto:[6, 5], pos: [7, 5], leaveteam : true}, retry);
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
					
			var wait = ()=>{
				cga.WalkTo(4, 5);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						go();
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			if(cga.isTeamLeader){
				cga.travel.falan.toTeleRoom('维诺亚村', wait);
			} else {
				var retry = ()=>{
					cga.TurnTo(8, 22);
					cga.AsyncWaitNPCDialog(function(err){
						if(err){
							cga.walkList([ [9, 23], [9, 22] ], retry);
							return;
						}
						cga.ClickNPCDialog(4, -1);
						setTimeout(wait3, 3000);
					});
				}
				
				cga.waitForLocation({mapname : '启程之间', pos : [8, 22], leaveteam : true}, retry);
			}
		}
	},
	{//1
		intro: '2.出维诺亚村向北行走至芙蕾雅岛（380.353）处，进入布满青苔的洞窟。3.通过随机迷宫抵达叹息之森林，与树精长老（29.13）对话，交出【火把】进入战斗。',
		workFunc: function(cb2){
			
			var fuckBOSS = ()=>{
				if(cga.isTeamLeader){
					cga.walkList([
					[29, 14],
					], ()=>{
						cga.turnTo(29, 13);
					});
				}
				
				cga.waitForLocation({mapname : '叹息森林'}, ()=>{
					cb2(true);
				});
			}
			
			var walkMaze = (cb3)=>{
				var map = cga.GetMapName();
				if(map == '叹息之森林'){
					cb3();
					return;
				}
				if(map == '芙蕾雅'){
					cb2('restart stage');
					return;
				}
				cga.walkRandomMaze(null, (err)=>{
					walkMaze(cb3);
				});
			}
			
			var go = ()=>{
				cga.walkList(
				(cga.GetMapName() == '芙蕾雅') ? 
				[
				[380, 353, '布满青苔的洞窟1楼'],
				]
				:
				[
				[2, 9, '维诺亚村'],
				[67, 47, '芙蕾雅'],
				[380, 353, '布满青苔的洞窟1楼'],
				]
				, ()=>{
					walkMaze(fuckBOSS);
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForLocation({mapname : '叹息之森林'}, fuckBOSS);
			}
		}
	},
	{//2
		intro: '4.战斗胜利后传送至叹息森林，队伍中随机1人获得【艾里克的大剑】。5.与年轻树精（26.12）对话，获得【树苗？】。',
		workFunc: function(cb2){
			var go = ()=>{
				cga.walkList([
				[27, 13],
				[26, 13],
				[27, 13],
				[26, 13],
				[27, 13],
				], ()=>{
					var sword = cga.findItem('艾里克的大剑');

					if(sword != -1){
						cga.DropItem(sword);
					}
					
					setTimeout(()=>{
						cga.cleanInventory(1, ()=>{
							cga.turnTo(26, 12);
							cga.AsyncWaitNPCDialog(()=>{
								cga.SayWords('拿到树苗后前往法兰城凯蒂夫人的店，鉴定树苗并将其交给维诺亚村村长的家“村长卡丹”，即可完成任务！', 0, 3, 1);
								setTimeout(cb2, 1000, true);
							});
						});
					}, 1000);					
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					var sword = cga.findItem('艾里克的大剑');

					if(sword != -1){
						cga.DropItem(sword);
					}
					
					setTimeout(()=>{
						cga.cleanInventory(1, ()=>{
							cga.turnTo(26, 12);
							cga.AsyncWaitNPCDialog((err)=>{
								if(err){
									cga.walkList([ [26, 13], [27, 13] ], retry);
									return;
								}
								if(cga.findItem('树苗？') == -1){
									setTimeout(retry, 1000);
								}
								setTimeout(cb2, 1000, true);
							});
						});
					}, 1000);
				}
				
				cga.waitForLocation({mapname : '叹息森林', pos:[26, 12], walkto : [26, 13], leaveteam : true}, retry);
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				go2();
			}
		}
	},
	{//3
		intro: '6.前往法兰城凯蒂夫人的店（196.78）与凯蒂夫人（15.12）对话，交出30G将【树苗？】鉴定为【生命之花】。',
		workFunc: function(cb2){
			cga.travel.falan.toKatieStore(()=>{
				cga.walkList([
					[15, 12],
				], ()=>{
						var itemArray = cga.findItemArray('树苗？');
						cga.turnTo(16, 12);
						cga.AsyncWaitNPCDialog(()=>{
							cga.SellNPCStore(itemArray);
							cga.AsyncWaitNPCDialog(()=>{
								cb2(true);
							});
						});
				});
			});
		}
	},
	{//4
		intro: '7.前往维诺亚村村长的家（40.36）与村长卡丹（16.7）对话，选“是”交出【生命之花】获得晋阶资格，任务完结。',
		workFunc: function(cb2){
			cga.travel.falan.toTeleRoom('维诺亚村', ()=>{
				cga.walkList([
				[5, 1, '村长家的小房间'],
				[0, 5, '村长的家'],
				[15, 8],
				], ()=>{
					cga.turnTo(16, 7);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cb2(true);
						});
					});
				});				
			});
		}
	},
	],
	[//任务阶段是否完成
		function(){
			return (cga.getItemCount('火把') >= 1) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '叹息之森林') ? true : false;
		},
		function(){
			return (cga.getItemCount('树苗？') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('生命之花') >= 1) ? true : false;
		},
		function(){
			return false;
		},
	]
	);
	
	task.doTask();
});