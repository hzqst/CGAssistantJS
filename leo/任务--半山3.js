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
	leo.log('红叶の半山3脚本，启动~');

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
		if(cga.getItemCount('匆忙写下的笔录')==1){
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
	.then(()=>leo.logBack())
	.then(()=>{
		if (isTeamLeader) {
			return leo.autoWalk([155,100])
			.then(()=>leo.buildTeamBlock(teamPlayerCount,teammates));
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
            .then(() => leo.buildTeamBlock(teamPlayerCount,teammates))
			.then(()=>leo.autoWalkList([
				[14,6,'村长的家'],[1,9,'杰诺瓦镇'],[71,18,'莎莲娜'],[668,319]
			]))
			.then(()=>leo.autoWalk([668, 320]))
			.then(()=>leo.autoWalk([668, 319]))
			.then(()=>leo.autoWalk([668, 320]))
			.then(()=>leo.autoWalk([668, 319]))
			.then(()=>leo.talkNpc(669, 319, leo.talkNpcSelectorYes))
			.then(()=>leo.moveAround())
			.then(()=>leo.buildTeamBlock(teamPlayerCount,teammates))
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
			.then(()=>leo.talkNpc(55, 81, leo.talkNpcSelectorYes))
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
			},true))
			.then(()=>leo.autoWalk([78, 52, '通往山顶的路1100M']))
			.then(()=>leo.walkRandomMazeUntil(() => {
					const mn = cga.GetMapName();
					if (mn == '圣鸟之巢') {
						return true;
					}
					return false;
			},true))
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
			.then(()=>leo.buildTeamBlock(teamPlayerCount,teammates))
			.then(()=>leo.autoWalk([23, 23]))
			.then(()=>{
				if(autoBoss){
					return leo.talkNpc(6, leo.talkNpcSelectorYes)
					.then(()=>leo.waitAfterBattle())
					.then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes));
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
			//.then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes))
			.then(()=>leo.log('半山3任务已完成'));
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
						.then(()=>leo.enterTeamBlock(teamLeader));
		            }
		            if (mapInfo.name == '小岛' && (mapInfo.y == 87 || mapInfo.y == 88) && mapInfo.x == 78 && leo.isInTeam() && cga.getItemCount('鸟类大全') == 1 && cga.getItemCount('暗号') < 1) {
		                return leo.talkNpc(79, 88, leo.talkNpcSelectorYes)
		                .then(()=>leo.delay(5000))
		                .then(()=>leo.say('半山3：已拿到暗号'));
		            }
		            if (mapInfo.name == '小岛' && (mapInfo.y == 80 || mapInfo.y == 81) && mapInfo.x == 54 && leo.isInTeam() && cga.getItemCount('星鳗饭团') < 1) {
		                return leo.talkNpc(55, 81, leo.talkNpcSelectorYes)
		                .then(()=>leo.delay(5000))
		                .then(()=>leo.say('半山3：已拿到星鳗饭团'));
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
		                return leo.talkNpc(6, leo.talkNpcSelectorYes)
		                .then(()=>leo.log('半山3任务已完成'))
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