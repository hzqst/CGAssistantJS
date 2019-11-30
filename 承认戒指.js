var cga = require('./cgaapi')(function(){
	
	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false;

	var task = cga.task.Task('曙光1/承认之戒', [
	{//0
		intro: '1.前往法兰城里谢里雅堡2楼谒见之间与大祭司布鲁梅尔（5.3）对话，选“是”获得【信笺】。',
		workFunc: function(cb2){
						
			cga.travel.falan.toStone('C', (r)=>{
				cga.walkList([
				[41, 50, '里谢里雅堡 1楼'],
				[74, 19, '里谢里雅堡 2楼'],
				[49, 22, '谒见之间'],
				[5, 4],
				[6, 4],
				[5, 4],
				[6, 4],
				[5, 4],
				], (r)=>{
					cga.TurnTo(5, 2);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.SayWords('请拿取“信笺”，完成请说“1”！', 0, 3, 1)
							});
						});
					});
					
					cga.waitTeammateSayNextStage(teammates, ()=>{
						cga.walkList([
						[8, 19, '里谢里雅堡 2楼'],
						[49, 80, '里谢里雅堡 1楼'],
						[74, 40, '里谢里雅堡'],
						[41, 91],
						], (r)=>{
							cb2(true);
						});
					});
				});
			});
		}
	},
	{//1
		intro: '2.出法兰城东或南门，前往芙蕾雅岛（513.282）处，进入曙光骑士团营地。3.前往曙光营地指挥部（52.68）房间（69.69）与圣骑士法尔缇娅（95.7）对话，选“是”交出【信笺】获得【团长的证明】。',
		workFunc: function(cb2){
			cga.travel.falan.toStone('S', function(r){
				cga.walkList([
					[153, 241, '芙蕾雅'],
					[513,282, '曙光骑士团营地'],
					[52, 68, '曙光营地指挥部'],
					[69, 69, '曙光营地指挥部', 85, 2],
					[94, 6],
					[95, 6],
					[94, 6],
					[95, 6],
					[94, 6],
				], ()=>{
					cga.TurnTo(95, 7);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, 0);
						cga.SayWords('请换取团长的证明，完成请说“1”！', 0, 3, 1)
					});
					
					waitStage(cb2);
				});
			});
		}
	},
	{//2
		intro: '4.前往辛希亚探索指挥部（55.47），通过楼梯下楼抵达辛希亚探索指挥部。5.与教团骑士克罗米（40.22）对话，交出【团长的证明】并通过栅栏，通过黄色传送石（44.22）抵达废墟。',
		workFunc: function(cb2){
			cga.walkList([
			[85, 3, '曙光营地指挥部', 69, 70],
			[53, 79, '曙光骑士团营地'],
			[52, 55],
			[55, 47, '辛希亚探索指挥部'],
			[7,4, '辛希亚探索指挥部', 91, 6],
			[95,9, 27101],
			[39, 22],
			], ()=>{
				cga.TurnTo(41, 22);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					setTimeout(()=>{
						cga.walkList([
						[44, 22, '废墟地下1层']
						], ()=>{
							var walkMaze = (r)=>{
								if(cga.GetMapName() == '遗迹'){
									cb2(true);
									return;
								}
								if(r)
									cga.walkRandomMaze(null, walkMaze);
							}
							cga.walkRandomMaze(null, walkMaze);
						});
					}, 1000);
				});
			});
		}
	},
	{//3
		intro: '6.通过随机迷宫抵达遗迹，调查奇异的装置（14.14）进入战斗。',
		workFunc: function(cb2){
			
			var waitBOSS = ()=>{
				if(cga.isInBattle())
				{
					setTimeout(waitBOSS, 1000);
					return;
				}
				
				setTimeout(cb2, 1000, true);
			}
			
			cga.walkList([
			[13, 14]
			], ()=>{
				cga.TurnTo(14, 14);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					setTimeout(waitBOSS, 1500);
				});
			});
		}
	},
	{//4
		intro: '7.战斗胜利后随机获得【神之金】。与神秘人（14.14）对话，获得【怪物碎片】并传送回法兰城。',
		workFunc: function(cb2){
			
			cga.walkList([
			[13, 14]
			], ()=>{
				cga.TurnTo(14, 14);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, 0);
						setTimeout(cb2, 1500, true);
					});
				});
			});
		}
	},
	],
	[//任务阶段是否完成
		function(){
			return (cga.getItemCount('#720309') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('团长的证明') >= 1) ? true : false;
		},
		function(){
			return (cga.GetMapIndex().index3 == 44707) ? true : false;
		},
		function(){
			return (cga.GetMapIndex().index3 == 44708) ? true : false;
		},
		function(){
			return (cga.getItemCount('怪物碎片') >= 1) ? true : false;
		},
	]
	);
	
	task.anyStepDone = false;

	task.doTask(()=>{
		console.log('ok');
	});
});