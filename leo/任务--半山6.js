require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 1; //队伍人数

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の半山6脚本，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }
    if(teamPlayerCount<=1){
    	teamPlayerCount = 1;
    	isTeamLeader = true;
    }

    await leo.dropItemEx('锄头')
    await leo.logBack()
    await leo.checkHealth(prepareOptions.doctorName)
    await leo.goto(n => n.castle.x)
    await leo.autoWalkList([
    	[41, 50,'里谢里雅堡 1楼'],[74, 19,'里谢里雅堡 2楼'],[0, 74,'图书室'],[27, 16]
    ])
    await leo.talkNpc(6, leo.talkYes, '小岛')
    if(isTeamLeader){
    	await leo.moveAround()
    	await leo.buildTeamBlock(teamPlayerCount)
    	await leo.autoWalk([64, 45, '通往山顶的路100M'])
    	await leo.walkRandomMazeUntil(() => {
			if (cga.GetMapName() == '半山腰') {
				return true;
			}
			return false;
		},false)
    	await leo.autoWalkList([
    		[80, 56],[80, 57],[80, 56],[80, 57],[80, 56]
    	])
    	await leo.leaveTeam()
    	await leo.talkNpc(81,56,leo.talkYes,'圣山内部')
    	await leo.moveAround()
    	await leo.buildTeamBlock(teamPlayerCount)
    	await leo.autoWalk([19, 7,'通往地狱的道路地下1层'])
    	await leo.walkRandomMazeUntil(() => {
			if (cga.GetMapName() == '地狱入口') {
				return true;
			}
			return false;
		},false)
		await leo.autoWalkList([
    		[24, 26],[25, 25],[24, 26],[25, 25],[24, 26]
    	])
    	await leo.leaveTeam()
    	await leo.talkNpc(24, 25, leo.talkYes,'圣山之巅')
    	await leo.autoWalk([23, 23])
    	await leo.talkNpc(6, leo.talkYes,'法兰城')
    }else{
    	await leo.enterTeamBlock(teamLeader)
    	await leo.loop(async ()=>{
    		if(leo.isInTeam()){
    			if(cga.GetMapName()=='半山腰'){
    				await leo.talkNpc(81,56,leo.talkYes,'圣山内部')
    				await leo.enterTeamBlock(teamLeader)
    			}else if(cga.GetMapName()=='半山腰'){
    				await leo.talkNpc(24, 25, leo.talkYes,'圣山之巅')
    				await leo.autoWalk([23, 23])
    				await leo.talkNpc(6, leo.talkYes,'法兰城')
    				return leo.reject();
    			}else{
    				return leo.exit();
    			}
    		}
    		await leo.delay(3000)
    	})
    }
    await leo.log('半山6任务已完成')

});