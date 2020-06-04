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
	leo.log('红叶の森罗万象(水之洞窟)脚本，启动~');

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
		return leo.goto(n => n.teleport.vinoy)
		.then(()=>{
			if(isTeamLeader){
				return leo.todo().then(()=>{
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
	            });
			}else{
				return leo.enterTeam(teamLeader)
				.then(() => {
                    leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
                    return leo.next();
                });
			}
		})
		.then(()=>{
			if(isTeamLeader){
				return leo.autoWalkList([[67, 47, '芙蕾雅'],[429, 570, '水之洞窟'],[17,24]])
				.then(()=>leo.autoWalk([16,24]))
				.then(()=>leo.autoWalk([17,24]))
				.then(()=>leo.autoWalk([16,24]))
				.then(()=>leo.autoWalk([17,24]))
				.then(()=>{
					if (leo.isInTeam()) {
		            	return leo.leaveTeam();
		            }
				})
				.then(()=>leo.talkNpc(17,23, leo.talkNpcSelectorYes))
				.then(()=>leo.delay(2000))
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
				.then(()=>leo.autoWalk([10, 8, '水之洞窟地下1楼']))
				.then(()=>leo.walkRandomMazeUntil(() => {
						const mn = cga.GetMapName();
						if (mn == '水之洞窟中层') {
							return true;
						}
						return false;
				},false))
				.then(()=>{
					//来的水晶是 [6,5]，要排除掉
					var index = -1;
					var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0 && u.xpos != 6 && u.ypos != 5);
					var selectMaze = () => {
						index++;
						if(index >= mazeEntry.length){
							return leo.reject('找不到水之斗神BOSS，可能是迷宫刷新了');
						}
						console.log([mazeEntry[index].xpos,mazeEntry[index].ypos]);
						return leo.autoWalk([mazeEntry[index].xpos,mazeEntry[index].ypos,'水之迷宫地下21楼'])
						.then(()=>leo.walkRandomMazeUntil(() => {
								const mn = cga.GetMapName();
								if (mn == '水之试炼') {
									return true;
								}
								return false;
						},false))
						.then(()=>leo.autoWalk([25, 16]))
						.then(()=>{
							var boss = cga.GetMapUnits().find(u => u.unit_name === '温蒂妮');
							if(boss){
								//没找对，返回重新找
								return leo.autoWalk([22, 48, '水之迷宫地下29楼'])
								.then(()=>leo.walkRandomMazeUntil(() => {
										const mn = cga.GetMapName();
										if (mn == '水之洞窟中层') {
											return true;
										}
										return false;
								},false))
								.then(()=>selectMaze());
							}else{
								return leo.log('找到BOSS了');
							}
				        })
					}
					return selectMaze();
				})
				.then(()=>leo.autoWalk([24,16]))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
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
				.then(()=>leo.log('已拿到水之乐谱*4'));
			}else{
				return leo.loop(
	                () => leo.waitAfterBattle()
	                .then(() => {
	                	var mapInfo = cga.getMapInfo();
			            if (mapInfo.name == '水之洞窟' && (mapInfo.x == 16 || mapInfo.x == 17) && mapInfo.y == 24 && !leo.isInTeam()) {
			                return leo.talkNpc(17,23, leo.talkNpcSelectorYes)
			                .then(()=>leo.delay(2000))
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
							.then(()=>leo.log('已拿到水之乐谱*4'))
							.then(()=>leo.delay(30000)); 
			            }
		                return leo.delay(5000);
	                })
	                .catch (console.log)
	            )
			}
		});
	});
});