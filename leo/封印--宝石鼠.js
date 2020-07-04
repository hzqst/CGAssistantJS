require('./common').then(cga => {
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    var petIndexMap = {};
    //宠物目标属性值：血、魔、攻、防、敏
    var petOptions = {
        name: '宝石鼠',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 77 - 3,
        minMp: 124 - 3,
        minAttack: 29,
        minDefensive: 38,
        minAgility: 33,
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
            if (sealCardCount < 5) {
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
    var isLogBackFirst = false; //启动登出
    var isPrepare = false; //招魂、治疗、补血、卖石
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '火风的水晶（5：5）',
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
		console.log(index + '  ' + pet.realname + '  LV' + pet.level);
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
                if (sealCardCount < 5) {
                    return leo.buySealCard(petOptions.sealCardName, 20, petOptions.sealCardLevel);
                }
            })
            .then(() => {
                //判断身上是否有【咒器·红念珠】
                if(cga.getItemCount('咒器·红念珠') == 0){
                    return leo.log('没有【咒器·红念珠】，先去咒术师的秘密住处拿取')
                    .then(()=>leo.goto(n => n.falan.w1))
                    .then(()=>leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]]))
                    .then(()=>leo.talkNpc(201, 165,leo.talkNpcSelectorYes,'莎莲娜海底洞窟 地下1楼'))
                    .then(()=>leo.autoWalkList([[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]]))
                    .then(()=>leo.turnTo(31, 22))
                    .then(()=>leo.say('咒术'))
                    .then(()=>leo.waitNPCDialog(dialog => {
                        cga.ClickNPCDialog(1, -1);
                        return leo.delay(2000);
                    }))
                    .then(()=>leo.autoWalkList([[38, 37 ,'咒术师的秘密住处'],[12, 7]]))
                    .then(()=>leo.talkNpc(14,7,leo.talkNpcSelectorYes))
                    .then(()=>{
                        if(cga.getItemCount('咒器·红念珠') == 0){
                            return leo.reject('无法拿到【咒器·红念珠】，请检查');
                        }
                    });
                }
            })
            .then(() => {
                //地图判断，如果已经在1级宠捕捉点，则继续捕捉
                var currentMap = cga.GetMapName();
                if (currentMap == '镜中的豪宅') {
                    return leo.autoWalkList([
                        [22,8],
                        [24,8]
                    ]);
                } else {
                    return leo.todo()
                    .then(()=>leo.sellCastle())
                    .then(() => leo.checkHealth(prepareOptions.doctorName))
                    .then(() => leo.checkCrystal(prepareOptions.crystalName))
                    .then(() => leo.goto(n => n.falan.w2))
                    .then(() => leo.autoWalkList([
                        [96, 149, '豪宅'],
                        [33, 22, '豪宅  地下'],
                        [9, 5, '豪宅'],
                        [33, 10, '镜中的豪宅'],
                        [35, 2]
                    ]))
                    .then(() => leo.talkNpc(35,1,leo.talkNpcSelectorYes))
                    .then(() => leo.autoWalkList([[36,9]]))
                    .then(() => leo.talkNpc(36,10,leo.talkNpcSelectorYes))
                    .then(() => leo.autoWalkList([
                        [27, 67, '豪宅'],
                        [58, 66, '豪宅  地下'],
                        [41, 23, '豪宅'],
                        [59, 6, '豪宅  2楼'],
                        [16, 9, '镜中的豪宅  2楼'],
                        [40, 10]
                    ]))
                    .then(() => leo.talkNpc(41,10,leo.talkNpcSelectorYes))
                    .then(() => leo.autoWalkList([[40,16]]))
                    .then(() => leo.talkNpc(40,17,leo.talkNpcSelectorYes))
                    .then(() => leo.autoWalkList([
                        [6, 5, '镜中的豪宅'],
                        [24, 8]
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