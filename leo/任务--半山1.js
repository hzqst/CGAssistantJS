require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
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
	leo.log('红叶の半山1脚本，启动~');

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
	.then(()=>{
		if(cga.getItemCount('海德的好运符')==0){
			return leo.goto(n => n.castle.x)
			.then(()=>leo.autoWalk([41, 50,'里谢里雅堡 1楼']))
			.then(()=>leo.autoWalk([80, 18]))
			.then(()=>leo.talkNpc(81, 18, leo.talkNpcSelectorYes));
		}
	})
	.then(()=>{
		return leo.logBack()
		.then(()=>{
			if (isTeamLeader) {
				return leo.autoWalk([155,100])
				.then(()=>leo.buildTeam(teamPlayerCount))
				.then(() => {
                    var teamplayers = cga.getTeamPlayers();
                    //console.log(teamplayers);
                    if (teamplayers && teamplayers.length == teamPlayerCount) {
                        for (var i in teamplayers) {
                            teammates[i] = teamplayers[i].name;
                        }
                    }
                    leo.log('组队完成，队员[' + teammates.toString() + ']');
                    return leo.next();
                });
			}else{
				return leo.autoWalk([154,100])
				.then(()=>leo.enterTeam(teamLeader))
				.then(() => {
                    leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
                    return leo.next();
                });
			}
		});
	})
	.then(()=>{
		if(isTeamLeader){
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
            .then(()=>leo.buildTeamBlock(teamPlayerCount))
			.then(()=>leo.autoWalkList([
				[14,6,'村长的家'],[1,9,'杰诺瓦镇'],[71,18,'莎莲娜'],[570,275,'蒂娜村'],[63,52]
			]))
			.then(()=>{
				if(autoBoss){
					return leo.talkNpc(64, 51, leo.talkNpcSelectorYes)
					.then(()=>leo.waitAfterBattle())
					.then(()=>leo.talkNpc(64, 51, leo.talkNpcSelectorYes));
				}else{
					console.log(leo.logTime() + '已到达BOSS前，请手动战斗，并对话后传送到莎莲娜');
					return leo.waitAfterBattle()
					.then(()=>leo.waitUntil(()=>{
						var mapInfo = cga.getMapInfo();
						if (mapInfo.name == '莎莲娜' && cga.getItemCount('海德的好运符') == 0) {
							return true;
						}
						return false;
					}));
				}
			})
			//.then(()=>leo.talkNpc(64, 51, leo.talkNpcSelectorYes))
			.then(()=>leo.logBack())
			.then(()=>leo.goto(n => n.castle.x))
			.then(()=>leo.autoWalk([41,50,'里谢里雅堡 1楼']))
			.then(()=>leo.autoWalk([80, 18]))
			.then(()=>leo.talkNpc(81, 18, leo.talkNpcSelectorYes))
			.then(()=>leo.log('半山1任务已完成'));
		}else{
			return leo.loop(
                () => leo.waitAfterBattle()
                .then(() => {
                	var mapInfo = cga.getMapInfo();
		            if (mapInfo.name == '启程之间' && (mapInfo.y == 4 || mapInfo.y == 5) && mapInfo.x == 15 && !leo.isInTeam()) {
		                return leo.talkNpc(16, 4, leo.talkNpcSelectorYes,'杰诺瓦镇的传送点')
		                .then(()=>leo.enterTeamBlock(teamLeader));
		            }
		            if (mapInfo.name == '蒂娜村' && !leo.isInTeam() && cga.getItemCount('海德的好运符') == 0) {
		                return leo.talkNpc(64, 51, leo.talkNpcSelectorYes,'莎莲娜')
		                .then(()=>leo.logBack())
		                .then(()=>leo.goto(n => n.castle.x))
						.then(()=>leo.autoWalk([41,50,'里谢里雅堡 1楼']))
						.then(()=>leo.autoWalk([80, 18]))
						.then(()=>leo.talkNpc(81, 18, leo.talkNpcSelectorYes))
						.then(()=>leo.log('半山1任务已完成'))
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