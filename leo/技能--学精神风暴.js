require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '绿茵之殇'; //队长名称
    var teamPlayerCount = 1; //队伍人数

	var isLogBackFirst = true;

	leo.log('红叶の学精神风暴技能脚本，启动~');

	var meetingPoint = 2; //集合点1~3
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
				[16,44,'雪拉威森塔９５层'],
				[99,44,'雪拉威森塔９４层'],
				[89,134,'雪拉威森塔９３层'],
				[73,137]
			])
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('拿生锈的钥匙'))
			.then(()=>leo.talkNpc(72,137,leo.talkNpcSelectorYes))
			.then(()=>leo.delay(10000))
			.then(()=>leo.autoWalkList([
				[53,99]
			]))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('拿合成入门'))
			.then(()=>leo.talkNpc(54,98,leo.talkNpcSelectorYes))
			.then(()=>leo.delay(10000))
			.then(()=>leo.autoWalkList([
				[117,155]
			]))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('拿人面树'))
			.then(()=>leo.talkNpc(118,154,leo.talkNpcSelectorYes))
			.then(()=>leo.delay(10000))
			.then(()=>leo.autoWalkList([
				[165,112]
			]))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('拿夜鸣草'))
			.then(()=>leo.talkNpc(166,111,leo.talkNpcSelectorYes))
			.then(()=>leo.delay(10000))
			.then(()=>leo.autoWalkList([
				[113,55]
			]))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('拿罗查的牙'))
			.then(()=>leo.talkNpc(114,54,leo.talkNpcSelectorYes))
			.then(()=>leo.delay(10000))
			.then(()=>leo.autoWalkList([
				[73,137]
			]))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.forceMoveEx(2))
			.then(()=>leo.forceMoveEx(6))
			.then(()=>leo.waitAfterBattle())
			.then(()=>leo.log('对话NPC'))
			.then(()=>leo.talkNpc(72,137,leo.talkNpcSelectorYes))
			.then(()=>leo.log('到达目标地点！请自行手动学习技能~~'));
		}else{
			return leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('拿生锈的钥匙') >= 0) {
					leo.talkNpc(72,137,leo.talkNpcSelectorYes)
					.then(()=>leo.log('已拿到生锈的钥匙'));
				}
				if (chat.msg && chat.msg.indexOf('拿合成入门') >= 0) {
					leo.talkNpc(54,98,leo.talkNpcSelectorYes)
					.then(()=>leo.log('已拿到合成入门'));
				}
				if (chat.msg && chat.msg.indexOf('拿人面树') >= 0) {
					leo.talkNpc(118,154,leo.talkNpcSelectorYes)
					.then(()=>leo.log('已拿到人面树'));
				}
				if (chat.msg && chat.msg.indexOf('拿夜鸣草') >= 0) {
					leo.talkNpc(166,111,leo.talkNpcSelectorYes)
					.then(()=>leo.log('已拿到夜鸣草'));
				}
				if (chat.msg && chat.msg.indexOf('拿罗查的牙') >= 0) {
					leo.talkNpc(114,54,leo.talkNpcSelectorYes)
					.then(()=>leo.log('已拿到罗查的牙'));
				}
				if (chat.msg && chat.msg.indexOf('对话NPC') >= 0) {
					leo.talkNpc(72,137,leo.talkNpcSelectorYes);
					console.log('到达目标地点！请自行手动学习技能~~');
					return true;
				}
			});
		}
	})
	.then(()=>leo.log('脚本结束'));
});