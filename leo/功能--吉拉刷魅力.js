require('./common').then(cga => {
	var target = 100;//目标魅力，101等于无限刷

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };
	var playerinfo = cga.GetPlayerInfo();
	var value_charisma = playerinfo.detail.value_charisma;//魅力值
	leo.log('红叶の吉拉刷魅力脚本，启动~');
	leo.log('当前人物魅力【'+value_charisma+'】，目标魅力是【'+target+'】');
	if(value_charisma>=target){
		leo.log('魅力值已满【'+target+'】，脚本结束');
		return;
	}
	leo.log('请不要勾选CGA面板的自动战斗，否则优先级将高于此脚本内的设置');
	leo.panel.autoBattle(false);//关闭CGA面板的自动战斗
	leo.panel.noswitchanim(false);//关闭CGA面板的“屏蔽切图”
	
	var petIndex = playerinfo.petid;
	if(petIndex!=-1){
		//leo.log('脚本结束：请先设置不带宠，否则可能导致掉线');
		//return;
		//设置宠物不出战
	    cga.ChangePetState(petIndex, 0);
	}
	//技能设置
    const sets = [];
    sets.push({
		user: 4,//1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
		check: context => true,
		type: '攻击',
		targets: context => context.enemies.map(e => e.pos)
	});
	sets.push({
		user: 1,//1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
		check: context => true,
		type: '攻击',
		targets: context => context.enemies.map(e => e.pos)
	});
	var firstRoundDelay = 1;	//首回合延迟
	var roundDelay = 1			//每回合延迟
	var force = true ;			//是否强制启用战斗配置
	leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
	leo.loop(
		() => leo.logBack()
		.then(()=>{
			if(cga.GetPlayerInfo().detail.value_charisma>=target){
				if(petIndex!=-1){
					//恢复宠物出战状态
				    cga.ChangePetState(petIndex, cga.PET_STATE_BATTLE);
				}
				leo.log('魅力值已满【'+target+'】，脚本结束');
				return leo.reject();
			}
		})
		.then(() => leo.checkHealth(prepareOptions.doctorName))
		.then(
			() => leo.goto(n => n.falan.s1)
		).then(
			() => leo.autoWalk([124, 161])
		).then(
			() => leo.turnOrientation(4, '竞技场的入口')
		).then(
			() => leo.autoWalkList([
				[27,14,'治愈的广场'],
				[25,13]
			])
		).then(
			() => leo.talkNpc(0,leo.talkNpcSelectorYes,'竞技场')
		).then(
			() => leo.autoWalkList([
				[22,13,'*'],
				[15,8,'*'],
				[22,8,'*'],
				[15,8,'*'],
				[22,16,'*'],
				[16,12]
			])
		).then(
			() => leo.dropItems(i => i.name == '斗士之证')
		).then(
			() => leo.talkNpc(6,leo.talkNpcSelectorYes)
		).then(
			() => leo.autoWalk([16,6])
		).then(
			() => leo.talkNpc(4,leo.talkNpcSelectorYes)
		).then(
			() => leo.talkNpc(7,leo.talkNpcSelectorYes)
		).then(() => {
			let position = [31,23];
			let orientation = 0;
			return leo.autoWalk(position).then(
				() => leo.loop(
					() => leo.talkNpc(orientation,leo.talkNpcSelectorYes).then(
						() => leo.waitAfterBattle()
					).then(() => {
						var value_charisma = cga.GetPlayerInfo().detail.value_charisma;
						console.log(leo.logTime()+'当前人物魅力【'+value_charisma+'】');
						if(value_charisma>=target){
							return leo.reject();
						}
						const f = cga.getInventoryItems().find(i => i.itemid == 18257 && i.itemid != 18256);
						const pet = cga.GetPetsInfo().find(e => e.battle_flags === 2);
						if (f && cga.GetPlayerInfo().hp > 200 && (!pet || pet.hp > 200)) {
							return leo.dropItems([f.pos]);
						}
						return leo.reject();
					})
				)
			);
		})
	);
});
