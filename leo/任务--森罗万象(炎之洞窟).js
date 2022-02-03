require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	var teamLeader = ''; //队长名称
    var teamPlayerCount = 1; //队伍人数
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の森罗万象(炎之洞窟)脚本，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if(teamLeader==''){
    	teamLeader = playerName;
    }
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
	            .then(() => leo.buildTeam(teamPlayerCount,teammates)).then(() => {
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
				return leo.autoWalk([67, 47, '芙蕾雅'])
				.then(()=>leo.autoWalk([298, 538]))
				.then(()=>leo.autoWalk([298, 539]))
				.then(()=>leo.autoWalk([298, 538]))
				.then(()=>leo.autoWalk([298, 539]))
				.then(()=>leo.autoWalk([298, 538]))
				.then(()=>leo.talkNpc(299, 538, leo.talkNpcSelectorYes, '维诺亚海底洞窟'))
				.then(()=>{
	                var mapInfo = leo.getMapInfo();
	                var movablePos = leo.getMovablePositionsAround(mapInfo);
	                if(movablePos && movablePos.length > 0){
	                    return leo.autoWalk([movablePos[0].x,movablePos[0].y]);
	                }else{
	                    return leo.autoWalk([mapInfo.x+1,mapInfo.y]);
	                }
	            })
				.then(() => leo.buildTeam(teamPlayerCount,teammates)).then(() => {
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
					[7,3,15593],[7,3,15594],[7,4,'芙蕾雅'],[260,449,'炎之洞窟'],[13,7],[12,7],[13,7],[12,7],[13,7]
				]))
				.then(()=>leo.talkNpc(13,6, leo.talkNpcSelectorYes))
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
				.then(() => leo.buildTeam(teamPlayerCount,teammates)).then(() => {
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
				.then(()=>leo.autoWalk([25, 4, '炎之洞窟地下1楼']))
				.then(()=>leo.walkRandomMazeUntil(() => {
						const mn = cga.GetMapName();
						if (mn == '炎之洞窟 地下16楼') {
							return true;
						}
						return false;
				},false))
				.then(()=>{
					//16楼重复走，直到走到右上角的小地图，进入炎之回廊
					var walk16 = ()=>{
						var mapInfo = cga.getMapInfo();
						if (mapInfo.name == '炎之回廊') {
							return leo.next();
						}
						if(mapInfo.x==10&&mapInfo.y==8){//a
							return leo.autoWalk([22,20])
							.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==41&&mapInfo.y==30){//b
							return leo.autoWalk([31,41])
							.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==9&&mapInfo.y==41){//c
							return leo.autoWalk([19,52])
							.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==36&&mapInfo.y==62){//d
							return leo.autoWalk([47,52])
							.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==20&&mapInfo.y==64){//e
							return leo.autoWalk([9,64])
							.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==22&&mapInfo.y==9){//f
							return leo.autoWalk([22,20])
							.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==62&&mapInfo.y==38){//g
							return leo.autoWalk([51,28])
							.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==43&&mapInfo.y==16){//h
							return leo.autoWalk([54,17])
							.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==83&&mapInfo.y==4){//i
							return leo.autoWalk([72,16])
							.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==59&&mapInfo.y==51){//j
							return leo.autoWalk([69,62])
							.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==74&&mapInfo.y==26){//k
							return leo.autoWalk([74,37])
							.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==27&&mapInfo.y==86){//l
							return leo.autoWalk([40,87])
							.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
						if(mapInfo.x==68&&mapInfo.y==74){//m
							return leo.autoWalk([76,84])
							.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
							.then(()=>leo.delay(1000))
							.then(()=>walk16());
						}
					}
					return walk16();
				})
				.then(()=>leo.autoWalk([41,11]))
				.then(()=>leo.talkNpc(42,11,leo.talkNpcSelectorYes))
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
				.then(()=>leo.log('已拿到炎之乐谱*4'));
			}else{
				return leo.loop(
	                () => leo.waitAfterBattle()
	                .then(() => {
	                	var mapInfo = cga.getMapInfo();
		               	if (mapInfo.name == '芙蕾雅' && mapInfo.x == 298 && (mapInfo.y == 538 || mapInfo.y == 539) && !leo.isInTeam()) {
			                return leo.talkNpc(299, 538, leo.talkNpcSelectorYes, '维诺亚海底洞窟')
			                .then(()=>leo.enterTeam(teamLeader));
			            }
			            if (mapInfo.name == '炎之洞窟' && (mapInfo.x == 12 || mapInfo.x == 13) && mapInfo.y == 7 && !leo.isInTeam()) {
			                return leo.talkNpc(13,6, leo.talkNpcSelectorYes)
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
							.then(()=>leo.log('已拿到土之乐谱*4'))
							.then(()=>leo.delay(30000)); 
			            }
		                return leo.delay(5000);
	                })
	                .catch (console.log)
	            )
			}
		})
	});
});