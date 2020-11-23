var Async = require('async');
var teamMode = require('./../公共模块/组队模式');

var cga = global.cga;
var configTable = global.configTable;

var saveBankArray = ['不存银行', '存银行'];

var task = cga.task.Task('十周年戒指', [
{//0
	intro: '1.前往法兰城里谢里雅堡与追忆之路管理员（30.80）对话，选“是”进入追忆之路。',
	workFunc: function(cb2){
		
		//补血
		if(cga.needSupplyInitial())
		{
			cga.travel.falan.toCastleHospital(()=>{
				setTimeout(()=>{
					cga.travel.newisland.toStone('X', ()=>{
						cb2('restart stage');
					});
				}, 3000);
			});
			return;
		}
		
		//存银行
		if(thisobj.saveBank == 1 && cga.getItemCount('十周年纪念戒指') >= 1)
		{
			cga.travel.falan.toBank(()=>{
				cga.walkList([
				[11, 8],
				], ()=>{
					cga.turnDir(0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.saveToBankAll('十周年纪念戒指', 0, (r)=>{
							cb2('restart stage');
						});
					}, 1000);
				});
			});
			return;
		}
		
		//进入追忆之路
		cga.travel.falan.toStone('C', ()=>{
			cga.walkList([
			[30, 81]
			], ()=>{
				cga.turnTo(30, 80);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({map:'追忆之路', delay:1000, timeout:5000}, (err)=>{
								if(err){//不知道什么原因没进去，重试一次
									cb2('restart stage');
									return;
								}
								if(cga.isTeamLeader)
								{
									cga.walkList([
									[15, 125]
									], ()=>{
										teamMode.wait_for_teammates(()=>{
											cb2(true);
										});
									});
								}
								else
								{
									teamMode.wait_for_teammates(()=>{
										cb2(true);
									});
								}
							});
						});
					});
				});
			});
		});
	},
},
{//1
	intro: '2.依次挑战追忆之路内的5位BOSS，分别是：露比、法尔肯、帕布提斯马&凯法、犹大、海贼头目、帕鲁凯斯的亡灵（第一形态）',
	workFunc: function(cb2){
		
		var retry = (err)=>{
			if(err){
				cb2(err);
				return;
			}
			
			console.log('拿戒指')
			cga.cleanInventory(1, ()=>{
				cga.turnTo(15, 4);
				cga.AsyncWaitNPCDialog((err)=>{
					if(err){
						cga.walkList([ [14, 5], [15, 5] ], retry);
						return;
					}
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitMovement({map:'里谢里雅堡', delay:1000, timeout:5000}, ()=>{
							cb2(true);
						});
					});
				});
			});
		}
		
		var wait = ()=>{
			cga.waitForLocation({
				mapname : '追忆之路', 
				pos : [15, 4], 
				leaveteam : true, 
				walkto : [15, 5], 
				desired_teamplayers : cga.getTeamPlayers()
			}, retry);
		}

		var go = ()=>{
			console.log('露比')
			cga.walkList([
				[15, 111],
			], ()=>{
				cga.turnTo(15, 110);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.waitForBattleEnd(()=>{
						if(cga.GetMapXY().y != 103){
							cb2(new Error('没有打过露比！请检查战斗配置是否有问题！'));
							return;
						}
						console.log('法尔肯')
						cga.walkList([
						[15, 100]
						], ()=>{
							cga.turnTo(15, 99);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, 0);
								cga.waitForBattleEnd(()=>{
									if(cga.GetMapXY().y != 92){
										cb2(new Error('没有打过法尔肯！请检查战斗配置是否有问题！'));
										return;
									}
									console.log('犹大')
									cga.walkList([
									[15, 89]
									], ()=>{
										cga.turnTo(15, 88);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(1, 0);
											cga.waitForBattleEnd(()=>{
												if(cga.GetMapXY().y != 81){
													cb2(new Error('没有打过犹大！请检查战斗配置是否有问题！'));
													return;
												}
												console.log('海贼')
												cga.walkList([
												[15, 78]
												], ()=>{
													cga.turnTo(15, 77);
													cga.AsyncWaitNPCDialog(()=>{
														cga.ClickNPCDialog(1, 0);
														cga.waitForBattleEnd(()=>{
															if(cga.GetMapXY().y != 70){
																cb2(new Error('没有打过海贼！请检查战斗配置是否有问题！'));
																return;
															}
															console.log('双王')
															cga.walkList([
															[15, 67]
															], ()=>{
																cga.turnTo(15, 66);
																cga.AsyncWaitNPCDialog(()=>{
																	cga.ClickNPCDialog(1, 0);
																	cga.waitForBattleEnd(()=>{
																		if(cga.GetMapXY().y != 59){
																			cb2(new Error('没有打过双王！请检查战斗配置是否有问题！'));
																			return;
																		}
																		cga.walkList([//帕鲁凯斯的亡灵
																		[15, 56]
																		], ()=>{
																			cga.turnTo(15, 55);
																			cga.AsyncWaitNPCDialog(()=>{
																				cga.ClickNPCDialog(1, 0);
																				cga.waitForBattleEnd(()=>{
																					if(cga.GetMapXY().y != 48){
																						cb2(new Error('没有打过小帕！请检查战斗配置是否有问题！'));
																						return;
																					}
																					cga.walkList([
																						[15, 5],
																					], ()=>{
																						cga.walkTeammateToPosition([
																						[15, 5],
																						[14, 5],
																						], retry);
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
									});
								});
							});
						});
					});
				});
			});
		}
					
		if(cga.isTeamLeader){
			go();
		} else {
			wait();
		}
	},
},
],
[//任务阶段是否完成
	function(){
		return false;
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

		if(map == '追忆之路')
			return 2;
		
		return 0;
	},
	translate : (pair)=>{
		
		if(pair.field == 'saveBank'){
			pair.field = '是否存银行';
			pair.value = saveBankArray[pair.value];
			pair.translated = true;
			return true;
		}
		
		if(teamMode.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{

		if(!teamMode.loadconfig(obj))
			return false;
		
		for(var i in saveBankArray){
			if(i == obj.saveBank){
				configTable.saveBank = i;
				thisobj.saveBank = i;
				break;
			}
		}

		if(typeof thisobj.saveBank == 'undefined'){
			console.error('读取配置：是否存银行失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		Async.series([teamMode.inputcb, (cb2)=>{
			
			var sayString = '【十年戒指】请选择是否存银行 (0否，1是):';

			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && (index == 0 || index == 1)){
					configTable.saveBank = index;
					thisobj.saveBank = index;
					
					var sayString2 = '当前已选择:[' + saveBankArray[index] + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}], cb);
	},
	execute : ()=>{
		callSubPlugins('init');
		loop();
	},
}

module.exports = thisobj;