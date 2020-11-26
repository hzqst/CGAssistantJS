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

    leo.log('红叶の鲁村刷钱(定居哥城)脚本，启动~');
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

    var logBackG = async ()=>{
        await leo.loop(async ()=>{
            if(cga.getMapInfo().name=='哥拉尔镇' && cga.getMapInfo().x == 120 ){
                return leo.reject()
            }else{
                await leo.logBack()
            }
            return leo.delay(3000)
        })
    }
    var getBackSoul = async ()=>{
        var playerinfo = cga.GetPlayerInfo();
        if (playerinfo.souls > 0) {
            await leo.log('触发登出补给:人物掉魂')
            await logBackG()
            await leo.turnDir(6)
            await leo.delay(1000)
            await leo.autoWalkList([
                    [140,214,'白之宫殿'],
                    [47, 36, 43210],
                    [61, 46]
            ])
            await leo.talkNpc(0, leo.talkNpcSelectorYes)
            await leo.delay(1000)
            await logBackG()
        }
        return leo.done()
    }
    var healPlayer = async ()=>{
        var playerinfo = cga.GetPlayerInfo();
        if (playerinfo.health > 0) {
            await leo.log('触发登出补给:人物受伤')
            await logBackG()
            await leo.autoWalkList([
                [165,91,'医院'],[29,15]
            ])
            await leo.talkNpc(0, (dialog) => {
                cga.ClickNPCDialog(-1, 6);
                return false;
            })
            await leo.autoWalk([29,26])
            await leo.supply(30,26)
            await logBackG()
        }
        return leo.done()
    }
    var healPet = async ()=>{
        var pets = cga.GetPetsInfo();
        var petHurt = pets.findIndex(e => e.health > 0) > -1;
        if (petHurt) {
            await leo.log('触发登出补给:宠物受伤')
            await logBackG()
            await leo.autoWalkList([
                [165,91,'医院'],[29,15]
            ])
            await leo.talkNpc(0, (dialog) => {
                cga.ClickNPCDialog(-1, 6);
                return false;
            })
            await leo.autoWalk([29,26])
            await leo.supply(30,26)
            await logBackG()
        }
        return leo.done()
    }
    var checkHealth = ()=>{
        var playerinfo = cga.GetPlayerInfo();
        var petinfo = cga.GetPetInfo(playerinfo.petid);
        return leo.todo()
        .then(()=>{
            if(playerinfo.souls>0 || playerinfo.health>0 
                || (petinfo && petinfo.health>0)){
                return getBackSoul()
                .then(()=>healPlayer())
                .then(()=>healPet());
            }
        });
    }
    var buyCrystal = (crystalName, count = 1)=>{
        if (!crystalName) {
            crystalName = '水火的水晶（5：5）';
        }
        return logBackG()
        .then(()=>leo.autoWalkList([[146,117,'魔法店'],[18,12]]))
        .then(() => {
            return leo.talkNpc(0, dialog => {
                if (dialog.type == 5) {
                    cga.ClickNPCDialog(-1, 0);
                    return true;
                }
                if (dialog.type == 6) {
                    var store = cga.parseBuyStoreMsg(dialog);
                    if (!store) return leo.reject('商店内容解析失败');
                    var buyitem = [];
                    var buyCount = 0;
                    var emptySlotCount = cga.getInventoryEmptySlotCount();
                    store.items.forEach((it) => {
                        if (it.name.indexOf(crystalName) >= 0 && buyCount < emptySlotCount) {
                            buyitem.push({
                                index: it.index,
                                count: count
                            });
                            buyCount++;
                        }
                    });
                    if(emptySlotCount==0){
                        return leo.reject('背包没空间');
                    }
                    if (!buyitem.length){
                        return leo.reject('商店没有水晶出售，可能已被买完或者背包没空间');
                    }
                    cga.BuyNPCStore(buyitem);
                }
            }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
        });
        return leo.reject('购买失败');
    }
    var checkCrystal = async (crystalName, equipsProtectValue = 100)=>{
        if (!crystalName) {
            crystalName = '水火的水晶（5：5）';
        }
        //检查水晶的耐久
        var crystal = cga.GetItemsInfo().find(i => i.pos == 7);
        if(crystal && crystal.name == crystalName && cga.getEquipEndurance(crystal)[0] > equipsProtectValue){
            return leo.next();
        }else{
            //登回城买、换水晶
            return buyCrystal(crystalName,1)
            //.then(()=>leo.autoWalk([16,13]))
            .then(()=>leo.useItemEx(crystalName))
            .then(()=>leo.dropItemEx(crystalName))
            .then(()=>logBackG());
        }
    }

    var task = async () => {
        await leo.waitAfterBattle()
        await checkHealth()
        await checkCrystal(prepareOptions.crystalName)
        if(cga.GetPlayerInfo().gold >= 990000){
            await leo.log('钱包快满了：' + cga.GetPlayerInfo().gold + '去银行存钱')
            await logBackG()
            await leo.autoWalkList([[167,66,'银行'],[25,10]])
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
            await logBackG()
            await leo.autoWalk([176,105,'库鲁克斯岛'])
            await leo.autoWalk([476,526])
            await leo.talkNpc(477,526,leo.talkNpcSelectorYes);
            await leo.autoWalk([322,883,'鲁米那斯'])
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