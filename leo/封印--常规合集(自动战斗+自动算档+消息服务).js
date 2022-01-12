require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {

    const petName = '哥布林';

    let protect = {
        //contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false, 
        minHp: 500,
        minMp: 200,
        minPetHp: 500,
        minPetMp: 200,
        maxPetNumber: 4, //超过4只宠物
    };

    const petPlugins = require(process.env.CGA_DIR_PATH+'/leo/pet.js');
    if(!petPlugins) {
        await leo.log('缺少抓宠插件pet.js')
        return leo.delay(1000*60*60*24);
    }else{
        await petPlugins.tips(cga)
        console.log('')
    }
    const petOptions = petPlugins.getPetConfig(petName);
    if(!petOptions){
        await leo.log('抓宠插件中没有指定宠物配置：' + petName)
        return leo.delay(1000*60*60*24);
    }

    if(!leo.checkPetCard(petName)){
        await leo.log('缺少宠物图鉴，5秒后重新获取')
        await leo.delay(5000)
        if(!leo.checkPetCard(petName)){
            await leo.log('缺少宠物图鉴，请检查：' + petName)
            return leo.delay(1000*60*60*24);
        }
    }

    leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    let petIndexMap = {};

    protect.checker = () => {
        let pets = cga.GetPetsInfo();
        //console.log(leo.logTime()+'宠物数量：'+pets.length);
        for (let i in pets) {
            let pet = pets[i];
            if (petIndexMap[pet.index] && petIndexMap[pet.index] == 1) {
                //原有的宠，不做处理
            } else {
                //新抓到的宠
                if(pet.realname == petOptions.name && pet.level == 1) {
                    //进行算档
                    let attribute = leo.getPetCalcAttribute(pet);
                    let bp = leo.getPetCalcBp(pet);
                    let calcOptions = {
                        name: petOptions.name,
                        attr: attribute,
                        bp: bp,
                        first: petOptions.gradeFirst,
                        gradeMin: petOptions.gradeMin,
                        gradeLog: petOptions.gradeLog,
                        gradeLogMax: petOptions.gradeLogMax
                    }
                    let isDrop;
                    let　grade = leo.calcGrade(calcOptions);

                    if(!grade.status){
                        console.log(grade.error);
                    }else{
                        isDrop = grade.isDrop;
                        grade.log.forEach(v=>console.log(v));
                    }
                    if(isDrop === undefined){
                        //算档失败，按预设的属性进行宠物丢弃判定
                        let isDrop = leo.isDropPet(pet, petOptions);
                        if (pet.realname == petOptions.name && pet.level == 1 && isDrop.flag) {
                            if (cga.isInNormalState()) {
                                cga.DropPet(pet.index);
                                leo.log('可惜！丢下宠物' + leo.getPetCalcInfo(pet) + '，' + isDrop.info);
                                console.log('');
                            }
                        } else {
                            let tips = '恭喜！抓到宠物' + leo.getPetCalcInfo(pet);
                            leo.logServer('抓宠',tips)
                            leo.log(tips);
                            console.log('');
                            petIndexMap[pet.index] = 1;
                        }
                    }else{
                        if(isDrop && pet.realname == petOptions.name && pet.level == 1){
                            if (cga.isInNormalState()) {
                                cga.DropPet(pet.index);
                                leo.log('可惜！丢下宠物' + leo.getPetCalcInfo(pet) + '，高于' + petOptions.gradeMin + '档');
                                console.log('');
                            }
                        }else{
                            let tips = '恭喜！抓到宠物' + leo.getPetCalcInfo(pet) + '，最低档次是【 '+grade.gradeValue+'档 】';
                            leo.logServer('抓宠',tips)
                            leo.log(tips);
                            console.log('');
                            petIndexMap[pet.index] = 1;
                        }
                    }
                }
            }
        }
        //判断是否要购买封印卡
        let sealCardCount = cga.getItemCount(petOptions.sealCardName);
        if (sealCardCount < 2) {
            return true;
        }
    }

    //参数targets 对象
    //targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos) 当前血多优先
    const sets = [];
    sets.push({
        user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
        check: context => {
            if (context.isFirstBattleAction && context.enemies.lv1 && context.enemies.lv1.length > 0){
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
        skillName: petOptions.petSkillName || '陨石魔法-Ⅰ',
        targets: context => [leo.findCatchPet(context.enemies.lv1,petOptions,true).pos]
    });
    sets.push({
        user: 2,
        check: context => true,
        skillName: '防御',
        targets: context => [context.petUnit.pos]
    });

    let firstRoundDelay = 1;    //首回合延迟
    let roundDelay = 4000          //每回合延迟
    let force = true ;          //是否强制启用战斗配置
    await leo.setBattlePet2(false);   //关闭宠物二动
    await leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
    await leo.panel.autoBattle(false);//关闭CGA面板的自动战斗

    await leo.log('红叶の封印师常规合集脚本，自动抓【' + petName + '】+自动算档+消息服务，启动~');
    let setting = '预设五围是：【' + petOptions.minHp + '/' + petOptions.minMp + '/' + petOptions.minAttack + '/' + petOptions.minDefensive + '/' + petOptions.minAgility + '】，自动扔宠：【' + (petOptions.autoDropPet ? '已启用' : '未启用') + '】';
    await leo.log(setting)
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    
    let bankPetFull = false;

    try{
        //更新人物身上的宠物信息
        let pets = cga.GetPetsInfo();
        petIndexMap = {};
        for (var i in pets) {
            var pet = pets[i];
            petIndexMap[pet.index] = 1;
        }
                    
        await leo.loop(async ()=>{
            await leo.waitAfterBattle()
            if(cga.GetPlayerInfo().gold < 10000){
                await leo.goto(n => n.falan.bank)
                await leo.moveGold(50000, cga.MOVE_GOLD_FROMBANK)
                if(cga.GetPlayerInfo().gold < 10000){
                    await leo.log('钱到用时方恨少！请补充足够银子后重新执行脚本！')
                    await leo.delay(1000*60*60*24)
                    return leo.reject();
                }
            }
            if(cga.GetPetsInfo().length == 5){
                if (bankPetFull) {
                    await leo.log('宠物在银行满啦！背包也满啦！是时候倒仓库啦！')
                    await leo.delay(1000*60*60*24)
                    return leo.reject();
                } else {
                    let petToSave = cga.GetPetsInfo().filter(p=>p.level==1);
                    for (var i = 0; i < petToSave.length; i++) {
                        let pet = petToSave[i];
                        let emptyIndex = await leo.getPetEmptyIndex(true);
                        if(emptyIndex != undefined){
                            await leo.movePet(pet.index, emptyIndex)
                        }else{
                            bankPetFull = true;
                            break;
                        }
                    }
                    //更新人物身上的宠物信息
                    let pets = cga.GetPetsInfo();
                    petIndexMap = {};
                    for (var i in pets) {
                        var pet = pets[i];
                        petIndexMap[pet.index] = 1;
                    }
                }
                await leo.syncInfo(cga,true,true,true)
            }
            var sealCardCount = cga.getItemCount(petOptions.sealCardName);
            if (sealCardCount < 2) {
                await leo.buySealCard(petOptions.sealCardName, 40, petOptions.sealCardLevel);
            }

            await petOptions.walk(cga)
            await leo.log('到达位置，开始抓宠，请注意是否开启了自动扔宠物。')
            await leo.encounterTeamLeader(protect)
            protect.checker()
            console.log(leo.logTime() + "触发回补")
            await leo.syncInfo(cga,true)
            await leo.logBack()
        })
    }catch(e){
        leo.log(err);
        return leo.delay(60000);
    }
});