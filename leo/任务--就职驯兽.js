require('./common').then(cga=>{

	var taskObj = cga.task.Task('就职驯兽师', [
	{
		intro: '1.与法兰城平民武器贩售处（150.122）对话，购买就职职业对应的武器。',
		workFunc: function(cb2){
			var findWeap = cga.findItem((item)=>{
				return item.type == 5;
			})
			if(findWeap >= 8)
			{
				cga.UseItem(findWeap);
				setTimeout(cb2, 1000, true);
				return;
			}
			
			cga.travel.falan.toStone('B1', ()=>{
				cga.turnTo(150, 122);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.BuyNPCStore([{index:5, count:1}]);
						cga.AsyncWaitNPCDialog((err, dlg)=>{
							if(dlg && dlg.message.indexOf('谢谢') >= 0){
								cga.UseItem(cga.findItem((item)=>{
									return item.type == 5;
								}));
								setTimeout(cb2, 1000, true);
								return;
							}
							else
							{
								cb2(false);
								return;
							}
						});
					});
				});
			});
		}
	},
	{
		intro: '2.到法兰城的东医院[224.87]内找护士买“止痛药”',
		workFunc: function(cb2){
			cga.travel.falan.toEastHospital(function(r){
				var npc = cga.findNPC('药剂师波洛姆');
				if(!npc){
					cb2(false);
					return;
				}
				cga.walkList([
				[npc.xpos-1, npc.ypos]
				], (r)=>{
					cga.turnTo(npc.xpos, npc.ypos);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(0, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.BuyNPCStore([{index:1, count:1}]);
							cga.AsyncWaitNPCDialog((err, dlg)=>{
								if(dlg && dlg.message.indexOf('请保重') >= 0){
									cb2(true);
									return;
								}
								else
								{
									cb2(false);
									return;
								}
							});
						});
					});
				});
			});
		}
	},
	{
		intro: '3.接著再到公会[73.60]，把止痛药交给安布伦后他会给你一张“通行证” ',
		workFunc: function(cb2){
			cga.travel.falan.toStone('W1', ()=>{
				cga.walkList([
					[73, 60, '职业公会'],
					[8, 6]
				], (r)=>{
					cga.turnTo(10, 6);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.walkList([
								[9, 24, '法兰城'],
								[63, 79],
							], ()=>{
								cb2(true);
							})
						});
					});
				});
			});
		}
	},
	{
		intro: '4、出西门进国营第24坑道（351.146），在一楼左方找哈鲁迪亚说话就可以进入试练洞窟。直闯6F大厅，和波洛米亚（23.15）交谈后就可以拿到推荐信。',
		workFunc: (cb2)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[351, 145, '国营第24坑道 地下1楼'],
					[9, 15],
				], (r)=>{
					cga.TurnTo(9, 13);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitMovement({x: 7, y: 15}, ()=>{
							cga.walkList([
								[9, 5, '试炼之洞窟 第1层'],
								[33, 31, '试炼之洞窟 第2层'],
								[22, 42, '试炼之洞窟 第3层'],
								[42, 34, '试炼之洞窟 第4层'],
								[27, 12, '试炼之洞窟 第5层'],
								[39, 36, '试炼之洞窟 大厅'],
								[23, 20],
							], (r)=>{
								var job = cga.GetPlayerInfo().job;
								if(job == '游民'){
									cga.walkList([
									[23, 17]
									], (r)=>{
										cga.turnDir(6);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(1, 0);
											setTimeout(cb2, 1000, true);
										});
									});
								} else {
									cga.walkList([
									[22, 12],
									[23, 12],
									], (r)=>{
										cga.SayWords('驯兽师', 0, 0, 0);
										cga.AsyncWaitNPCDialog((err, dlg)=>{
											if(dlg && dlg.message.indexOf('那就拿去吧') >= 0){
												cga.ClickNPCDialog(1, 0);
												setTimeout(cb2, 1000, true);
											}
											else
											{
												cb2(false);
												return;
											}
										});
									});
								}
							});
						});
					});
				});
			});
		}	
	},
	{
		intro: '5、返回法兰城与相关职业就职人员对话，就职成功，任务完结。',
		workFunc: (cb2)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[73, 60, '职业公会'],
					[13, 10],
				], (r)=>{
					cga.turnTo(13, 8);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(0, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cb2(true);
						});
					});
				});
			});
		}	
	}
	],
	[//任务阶段是否完成
		function(){//小刀
			var job = cga.GetPlayerInfo().job;
			if(job == '游民' && cga.getItemCount((item)=>{
				return item.type == 5 && item.pos < 8;
			}, true) > 0) return true;
			
			if(job != '游民')
				return true;
			
			return false;
		},
		function(){//止痛药
			return (cga.getItemCount('#18233') > 0) ? true : false;
		},
		function(){//试炼洞穴通行证
			return (cga.getItemCount('#18100') > 0) ? true : false;
		},
		function(){ 
			return (cga.getItemCount('驯兽师推荐信') > 0) ? true : false;
		},
		function(){ 
			return false;
		}
	]
	);

	taskObj.doTask();
});