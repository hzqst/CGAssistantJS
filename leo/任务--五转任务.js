require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    leo.baseInfoPrint();
    leo.logStatus = false;
    var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var target = 1;//1-地，2-水，3-火，4-风
    var entryEarth = [0,0]; //预设地洞坐标
    var entryExclude = [0,0]; //预设未来之塔坐标
    var protect = {
        minHp: 500,
        minMp: 100,
        minPetHp: 150,
        minPetMp: 0,
        maxItemNumber: 19,
        minTeamNumber: 5
    };
    var teammates = [];
    var isLogBackFirst = false; //启动登出
    var isPrepare = false; //招魂、治疗、补血、卖石
    var meetingPoint = 7; //集合点1~8
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
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
    var targetArr = ['地','地','水','火','风'];
    leo.log('红叶の五转任务脚本，位置点【' + meetingPoint + '】，目标【' + targetArr[target] + '洞】，启动~');
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
        return leo.waitAfterBattle()
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
                console.log(leo.logTime() + '寻找队伍，我是' + (isTeamLeader?'队长':'队员'));
                return leo.goto(n => n.camp.x)
                //.then(() => leo.autoWalk([100,85]))
                //.then(() => leo.talkNpc(6,leo.talkNpcSelectorYes))
                //.then(() => leo.talkNpc(6,leo.talkNpcSelectorYes))
                .then(() => {
                    var itemArr = cga.findItemArray('隐秘的水晶（'+targetArr[target]+'）');
                    //console.log(itemArr);
                    if(itemArr.length==0){
                        return leo.reject('身上没有隐秘的水晶（'+targetArr[target]+'），脚本结束');
                    }else if(itemArr.length>1){
                        for (var i = 0; i < itemArr.length; i++) {
                            if(i!=itemArr.length-1){
                                cga.DropItem(itemArr[i].itempos);
                            }else{
                                cga.MoveItem(itemArr[i].itempos, 8, -1);//移到第一格
                            }
                            
                        }
                    }else{
                        cga.MoveItem(itemArr[0].itempos, 8, -1);//移到第一格
                    }
                })
                .then(() => {
                    if (isTeamLeader) {
                        cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                        return leo.autoWalk(meetingPointTeamLeader[meetingPoint - 1])
                        .then(() => leo.buildTeam(teamPlayerCount,teammates)).then(() => {
                            var teamplayers = cga.getTeamPlayers();
                            //console.log(teamplayers);
                            if (teamplayers && teamplayers.length == teamPlayerCount) {
                                for (var i in teamplayers) {
                                    teammates[i] = teamplayers[i].name;
                                }
                            }
                            leo.log('组队完成，队员[' + teammates.toString() + ']');
                            return leo.next();
                        });
                    } else {
                        return leo.autoWalk(meetingPointTeammate[meetingPoint - 1]).then(() => leo.enterTeam(teamLeader)).then(() => {
                            leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
                            return leo.next();
                        });
                    }
                });
            }
        }).then(() => {
            if (isTeamLeader) {
                var currentMap = cga.GetMapName();
                if (currentMap == '圣骑士营地') {
                    return leo.autoWalkList([
                        [95, 72, '医院'],[9, 20]
                    ])
                    .then(() => leo.walkList([
                        [9, 11],
                        [9, 12],
                        [9, 11],
                        [9, 12]
                    ]))
                    .then(() => leo.supply(11, 11))
                    .then(() => leo.autoWalkList([
                        [0, 20, '圣骑士营地'],
                        [36, 87, '肯吉罗岛']
                    ]))
                    .then(()=>leo.next());
                }
                if(cga.GetMapName() == '隐秘之洞 地下10层'){
                    return leo.todo().then(() => {
                        if(targetArr[target] == '地'){
                            return leo.toRandomEntry(13,35,6,6);
                            //return leo.autoWalk([16,38,'隐秘之洞地下11层']);
                        }
                        if(targetArr[target] == '水'){
                            return leo.toRandomEntry(40,13,6,6);
                            //return leo.autoWalk([43,16,'隐秘之洞地下11层']);
                        }
                        if(targetArr[target] == '火'){
                            return leo.toRandomEntry(36,24,6,6);
                            //return leo.autoWalk([39,27,'隐秘之洞地下11层']);
                        }
                        if(targetArr[target] == '风'){
                            return leo.toRandomEntry(33,12,6,6);
                            //return leo.autoWalk([36,15,'隐秘之洞地下11层']);
                        }
                        // var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0 );
                        // if(mazeEntry && mazeEntry.length>0){
                        //     var entry11 = mazeEntry[0];
                        //     return leo.autoWalk([entry11.xpos,entry11.ypos,'隐秘之洞地下11层']);
                        // }else{
                        //     return leo.say('找不到迷宫入口，请手动走到隐秘之洞地下11层');
                        // }
                        return leo.next();
                    })
                    .then(()=>leo.waitUntil(()=>{
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.name == '隐秘之洞地下11层') {
                            return true;
                        }
                        return false;
                    }))
                    .then(()=>leo.walkRandomMazeUntil(() => {
                            var mn = cga.GetMapName();
                            if (mn == '隐秘之洞 最底层') {
                                return true;
                            }
                            return false;
                    },false))
                    .then(()=>leo.say('已到达BOSS前，请手动战斗，脚本结束'))
                    .then(()=>leo.reject());
                }
            } else {
                return leo.loop(
                    () => leo.waitAfterBattle().then(() => {
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.name == '工房' && mapInfo.x == 20 && (mapInfo.y == 22 || mapInfo.y == 23)) {
                            return leo.sell(21, 23).then(() => leo.delay(10000));
                        }
                        if (mapInfo.name == '医院' && mapInfo.x == 9 && (mapInfo.y == 11 || mapInfo.y == 12)) {
                            return leo.supply(11, 11);
                        }
                        if(mapInfo.name == '隐秘之洞 地下10层' && !leo.isInTeam()){
                            console.log(leo.logTime()+'到达10层');
                            return leo.loop(async ()=>{
                                const mapInfo2 = cga.getMapInfo();
                                if(mapInfo.x === mapInfo2.x && mapInfo.y === mapInfo2.y) {
                                    console.log(leo.logTime()+'使用道具【隐秘的水晶】');
                                    await leo.useItem(8)
                                }else{
                                    return leo.reject();
                                }
                                await leo.delay(2000)
                            })
                            .then(()=>leo.enterTeam(teamLeader)).then(() => {
                                leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']，队员脚本完成');
                                return leo.delay(5000);
                            });
                        }
                        return leo.delay(5000);
                    })
                    .catch (console.log)
                )
            }
        })
        .then(()=>{//找四属性洞入口
            if (isTeamLeader) {
                var targetEntryArr = {
                    '地' : [[498,273],[498,253],[498,233],[505,223],[515,233],[515,253],[515,273],[508,290],[515,293],[532,273],[532,263],[532,253],[532,243],[540,253],[549,256],[549,273],[549,293],[561,293],[566,298],[497,294]],
                    '水' : [[346,492],[354,514],[346,522],[340,513]],
                    '火' : [[432,427],[428,429],[442,415],[452,405]],
                    '风' : [[401,207],[395,223]]
                }
                var index = -1;
                var targetEntryAreaArr = targetEntryArr[targetArr[target]];
                if(target == 1 && entryEarth[0] > 0 && entryEarth[1] > 0){
                    targetEntryAreaArr.unshift(entryEarth);
                }
                var findHoleEntry = ()=>{
                    var mapInfo = leo.getMapInfo();
                    if(mapInfo.name == '隐秘之洞地下1层'){
                        if(target==1){
                            leo.log('迷宫入口坐标：'+entryEarth);
                        }
                        return leo.next();
                    }
                    if(mapInfo.name == '未来之塔入口第1层'){
                        return leo.autoWalk([mapInfo.x,mapInfo.y,'*'])
                        .then(()=>{
                            entryExclude = [cga.getMapInfo().x,cga.getMapInfo().y];
                            return findHoleEntry();
                        });
                    }
                    index++;
                    if(index >= targetEntryAreaArr.length){
                        return leo.reject('没有找到属性洞的入口');
                    }
                    if (mapInfo.name == '肯吉罗岛') {
                        return leo.autoWalk(targetEntryAreaArr[index])
                        .then(()=>{
                            var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & leo.UnitFlags.NpcEntry) && u.model_id > 0 && u.unit_name != '墨菲' && u.xpos != entryExclude[0] && u.ypos != entryExclude[1]);
                            if(mazeEntry && mazeEntry.length>0){
                                if(target==1){
                                    entryEarth = [mazeEntry[0].xpos,mazeEntry[0].ypos];
                                }
                                return leo.autoWalk([mazeEntry[0].xpos,mazeEntry[0].ypos,'*'])
                                .then(()=>findHoleEntry());
                            }else{
                                return findHoleEntry();
                            }
                        })
                    }
                }
                return findHoleEntry();
            }
        })
        .then(()=>{
            if (isTeamLeader) {
                var currentMap = cga.GetMapName();
                if (currentMap == '隐秘之洞地下1层') {
                    return leo.todo()
                    .then(()=>leo.walkRandomMazeUntil(() => {
                            var mn = cga.GetMapName();
                            if (mn == '隐秘之洞 地下10层') {
                                return true;
                            }
                            return false;
                    },false))
                    .then(()=>console.log(leo.logTime()+'到达10层'))
                    .then(()=>leo.delay(2000))
                    .then(()=>{
                        const mapInfo = cga.getMapInfo();
                        return leo.loop(async ()=>{
                            const mapInfo2 = cga.getMapInfo();
                            if(mapInfo.x === mapInfo2.x && mapInfo.y === mapInfo2.y) {
                                console.log(leo.logTime()+'使用道具【隐秘的水晶】');
                                await leo.useItem(8)
                            }else{
                                return leo.reject();
                            }
                            await leo.delay(2000)
                        })
                    })
                    .then(()=>leo.moveAround())
                    .then(() => leo.buildTeam(teamPlayerCount,teammates)).then(() => {
                        var teamplayers = cga.getTeamPlayers();
                        //console.log(teamplayers);
                        if (teamplayers && teamplayers.length == teamPlayerCount) {
                            for (var i in teamplayers) {
                                teammates[i] = teamplayers[i].name;
                            }
                        }
                        leo.log('组队完成，队员[' + teammates.toString() + ']');
                        return leo.next();
                    })
                    .then(() => {
                        if(targetArr[target] == '地'){
                            return leo.toRandomEntry(13,35,6,6);
                            //return leo.autoWalk([16,38,'隐秘之洞地下11层']);
                        }
                        if(targetArr[target] == '水'){
                            return leo.toRandomEntry(40,13,6,6);
                            //return leo.autoWalk([43,16,'隐秘之洞地下11层']);
                        }
                        if(targetArr[target] == '火'){
                            return leo.toRandomEntry(36,24,6,6);
                            //return leo.autoWalk([39,27,'隐秘之洞地下11层']);
                        }
                        if(targetArr[target] == '风'){
                            return leo.toRandomEntry(33,12,6,6);
                            //return leo.autoWalk([36,15,'隐秘之洞地下11层']);
                        }
                        // var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0 );
                        // if(mazeEntry && mazeEntry.length>0){
                        //     var entry11 = mazeEntry[0];
                        //     return leo.autoWalk([entry11.xpos,entry11.ypos,'隐秘之洞地下11层']);
                        // }else{
                        //     return leo.say('找不到迷宫入口，请手动走到隐秘之洞地下11层');
                        // }
                        return leo.next();
                    })
                    .then(()=>leo.waitUntil(()=>{
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.name == '隐秘之洞地下11层') {
                            return true;
                        }
                        return false;
                    }))
                    .then(()=>leo.walkRandomMazeUntil(() => {
                            var mn = cga.GetMapName();
                            if (mn == '隐秘之洞 最底层') {
                                return true;
                            }
                            return false;
                    },false))
                    .then(()=>leo.say('已到达BOSS前，请手动战斗，脚本结束'))
                    .then(()=>leo.done());
                }
            }
        })
        .catch (console.log)
    });
});