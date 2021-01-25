require('./common').then(cga => {
    leo.baseInfoPrint();
    //leo.logStatus = false;

    var skillName = '气绝回复';
    var skillLevel = 5;
    var isBuySealCard = false; //是否买封印卡
    var sealCardName = '封印卡（昆虫系）';
    var sealCardLevel = 1;
    var sealCardMaxCount = 300; 

    var protect = {
        minHp: 500,
        minMp: 300,
        minPetHp: 150,
        minPetMp: 0,
        checker: ()=>{
            if(isBuySealCard){
                //判断是否要购买封印卡
                var sealCardCount = cga.getItemCount(sealCardName);
                if (sealCardCount < 5) {
                    return true;
                }
            }
        }
    };
    var isLogBackFirst = false; //启动登出
    var isPrepare = false; //招魂、治疗、补血、卖石
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '火风的水晶（5：5）',
        doctorName: '医道之殇'
    };
    
    leo.log('红叶の石头烧技能脚本，启动~');

    var skill = cga.findPlayerSkill(skillName);
        
    if(!skill){
        leo.log('提示：当前人物没有学习技能【'+skillName+'】，请确认脚本设置！脚本结束');
        return;
    }

    if(skillLevel <= skill.lv){
        leo.log('提示：技能【'+skillName+'】等级已达到【'+skill.lv+'】，达到或者超过了预设的目标等级【'+skillLevel+'】，脚本结束');
        return;
    }else{
        leo.log('要烧的技能是【'+skillName+'】，目前等级【'+skill.lv+'】，预设的目标等级【'+skillLevel+'】');
    }

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = true;
    var oldGold = cga.GetPlayerInfo().gold;

    var huizhang = () => {
        var huizhang = leo.getItems('矮人徽章');
        var jiuping = leo.getItems('巴萨的破酒瓶');
        if(huizhang.length > 0 || jiuping.length > 0){
            return leo.next();
        }else{
            return leo.autoWalkList([
                [116,56,'酒吧'],[14,7]
            ])
            .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
            .then(()=>leo.autoWalkList([[0,23,'圣骑士营地'],[97,85]]));
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
                //判断是否要去银行取钱
                playerinfo = cga.GetPlayerInfo();
                if(playerinfo.gold<5000){
                    return leo.goto(n=>n.falan.bank)
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>{
                        playerinfo = cga.GetPlayerInfo();
                        if(playerinfo.gold<5000){
                            return leo.reject('钱到用时方恨少！请补充足够银子后重新执行脚本！');       //跳出总循环
                        }
                    });
                }
            })
            .then(() => {
                if(isBuySealCard){
                    //判断是否要购买封印卡
                    var sealCardCount = cga.getItemCount(sealCardName);
                    if (sealCardCount < 5) {
                        return leo.buySealCard(sealCardName, sealCardMaxCount, sealCardLevel);
                    }
                }
            })
            .then(() => {
                //营地练级
                if (isTeamLeader) {
                    var currentMap = cga.GetMapName();
                    var mapInfo = leo.getMapInfo();
                    if (currentMap == '艾尔莎岛' || currentMap == '里谢里雅堡' || currentMap == '法兰城' || currentMap == '达美姊妹的店') {
                        return leo.goto(n => n.camp.x)
                        .then(() => huizhang());
                    }
                    if (currentMap == '圣骑士营地') {
                        return leo.autoWalkList([
                            [87, 72, '工房'],
                            [20, 23]
                        ]).then(() => leo.sell(21, 23)).then(() => leo.delay(5000));
                    }
                    if (currentMap == '工房') {
                        return leo.autoWalkList([
                            [30, 37, '圣骑士营地'],
                            [95, 72, '医院']
                        ]);
                    }
                    if (currentMap == '医院') {
                        return leo.autoWalkList([
                            [9, 12]
                        ])
                        .then(() => leo.supply(11, 11))
                        .then(() => leo.autoWalkList([
                            [0, 20, '圣骑士营地'],
                            [36, 87, '肯吉罗岛'],
                            [547, 332]
                        ]));
                    }
                    if (currentMap == '肯吉罗岛') {
                        return leo.autoWalkList([
                            [384, 245,'蜥蜴洞穴'],[12, 2,'肯吉罗岛'],[231,434,'矮人城镇']
                        ]);
                    }
                    if (currentMap == '矮人城镇' && mapInfo.x > 93) {
                        return leo.autoWalkList([
                            [163, 95]
                        ])
                        .then(() => leo.supplyDir(0))
                        .then(() => leo.delay(2000))
                        .then(() => {
                            var nowTime = leo.now();
                            var time = parseInt((nowTime - leo.beginTime)/1000/60);//已持续练级时间
                            var newGold = cga.GetPlayerInfo().gold;
                            var useGold = oldGold - newGold;
                            var skillNow = cga.findPlayerSkill(skillName);
                            if(skillLevel <= skillNow.lv){
                                leo.log('提示：技能【'+skillName+'】等级已达到【'+skillNow.lv+'】，达到了预设的目标等级【'+skillLevel+'】，共耗时【'+time+'】分钟，消耗魔币【'+useGold+'】，脚本结束');
                                return leo.reject();
                            }else{
                                return leo.log('技能【'+skillName+'】，等级【'+skillNow.lv+'/'+skillLevel+'】，已耗时【'+time+'】分钟，消耗魔币【'+useGold+'】');
                            }
                        })
                        .then(() => leo.autoWalk([97,124]))
                        .then(() => leo.talkNpc(4,leo.talkNpcSelectorYes))
                    }
                    if (currentMap == '矮人城镇' && mapInfo.x < 93) {
                        console.log(leo.logTime() + '开始战斗');
                        return leo.autoWalk([61,129])
                        .then(() => leo.encounterTeamLeader(protect))  //队长遇敌
                        .then(() => {
                            console.log(leo.logTime() + "触发回补");
                            return leo.autoWalk([92, 125,[101,131]]).then(() => leo.delay(2000));
                        });
                    }
                }
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log)
        );
    });
});