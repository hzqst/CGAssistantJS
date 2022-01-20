var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	
	var settle = ()=>{
		cga.walkList([
		[118, 106]
		], ()=>{
			cga.TurnTo(118, 104);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
				cga.AsyncWaitNPCDialog((err, dlg)=>{
					if(dlg && dlg.message.indexOf('您没有达到能够设定登陆点的条件')){
						task.doTask(settle);
						return;
					}
				});
			});
		});
	}
	
	var task = cga.task.Task('艾尔巴尼亚市民权', [
	{//0
		intro: '1.前往哥拉尔镇民房（89.64）与金梅婆婆（7.5）对话，选“是”获得【老婆婆的黑轮】。',
		workFunc: function(cb2){
			cga.walkList([
			[89, 64, '民家'],
			[8, 6],
			], ()=>{
				cga.TurnTo(6, 4);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, -1);
						setTimeout(()=>{
							cga.walkList([
							[9, 19, '哥拉尔镇']
							], ()=>{
								cb2(true);
							});
						}, 1000);						
					});
				});
			});
		}
	},
	{//1
		intro: '2.前往哥拉尔镇（170.114）处，持有【老婆婆的黑轮】与金多吉爷爷对话，选“是”交出【老婆婆的黑轮】获得【吉比雷的帽子】。',
		workFunc: function(cb2){
			cga.walkList([
			[169, 114],
			], ()=>{
				cga.TurnTo(171, 114);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, -1);
								setTimeout(cb2, 1000, true);
							});
						});
					});
				});
			});
		}
	},
	{//2
		intro: '3.前往阿凯鲁法村与医师吉比雷（228.201）对话，交出【吉比雷的帽子】获得【吉比雷的胃肠药】。',
		workFunc: function(cb2){
			cga.travel.falan.toCity('阿凯鲁法', ()=>{
				cga.walkList([
				[227, 200],
				], ()=>{
					cga.TurnTo(229, 202);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, -1);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(1, -1);
									setTimeout(cb2, 1000, true);
								});
							});
						});
					});
				});
			});
		}
	},
	{//3
		intro: '4.返回哥拉尔镇与金多吉爷爷（170.114）对话，交出【吉比雷的胃肠药】获得【黑轮串】。',
		workFunc: function(cb2){
			cga.travel.falan.toCity('哥拉尔', ()=>{
				cga.walkList([
				[169, 114],
				], ()=>{
					cga.TurnTo(171, 114);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, -1);
							setTimeout(cb2, 1000, true);
						});
					});
				});
			});
		}
	},
	{//4
		intro: '5.返回民房（89.64）与金梅婆婆（7.5）对话，交出【黑轮串】获得【吉比雷的桌子钥匙】。',
		workFunc: function(cb2){
			cga.walkList([
			[89, 64, '民家'],
			[8, 6],
			], ()=>{
				cga.TurnTo(6, 4);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, -1);
							setTimeout(cb2, 1000, true);
						});
					});
				});
			});
		}
	},
	{//5
		intro: '6.调查书桌（15.3），选“是”交出【吉比雷的桌子钥匙】获得【哥拉尔市民权状】。',
		workFunc: function(cb2){
			cga.walkList([
			[15, 4]
			], ()=>{
				cga.TurnTo(15, 3);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					setTimeout(()=>{
						cga.walkList([
						[9, 19, '哥拉尔镇']
						], ()=>{
							cb2(true);
						});
					}, 1000);
				});
			});
		}
	},
	{//6
		intro: '7.前往哥拉尔镇白之宫殿，通过楼梯（36.42）抵达谒见之间。',
		workFunc: function(cb2){
			cga.walkList([
			[140, 214, 43200],
			[47, 36, 43210],
			[36, 42, '谒见之间'],
			[57, 46],
			], ()=>{
				cga.TurnTo(59, 46);
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
											cga.ClickNPCDialog(32, -1);
											cga.AsyncWaitNPCDialog(()=>{
												cga.ClickNPCDialog(32, -1);
												cga.AsyncWaitNPCDialog(()=>{													
													cga.ClickNPCDialog(1, -1);
													setTimeout(()=>{
														cga.walkList([
														[15, 45, 43210],
														[9, 46, 43200],
														[22, 37, '哥拉尔镇'],
														[118, 214],
														], ()=>{															
															cga.travel.gelaer.toStone('N', ()=>{
																cga.walkList([
																[118, 106],
																], ()=>{
																	cga.turnTo(118, 105);
																	cga.AsyncWaitNPCDialog(()=>{
																		cga.ClickNPCDialog(4, -1);
																		cb2(true);
																	});
																});																
															});
														});
													}, 1000);
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
	],
	[
		()=>{
			return cga.getItemCount('老婆婆的黑轮') > 0;
		},
		()=>{
			return cga.getItemCount('吉比雷的帽子') > 0;
		},
		()=>{
			return cga.getItemCount('吉比雷的胃肠药') > 0;
		},
		()=>{
			return cga.getItemCount('黑轮串') > 0;
		},
		()=>{
			return cga.getItemCount('吉比雷的桌子钥匙') > 0;
		},
		()=>{
			return cga.getItemCount('哥拉尔市民权状') > 0;
		},
	]
	);
	
	cga.travel.falan.toCity('哥拉尔', settle);
});