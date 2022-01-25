require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    leo.baseInfoPrint();
    var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var teammates = [];

    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.autoHp = false;
    leo.monitor.config.autoHpValue = 500;
    leo.monitor.config.autoHpItem = '小护士家庭号';
    leo.monitor.config.autoMp = false;
    leo.monitor.config.autoMpValue = 350;
    leo.monitor.config.autoMpItem = '魔力之泉';

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队

    var protect = {
        minHp: 500,
        minMp: 100,
        minPetHp: 150,
        minPetMp: 0,
        maxItemNumber: 19,
        minTeamNumber: 5
    };

    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };

    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

    leo.log('红叶の海神刷勾玉脚本，启动~');

    leo.loop(
        () => leo.waitAfterBattle()
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
                .then(()=>leo.gotoAKLF())
                .then(()=>leo.autoWalkList([[117,155,'夏姆吉诊所'],[22,17]]))
                .then(()=>leo.supplyDir(6))
                .then(()=>leo.delay(5000))
                .then(()=>{
                    if(isTeamLeader){
                        return leo.autoWalk([23,17])
                        .then(()=>leo.buildTeamBlock(teamPlayerCount))
                        .then(()=>leo.autoWalkList([
                            [16,23,'阿凯鲁法村'],[178,227,'米内葛尔岛'],
                            [283,457,'南恰拉山第1通路'],[10,61,34001],
                            [11,2,34000],[37,5,'米内葛尔岛'],[314,399,'南恰拉山第2通路'],
                            [31,9],[31,10],[31,9],[31,10],[31,9]
                        ]))
                        .then(()=>leo.leaveTeam())
                        .then(()=>leo.talkNpc(32,9,leo.talkNpcSelectorYes,'时波之祠'))
                        .then(()=>leo.autoWalk([9,7]))
                        .then(()=>leo.buildTeamBlock(teamPlayerCount)); 
                    }else{
                        return leo.enterTeamBlock(teamLeader)
                        .then(()=>leo.waitUntil(()=>{
                            var mapInfo = cga.getMapInfo();
                            if (mapInfo.name == '南恰拉山第2通路' && !leo.isInTeam()) {
                                return true;
                            }
                            return false;
                        }))
                        .then(()=>leo.talkNpc(32,9,leo.talkNpcSelectorYes,'时波之祠'))
                        .then(()=>leo.enterTeamBlock(teamLeader));
                    }
                })
            }
        })
        .then(()=>{
            var mapInfo = leo.getMapInfo();
            if(isTeamLeader){
                if(mapInfo.name == '时波之祠'){
                    return leo.autoWalk([9,4,'时波之祠地下1楼']);
                }
                if(mapInfo.name == '时波之祠地下1楼'){
                    return leo.encounterTeamLeader(protect)
                    .then(() => {
                        console.log(leo.logTime() + "登出回补");
                        return leo.logBack();
                    });
                }
            }else{
                if(mapInfo.name == '时波之祠地下1楼'){
                    return leo.encounterTeammate(protect, '时波之祠地下1楼'); //队员遇敌
                }
            }
            return leo.delay(3000);
        })
        .catch(console.log)
    )
    .catch(console.log);

});