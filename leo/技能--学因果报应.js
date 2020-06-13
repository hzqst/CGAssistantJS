require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '绿茵之殇'; //队长名称
    var teamPlayerCount = 1; //队伍人数

	var isLogBackFirst = true;

	leo.log('红叶の学因果报应技能脚本，启动~');

	var meetingPoint = 1; //集合点1~3
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var meetingPointTeamLeader = [
        [113, 48],
        [113, 51],
        [113, 54]
    ];
    var meetingPointTeammate = [
        [112, 48],
        [112, 51],
        [112, 54]
    ];
	var teammates = [];
	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }
    if (teamPlayerCount <= 1){
    	isTeamLeader = true;
    }

	leo.todo().then(()=>{
		if(isLogBackFirst){
			return leo.logBack();
		}else{
			return leo.next();
		}
	})
	.then(() => leo.checkHealth(prepareOptions.doctorName))
	.then(() => leo.autoWalk([165,153]))
    .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'))
    .then(()=>leo.autoWalk([90,99,'国民会馆']))
	.then(() => {
        //完成组队
        var teamplayers = leo.getTeamPlayerAll();
        if ((isTeamLeader && teamplayers.length >= teamPlayerCount)
        		|| (!isTeamLeader && teamplayers.length > 1)) {
            //console.log('组队已就绪');
            return leo.next();
        } else {
            console.log(leo.logTime() + '寻找队伍');
            if (isTeamLeader) {
                cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                return leo.autoWalk(meetingPointTeamLeader[meetingPoint - 1])
                .then(() => leo.buildTeamBlock(teamPlayerCount));
            } else {
                return leo.autoWalk(meetingPointTeammate[meetingPoint - 1])
                .then(() => leo.enterTeamBlock(teamLeader));
            }
        }
    })
	.then(()=>{
		if(isTeamLeader){
			return leo.autoWalkList([
				[108,39,'雪拉威森塔１层'],
				[75,50,'雪拉威森塔５０层'],
				[63,34,'雪拉威森塔５１层'],
				[149,108,'雪拉威森塔５２层'],
				[101,64]
			])
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('拿红色蜡烛'))
			.then(()=>leo.talkNpc(102,64,leo.talkNpcSelectorYes))
			.then(()=>leo.delay(10000))
			.then(()=>leo.autoWalkList([
				[70,105,'雪拉威森塔５３层'],
				[118,137,'雪拉威森塔５４层'],
				[84,45]
			]))
			.then(()=>leo.forceMoveEx(4))
			.then(()=>leo.forceMoveEx(0))
			.then(()=>leo.forceMoveEx(4))
			.then(()=>leo.forceMoveEx(0))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('拿藏宝图'))
			.then(()=>leo.talkNpc(84,44,leo.talkNpcSelectorYes))
			.then(()=>leo.delay(10000))
			.then(()=>leo.autoWalkList([
				[87,53,'雪拉威森塔５３层'],
				[70,105,'雪拉威森塔５２层'],
				[101,64]
			]))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('向NPC交任务'))
			.then(()=>leo.talkNpc(102,64,leo.talkNpcSelectorYes))
			.then(()=>leo.moveAround())
			.then(()=>leo.buildTeamBlock(teamPlayerCount))
			.then(()=>leo.autoWalkList([[108,54],[110,54],[108,54]]))
			.then(()=>leo.log('到达目标地点！请自行手动学习技能~~'));
		}else{
			return leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('拿红色蜡烛') >= 0) {
					leo.talkNpc(102,64,leo.talkNpcSelectorYes)
					.then(()=>leo.log('已拿到红色蜡烛'));
				}
				if (chat.msg && chat.msg.indexOf('拿藏宝图') >= 0) {
					leo.talkNpc(84,44,leo.talkNpcSelectorYes)
					.then(()=>leo.log('已拿到藏宝图'));
				}
				if (chat.msg && chat.msg.indexOf('向NPC交任务') >= 0) {
					leo.talkNpc(102,64,leo.talkNpcSelectorYes)
					.then(()=>leo.enterTeamBlock(teamLeader));
				}
				if (chat.msg && chat.msg.indexOf('到达目标地点') >= 0) {
					console.log('到达目标地点！请自行手动学习技能~~');
					return true;
				}
			});
		}
	})
	.then(()=>leo.log('脚本结束'));
});