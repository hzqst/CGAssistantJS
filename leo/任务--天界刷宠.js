require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数

    var autoBoss = true; //自动打BOSS
    var autoOpen = true; //自动开奖
    var prizeSetting = {
    	'依格罗斯' : true,
    	'翼龙' : true,
    	'麒麟' : true,
    	'罗修' : false
    }

	var isLogBackFirst = false; //启动登出
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の天界刷宠脚本，启动~');

	var count = 1;

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

    if(!playerinfo.titles.includes('天界变革者')){
    	leo.log('人物没有称号【天界变革者】，需要先做天界2任务，脚本结束');
    	return;
    }

    var getCount = [0,0,0,0];//依格罗斯、翼龙、麒麟、罗修
    var openPrize = ()=>{
    	leo.log('红叶の天界1脚本，队长【'+teamLeader+'】');
    	return leo.todo()
    	.then(()=>{
			console.log();
			console.log('==========刮奖区==========');
			if(cga.getItemCount('偏方多面体的卵')>0){
				if(autoOpen){
					console.log('获得了【偏方多面体的卵】，自动开奖');
					var oldPetIndexs = cga.GetPetsInfo().map(pet=>pet.index);
					if(oldPetIndexs.length>=5){
						console.log('开奖失败，宠物已满，请至少留一个空位');
						return leo.next();
					}else{
						return leo.useItemEx('偏方多面体的卵')
						.then(()=>leo.waitNPCDialog(dialog => {
							cga.ClickNPCDialog(4, -1);
							return leo.delay(1000);
						}))
						.then(()=>{
							var newPets = cga.GetPetsInfo();
							var pet = newPets.find(p=>{
								return !is_array_contain(oldPetIndexs, p.index);
							})
							if(pet.realname == '依格罗斯'){
								if(prizeSetting[pet.realname]){
									leo.log('恭喜，得到了'+leo.getPetCalcInfo(pet));
								}else{
									leo.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
									cga.DropPet(pet.index);
								}
								getCount[0]++;
							}
							if(pet.realname == '翼龙'){
								if(prizeSetting[pet.realname]){
									leo.log('恭喜，得到了'+leo.getPetCalcInfo(pet));
								}else{
									leo.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
									cga.DropPet(pet.index);
								}
								getCount[1]++;
							}
							if(pet.realname == '麒麟'){
								if(prizeSetting[pet.realname]){
									leo.log('恭喜，得到了'+leo.getPetCalcInfo(pet));
								}else{
									leo.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
									cga.DropPet(pet.index);
								}
								getCount[2]++;
							}
							if(pet.realname == '罗修'){
								if(prizeSetting[pet.realname]){
									leo.log('恭喜，得到了'+leo.getPetCalcInfo(pet));
								}else{
									leo.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
									cga.DropPet(pet.index);
								}
								getCount[3]++;
							}
							return console.log('战利品：【'+getCount+'】 【依格罗斯、翼龙、麒麟、罗修】');
						});
					}
				}else{
					console.log('获得了【偏方多面体的卵】，请手动开奖');
					return console.log('战利品：【'+getCount+'】 【依格罗斯、翼龙、麒麟、罗修】');
				}
			}else{
				console.log('没有获得【偏方多面体的卵】');
				return console.log('战利品：【'+getCount+'】 【依格罗斯、翼龙、麒麟、罗修】');
			}
		})
		.then(()=>{
			console.log('==========刮奖区==========');
			console.log();
		});
    }


    var task1 = ()=>{
		return leo.todo()
		.then(()=>{
			if(cga.getItemCount('王冠')==0){
		    	return leo.log('身上没有【王冠】，去银行获取')
		    	.then(()=>leo.goto(n => n.falan.bank))
		    	.then(()=>leo.turnDir(0))
		    	.then(()=>leo.getOneFromBank('王冠'))
		    	.then(()=>{
		    		if(cga.getItemCount('王冠')==0){
		    			leo.log('身上和银行都没有【王冠】，脚本结束');
		    			return leo.reject();
		    		}
		    	})
		    	.then(()=>leo.logBack());
		    }
		    if(cga.getItemCount('王冠')>1){
		    	leo.log('身上的【王冠】只能带1个，多余的请先存银行，脚本结束');
		    	return leo.reject();
		    }
		})
		.then(()=>{
			if(isLogBackFirst){
				return leo.logBack()
				.then(()=>leo.prepare(prepareOptions));
			}
		})
		.then(()=>leo.checkHealth(prepareOptions.doctorName))
		.then(()=>{
			return leo.loop(()=>{
				var mapInfo = cga.getMapInfo();
				if(mapInfo.name == '里谢里雅堡' 
					|| (mapInfo.name == '法兰城' && mapInfo.indexes.index3 != 59513)){
					return leo.logBack();
				}
				if(mapInfo.name == '艾尔莎岛'){
					return leo.autoWalk([165,153])
					.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'));
				}
				if(mapInfo.name == '利夏岛'){
					return leo.autoWalk([90,99,'国民会馆']);
				}
				if(mapInfo.name == '国民会馆'){
					return leo.autoWalk([108,51])
					.then(()=>leo.supplyDir(2))
					.then(()=>leo.autoWalk([108,39,'雪拉威森塔１层']));
				}
				if(mapInfo.name == '雪拉威森塔１层'){
					return leo.autoWalk([34,95])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'辛梅尔'));
				}
				if(mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59526){
					return leo.autoWalk([192,82,'第二宝座']);
				}
				if(mapInfo.name == '第二宝座'){
					return leo.autoWalk([105,20,'辛梅尔']);
				}
				if(mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59519){ //59519
					return leo.autoWalk([26,15])
					.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes));
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984
					&& mapInfo.x == 198 && mapInfo.y == 15){ //59984
					return leo.walkTo([201,18])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
				}
				if(mapInfo.name == '法兰城' && mapInfo.indexes.index3 == 59513
					&& mapInfo.x == 153 && mapInfo.y == 104){ //59513
					return leo.autoWalk([153,121,[167,28]]);
				}
				if(mapInfo.name == '法兰城' && mapInfo.indexes.index3 == 59513
					&& mapInfo.x == 167 && mapInfo.y == 28){ //59513
					return leo.autoWalk([169,26])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
					.then(()=>leo.autoWalk([167,19]))
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
					.then(()=>leo.autoWalk([166,15]))
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
					.then(()=>leo.autoWalk([163,23]))
					.then(()=>leo.talkNpc(4,leo.talkNpcSelectorYes));
				}
				if(mapInfo.name == '法兰城' && mapInfo.indexes.index3 == 59513
					&& (mapInfo.x == 116 || mapInfo.x == 117) && mapInfo.y == 69 && !leo.isInTeam()){ //59513
					if (isTeamLeader) {
						return leo.autoWalk([117,69])
						.then(()=>leo.buildTeamBlock(teamPlayerCount))
						.then(()=>leo.autoWalk([119,67]))
						.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
					}else{
						return leo.enterTeamBlock(teamLeader);
					}
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984
					&& mapInfo.x == 158 && mapInfo.y == 55){ //59984
					if(isTeamLeader || !leo.isInTeam()){
						return leo.walkTo([161,58])
						.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
					}
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59982
					&& mapInfo.x == 105 && mapInfo.y == 142){ //59982
					if(isTeamLeader || !leo.isInTeam()){
						return leo.walkTo([101,137])
						.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes));
					}
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984
					&& mapInfo.x == 118 && mapInfo.y == 95){ //59984
					if(isTeamLeader || !leo.isInTeam()){
						return leo.walkTo([121,98])
						.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
					}
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59988
					&& mapInfo.x == 356 && mapInfo.y == 179){ //59988
					if(isTeamLeader || !leo.isInTeam()){
						return leo.walkTo([357,172])
						.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
					}
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59986
					&& mapInfo.x == 135 && mapInfo.y == 59){ //59986
					if(isTeamLeader || !leo.isInTeam()){
						return leo.walkTo([140,60])
						.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes));
					}
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59982
					&& (mapInfo.x == 199 || mapInfo.x == 200) && mapInfo.y == 67){ //59982
					return leo.reject();//退出循环，进入下一步
				}
				return leo.delay(2000);
			});
		})
		.then(()=>{
			if (isTeamLeader) {
				return leo.autoWalk([200,67])
				.then(()=>leo.buildTeamBlock(teamPlayerCount));
			}else{
				return leo.enterTeamBlock(teamLeader);
			}
		})
		.then(()=>{
			if(isTeamLeader){
				return leo.autoWalkList([
					[205,55,[158,109]],
					[165,105,[239,107]],
					[234,106,[198,149]],
					[193,132,[229,260]],
					[207,239]
				])
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 204 && mapInfo.y == 235) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([193,215]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 199 && mapInfo.y == 209) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([227,199]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 232 && mapInfo.y == 203) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([258,230]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 283 && mapInfo.y == 149) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.autoWalk([281,156]))
				.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([81,138]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
				.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 319 && mapInfo.y == 139) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.leaveTeam());
			}else{
				return leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.x == 319 && mapInfo.y == 139 && !leo.isInTeam()) {
						return true;
					}
					return false;
				});
			}
		})
		.then(()=>leo.autoWalk([319,148]))
		.then(()=>leo.waitNPCDialog(dialog => {
			cga.ClickNPCDialog(4, -1);
			return leo.delay(2000);
		}))
		.then(()=>leo.waitUntil(()=>{
			var mapInfo = cga.getMapInfo();
			if (mapInfo.name == '辛梅尔') {
				return true;
			}
			return false;
		}))
		.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
		.then(()=>leo.waitUntil(()=>{
			var mapInfo = cga.getMapInfo();
			if (mapInfo.name == '辛梅尔' && mapInfo.indexes.index3 == 59526) {
				return true;
			}
			return false;
		}))
		.then(()=>leo.log('天界1任务已完成'))
		.then(()=>leo.logBack());
    }

    var task3 = ()=>{
    	leo.log('红叶の天界3脚本，队长【'+teamLeader+'】');
    	if(cga.getItemCount('托尔丘的记忆')==0){
	    	leo.log('身上没有【托尔丘的记忆】，需要先做天界1任务');
	    	return leo.done();
	    }

		return leo.todo()
		.then(()=>{
			if(isLogBackFirst){
				return leo.logBack()
				.then(()=>leo.prepare(prepareOptions));
			}
		})
		.then(()=>leo.checkHealth(prepareOptions.doctorName))
		.then(()=>{
			return leo.loop(()=>{
				var mapInfo = cga.getMapInfo();
				if(mapInfo.name == '里谢里雅堡' || mapInfo.name == '法兰城'){
					return leo.logBack();
				}
				if(mapInfo.name == '艾尔莎岛'){
					return leo.autoWalk([165,153])
					.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'));
				}
				if(mapInfo.name == '利夏岛'){
					return leo.autoWalk([90,99,'国民会馆']);
				}
				if(mapInfo.name == '国民会馆'){
					return leo.autoWalk([108,51])
					.then(()=>leo.supplyDir(2))
					.then(()=>leo.autoWalk([115,50]))
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'？？？'));
				}
				if(mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984 && (mapInfo.x == 239 || mapInfo.x == 238) && mapInfo.y == 147){
					return leo.reject();	//退出循环，进入下一步
				}
				return leo.delay(2000);
			});
		})
		.then(()=>{
			//走随机迷宫
			return leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.name == '？？？' && mapInfo.indexes.index3 == 59984 && (mapInfo.x == 239 || mapInfo.x == 238) && mapInfo.y == 147 && !leo.isInTeam()) {
					return true;
				}
				return false;
			})
			.then(()=>{
				if (isTeamLeader) {
					return leo.autoWalk([238,147])
					.then(()=>leo.buildTeamBlock(teamPlayerCount))
					.then(()=>leo.autoWalk([238,139,[359,180]]))
					.then(()=>leo.autoWalk([355,180,[319,220]]))
					.then(()=>leo.autoWalk([315,220,[279,260]]))
					.then(()=>leo.autoWalk([279,256,59988]))
					.then(()=>leo.autoWalk([203,14,'通向顶端的阶梯1楼']))
					.then(()=>leo.walkRandomMazeUntil(() => {
	                        const mn = cga.GetMapName();
	                        if (mn == '？？？') {
	                            return true;
	                        }
	                        return false;
	                },false))
					.then(()=>leo.autoWalk([163,54,59992]))
					.then(()=>leo.autoWalk([103,19]))
					.then(()=>{
						if(autoBoss){
							return leo.talkNpc(104,18,leo.talkNpcSelectorYes)
							.then(()=>leo.waitAfterBattle());
						}else{
							return leo.turnDir(4)
							.then(()=>leo.log('已到达BOSS前，请手动战斗'))
							.then(()=>leo.waitAfterBattle());
						}
					})
					.then(()=>leo.waitUntil(()=>{
						var mapInfo = cga.getMapInfo();
						if (mapInfo.x == 109 && mapInfo.y == 145) {
							return true;
						}
						return false;
					}))
					//.then(()=>leo.leaveTeam())
					.then(()=>leo.autoWalk([116,131]))
					.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
					.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
					.then(()=>leo.next());
				}else{
					return leo.enterTeamBlock(teamLeader)
					// .then(()=>leo.waitUntil(()=>{
					// 	var mapInfo = cga.getMapInfo();
					// 	if (mapInfo.x == 109 && mapInfo.y == 145 && !leo.isInTeam()) {
					// 		return true;
					// 	}
					// 	return false;
					// }))
					// .then(()=>leo.autoWalk([116,131]))
					// .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
					// .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
					.then(()=>leo.next());
				}
			});
		})
		.then(()=>{
			//星之领域
			return leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.name.indexOf('星之领域') != -1) {
					return true;
				}
				return false;
			})
			.then(()=>{
				if (isTeamLeader) {
					return leo.loop(()=>{
						var mapInfo = cga.getMapInfo();
						if(mapInfo.name == '星之领域　１层' && mapInfo.indexes.index3 == 59757 && (mapInfo.x == 80 || mapInfo.x == 81) && mapInfo.y == 107 && !leo.isInTeam()){
							return leo.autoWalk([81,107])
							.then(()=>leo.buildTeamBlock(teamPlayerCount));
						}
						if(mapInfo.name == '星之领域　１层' && mapInfo.indexes.index3 == 59757 && (mapInfo.x == 80 || mapInfo.x == 81) && mapInfo.y == 107 && leo.isInTeam()){
							return leo.autoWalk([99,17,'星之领域　２层']);
						}
						if(mapInfo.name == '星之领域　２层' && mapInfo.indexes.index3 == 59758 && mapInfo.x == 101 && mapInfo.y == 16){
							return leo.autoWalk([29,89,'星之领域　３层']);
						}
						if(mapInfo.name == '星之领域　３层' && mapInfo.indexes.index3 == 59759 && mapInfo.x == 31 && mapInfo.y == 88){
							return leo.autoWalk([107,167,'星之领域　２层']);
						}
						if(mapInfo.name == '星之领域　２层' && mapInfo.indexes.index3 == 59758 && mapInfo.x == 105 && mapInfo.y == 168){
							return leo.autoWalk([166,102,'星之领域　３层']);
						}
						if(mapInfo.name == '星之领域　２层' && mapInfo.indexes.index3 == 59758 && (mapInfo.x >= 60 && mapInfo.x <= 64) && (mapInfo.y >= 56 && mapInfo.y <= 59)){
							return leo.autoWalk([63,49,'星之领域　３层']);
						}
						if(mapInfo.name == '星之领域　３层' && mapInfo.indexes.index3 == 59759 && mapInfo.x == 168 && mapInfo.y == 101){
							return leo.autoWalk([97,28,'星之领域　４层']);
						}
						if(mapInfo.name == '星之领域　３层' && mapInfo.indexes.index3 == 59759 && mapInfo.x == 63 && mapInfo.y == 48){
							return leo.autoWalk([66,56,'星之领域　４层']);
						}
						if(mapInfo.name == '星之领域　４层' && mapInfo.indexes.index3 == 59760 && mapInfo.x == 98 && mapInfo.y == 27){
							return leo.autoWalk([108,98,'星之领域　５层']);
						}
						if(mapInfo.name == '星之领域　４层' && mapInfo.indexes.index3 == 59760 && mapInfo.x == 68 && mapInfo.y == 55){
							return leo.autoWalk([108,98,'星之领域　５层']);
						}
						if(mapInfo.name == '星之领域　５层' && mapInfo.indexes.index3 == 59761 && mapInfo.x == 110 && mapInfo.y == 97){
							return leo.autoWalk([141,113])
							.then(()=>leo.clickTo(142,113));
						}
						if(mapInfo.name == '星之领域　５层' && mapInfo.indexes.index3 == 59761 && mapInfo.x == 83 && mapInfo.y == 129){
							return leo.autoWalk([141,113])
							.then(()=>leo.clickTo(142,113));
						}
						if(mapInfo.name == '星之领域　５层' && mapInfo.indexes.index3 == 59761 && mapInfo.x == 32 && mapInfo.y == 99){
							return leo.reject();	//退出循环，进入下一步
						}
						return leo.delay(2000);
					})
					.then(()=>leo.autoWalk([39,98]))
					.then(()=>{
						if(autoBoss){
							return leo.talkNpc(40, 99, leo.talkNpcSelectorYes)
							.then(()=>leo.waitAfterBattle());
						}else{
							return leo.turnDir(4)
							.then(()=>leo.log('已到达BOSS前，请手动战斗'))
							.then(()=>leo.waitAfterBattle());
						}
					})
					.then(()=>leo.waitUntil(()=>{
						var mapInfo = cga.getMapInfo();
						if (mapInfo.name == '约尔克神庙') {
							return true;
						}
						return false;
					}))
					.then(()=>leo.leaveTeam())
					.then(()=>leo.autoWalk([41,28]))
					.then(()=>leo.talkNpc(42, 28, leo.talkNpcSelectorYes))
					.then(()=>leo.talkNpc(42, 27, leo.talkNpcSelectorYes))
					.then(()=>leo.log('天界3任务已完成'));
				}else{
					return leo.enterTeamBlock(teamLeader)
					.then(()=>leo.waitUntil(()=>{
						var mapInfo = cga.getMapInfo();
						if (mapInfo.name == '约尔克神庙' && !leo.isInTeam()) {
							return true;
						}
						return false;
					}))
					.then(()=>leo.autoWalk([41,28]))
					.then(()=>leo.autoWalkList([[41,27],[41,28],[41,27],[41,28]]))
					.then(()=>leo.talkNpc(42, 28, leo.talkNpcSelectorYes))
					.then(()=>leo.talkNpc(42, 27, leo.talkNpcSelectorYes))
					.then(()=>leo.log('天界3任务已完成'));
				}
			});
		})
		.then(()=>leo.logBack());
    }

    leo.loop(()=>{
        try{
           return leo.todo()
           .then(()=>{
           		if(cga.getItemCount('托尔丘的记忆')==0){
			    	//leo.log('身上没有【托尔丘的记忆】，先做天界1任务');
			    	return task1();
			    }
           })
           .then(()=>task3())
           .then(()=>openPrize())
           .then(()=>leo.log('红叶の天界刷宠，完成第' + (count++) + '次'))
           .then(()=>leo.checkHealth(prepareOptions.doctorName));
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })
    
});