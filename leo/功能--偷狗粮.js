require('./common').then(cga=>{
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;

    var itemName = "其他？";

    var protect = {
        minHp: 200,
        minMp: 100,
        minPetHp: 200,
        minPetMp: 150,
        check: ()=>{
            var playerinfo = cga.GetPlayerInfo();
            var petinfo = cga.GetPetInfo(playerinfo.petid);
            if(playerinfo.hp <= protect.minHp ||
                playerinfo.mp <= protect.minMp ||
                petinfo.hp <= protect.minPetHp ||
                petinfo.mp <= protect.minPetMp){
                return true;
            }else{
                return false;
            }
        }
    };

    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };

    var isLogBackFirst = false;     //启动脚本先登出
    var isPrepare = false;          //招魂、治疗、补血、卖石

    var playerinfo = cga.GetPlayerInfo();
    var value_charisma = playerinfo.detail.value_charisma;//魅力值
    var petinfo = cga.GetPetInfo(playerinfo.petid);
    var gold = playerinfo.gold;//金钱

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false);   //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false);   //关闭组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false);       //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);      //关闭交易

    leo.log('红叶の偷狗粮脚本，启动~');
    leo.log('当前人物魅力【'+value_charisma+'】，金钱【'+gold+'】。');

    //统计类信息
    var stealCount = 0;//盗窃次数(此处实际是战斗次数，如果一次战斗盗窃技能使用2次，则应该乘2)
    var playerHurtCount = 0;    //人物受伤次数
    var petHurtCount = 0;       //宠物受伤次数
    var itemArray = cga.findItemArray(itemName);
    var itemCountOld = itemArray?itemArray.length:0;
    leo.log('身上已有狗粮未鉴定道具数量【'+itemCountOld+'】');

    var targetFinder = (units) => {
        return units.find(u => u.unit_name == '冒险者金德其' && u.type == 1 
            && (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0);
    }

    var todo = (target) => {
        return leo.todo()
        .then(() => leo.talkNpc(target.xpos, target.ypos, leo.talkNpcSelectorYes))
        .then(() => {
            if(cga.getItemCount('牛鬼杀')>=0){
                return leo.log('拿到了牛鬼杀');
            }else if(cga.getItemCount('酒？')>=0){
                return leo.log('拿到了酒？');
            }else{
                return leo.log('没拿到通行道具');
            }
        })
        .then(() => leo.autoWalk([target.entry.x, target.entry.y, '*'],undefined,undefined,{compress: false}));
    }

    leo.todo().then(()=>{
        //登出
        if(isLogBackFirst){
            return leo.logBack();
        }else{
            return leo.next();
        }
    })
    .then(()=>{
        //招魂、治疗、补血、卖石
        if(isPrepare){
            return leo.logBack().then(() => leo.prepare(prepareOptions));
        }else{
            return leo.next();
        }
    })
    .then(()=>{
        return leo.loop(    //总循环Start
            ()=>leo.waitAfterBattle()
            .then(() => {
                if(protect.check()){
                    return leo.logBack();
                }
            })
            .then(() => leo.checkHealth(prepareOptions.doctorName,true))
            .then(() => leo.checkCrystal(prepareOptions.crystalName))
            .then(()=>{
                //判断是否要去银行取钱
                playerinfo = cga.GetPlayerInfo();
                if(playerinfo.gold<5000){
                    return leo.goto(n=>n.falan.bank)
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>{
                        playerinfo = cga.GetPlayerInfo();
                        if(playerinfo.gold<5000){
                            return leo.reject('钱到用时方恨少！请补充足够银子后重新执行脚本！');       //跳出总循环
                        }
                    });
                }
            })
            .then(()=>{
                //判断人物身上的道具数量已满
                if(cga.getInventoryItems().length >= 20){
                    return leo.goto(n=>n.falan.bank)
                    .then(()=>leo.saveToBankAll(itemName));
                }
            })
            .then(()=>{
                return leo.loop(()=>{
                    var mapInfo = cga.getMapInfo();
                    if(mapInfo.name == '艾尔莎岛' || mapInfo.name == '里谢里雅堡' ||mapInfo.name == '法兰城' ){
                        return leo.goto(n => n.falan.eout);
                    }
                    if(mapInfo.name == '芙蕾雅'){
                        return leo.autoWalk([665,184,'*']);
                    }
                    if(mapInfo.name == '牛鬼的洞穴'){
                        return leo.autoWalk([16,10,'*']);
                    }
                    if(mapInfo.name == '洞窟'){
                        return leo.log('现在是白天，进不了牛鬼的洞穴，等待3分钟')
                        .then(()=>leo.delay(180000))
                        .then(()=>leo.autoWalk([16,19,'芙蕾雅']))
                        .then(()=>leo.delay(5000));
                    }
                    if(mapInfo.name.indexOf('牛鬼的洞窟')!=-1){
                        return leo.findOne(targetFinder, todo, true)
                        .then(()=>leo.walkRandomMazeUntil(() => {
                            var mapInfo = leo.getMapInfo();
                            if (mapInfo.indexes.index3 == 11019) {
                                return true;
                            }
                            return false;
                        },false))
                    }
                    if(mapInfo.indexes.index3 == 11019 && mapInfo.y >= 32){
                        return leo.autoWalk([25,34])
                        .then(()=>leo.talkNpc(25,33,leo.talkNpcSelectorYes))
                        .then(()=>leo.delay(1000))
                        .then(()=>leo.waitAfterBattle());
                    }
                    if(mapInfo.indexes.index3 == 11019 && mapInfo.y < 32){
                        return leo.autoWalkList([[27,16],[27,15]])
                        .then(()=>console.log(leo.logTime()+'到达位置，开始偷狗粮'))
                        .then(()=>leo.reject()); //退出循环，进入下一步
                    }
                    return leo.delay(2000);
                });
            }).then(()=>{
                return leo.loop(    //战斗循环Start
                    ()=>leo.waitAfterBattle()
                    .then(()=>leo.turnTo(27,14))
                    .then(()=>leo.delay(2000))
                    .then(()=>leo.waitAfterBattle())
                    .then(()=>{
                        //统计信息
                        var nowTime = leo.now();
                        var time = parseInt((nowTime - leo.beginTime)/1000/60);
                        stealCount = stealCount + 1;
                        itemArray = cga.findItemArray(itemName);
                        var newItemCount = itemArray.length - itemCountOld;
                        console.log(leo.logTime()+'进展:【'+newItemCount+'/'+stealCount+'/'+time+'/'+playerHurtCount+'/'+petHurtCount+'】【道具数量/偷窃次数/耗时(分)/人受伤/宠受伤】');
                        
                        playerinfo = cga.GetPlayerInfo();
                        petinfo = cga.GetPetInfo(playerinfo.petid);
                        if(playerinfo.souls>0){
                            return leo.reject('触发登出补给:人物掉魂');       //跳出战斗循环
                        }
                        if(playerinfo.health>0){
                            playerHurtCount++;
                            return leo.reject('触发登出补给:人物受伤');       //跳出战斗循环
                        }
                        if(petinfo.health>0){
                            petHurtCount++;
                            return leo.reject('触发登出补给:宠物受伤');       //跳出战斗循环
                        }
                        if(playerinfo.gold<5000){
                            return leo.reject('触发登出补给:身上魔币不足'); //跳出战斗循环
                        }
                        if(cga.getInventoryItems().length >= 20){
                            return leo.reject('触发登出补给:物品栏满了');      //跳出战斗循环
                        }

                        if(protect.check()){
                            return leo.reject('触发登出补给:血魔低于设定值');      //跳出战斗循环
                        }
                        return true;//无需补给，继续战斗循环
                    })  ////战斗循环End，此处为leo.loop的参数，不用加分号;
                );
            })
            .catch((err)=>{
                leo.log('可能是白天，进不了牛鬼的洞穴');
                return leo.delay(60000);
            })  //总循环End，此处为leo.loop的参数，不用加分号;
        );
    }).then(()=>console.log('脚本结束'));

});