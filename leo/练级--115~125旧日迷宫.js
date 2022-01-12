require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    leo.baseInfoPrint();                    //显示基础信息
    leo.moveTimeout = 20;                  //遇敌速度
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;   //关闭战斗状态提示
    //自动跟随队长换线，设置为true时，需要先提前与队长交换名片
    leo.monitor.config.autoChangeLineForLeader = false;
    var battleStatus = true;   //队长打印战斗明细
    var level = 1;  //指定楼层
    var usingpunchclock = false; //是否打卡

    let teams = [//自行修改角色名称，可以再加更多的队伍
        ['队长01','小号01','小号02','小号03','小号04'],
        ['队长02','小号05','小号06','小号07','小号08'],
        ['队长03','小号09','小号10','小号11','小号12'],
        ['队长04','小号13','小号14','小号15','小号16'],
        ['队长05','小号17','小号18','小号19','小号20'],
    ];

    let playerName = cga.GetPlayerInfo().name;
    let teammates = leo.findMyTeam(teams);
    if(teammates == null){
        await leo.log('红叶の旧日迷宫脚本，未找到队伍，请确认配置是否正确')
        return leo.delay(1000*60*60*2);
    }else{
        await leo.log('红叶の旧日迷宫脚本，楼层【' + level + '】，推荐115~125级使用，启动~');
        await leo.log('我的队伍是：['+teammates.join(',')+']')
    }
    let teamLeader = teammates[0];
    let teamPlayerCount = teammates.length;
    let isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
        await leo.log('我是队长，预设队伍人数【'+teamPlayerCount+'】');
        if(battleStatus){
            leo.battleMonitor.start(cga);
        }
    }else{
        await leo.log('我是队员，队长是【'+teamLeader+'】');
    }

    var protect = {
        //contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false, 
        minHp: 500,
        minMp: 100,
        minPetHp: 150,
        minPetMp: 0,
        maxItemNumber: 19,
        minTeamNumber: teamPlayerCount,
        normalNurse: false
    };
    var isPrepare = false; //招魂、治疗、补血、卖石
    var isLogBackFirst = false; //启动登出
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '风地的水晶（5：5）',
        doctorName: '医道之殇'
    };
    
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    if (isTeamLeader) {
        protect.minMp = 350; //队长是传教，回城魔值至少要大于等于一次祈祷的魔
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
                            .then(() => leo.buildTeamBlock(teamPlayerCount,teammates));
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