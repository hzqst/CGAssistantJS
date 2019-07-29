
const captain = '';  // 队长名字
const teamNumber = 5;  // 队伍人数
require('../wrapper').then(cga => {
	console.log('雪山开传送');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.waitMessageUntil(chat => {
		if (chat.msg && chat.msg.indexOf('开传送') >= 0) {
			const npc = cga.GetMapUnits().find(u => u.unit_name.indexOf('传送石管理') >= 0);
			if (npc) cga.emogua.turnTo(npc.xpos, npc.ypos);
		}
	});

	const isCaptain = cga.GetPlayerInfo().name == captain;
	let workFlow = Promise.resolve();
	if (cga.GetMapName() == '莎莲娜海底洞窟 地下1楼') {
		if (isCaptain) {
			workFlow = workFlow.then(
				() => cga.emogua.walkList([[21,33]])
			).then(
				() => cga.emogua.waitTeamBlock(teamNumber)
			).then(
				() => cga.emogua.autoWalkList([
					[20,8,'莎莲娜海底洞窟 地下2楼'],
					[11,9,'莎莲娜海底洞窟 地下1楼'],
					[24,11,'莎莲娜'],
					[217,455,'杰诺瓦镇'],
					[58,43,'村长的家'],
					[13,7,'杰诺瓦镇的传送点'],
					[7,8]
				]).then(
					() => cga.emogua.walkList([
						[6,7],[7,8],[6,7],[7,8]
					])
				)
			).then(
				() => cga.emogua.sayWords('开传送')
			).then(
				() => cga.emogua.delay(15000)
			).then(
				() => cga.emogua.autoWalkList([
					[14,6,'村长的家'],
					[1,10,'杰诺瓦镇'],
					[44,33,'医院'],
					[10,5]
				])
			).then(
				() => cga.emogua.recharge(0)
			).then(
				() => cga.emogua.autoWalkList([
					[1,9,'杰诺瓦镇'],
					[24,40,'莎莲娜'],
					[235,338,'莎莲娜西方洞窟'],
					[45,9,'莎莲娜西方洞窟'],
					[57,13,'莎莲娜西方洞窟'],
					[36,7,'莎莲娜'],
					[183,161,'阿巴尼斯村'],
					[36,54,'村长的家'],
					[6,5,'村长的家'],
					[9,9,'阿巴尼斯村的传送点'],
					[5,14]
				]).then(
					() => cga.emogua.walkList([
						[4,15],[5,14],[4,15],[5,14]
					])
				)
			).then(
				() => cga.emogua.sayWords('开传送')
			).then(
				() => cga.emogua.delay(15000)
			).then(
				() => cga.emogua.autoWalkList([
					[5,4,'村长的家'],
					[6,13,'村长的家'],
					[6,13,'阿巴尼斯村'],
					[47,64,'医院'],
					[10,6]
				])
			).then(
				() => cga.emogua.recharge(0)
			).then(
				() => cga.emogua.autoWalkList([
					[1,9,'阿巴尼斯村'],
					[37,71,'莎莲娜'],
					[117,100,'魔法大学'],
					[74,93,'魔法大学内部'],
					[40,20]
				])
			);
		} else {
			workFlow = workFlow.then(
				() => cga.emogua.joinTeamBlock(21, 33, captain)
			);
		}
	} else {
		workFlow = workFlow.then(
			() => cga.emogua.prepare({rechargeFlag: 2})
		).then(
			() => cga.emogua.falan.toStone('W1')
		).then(
			() => cga.emogua.autoWalkList([
				[22,88,'芙蕾雅'],
				[200,165]
			])
		).then(
			() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
		);
	}
});
