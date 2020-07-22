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

    leo.log('红叶の鲁村刷钱(定居新城)脚本，启动~');
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


    var task = async () => {
        await leo.waitAfterBattle()
        await leo.checkHealth(prepareOptions.doctorName)
        await leo.checkCrystal(prepareOptions.crystalName)
        if(cga.GetPlayerInfo().gold >= 990000){
            await leo.log('钱包快满了：' + cga.GetPlayerInfo().gold + '去银行存钱')
            await leo.goto(n => n.falan.bank)
            await leo.turnDir(0)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            await leo.moveGold(100000,cga.MOVE_GOLD_TOBANK)
            if(cga.GetPlayerInfo().gold >= 990000){
                await leo.log('钱包满了，银行也放不下了，脚本结束')
                throw '脚本结束';
            }else{
                oldGold = cga.GetPlayerInfo().gold;
            }
        }
        var mapInfo = leo.getMapInfo();
        if (mapInfo.name == '库鲁克斯岛' && (mapInfo.x >= 290 && mapInfo.x <= 350) && (mapInfo.y >= 870 && mapInfo.y <= 890)) {
            console.log(leo.logTime() + '开始战斗');
            await leo.autoWalk([310,883])
            await leo.encounterTeamLeader(protect)  //队长遇敌
            console.log(leo.logTime() + "触发回补");
            await leo.autoWalk([322,883,'鲁米那斯'])
            await leo.delay(1000)
        }
        else if (mapInfo.name == '鲁米那斯'){
            await leo.autoWalk([88, 51, '杂货店'])
        }
        else if (mapInfo.name == '杂货店'){
            await leo.autoWalk([11, 12])
            await leo.sell(0)
            await leo.delay(5000)
            await leo.autoWalk([4, 13, '鲁米那斯'])
            await leo.autoWalk([87, 35, '医院'])
        }
        else if (mapInfo.name == '医院'){
            await leo.autoWalk([17, 16])
            await leo.supplyDir(0)
            await leo.autoWalk([4, 14, '鲁米那斯'])
            await statistics(leo.beginTime)
            await leo.autoWalk([60, 29, '库鲁克斯岛'])
            await leo.autoWalk([310,883])
        }
        else{
            await leo.logBack()
            await leo.supplyCastle()
            await leo.sellCastle()
            await leo.goto(n => n.lumi.door)
        }
    }

    //循环
    leo.loop(async ()=>{
        try{
            await task();
        }catch(e){
            if(e == '脚本结束'){
                return leo.reject();
            }
            console.log(leo.logTime()+'脚本出错:'+e);
            console.log(leo.logTime()+'重新开始');
        }
    })

});