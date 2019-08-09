var cga = require('./cgaapi')(function(){
	console.log('神兽 起始地点：艾尔莎岛')

	//initialize teammates array

	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name) ? true : false
	cga.callItemGot = false;
	cga.AllItemGot = false;
	cga.exitPos = null;
		
	var waitStage = (cb2)=>{
		var teammate_state = [];
		var teammate_ready = 0;

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
	
	var waitStageEx = (cb2)=>{
		var teammate_state = [];
		var teammate_ready = 0;
		var teammate_notready = 0;

		cga.waitTeammateSay((player, msg)=>{

			if(teammate_state[player.index] !== true && teammate_state[player.index] !== false){
				if(msg == '1'){
					teammate_state[player.index] = true;
					teammate_ready ++;
				} else if(msg == '2'){
					teammate_state[player.index] = false;
					teammate_notready ++;
				}
			}

			if(teammate_ready >= teamplayers.length){
				//all teammates are ready
				cb2(true);
				return false;
			}
			
			if(teammate_ready + teammate_notready >= teamplayers.length){
				//some teammates are not ready
				cb2(false);
				return false;
			}
			
			return true;
		});
	}

	var task = cga.task.Task('挑战神兽', [
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
				
				waitStage(cb2);
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.TurnTo(11, 4);
					cga.AsyncWaitNPCDialog((dlg)=>{
						if(dlg instanceof TypeError){
							retry();
							return;
						}
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							setTimeout(()=>{
								cga.SayWords('1', 0, 3, 1);
								cb2(true);
							}, 5000);
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
					cga.AsyncWaitNPCDialog(function(dlg){
						if(dlg instanceof TypeError){
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
				[136, 334, null, null, null, true],
				[135, 334, null, null, null, true],
				[136, 334, null, null, null, true],
				[135, 334, null, null, null, true],
				];

				if(name == '医院2楼')
					list.unshift(
					[15, 11, '医院'],
					[1, 9, '杰诺瓦镇'],
					[24, 40, '莎莲娜'],
					);

				cga.walkList(list, ()=>{
					cga.TurnTo(135, 333);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(1, 0);
						setTimeout(wait, 1500);
					});
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.TurnTo(135, 333);
					cga.AsyncWaitNPCDialog((dlg)=>{
						if(dlg instanceof TypeError){
							cga.walkList([ [136, 334], [135, 334] ], retry);
							return;
						}
						cga.ClickNPCDialog(1, 0);
						setTimeout(wait2, 1500);
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
			
			var goFuckBOSS = ()=>{
				cga.walkList(
				(cga.isTeamLeader) ?
				[
				[26, 68],
				[27, 68],
				[26, 68],
				[27, 68],
				[26, 68],
				]
				: 
				[
				[26, 68],
				], ()=>{
					cga.TurnTo(26, 67);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						setTimeout((cga.isTeamLeader) ? wait4 : wait5, 1500);
					});
				});
			}
			
			var goFuckDragonBattle = ()=>{
				
				cga.SayWords('开始打鳞片，打到鳞片或者已有鳞片请说“1”！', 0, 3, 1);
				
				waitStage(()=>{
					cga.allItemGot = true;
					setTimeout(()=>{
						cga.walkList([
						[cga.exitPos.x, cga.exitPos.y, '静谧之间'],
						], (err)=>{
							if(err == 4){
								cb2('restart stage');
								return;
							}
							goFuckBOSS();
						});
					}, 5000);
				});
								
				cga.freqMove(0, function(){
					
					if(cga.isInBattle())
						return true;

					if(cga.GetMapName() == '入口')
					{
						cb2('restart stage');
						return;
					}
					
					if( cga.getItemCount('地龙的麟片') > 0 && cga.callItemGot == false ){
						cga.SayWords('1', 0, 3, 1);
						cga.callItemGot = true;
					}
					
					if(cga.allItemGot)
						return true;
					
					return true;
				});
			}
			
			var goFuckDragon = ()=>{
				cga.walkList([
				[26, 72, ''],
				], ()=>{
					cga.exitPos = cga.GetMapXY();
					var randomSpace = cga.getRandomSpace(cga.exitPos.x, cga.exitPos.y);
					cga.WalkTo(randomSpace[0], randomSpace[1]);
					setTimeout(goFuckDragonBattle, 1000, true);
				})
			}
	
			var goJMZJ = ()=>{
				waitStageEx((r)=>{
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
	
			var go = ()=>{
				var name = cga.GetMapName();
				var pos = cga.GetMapXY();
				if(name == '静谧之间'){
					goJMZJ();
				}
				else
				{
					findObj((obj)=>{
						cga.walkList([
							[obj.mapx, obj.mapy, '贝兹雷姆的迷宫1楼']
						], ()=>{
							walkMaze(()=>{
								goJMZJ();
							});
						});
					});
				}
			}
			
			var go2 = ()=>{
				var name = cga.GetMapName();
				var pos = cga.GetMapXY();
				var teamplayersnow = cga.getTeamPlayers();
								
				if ( name == '静谧之间' && (pos.x >= 26 && pos.x <= 27) && (pos.y >= 68 && pos.y <= 68) && !teamplayersnow.length){
					goFuckBOSS();
					return;
				}
				
				if( name != '静谧之间' && cga.getItemCount('地龙的麟片') > 0 && cga.callItemGot == false ){
					cga.SayWords('1', 0, 3, 1);
					cga.callItemGot = true;
					return false;
				}
				
				setTimeout(go2, 3000);
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitTeammateSay((player, msg)=>{
					if(player.index == 0 && msg.indexOf('已到达')  >= 0){
						if(cga.getItemCount('地龙的麟片') >= 1){
							cga.SayWords('1', 0, 3, 1);
						} else {
							cga.SayWords('2', 0, 3, 1);
						}
						
						setTimeout(go2, 3000);
						return false;
					}
					return true;
				});
			}
		}
	},
	{
		intro: '4.与神兽史雷普尼尔（26.25）对话进入战斗。',
		workFunc: function(cb2){
			var waitBOSS = ()=>{
				if(cga.isInBattle())
				{
					setTimeout(waitBOSS, 1000);
					return;
				}
								
				setTimeout(cb2, 1000, true);
			}
			
			var fuckBOSS = ()=>{
				if(cga.isTeamLeader){
					cga.walkList([
					[26, 26],
					], ()=>{
						cga.TurnTo(26, 24);
						setTimeout(waitBOSS, 1500);
					});
				} else {
					if(cga.isInBattle())
					{
						setTimeout(waitBOSS, 1000);
						return;
					}
					setTimeout(fuckBOSS, 1500);
				}
			}
			
			fuckBOSS();
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
					cga.TurnTo(14, 14);		
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							setTimeout(cb2, 1500, true);
						});
					});
				});
			} else {
				var retry = ()=>{
					cga.TurnTo(14, 14);		
					cga.AsyncWaitNPCDialog((dlg)=>{
						if(dlg instanceof TypeError){
							retry();
							return;
						}
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
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

	task.doTask(()=>{
		console.log('ok');
	});
});