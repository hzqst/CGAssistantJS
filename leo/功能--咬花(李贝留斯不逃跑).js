require('./common').then(cga => {
	//leo.baseInfoPrint();

	var target = 200;	//打算刷多少次
	var full = 4800;	//默认最多刷4800声望
	var protect = {
        minHp: 200
    };
    
	var playerinfo = cga.GetPlayerInfo();
	var title = leo.getPlayerSysTitle(playerinfo.titles);
	var count = 0;

	const profession = leo.getPlayerProfession();
	leo.log('红叶の咬花(李贝留斯不逃跑)脚本，启动~');
	if(cga.getItemCount('咬花')==0){
    	leo.log('身上没有【咬花】，脚本结束');
    	return;
    }
	leo.log('当前人物职业：【'+profession.name+'】，称号：【'+title+'】');
	leo.log('设置刷【'+target+'】次后停止');
	leo.log('请不要勾选CGA面板的自动战斗，否则优先级将高于此脚本内的设置');
	leo.panel.autoBattle(false);//关闭CGA面板的自动战斗
	var petIndex = playerinfo.petid;
	if(petIndex!=-1){
		//leo.log('脚本结束：请先设置不带宠，否则可能导致掉线');
		//return;
		//设置宠物不出战
	    cga.ChangePetState(petIndex, 0);
	}

	var titleUp = 180;
	if(playerinfo.level > 112){
		titleUp = 170;
	}
	if(playerinfo.level > 132){
		titleUp = 160;
	}
	if(playerinfo.level > 152){
		titleUp = 150;
	}
	titleUp = titleUp + 10;//不逃跑，加10声望

	//自动取下水晶
	var crystal = cga.GetItemsInfo().find(i => i.pos == 7);
	var emptyIndexes = leo.getEmptyBagIndexes();
    var emptyIndex = -1;
    if(crystal && emptyIndexes && emptyIndexes.length > 0 ){
    	emptyIndex = emptyIndexes[0];
        cga.MoveItem(crystal.pos, emptyIndex, -1);
    }

    //技能设置
    const sets = [];
	sets.push({
		user: 4,
		check: context => true,
		type: '防御',
		targets: context => [context.player_pos]
	});
	sets.push({
		user: 1,
		check: context => true,
		type: '攻击',
		targets: context => context.enemies.map(e => e.pos)
	});
	sets.push({
		user: 2,
		check: context => true,
		skillName: '防御',
		targets: context => [context.petUnit.pos]
	});
	var firstRoundDelay = 1;	//首回合延迟
	var roundDelay = 4000		//每回合延迟
	var force = true ;			//是否强制启用战斗配置
	leo.autoBattle(sets,firstRoundDelay,roundDelay,force);

    //拿称号
	var getTitle = () => {
		return leo.todo()
		.then(()=>leo.goto(n => n.falan.e1))
		.then(()=>leo.autoWalk([230, 84]))
		.then(()=>leo.turnDir(6))
		.then(()=>{
			playerinfo = cga.GetPlayerInfo();
			var newTitle = leo.getPlayerSysTitle(playerinfo.titles);
			if(title==newTitle){
				return leo.log('未获得新称号，当前人物称号为【'+newTitle+'】');
			}else{
				return leo.log('获得新称号【'+newTitle+'】');
			}
		})
		.then(()=>leo.autoWalk([234,108]))
		.then(()=>leo.turnDir(0))
		.then(()=>leo.done());
	}

	leo.todo()
	.then(()=>{
		return leo.loop(
			()=>leo.todo()
			.then(()=>{
				var titleGet = titleUp * count;
				if(titleGet>= full || count >= target){
					return leo.log('已刷够' + target + '次，获得声望【' + titleGet + '】')
					.then(()=>{
						if(petIndex!=-1){
							//恢复宠物出战状态
						    cga.ChangePetState(petIndex, cga.PET_STATE_BATTLE);
						}
						return leo.delay(500);
					})
					.then(()=>{
						if(emptyIndex!=-1){
							//自动穿上水晶
						    cga.MoveItem(emptyIndex, 7, -1);
						}
						return leo.delay(500);
					})
					.then(()=>getTitle())
					.then(()=>leo.reject());
				}
				if(cga.GetPlayerInfo().hp <= protect.minHp){
					return leo.logBack()
					.then(()=>leo.supplyCastle());			        
				}
				var mapInfo = cga.getMapInfo();
				if(mapInfo.name == '艾尔莎岛'){
					return leo.autoWalk([157, 93])
					.then(()=>leo.delay(500))
			        .then(()=>leo.turnDir(0))
			        .then(()=>leo.delay(500))
			        .then(()=>leo.autoWalk([106, 121]))
			        .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'回忆之间'));
				}

				if(mapInfo.name == '回忆之间' && mapInfo.indexes.index3 == 44641){
					return leo.logBack();
				}
				if(mapInfo.name == '回忆之间' && mapInfo.indexes.index3 == 44642){
					return leo.autoWalk([7,7])
					.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
					.then(()=>leo.waitAfterBattle())
					.then(()=>{
						count++;
						var nowTime = leo.now();
						var time = parseInt((nowTime - leo.beginTime)/1000/60);//已持续练级时间
						time = time==0?1:time;
						var titleGet = titleUp * count;
						var content = '红叶の咬花(李贝留斯不逃跑)脚本，已刷次数【' + count + '/' + target + '】，获得声望【' + titleGet + '】，共耗时'+time+'分钟';
						leo.say(content);
						if(count%5 == 0){
							console.log(leo.logTime()+content);
						}
						return leo.delay(500);
					});
				}else{
					return leo.logBack();
				}
				return leo.delay(2000);
			})
		);
	})
	.catch(()=>{return leo.log('结束脚本')});
});