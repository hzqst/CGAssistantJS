var cga = require('.././cgaapi')(function(){
	//输入‘0’从头（朵拉）开始任务，
	//输入‘1’从打长老证之前开始任务，
	//输入‘3’从荷普特开始任务，
	//输入‘4’从祭坛守卫开始任务，
	//输入‘5’从打完BOSS换保证书开始任务（必须有文言抄本）
	var taskIndex = 0;
	//队长名字，必须填写正确
	var teamLeader = "队长名称";
	//var teamLeader = "绿裳之殇";
	//队伍人数
	var teamPlayerCount = 1;
	//BOSS是否登出
	var isBossLogBack = true;
	//队伍集合点0~3
	var meetingPoint = 0; 
	var meetingPoints1 = [[150, 90],[152, 90],[154, 90],[156, 90]];
	var meetingPoints2 = [[150, 91],[152, 91],[154, 91],[156, 91]];
	var teammates = [];

	if(teamPlayerCount<=1||teamPlayerCount>5){
		teamPlayerCount = 0;
	}

	if(meetingPoint<0||meetingPoint>3){
		meetingPoint = 0;
	}
	
	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true);	//开启队聊
	cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);	//开启组队
	cga.EnableFlags(cga.ENABLE_FLAG_CARD, false);		//关闭名片
	cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);		//关闭交易

	var playerinfo = cga.GetPlayerInfo();
	var playerName = playerinfo.name;
	cga.isTeamLeader = false;
	
	var callZLZZ = false;
	var doneBOSS = false;
	
	cga.waitTeammateSay((player, msg)=>{

		if(msg.indexOf('长老之证x7 GET') >= 0 ){
			callZLZZ = true;
		}

		return true;
	});
	
	var walkMazeForward = (cb)=>{
		cga.walkRandomMaze(null, (err)=>{
			console.log(err);
			cb(err);
		}, {
			layerNameFilter : (layerIndex)=>{
				return '海底墓场外苑第'+(layerIndex + 1)+'地带';
			},
			entryTileFilter : (e)=>{
				return e.colraw == 0x462F;
			}
		});
	}
	
	var walkMazeBack = (cb)=>{
		var map = cga.GetMapName();
		if(map == '？？？'){
			cb(null);
			return;
		}
		cga.walkRandomMaze(null, (err)=>{
			console.log(err);
			cb(err);
		}, {
			layerNameFilter : (layerIndex)=>{
				return layerIndex > 1 ? '海底墓场外苑第'+(layerIndex - 1)+'地带': '？？？';
			},
			entryTileFilter : (e)=>{
				return e.colraw == 0x462E || e.colraw == 0;
			}
		});
	}
	
	var goodToGoZLZZ = (cb)=>{
		
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
				
		var battleAgain = ()=>{

			if(cga.isInBattle()){
				setTimeout(battleAgain, 5000);
				return;
			}
			console.log('长老证数量：'+cga.getItemCount('长老之证'));
			if(cga.getItemCount('长老之证') >= 7){
				cga.SayWords('长老之证x7 GET', 0, 3, 1);
				cb(true);
				return;
			}
			if(callZLZZ){
				cb(true);
				return;
			}
			
			if(cga.isTeamLeader)
				cga.ClickNPCDialog(1, 1);
			
			setTimeout(battleAgain, 5000);
		};
		
		var retryNpc = (result)=>{
			cga.TurnTo(result.xpos, result.ypos);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				if(dlg && dlg.message && (dlg.message.indexOf('已死的主人') >= 0 || dlg.message.indexOf('呼呼呼呼呼') >= 0 || dlg.message.indexOf('嘻嘻嘻嘻嘻嘻') >= 0)){
					setTimeout(battleAgain, 1000);
				}
				else
				{
					setTimeout(retryNpc, 5000, result);
				}
			});
		}

		var search = ()=>{
			var blackList = [];
			cga.searchMap((units) => {
				return units.find(u => u.unit_name == '守墓员' && u.type == 1 && u.model_id != 0) || cga.GetMapName() == '？？？'
			}, (err, result) => {
				
				if(cga.GetMapName() == '？？？'){
					goodToGoZLZZ(cb);
					return;
				}
				
				if(result && result.unit_name == '守墓员'){
					retryNpc(result);
				} else {
					walkMazeForward(search);
				}
			});
		}

		if(cga.isTeamLeader){
			findObj((obj)=>{
				cga.walkList([
					[obj.mapx, obj.mapy, '海底墓场外苑第1地带']
				], search);
			});
		} else {
			setTimeout(battleAgain, 5000);
		}
	}

	var zhanglaozhizheng = (cb)=>{
		if(cga.isTeamLeader){
			cga.WalkTo(132, 62);
			cga.waitTeammates(teammates, (r)=>{
				if(r){
					goodToGoZLZZ(cb);
					return;
				}
				setTimeout(zhanglaozhizheng, 1000, cb);
			});
		} else {
			cga.addTeammate(teammates[0], (r)=>{
				if(r){
					goodToGoZLZZ(cb);
					return;
				}
				setTimeout(zhanglaozhizheng, 1000, cb);
			});
		}
	}
	
	var goodToGoZDZ = (cb)=>{
		
		var findZDZ_D = ()=>{
			cga.walkList([
				[193, 184],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 192, 184)){
					cga.turnTo(192, 184);
					return;
				}
				//cga.SayWords('没有发现障碍物', 0, 3, 1);
				goodToGoZDZ(cb);
				return;
			});
		}
		
		var findZDZ_C = ()=>{
			cga.walkList([
				[213, 225],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 213, 226)){
					cga.turnTo(213, 226);
					return;
				}
				findZDZ_D();
				return;
			});
		}
		
		var findZDZ_BC = ()=>{
			cga.walkList([
				[228, 206],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 228, 207)){
					cga.turnTo(228, 207);
					return;
				}
				findZDZ_C();
				return;
			});
		}

		var findZDZ_B = ()=>{
			cga.walkList([
				[234, 202],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 235, 202)){
					cga.turnTo(235, 202);
					return;
				}
				findZDZ_BC();
				return;
			});
		}
		
		var findZDZ_A = ()=>{
			cga.walkList([
				[229, 177],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 230, 177)){
					cga.turnTo(230, 177);
					return;
				}
				findZDZ_B();
				return;
			});
		}
		
		if(cga.isTeamLeader)
		{
			setTimeout(findZDZ_A, 1000);
		}
		
		var battleAgain = ()=>{

			if(cga.isInBattle()){
				setTimeout(battleAgain, 1500);
				return;
			}
			
			var pos = cga.GetMapXY();
			if(pos.x == 163 && pos.y == 100){
				cb(true);
				return;
			}
			
			setTimeout(battleAgain, 1500);
		};

		setTimeout(battleAgain, 1500);
	}
	
	var zudangzhe = (cb)=>{
		var playerinfo = cga.GetPlayerInfo();
			
		var teamplayers = cga.getTeamPlayers();

		if(cga.isTeamLeader){
			cga.waitTeammates(teammates, (r)=>{
				if(r){
					goodToGoZDZ(cb);
					return;
				}
				setTimeout(zudangzhe, 1000, cb);
			});
		} else {
			cga.addTeammate(teammates[0], (r)=>{
				if(r){
					goodToGoZDZ(cb);
					return;
				}
				setTimeout(zudangzhe, 1000, cb);
			});
		}
	}
	
	var task = cga.task.Task('琥珀之卵4', [
	{//0
		intro: '◆在艾夏岛冒险者旅馆(102.115)内与时空之人(30.20)对话，输入“朵拉”选“是”，再选“确定”可重置本任务',
		workFunc: function(cb2){
			cga.travel.newisland.toPUB(()=>{
				cga.walkList([
				[31, 21],
				], ()=>{
					cga.TurnTo(30, 20);
					cga.AsyncWaitNPCDialog(()=>{
						cga.SayWords('朵拉', 0, 3, 1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, 0);
								setTimeout(()=>{
									cb2(true);
								}, 1500);
							});
						});
					});
				});
			});
		}
	},
	{//1
		intro: '1.黄昏或夜晚前往艾尔莎岛神殿·伽蓝（200.96）三楼神殿·里侧大厅，至（48.60）处进入约尔克神庙。调查(39.21)处，获得【琥珀之卵】。',
		workFunc: function(cb2){
			
			if(cga.getItemCount('琥珀之卵') > 0){
				cb2(true);
				return;
			}
			
			var retry = ()=>{
				cga.cleanInventory(1, ()=>{
					cga.turnTo(39, 21);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(!(dlg && dlg.message.indexOf('感觉脑海中有什么声响') >= 0)){
							setTimeout(retry, 5000);
							return;
						}
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(32, 0);
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
								});
							});
						});
					});
				});				
			}
			
			cga.travel.newisland.toStone('X', ()=>{
				cga.walkList([
				[201, 96, '神殿　伽蓝'],
				[95, 104, '神殿　前廊'],
				[44, 41, '神殿　里侧大厅'],
				[34, 34, 59535],
				[48, 60, '约尔克神庙'],
				[39, 22],
				], ()=>{
					retry();
				});
			});
		}
	},
	{//2
		intro: '2.前往盖雷布伦森林路路耶博士的家(244.76)，进入后再离开路路耶博士的家并传送至？？？。' + "\n" + '3.通过(142.69)或(122.69)处黄色传送石进入海底墓场外苑，寻找随机出现的守墓者并与之对话进入战斗。',
		workFunc: function(cb2){
			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cb2('restart stage');
					}, 3000);
				});
				return;
			}
			
			cga.travel.newisland.toStone('X', ()=>{
				cga.walkList([
				[130, 50, '盖雷布伦森林'],
				[246, 76, '路路耶博士的家'],
				], ()=>{
					cga.WalkTo(3, 10);
					cga.AsyncWaitMovement({map:['？？？'], delay:1000, timeout:10000}, ()=>{
						zhanglaozhizheng(cb2);
					});
				});
			});
		}
	},
	{//3
		intro: '5.集齐7个【长老之证】后返回？？？，由持有7个【长老之证】的队员与荷特普(167.102)对话2次，选“是”交出【长老之证】并传送至盖雷布伦森林。',
		workFunc: function(cb2){

			var sayshit = ()=>{
				cga.waitForLocation({mapname : '盖雷布伦森林'}, ()=>{
					setTimeout(()=>{
						cb2(true);
					}, 2000);
				});

				// if(cga.getItemCount('长老之证') >= 7){
				// 	console.log('sayshit1');
				// 	cga.TurnTo(131, 60);
				// 	cga.AsyncWaitNPCDialog(()=>{
				// 		cga.ClickNPCDialog(32, 0);
				// 		cga.AsyncWaitNPCDialog(()=>{
				// 			cga.ClickNPCDialog(4, 0);
				// 			cga.AsyncWaitNPCDialog(()=>{
				// 				cga.ClickNPCDialog(1, 0);
				// 				cga.waitForLocation({map : '盖雷布伦森林'}, ()=>{
				// 					setTimeout(()=>{
				// 						cb2(true);
				// 					}, 2000);
				// 				});
				// 			});
				// 		});
				// 	});
				// } else {
				// 	console.log('sayshit2');
				// 	cga.waitForLocation({mapname : '盖雷布伦森林'}, ()=>{
				// 		setTimeout(()=>{
				// 			cb2(true);
				// 		}, 2000);
				// 	});
				// }	
			}
			
			if(cga.isTeamLeader){
				var walkShit = ()=>{
					if(cga.GetMapName() == '？？？')
					{
						cga.walkList([
						[131, 61],
						[130, 61],
						[131, 61],
						[130, 61],
						[131, 61],
						], (r)=>{
							sayshit();
						});
						return;
					}
					walkMazeBack(walkShit);
				}
				walkMazeBack(walkShit);				
				return;
			}
			else
			{
				cga.waitForLocation({mapname : '？？？', pos:[131, 60]}, sayshit);
				return;
			}
		}
	},
	{//4
		intro: '6.黄昏或夜晚时至神殿·伽蓝与荷特普(92.138)对话。',
		workFunc: function(cb2){
			cga.travel.newisland.toStone('X', ()=>{
				cga.walkList([
					[201, 96, '神殿　伽蓝'],
					[91, 138],
				], (r)=>{
					cga.task.waitForNPC('荷特普', ()=>{
						cga.turnTo(92, 138);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, -1);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(32, -1);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(1, -1);
										setTimeout(()=>{
											cb2(true);
										}, 1000);
									});
								});
							});
						});
					});
				});
			});
		}
	},
	{//5
		intro: '前往艾夏岛冒险者旅馆(102.115)与安洁可(55.32)对话，获得【逆十字】。',
		workFunc: function(cb2){
			
			if(cga.getItemCount('逆十字') > 0){
				cb2(true);
				return;
			}
			
			cga.travel.newisland.toPUB(()=>{
				cga.walkList([
					[56, 32],
				], (r)=>{
					cga.cleanInventory(1, ()=>{
						cga.turnTo(56, 31);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, -1);
								setTimeout(()=>{
									cb2(true);
								}, 1000);
							});
						});
					});					
				});
			});
		}
	},
	{//6
		intro: '7.前往梅布尔隘地，持有【琥珀之卵】、【逆十字】与祭坛守卫(211.116)对话进入？？？。',
		workFunc: function(cb2){
			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cb2('restart stage');
					}, 3000);
				});
				return;
			}
			
			cga.travel.newisland.toStone('X', ()=>{
				cga.walkList([
					[165, 153],
				], (r)=>{
					cga.TurnTo(165, 154);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(8, -1);
							cga.AsyncWaitMovement({map:['梅布尔隘地'], delay:1000, timeout:10000}, ()=>{
								cga.walkList([
									[211, 117],
								], (r)=>{
									cga.TurnTo(212, 116);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(32, -1);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(1, -1);
											cga.AsyncWaitMovement({map:['？？？'], delay:1000, timeout:10000}, ()=>{
												cb2(r);
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
	{//7
		intro: '8.击倒(136.197)一带的阻挡者后，进入(156.197)的传送石。9.击倒(213.226)、(235.202)等位置的任意一个阻挡者，随机被传送。',
		workFunc: function(cb2){
			cga.walkList([
				[135, 197],
			], (r)=>{
				var step = 7;
				var go = ()=>{
					cga.ForceMove(0, true);
					if(step > 0){
						step --;
						setTimeout(go, 500);
					}else{
						cga.walkList((cga.isTeamLeader == true) ? 
						[
						[156, 197, '？？？', 213, 164],
						[213, 165],
						] : [
						[156, 197, '？？？', 213, 164],
						], ()=>{
							zudangzhe(cb2);
						});
					}
				}
				setTimeout(go, 1000);
			});
		}
	},
	{//8
		intro: '10.击倒(161.108)一带的阻挡者，经由(241.118)的传送石进入？？？。',
		workFunc: function(cb2){
			
			var waitBOSS = ()=>{
				if(cga.isInBattle())
				{
					doneBOSS = true;
					
					if(isBossLogBack){
						setTimeout(()=>{
							cga.LogBack();
							cga.AsyncWaitMovement({map:'艾尔莎岛', delay:1000, timeout:5000}, (err, reason)=>{
								setTimeout(cb2, 1000, true);
								return;
							});
						},5000);
						return;
					}else{
						setTimeout(waitBOSS, 1000);
						return;
					}
				}

				if(doneBOSS && !cga.isInBattle()){
					//cga.LogBack();
					setTimeout(cb2, 1000, true);
					return;
				}
				
				setTimeout(waitBOSS, 1500);
			}
			
			if(!cga.isTeamLeader){
				setTimeout(waitBOSS, 1500);
				return;
			}
			
			cga.walkList([
				[163, 107],
			], (r)=>{
				var step = 4;
				var go = ()=>{
					cga.ForceMove(2, true);
					if(step > 0){
						step --;
						setTimeout(go, 500);
					}else{
						cga.walkList([
						[218, 117],
						[242, 117, 59716],
						[221, 187],
						], ()=>{
							cga.turnTo(222, 188);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, -1);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(32, -1);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(32, -1);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(32, -1);
											cga.AsyncWaitNPCDialog(()=>{
												cga.ClickNPCDialog(32, -1);
												cga.AsyncWaitNPCDialog(()=>{
													cga.ClickNPCDialog(32, -1);
													cga.AsyncWaitNPCDialog(()=>{
														cga.ClickNPCDialog(8, -1);
														cga.AsyncWaitNPCDialog(()=>{
															cga.ClickNPCDialog(1, -1);

															setTimeout(waitBOSS, 1500);															
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
				}
				setTimeout(go, 1000);
			});
		}
	},
	{//9
		intro: '13.返回盖雷布伦森林，持有【觉醒的文言抄本】与纳塞(245.73)对话，获得【转职保证书】。',
		workFunc: function(cb2){
			cga.travel.newisland.toStone('X', ()=>{
				cga.walkList([
				[130, 50, '盖雷布伦森林'],
				[244, 74],
				], ()=>{
					cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);		//开启交易
					var getBZS = ()=>{
						if(cga.getItemCount('觉醒的文言抄本') > 0){
							cga.TurnTo(245, 73);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(32, 0);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(32, 0);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(1, 0);
											setTimeout(()=>{
												if(cga.getItemCount('转职保证书') > 0){
													cb2(true);
													return;
												}
											}, 2000, true);
										});
									});
								});
							});
						}else{
							console.log('等待拿到觉醒的文言抄本,换取保证书');
							setTimeout(getBZS,2000);
						}
					}
					getBZS();
				});
			});
		}
	},
	],
	[//任务阶段是否完成
		function(){//消除任务
			return false;
		},
		function(){//琥珀之卵
			return (cga.getItemCount('琥珀之卵') >= 1) ? true : false;
		},
		function(){//长老之证
			return (cga.getItemCount('长老之证') >= 7 || callZLZZ) ? true : false;
		},
		function(){
			return false;
		},
		function(){
			return false;
		},
		function(){//逆十字
			return (cga.getItemCount('逆十字') > 0) ? true : false;
		},
		function(){
			return false;
		},
		function(){
			return false;
		},
		function(){
			return false;
		},
		function(){
			return cga.getItemCount('转职保证书') > 0 ? true : false;
		},
	]
	);
	
	task.anyStepDone = false;
	
	var selectTask = ()=>{
		if(taskIndex !== null){
			console.log(taskIndex);
			if(taskIndex == 0)
				task.jumpToStep = 0;
			else if(taskIndex == 1)
				task.jumpToStep = 2;
			//else if(taskIndex == 2)
			//	task.jumpToStep = 3;
			else if(taskIndex == 3)
				task.jumpToStep = 4;
			else if(taskIndex == 4)
				task.jumpToStep = 6;
			else if(taskIndex == 5)
				task.jumpToStep = 9;
			else 
				console.log('taskIndex输入有误，脚本结束');
			if(typeof task.jumpToStep != 'undefined'){
				task.doTask(()=>{
					console.log('ok');
				});
				return false;
			}
		}
	}

	var leaveTeam = ()=>{
		cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
	}
	var getTeammates = ()=>{
		cga.LogBack();
		cga.AsyncWaitMovement({map:'艾尔莎岛', delay:1000, timeout:5000}, (err, reason)=>{
			if(cga.isTeamLeader){
				cga.walkList([
					meetingPoints1[meetingPoint],
				], ()=>{
					var waitFor = ()=>{
						//console.log('waitFor...');
						var teamplayers = cga.getTeamPlayers();
						if(teamplayers&&teamplayers.length==teamPlayerCount){
							for(var i in teamplayers){
								teammates[i] = teamplayers[i].name;
							}
							cga.SayWords('组队完成，队员['+teammates.toString()+']', 1, 3, 1);
							setTimeout(leaveTeam, 5000);
							setTimeout(selectTask, 5000);
							return;
						}else{
							setTimeout(waitFor, 1000);
						}
					}
					waitFor();
				});
			}else{
				cga.walkList([
					meetingPoints2[meetingPoint],
				], ()=>{
					var waitAdd = ()=>{					
						//console.log('waitAdd...');
						cga.addTeammate(teamLeader, (r)=>{
							if(r){
								cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false);
								teammates[0] = teamLeader;
								cga.SayWords('组队完成，队长['+teammates[0]+']', 2, 3, 1);
								selectTask();
								return;
							}
							setTimeout(waitAdd, 500);
						});
					}
					waitAdd();
				});
			}
		});
	}

	//脚本开始
	if(playerName==teamLeader){
		cga.isTeamLeader = true;
		cga.SayWords('红叶の保证书脚本，我是队长', 1, 3, 1);
		getTeammates();
	}else{
		cga.SayWords('红叶の保证书脚本，我是队员', 2, 3, 1);
		getTeammates();
	}
	
});