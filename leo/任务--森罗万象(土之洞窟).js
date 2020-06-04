require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 1; //队伍人数
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の森罗万象(土之洞窟)脚本，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

	leo.logBack()
	.then(()=>leo.prepare(prepareOptions))
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
			return leo.goto(n => n.falan.eout)
			.then(()=>leo.autoWalk([583,172,'土之洞窟']))
			.then(()=>leo.autoWalk([13, 5]))
			.then(()=>leo.autoWalk([12, 5]))
			.then(()=>leo.autoWalk([13, 5]))
			.then(()=>leo.autoWalk([12, 5]))
			.then(()=>leo.autoWalk([13, 5]))
			.then(()=>leo.talkNpc(13, 4, leo.talkNpcSelectorYes, '土之洞窟第一层'))
			.then(()=>{
                var mapInfo = leo.getMapInfo();
                var movablePos = leo.getMovablePositionsAround(mapInfo);
                if(movablePos && movablePos.length > 0){
                    return leo.autoWalk([movablePos[0].x,movablePos[0].y]);
                }else{
                    return leo.autoWalk([mapInfo.x+1,mapInfo.y]);
                }
            })
            .then(() => leo.buildTeam(teamPlayerCount)).then(() => {
                var teamplayers = cga.getTeamPlayers();
                //console.log(teamplayers);
                if (teamplayers && teamplayers.length == teamPlayerCount) {
                    for (var i in teamplayers) {
                        teammates[i] = teamplayers[i].name;
                    }
                }
                leo.log('组队完成，队员[' + teammates.toString() + ']');
                return leo.next();
            })
			.then(()=>leo.autoWalkList([
				[74,61,11035],[74,53,11034],[70,41,11035],[62,37,11034],
				[49,37,11035],[46,45,11034],[22,29,11035],[22,44,11034],
				[13,68,11035],[6,56,11036],[10,41,11037],[5,25,11034],
				[14,34,[9, 75]],[18,73,'土之迷宫第1层']
			]))
			.then(()=>leo.walkRandomMazeUntil(() => {
					const mn = cga.GetMapName();
					if (mn == '土之洞窟第三层') {
						return true;
					}
			},false))
			.then(()=>leo.autoWalkList([
				[37,61,11035],[42,70,11036],[74,73,11037],[46,57,11036],
				[50,50,11037],[38,40,11036],[72,7]
			]))
			.then(()=>leo.talkNpc(73,6,leo.talkNpcSelectorYes))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.name == '充满谜的房间') {
					return true;
				}
				return false;
			}))
			.then(()=>{
				if (leo.isInTeam()) {
	            	return leo.leaveTeam();
	            }
			})
			.then(()=>leo.autoWalk([7,3]))
			.then(()=>leo.talkNpc(7,2, (dialog) => {
				if(dialog && dialog.message && dialog.message.indexOf('要把乐谱带走吗') >= 0){
					cga.ClickNPCDialog(4, -1);
					cga.ClickNPCDialog(4, -1);
					cga.ClickNPCDialog(4, -1);
					cga.ClickNPCDialog(4, -1);
					return false;
				}
				return false;
			}))
			.then(()=>leo.log('已拿到土之乐谱*4'));
		}else{
			return leo.loop(
                () => leo.waitAfterBattle()
                .then(() => {
                	var mapInfo = cga.getMapInfo();
	               	if (mapInfo.name == '土之洞窟' && (mapInfo.x == 12 || mapInfo.x == 13) && mapInfo.y == 5 && !leo.isInTeam()) {
		                return leo.talkNpc(13, 4, leo.talkNpcSelectorYes, '土之洞窟第一层')
		                .then(()=>leo.enterTeam(teamLeader));
		            }
		            if (mapInfo.name == '充满谜的房间' && !leo.isInTeam()) {
		                return leo.autoWalk([7,3])
		                .then(()=>leo.talkNpc(7,2, (dialog) => {
							if(dialog && dialog.message && dialog.message.indexOf('要把乐谱带走吗') >= 0){
								cga.ClickNPCDialog(4, -1);
								cga.ClickNPCDialog(4, -1);
								cga.ClickNPCDialog(4, -1);
								cga.ClickNPCDialog(4, -1);
								return false;
							}
							return false;
						}))
						.then(()=>leo.log('已拿到土之乐谱*4'))
						.then(()=>leo.delay(30000)); 
		            }
	                return leo.delay(5000);
                })
                .catch (console.log)
            )
		}
	});
});