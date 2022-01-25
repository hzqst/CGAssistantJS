require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数

	var isLogBackFirst = false; //启动登出

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の天界1脚本，队长【'+teamLeader+'】，启动~');

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
			if(mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59526){
				return leo.autoWalk([192,82,'第二宝座']);
			}
			if(mapInfo.name == '第二宝座'){
				return leo.autoWalk([105,20,'辛梅尔']);
			}
			if(mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59519){ //59519
				return leo.autoWalk([26,15])
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes));
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984
				&& mapInfo.x == 198 && mapInfo.y == 15){ //59984
				return leo.walkTo([201,18])
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
			}
			if(mapInfo.name == '法兰城' && mapInfo.indexes.index3 == 59513
				&& mapInfo.x == 153 && mapInfo.y == 104){ //59513
				return leo.autoWalk([153,121,[167,28]]);
			}
			if(mapInfo.name == '法兰城' && mapInfo.indexes.index3 == 59513
				&& mapInfo.x == 167 && mapInfo.y == 28){ //59513
				return leo.autoWalk([169,26])
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([167,19]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([166,15]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([163,23]))
				.then(()=>leo.talkNpc(4,leo.talkNpcSelectorYes));
			}
			if(mapInfo.name == '法兰城' && mapInfo.indexes.index3 == 59513
				&& (mapInfo.x == 116 || mapInfo.x == 117) && mapInfo.y == 69 && !leo.isInTeam()){ //59513
				if (isTeamLeader) {
					return leo.autoWalk([117,69])
					.then(()=>leo.buildTeamBlock(teamPlayerCount))
					.then(()=>leo.autoWalk([119,67]))
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
				}else{
					return leo.enterTeamBlock(teamLeader);
				}
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984
				&& mapInfo.x == 158 && mapInfo.y == 55){ //59984
				if(isTeamLeader || !leo.isInTeam()){
					return leo.walkTo([161,58])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
				}
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59982
				&& mapInfo.x == 105 && mapInfo.y == 142){ //59982
				if(isTeamLeader || !leo.isInTeam()){
					return leo.walkTo([101,137])
					.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes));
				}
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984
				&& mapInfo.x == 118 && mapInfo.y == 95){ //59984
				if(isTeamLeader || !leo.isInTeam()){
					return leo.walkTo([121,98])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
				}
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59988
				&& mapInfo.x == 356 && mapInfo.y == 179){ //59988
				if(isTeamLeader || !leo.isInTeam()){
					return leo.walkTo([357,172])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
				}
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59986
				&& mapInfo.x == 135 && mapInfo.y == 59){ //59986
				if(isTeamLeader || !leo.isInTeam()){
					return leo.walkTo([140,60])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
				}
			}
			if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59982
				&& (mapInfo.x == 199 || mapInfo.x == 200) && mapInfo.y == 67){ //59982
				return leo.reject();//退出循环，进入下一步
			}
			return leo.delay(2000);
		});
	})
	.then(()=>{
		if (isTeamLeader) {
			return leo.autoWalk([200,67])
			.then(()=>leo.buildTeamBlock(teamPlayerCount));
		}else{
			return leo.enterTeamBlock(teamLeader);
		}
	})
	.then(()=>{
		if(isTeamLeader){
			return leo.autoWalkList([
				[205,55,[158,109]],
				[165,105,[239,107]],
				[234,106,[198,149]],
				[193,132,[229,260]],
				[207,239]
			])
			.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.x == 204 && mapInfo.y == 235) {
					return true;
				}
				return false;
			}))
			.then(()=>leo.autoWalk([193,215]))
			.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.x == 199 && mapInfo.y == 209) {
					return true;
				}
				return false;
			}))
			.then(()=>leo.autoWalk([227,199]))
			.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.x == 232 && mapInfo.y == 203) {
					return true;
				}
				return false;
			}))
			.then(()=>leo.autoWalk([258,230]))
			.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.x == 283 && mapInfo.y == 149) {
					return true;
				}
				return false;
			}))
			.then(()=>leo.autoWalk([281,156]))
			.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalk([81,138]))
			.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
			.then(()=>leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.x == 319 && mapInfo.y == 139) {
					return true;
				}
				return false;
			}))
			.then(()=>leo.leaveTeam());
		}else{
			return leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.x == 319 && mapInfo.y == 139 && !leo.isInTeam()) {
					return true;
				}
				return false;
			});
		}
	})
	.then(()=>leo.autoWalk([319,148]))
	.then(()=>leo.waitNPCDialog(dialog => {
		cga.ClickNPCDialog(4, -1);
		return leo.delay(2000);
	}))
	.then(()=>leo.waitUntil(()=>{
		var mapInfo = cga.getMapInfo();
		if (mapInfo.name == '辛梅尔') {
			return true;
		}
		return false;
	}))
	.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
	.then(()=>leo.waitUntil(()=>{
		var mapInfo = cga.getMapInfo();
		if (mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59526) {
			return true;
		}
		return false;
	}))
	.then(()=>leo.log('天界1任务已完成，脚本结束'));
});