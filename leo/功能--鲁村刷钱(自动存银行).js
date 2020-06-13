require('./common').then(cga => {
    leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.logStatus = false;
    var protect = {
        minHp: 300,
        minMp: 30,
        minPetHp: 300,
        minPetMp: 30,
        maxItemNumber: 19
    };
    var isPrepare = false; //招魂、治疗、补血、卖石
    var isLogBackFirst = false; //启动登出
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '火风的水晶（5：5）',
        doctorName: '医道之殇'
    };

    leo.log('红叶の鲁村刷钱(自动存银行)脚本，启动~');
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    
    //统计信息打印
    var oldGold = cga.GetPlayerInfo().gold;
    var getMoney = 0;
    var statistics = (beginTime) => {
        var playerinfo = cga.GetPlayerInfo();
        var nowTime = leo.now();
        var time = parseInt((nowTime - beginTime)/1000/60);//已持续练级时间
        time = time==0?1:time;
        getMoney += playerinfo.gold - oldGold;
        var avgMoney = parseInt(60 * getMoney/time);

        var content = `已持续刷钱【${time}】分钟，共获得【${getMoney}】魔币，平均每小时【${avgMoney}】魔币`;
        oldGold = playerinfo.gold;
        return leo.log(content);
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
            return leo.logBack()
            .then(() => leo.checkHealth(prepareOptions.doctorName))
            .then(() => leo.prepare(prepareOptions));
        } else {
            return leo.next();
        }
    }).then(() => {
        return leo.loop(
            () => leo.waitAfterBattle()
            .then(() => leo.checkHealth(prepareOptions.doctorName))
            .then(() => {
                //检查水晶的耐久
                var crystal = cga.GetItemsInfo().find(i => i.pos == 7);
                if(crystal && crystal.name == prepareOptions.crystalName && cga.getEquipEndurance(crystal)[0] > 100){
                    return leo.next();
                }else{
                    //登回城买、换水晶
                    return leo.buyCrystal(prepareOptions.crystalName,1)
                    //.then(()=>leo.autoWalk([16,13]))
                    .then(()=>leo.useItems(prepareOptions.crystalName))
                    .then(()=>leo.dropItem(prepareOptions.crystalName));
                }
            })
            .then(() => {
                //检查是否满魔币
                var playerinfo = cga.GetPlayerInfo();
                if (playerinfo.gold >= 990000) {
                    leo.log('钱包快满了：' + playerinfo.gold + '去银行存钱');
                    return leo.goto(n => n.falan.bank)
                    .then(()=>leo.turnDir(0))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_TOBANK))
                    .then(()=>{
                        playerinfo = cga.GetPlayerInfo();
                        if(playerinfo.gold >= 900000){
                            leo.log('钱包满了，银行也放不下了，脚本结束');
                            return leo.reject();
                        }else{
                            oldGold = playerinfo.gold;
                            return leo.next();
                        }
                    });
                }
            })
            .then(() => {
                var mapInfo = leo.getMapInfo();
                if (mapInfo.name == '库鲁克斯岛' && (mapInfo.x >= 290 && mapInfo.x <= 350) && (mapInfo.y >= 870 && mapInfo.y <= 890)) {
                    console.log(leo.logTime() + '开始战斗');
                    return leo.autoWalk([310,883])
                    .then(()=>leo.encounterTeamLeader(protect)) //队长遇敌
                    .then(() => {
                        console.log(leo.logTime() + "触发回补");
                        return leo.autoWalk([322,883,'鲁米那斯']).then(() => leo.delay(1000));
                    });
                }
                else if (mapInfo.name == '鲁米那斯'){
                    return leo.autoWalk([88, 51, '杂货店']);
                }
                else if (mapInfo.name == '杂货店'){
                    return leo.autoWalk([11, 12])
                    .then(()=>leo.sell(0))
                    .then(()=>leo.delay(5000))
                    .then(()=>leo.autoWalk([4, 13, '鲁米那斯']))
                    .then(()=>leo.autoWalk([87, 35, '医院']));
                }
                else if (mapInfo.name == '医院'){
                    return leo.autoWalk([17, 16])
                    .then(()=>leo.supplyDir(0))
                    .then(()=>leo.autoWalk([4, 14, '鲁米那斯']))
                    .then(()=>statistics(leo.beginTime))
                    .then(()=>leo.autoWalk([60, 29, '库鲁克斯岛']))
                    .then(()=>leo.autoWalk([310,883]));
                }
                else{
                    return leo.logBack()
                    .then(()=>leo.supplyCastle())
                    .then(()=>leo.sellCastle())
                    .then(()=>leo.goto(n => n.lumi.door));
                }
                
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log));
    });
});