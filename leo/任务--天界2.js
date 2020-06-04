require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数

    var autoBoss = false; //自动打BOSS
	var isLogBackFirst = false; //启动登出

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の天界2脚本，队长【'+teamLeader+'】，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

    if(cga.getItemCount('王冠')==0){
    	leo.log('身上没有【王冠】，脚本结束');
    	return;
    }
    if(cga.getItemCount('王冠')>1){
    	leo.log('身上的【王冠】只能带1个，多余的请先存银行，脚本结束');
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
			if(mapInfo.name == '里谢里雅堡' 
				|| (mapInfo.name == '法兰城' && mapInfo.indexes.index3 != 59513)){
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
				.then(()=>leo.autoWalk([108,39,'雪拉威森塔１层']));
			}
			if(mapInfo.name == '雪拉威森塔１层'){
				return leo.autoWalk([34,95])
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'辛梅尔'));
			}
			if(mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59526
				&& cga.getItemCount('秘密回廊的钥匙') == 0){
				return leo.autoWalk([195,67])
				.then(()=>leo.autoWalk([195,62,'？？？']));
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59985
				&& mapInfo.x == 195 && mapInfo.y == 66){
				return leo.autoWalk([200,58])
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
			}
			if(mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59526
				&& cga.getItemCount('秘密回廊的钥匙') == 1){
				return leo.autoWalk([207,91,'光之路']);
			}
			if(mapInfo.name == '光之路' && mapInfo.indexes.index3 == 59505 && (mapInfo.x == 201 || mapInfo.x == 200) && mapInfo.y == 18){
				return leo.reject();	//退出循环，进入下一步
			}
			return leo.delay(2000);
		});
	})
	.then(()=>{
		return leo.waitUntil(()=>{
			var mapInfo = cga.getMapInfo();
			if (mapInfo.name == '光之路' && mapInfo.indexes.index3 == 59505 && (mapInfo.x == 201 || mapInfo.x == 200) && mapInfo.y == 18 && !leo.isInTeam()) {
				return true;
			}
			return false;
		})
		.then(()=>{
			if (isTeamLeader) {
				return leo.autoWalk([200,18])
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([315,221,[325,197]]))
				.then(()=>leo.leaveTeam())
				.then(()=>leo.autoWalk([325,184]))
				.then(()=>leo.autoWalk([325,182,'？？？']))
				.then(()=>leo.autoWalk([130,77]))
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([140,77,'秘密回廊1层']))
				.then(()=>leo.walkRandomMazeUntil(() => {
                        const mn = cga.GetMapName();
                        if (mn == '？？？') {
                            return true;
                        }
                        return false;
                },false))
                .then(()=>leo.autoWalk([173,190,[91,200]]))
                .then(()=>leo.leaveTeam())
                .then(()=>leo.autoWalk([91,189]))
                .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
                .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
                .then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 318 && mapInfo.y == 229) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([318,228]))
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([318,210]))
				.then(()=>{
					if(autoBoss){
						return leo.talkNpc(6,leo.talkNpcSelectorYes)
						.then(()=>leo.waitAfterBattle());
					}else{
						return leo.turnDir(4)
						.then(()=>leo.log('已到达BOSS前，请手动战斗'))
						.then(()=>leo.waitAfterBattle());
					}
				})
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 150 && mapInfo.y == 140) {
						return true;
					}
					return false;
				}))
				//.then(()=>leo.leaveTeam())
				.then(()=>leo.autoWalk([162,140]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 338 && mapInfo.y == 188) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([337,188]))
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([325,198,[315, 222]]))
				.then(()=>leo.autoWalk([201,19,'辛梅尔']))
				.then(()=>leo.autoWalk([181,81,'公寓']))
				.then(()=>leo.autoWalk([89,58]))
				.then(()=>leo.walkTo([90,58]))
				.then(()=>leo.walkTo([89,58]))
				.then(()=>leo.walkTo([90,58]))
				.then(()=>leo.walkTo([89,58]))
				.then(()=>leo.supply(89,57))
				.then(()=>leo.autoWalk([100,70,'辛梅尔']))
				.then(()=>leo.leaveTeam())
				.then(()=>leo.autoWalk([195,67]))
				.then(()=>leo.autoWalk([195,62,'？？？']))
				.then(()=>leo.autoWalk([240,98]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([280,141]))
				.then(()=>leo.buildTeamBlock(teamPlayerCount))
				.then(()=>leo.autoWalk([279,136]))
				.then(()=>{
					if(autoBoss){
						return leo.talkNpc(280, 135, leo.talkNpcSelectorYes)
						.then(()=>leo.waitAfterBattle());
					}else{
						return leo.turnDir(4)
						.then(()=>leo.log('已到达BOSS前，请手动战斗'))
						.then(()=>leo.waitAfterBattle());
					}
				})
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 230 && mapInfo.y == 186) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.waitAfterBattle());
				.then(()=>leo.leaveTeam())
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([122,180]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.log('天界2任务已完成'));
			}else{
				return leo.enterTeamBlock(teamLeader)
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 325 && mapInfo.y == 197 && !leo.isInTeam()) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([325,184]))
				.then(()=>leo.autoWalk([325,182,'？？？']))
				.then(()=>leo.enterTeamBlock(teamLeader))
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 91 && mapInfo.y == 200 && !leo.isInTeam()) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([91,189]))
                .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
                .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
                .then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 318 && mapInfo.y == 229) {
						return true;
					}
					return false;
				}))
                .then(()=>leo.enterTeamBlock(teamLeader))
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.name = '辛梅尔' && mapInfo.x == 181 && mapInfo.y == 82 &&!leo.isInTeam()) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([195,67]))
				.then(()=>leo.autoWalk([195,62,'？？？']))
				.then(()=>leo.autoWalk([240,98]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.enterTeamBlock(teamLeader))
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 230 && mapInfo.y == 186 &&!leo.isInTeam()) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([122,180]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.log('天界2任务已完成'));
			}
		});
	})
	.then(()=>leo.log('脚本结束'));
});