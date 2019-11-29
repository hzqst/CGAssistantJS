var cga = require('./cgaapi')(function(){
	
	var settle = ()=>{
		cga.walkList([
		[99, 164]
		], ()=>{
			cga.TurnTo(99, 162);
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
	
	var task = cga.task.Task('苏之国市民权', [
	{//0
		intro: '1.前往阿凯鲁法村与小次郎（119.115）对话，选“是”、“是”获得【清澈水】。',
		workFunc: function(cb2){
			cga.walkList([
			[119, 116]
			], ()=>{
				cga.TurnTo(119, 114);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, -1);
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
	{//1
		intro: '2.前往夏姆吉诊所（121.155）与阿达巴（11.10）对话，交出【清澈水】获得【纪念宝石】。',
		workFunc: function(cb2){
			cga.walkList([
			[121, 155, '夏姆吉诊所'],
			[10, 10],
			], ()=>{
				cga.TurnTo(12, 10);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, -1);
						setTimeout(()=>{
							cga.walkList([
							[4, 23, '阿凯鲁法村']
							], ()=>{
								cb2(true);
							});
						}, 1000);
					});
				});
			});
		}
	},
	{//2
		intro: '3.前往银行（139.136）与银行员（32.17）对话，交出【纪念宝石】获得【黄金箱】。',
		workFunc: function(cb2){
			cga.walkList([
			[139, 136, '银行'],
			[32, 18],
			], ()=>{
				cga.TurnTo(32, 16);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, -1);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(4, -1);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(32, -1);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(1, -1);
											setTimeout(()=>{
												cga.walkList([
												[8, 16, '阿凯鲁法村']
												], ()=>{
													cb2(true);
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
		}
	},
	{//3
		intro: '4.前往冒险者旅馆（192.208）与利克嘉（21.5）对话，交出【黄金箱】获得【马查招待券】。',
		workFunc: function(cb2){
			cga.walkList([
			[192, 208, '冒险者旅馆 1楼'],
			[21, 6],
			], ()=>{
				cga.TurnTo(21, 4);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, -1);
						setTimeout(()=>{
							cga.walkList([
							[16, 23, '阿凯鲁法村']
							], ()=>{
								cb2(true);
							});
						}, 1000);
					});
				});
			});
		}
	},
	{//4
		intro: '5.前往马查酒吧（192.162）与会长（25.19）对话，交出【马查招待券】获得【马查咖哩饭】。',
		workFunc: function(cb2){
			cga.walkList([
			[196, 162, '马查酒吧'],
			[23, 19],
			], ()=>{
				cga.TurnTo(25, 19);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, -1);
						setTimeout(()=>{
							cga.walkList([
							[34, 32, '阿凯鲁法村']
							], ()=>{
								cb2(true);
							});
						}, 1000);
					});
				});
			});
		}
	},
	{//5
		intro: '6.与小次郎（119.115）对话，交出【马查咖哩饭】获得【推荐函】。',
		workFunc: function(cb2){
			cga.walkList([
			[119, 116]
			], ()=>{
				cga.TurnTo(119, 114);
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
	{//6
		intro: '6.与小次郎（119.115）对话，交出【马查咖哩饭】获得【推荐函】。',
		workFunc: function(cb2){
			cga.walkList([
			[183, 104, 33100],
			[25, 11, 33101],
			[24, 6, '谒见之间'],
			[24, 21],
			], ()=>{
				cga.TurnTo(24, 19);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, -1);
							setTimeout(()=>{
								cga.walkList([
								[25, 43, 33101],
								[24, 8, 33100],
								[25, 45, '阿凯鲁法村'],
								], ()=>{
									cb2(true);
								});
							}, 1000);
						});
					});
				});
			});
		}
	},
	],
	[
		()=>{
			return cga.getItemCount('清澈水') > 0;
		},
		()=>{
			return cga.getItemCount('纪念宝石') > 0;
		},
		()=>{
			return cga.getItemCount('黄金箱') > 0;
		},
		()=>{
			return cga.getItemCount('马查招待券') > 0;
		},
		()=>{
			return cga.getItemCount('马查咖哩饭') > 0;
		},
		()=>{
			return cga.getItemCount('#16233') > 0;
		},
	]
	);
	
	cga.travel.falan.toCity('阿凯鲁法村', settle);
});