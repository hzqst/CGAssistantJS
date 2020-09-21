require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var autoBoss = true; //自动打BOSS

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var protect = {
        minTeamNumber: 5
    };
    var teammates = [];
	leo.log('红叶の半山刷蛋脚本，队长【'+teamLeader+'】，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

    var count = 1;
    var itemCount = 0;

    var openPrize = ()=>{
    	return leo.todo()
    	.then(()=>{
    		var newCount = cga.getItemCount('阿鲁卡那斯的蛋');//道具ID可能是491682，待确认
    		if(newCount > itemCount){
    			console.log('恭喜！获得了【阿鲁卡那斯的蛋】');
    			itemCount = newCount;
    		}
    		console.log('当前【蛋】的数量为【'+itemCount+'】');
		});
    }

    var task = ()=>{
		return leo.todo()
		.then(()=>{
			//至少留2个空位
			var emptyIndexes = leo.getEmptyBagIndexes();
            if(emptyIndexes && emptyIndexes.length < 2){
                if(cga.getItemCount('圣鸟之羽') > 0){
                	leo.log('身上空位不足，去银行存【圣鸟之羽】');
                	return leo.goto(n=>n.falan.bank)
					.then(()=>leo.turnDir(0))
					.then(()=>leo.saveToBankAll('圣鸟之羽'));
                }else{
                	return leo.log('身上空位不足，请先整理物品，至少留2个以上的空位')
					.then(()=>leo.reject());
                }
            }
		})
		.then(()=>{
			//身上拿到鸟类大全
			if(cga.getItemCount('匆忙写下的笔录')==1 && cga.getItemCount('鸟类大全')==0){
				return leo.goto(n => n.castle.x)
				.then(()=>leo.autoWalk([41, 50,'里谢里雅堡 1楼']))
				.then(()=>leo.autoWalk([74, 19,'里谢里雅堡 2楼']))
				.then(()=>leo.autoWalk([0, 74,'图书室']))
				.then(()=>leo.autoWalk([17, 19]))
				.then(()=>leo.talkNpc(18, 19, leo.talkNpcSelectorYes));
			}else if(cga.getItemCount('鸟类大全')==1){

			}else{
				return leo.log('没有【匆忙写下的笔录】或者【鸟类大全】，无法继续任务，请先检查配置')
				.then(()=>leo.reject());
			}
		})
		.then(()=>leo.checkHealth(prepareOptions.doctorName))
		.then(()=>leo.checkCrystal(prepareOptions.crystalName))
		.then(() => {
            if(cga.GetPlayerInfo().gold < 11000){
                return leo.goto(n=>n.falan.bank)
                .then(()=>leo.turnDir(0))
                .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                .then(()=>{
                    if(cga.GetPlayerInfo().gold < 11000){
                        leo.log('钱到用时方恨少！请补充足够银子后重新执行脚本！')
                        return leo.delay(10000000)
                        .then(()=>leo.reject());
                    }
                })
            }
         })
		.then(() => {
            //完成组队
            var teamplayers = cga.getTeamPlayers();
            if ((isTeamLeader && teamplayers.length >= protect.minTeamNumber)
            		|| (!isTeamLeader && teamplayers.length > 0)) {
                //console.log('组队已就绪');
                return leo.next();
            } else {
                console.log(leo.logTime() + '寻找队伍');
                return leo.logBack()
                .then(() => leo.statistics(leo.beginTime, leo.oldXp))   //打印统计信息
                .then(()=>leo.checkHealth(prepareOptions.doctorName))
                .then(()=>leo.goto(n => n.falan.wout))
                .then(()=>leo.autoWalk([397,168]))
                .then(()=>leo.talkNpc(398, 168, leo.talkNpcSelectorYes,'小岛'))
                .then(() => {
                    if (isTeamLeader) {
                        return leo.moveAround()
                        .then(()=>leo.buildTeamBlock(teamPlayerCount));
                    } else {
                        return leo.enterTeamBlock(teamLeader);
                    }
                });
            }
        })
		.then(()=>{
			if(isTeamLeader){
				var teammateReady = 1;	//队长不说话，只有队友说话，次数默认为1
				return leo.autoWalk([58, 78])
				.then(()=>leo.autoWalk([58, 77]))
				.then(()=>leo.autoWalk([58, 78]))
				.then(()=>leo.autoWalk([58, 77]))
				.then(()=>leo.autoWalk([58, 78]))
				.then(()=>leo.talkNpc(59, 78, leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([19, 11]))
				.then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([11, 13]))
				.then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes))
				.then(()=>leo.say('阿鲁卡那斯'))
				.then(()=>{
					return leo.waitNPCDialog(dialog => {
						cga.ClickNPCDialog(32, -1);
						return cga.emogua.delay(1000);
					});
				})
				.then(()=>{
					return leo.waitNPCDialog(dialog => {
						cga.ClickNPCDialog(32, -1);
						return cga.emogua.delay(1000);
					});
				})
				.then(()=>{
					return leo.waitNPCDialog(dialog => {
						cga.ClickNPCDialog(32, -1);
						return cga.emogua.delay(1000);
					});
				})
				.then(()=>{
					return leo.waitNPCDialog(dialog => {
						cga.ClickNPCDialog(32, -1);
						return cga.emogua.delay(1000);
					});
				})
				.then(()=>{
					return leo.waitNPCDialog(dialog => {
						cga.ClickNPCDialog(1, -1);
						return cga.emogua.delay(1000);
					});
				})
				.then(()=>leo.moveAround())
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([78, 88]))
				.then(()=>leo.autoWalk([78, 87]))
				.then(()=>leo.autoWalk([78, 88]))
				.then(()=>leo.autoWalk([78, 87]))
				.then(()=>leo.autoWalk([78, 88]))
				.then(()=>leo.talkNpc(79, 88, leo.talkNpcSelectorYes))
				.then(()=>leo.waitMessageUntil((chat) => {
					if (chat.msg && chat.msg.indexOf('半山3：已拿到暗号') >= 0) {
						teammateReady++;
						if(teammateReady == teamPlayerCount){
							teammateReady = 1;	//重置
							return true;
						}
					}
				}))
				.then(()=>leo.autoWalk([54, 81]))
				.then(()=>leo.autoWalk([54, 80]))
				.then(()=>leo.autoWalk([54, 81]))
				.then(()=>leo.autoWalk([54, 80]))
				.then(()=>leo.autoWalk([54, 81]))
				.then(()=>{
					if(cga.getItemCount('星鳗饭团') == 0){
						return leo.talkNpc(55, 81, leo.talkNpcSelectorYes);
					}
				})
				.then(()=>leo.waitMessageUntil((chat) => {
					if (chat.msg && chat.msg.indexOf('半山3：已拿到星鳗饭团') >= 0) {
						teammateReady++;
						if(teammateReady == teamPlayerCount){
							teammateReady = 1;	//重置
							return true;
						}
					}
				}))
				.then(()=>leo.autoWalk([64, 45, '通往山顶的路100M']))
				.then(()=>leo.walkRandomMazeUntil(() => {
						const mn = cga.GetMapName();
						if (mn == '半山腰') {
							return true;
						}
						return false;
				},false))
				.then(()=>leo.autoWalk([78, 52, '通往山顶的路1100M']))
				.then(()=>leo.walkRandomMazeUntil(() => {
						const mn = cga.GetMapName();
						if (mn == '圣鸟之巢') {
							return true;
						}
						return false;
				},false))
				.then(()=>leo.autoWalk([13, 11]))
				.then(()=>leo.autoWalk([13, 10]))
				.then(()=>leo.autoWalk([13, 11]))
				.then(()=>leo.autoWalk([13, 10]))
				.then(()=>leo.autoWalk([13, 11]))
				.then(()=>leo.talkNpc(14, 11, leo.talkNpcSelectorYes))
				.then(()=>leo.say('我是来送鳗鱼饭的'))
				.then(()=>{
					return leo.waitNPCDialog(dialog => {
						cga.ClickNPCDialog(1, -1)
						return cga.emogua.delay(1000);
					});
				})
				.then(()=>leo.moveAround())
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([23, 23]))
				.then(()=>{
					return leo.talkNpc(6, leo.talkNpcSelectorYes)
					.then(()=>leo.waitAfterBattle());
				});
			}else{
				return leo.loop(
	                () => leo.waitAfterBattle()
	                .then(() => {
	                	var mapInfo = cga.getMapInfo();
	                	if (mapInfo.name == '小岛' && (mapInfo.y == 77 || mapInfo.y == 78) && mapInfo.x == 58 && !leo.isInTeam()) {
			                return leo.talkNpc(59, 78, leo.talkNpcSelectorYes)
							.then(()=>leo.autoWalk([19, 11]))
							.then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes))
							.then(()=>leo.autoWalk([11, 13]))
							.then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes))
							.then(()=>leo.say('阿鲁卡那斯'))
							.then(()=>{
								return leo.waitNPCDialog(dialog => {
									cga.ClickNPCDialog(32, -1);
									return cga.emogua.delay(1000);
								});
							})
							.then(()=>{
								return leo.waitNPCDialog(dialog => {
									cga.ClickNPCDialog(32, -1);
									return cga.emogua.delay(1000);
								});
							})
							.then(()=>{
								return leo.waitNPCDialog(dialog => {
									cga.ClickNPCDialog(32, -1);
									return cga.emogua.delay(1000);
								});
							})
							.then(()=>{
								return leo.waitNPCDialog(dialog => {
									cga.ClickNPCDialog(32, -1);
									return cga.emogua.delay(1000);
								});
							})
							.then(()=>{
								return leo.waitNPCDialog(dialog => {
									cga.ClickNPCDialog(1, -1);
									return cga.emogua.delay(1000);
								});
							})
							.then(()=>leo.enterTeamBlock(teamLeader));
			            }
			            if (mapInfo.name == '小岛' && (mapInfo.y == 87 || mapInfo.y == 88) && mapInfo.x == 78 && leo.isInTeam() && cga.getItemCount('鸟类大全') == 1 && cga.getItemCount('暗号') < 1) {
			                return leo.talkNpc(79, 88, leo.talkNpcSelectorYes)
			                .then(()=>leo.delay(5000))
			                .then(()=>leo.say('半山3：已拿到暗号'));
			            }
			            if (mapInfo.name == '小岛' && (mapInfo.y == 80 || mapInfo.y == 81) && mapInfo.x == 54 && leo.isInTeam()) {
			            	if(cga.getItemCount('星鳗饭团') == 0){
								return leo.talkNpc(55, 81, leo.talkNpcSelectorYes)
				                .then(()=>leo.delay(5000))
				                .then(()=>leo.say('半山3：已拿到星鳗饭团'));
							}else{
								return leo.delay(5000)
								.then(()=>leo.say('半山3：已拿到星鳗饭团'));
							}
			            }
			            if (mapInfo.name == '圣鸟之巢' && (mapInfo.y == 10 || mapInfo.y == 11) && mapInfo.x == 13 && !leo.isInTeam() && cga.getItemCount('星鳗饭团') >= 1) {
			                return leo.talkNpc(14, 11, leo.talkNpcSelectorYes)
			                .then(()=>leo.say('我是来送鳗鱼饭的'))
							.then(()=>{
								return leo.waitNPCDialog(dialog => {
									cga.ClickNPCDialog(1, -1)
									return cga.emogua.delay(1000);
								});
							})
							.then(()=>leo.enterTeamBlock(teamLeader));
			            }
			            if (mapInfo.name == '圣山之巅' && mapInfo.x == 23 && mapInfo.y == 23 && !leo.isInTeam()) {
			            	//console.log('打完BOSS');
			                return leo.reject();
			            }
		                return leo.delay(5000);
	                })
	            )
			}
		})
		.then(()=>leo.logBack());
	}

	leo.loop(()=>{
        try{
           return leo.todo()
           .then(()=>task())
           .then(()=>leo.log('红叶の半山刷蛋，完成第' + (count++) + '次'))
           .then(()=>openPrize())
           .then(()=>leo.checkHealth(prepareOptions.doctorName));
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })
});