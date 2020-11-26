require('./common').then(cga => {
	cga.LogBack();

	var loop_count = 0;
	
	var mineArray = [
	{
		type : 1,
		name : '王冠',
		func : (cb)=>{
			
		}
	},
	{
		type : 2,
		name : '公主头冠',
		func : (cb)=>{
			
		}
	},
	{
		type : 3,
		name : '小猫帽',
		func : (cb)=>{
			
		}
	},
	]
	
	var mineObject = null;
	
	var task = cga.task.Task('圣域守护者', [
	{//0
		intro: '1.前往雪拉威森塔95楼与守护者杰斯（28.104）对话，选“是”获得【塞特的护身符】。',
		workFunc: function(cb2){
			
			var stage2 = ()=>{
				cga.TurnTo(28, 103);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'雪拉威森塔９６层', delay:1000, timeout:5000}, cb2);
							});
						});
					});
				});
			}
			
			if(mineObject.type != 3)
			{
				if(cga.getItemCount('王冠') >= 1)
				{
					cga.travel.falan.toBank(()=>{
						cga.walkList([
						[11, 8]
						], ()=>{
							cga.TurnTo(12, 8);
							cga.AsyncWaitNPCDialog(function(dlg){
								cga.saveToBankAll('王冠', 0, (r)=>{
									cb2('restart stage');
								});
							}, 1000);
						});
					});
					return;
				}
				if(cga.getItemCount('公主头冠') >= 1)
				{
					cga.travel.falan.toBank(()=>{
						cga.walkList([
						[11, 8]
						], ()=>{
							cga.TurnTo(12, 8);
							cga.AsyncWaitNPCDialog(function(dlg){
								cga.saveToBankAll('公主头冠', 0, (r)=>{
									cb2('restart stage');
								});
							}, 1000);
						});
					});
					return;
				}
			}
			
			if(cga.needSupplyInitial())
			{
				if(cga.GetMapName() == '国民会馆'){
					cga.walkList([
					[109, 51]
					], ()=>{
						cga.TurnTo(107, 53);
						setTimeout(cb2, 3000, 'restart stage');
					})
					
					return;
				}
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(cb2, 3000, 'restart stage');
				});
				return;
			}
			
			if(cga.GetMapName() == '国民会馆'){
				cga.walkList([
				[108, 39, '雪拉威森塔１层'],
				[73, 60],
				[75, 50, '雪拉威森塔５０层'],
				[16, 44, '雪拉威森塔９５层'],
				[28, 105],
				], stage2);
			}
			else
			{
				cga.travel.newisland.toLiXiaIsland(()=>{
					cga.walkList([
					[90, 99, '国民会馆'],
					[108, 39, '雪拉威森塔１层'],
					[73, 60],
					[75, 50, '雪拉威森塔５０层'],
					[16, 44, '雪拉威森塔９５层'],
					[28, 105],
					], stage2);
				});
			}
		}
	},
	{//1
		intro: '2.前往雪拉威森塔96楼与守护者梅亚（88.118）对话，交出【塞特的护身符】获得【梅雅的护身符】。',
		workFunc: function(cb2){
			
			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cga.travel.newisland.toStone('X', ()=>{
							cb2('restart stage');
						});
					}, 3000);
				});
				return;
			}
			
			if(cga.GetMapName() != '雪拉威森塔９６层'){
				var useItem = cga.findItem('塞特的护身符');
				if(useItem != -1){
					cga.UseItem(useItem);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitMovement({map:'雪拉威森塔９５层', delay:1000, timeout:5000}, ()=>{
							cga.TurnTo(29, 104);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'雪拉威森塔９６层', delay:1000, timeout:5000}, ()=>{
									cb2('restart stage');
								});
							});
						});
					});
				}
				return;
			}
			
			cga.walkList([
			[87, 118],
			], ()=>{
				cga.TurnTo(89, 118);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'雪拉威森塔９７层', delay:1000, timeout:5000}, cb2);
							});
						});
					});
				});
			});
		}
	},
	{//2
		intro: '3.前往雪拉威森塔97楼与守护者迪斯（117.125）对话，交出【梅雅的护身符】获得【提斯的护身符】。',
		workFunc: function(cb2){
			
			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cga.travel.newisland.toStone('X', ()=>{
							cb2('restart stage');
						});
					}, 3000);
				});
				return;
			}
			
			if(cga.GetMapName() != '雪拉威森塔９７层'){
				var useItem = cga.findItem('梅雅的护身符');
				if(useItem != -1){
					cga.UseItem(useItem);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitMovement({map:'雪拉威森塔９６层', delay:1000, timeout:5000}, ()=>{
							cga.TurnTo(89, 118);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'雪拉威森塔９７层', delay:1000, timeout:5000}, ()=>{
									cb2('restart stage');
								});
							});
						});
					});
				}
				return;
			}
			
			cga.walkList([
			[117, 126],
			], ()=>{
				cga.TurnTo(117, 124);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(4, 0);
								cga.AsyncWaitNPCDialog((dlg)=>{
									cga.ClickNPCDialog(1, 0);
									cga.AsyncWaitMovement({map:'雪拉威森塔９８层', delay:1000, timeout:5000}, cb2);
								});
							});
						});
					});
				});
			});
		}
	},
	{//3
		intro: '4.前往雪拉威森塔98楼与守护者乌斯（120.120）对话，交出【提斯的护身符】获得【伍斯的护身符】。',
		workFunc: function(cb2){

			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cga.travel.newisland.toStone('X', ()=>{
							cb2('restart stage');
						});
					}, 3000);
				});
				return;
			}
			
			if(cga.GetMapName() != '雪拉威森塔９８层'){
				var useItem = cga.findItem('提斯的护身符');
				if(useItem != -1){
					cga.UseItem(useItem);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitMovement({map:'雪拉威森塔９７层', delay:1000, timeout:5000}, ()=>{
							cga.TurnTo(118, 125);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'雪拉威森塔９８层', delay:1000, timeout:5000}, ()=>{
									cb2('restart stage');
								});
							});
						});
					});
				}
				return;
			}
			
			cga.walkList([
			[120, 121],
			], ()=>{
				cga.TurnTo(120, 119);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'雪拉威森塔９９层', delay:1000, timeout:5000}, cb2);
						});
					});
				});
			});
		}
	},
	{//4
		intro: '5.前往雪拉威森塔99楼与守护者妮斯（102.54）对话，交出【伍斯的护身符】获得【尼斯的护身符】。',
		workFunc: function(cb2){
						
			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{
						cga.travel.newisland.toStone('X', ()=>{
							cb2('restart stage');
						});
					}, 3000);
				});
				return;
			}
			
			if(cga.GetMapName() != '雪拉威森塔９９层'){
				var useItem = cga.findItem('伍斯的护身符');
				if(useItem != -1){
					cga.UseItem(useItem);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitMovement({map:'雪拉威森塔９８层', delay:1000, timeout:5000}, ()=>{
							cga.TurnTo(120, 119);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'雪拉威森塔９９层', delay:1000, timeout:5000}, ()=>{
									cb2('restart stage');
								});
							});
						});
					});
				}
				return;
			}
						
			cga.walkList([
			[101, 54],
			], ()=>{
				cga.TurnTo(103, 54);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitMovement({map:'雪拉威森塔最上层', delay:1000, timeout:5000}, cb2);
					});
				});
			});
		}
	},
	{//5
		intro: '6.通过（103.134）处楼梯上楼达到雪拉威森塔塔顶。',
		workFunc: function(cb2){
			
			if(cga.needSupplyInitial({  })){
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(()=>{						
						cga.travel.newisland.toStone('X', ()=>{
							cb2('restart stage');							
						});
					}, 3000);
				});
				return;
			}
			
			if(cga.GetMapName() != '雪拉威森塔最上层'){
				var useItem = cga.findItem('尼斯的护身符');
				if(useItem != -1){
					cga.UseItem(useItem);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitMovement({map:'雪拉威森塔９９层', delay:1000, timeout:5000}, ()=>{
							cga.TurnTo(103, 54);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								cga.AsyncWaitMovement({map:'雪拉威森塔最上层', delay:1000, timeout:5000}, ()=>{
									cb2('restart stage');	
								});
							});
						});
					});
				}
				return;
			}
			
			cga.walkList([
			[103, 134, '雪拉威森塔前庭'],
			[103, 19],
			], ()=>{
				cga.TurnTo(105, 17);
				cga.AsyncWaitNPCDialog((err, dlg)=>{
					if(mineObject.type != 3){
						cga.SayWords(mineObject.type == 1 ? '男' : '女', 0, 3, 1);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							setTimeout(cb2, 3000, true);
						});
					} else {
						if(typeof dlg.message == 'string' &&
						dlg.message.indexOf('给你这个') >= 0){
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								setTimeout(cb2, 3000, true);
							});
						}
						else if(typeof dlg.message == 'string' &&
						dlg.message.indexOf('还给我吗') >= 0){
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								setTimeout(cb2, 3000, true);
							});
						}
						else if(typeof dlg.message == 'string' &&
						dlg.message.indexOf('我是管理') >= 0){
							cga.SayWords('男', 0, 3, 1);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(1, 0);
								setTimeout(cb2, 3000, true);
							});
						}
					}
				});
			});
		}
	},
	],
	[//任务阶段是否完成
		function(){
			return (cga.getItemCount('塞特的护身符') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('梅雅的护身符') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('提斯的护身符') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('伍斯的护身符') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('尼斯的护身符') >= 1) ? true : false;
		},
		function(){
			return false;
		},
	]
	);

	var loop = ()=>{
		loop_count ++;
		leo.say('已刷' + loop_count + '遍！');
		task.doTask(loop);
	}

	leo.log('欢迎使用CGA通用王冠/小猫脚本');
	leo.log('输入‘1’刷王冠，输入‘2’刷公主头冠，输入‘3’刷小猫帽');
	leo.log('5秒内没有选择，自动选刷王冠');

	setTimeout(()=>{
		leo.say('1');
	},5000);

	cga.waitTeammateSay((player, msg)=>{

		if(player.is_me == true){
			
			for(var i in mineArray){
				if(mineArray[i].type == parseInt(msg)){
					mineObject = mineArray[i];
					break;
				}
			}
			
			if(mineObject != null){
				leo.log('您选择了刷'+mineObject.name+'。');
				task.doTask(loop);
				return false;
			}
		}

		return true;
	});
});