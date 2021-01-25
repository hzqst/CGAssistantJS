require('./common').then(cga => {
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    var petIndexMap = {};
    //宠物目标属性值：血、魔、攻、防、敏
    var petOptions = [{
        name: '单眼巨人',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 4,
        minMp: 100 - 4,
        minAttack: 42,
        minDefensive: 36,
        minAgility: 27,
        index:1
    },{
        name: '红鬼',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 95 - 4,
        minMp: 98 - 4,
        minAttack: 48,
        minDefensive: 35,
        minAgility: 34,
        index:1
    }];
    var petChecker = ()=>{
        let pets = cga.GetPetsInfo();
        //console.log(leo.logTime()+'宠物数量：'+pets.length);
        for (let i in pets) {
            let pet = pets[i];
            if (petIndexMap[pet.index] && petIndexMap[pet.index] == 1) {
                //原有的宠，不做处理
            } else {
                //新抓到的宠
                let option;
                for (let i = 0; i < petOptions.length; i++) {
                    if(pet.realname == petOptions[i].name){
                        option = petOptions[i];
                        break;
                    }
                }
                if(option){
                    let isDrop = leo.isDropPet(pet, option);
                    if (pet.realname == option.name && pet.level == 1 && isDrop.flag) {
                        if (cga.isInNormalState()) {
                            cga.DropPet(pet.index);
                            leo.log('可惜！丢下宠物' + leo.getPetCalcInfo(pet) + '，' + isDrop.info);
                        }
                    } else {
                        leo.log('恭喜！抓到宠物' + leo.getPetCalcInfo(pet));
                        petIndexMap[pet.index] = 1;
                    }
                    //判断是否要购买封印卡
                    let sealCardCount = cga.getItemCount(option.sealCardName);
                    if (sealCardCount < 2) {
                        return true;
                    }
                }
            }
        }
    }
    
    var protect = {
        minHp: 600,
        minMp: 30,
        minPetHp: 600,
        minPetMp: 30,
        maxPetNumber: 4, //超过4只宠物
        checker: petChecker
    };

    //参数targets 对象
    //targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos) 当前血多优先
    const sets = [];
    for (let i = 0; i < petOptions.length; i++) {
        let option = petOptions[i];
        let set = {
            user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => {
                if (context.isFirstBattleAction && context.enemies.lv1 && context.enemies.lv1.length > 0){
                    leo.isCatchPet(context.enemies.lv1,option,true);
                }
                return leo.findCatchPet(context.enemies.lv1,option) && cga.getInventoryItems().find(i => i.name == option.sealCardName);
            },
            type: '物品',
            item: context => cga.getInventoryItems().find(i => i.name == option.sealCardName).pos,
            targets: context => [leo.findCatchPet(context.enemies.lv1,option).pos]
        };
        sets.push(set);
    }
    sets.push({
        user: 1,
        check: context => true,
        type: '逃跑',
        targets: context => [context.player_pos]
    });
    for (let i = 0; i < petOptions.length; i++) {
        let option = petOptions[i];
        let set = {
            user: 2,
            check: context => leo.findCatchPet(context.enemies.lv1,option,true) && cga.getInventoryItems().find(i => i.name == option.sealCardName),
            skillName: '强力陨石魔法-Ⅰ',
            targets: context => [leo.findCatchPet(context.enemies.lv1,option,true).pos]
        };
        sets.push(set);
    }
    sets.push({
        user: 2,
        check: context => true,
        skillName: '防御',
        targets: context => [context.petUnit.pos]
    });

    var firstRoundDelay = 1;    //首回合延迟
    var roundDelay = 4000          //每回合延迟
    var force = true ;          //是否强制启用战斗配置
    leo.setBattlePet2(false);   //关闭宠物二动
    leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
    leo.panel.autoBattle(false);//关闭CGA面板的自动战斗

    var isLogBackFirst = false; //启动登出
    var isPrepare = false; //招魂、治疗、补血、卖石
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '地水的水晶（5：5）',
        doctorName: '莎费苦心七项全能'
    };
    var title = '红叶の自动抓【';
    for (let i = 0; i < petOptions.length; i++) {
        var option = petOptions[i];
        title += option.name;
        if(i<petOptions.length-1){
            title += '/';
        }
    }
    title += '】存银行脚本，启动~';
    leo.log(title);
    for (let i = 0; i < petOptions.length; i++) {
        var option = petOptions[i];
        var setting = '预设五围是：【'+option.name+'】=>【' + option.minHp + '/' + option.minMp + '/' + option.minAttack + '/' + option.minDefensive + '/' + option.minAgility + '】，自动扔宠：【' + (option.autoDropPet ? '已启用' : '未启用') + '】';
        leo.log(setting);
    }
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = true;
    var bankPetFull = false;
    let pets = cga.GetPetsInfo();
    if (pets.length > 0) {
        console.log('身上已有宠物：');
    }
    for (let i in pets) {
        let pet = pets[i];
        petIndexMap[pet.index] = 1;
        let index = parseInt(pet.index) + 1;
		console.log(index + '： LV' + pet.level + ' ' + pet.realname + '  (' + pet.name + ')');
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
            () => leo.waitAfterBattle().then(() => {
                //判断是否要去银行取钱
                playerinfo = cga.GetPlayerInfo();
                if (playerinfo.gold < 1000) {
                    return leo.goto(n => n.falan.bank).then(() => leo.moveGold(20000, cga.MOVE_GOLD_FROMBANK)).then(() => {
                        playerinfo = cga.GetPlayerInfo();
                        if (playerinfo.gold < 1000) {
                            return leo.reject('钱到用时方恨少！请补充足够银子后重新执行脚本！');
                        }
                    });
                }
            }).then(() => {
                //判断人物身上的宠物数量是否等于5
                let pets = cga.GetPetsInfo();
                if (pets.length == 5) {
                    if (bankPetFull) {
                        return leo.reject('宠物在银行满啦！背包也满啦！是时候倒仓库啦！');
                    } else {
                        bankPetFull = true;
                        return leo.goto(n => n.falan.bank)
                        .then(() => leo.movePet(1, 101))
                        .then(() => leo.movePet(2, 102))
                        .then(() => leo.movePet(3, 103))
                        .then(() => leo.movePet(4, 104))
                        .then(() => {
                            //更新人物身上的宠物信息
                            let pets = cga.GetPetsInfo();
                            petIndexMap = {};
                            for (let i in pets) {
                                let pet = pets[i];
                                petIndexMap[pet.index] = 1;
                            }
                            return leo.next();
                        });
                    }
                }
            }).then( async () => {
                //判断是否要购买封印卡
                for (let i = 0; i < petOptions.length; i++) {
                    let option = petOptions[i];
                    let sealCardCount = cga.getItemCount(option.sealCardName);
                    if (sealCardCount < 2) {
                        await leo.buySealCard(option.sealCardName, 20, option.sealCardLevel);
                    }
                }
                return leo.next();
            }).then(() => {
                //地图判断，如果已经在1级宠捕捉点，则继续捕捉
                var currentMap = cga.GetMapName();
				if (currentMap == '雪拉威森塔９２层')
					return leo.autoWalkList([
                        [106, 96]					
                    ]);
                else {
                     return leo.logBack()
                    .then(()=>leo.sellCastle())
                    .then(() => leo.checkHealth(prepareOptions.doctorName))
                    .then(() => leo.checkCrystal(prepareOptions.crystalName))
                    .then(() => leo.autoWalk([165,153]))
                    .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'))
                    .then(()=>leo.autoWalk([90,99,'国民会馆']))
                    .then(()=>leo.autoWalk([108,51]))
                    .then(()=>leo.supplyDir(2))
                    .then(()=>leo.autoWalk([108,39,'雪拉威森塔１层']))
                    .then(()=>leo.autoWalkList([
                            [75, 50, '雪拉威森塔５０层'],
                            [18, 44, '雪拉威森塔９０层'],
							[43, 26, '雪拉威森塔９１层'],
							[44, 109, '雪拉威森塔９２层'],
							[106, 96]
                    ]));
                }
            }).then(() => {
                leo.log('到达位置，开始抓宠，请注意是否开启了自动扔宠物。');
                return leo.encounterTeamLeader(protect).then(() => {
                    console.log(leo.logTime() + "触发回补");
                    return leo.logBack().then(() => leo.prepare(prepareOptions));
                });
            }).
            catch ((err) => {
                leo.log(err);
                return leo.delay(60000);
            }));
    });
});