/**
 * 需要定居新城
 */
const captain = '弓箭の吉米花';  // 队长名字
const teamNumber = 5;  // 队伍人数
const joinPoint = {x: 64, y: 98}; // 小岛集合点
const protect = { // 遇敌保护条件
	minHp: 400,
	minMp: 50,
	minPetHp: 400,
	minPetMp: 0,
	minTeamNumber: teamNumber
};

require('wrapper').then(cga => {
	console.log('半山');
	if (cga.GetPlayerInfo().name == '白西瓜') {
		cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getIntelligentHeal());
	} else {
		cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getCommonAttack());
	}

	cga.emogua.recursion(
		() => (
			cga.GetMapName() == '小岛' ? Promise.resolve() : cga.emogua.prepare({rechargeFlag: (cga.GetPlayerInfo().name == '医生西瓜' ? 2 : 1), crystalName: '火风的水晶（5：5）', repairFlag: -1})
		).then(() => {
			const currentTeamNumber = cga.emogua.getTeamNumber();
			const isCaptain = cga.GetPlayerInfo().name == captain;
			if (currentTeamNumber == 1) {
				if (isCaptain) {
					if (cga.GetMapName() == '小岛' && cga.GetMapXY().x == 65 && cga.GetMapXY().y == 98) {
						return cga.emogua.walkList([[joinPoint.x, joinPoint.y]]);
					} else if (cga.GetMapName() == '小岛' && cga.GetMapXY().x == 64 && cga.GetMapXY().y == 98) {
						return cga.emogua.waitTeamBlock(teamNumber);
					}
				} else {
					if (cga.GetMapName() == '小岛' && cga.GetMapXY().x == 65 && cga.GetMapXY().y == 98) {
						return cga.emogua.joinTeamBlock(joinPoint.x, joinPoint.y, captain);
					}
				}
				if (cga.GetMapName() != '艾尔莎岛') {
					return cga.emogua.waitAfterBattle().then(cga.emogua.logBack);
				}
				return cga.emogua.falan.toStone('W1').then(
					() => cga.emogua.autoWalkList([
						[22,88,'芙蕾雅'],
						[397,168]
					])
				).then(
					() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
				);
			}
			if (currentTeamNumber >= teamNumber && isCaptain) {
				if (cga.GetMapName() == '小岛') {
					return cga.emogua.autoWalk([65, 46]).then(
						() => cga.emogua.waitUntil(() => cga.getMapObjects().filter(e => e.cell === 3 && e.mapx == 64 && e.mapy == 45))
					).then(() => {
						const entry = cga.getMapObjects().filter(e => e.cell === 3 && e.mapx == 64 && e.mapy == 45);
						if (entry) {
							return cga.emogua.walkList([[entry.mapx, entry.mapy, '通往山顶的路100M']]).then(
								() => cga.emogua.walkRandomMazeUntil(map => map == '半山腰')
							).catch(
								() => cga.emogua.waitAfterBattle().then(cga.emogua.logBack)
							);
						} else {
							return cga.emogua.waitAfterBattle().then(cga.emogua.logBack);
						}
					});
				} else if (cga.GetMapName() == '半山腰') {
					return cga.emogua.autoWalk([64, 63]).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.waitAfterBattle().then(cga.emogua.logBack)
					);
				}
				return cga.emogua.logBack();
			}
			if (isCaptain) {
				cga.emogua.waitAfterBattle().then(cga.emogua.logBack)
			}
			if (!isCaptain) {
				cga.emogua.checkStopEncounter(protect, true);
			}
			return cga.emogua.delay(5000);
		})
	).catch(e => {
		console.log(e);
		console.log('stopped');
	});
});
