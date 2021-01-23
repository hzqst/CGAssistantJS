require('./common').then(cga => {
	
	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
	
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false;

	//技能设置
    const sets = [];
	sets.push({
		user: 1,
		check: context => true,
		type: '逃跑',
		targets: context => [context.player_pos]
	});
	sets.push({
		user: 4,
		check: context => true,
		type: '防御',
		targets: context => [context.player_pos]
	});
	sets.push({
		user: 2,
		check: context => true,
		skillName: '防御',
		targets: context => [context.petUnit.pos]
	});
	var firstRoundDelay = 1;	//首回合延迟
	var roundDelay = 1			//每回合延迟
	var force = true ;			//是否强制启用战斗配置
	leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
	
	var task = cga.task.Task('咒术就职', [
	{//0
		intro: '1.进入莎莲娜海底洞窟。前往莎莲娜海底洞窟地下2楼调查（31.22）处，输入“咒术”，变更场景。3.往南行走进入咒术师的秘密住处（38.37），与咒术师希索普（13.7）对话，选“是”获得【咒器·红念珠】。',
		workFunc: function(cb2){
						
			var go = ()=>{
				cga.walkList([
				[14, 6, '村长的家'],
				[1, 10, '杰诺瓦镇'],
				[24, 40, '莎莲娜'],
				[196, 443, '莎莲娜海底洞窟 地下1楼'],
				[14, 41, '莎莲娜海底洞窟 地下2楼'],
				[32, 21],
				], ()=>{
					cga.TurnTo(31, 22);
					setTimeout(()=>{
					cga.SayWords('咒术', 0, 3, 1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:15006, delay:1000, timeout:5000}, ()=>{
								cga.walkList([
								[38, 37, '咒术师的秘密住处'],
								[12, 7],
								[12, 8],
								[12, 7],
								[12, 8],
								[12, 7],
								], ()=>{
									cga.cleanInventory(1, ()=>{
										cga.TurnTo(14, 7);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(4, 0);
											cga.AsyncWaitNPCDialog(()=>{
												cga.SayWords('拿咒器红念珠，完成请说“1”！', 0, 3, 1);
												setTimeout(()=>{
													cga.SayWords('1', 0, 3, 1);
												}, 1000);
											});										
										});
									});
								});
							});
						});
					}, 1500);
				});
				
				cga.waitTeammateSayNextStage(teammates, cb2);
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.cleanInventory(1, ()=>{
						cga.TurnTo(14, 7);
						cga.AsyncWaitNPCDialog((err)=>{
							if(err){
								retry();
								return;
							}
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.SayWords('1', 0, 3, 1);
								setTimeout(()=>{
									cb2(true);
								}, 1000);
							});
						});
					});
				}
				
				cga.waitForLocation({mapname : '咒术师的秘密住处', pos : [13, 7]}, retry);
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
					cga.AsyncWaitNPCDialog(function(err){
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
				cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
					wait();
				});
			} else {
				wait2();
			}
		}
	},
	{//1
		intro: '4.前往法兰城豪宅（96.148），通过厨房的垃圾箱（33.22），进入豪宅地下。由（9.5）处上楼，通过镜子（33.10）进入镜中的豪宅。',
		workFunc: function(cb2){
			var go = ()=>{
				cga.walkList([
				[96, 149, '豪宅'],
				[33, 22, '豪宅  地下'],
				[9, 5, '豪宅'],
				[33, 10, '镜中的豪宅'],
				[35, 2],
				], ()=>{
					cga.cleanInventory(1, ()=>{
						cga.TurnTo(35, 1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							setTimeout(()=>{
								cga.walkList([
								[36, 9],
								], ()=>{
									cga.TurnTo(36, 10);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(4, 0);
										cga.AsyncWaitMovement({x:36, y:11, delay:1000, timeout:5000}, ()=>{
											cga.walkList([
											[27, 67, '豪宅'],
											[58, 66, '豪宅  地下'],
											[41, 23, '豪宅'],
											[59, 6, '豪宅  2楼'],
											[16, 9, '镜中的豪宅  2楼'],
											[40, 10],
											], ()=>{
												cga.cleanInventory(1, ()=>{
													cga.TurnTo(41, 10);
													cga.AsyncWaitNPCDialog(()=>{
														cga.ClickNPCDialog(4, 0);
														setTimeout(()=>{
															cga.walkList([
															[40,16],
															], ()=>{
																cga.TurnTo(40, 17);
																cga.AsyncWaitNPCDialog(()=>{
																	cga.ClickNPCDialog(4, 0);
																	cga.AsyncWaitMovement({x:40, y:18, delay:1000, timeout:5000}, ()=>{
																		cga.walkList([
																		[17, 61, '豪宅  2楼'],
																		[5, 23, '豪宅  阁楼'],
																		[14, 30, '镜中的豪宅  阁楼'],
																		[14, 36, '镜中的豪宅  2楼'],
																		[11, 35],
																		], ()=>{
																			cga.cleanInventory(1, ()=>{
																				cga.TurnTo(12, 35);
																				cga.AsyncWaitNPCDialog(()=>{
																					cga.ClickNPCDialog(4, 0);
																					setTimeout(()=>{
																						cga.walkList([
																						[16, 51, '镜中的豪宅  阁楼'],
																						[23, 20],
																						], ()=>{
																							cga.TurnTo(23, 19);
																							cga.AsyncWaitNPCDialog(()=>{
																								cga.ClickNPCDialog(4, 0);
																								cga.AsyncWaitMovement({x:23, y:18, delay:1000, timeout:5000}, ()=>{
																									cga.walkList([
																									[23, 11],
																									[22, 11],
																									[23, 11],
																									[22, 11],
																									[23, 11],
																									], cb2);
																								});
																							});
																						});
																					}, 1500);
																				});
																			});
																		});
																	});
																});
															});
														}, 1500);
													});	
												});									
											});
										});
									});
								});
							}, 1500);
						});
					});
				})
			}
			
			var go2 = ()=>{
				cga.waitForLocation({mapindex : '镜中的豪宅  阁楼', pos : [23, 1]}, ()=>{
					cb2(true);
				});
			}

			var wait = ()=>{
				cga.WalkTo(71, 123);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						go();
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			var wait2 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						go2();
						return;
					}
					setTimeout(wait2, 1000);
				});
			}
						
			if(cga.isTeamLeader){
				cga.travel.falan.toStone('W2', wait);
			} else {
				cga.travel.falan.toStone('W2', wait2);
			}
		}
	},
	{//2
		intro: '9.与罗蕾儿（23.10）对话，选“是”获得【神器·紫念珠】。再次与罗蕾儿对话传送回豪宅（32.45）处。',
		workFunc: function(cb2){
			cga.cleanInventory(1, ()=>{
				cga.TurnTo(23, 10);
				cga.AsyncWaitNPCDialog((err)=>{					
					if(err){
						console.log(err);
						cga.walkList([ [23, 11], [22, 11] ], ()=>{
							cb2('restart stage');
						});
						return;
					}
					
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							setTimeout(cb2, 1000, true);
						});
					});
				});	
			});			
		}
	},
	{//3
		intro: '10.返回莎莲娜海底洞窟咒术师的秘密住处与咒术师希索普对话，交出【咒器·红念珠】、【神器·紫念珠】获得【咒术师推荐信】。',
		workFunc: function(cb2){

			var go = ()=>{
				cga.walkList([
				[14, 6, '村长的家'],
				[1, 10, '杰诺瓦镇'],
				[24, 40, '莎莲娜'],
				[196, 443, '莎莲娜海底洞窟 地下1楼'],
				[14, 41, '莎莲娜海底洞窟 地下2楼'],
				[32, 21],
				], ()=>{
					cga.TurnTo(31, 22);
					setTimeout(()=>{
					cga.SayWords('咒术', 0, 3, 1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:15006, delay:1000, timeout:5000}, ()=>{
								cga.walkList([
								[38, 37, '咒术师的秘密住处'],
								[12, 7],
								[12, 8],
								[12, 7],
								[12, 8],
								[12, 7],
								], ()=>{
									cga.TurnTo(14, 7);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(4, 0);
										cga.AsyncWaitNPCDialog(()=>{
											cb2(true);
										});										
									});
								});
							});
						});
					}, 1500);
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.TurnTo(14, 7);
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							retry();
							return;
						}
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog((err)=>{
							cb2(true);
						});
					});
				}
				
				cga.waitForLocation({mapname : '咒术师的秘密住处', pos : [13, 7]}, retry);
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
					cga.AsyncWaitNPCDialog((err)=>{
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
				cga.travel.falan.toTeleRoom('杰诺瓦镇', wait3);
			}

		}
	}
	],
	[//任务阶段是否完成
		function(){
			return (cga.getItemCount('咒器·红念珠') >= 1) ? true : false;
		},
		function(){
			return ((cga.GetMapName() == '镜中的豪宅  阁楼') && cga.GetMapXY().y < 19 ) ? true : false;
		},
		function(){
			return (cga.getItemCount('咒器·红念珠') >= 1 && cga.getItemCount('神器·紫念珠') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('咒术师推荐信') >= 1) ? true : false;
		},
	]
	);

	task.doTask();
});