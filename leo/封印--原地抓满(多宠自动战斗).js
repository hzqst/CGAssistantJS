require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.monitor.config.keepAlive = false;   //关闭防掉线
	leo.monitor.config.logStatus = false;
	var petIndexMap = {};
	//宠物目标属性值：血、魔、攻、防、敏
	var petOptions = [{
        name: '哥布林',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 104 - 3,
        minMp: 72 - 3,
        minAttack: 40,
        minDefensive: 41,
        minAgility: 30,
        index:1
    },{
        name: '迷你蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 78 - 3,
        minMp: 80 - 3,
        minAttack: 39,
        minDefensive: 37,
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
                }
            }
        }
    }

	var protect = {
		minHp: 500,
		minMp: 100,
		minPetHp: 500,
		minPetMp: 100,
		maxPetNumber: 4,	//超过4只宠物
		checker: petChecker
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
            skillName: '强力火焰魔法-Ⅰ',
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

    var firstRoundDelay = 1;    //首回合延迟
    var roundDelay = 4000          //每回合延迟
    var force = true ;          //是否强制启用战斗配置
    leo.setBattlePet2(false);   //关闭宠物二动
    leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
    leo.panel.autoBattle(false);//关闭CGA面板的自动战斗

	var isLogBackFirst = false;		//启动登出
	var isPrepare = false;			//招魂、治疗、补血、卖石

	var prepareOptions = {
		repairFlag: -1,
		crystalName: '水火的水晶（5：5）',
		doctorName: '医道之殇'
	};

	var title = '红叶の原地抓【';
    for (let i = 0; i < petOptions.length; i++) {
        var option = petOptions[i];
        title += option.name;
        if(i<petOptions.length-1){
            title += '/';
        }
    }
    title += '】脚本，启动~';
    leo.log(title);
    for (let i = 0; i < petOptions.length; i++) {
        var option = petOptions[i];
        var setting = '预设五围是：【'+option.name+'】=>【' + option.minHp + '/' + option.minMp + '/' + option.minAttack + '/' + option.minDefensive + '/' + option.minAgility + '】，自动扔宠：【' + (option.autoDropPet ? '已启用' : '未启用') + '】';
        leo.log(setting);
    }

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false);	//关闭队聊
	cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false);	//关闭组队
	cga.EnableFlags(cga.ENABLE_FLAG_CARD, false);		//关闭名片
	cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);		//关闭交易

	var playerinfo = cga.GetPlayerInfo();
	var playerName = playerinfo.name;
	var isTeamLeader = true;
	var bankPetFull = false;

	var pets = cga.GetPetsInfo();
	if(pets.length>0){
		console.log('身上已有宠物：');
	}
	for(var i in pets){
		var pet = pets[i];
		petIndexMap[pet.index] = 1;
		var index = parseInt(pet.index) + 1;
		console.log(index + '： LV' + pet.level + ' ' + pet.realname + '  (' + pet.name + ')');
	}

	leo.todo().then(()=>{
		return leo.loop(
			()=>leo.waitAfterBattle().then(()=>{
				//判断人物身上的宠物数量是否等于5
				var pets = cga.GetPetsInfo();
				if(pets.length==5){
					return leo.reject('已经满5个宠物，背包满啦！是时候存银行啦！');	
				}
			}).then(()=>{
				leo.log('开始抓宠，请注意是否开启了自动扔宠物。');
				return leo.encounterTeamLeader(protect)
				.then(()=>{
					return leo.reject("触发回补，请及时补给");
				});
			})
			.catch((err)=>{
				leo.log(err);
				return leo.delay(10000);
			})
		);
	});
});