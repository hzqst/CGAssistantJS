require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数

    var autoBoss = true; //自动打BOSS
	var isLogBackFirst = false; //启动登出

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の天界3脚本，队长【'+teamLeader+'】，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

    if(cga.getItemCount('托尔丘的记忆')==0){
    	leo.log('身上没有【托尔丘的记忆】，需要先做天界1任务，脚本结束');
    	return;
    }
    if(!playerinfo.titles.includes('天界变革者')){
    	leo.log('人物没有称号【天界变革者】，需要先做天界2任务，脚本结束');
    	return;
    }

	leo.todo()
	.then(()=>{
		if(isLogBackFirst){
			return leo.logBack()
			.then(()=>leo.prepare(prepareOptions));
		}
	})
	.then(()=>{
		return leo.loop(()=>{
			var mapInfo = cga.getMapInfo();
			if(mapInfo.name == '里谢里雅堡' || mapInfo.name == '法兰城'){
				return leo.logBack();
			}
			if(mapInfo.name == '艾尔莎岛'){
				return leo.autoWalk([165,153])
				.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'));
			}
			if(mapInfo.name == '利夏岛'){
				return leo.autoWalk([90,99,'国民会馆']);
			}
			if(mapInfo.name == '国民会馆'){
				return leo.autoWalk([108,51])
				.then(()=>leo.supplyDir(2))
				.then(()=>leo.autoWalk([115,50]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'？？？'));
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984 && (mapInfo.x == 239 || mapInfo.x == 238) && mapInfo.y == 147){
				return leo.reject();	//退出循环，进入下一步
			}
			return leo.delay(2000);
		});
	})
	.then(()=>{
		//走随机迷宫
		return leo.waitUntil(()=>{
			var mapInfo = cga.getMapInfo();
			if (mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984 && (mapInfo.x == 239 || mapInfo.x == 238) && mapInfo.y == 147 && !leo.isInTeam()) {
				return true;
			}
			return false;
		})
		.then(()=>{
			if (isTeamLeader) {
				return leo.autoWalk([238,147])
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([238,139,[359,180]]))
				.then(()=>leo.autoWalk([355,180,[319,220]]))
				.then(()=>leo.autoWalk([315,220,[279,260]]))
				.then(()=>leo.autoWalk([279,256,59988]))
				.then(()=>leo.autoWalk([203,14,'通向顶端的阶梯1楼']))
				.then(()=>leo.walkRandomMazeUntil(() => {
                        const mn = cga.GetMapName();
                        if (mn == '？？？') {
                            return true;
                        }
                        return false;
                },false))
				.then(()=>leo.autoWalk([163,54,59992]))
				.then(()=>leo.autoWalk([103,19]))
				.then(()=>{
					if(autoBoss){
						return leo.talkNpc(104,18,leo.talkNpcSelectorYes)
						.then(()=>leo.waitAfterBattle());
					}else{
						return leo.turnDir(4)
						.then(()=>leo.log('已到达BOSS前，请手动战斗'))
						.then(()=>leo.waitAfterBattle());
					}
				})
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 109 && mapInfo.y == 145) {
						return true;
					}
					return false;
				}))
				//.then(()=>leo.leaveTeam())
				.then(()=>leo.autoWalk([116,131]))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.next());
			}else{
				return leo.enterTeamBlock(teamLeader)
				// .then(()=>leo.waitUntil(()=>{
				// 	var mapInfo = cga.getMapInfo();
				// 	if (mapInfo.x == 109 && mapInfo.y == 145 && !leo.isInTeam()) {
				// 		return true;
				// 	}
				// 	return false;
				// }))
				// .then(()=>leo.autoWalk([116,131]))
				// .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				// .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.next());
			}
		});
	})
	.then(()=>{
		//星之领域
		return leo.waitUntil(()=>{
			var mapInfo = cga.getMapInfo();
			if (mapInfo.name.indexOf('星之领域') != -1) {
				return true;
			}
			return false;
		})
		.then(()=>{
			if (isTeamLeader) {
				return leo.loop(()=>{
					var mapInfo = cga.getMapInfo();
					if(mapInfo.name == '星之领域　１层' && mapInfo.indexes.index3 == 59757 && (mapInfo.x == 80 || mapInfo.x == 81) && mapInfo.y == 107 && !leo.isInTeam()){
						return leo.autoWalk([81,107])
						.then(()=>leo.buildTeamBlock(teamPlayerCount));
					}
					if(mapInfo.name == '星之领域　１层' && mapInfo.indexes.index3 == 59757 && (mapInfo.x == 80 || mapInfo.x == 81) && mapInfo.y == 107 && leo.isInTeam()){
						return leo.autoWalk([99,17,'星之领域　２层']);
					}
					if(mapInfo.name == '星之领域　２层' && mapInfo.indexes.index3 == 59758 && mapInfo.x == 101 && mapInfo.y == 16){
						return leo.autoWalk([29,89,'星之领域　３层']);
					}
					if(mapInfo.name == '星之领域　３层' && mapInfo.indexes.index3 == 59759 && mapInfo.x == 31 && mapInfo.y == 88){
						return leo.autoWalk([107,167,'星之领域　２层']);
					}
					if(mapInfo.name == '星之领域　２层' && mapInfo.indexes.index3 == 59758 && mapInfo.x == 105 && mapInfo.y == 168){
						return leo.autoWalk([166,102,'星之领域　３层']);
					}
					if(mapInfo.name == '星之领域　２层' && mapInfo.indexes.index3 == 59758 && (mapInfo.x >= 60 && mapInfo.x <= 64) && (mapInfo.y >= 56 && mapInfo.y <= 59)){
						return leo.autoWalk([63,49,'星之领域　３层']);
					}
					if(mapInfo.name == '星之领域　３层' && mapInfo.indexes.index3 == 59759 && mapInfo.x == 168 && mapInfo.y == 101){
						return leo.autoWalk([97,28,'星之领域　４层']);
					}
					if(mapInfo.name == '星之领域　３层' && mapInfo.indexes.index3 == 59759 && mapInfo.x == 63 && mapInfo.y == 48){
						return leo.autoWalk([66,56,'星之领域　４层']);
					}
					if(mapInfo.name == '星之领域　４层' && mapInfo.indexes.index3 == 59760 && mapInfo.x == 98 && mapInfo.y == 27){
						return leo.autoWalk([108,98,'星之领域　５层']);
					}
					if(mapInfo.name == '星之领域　４层' && mapInfo.indexes.index3 == 59760 && mapInfo.x == 68 && mapInfo.y == 55){
						return leo.autoWalk([108,98,'星之领域　５层']);
					}
					if(mapInfo.name == '星之领域　５层' && mapInfo.indexes.index3 == 59761 && mapInfo.x == 110 && mapInfo.y == 97){
						return leo.autoWalk([141,113])
						.then(()=>leo.clickTo(142,113));
					}
					if(mapInfo.name == '星之领域　５层' && mapInfo.indexes.index3 == 59761 && mapInfo.x == 83 && mapInfo.y == 129){
						return leo.autoWalk([141,113])
						.then(()=>leo.clickTo(142,113));
					}
					if(mapInfo.name == '星之领域　５层' && mapInfo.indexes.index3 == 59761 && mapInfo.x == 32 && mapInfo.y == 99){
						return leo.reject();	//退出循环，进入下一步
					}
					return leo.delay(2000);
				})
				.then(()=>leo.autoWalk([39,98]))
				.then(()=>{
					if(autoBoss){
						return leo.talkNpc(40, 99, leo.talkNpcSelectorYes)
						.then(()=>leo.waitAfterBattle());
					}else{
						return leo.turnDir(4)
						.then(()=>leo.log('已到达BOSS前，请手动战斗'))
						.then(()=>leo.waitAfterBattle());
					}
				})
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.name == '约尔克神庙') {
						return true;
					}
					return false;
				}))
				.then(()=>leo.leaveTeam())
				.then(()=>leo.autoWalk([41,28]))
				.then(()=>leo.talkNpc(42, 28, leo.talkNpcSelectorYes))
				.then(()=>leo.talkNpc(42, 27, leo.talkNpcSelectorYes))
				.then(()=>leo.log('天界3任务已完成'));
			}else{
				return leo.enterTeamBlock(teamLeader)
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.name == '约尔克神庙' && !leo.isInTeam()) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([41,28]))
				.then(()=>leo.autoWalkList([[41,27],[41,28],[41,27],[41,28]]))
				.then(()=>leo.talkNpc(42, 28, leo.talkNpcSelectorYes))
				.then(()=>leo.talkNpc(42, 27, leo.talkNpcSelectorYes))
				.then(()=>leo.log('天界3任务已完成'));
			}
		});
	})
	.then(()=>leo.log('脚本结束'));
});