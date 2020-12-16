require('./common').then(cga => {
    leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    var teamLeader = '此处填队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var level = 1;  //指定楼层
    var usingpunchclock = false; //是否打卡
    var protect = {
        minHp: 500,
        minMp: 100,
        minPetHp: 150,
        minPetMp: 0,
        //maxItemNumber: 19,
        minTeamNumber: 5,
        normalNurse: false
    };
    var teammates = [];
    var isPrepare = false; //招魂、治疗、补血、卖石
    var isLogBackFirst = false; //启动登出
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '风地的水晶（5：5）',
        doctorName: '医道之殇'
    };
    
    leo.log('红叶の旧日迷宫脚本，楼层【' + level + '】，推荐115~125级使用，启动~');
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
        protect.minMp = 350; //队长是传教，回城魔值至少要大于等于一次祈祷的魔
        leo.log('我是队长，预设队伍人数【'+teamPlayerCount+'】');
    }else{
        leo.log('我是队员，队长是【'+teamLeader+'】');
    }

    var haojiao = () => {
        var item = leo.getItems('战斗号角');
        if(item.length > 0){
            return leo.next();
        }else{
            return leo.autoWalkList([
                [116,69,'总部1楼'],[86,50]
            ])
            .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
            .then(()=>leo.autoWalkList([[4,47,'圣骑士营地'],[115,74]]));
        }
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
                    .then(() => haojiao())
                    .then(() => {
                        return leo.autoWalkList([
                            [95, 72, '医院'],[9, 11]
                        ])
                        .then(() => leo.supply(10, 11))
                        .then(() => {
                            if(protect.normalNurse){//普通护士回补
                                return leo.autoWalk([18,15])
                                .then(()=>leo.supply(18, 14));
                            }
                        })
                        .then(() => leo.statistics(leo.beginTime, leo.oldXp))   //打印统计信息
                        .then(() => leo.autoWalkList([
                            [0, 20, '圣骑士营地'],[119, 81]
                        ]))
                        .then(() => leo.talkNpc(0,leo.talkNpcSelectorYes))
                        .then(() => leo.autoWalk([44,46]))
                        .then(() => leo.talkNpc(0,leo.talkNpcSelectorYes));
                    })
                    .then(() => {
                        if (isTeamLeader) {
                            cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                            return leo.autoWalk([7,8])
                            .then(() => leo.buildTeamBlock(teamPlayerCount));
                        } else {
                            return leo.enterTeamBlock(teamLeader);
                        }
                    });
                }
            }).then(() => {
                //黑一练级
                if (isTeamLeader) {
                    var mapInfo = leo.getMapInfo();
                    if (mapInfo.name == '迷宫入口' && mapInfo.indexes.index3 == 44710) {
                        return leo.autoWalk([9,5,'旧日迷宫第1层']);
                    }
                    if (mapInfo.name == ('旧日迷宫第'+level+'层')) {
                        //console.log(entryPos);
                        console.log(leo.logTime() + '开始战斗');
                        return leo.encounterTeamLeader(protect) //队长遇敌
                        .then(() => {
                            console.log(leo.logTime() + "登出回补");
                            return leo.logBack();
                        });
                    }
                    if (mapInfo.name == '旧日迷宫第1层') {
                        return leo.walkRandomMazeUntil(() => {
                                const mn = cga.GetMapName();
                                if (mn == ('旧日迷宫第'+level+'层')) {
                                    return true;
                                } else if (mn == '迷宫入口') {
                                    return leo.reject('迷宫刷新');
                                }
                        },false);
                    }
                } else {
                    var mapInfo = leo.getMapInfo();
                    if (mapInfo.name.indexOf('旧日迷宫')!=-1){
                        return leo.encounterTeammate(protect, '旧日迷宫'); //队员遇敌
                    }
                }
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log));
    });
});