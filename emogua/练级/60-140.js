/**
 * 每一轮都回城开始，并不走回营地补给
 */
const teams = [
	['巫师の吉米花','医生西瓜','战斧の吉米花', '士兵の吉米花', '法师の吉米花'],
	['西瓜保姆','西瓜6号机','西瓜7号机','西瓜8号机','西瓜9号机']
];  // 组队信息
const joinPoint = {x: 90, y: 86}; // 营地集合点
const protect = { // 遇敌保护条件
	minHp: 300,
	minMp: 30,
	minPetHp: 300,
	minPetMp: 0,
	maxItemNumber: 19
};
const prepareOptions = {
	crystalName: '水火的水晶（5：5）',
	repairFlag: 0
};

require('../wrapper').then(cga => {
	console.log('60-140');
	const {team, captain, isCaptain, teamNumber} = cga.emogua.parseTeams(teams);
	protect.minTeamNumber = teamNumber;

	const captainPoint = [joinPoint.x, joinPoint.y-1];
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.recursion(() => Promise.resolve().then(() => {
		const currentMap = cga.GetMapName();
		const currentTeamNumber = cga.emogua.getTeamNumber();

		if (isCaptain) {
			if (currentMap == '圣骑士营地') {
				if (currentTeamNumber < teamNumber) {
					return cga.emogua.autoWalk(captainPoint).then(() => cga.emogua.waitTeamBlock(teamNumber, team));
				}
				const level = cga.emogua.getTeamLevel();
				if (level < 72) {
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[547,324]
					]).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.leaveTeam()
					);
				} else if (level >= 72 && level < 82) {
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[384,245,'蜥蜴洞穴'],
						[12,2,'肯吉罗岛'],
						[236,442]
					]).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.leaveTeam()
					);
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
						).then(
							() => cga.emogua.leaveTeam()
						);
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
						).then(
							() => cga.emogua.leaveTeam()
						);
					}
				} else if (level >= 95 && level < 104) {
					prepareOptions.crystalName = '风地的水晶（5：5）';
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[384,245,'蜥蜴洞穴'],
						[17,4,'蜥蜴洞穴上层第1层']
					]).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.leaveTeam()
					);
				} else if (level >= 104) {
					prepareOptions.crystalName = '水火的水晶（5：5）';
					prepareOptions.badge = true;
					return cga.emogua.autoWalkList([
						[36,87,'肯吉罗岛'],
						[424,343]
					]).then(
						() => cga.emogua.waitUntil(
							() => cga.getMapObjects().find(e => e.cell === 3 && e.mapx == 424 && e.mapy == 345)
						)
					).then(
						() => cga.emogua.autoWalk([424,345,'黑龙沼泽1区'])
					).then(() => {
						if (level >= 120 && level < 128) {
							return cga.emogua.walkRandomMazeUntil(() => {
								const mn = cga.GetMapName();
								if (mn == '黑龙沼泽5区') {
									return true;
								} else if (mn == '肯吉罗岛') {
									return Promise.reject('迷宫刷新');
								}
							}, false);
						} else if (level >= 128) {
							return cga.emogua.walkRandomMazeUntil(() => {
								const mn = cga.GetMapName();
								if (mn == '黑龙沼泽') {
									return cga.emogua.autoWalk([11,17,'*']);
								} else if (mn == '肯吉罗岛') {
									return Promise.reject('迷宫刷新');
								}
							}, false);
						}
					}).then(
						() => cga.emogua.encounter(protect),
						e => console.log(e)
					).then(
						() => cga.emogua.leaveTeam()
					);
				}
			}
		} else {
			if (currentMap == '圣骑士营地' && currentTeamNumber == 1) {
				return cga.emogua.autoWalk([joinPoint.x, joinPoint.y]).then(() => cga.emogua.joinTeamBlock(captainPoint[0], captainPoint[1], captain));
			}
		}
		if (currentMap == '矮人城镇' || currentMap == '蜥蜴洞穴上层第1层') {
			prepareOptions.crystalName = '风地的水晶（5：5）';
		} else {
			prepareOptions.crystalName = '水火的水晶（5：5）';
			if (currentMap.indexOf('黑龙沼泽') >= 0) {
				prepareOptions.badge = true;
			}
		}
		if (!isCaptain) {
			cga.emogua.checkStopEncounter(protect, true);
		}
		if (currentTeamNumber == 1 || isCaptain) {
			return cga.emogua.waitAfterBattle().then(
				() => cga.emogua.logBack()
			).then(
				() => cga.emogua.prepare(prepareOptions)
			).then(
				() => cga.emogua.goto(n => n.camp.x)
			).then(() => {
				if ((cga.getItemCount('魔石') >= 1)) {
					return cga.emogua.goto(n => n.camp.sell).then(
						() => cga.emogua.sell(21,23)
					).then(
						() => cga.emogua.autoWalk([30,37,'圣骑士营地'])
					);
				}
			});
		}
		return cga.emogua.delay(5000);
	}).catch(console.log));
});
