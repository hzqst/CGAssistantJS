var cga = require('./cgaapi')(function(){

	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false
	
	var callZLZZ = false;
	var callWYW = false;
	var doneBOSS = false;
	
	cga.waitTeammateSay((player, msg)=>{

		if(msg.indexOf('长老之证x7 GET') >= 0 ){
			callZLZZ = true;
		}
		
		if(msg.indexOf('觉醒的文言抄本') >= 0 ){
			callWYW = true;
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
			cga.WalkTo(131, 62);
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
				cga.SayWords('错误：找不到任何活着的障碍物!', 0, 3, 1);
				return;
			});
		}
		
		var findZDZ_C = ()=>{
			cga.walkList([
				[234, 202],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 235, 202)){
					cga.turnTo(235, 202);
					return;
				}
				findZDZ_D();
				return;
			});
		}
		
		var findZDZ_B = ()=>{
			cga.walkList([
				[229, 177],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 230, 177)){
					cga.turnTo(230, 177);
					return;
				}
				findZDZ_C();
				return;
			});
		}
		
		var findZDZ_A = ()=>{
			cga.walkList([
				[213, 225],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 213, 226)){
					cga.turnTo(213, 226);
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
						cga.walkList([
						[131, 61],
						], ()=>{
							cga.TurnTo(131, 59);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog((err, dlg)=>{
									if(dlg && dlg.message.indexOf('还不快点') == -1)
									{
										cga.ClickNPCDialog(32, 0);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(1, 0);
											zhanglaozhizheng(cb2);
										});
									} else {
										cga.ClickNPCDialog(1, 0);
										zhanglaozhizheng(cb2);
									}
								});
							});
						});
					});
				});
			});
		}
	},
	{//3
		intro: '5.集齐7个【长老之证】后返回？？？，由持有7个【长老之证】的队员与荷特普(167.102)对话2次，选“是”交出【长老之证】并传送至盖雷布伦森林。',
		workFunc: function(cb2){

			var sayshit = ()=>{
				if(cga.getItemCount('长老之证') >= 7){
					console.log('sayshit1');
					cga.TurnTo(131, 60);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, 0);
								cga.waitForLocation({map : '盖雷布伦森林'}, ()=>{
									cb2(true);
								});
							});
						});
					});
				} else {
					console.log('sayshit2');
					cga.waitForLocation({mapname : '盖雷布伦森林'}, ()=>{
						cb2(true);
					});
				}
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
					
					if(cga.getItemCount('觉醒的文言抄本') > 0){
						//cga.LogBack();
						setTimeout(cb2, 1000, true);
						return;
					}
					setTimeout(waitBOSS, 1000);
					return;
				}
				
				if(doneBOSS && !callWYW && (cga.getItemCount('觉醒的文言抄本') > 0)){
					cga.SayWords('觉醒的文言抄本 GET', 0, 3, 1);
					callWYW = true;
				}

				if(doneBOSS && callWYW){
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
										
									}, 1000, true);
								});
							});
						});
					});
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

	cga.SayWords('欢迎使用琥珀之卵4（转职保证书）脚本，输入‘0’从头（朵拉）开始任务，输入‘1’从打长老证之前开始任务，输入‘3’从荷普特开始任务，输入‘4’从祭坛守卫开始任务，输入‘5’从打完BOSS换保证书开始任务（必须有文言抄本）。', 0, 3, 1);
	
	cga.waitForChatInput((msg, index)=>{

		if(index !== null)
		{
			console.log(index);
			if(index == 0)
				task.jumpToStep = 0;
			else if(index == 1)
				task.jumpToStep = 2;
			//else if(index == 2)
			//	task.jumpToStep = 3;
			else if(index == 3)
				task.jumpToStep = 4;
			else if(index == 4)
				task.jumpToStep = 6;
			else if(index == 5)
				task.jumpToStep = 9;
					
			if(typeof task.jumpToStep != 'undefined'){
				task.doTask(()=>{
					console.log('ok');
				});
				return false;
			}
		}
		return true;
	});
});