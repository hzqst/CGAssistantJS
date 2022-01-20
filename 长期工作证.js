var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	
	var exchange = (cb)=>{
		cga.travel.falan.toStone('E2', ()=>{
			cga.walkList([
			[230, 78, null],
			[230, 82, null],
			[231, 83, null],
			], ()=>{
				cga.TurnTo(233, 83);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							cga.walkList([
							[230, 82, null],
							[230, 78, null],
							[233, 78, null],
							], ()=>{
								cb(true);
							});
						});
					});
				});
			});
		});
	}
	
	var retryRoutine = (cb) => {
		cga.TurnTo(38, 7);
		cga.AsyncWaitNPCDialog(()=>{
			cga.ClickNPCDialog(32, 0);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(32, 0);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(dlg && dlg.message.indexOf('适当休息') >= 0){
							cb(false, new Error('已经领完可以领取的所有包裹！'));
							return;
						}
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((err, dlg)=>{
							if(dlg && dlg.message.indexOf('伊尔村') >= 0 &&
							dlg.message.indexOf('圣拉鲁卡村') >= 0 &&
							dlg.message.indexOf('维诺亚村') >= 0 &&
							dlg.message.indexOf('奇利村') >= 0 &&
							dlg.message.indexOf('加纳村') >= 0
							){
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(4, 0);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(1, 0);
										if(cga.getItemCount('蜗牛的包裹') > 0)
											cb(true);
										else
											cb(false, new Error('领取包裹失败！'));
									});
								});
							}
							else{
								retryRoutine(cb)
							}
						});
					});
				});
			});
		});
	}
	
	var stage1 = (cb)=>{
		cga.travel.falan.toTeleRoom('伊尔村', (r)=>{
			cga.walkList([
				[12, 17, '村长的家'],
				[6, 13, '伊尔村'],
				[45, 31, '芙蕾雅'],
				[684, 343, null],
			], function(r){
				cga.TurnTo(686, 343);
				setTimeout(cb, 1000, true);
			});
		});
	}
	
	var stage2 = (cb)=>{
		cga.travel.falan.toTeleRoom('圣拉鲁卡村', (r)=>{
			cga.walkList([
				[8, 4, null],
				[7, 3, '村长的家'],
				[2, 9, '圣拉鲁卡村'],
				[52, 55, '芙蕾雅'],
				[136, 218, null],
			], function(r){
				cga.TurnTo(136, 216);
				setTimeout(cb, 1000, true);
			});
		});
	}
	
	var stage3 = (cb)=>{
		cga.travel.falan.toTeleRoom('维诺亚村', (r)=>{
			cga.walkList([
				[5, 1, '村长家的小房间'],
				[0, 5, '村长的家'],
				[10, 16, '维诺亚村'],
				[67, 46, '芙蕾雅'],
				[332, 481, null],
			], function(r){
				cga.TurnTo(332, 483);
				setTimeout(cb, 1000, true);
			});
		});
	}
	
	var stage4 = (cb)=>{
		cga.travel.falan.toTeleRoom('奇利村', (r)=>{
			cga.walkList([
			[7, 6, 3214],
			[7, 1, 3212],
			[1, 9, '奇利村'],
			[59, 45, '索奇亚'],
			[276, 292],
			], function(r){
				cga.TurnTo(278, 292);
				setTimeout(cb, 1000, true);
			});
		});
	}
	
	var stage5 = (cb)=>{
		cga.travel.falan.toTeleRoom('加纳村', (r)=>{
			cga.walkList([
			[5, 12, '村长的家'],
			[1, 9, '加纳村'],
			[47, 77, '索奇亚'],
			[704, 148],
			], function(r){
				cga.TurnTo(706, 148);
				cga.AsyncWaitNPCDialog(()=>{
					if(cga.GetPlayerInfo().punchclock >= 3600)
						cga.ClickNPCDialog(4, 0);
					else
						cga.ClickNPCDialog(8, 0);
					setTimeout(cb, 1000, true);
				});
			});
		});
	}
	
	var getjob = (cb)=>{
		cga.travel.falan.toStone('E2', ()=>{
			cga.walkList([
			[238, 64, '冒险者旅馆'],
			[33, 27, '冒险者旅馆 2楼'],
			[38, 8, null],
			], ()=>{
				retryRoutine((r, err)=>{
					if(!r)
						throw err;
					
					cb(true);
				});
			});
		});	
	}
		
	var loop = ()=>{
		if(cga.getItemCount('蜗牛的包裹') > 0){
			if(cga.getItemCount('#700298') > 0){
				stage1(loop);
			}
			else if(cga.getItemCount('#700299') > 0){
				stage2(loop);
			}
			else if(cga.getItemCount('#700338') > 0){
				stage3(loop);
			}
			else if(cga.getItemCount('#700339') > 0){
				stage4(loop);
			}
			else if(cga.getItemCount('#700340') > 0){
				stage5(loop);
			}
			
		}else if(cga.getItemCount('长期工作证领取卷') > 0){
			exchange(loop);
		}
		else if(cga.getItemCount('工作证（长期）') > 0){
			getjob(loop);
		}
	}
	
	loop();
});