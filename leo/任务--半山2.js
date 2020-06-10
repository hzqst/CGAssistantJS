require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var autoBoss = false; //自动打BOSS

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の半山2脚本，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

	leo.logBack()
	.then(() => leo.checkHealth(prepareOptions.doctorName))
	.then(()=>leo.prepare(prepareOptions))
	.then(()=>leo.logBack())
	.then(()=>{
		if(cga.getItemCount('航海图')==0){
			return leo.goto(n => n.castle.x)
			.then(()=>leo.autoWalk([41, 50,'里谢里雅堡 1楼']))
			.then(()=>leo.autoWalk([74, 19,'里谢里雅堡 2楼']))
			.then(()=>leo.autoWalk([0, 74,'图书室']))
			.then(()=>leo.autoWalk([17, 19]))
			.then(()=>leo.talkNpc(18, 19, leo.talkNpcSelectorYes))
			.then(()=>leo.useItems('修特的项链'))
			.then(()=>{
				return leo.waitNPCDialog(dialog => {
					cga.ClickNPCDialog(1, 1);
					return leo.delay(2000);
				});
			})
		}
	})
	.then(()=>leo.logBack())
	.then(()=>{
		if (isTeamLeader) {
			return leo.autoWalk([155,100])
			.then(()=>leo.buildTeamBlock(teamPlayerCount));
		}else{
			return leo.autoWalk([154,100])
			.then(()=>leo.enterTeamBlock(teamLeader));
		}
	})
	.then(()=>{
		if(isTeamLeader){
			var teammateReady = 1;	//队长不说话，只有队友说话，次数默认为1
			return leo.goto(n => n.castle.x)
			.then(()=>leo.autoWalk([41, 50,'里谢里雅堡 1楼']))
			.then(()=>leo.autoWalk([45,20,'启程之间']))
			.then(()=>leo.autoWalk([15, 4]))
			.then(()=>leo.walkTo([15, 5]))
			.then(()=>leo.walkTo([15, 4]))
			.then(()=>leo.walkTo([15, 5]))
			.then(()=>leo.walkTo([15, 4]))
			.then(()=>leo.delay(2000))
			.then(()=>{
				if (leo.isInTeam()) {
	            	return leo.leaveTeam();
	            }
			})
			.then(()=>leo.talkNpc(16, 4, leo.talkNpcSelectorYes,'杰诺瓦镇的传送点'))
			.then(()=>leo.autoWalk([6, 8]))
            .then(() => leo.buildTeamBlock(teamPlayerCount))
			.then(()=>leo.autoWalkList([
				[14,6,'村长的家'],[1,9,'杰诺瓦镇'],[71,18,'莎莲娜'],[668,319]
			]))
			.then(()=>leo.autoWalk([668, 320]))
			.then(()=>leo.autoWalk([668, 319]))
			.then(()=>leo.autoWalk([668, 320]))
			.then(()=>leo.autoWalk([668, 319]))
			.then(()=>leo.talkNpc(669, 319, leo.talkNpcSelectorYes))
			.then(()=>{
				var timeBegin = new Date();
				return leo.waitUntil((timeBegin)=>{
					var timeEnd = new Date();
					if((timeEnd - timeBegin)/1000/60 > 10){
						return leo.next();
					}
				});
			})
			.then(()=>leo.talkNpc(0, leo.talkNpcSelectorYes,'小岛'))
			.then(()=>leo.moveAround())
			.then(()=>leo.buildTeamBlock(teamPlayerCount))
			.then(()=>leo.autoWalk([69, 81]))
			.then(()=>leo.autoWalk([69, 80]))
			.then(()=>leo.autoWalk([69, 81]))
			.then(()=>leo.autoWalk([69, 80]))
			.then(()=>leo.autoWalk([69, 81]))
			.then(()=>leo.talkNpc(70, 81, leo.talkNpcSelectorNo))
			.then(()=>leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('半山2：已拿到巧克力') >= 0) {
					teammateReady++;
					if(teammateReady == teamPlayerCount){
						teammateReady = 1;	//重置
						return true;
					}
				}
			}))
			.then(()=>leo.autoWalk([58, 78]))
			.then(()=>leo.autoWalk([58, 77]))
			.then(()=>leo.autoWalk([58, 78]))
			.then(()=>leo.autoWalk([58, 77]))
			.then(()=>leo.autoWalk([58, 78]))
			.then(()=>leo.talkNpc(59, 78, leo.talkNpcSelectorYes))
			.then(()=>leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('半山2：已拿到金属探测仪') >= 0) {
					teammateReady++;
					if(teammateReady == teamPlayerCount){
						teammateReady = 1;	//重置
						return true;
					}
				}
			}))
			.then(()=>leo.autoWalk([55, 80]))
			.then(()=>leo.talkNpc(55, 81, leo.talkNpcSelectorYes))
			.then(()=>leo.delay(1000))
			.then(()=>leo.autoWalk([81, 20]))
			.then(()=>leo.talkNpc(82, 20, leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalk([121, 20,'达尔文海海底地下1楼']))
			.then(()=>leo.walkRandomMazeUntil(() => {
					const mn = cga.GetMapName();
					if (mn == '深海秘窟') {
						return true;
					}
					return false;
			},false))
			.then(()=>leo.autoWalk([19, 17]))
			.then(()=>{
				if(autoBoss){
					return leo.talkNpc(20, 17, leo.talkNpcSelectorYes)
					.then(()=>leo.waitAfterBattle())
					.then(()=>leo.talkNpc(20, 17, leo.talkNpcSelectorYes));
				}else{
					console.log(leo.logTime() + '已到达BOSS前，请手动战斗，并对话后传送到小岛');
					return leo.waitAfterBattle()
					.then(()=>leo.waitUntil(()=>{
						var mapInfo = cga.getMapInfo();
						if (mapInfo.name == '小岛') {
							return true;
						}
						return false;
					}));
				}
			})
			//.then(()=>leo.talkNpc(20, 17, leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalk([82, 22]))
			.then(()=>leo.buildTeamBlock(teamPlayerCount))
			.then(()=>leo.autoWalk([58, 78]))
			.then(()=>leo.autoWalk([58, 77]))
			.then(()=>leo.autoWalk([58, 78]))
			.then(()=>leo.autoWalk([58, 77]))
			.then(()=>leo.autoWalk([58, 78]))
			.then(()=>leo.talkNpc(59, 78, leo.talkNpcSelectorYes))
			.then(()=>leo.delay(1000))
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
			.then(()=>leo.log('半山2任务已完成'));
		}else{
			return leo.loop(
                () => leo.waitAfterBattle()
                .then(() => {
                	var mapInfo = cga.getMapInfo();
		            if (mapInfo.name == '启程之间' && (mapInfo.y == 4 || mapInfo.y == 5) && mapInfo.x == 15 && !leo.isInTeam()) {
		                return leo.talkNpc(16, 4, leo.talkNpcSelectorYes,'杰诺瓦镇的传送点')
		                .then(()=>leo.enterTeamBlock(teamLeader));
		            }
		            if (mapInfo.name == '莎莲娜' && (mapInfo.y == 319 || mapInfo.y == 320) && mapInfo.x == 668 && !leo.isInTeam()) {
		                return leo.talkNpc(669, 319, leo.talkNpcSelectorYes)
		                .then(()=>{
							var timeBegin = new Date();
							return leo.waitUntil((timeBegin)=>{
								var timeEnd = new Date();
								if((timeEnd - timeBegin)/1000/60 > 10){
									return leo.next();
								} 
							});
						})
						.then(()=>leo.talkNpc(0, leo.talkNpcSelectorYes,'小岛'))
						.then(()=>leo.enterTeamBlock(teamLeader));
		            }
		            if (mapInfo.name == '小岛' && (mapInfo.y == 80 || mapInfo.y == 81) && mapInfo.x == 69 && leo.isInTeam() && cga.getItemCount('巧克力') < 1) {
		                return leo.talkNpc(70, 81, leo.talkNpcSelectorNo)
		                .then(()=>leo.delay(5000))
		                .then(()=>leo.say('半山2：已拿到巧克力'));
		            }
		            if (mapInfo.name == '小岛' && (mapInfo.y == 77 || mapInfo.y == 78) && mapInfo.x == 58 && leo.isInTeam() && cga.getItemCount('巧克力') == 1 && cga.getItemCount('金属探测仪') < 1) {
		                return leo.talkNpc(59, 78, leo.talkNpcSelectorYes)
		                .then(()=>leo.delay(5000))
		                .then(()=>leo.say('半山2：已拿到金属探测仪'));
		            }
		            if (mapInfo.name == '深海秘窟' && !leo.isInTeam() && cga.getItemCount('机器零件') == 0) {
		                return leo.talkNpc(20, 17, leo.talkNpcSelectorYes)
		                .then(()=>leo.enterTeamBlock(teamLeader));
		            }
		            if (mapInfo.name == '小岛' && (mapInfo.y == 77 || mapInfo.y == 78) && mapInfo.x == 58 && !leo.isInTeam() && cga.getItemCount('机器零件') == 1) {
		                return leo.talkNpc(59, 78, leo.talkNpcSelectorYes)
						.then(()=>leo.delay(1000))
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
						.then(()=>leo.log('半山2任务已完成'))
						.then(()=>{
							return false; //退出循环
						});
		            }
	                return leo.delay(5000);
                })
                .catch (console.log)
            )
		}
	});
});