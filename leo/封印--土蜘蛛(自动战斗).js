require('./common').then(cga=>{
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    var petIndexMap = {};
    //宠物目标属性值：血、魔、攻、防、敏
    var petOptions = {
        name: '土蜘蛛',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 100 - 3,
        minAttack: 34,
        minDefensive: 36,
        minAgility: 32,
        index: 1,
        petChecker: () => {
            var pets = cga.GetPetsInfo();
            //console.log(leo.logTime()+'宠物数量：'+pets.length);
            for (var i in pets) {
                var pet = pets[i];
                if (petIndexMap[pet.index] && petIndexMap[pet.index] == 1) {
                    //原有的宠，不做处理
                } else {
                    //新抓到的宠
                    var isDrop = leo.isDropPet(pet, petOptions);
                    if (pet.realname == petOptions.name && pet.level == 1 && isDrop.flag) {
                        if (cga.isInNormalState()) {
                            cga.DropPet(pet.index);
                            leo.log('可惜！丢下宠物' + leo.getPetCalcInfo(pet) + '，' + isDrop.info);
                        }
                    } else {
                        leo.log('恭喜！抓到宠物' + leo.getPetCalcInfo(pet));
                        petIndexMap[pet.index] = 1;
                    }
                }
            }
        }
    };
    var protect = {
        minHp: 500,
        minMp: 200,
        minPetHp: 500,
        minPetMp: 200,
        maxPetNumber: 4, //超过4只宠物
        checker: petOptions.petChecker,
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

    //技能设置
    //参数check 如果
    //context.round_count === 0 第一回合
    //context.enemies.length 敌人数量
    //context.enemies.front.length 敌人前排数量
    //context.enemies.back.length 敌人后排数量
    //context.enemies.find(e => e.curhp > 0 && e.maxhp >= 15000) 还活着的血上限大于15000
    //e.name 怪物种类名称
    //e.pos 怪物的位置

    //参数targets 对象
    //targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos) 当前血多优先
    const sets = [];
    sets.push({
        user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
        check: context => {
            if (context.enemies.lv1 && context.enemies.lv1.length > 0){
                leo.isCatchPet(context.enemies.lv1,petOptions,true);
            }
            return context.enemies.find(e => e.level == 1 
                && e.name == petOptions.name 
                && e.maxhp >= petOptions.minHp 
                && e.maxmp >= petOptions.minMp ) 
            && cga.getInventoryItems().find(i => i.name == petOptions.sealCardName);
        },
        type: '物品',
        item: context => cga.getInventoryItems().find(i => i.name == petOptions.sealCardName).pos,
        targets: context => [context.enemies.find(e => e.level == 1 
                && e.name == petOptions.name 
                && e.maxhp >= petOptions.minHp 
                && e.maxmp >= petOptions.minMp ).pos]
    });
    sets.push({
        user: 1,
        check: context => context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬'),
        type: '攻击',
        targets: context => [context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬').pos]
    });
    sets.push({
        user: 1,
        check: context => true,
        type: '逃跑',
        targets: context => [context.player_pos]
    });
    sets.push({
        user: 2,
        check: context => context.petUnit.hpRatio <= 0.5,
        skillName: '明镜止水',
        targets: context => [context.petUnit.pos]
    });
    sets.push({
        user: 2,
        check: context => {
            return context.enemies.find(e => e.level == 1 
                && e.name == petOptions.name 
                && e.maxhp >= petOptions.minHp 
                && e.maxmp >= petOptions.minMp ) 
            && cga.getInventoryItems().find(i => i.name == petOptions.sealCardName);
        },
        skillName: '强力火焰魔法-Ⅰ',
        targets: context => [context.enemies.find(e => e.level == 1 
                && e.name == petOptions.name 
                && e.maxhp >= petOptions.minHp 
                && e.maxmp >= petOptions.minMp ).pos]
    });
    sets.push({
        user: 2,
        check: context => context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬'),
        skillName: '攻击',
        targets: context => [context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬').pos]
    });
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
        crystalName: '风地的水晶（5：5）',
        doctorName: '医道之殇'
    };
    leo.log('红叶の自动抓【' + petOptions.name + '】存银行脚本，启动~');
    var setting = '预设五围是：【' + petOptions.minHp + '/' + petOptions.minMp + '/' + petOptions.minAttack + '/' + petOptions.minDefensive + '/' + petOptions.minAgility + '】，自动扔宠：【' + (petOptions.autoDropPet ? '已启用' : '未启用') + '】';
    leo.log(setting);
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = true;
    var bankPetFull = false;
    var pets = cga.GetPetsInfo();
    if (pets.length > 0) {
        console.log('身上已有宠物：');
    }
    for (var i in pets) {
        var pet = pets[i];
        petIndexMap[pet.index] = 1;
        var index = parseInt(pet.index) + 1;
        console.log(index + '： LV' + pet.level + ' ' + pet.realname + '  (' + pet.name + ')');
    }

    var targetFinder = (units) => {
        return units.find(u => u.unit_name == '冒险者金德其' && u.type == 1 
            && (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0);
    }

    var todo = (target) => {
        return leo.todo()
        .then(() => leo.talkNpc(target.xpos, target.ypos, leo.talkNpcSelectorYes))
        .then(() => {
            if(cga.getItemCount('牛鬼杀')>0){
                return leo.log('拿到了牛鬼杀');
            }else if(cga.getItemCount('酒？')>0){
                return leo.log('拿到了酒？');
            }else{
                return leo.log('没拿到通行道具');
            }
        })
        .then(() => leo.autoWalk([target.entry.x, target.entry.y, '*'],undefined,undefined,{compress: false}));
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
            .then(()=>leo.sellCastle())
            .then(() => leo.checkHealth(prepareOptions.doctorName))
            .then(() => leo.checkCrystal(prepareOptions.crystalName))
            .then(() => {
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
                var pets = cga.GetPetsInfo();
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
                            var pets = cga.GetPetsInfo();
                            petIndexMap = {};
                            for (var i in pets) {
                                var pet = pets[i];
                                petIndexMap[pet.index] = 1;
                            }
                            return leo.next();
                        });
                    }
                }
            }).then(() => {
                //判断是否要购买封印卡
                var sealCardCount = cga.getItemCount(petOptions.sealCardName);
                if (sealCardCount < 2) {
                    return leo.buySealCard(petOptions.sealCardName, 80, petOptions.sealCardLevel);
                }
            }).then(() => {
                //地图判断，如果已经在1级宠捕捉点，则继续捕捉
                return leo.loop(()=>{
                    var mapInfo = cga.getMapInfo();
                    if(mapInfo.name == '艾尔莎岛' || mapInfo.name == '里谢里雅堡' || mapInfo.name == '法兰城' ||mapInfo.name == '银行' ||mapInfo.name == '达美姊妹的店'){
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
                        if(cga.getItemCount('牛鬼杀')>0 || cga.getItemCount('酒？')>0){
                            console.log('已有【牛鬼杀】或者【酒？】，直接走迷宫')
                            return leo.walkRandomMazeUntil(() => {
                                var mapInfo = leo.getMapInfo();
                                if (mapInfo.indexes.index3 == 11019) {
                                    return true;
                                }
                                return false;
                            },false)
                            .catch(e=>{
                                if(cga.getMapInfo().name == '牛鬼的洞穴'){
                                    //迷宫刷新
                                    return leo.autoWalk([16,10,'*'])
                                    .then(()=>leo.walkRandomMazeUntil(() => {
                                        var mapInfo = leo.getMapInfo();
                                        if (mapInfo.indexes.index3 == 11019) {
                                            return true;
                                        }
                                        return false;
                                    },false));
                                }else{
                                    return leo.logBack();
                                }
                            });
                        }else{
                            console.log('开始找冒险者金德其');
                            return leo.findOne(targetFinder, todo, true);
                        }
                    }
                    if(mapInfo.indexes.index3 == 11019 && mapInfo.y >= 32){
                        return leo.autoWalk([25,34])
                        .then(()=>leo.talkNpc(25,33,leo.talkNpcSelectorYes))
                        .then(()=>leo.delay(1000))
                        .then(()=>leo.waitAfterBattle());
                    }
                    if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 32 & mapInfo.y > 14)){
                        return leo.autoWalkList([[27,16],[27,15]])
                        .then(()=>console.log(leo.logTime()+'到达位置，开始抓宠，请注意是否开启了自动扔宠物。'))
                        .then(()=>leo.reject()); //退出循环，进入下一步
                    }
                    if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 14)){
                        return leo.autoWalkList([[27,12],[27,13]])
                        .then(()=>console.log(leo.logTime()+'到达位置，开始抓宠，请注意是否开启了自动扔宠物。'))
                        .then(()=>leo.reject()); //退出循环，进入下一步
                    }
                    return leo.delay(2000);
                });
            })
            .then(()=>{
                return leo.loop(    //战斗循环Start
                    ()=>leo.waitAfterBattle()
                    .then(()=>leo.turnTo(27,14))
                    .then(()=>leo.delay(2000))
                    .then(()=>leo.waitAfterBattle())
                    .then(()=>{
                        var mapInfo = cga.getMapInfo();
                        if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 13)){
                            return leo.autoWalkList([[27,12],[27,13]]);
                        }
                        if(mapInfo.indexes.index3 == 11019 && (mapInfo.y > 15)){
                            return leo.autoWalkList([[27,16],[27,15]]);
                        }
                    })
                    .then(()=>{
                        petOptions.petChecker();
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
                        if(protect.check()){
                            return leo.reject('触发登出补给:血魔低于设定值');      //跳出战斗循环
                        }
                        if (cga.GetPetsInfo().length == 5) {
                            return leo.reject('触发登出补给:身上的宠物满了');      //跳出战斗循环
                        }
                        var sealCardCount = cga.getItemCount(petOptions.sealCardName);
                        if (sealCardCount < 2) {
                            return leo.reject('触发登出补给:封印卡数量不足');      //跳出战斗循环
                        }
                        return true;//无需补给，继续战斗循环
                    })  ////战斗循环End，此处为leo.loop的参数，不用加分号;
                );
            })
            .then(()=>leo.logBack())
            .catch ((err) => {
                leo.log(err);
                return leo.delay(60000);
            })
        );
    });
});