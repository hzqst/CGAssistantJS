require('../common').then(cga => {
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    var petIndexMap = {};
    //宠物目标属性值：血、魔、攻、防、敏
    var petOptions = {
        name: '木乃伊',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 3,
        minMp: 90 - 3,
        minAttack: 42-2,
        minDefensive: 34-2,
        minAgility: 27-2,
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
            //判断是否要购买封印卡
            var sealCardCount = cga.getItemCount(petOptions.sealCardName);
            if (sealCardCount < 2) {
                return true;
            }
        }
    };
    var protect = {
        minHp: 500,
        minMp: 200,
        minPetHp: 500,
        minPetMp: 200,
        maxPetNumber: 4, //超过4只宠物
        checker: petOptions.petChecker
    };

    //参数targets 对象
    //targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos) 当前血多优先
    const sets = [];
    sets.push({
        user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
        check: context => {
            if (context.isFirstBattleAction && context.enemies.lv1 && context.enemies.lv1.length > 0 && context.enemies.length > 1){
                leo.isCatchPet(context.enemies.lv1,petOptions);
            }
            return leo.findCatchPet(context.enemies.lv1,petOptions) && cga.getInventoryItems().find(i => i.name == petOptions.sealCardName);
        },
        type: '物品',
        item: context => cga.getInventoryItems().find(i => i.name == petOptions.sealCardName).pos,
        targets: context => [leo.findCatchPet(context.enemies.lv1,petOptions).pos]
    });
    sets.push({
        user: 1,
        check: context => true,
        type: '逃跑',
        targets: context => [context.player_pos]
    });
    sets.push({
        user: 2,
        check: context => leo.findCatchPet(context.enemies.lv1,petOptions,true) && cga.getInventoryItems().find(i => i.name == petOptions.sealCardName),
        skillName: '强力陨石魔法-Ⅰ',
        targets: context => [leo.findCatchPet(context.enemies.lv1,petOptions,true).pos]
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

    const walk = async () => {
        //地图判断，如果已经在1级宠捕捉点，则继续捕捉
        var mapInfo = cga.getMapInfo();
        if (mapInfo.name == '沙漠之庙' && mapInfo.indexes.index3 == 13021) {
            await leo.autoWalkList([[18,31],[18,34]])
        } else {
            if(mapInfo.name != '索奇亚') {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(prepareOptions.doctorName)
                await leo.checkCrystal(prepareOptions.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalk([48,77, '索奇亚'])
            }
            console.log(leo.logTime()+'到达索奇亚，开始寻找迷宫入口');
            await leo.loop(async ()=>{
                try{
                    if(cga.GetMapName() == '索奇亚'){
                        var gotoTarget = () => {
                            var targetEntryArr = {
                                '砂漠之祠' : [
                    [660,290],[640,290],[620,290],[600,290],[580,290],[560,290],[540,290],
                    [540,310],[560,310],[580,310],[600,310],[620,310],[640,310],[660,310],
                    [660,330],[640,330],[620,330],[600,330],[580,330],[560,330],[540,330],
                    [540,350],[560,350],[580,350],[600,350],[620,350],[640,350],[600,350],
                    [660,370],[640,370],[620,370],[600,370],[580,370],[560,370],[540,370]
                                ]
                            }
                            var index = -1;
                            var targetEntryAreaArr = targetEntryArr['砂漠之祠'];
                            var findHoleEntry = ()=>{
                                var mapInfo = leo.getMapInfo();
                                if(mapInfo.name == '砂漠之祠地下1楼'){
                                    return leo.next();
                                }
                                index++;
                                if(index >= targetEntryAreaArr.length){
                                    return leo.log('没有找到迷宫入口');
                                }
                                if (mapInfo.name == '索奇亚') {
                                    console.log(leo.logTime()+targetEntryAreaArr[index])
                                    return leo.moveNearest(targetEntryAreaArr[index])
                                    .then(()=>{
                                        var npcExcept = ['部下葛霸','部下葛克','甘卡佐','夏瓦特','古代石碑','地之石碑'];
                                        var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & leo.UnitFlags.NpcEntry) && u.model_id > 0 && !npcExcept.includes(u.unit_name));
                                        if(mazeEntry && mazeEntry.length>0){
                                            return leo.autoWalk([mazeEntry[0].xpos,mazeEntry[0].ypos,'*'])
                                            .then(()=>findHoleEntry());
                                        }else{
                                            return findHoleEntry();
                                        }
                                    })
                                }
                            }
                            return findHoleEntry();
                        }
                        await gotoTarget()
                    }
                    if(cga.GetMapName().includes('砂漠之祠地下')){
                        await leo.walkRandomMazeUntil(() => {
                            if (cga.GetMapName() == '索奇亚') {
                                return true;
                            }
                            if (cga.GetMapName() == '沙漠之庙  地下6楼') {
                                return true;
                            }
                            return false;
                        },false)
                    }
                    if(cga.GetMapName() == '沙漠之庙  地下6楼') {
                        return leo.reject();
                    }
                    await leo.delay(1000)
                }catch(e){
                    await leo.log('迷宫刷新，e:' + e)
                    await leo.delay(60000)
                }
            })
            // 沙漠之庙  地下6楼
            await leo.autoWalkList([
                [14, 13, '沙漠之庙'],
                [43, 19]
            ])
            await leo.talkNpc(4, leo.talkYes)   //拿到古代王族的血壶
            await leo.autoWalk([12,31])
            await leo.talkNpc(2, leo.talkYes, '*')  //13020
            await leo.autoWalk([10,37, 13017])
            await leo.autoWalk([10,8])
            await leo.talkNpc(0, leo.talkYes)   //拿到古代莎草制绷带
            await leo.autoWalk([10,11, 13020])
            await leo.autoWalk([12,33])
            await leo.talkNpc(6, leo.talkYes, '*')  //13016
            await leo.autoWalk([66,23])
            await leo.talkNpc(2, leo.talkYes, '*')  //13020
            await leo.autoWalk([73,30, 13019])
            await leo.autoWalk([15,4])
            await leo.talkNpc(0, leo.talkYes)   //拿到红光的古代石
            await leo.autoWalk([7,6, 13020])
            await leo.autoWalk([66,33, 13018])
            await leo.autoWalk([19,18])
            await leo.talkNpc(2, leo.talkYes, '*')  //13021
            await leo.autoWalk([18,34])
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
                    return leo.buySealCard(petOptions.sealCardName, 100, petOptions.sealCardLevel);
                }
            })
            .then(() => walk())
            .then(() => {
                leo.log('到达位置，开始抓宠，请注意是否开启了自动扔宠物。');
                return leo.encounterTeamLeader(protect).then(() => {
                    console.log(leo.logTime() + "触发回补");
                    return leo.logBack()
                    .then(() => leo.prepare(prepareOptions));
                });
            }).
            catch ((err) => {
                leo.log(err);
                return leo.delay(60000);
            }));
    });
});