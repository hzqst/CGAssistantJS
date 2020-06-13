require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.monitor.config.keepAlive = false;   //关闭防掉线
	leo.monitor.config.logStatus = false;
	var petIndexMap = {};
	//宠物目标属性值：血、魔、攻、防、敏
	var petOptions = {
		name: 			'迷你蝙蝠',
		sealCardName: 	'封印卡（飞行系）',
		skillName: '陨石魔法-Ⅰ',
		sealCardLevel:  1,
		autoDropPet: 	true,
		minHp: 			86 - 2,			
		minMp: 			90 - 2,
		minAttack: 		39,
		minDefensive: 	37,
		minAgility: 	34,
		petChecker: ()=>{
			var pets = cga.GetPetsInfo();
			//console.log(leo.logTime()+'宠物数量：'+pets.length);
			for(var i in pets){
				var pet = pets[i];
				if(petIndexMap[pet.index] && petIndexMap[pet.index] == 1){
					//原有的宠，不做处理
				}else{
					//新抓到的宠
					var isDrop = leo.isDropPet(pet,petOptions);
					if(pet.realname == petOptions.name && pet.level == 1 && isDrop.flag){
						if(cga.isInNormalState()){
							cga.DropPet(pet.index);
							leo.log('可惜！丢下宠物'+leo.getPetCalcInfo(pet)+'，'+isDrop.info);
						}
					}else{
						leo.log('恭喜！抓到宠物'+leo.getPetCalcInfo(pet));
						petIndexMap[pet.index] = 1;
					}
				}
			}
		}
	};

	var protect = {
		minHp: 500,
		minMp: 100,
		minPetHp: 500,
		minPetMp: 100,
		maxPetNumber: 4,	//超过4只宠物
		checker: petOptions.petChecker
	};

	const sets = [];
    sets.push({
        user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
        check: context => context.enemies.find(e => e.level == 1 && e.name == petOptions.name && e.maxhp >= petOptions.minHp && e.maxmp >= petOptions.minMp ) && cga.getInventoryItems().find(i => i.name == petOptions.sealCardName),
        type: '物品',
        item: context => cga.getInventoryItems().find(i => i.name == petOptions.sealCardName).pos,
        targets: context => [context.enemies.find(e => e.level == 1 && e.name == petOptions.name).pos]
    });
    sets.push({
        user: 1,
        check: context => true,
        type: '逃跑',
        targets: context => [context.player_pos]
    });
    sets.push({
        user: 2,
        check: context => context.enemies.find(e => e.level == 1 && e.name == petOptions.name) && cga.getInventoryItems().find(i => i.name == petOptions.sealCardName),
        skillName: petOptions.skillName,
        targets: context => [context.enemies.find(e => e.level == 1 && e.name == petOptions.name).pos]
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

	var isLogBackFirst = false;		//启动登出
	var isPrepare = false;			//招魂、治疗、补血、卖石

	var prepareOptions = {
		repairFlag: -1,
		crystalName: '水火的水晶（5：5）',
		doctorName: '医道之殇'
	};

	leo.log('红叶の原地抓【'+petOptions.name+'】脚本，启动~');

	var setting = '预设五围是：【' + petOptions.minHp + '/' + petOptions.minMp + '/' + petOptions.minAttack + '/' + petOptions.minDefensive + '/' + petOptions.minAgility +  '】，自动扔宠：【' + (petOptions.autoDropPet?'已启用':'未启用') + '】';
	leo.log(setting);

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
		console.log(index + '  ' + pet.realname + '  LV' + pet.level);
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