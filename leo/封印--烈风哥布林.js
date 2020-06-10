require('./common').then(cga => {
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    var petIndexMap = {};
    //宠物目标属性值：血、魔、攻、防、敏
    var petOptions = {
        name: '烈风哥布林',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: false, //是否自动扔宠，true扔/false不扔
        minHp: 114,
        minMp: 70,
        minAttack: 39,
        minDefensive: 40,
        minAgility: 32,
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
        crystalName: '水火的水晶（5：5）',
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

    var eye = cga.getItemCount('神眼');
    if(eye == 0){
        //leo.log('身上没有神眼，无法进入地下水脉，脚本结束');
        //return;
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
            .then(() => leo.checkHealth())
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
                if (sealCardCount < 5) {
                    return leo.buySealCard(petOptions.sealCardName, 60, petOptions.sealCardLevel);
                }
            }).then(() => {
                //地图判断，如果已经在1级宠捕捉点，则继续捕捉
                var currentMap = cga.GetMapName();
                if (currentMap == '地下水脉') {
                    return leo.autoWalkList([
                        [46, 57],
                        [44, 55]
                    ])
                    .then(() => {
                        leo.log('到达位置，开始抓宠，请注意是否开启了自动扔宠物。');
                        return leo.encounterTeamLeader(protect).then(() => {
                            console.log(leo.logTime() + "触发回补");
                            return leo.logBack().then(() => leo.prepare(prepareOptions));
                        });
                    });
                }
                if(currentMap == '艾尔莎岛' || currentMap == '里谢里雅堡' || currentMap == '法兰城' || currentMap == '银行' || currentMap == '杂货店'){
                    return leo.goto(n => n.teleport.jenova)
                    .then(() => leo.autoWalkList([
                        [71, 18, '莎莲娜']
                    ]));
                }
                if(currentMap == '莎莲娜' && cga.getItemCount('塔比欧的细胞')==0 && cga.getItemCount('月之锄头')==0){
                    return leo.autoWalk([281, 371])
                    .then(() => leo.turnDir(6))
                    .then(() => leo.delay(1000))
                    .then(() => leo.waitAfterBattle());
                }
                if(currentMap == '莎莲娜' && cga.getItemCount('塔比欧的细胞')>0 && cga.getItemCount('月之锄头')==0){
                    return leo.autoWalk([314,432])
                    .then(() => leo.talkNpc(313, 432,leo.talkNpcSelectorYes));
                }
                if(currentMap == '莎莲娜' && cga.getItemCount('月之锄头')>0){
                    return gotoTarget();
                }
                if(currentMap.indexOf('奇怪的坑道')!=-1 && cga.getItemCount('红色三菱镜')==0){
                    return findNpc();
                }
                if(currentMap.indexOf('奇怪的坑道')!=-1 && cga.getItemCount('红色三菱镜')==1){
                    return leo.walkRandomMazeUntil(() => {
                            var mapInfo = leo.getMapInfo();
                            if (mapInfo.name.indexOf('奇怪的坑道地下1')!=-1 && mapInfo.x == 10 && mapInfo.y == 19) {
                                return true;
                            }
                            return false;
                    },false)
                    .then(()=>leo.autoWalk([10,15,[12, 7]]))
                    .then(()=>leo.autoWalk([8,5]))
                    .then(()=>leo.turnDir(0))
                    .then(()=>leo.delay(1000))
                    .then(()=>leo.waitAfterBattle())
                    .then(()=>leo.waitUntil(()=>{
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.x == 2 && mapInfo.y == 5) {
                            return true;
                        }
                        return false;
                    }))
                    .then(()=>leo.autoWalk([4,5]))
                    .then(()=>leo.turnDir(0))
                    .then(()=>leo.waitUntil(()=>{
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.name == '地下水脉' && mapInfo.indexes.index3 == 15531) {
                            return true;
                        }
                        return false;
                    }));
                }
                return leo.delay(2000);
            })
            .catch ((err) => {
                leo.log(err);
                return leo.delay(10000);
            }));
    });

    var gotoTarget = ()=>{
        var targetEntryArr = {
            '奇怪的坑道' : [[365,354],[365,362],[364,370],[354,384],[351,398],[361,408],
                           [359,453],[375,457],[387,459],
                           [395,447],[395,431],[388,421],[378,414],
                           [373,390],[361,420],[360,434],[374,433]]
        }
        var index = -1;
        var targetEntryAreaArr = targetEntryArr['奇怪的坑道'];
        var findHoleEntry = ()=>{
            var mapInfo = leo.getMapInfo();
            if(mapInfo.name == '奇怪的坑道地下1楼'){
                return leo.next();
            }
            index++;
            if(index >= targetEntryAreaArr.length){
                return leo.reject('没有找到迷宫入口');
            }
            if (mapInfo.name == '莎莲娜') {
                return leo.autoWalk(targetEntryAreaArr[index])
                .then(()=>{
                    var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & leo.UnitFlags.NpcEntry) && u.model_id > 0);
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

    var findNpc = ()=>{
        var npcPosition;
        if (!leo.isMapDownloaded(cga.buildMapCollisionMatrix())) {
            npcPosition = null;
        }
        const gotoNpc = (npc) => {
            const positions = leo.getMovablePositionsAround({x: npc.xpos, y: npc.ypos});
            return leo.autoWalk([positions[0].x, positions[0].y],undefined,undefined,{compress: false})
            .then(
                () => leo.talkNpc(npc.xpos, npc.ypos, leo.talkNpcSelectorYes)
            )
            .then(
                () => leo.autoWalk([npc.entries[0].x, npc.entries[0].y, '*'],undefined,undefined,{compress: false})
            );
        };
        if (npcPosition) {
            return leo.walkRandomMazeUntil(() => cga.GetMapName() == npcPosition.mapName, false).then(
                () => gotoNpc(npcPosition)
            );
        }
        return leo.searchMap(
            units => units.find(u => u.unit_name == '挖掘的迪太' && u.type == 1), true, false
        ).then(unit => {
            npcPosition = unit;
            npcPosition.mapName = cga.GetMapName();
            return gotoNpc(npcPosition);
        });
    }
});