/**
 * 每一轮都回城开始，并不走回营地补给
 */
const captain = '';  // 队长名字
const teamNumber = 5;  // 队伍人数
const joinPoint = {x: 90, y: 86}; // 营地集合点
const protect = { // 遇敌保护条件
	minHp: 300,
	minMp: 30,
	minPetHp: 300,
	minPetMp: 0,
	maxItemNumber: 19,
	minTeamNumber: teamNumber
};
const prepareOptions = {
	crystalName: '水火的水晶（5：5）'
};

require('../wrapper').then(cga => {
	console.log('60-140');
	const captainPoint = [joinPoint.x, joinPoint.y-1];
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.recursion(() => {
		const currentMap = cga.GetMapName();
		const currentTeamNumber = cga.emogua.getTeamNumber();
		const isCaptain = cga.GetPlayerInfo().name == captain;

		if (isCaptain) {
			if (currentMap == '圣骑士营地') {
				if (currentTeamNumber < teamNumber) {
					return cga.emogua.autoWalk(captainPoint).then(() => cga.emogua.waitTeamBlock(teamNumber));
				}
				const level = cga.emogua.getTeamLevel();
				if (level < 72) {
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[547,324]
					]).then(
						() => cga.emogua.encounter(protect)
					).then(cga.emogua.leaveTeam);
				} else if (level >= 72 && level < 82) {
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[384,245,'蜥蜴洞穴'],
						[12,2,'肯吉罗岛'],
						[236,442]
					]).then(
						() => cga.emogua.encounter(protect)
					).then(cga.emogua.leaveTeam);
				} else if (level >= 82 && level < 95) {
					prepareOptions.crystalName = '风地的水晶（5：5）';
					const badge = cga.GetItemsInfo().find(i => i.name == '矮人徽章');
					if (!badge || cga.emogua.getDurability(badge).current < 50) {
						return Promise.resolve().then(() => {
							if (badge) {
								return cga.emogua.dropItems([badge.pos]);
							}
						}).then(() => cga.emogua.autoWalkList([
							[116,55,'酒吧'],
							[14,4]
						])).then(
							() => cga.emogua.talkNpc(14,5,cga.emogua.talkNpcSelectorYes)
						).then(
							() => cga.emogua.autoWalkList([
								[0,23,'圣骑士营地'],
								[36,87,'肯吉罗岛'],
								[384,245,'蜥蜴洞穴'],
								[12,2,'肯吉罗岛'],
								[231,434,'矮人城镇'],
								[97,124]
							])
						).then(
							() => cga.emogua.talkNpc(96,124,cga.emogua.talkNpcSelectorYes)
						).then(
							() => cga.emogua.talkNpc(96,124,cga.emogua.talkNpcSelectorYes)
						).then(
							() => cga.emogua.autoWalk([63,125])
						).then(
							() => cga.emogua.encounter(protect)
						).then(cga.emogua.leaveTeam);
					} else {
						return cga.emogua.autoWalkList([
							[36,87,'肯吉罗岛'],
							[384,245,'蜥蜴洞穴'],
							[12,2,'肯吉罗岛'],
							[231,434,'矮人城镇'],
							[97,124]
						]).then(
							() => cga.emogua.talkNpc(96,124,cga.emogua.talkNpcSelectorYes)
						).then(
							() => cga.emogua.autoWalk([63,125])
						).then(
							() => cga.emogua.encounter(protect)
						).then(cga.emogua.leaveTeam);
					}
				} else if (level >= 95 && level < 104) {
					prepareOptions.crystalName = '风地的水晶（5：5）';
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[384,245,'蜥蜴洞穴'],
						[17,4,'蜥蜴洞穴上层第1层']
					]).then(
						() => cga.emogua.encounter(protect)
					).then(cga.emogua.leaveTeam);
				} else if (level >= 104) {
					prepareOptions.crystalName = '水火的水晶（5：5）';
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[424,345,'黑龙沼泽1区']
					]).then(() => {
						if (level >= 120 && level < 128) {
							return cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == '黑龙沼泽5区');
						} else if (level >= 128) {
							return cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == '黑龙沼泽').then(
								() => cga.emogua.walkList([[13,17],[11,17,'*']])
							);
						}
					}).then(
						() => cga.emogua.encounter(protect)
					).then(cga.emogua.leaveTeam).catch(cga.emogua.logBack);
				}
			}
		} else {
			if (currentMap == '圣骑士营地' && currentTeamNumber == 1) {
				return cga.emogua.autoWalk([joinPoint.x, joinPoint.y]).then(() => cga.emogua.joinTeamBlock(captainPoint[0], captainPoint[1], captain));
			}
		}
		if (currentTeamNumber == 1) {
			return cga.emogua.logBack().then(
				() => cga.emogua.prepare(prepareOptions)
			).then(
				() => cga.emogua.falan.toCamp()
			).then(
				() => cga.emogua.autoWalkList([
					[87,72,'工房'],
					[20,23]
				])
			).then(
				() => cga.emogua.sell(21,23)
			).then(
				() => cga.emogua.autoWalk([30,37,'圣骑士营地'])
			);
		}
		if (currentMap == '矮人城镇' || currentMap == '蜥蜴洞穴上层第1层') {
			prepareOptions.crystalName = '风地的水晶（5：5）';
		} else if (currentMap.indexOf('黑龙沼泽') >= 0) {
			prepareOptions.crystalName = '水火的水晶（5：5）';
		}
		if (!isCaptain) {
			cga.emogua.checkStopEncounter(protect, true);
		}
		return cga.emogua.delay(3000);
	});
});
