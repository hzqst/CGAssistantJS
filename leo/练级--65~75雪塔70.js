require('./common').then(cga => {
    leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    leo.monitor.config.equipsProtect = false;
    var teamLeader = '此处填队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var protect = {
        minHp: 150,
        minMp: 100,
        minPetHp: 100,
        minPetMp: 100,
        minTeamNumber: 5
    };
    var teammates = [];
    var isPrepare = false; //招魂、治疗、补血、卖石
    var isLogBackFirst = false; //启动登出
    var sellStone = true; //卖魔石
    var meetingPoint = 1; //集合点1~3
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '地水的水晶（5：5）',
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
    leo.log('红叶の雪塔70脚本，位置点【' + meetingPoint + '】，推荐65~75级使用，启动~');
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
        leo.log('我是队长，预设队伍人数【'+teamPlayerCount+'】');
    }else{
        leo.log('我是队员，队长是【'+teamLeader+'】');
    }

    leo.todo().then(() => {
        //登出
        if (isLogBackFirst) {
            return leo.logBack();
        } else {
            return leo.next();
        }
    }).then(() => {
        //招魂、治疗、补血、卖石
        if (isPrepare) {
            return leo.logBack().then(() => leo.prepare(prepareOptions));
        } else {
            return leo.next();
        }
    }).then(() => {
        return leo.loop(
            () => leo.waitAfterBattle()
            .then(() => leo.checkHealth(prepareOptions.doctorName))
            //.then(() => leo.checkCrystal(prepareOptions.crystalName))
            .then(() => {
                //完成组队
                var teamplayers = cga.getTeamPlayers();
                if ((isTeamLeader && teamplayers.length >= protect.minTeamNumber)
                		|| (!isTeamLeader && teamplayers.length > 0)) {
                    //console.log('组队已就绪');
                    return leo.next();
                } else {
                    console.log(leo.logTime() + '寻找队伍');
                    return leo.logBack()
                    .then(() => leo.autoWalk([165,153]))
                    .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'))
                    .then(()=>leo.autoWalk([90,99,'国民会馆']))
                    //.then(()=>leo.autoWalk([108,51]))
                    //.then(()=>leo.supplyDir(2))
                    .then(()=>{
                        if(sellStone){
                            return leo.autoWalkList([
                                [110, 43]
                            ])
                            .then(() => leo.sell(110, 42))
                            //.then(() => leo.delay(10000));
                        }
                    })
                    .then(() => {
                        if (isTeamLeader) {
                            cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                            return leo.autoWalk(meetingPointTeamLeader[meetingPoint - 1])
                            .then(() => leo.buildTeamBlock(teamPlayerCount));
                        } else {
                            return leo.autoWalk(meetingPointTeammate[meetingPoint - 1])
                            .then(() => leo.enterTeamBlock(teamLeader));
                        }
                    });
                }
            }).then(() => {
                //练级
                if (isTeamLeader) {
                    var currentMap = cga.GetMapName();
                    if (currentMap == '国民会馆') {
                        return leo.todo()
                        .then(() => leo.autoWalk([107,52]))
                        .then(() => leo.walkList([
                            [107, 51],
                            [107, 52],
                            [107, 51],
                            [107, 52]
                        ]))
                        .then(()=>leo.supply(108, 52))
                        .then(()=>leo.statistics(leo.beginTime, leo.oldXp)) //打印统计信息
                        .then(()=>leo.autoWalk([108,39,'雪拉威森塔１层']));
                    }
                    if (currentMap == '雪拉威森塔１层') {
                        return leo.autoWalkList([
                            [75, 50, '雪拉威森塔５０层'],
                            [21, 55, '雪拉威森塔７０层']
                        ]);
                    }
                    if (currentMap == '雪拉威森塔７０层') {
                        //console.log(entryPos);
                        console.log(leo.logTime() + '开始战斗');
                        return leo.encounterTeamLeader(protect) //队长遇敌
                        .then(() => {
                            console.log(leo.logTime() + "登出回补");
                            return leo.logBack();
                        });
                    }
                } else {
                    var mapInfo = leo.getMapInfo();
                    if (mapInfo.name == '国民会馆' && mapInfo.y == 43 && (mapInfo.x == 109 || mapInfo.x == 110)) {
                        //return leo.sell(110, 42).then(() => leo.delay(2000));
                    }
                    if (mapInfo.name == '国民会馆' && mapInfo.x == 107 && (mapInfo.y == 51 || mapInfo.y == 52)) {
                        return leo.supply(108, 52)
                        .then(() => {
						    return leo.statistics(leo.beginTime, leo.oldXp);//打印统计信息
                        });
                    }
                    if (mapInfo.name.indexOf('雪拉威森塔７０层')!=-1){
                        return leo.encounterTeammate(protect, '雪拉威森塔７０层'); //队员遇敌
                    }
                }
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log));
    });
});