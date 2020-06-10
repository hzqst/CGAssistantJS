require('./common').then(cga => {
    leo.baseInfoPrint();
    var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var teammates = [];
    var isPrepare = true; //招魂、治疗、补血、卖石
    var isLogBackFirst = false; //启动登出
    var meetingPoint = 1; //集合点1~4
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        //crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var meetingPointTeamLeader = [
        [150, 94],
        [152, 94],
        [154, 94],
        [156, 94]
    ];
    var meetingPointTeammate = [
        [150, 95],
        [152, 95],
        [154, 95],
        [156, 95]
    ];
    var targetPoint = [143, 107]; //集合好后，移动到的坐标
    leo.log('红叶の自动组队脚本，启动~');
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
    leo.todo().then(() => {
        if (isLogBackFirst) {
            return leo.logBack();
        } else {
            return leo.next();
        }
    }).then(() => {
        if (isPrepare) {
            return leo.logBack().then(() => leo.prepare(prepareOptions));
        } else {
            return leo.next();
        }
    }).then(() => leo.goto(n => n.elsa.x)).then(() => {
        if (isTeamLeader) {
            return leo.autoWalk(meetingPointTeamLeader[meetingPoint - 1]).then(() => leo.buildTeam(teamPlayerCount)).then(() => leo.autoWalk(targetPoint)).then(() => {
                var teamplayers = cga.getTeamPlayers();
                //console.log(teamplayers);
                if (teamplayers && teamplayers.length == teamPlayerCount) {
                    for (var i in teamplayers) {
                        teammates[i] = teamplayers[i].name;
                    }
                }
                leo.log('组队完成，队员[' + teammates.toString() + ']');
                return leo.done();
            });
        } else {
            return leo.autoWalk(meetingPointTeammate[meetingPoint - 1]).then(() => leo.enterTeam(teamLeader)).then(() => {
                leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
                return leo.done();
            });
        }
    });
});