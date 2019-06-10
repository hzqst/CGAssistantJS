var cga = require('./cgaapi')(function(){
	console.log('学习因果报应 起始地点：艾尔莎岛')

	//initialize teammates array

	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name) ? true : false
	
	var waitStage = (cb2)=>{
		var teammate_state = [true];
		var teammate_ready = 1;
		var teamplayers = cga.getTeamPlayers();

		cga.waitTeammateSay((player, msg)=>{

			if(msg == '1' && teammate_state[player.index] !== true){
				teammate_state[player.index] = true;
				teammate_ready ++;
			}

			if(teammate_ready >= teamplayers.length){
				//all teammates are ready
				cb2(true);
				return false;
			}
			
			return true;
		});
	}

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
				[101, 65, null, null, null, true],
				[101, 64, null, null, null, true],
				[101, 65, null, null, null, true],
				[101, 64, null, null, null, true],
				], ()=>{
					cga.TurnTo(102, 64);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(4, 0);
								cga.AsyncWaitNPCDialog((dlg)=>{
									cga.SayWords('请选择“是”路线，完成请说“1”！', 0, 3, 1);
								});
							});
						});
					});
					
					waitStage(cb2);
				});
			}
			
			var go2 = ()=>{
				var name = cga.GetMapName();
				var pos = cga.GetMapXY();
				if(name == '雪拉威森塔５２层' && pos.x == 101 && (pos.y == 64 || pos.y == 65)){
					setTimeout(()=>{
						cga.TurnTo(102, 64);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog((dlg)=>{
									cga.ClickNPCDialog(4, 0);
									setTimeout(()=>{
										cga.SayWords('1', 0, 3, 1);
										cb2(true);
									}, 5000);
								});
							});
						});
					}, 3000);
					return;
				}
				
				setTimeout(go2, 1000);
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
				var name = cga.GetMapName();
				var pos = cga.GetMapXY();
				if(name == '艾尔莎岛' && (pos.x == 164 || pos.x == 165) && pos.y == 153){
					setTimeout(()=>{
						cga.TurnTo(165, 154);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(4, 0);
								setTimeout(wait3, 1500);
							});
						});
					}, 3000);					
					return;
				}
				
				setTimeout(wait2, 1000);
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
				[85, 45, null, null, null, true],
				[85, 44, null, null, null, true],
				[85, 45, null, null, null, true],
				[85, 44, null, null, null, true],
				], ()=>{
					cga.TurnTo(83, 44);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.SayWords('请拿取藏宝图，完成请说“1”！', 0, 3, 1);
					});
					
					waitStage(cb2);
				});
			}
			
			var go2 = ()=>{
				var name = cga.GetMapName();
				var pos = cga.GetMapXY();
				if(name == '雪拉威森塔５４层' && pos.x == 85 && (pos.y == 44 || pos.y == 45)){
					setTimeout(()=>{
						cga.TurnTo(83, 44);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(4, 0);
							setTimeout(()=>{
								cga.SayWords('1', 0, 3, 1);
								cb2(true);
							}, 5000);
						});
					}, 3000);
					return;
				}
				
				setTimeout(go2, 1000);
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
				[101, 65],
				[101, 64],
				[101, 65],
				[101, 64],
				], ()=>{
					cga.SayWords('跟NPC对话进入即可学习因果报应！', 0, 3, 1);
					cga.TurnTo(102, 64);
					cga.AsyncWaitNPCDialog((dlg)=>{
						if(dlg.message.indexOf('请到这边') >= 0){
							cga.ClickNPCDialog(1, 0);
							cb2(true);
						}
					});
				});
			}
			
			var go2 = ()=>{
				var name = cga.GetMapName();
				var pos = cga.GetMapXY();
				if(name == '雪拉威森塔５２层' && pos.x == 101 && (pos.y == 64 || pos.y == 65)){
					setTimeout(()=>{
						cga.TurnTo(102, 64);
						cga.AsyncWaitNPCDialog((dlg)=>{
							if(dlg.message.indexOf('请到这边') >= 0){
								cga.ClickNPCDialog(1, 0);
								cb2(true);
							}
						});
					}, 3000);
					return;
				}
				
				setTimeout(go2, 1000);
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