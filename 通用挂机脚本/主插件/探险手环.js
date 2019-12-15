var Async = require('async');
var teamMode = require('./../公共模块/组队模式');

var cga = global.cga;
var configTable = global.configTable;

var task = cga.task.Task('探险专家(贝爷)', [
	{//0
		intro: '1.前往法兰城里谢里雅堡与贝尔（53.22）对话，获得【证明信】。',
		workFunc: function(cb2){
			cga.travel.falan.toStone('C', ()=>{
				cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
				cga.walkList([
				[53, 23],
				], ()=>{
					cga.cleanInventory(1, ()=>{
						cga.TurnTo(53, 21);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(4, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(1, 0);
									setTimeout(cb2, 1500, true);
								});
							});
						});
					});					
				});
			});
		}
	},
	{//1
		intro: '2.前往莎莲娜岛西方洞窟与贝尔的助手（13.10）对话，交出【证明信】进入隐秘的山道。',
		workFunc: function(cb2){
			
			if(cga.needSupplyInitial()){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cb2('restart stage');
					}, 3000);
				});
				return;
			}
			
			cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
				cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[258, 180, '莎莲娜西方洞窟'],
				[30, 44, 14001],
				[14, 68, 14000],
				[13, 11],
				], ()=>{
					cga.TurnTo(13, 9);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'隐秘山道上层', delay:1000, timeout:5000}, ()=>{
								cb2(true);
							});
						});
					});
				});
			});
		}
	},
	{//2
		intro: '3.通过随机迷宫抵达山道尽头，调查军刀（13.6）获得【贝尔的军刀】并传送出迷宫。',
		workFunc: function(cb2){
			var findObj = (cb3)=>{
				var objs = cga.getMapObjects();
				var pos = cga.GetMapXY();
				if(objs.length){
					for(var i in objs){
						if(objs[i].mapx != pos.x || objs[i].mapy != pos.y){
							cb3(objs[0]);
							return;
						}
					}
				}
				setTimeout(findObj, 1000, cb3);
			}
			
			var walkMaze = (cb3)=>{
				var map = cga.GetMapName();
				if(map == '隐秘山道中层' || map == '隐秘山道下层' || map == '山道尽头'){
					cb3();
					return;
				}
				var target = null;
				if(map == '隐秘山道上层B7')
					target = '隐秘山道中层';
				else if(map == '隐秘山道中层B7')
					target = '隐秘山道下层';
				else if(map == '隐秘山道下层B7')
					target = '山道尽头';
				cga.walkRandomMaze(target, (err)=>{
					if(err == 4){
						//非预期的地图切换,重启脚本
						cb2('restart task');
						return;
					}
					
					walkMaze(cb3);
				});
			}
			
			findObj((obj)=>{
				cga.walkList([
					[obj.mapx, obj.mapy, '隐秘山道上层B1']
				], ()=>{
					walkMaze(()=>{
						findObj((obj)=>{
							cga.walkList([
								[obj.mapx, obj.mapy, '隐秘山道中层B1']
							], ()=>{
								walkMaze(()=>{
									findObj((obj)=>{
										cga.walkList([
											[obj.mapx, obj.mapy, '隐秘山道下层B1']
										], ()=>{
											walkMaze(()=>{
												cga.walkList([
												[13, 6],
												], ()=>{
													cga.turnTo(13, 5);
													cga.AsyncWaitNPCDialog(()=>{
														cga.ClickNPCDialog(4, 0);
														setTimeout(cb2, 1500, true);
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
	},
	{//3
		intro: '4.返回法兰城里谢里雅堡与贝尔（53.22）对话，交出【贝尔的军刀】并传送至贝尔的隐居地。',
		workFunc: function(cb2){

			if(cga.needSupplyInitial()){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cb2('restart stage');
					}, 3000);
				});
				return;
			}
			
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
				[53, 23],
				], ()=>{
					cga.turnTo(53, 22);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'贝尔的隐居地', delay:1000, timeout:5000}, ()=>{
								cb2(true);
							});
						});
					});
				});
			});
		}
	},
	{//4
		intro: '5.与饥饿的贝尔对话，进入战斗。',
		workFunc: function(cb2){
			
			var fuckBeiYe = ()=>{
				if(cga.isTeamLeader){
					cga.walkList([
						[20, 18],
					], ()=>{
						cga.TurnTo(20, 16);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
						});
					});
				}
				
				cga.waitForLocation({
					mapindex: 57200
				}, ()=>{
					cb2(true);
				});
			}
			
			//重新组队
			var wait = ()=>{

				if(cga.isTeamLeader)
				{
					cga.walkList([
					[23, 23]
					], ()=>{
						teamMode.wait_for_teammates(fuckBeiYe);
					});
				}
				else
				{
					teamMode.wait_for_teammates(fuckBeiYe);
				}
			}
			
			wait();
		}
	},
	{//5
		intro: '6.战斗胜利后与饥饿的贝尔对话，获得【签名】并传送出贝尔的隐居地。',
		workFunc: function(cb2){
			cga.TurnTo(20, 16);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(32, 0);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, 0);
						setTimeout(cb2, 1000, true);
					});
				});
			});
		}
	},
	],
	[//任务阶段是否完成
		function(){//证明信
			return (cga.getItemCount('#491723') >= 1) ? true : false;
		},
		function(){
			return cga.GetMapName() == '隐秘山道上层';
		},
		function(){
			return (cga.getItemCount('贝尔的军刀') >= 1) ? true : false;
		},
		function(){
			return cga.GetMapName() == '贝尔的隐居地' && cga.GetMapIndex().index3 == 57199;
		},
		function(){
			return cga.GetMapName() == '贝尔的隐居地' && cga.GetMapIndex().index3 == 57200;
		},
		function(){
			return false;
		},
	]
);

var loop = ()=>{	
	callSubPluginsAsync('prepare', ()=>{
		task.doTask(loop);
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		var map = cga.GetMapName();

		if(map.indexOf('隐秘山道') >= 0)
			return 2;
		
		return 0;
	},
	translate : (pair)=>{
	
		if(teamMode.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{

		if(!teamMode.loadconfig(obj))
			return false;

		return true;
	},
	inputcb : (cb)=>{
		Async.series([teamMode.inputcb], cb);
	},
	execute : ()=>{
		callSubPlugins('init');
		loop();
	},
}

module.exports = thisobj;