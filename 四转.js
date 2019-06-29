var cga = require('./cgaapi')(function(){
	console.log('四转誓言之花脚本 起始地点：艾尔莎岛')
	console.log('重要提示：每一层白色方舟地图档都要下载，否则自动寻路会失败！')

	var loop_count = 0;
	
	var	waitFlower = (waitForPos, waitForItemId, cb)=>{
		
		var trade_player = ()=>{
			
			cga.TurnTo(waitForPos[0], waitForPos[1]);
			
			cga.SayWords('等待换花', 0, 3, 1);
			
			var stuff = 
			{
				itemFilter : (item)=>{
					if(item.itemid == waitForItemId){
						return true;
					}
					return false;
				}
			}		
			cga.trade(0, stuff, null, (result)=>{
				
				console.log(result);

				if(result.success == true){
					cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false)
					cb(true);
				}
				else{
					setTimeout(trade_player, 1000);
				}
			});
		}

		setTimeout(trade_player, 1000);			
	}
	
	var mineArray = [
	{
		type : 1,
		name : '红组',
		func_layer1 : (cb)=>{
			cga.walkList([
			[21, 96],
			], ()=>{
				cga.TurnTo(23, 96);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:96, delay:1000, timeout:5000}, ()=>{
								cga.walkList([
								[58, 92],
								], ()=>{
									cga.TurnTo(58, 94);
									cga.AsyncWaitNPCDialog((dlg)=>{
										cga.ClickNPCDialog(1, 0);
										cga.AsyncWaitMovement({x:75, y:93, delay:1000, timeout:5000}, ()=>{
											cga.walkList([
											[89, 75],
											], ()=>{
												waitFlower([89, 73], 622051, ()=>{
													cga.walkList([
													[163, 77],
													], ()=>{
														cga.TurnTo(165, 77);
														cga.AsyncWaitNPCDialog((dlg)=>{
															cga.ClickNPCDialog(1, 0);
															cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
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
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[126, 100],
			], ()=>{
				waitFlower([126, 102], 622056, ()=>{
					cga.walkList([
					[152, 88],
					], ()=>{
						cga.TurnTo(154, 88);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[122, 92],
			], ()=>{
				waitFlower([122, 90], 622061, ()=>{
					cga.walkList([
					[88, 40],
					], ()=>{
						cga.TurnTo(90, 40);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[100, 94],
			], ()=>{
				
				cga.SayWords('已到达黑色方舟入口，请组队完成剩余部分！', 0, 3, 1);
				cb(true);
				
			});
		}
	},
	{
		type : 2,
		name : '蓝组',
		func_layer1 : (cb)=>{
			cga.walkList([
			[21, 108],
			], ()=>{
				cga.TurnTo(23, 108);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:108, delay:1000, timeout:5000}, ()=>{
								cga.walkList([
								[60, 141],
								], ()=>{
									cga.TurnTo(60, 142);
									cga.AsyncWaitNPCDialog((dlg)=>{
										cga.ClickNPCDialog(1, 0);
										cga.AsyncWaitMovement({x:74, y:141, delay:1000, timeout:5000}, ()=>{
											cga.walkList([
											[89, 131],
											], ()=>{
												waitFlower([89, 129], 622054, ()=>{
													cga.walkList([
													[147, 138],
													], ()=>{
														cga.TurnTo(149, 136);
														cga.AsyncWaitNPCDialog((dlg)=>{
															cga.ClickNPCDialog(1, 0);
															cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
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
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[126, 102],
			], ()=>{
				waitFlower([126, 100], 622057, ()=>{
					cga.walkList([
					[152, 108],
					], ()=>{
						cga.TurnTo(154, 108);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[54, 120],
			], ()=>{
				waitFlower([54, 118], 622060, ()=>{
					cga.walkList([
					[37, 121],
					], ()=>{
						cga.TurnTo(37, 119);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[100, 94],
			], ()=>{
				
				cga.SayWords('已到达黑色方舟入口，请组队完成剩余部分！', 0, 3, 1);
				cb(true);
				
			});
		}
	},
	{
		type : 3,
		name : '黄组',
		func_layer1 : (cb)=>{
			cga.walkList([
			[21, 92],
			], ()=>{
				cga.TurnTo(23, 92);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:92, delay:1000, timeout:5000}, ()=>{
								cga.walkList([
								[59, 63],
								], ()=>{
									cga.TurnTo(61, 63);
									cga.AsyncWaitNPCDialog((dlg)=>{
										cga.ClickNPCDialog(1, 0);
										cga.AsyncWaitMovement({x:75, y:57, delay:1000, timeout:5000}, ()=>{
											cga.walkList([
											[89, 73],
											], ()=>{
												waitFlower([89, 75], 622052, ()=>{
													cga.walkList([
													[136, 48],
													], ()=>{
														cga.TurnTo(138, 48);
														cga.AsyncWaitNPCDialog((dlg)=>{
															cga.ClickNPCDialog(1, 0);
															cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
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
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[70, 102],
			], ()=>{
				waitFlower([70, 104], 622055, ()=>{
					cga.walkList([
					[84, 88],
					], ()=>{
						cga.TurnTo(86, 88);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[122, 90],
			], ()=>{
				waitFlower([122, 92], 622062, ()=>{
					cga.walkList([
					[101, 17],
					], ()=>{
						cga.TurnTo(101, 15);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[99, 83],
			], ()=>{
				waitFlower([101, 83], 622061, ()=>{
					cga.SayWords('已换完花，请自行完成剩余部分！', 0, 3, 1);
					cb(true);				
				});
			});
		}
	},
	{
		type : 4,
		name : '绿组',
		func_layer1 : (cb)=>{
			cga.walkList([
			[21, 104],
			], ()=>{
				cga.TurnTo(23, 104);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:104, delay:1000, timeout:5000}, ()=>{
								cga.walkList([
								[60, 121],
								], ()=>{
									cga.TurnTo(60, 123);
									cga.AsyncWaitNPCDialog((dlg)=>{
										cga.ClickNPCDialog(1, 0);
										cga.AsyncWaitMovement({x:75, y:121, delay:1000, timeout:5000}, ()=>{
											cga.walkList([
											[89, 129],
											], ()=>{
												waitFlower([89, 131], 622053, ()=>{
													cga.walkList([
													[164, 110],
													], ()=>{
														cga.TurnTo(164, 108);
														cga.AsyncWaitNPCDialog((dlg)=>{
															cga.ClickNPCDialog(1, 0);
															cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
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
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[70, 104],
			], ()=>{
				waitFlower([70, 102], 622058, ()=>{
					cga.walkList([
					[84, 112],
					], ()=>{
						cga.TurnTo(86, 112);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[54, 118],
			], ()=>{
				waitFlower([54, 120], 622059, ()=>{
					cga.walkList([
					[68, 97],
					], ()=>{
						cga.TurnTo(70, 95);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[101, 83],
			], ()=>{
				waitFlower([99, 83], 622060, ()=>{
					cga.SayWords('已换完花，请自行完成剩余部分！', 0, 3, 1);
					cb(true);				
				});
			});
		}
	},
	]
	
	var mineObject = null;
	
	var task = cga.task.Task('誓言之花', [
	{//0
		intro: '1.前往光之路调查（165.81）处石碑，选“是”进入白色方舟第一层。',
		workFunc: function(cb2){
	
			if(cga.needSupplyInitial())
			{
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(cb2, 3000, 'restart stage');
				});
				return;
			}
			
			var dropItem = cga.findItem('誓约之花');
			if(dropItem != -1)
			{
				cga.DropItem(dropItem);
				setTimeout(cb2, 1000, 'restart stage');
				return;
			}
			
			cga.travel.newisland.toLiXiaIsland(()=>{
				cga.walkList([
				[90, 99, '国民会馆'],
				[108, 39, '雪拉威森塔１层'],
				[35, 96],
				], ()=>{
					cga.TurnTo(35, 94);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog((dlg)=>{
									cga.ClickNPCDialog(1, 0);
									cga.AsyncWaitMovement({map:'辛梅尔', delay:1000, timeout:5000}, ()=>{
										cga.walkList([
										[207, 91, '光之路'],
										[165, 82]
										], ()=>{
											cga.TurnTo(165, 80);
											cga.AsyncWaitNPCDialog((dlg)=>{
												cga.ClickNPCDialog(4, 0);
												cga.AsyncWaitMovement({map:'白色方舟·第一层', delay:1000, timeout:5000}, cb2);
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
	{//1
		intro: '2.根据职业与对应守卫对话，获得对应的【誓言之花】并进入白色方舟迷宫。',
		workFunc: function(cb2){
			mineObject.func_layer1(cb2);
		}
	},
	{//2
		intro: '3.白色方舟·第二层',
		workFunc: function(cb2){
			mineObject.func_layer2(cb2);
		}
	},
	{//3
		intro: '4.白色方舟·第三层',
		workFunc: function(cb2){
			mineObject.func_layer3(cb2);
		}
	},
	{//4
		intro: '5.白色方舟·第四层',
		workFunc: function(cb2){
			mineObject.func_layer4(cb2);
		}
	},
	],
	[//任务阶段是否完成
		function(){
			return (cga.GetMapName() == '白色方舟·第一层') ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第二层') ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第三层') ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第四层') ? true : false;
		},
	]
	);

	cga.SayWords('欢迎使用CGA通用四转脚本，红组输入‘1’，蓝组输入‘2’，黄组输入‘3’，绿组输入‘4’。', 0, 3, 1);
	
	cga.waitTeammateSay((player, msg)=>{

		if(player.is_me == true){
			
			for(var i in mineArray){
				if(mineArray[i].type == parseInt(msg)){
					mineObject = mineArray[i];
					break;
				}
			}
			
			if(mineObject != null){
				cga.SayWords('您选择了'+mineObject.name+'。', 0, 3, 1);
				task.doTask(()=>{
					
				});
				return false;
			}
		}

		return true;
	});
});