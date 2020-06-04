require('./common').then(cga=>{
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = true;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    leo.monitor.config.autoHp = true;
    leo.monitor.config.autoHpValue = 600;
    leo.monitor.config.autoHpItem = '小护士家庭号';
    leo.monitor.config.autoMp = true;
    leo.monitor.config.autoMpValue = 20;
    leo.monitor.config.autoMpItem = '魔力之泉';

    var itemName = "鳞片？";

    var protect = {
        minHp: 300,
        minMp: 20,
        minPetHp: 0,
        minPetMp: 0,
        check: ()=>{
            var playerinfo = cga.GetPlayerInfo();
            var petinfo = cga.GetPetInfo(playerinfo.petid);
            if(playerinfo.hp < protect.minHp ||
                playerinfo.mp < protect.minMp ||
                petinfo.hp < protect.minPetHp ||
                petinfo.mp < protect.minPetMp){
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
    var petinfo = cga.GetPetInfo(playerinfo.petid);

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false);   //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false);   //关闭组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false);       //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);      //关闭交易

    leo.log('红叶の偷龙鳞(原地)脚本，启动~');

    //统计类信息
    var stealCount = 0;//盗窃次数(此处实际是战斗次数，如果一次战斗盗窃技能使用2次，则应该乘2)
    var playerHurtCount = 0;    //人物受伤次数
    var petHurtCount = 0;       //宠物受伤次数
    var itemArray = cga.findItemArray(itemName);
    var itemCountOld = itemArray?itemArray.length:0;
    leo.log('身上已有龙鳞未鉴定道具数量【'+itemCountOld+'】');

    leo.todo()
    .then(()=>{
        return leo.loop(    //总循环Start
            ()=>leo.waitAfterBattle()
            .then(() => {
                if(protect.check()){
                    console.log(leo.logTime()+'已到达回补值，脚本结束');
                    return leo.reject();
                }
            })
            .then(()=>{
                //判断人物身上的道具数量已满
                if(cga.getInventoryItems().length >= 20){
                    console.log(leo.logTime()+'身上物品已满，脚本结束');
                    return leo.reject();
                }
            })
            .then(()=>{
                var direction = cga.GetPlayerInfo().direction;
                return leo.loop(    //战斗循环Start
                    ()=>leo.waitAfterBattle()
                    .then(()=>leo.talkNpc(direction,leo.talkNpcSelectorYes))
                    .then(()=>leo.delay(1000))
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
                        if(cga.getInventoryItems().length >= 20){
                            return leo.reject('触发登出补给:物品栏满了');      //跳出战斗循环
                        }
                        if(protect.check()){
                            return leo.reject('触发补给:血魔低于设定值');
                        }
                        return true;//无需补给，继续战斗循环
                    })  ////战斗循环End，此处为leo.loop的参数，不用加分号;
                );
            })
            .then(()=>console.log('等待自动使用物品'))
            .then(()=>leo.delay(10000))
            .catch((err)=>{
                return leo.delay(60000);
            })  //总循环End，此处为leo.loop的参数，不用加分号;
        )
    }).then(()=>console.log('脚本结束'));
});