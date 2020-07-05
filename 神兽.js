var cga = require('./cgaapi')(function(){

	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false;

	exitPos = null;
	itemGot = false;

	var interrupt = require('./通用挂机脚本/公共模块/interrupt');

	var moveThinkInterrupt = new interrupt();
	var playerThinkInterrupt = new interrupt();
	var playerThinkRunning = false;

	var moveThink = (arg)=>{

		if(moveThinkInterrupt.hasInterrupt())
			return false;

		if(arg == 'freqMoveMapChanged')
		{
			playerThinkInterrupt.requestInterrupt();
			return false;
		}

		return true;
	}

	var playerThink = ()=>{

		if(!cga.isInNormalState())
			return true;
		
		var result = null;
		
		cga.cleanInventory(1, ()=>{
			
		});
		
		var hasItem = cga.getItemCount('地龙的麟片') > 0;
		
		if(hasItem) {
			cga.SayWords('1', 0, 3, 1);
		}
		
		if(itemGot)
			result = 'supply';
		
		if(cga.isTeamLeaderEx())
		{
			var interruptFromMoveThink = false;
			
			if(result == null && playerThinkInterrupt.hasInterrupt())
			{
				result = 'supply';
				interruptFromMoveThink = true;
			}
			
			if( result == 'supply' )
			{
				if(interruptFromMoveThink)
				{
					if(!itemGot && !hasItem)
						cga.SayWords('2', 0, 3, 1);
					
					return false;
				}
				else
				{
					moveThinkInterrupt.requestInterrupt(()=>{
						if(cga.isInNormalState()){
							if(!itemGot && !hasItem)
								cga.SayWords('2', 0, 3, 1);
							
							return true;
						}
						return false;
					});
					return false;
				}
			}
		}

		return true;
	}

	var playerThinkTimer = ()=>{
		if(playerThinkRunning){
			if(!playerThink()){
				console.log('playerThink off');
				playerThinkRunning = false;
			}
		}
		
		setTimeout(playerThinkTimer, 1500);
	}

	var task = cga.task.Task('挑战神兽 (战斗系二转)', [
	{//0
		intro: '1.前往杰诺瓦镇医院（44.33）2楼与神官比尔班（11.4）对话，获得【贝兹雷姆之钥】。',
		workFunc: function(cb2){
						
			var go = ()=>{
				cga.walkList([
				[14, 6, '村长的家'],
				[1, 10, '杰诺瓦镇'],
				[44, 33, '医院'],
				[15, 13, '医院2楼'],
				[11, 5],
				[12, 5],
				[11, 5],
				[12, 5],
				[11, 5],
				], ()=>{
					cga.TurnTo(11, 4);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.SayWords('拿贝兹雷姆之钥，完成请说“1”！', 0, 3, 1);
							setTimeout(()=>{
								cga.SayWords('1', 0, 3, 1);
							}, 1000);
						});
					});
				});
				
				cga.waitTeammateSayNextStage(teammates, cb2);
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.TurnTo(11, 4);
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							retry();
							return;
						}
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitNPCDialog(()=>{
							setTimeout(()=>{
								cga.SayWords('1', 0, 3, 1);
								cb2(true);
							}, 3000);
						});
					});
				}
				
				cga.waitForLocation({mapname : '医院2楼', pos : [11, 4]}, retry);
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
					cga.TurnTo(16, 4);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(err){
							cga.walkList([ [16, 5], [15, 5] ], retry);
							return;
						}
						cga.ClickNPCDialog(4, -1);
						setTimeout(wait3, 1500);
					});
				}
				
				cga.waitForLocation({mapname : '启程之间', pos : [16, 4], leaveteam : true}, retry);
			}
		
			var wait = ()=>{
				cga.WalkTo(6, 8);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						go();
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			if(cga.isTeamLeader){
				cga.travel.falan.toTeleRoom('杰诺瓦镇', wait);
			} else {
				wait2();
			}
		}
	},
	{//1
		intro: '2.出杰诺瓦镇西门，前往莎莲娜岛（135.333）处与神官杰拉娜对话，交出【贝兹雷姆之钥】传送至入口，通过黄色传送石（25.7）进入贝兹雷姆的迷宫。',
		workFunc: function(cb2){
			var wait = ()=>{
				cga.WalkTo(25, 19);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			var wait2 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait2, 1000);
				});
			}
			
			var go = ()=>{
				
				var name = cga.GetMapName();
				
				var list = [
				[135, 334],
				];

				if(name == '医院2楼'){
					list.unshift(
					[15, 11, '医院'],
					[1, 9, '杰诺瓦镇'],
					[24, 40, '莎莲娜'],
					);
				}
				
				cga.walkList(list, ()=>{
					cga.walkTeammateToPosition([
					[135, 334],
					[136, 334],
					], ()=>{
						cga.turnTo(135, 333);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'入口', delay:1000, timeout:5000}, wait);
						});
					});
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.turnTo(135, 333);
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							cga.walkList([ [136, 334], [135, 334] ], retry);
							return;
						}
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitMovement({map:'入口', delay:1000, timeout:5000}, wait2);
					});
				}
				cga.waitForLocation({mapname : '莎莲娜', pos : [135, 333], walkto : [135, 334], leaveteam : true}, retry);
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				go2();
			}
		}
	},
	{//2
		intro: '3.通过随机迷宫抵达静谧之间，持有【地龙的鳞片】与神官葛雷森（26.67）对话，选“是”交出【地龙的鳞片】并通过栅栏。',
		workFunc: function(cb2){
			//搜索迷宫入口
			var findObj = (cb3)=>{
				var objs = cga.getMapObjects();
				var pos = cga.GetMapXY();
				if(objs.length){
					for(var i in objs){						
						if(objs[i].mapy != 21){//25, 21
							cb3(objs[0]);
							return;
						}
					}
				}
				setTimeout(findObj, 1000, cb3);
			}
			
			//走迷宫
			var walkMaze = (cb3)=>{
				var map = cga.GetMapName();
				if(map == '静谧之间'){
					cb3();
					return;
				}
				if(map == '入口'){
					cb2('restart stage');
					return;
				}
				cga.walkRandomMaze('', (err)=>{
					walkMaze(cb3);
				});
			}
			
			//重组队
			var wait4 = ()=>{
				cga.WalkTo(26, 64);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait4, 1000);
				});
			}
			
			var wait5 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait5, 1000);
				});
			}
			
			//通过神官
			var goFuckBOSS = ()=>{
				playerThinkRunning = false;
				cga.walkList(
				cga.isTeamLeader ? 
				[
				[26, 68],
				[25, 68],
				[26, 68],
				[25, 68],
				[26, 68], 
				]
				:
				[
				[26, 68],
				], ()=>{
					cga.turnTo(26, 66);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(err || !dlg.message){
							cga.walkList([ [25, 68], [26, 68] ], retry);
							return;
						}
						if(dlg.message.indexOf('看看你的强弱') >= 0)
						{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitMovement({x:26, y:65, delay:1000, timeout:5000}, (cga.isTeamLeader) ? wait4 : wait5);
						}
						else
						{
							throw new Error('没有鳞片无法通过');
						}
					});
				});
			}
			
			//刷鳞片
			var goFuckDragon = ()=>{
				cga.walkList([
				[26, 72, ''],
				], ()=>{
					exitPos = cga.GetMapXY();
					var dir = cga.getRandomSpaceDir(exitPos.x, exitPos.y);
					
					setTimeout(()=>{
						cga.SayWords('开始打鳞片，打到鳞片或者已有鳞片请说“1”！', 0, 3, 1);
				
						playerThinkRunning = true;
						
						cga.waitTeammateSayNextStage(teammates, (r)=>{
							if(r === true){
								itemGot = true;
								setTimeout(()=>{
									cga.walkList([
									[exitPos.x, exitPos.y, '静谧之间'],
									], (err)=>{
										if(err == 4){
											cb2('restart stage');
											return;
										}
										if(cga.GetMapName() != '静谧之间'){
											cb2('restart stage');
											return;
										}
										goFuckBOSS();
									});
								}, 3000);
							} else {
								cb2('restart stage');
								return;
							}
						});
						
						cga.freqMove(dir);
					}, 1000);
				})
			}
	
			//检查全队鳞片数量
			var CheckItemForJMZJ = ()=>{
				cga.waitTeammateSayNextStage2(teammates, (r)=>{
					if(r === true){
						goFuckBOSS();
						return;
					}

					goFuckDragon();
				});

				cga.SayWords('已到达“静谧之间”，拥有鳞片请说“1”，没有鳞片请说“2”！', 0, 3, 1);
				setTimeout(()=>{
					cga.SayWords((cga.getItemCount('地龙的麟片') >= 1) ? '1' : '2', 0, 3, 1);
				}, 1500);
			}
	
			if(cga.isTeamLeader){
				
				var name = cga.GetMapName();
				var pos = cga.GetMapXY();
				if(name == '静谧之间'){
					CheckItemForJMZJ();
				}
				else
				{
					findObj((obj)=>{
						cga.walkList([
							[obj.mapx, obj.mapy, '贝兹雷姆的迷宫1楼']
						], ()=>{
							walkMaze(()=>{
								CheckItemForJMZJ();
							});
						});
					});
				}
				
			} else {
				cga.waitTeammateSay((player, msg)=>{
					if(player.index == 0 && msg.indexOf('鳞片请说')  >= 0){
						if(cga.getItemCount('地龙的麟片') > 0){
							cga.SayWords('1', 0, 3, 1);
						} else if(msg.indexOf('静谧之间') >= 0){
							cga.SayWords('2', 0, 3, 1);
							playerThinkRunning = true;
						}
						
						return true;
					}
					return true;
				});
				
				cga.waitForLocation({mapname : '静谧之间', pos : [26, 67], leaveteam : true, walkto : [26, 68]}, goFuckBOSS);
			}
		}
	},
	{
		intro: '4.与神兽史雷普尼尔（26.25）对话进入战斗。',
		workFunc: function(cb2){

			//队长与神兽对话，触发战斗
			if(cga.isTeamLeader){
				cga.walkList([
				[26, 26],
				], ()=>{
					cga.turnTo(26, 24);
				});
			}
			
			//等待地图切换到打完神兽的场景
			cga.waitForLocation({mapindex : 16512}, ()=>{
				cb2(true);
			});
		}
	},
	{
		intro: '6.由静谧之间（26.12）处进入咒缚之帐与邪灵鸟人（14.14）对话2次，任务完结。',
		workFunc: function(cb2){
			
			if(cga.isTeamLeader){
				cga.walkList([
				[26, 12, '咒缚之帐'],
				[14, 15],
				[15, 15],
				[14, 15],
				[15, 15],
				[14, 15],
				], ()=>{
					cga.turnTo(14, 14);		
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							setTimeout(cb2, 1500, true);
						});
					});
				});
			} else {
				var retry = ()=>{
					cga.turnTo(14, 14);		
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							retry();
							return;
						}
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							setTimeout(cb2, 1500, true);
						});
					});
				}
				
				cga.waitForLocation({mapname : '咒缚之帐', pos : [14, 14]}, retry);
			}
		}
	}
	],
	[//任务阶段是否完成
		function(){
			return (cga.GetMapName() == '医院2楼' && cga.getItemCount('贝兹雷姆之钥') >= 1) ? true : false;
		},
		function(){
			var mapname = cga.GetMapName();
			return ((mapname == '入口' || mapname == '静谧之间'|| mapname.indexOf('贝兹雷姆的迷宫') == 0) && cga.GetMapXY().y > 66 ) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '静谧之间' && cga.GetMapXY().y <= 65 ) ? true : false;
		},
		function(){
			return (cga.GetMapIndex().index3 == 16512) ? true : false;
		},
		function(){
			return false;
		},
	]
	);

	playerThinkTimer();
	cga.registerMoveThink(moveThink);
	task.doTask();
});