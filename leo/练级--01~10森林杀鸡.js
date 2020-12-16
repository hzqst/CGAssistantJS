require('./common').then(cga => {
    leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    var teamLeader = '此处填队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var protect = {
        minHp: 150,
        minMp: 100,
        minPetHp: 100,
        minPetMp: 60,
        minTeamNumber: 5
    };
    var teammates = [];
    var isPrepare = false; //招魂、治疗、补血、卖石
    var isLogBackFirst = false; //启动登出
    var meetingPoint = 1; //集合点1~3
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };
    
    leo.log('红叶の森林杀鸡脚本，推荐01~10级使用，启动~');
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
                    .then(() => {
                        if (isTeamLeader) {
                            cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                            return leo.autoWalk([155,100])
                            .then(() => leo.buildTeamBlock(teamPlayerCount));
                        } else {
                            return leo.autoWalk([154,100])
                            .then(() => leo.enterTeamBlock(teamLeader));
                        }
                    });
                }
            }).then(() => {
                //练级
                if (isTeamLeader) {
                    var currentMap = cga.GetMapName();
                    if (currentMap == '艾尔莎岛') {
                        return leo.autoWalk([157, 93])
                        .then(() => leo.turnDir(0))
                        .then(() => leo.delay(500));
                    }
                    if (currentMap == '艾夏岛') {
                        return leo.autoWalk([102,115,'冒险者旅馆'])
                        .then(() => leo.autoWalk([37,30]))
                        .then(() => leo.walkList([
                            [38,30],
                            [37,30],
                            [38,30],
                            [37,30]
                        ]))
                        .then(()=>leo.sell(37, 29))
                        .then(()=>leo.delay(3000))
                        .then(()=>leo.autoWalkList([
                            [38,48,'艾夏岛'],[112,81,'医院'],[35,46]
                        ]))
                        .then(() => leo.walkList([
                            [35,45],
                            [35,46],
                            [35,45],
                            [35,46]
                        ]))
                        .then(()=>leo.supply(36,46))
                        .then(()=>leo.statistics(leo.beginTime, leo.oldXp)) //打印统计信息
                        .then(()=>leo.autoWalkList([
                            [28,52,'艾夏岛'],[190,116,'盖雷布伦森林']
                        ]));
                    }
                    if (currentMap == '盖雷布伦森林') {
                        return leo.autoWalkList([
                            [225, 227],
                            [223, 227]
                        ])
                        .then(()=>{
                            console.log(leo.logTime() + '开始战斗');
                            return leo.encounterTeamLeader(protect) //队长遇敌
                            .then(() => {
                                console.log(leo.logTime() + "触发回补");
                                return leo.autoWalk([199,211,'艾夏岛']);
                            });
                        });
                    }
                } else {
                    var mapInfo = leo.getMapInfo();
                    if (mapInfo.name == '冒险者旅馆' && mapInfo.y == 30 && (mapInfo.x == 37 || mapInfo.y == 38)) {
                        return leo.sell(37, 29).then(() => leo.delay(2000));
                    }
                    if (mapInfo.name == '医院' && mapInfo.x == 35 && (mapInfo.y == 45 || mapInfo.y == 46)) {
                        return leo.supply(36,46).then(() => {
						    return leo.statistics(leo.beginTime, leo.oldXp);//打印统计信息
                        });
                    }
                    if (mapInfo.name.indexOf('盖雷布伦森林')!=-1){
                        return leo.encounterTeammate(protect, '盖雷布伦森林'); //队员遇敌
                    }
                }
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log));
    });
});