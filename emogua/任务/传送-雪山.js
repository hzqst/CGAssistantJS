const teams = [
	['队长名','队员名1','队员名2','队员名3','队员名4'],
	['队长名','队员名1','队员名2','队员名3','队员名4']
];
require('../wrapper').then(cga => {
	console.log('雪山开传送');
	const {team, captain, isCaptain, teamNumber} = cga.emogua.parseTeams(teams);

	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.waitMessageUntil(chat => {
		if (chat.msg && chat.msg.indexOf('开传送') >= 0) {
			const npc = cga.GetMapUnits().find(u => u.unit_name.indexOf('传送石管理') >= 0);
			if (npc) cga.emogua.turnTo(npc.xpos, npc.ypos);
		}
	}, true);

	const teamGo = () => Promise.resolve().then(() => {
		if (isCaptain) {
			return cga.emogua.walkList([[21,33]]).then(
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
				() => cga.emogua.delay(3000)
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
					[235,338,'*'],
					[45,9,'*'],
					[57,13,'*'],
					[36,7,'莎莲娜'],
					[183,161,'阿巴尼斯村'],
					[36,54,'*'],
					[6,5,'*'],
					[9,9,'阿巴尼斯村的传送点'],
					[5,14]
				]).then(
					() => cga.emogua.walkList([
						[4,15],[5,14],[4,15],[5,14]
					])
				)
			).then(
				() => cga.emogua.delay(3000)
			).then(
				() => cga.emogua.sayWords('开传送')
			).then(
				() => cga.emogua.delay(15000)
			).then(
				() => cga.emogua.autoWalkList([
					[5,4,'*'],
					[6,13,'*'],
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
			).then(
				() => console.log('结束')
			);
		}
		return cga.emogua.joinTeamBlock(21, 33, captain);
	});
	if (cga.GetMapName() == '莎莲娜海底洞窟 地下1楼') {
		teamGo();
	} else {
		cga.emogua.logBack().then(
			() => cga.emogua.prepare()
		).then(
			() => cga.emogua.goto(n => n.falan.wout)
		).then(
			() => cga.emogua.autoWalkList([
				[200,165]
			])
		).then(
			() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
		).then(
			() => teamGo()
		);
	}
});
