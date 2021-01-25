require('./common').then(cga => {
    leo.baseInfoPrint();
    //leo.logStatus = false;

    var skillName = '宠物强化';
    var skillLevel = 8;

    var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 1; //队伍人数
    var usingpunchclock = false; //是否打卡
    var isBuySealCard = false; //是否买封印卡
    var sealCardName = '封印卡（昆虫系）';
    var sealCardLevel = 1;
    var sealCardMaxCount = 300; 

    var protect = {
        minHp: 500,
        minMp: 50,
        minPetHp: 300,
        minPetMp: 120,
        minTeamNumber: 5,
        normalNurse: false,
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
    var teammates = [];
    var isLogBackFirst = false; //启动登出
    var isPrepare = false; //招魂、治疗、补血、卖石
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '火风的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }
    if (teamPlayerCount <= 1) {
        isTeamLeader = true;
        protect.minTeamNumber = 0;
    }
    
    leo.log('红叶の半山6后小岛烧技能脚本，启动~');

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
                        return leo.buySealCard(sealCardName, sealCardMaxCount, sealCardLevel)
                        .then(()=>leo.logBack());
                    }
                }
            })
            .then(() => {
                if(isTeamLeader) {
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
                }
            })
            .then(() => {
                //完成组队
                var teamplayers = cga.getTeamPlayers();
                if (!isTeamLeader && teamplayers.length > 0) {
                    //console.log('组队已就绪');
                    return leo.next();
                } else {
                    //console.log(leo.logTime() + '寻找队伍');
                    return leo.todo()
                    .then(()=>{
                        if(usingpunchclock){
                            return leo.goto(n => n.castle.clock)
                            .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes));
                        }
                    })
                    .then(()=>leo.goto(n => n.castle.x))
                    .then(()=>leo.autoWalk([41, 50,'里谢里雅堡 1楼']))
                    .then(()=>leo.autoWalk([74, 19,'里谢里雅堡 2楼']))
                    .then(()=>leo.autoWalk([0, 74,'图书室']))
                    .then(()=>leo.autoWalk([27, 16]))
                    .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes,'小岛'))
                    .then(() => {
                        if (isTeamLeader) {
                            cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                            return leo.forceMoveEx(3)
                            .then(() => leo.buildTeam(teamPlayerCount))
                            .then(() => {
                                //关闭组队
                                cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); 
                                return leo.next();
                            });
                        } else {
                            return leo.enterTeam(teamLeader);
                        }
                    });
                }
            })
            .then(() => {
                if (isTeamLeader) {
                    return leo.autoWalk([68,97])
                    .then(()=>{
                        console.log(leo.logTime() + '开始战斗');
                        return leo.encounterTeamLeader(protect) //队长遇敌
                        .then(() => {
                            console.log(leo.logTime() + "登出回补");
                            return leo.logBack();
                        });
                    });
                }else{
                    if (mapInfo.name.indexOf('小岛')!=-1){
                        return leo.encounterTeammate(protect, '小岛'); //队员遇敌
                    }
                }
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log)
        );
    });
});