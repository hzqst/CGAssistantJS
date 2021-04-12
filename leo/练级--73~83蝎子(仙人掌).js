require('./common').then(cga => {
    leo.baseInfoPrint();
    leo.moveTimeout = 220;
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.logStatus = false;
    var teamLeader = '此处填写队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var fightType = 1;//0-蝎子，1-仙人掌
    var usingpunchclock = false; //是否打卡
    var protect = {
        minHp: 500,
        minMp: 100,
        minPetHp: 150,
        minPetMp: 100,
        maxItemNumber: 21,
        minTeamNumber: 5,
        normalNurse: false
    };
    var teammates = [];
    var isLogBackFirst = false; //启动登出
    var isPrepare = false; //招魂、治疗、补血、卖石
    var sellStone = true; //卖魔石
    var meetingPoint = 4; //集合点1~8
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '火风的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var meetingPointTeamLeader = [
        [97, 85],
        [98, 85],
        [99, 85],
        [100, 85],
        [97, 83],
        [98, 83],
        [99, 83],
        [100, 83]
    ];
    var meetingPointTeammate = [
        [97, 86],
        [98, 86],
        [99, 86],
        [100, 86],
        [97, 84],
        [98, 84],
        [99, 84],
        [100, 84]
    ];
    leo.log('红叶の蝎子(仙人掌)脚本，位置点【' + meetingPoint + '】，推荐73~83级使用，启动~');
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
    if(teamPlayerCount <= 1){
        isTeamLeader = true;
        protect.minTeamNumber = 1;
    }
    if(isTeamLeader){
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
            .then(() => leo.checkCrystal(prepareOptions.crystalName))
            .then(() => {
                //完成组队
                var teamplayers = cga.getTeamPlayers();
                if ((isTeamLeader && teamplayers.length >= protect.minTeamNumber)
                		|| (!isTeamLeader && teamplayers.length > 0)) {
                    //console.log('组队已就绪');
                    return leo.next();
                } else {
                    console.log(leo.logTime() + '寻找队伍');
                    return leo.todo()
                    .then(()=>{
                        if(usingpunchclock){
                            return leo.goto(n => n.castle.clock)
                            .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes));
                        }
                    })
                    .then(()=>leo.goto(n => n.camp.x))
                    .then(() => {
                        if (isTeamLeader) {
                            cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                            return leo.autoWalk(meetingPointTeamLeader[meetingPoint - 1]).then(() => leo.buildTeam(teamPlayerCount,teammates)).then(() => {
                                var teamplayers = leo.getTeamPlayerAll();
                                //console.log(teamplayers);
                                if (teamplayers && teamplayers.length == teamPlayerCount) {
                                    for (var i in teamplayers) {
                                        teammates[i] = teamplayers[i].name;
                                    }
                                }
                                leo.log('组队完成，队员[' + teammates.toString() + ']');
                                cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
                                return leo.next();
                            });
                        } else {
                            return leo.autoWalk(meetingPointTeammate[meetingPoint - 1]).then(() => leo.enterTeam(teamLeader)).then(() => {
                                leo.log('已进入队伍，队长[' + leo.getTeamPlayerAll()[0].name + ']');
                                return leo.next();
                            });
                        }
                    });
                }
            }).then(() => {
                //蝎子仙人掌练级
                if (isTeamLeader) {
                    var currentMap = cga.GetMapName();
                    var mapInfo = leo.getMapInfo();
                    if (currentMap == '艾尔莎岛') {
                        return leo.goto(n => n.camp.x);
                    }

                    if (currentMap == '圣骑士营地') {
                        return leo.autoWalkList([
                            [87, 72, '工房'],
                            [20, 23]
                        ]).then(() => leo.walkList([
                            [20, 22],
                            [20, 23],
                            [20, 22]
                        ])).then(() => leo.sell(21, 23)).then(() => leo.delay(5000));
                    }
                    if (currentMap == '工房') {
                        return leo.autoWalkList([
                            [30, 37, '圣骑士营地'],
                            [95, 72, '医院']
                        ]);
                    }
                    if (currentMap == '医院') {
                        return leo.autoWalkList([
                            [9, 20]
                        ])
                        .then(() => leo.walkList([
                            [9, 11],
                            [9, 12],
                            [9, 11],
                            [9, 12]
                        ]))
                        .then(() => leo.supply(11, 11))
                        .then(() =>{
                            if(protect.normalNurse){//普通护士回补
                                return leo.autoWalk([18,15])
                                .then(()=>leo.walkList([
                                    [17,15],[18,15],[17,15],[18,15]
                                ]))
                                .then(()=>leo.supply(18, 14));
                            }
                        })
                        .then(() => leo.autoWalkList([
                            [0, 20, '圣骑士营地'],
                            [36, 87, '肯吉罗岛'],
                            [547, 332]
                        ]));
                    }
                    if (currentMap == '肯吉罗岛' && mapInfo.x > 300) {
                        return leo.autoWalkList([
                            [384, 245,'蜥蜴洞穴'],[12, 2,'肯吉罗岛'],[231,434,'矮人城镇']
                        ]);
                    }
                    if (currentMap == '矮人城镇') {
                        return leo.autoWalk([121, 110])
                        .then(() => {
                            if(sellStone){
                                return leo.walkList([
                                    [121, 109],
                                    [121, 110],
                                    [121, 109],
                                    [121, 110]
                                ])
                                .then(() => leo.sell(122, 110))
                                .then(() => leo.delay(5000));
                            }
                        })
                        .then(() => leo.autoWalk([163, 95]))
                        .then(() => leo.supplyDir(0))
                        .then(() => leo.delay(2000))
                        .then(() => leo.statistics(leo.beginTime, leo.oldXp))   //打印统计信息
                        .then(() => leo.autoWalk([110,191,'肯吉罗岛']))
                    }
                    if (currentMap == '肯吉罗岛' && mapInfo.x < 300) {
                        var fightPos = [231,438];//蝎子
                        if(fightType==1){
                            fightPos = [231,435];//仙人掌
                        }
                        return leo.autoWalk([231,436])
                        .then(() => leo.autoWalk(fightPos))
                        .then(() => leo.encounterTeamLeader(protect))  //队长遇敌
                        .then(() => leo.delay(2000))
                        .then(() => {
                            console.log(leo.logTime() + "触发回补");
                            return leo.autoWalk([231,434,'矮人城镇'])
                            .then(() => leo.delay(2000));
                        });
                    }
                } else {
                    var mapInfo = leo.getMapInfo();
                    if (mapInfo.name == '工房' && mapInfo.x == 20 && (mapInfo.y == 22 || mapInfo.y == 23)) {
                        return leo.sell(21, 23).then(() => leo.delay(10000));
                    }
                    if (mapInfo.name == '医院' && mapInfo.x == 9 && (mapInfo.y == 11 || mapInfo.y == 12)) {
                        return leo.supply(11, 11);
                    }
                    if (mapInfo.name == '矮人城镇' && mapInfo.x == 121 && (mapInfo.y == 109 || mapInfo.y == 110)) {
                        return leo.sell(122, 110).then(() => leo.delay(10000));
                    }
                    if (mapInfo.name == '矮人城镇' && mapInfo.x > 150) {
                        return leo.statistics(leo.beginTime, leo.oldXp)
                        .then(()=>leo.delay(30000)); //打印统计信息
                    }
                    if (mapInfo.name == '肯吉罗岛') {
                        return leo.encounterTeammate(protect, '肯吉罗岛'); //队员遇敌
                    }
                }
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log)
        );
    });
});