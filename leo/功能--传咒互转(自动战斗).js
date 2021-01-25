require('./common').then(cga=>{
	//leo.baseInfoPrint();
	//没有转职保证书也强制转职，可设置成true，默认false，
	var forceChange = true;
	var needGold = 10000;
	var isLogBackFirst = true;
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };

	leo.log('红叶の传咒互转脚本，启动~');
	leo.log('请不要勾选CGA面板的自动战斗，否则优先级将高于此脚本内的设置');
	leo.panel.autoBattle(false);//关闭CGA面板的自动战斗

	var isCanChange = true;
	var hasItem = cga.getItemCount('转职保证书') > 0;
	if(!forceChange && !hasItem){
		leo.log('红叶の传咒互转脚本，身上【没有】转职保证书！结束脚本');
		isCanChange = false;
	}

	if(hasItem){
		leo.log('身上【有】转职保证书');
	}else{
		leo.log('身上【没有】转职保证书!!!');
	}

	//技能设置
    const sets = [];
	sets.push({
		user: 1,
		check: context => true,
		type: '逃跑',
		targets: context => [context.player_pos]
	});
	sets.push({
		user: 4,
		check: context => true,
		type: '防御',
		targets: context => [context.player_pos]
	});
	sets.push({
		user: 2,
		check: context => true,
		skillName: '防御',
		targets: context => [context.petUnit.pos]
	});
	var firstRoundDelay = 1;	//首回合延迟
	var roundDelay = 1			//每回合延迟
	var force = true ;			//是否强制启用战斗配置
	leo.autoBattle(sets,firstRoundDelay,roundDelay,force);

	var petIndex = cga.GetPlayerInfo().petid;
	if(petIndex==-1){
		var pets = cga.GetPetsInfo();
	    cga.ChangePetState(pets[0].index, cga.PET_STATE_BATTLE);
	}

	leo.todo()
	.then(()=>{
		var playerinfo = cga.GetPlayerInfo();
		if(playerinfo.gold < needGold){
			return leo.goto(n => n.falan.bank)
			.then(()=>leo.turnDir(0))
			.then(()=>leo.moveGold(needGold,cga.MOVE_GOLD_FROMBANK))
			.then(()=>{
				playerinfo = cga.GetPlayerInfo();
				if(playerinfo.gold < needGold){
					return leo.log('魔币不足，请检查')
					.then(()=>leo.reject());
				}
			});
		}
	})
	.then(()=>{
		var crystal = cga.GetItemsInfo().find(i => i.pos == 7);
		if(!crystal){
			var crystalName = '水火的水晶（5：5）';
			return leo.buyCrystal(crystalName,1)
			.then(()=>leo.useItemEx(crystalName));
		}
	})
	.then(()=>{
		if(isCanChange){
			var playerinfo = cga.GetPlayerInfo();
			var profession = leo.getPlayerProfession();
			if(profession.name == '传教士'){
				//当前是传教，转成咒术
				leo.log('当前职业：'+playerinfo.job+'，需要转成咒术');
				leo.todo().then(()=>{
					if(isLogBackFirst){
						return leo.logBack();
					}else{
						return leo.next();
					}
				})
				.then(()=>{
					return leo.prepare(prepareOptions)	//招魂、治疗、补血、卖石
					.then(()=>leo.goto(n => n.falan.w1))
					.then(()=>leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]]));
				})
				.then(()=>{
					return leo.talkNpc(201, 165,leo.talkNpcSelectorYes,'莎莲娜海底洞窟 地下1楼');
				})
				.then(()=>{
					return leo.autoWalkList([
						[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]
					]);
				})
				.then(()=>leo.turnTo(31, 22))
				.then(()=>leo.delay(1000))
				.then(()=>{
					cga.SayWords('咒术', 1, 3, 1);
					return leo.waitNPCDialog(dialog => {
						cga.ClickNPCDialog(1, -1);
						return leo.delay(2000);
					});
				})
				.then(()=>{
					return leo.autoWalkList([
						[38, 37 ,'咒术师的秘密住处'],[10, 0 ,15008],[10, 0]
					]);
				})
				.then(()=>leo.talkNpc(11, 0,leo.talkNpcSelectorYes))
				.then(()=>leo.autoWalk([10, 10]))
				.then(()=>leo.turnTo(11, 10))
				.then(()=>{
		        	if(hasItem){
		        		return leo.talkNpc(0, (dialog) => {
		        			if(dialog && dialog.message && dialog.message.indexOf('我想转职') >= 0){
		        				cga.ClickNPCDialog(0, 1);
		        				return true;
		        			}
		        			if(dialog && dialog.message && dialog.message.indexOf('转职以后') >= 0){
		        				cga.ClickNPCDialog(32, -1);
		        				return true;
		        			}
		        			if(dialog && dialog.message && dialog.message.indexOf('5000个金币') >= 0){
		        				cga.ClickNPCDialog(0, 0);
		        				return false;
		        			}
							return false;
						})
						.then(()=>leo.log('到达转职位置!身上【有】转职保证书，已自动完成转职'));
		        	}else{
		        		return leo.log('到达转职位置!请注意：身上【没有】转职保证书!!!');
		        	}
		        })
		        .then(()=>leo.log('脚本结束'));
			}else{
				//当前非传教，转成传教
				leo.log('当前职业：'+playerinfo.job+'，需要转成传教');
				leo.todo().then(()=>{
					if(isLogBackFirst){
						return leo.logBack();
					}else{
						return leo.next();
					}
				})
				.then(()=>leo.goto(n => n.castle.x))
				.then(() => leo.autoWalkList([
		            [41, 14, '法兰城'],
		            [154, 29, '大圣堂的入口'],
		            [14, 7, '礼拜堂'],
		            [23, 0,'大圣堂里面'],
					[15, 11]
		        ]))
				.then(()=>leo.talkNpc(16, 11,leo.talkNpcSelectorYes))
		        .then(()=>leo.autoWalk([16, 9]))
		        .then(()=>leo.turnTo(17, 9))
		        .then(()=>{
		        	if(hasItem){
		        		return leo.talkNpc(0, (dialog) => {
		        			if(dialog && dialog.message && dialog.message.indexOf('我想转职') >= 0){
		        				cga.ClickNPCDialog(0, 1);
		        				return true;
		        			}
		        			if(dialog && dialog.message && dialog.message.indexOf('转职以后') >= 0){
		        				cga.ClickNPCDialog(32, -1);
		        				return true;
		        			}
		        			if(dialog && dialog.message && dialog.message.indexOf('5000个金币') >= 0){
		        				cga.ClickNPCDialog(0, 0);
		        				return false;
		        			}
							return false;
						})
						.then(()=>leo.log('到达转职位置!身上【有】转职保证书，已自动完成转职'));
		        	}else{
		        		return leo.log('到达转职位置!请注意：身上【没有】转职保证书!!!');
		        	}
		        })
		        .then(()=>leo.log('脚本结束'));
			}
		}
	})
	.catch(console.log);
});