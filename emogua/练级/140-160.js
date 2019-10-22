/**
 * 需要定居新城
 */
const captain = '弓箭の吉米花';  // 队长名字
const teamNumber = 5;  // 队伍人数
const joinPoint = {x: 64, y: 98}; // 小岛集合点
const isClock = false; // 是否打卡, 如果打卡必须艾尔莎岛启动
const protect = { // 遇敌保护条件
	minHp: 400,
	minMp: 50,
	minPetHp: 400,
	minPetMp: 0,
	minTeamNumber: teamNumber
};

require('../wrapper').then(cga => {
	console.log('半山');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	const isCaptain = cga.GetPlayerInfo().name == captain;
	cga.emogua.recursion(
		() => cga.emogua.prepare({crystalName: '火风的水晶（5：5）'}).then(() => {
			const currentTeamNumber = cga.emogua.getTeamNumber();
			let mapInfo = cga.getMapInfo();
			if (currentTeamNumber == 1) {
				if (mapInfo.name == '小岛') {
					if (isCaptain) {
						if (mapInfo.x != joinPoint.x || mapInfo.y != joinPoint.y) {
							return cga.emogua.autoWalk([joinPoint.x, joinPoint.y]).then(
								() => cga.emogua.waitTeamBlock(teamNumber)
							);
						}
						return cga.emogua.waitTeamBlock(teamNumber);
					} else {
						if (mapInfo.x == 65 && mapInfo.y == 98) {
							return cga.emogua.joinTeamBlock(joinPoint.x, joinPoint.y, captain);
						}
					}
				}
				if (isClock && mapInfo.name == '艾尔莎岛') {
					return cga.emogua.goto(n => n.castle.clock).then(
						() => cga.emogua.talkNpc(58,84,cga.emogua.talkNpcSelectorYes)
					).then(
						() => cga.emogua.goto(n => n.falan.isle)
					);
				}
				if (['法兰城','里谢里雅堡','艾尔莎岛'].indexOf(mapInfo.name) < 0) {
					return cga.emogua.waitAfterBattle().then(() => cga.emogua.logBack());
				}
				return cga.emogua.goto(n => n.falan.isle);
			}
			if (currentTeamNumber >= teamNumber && isCaptain) {
				if (mapInfo.name == '小岛') {
					return cga.emogua.autoWalk([65, 46]).then(
						() => cga.emogua.waitUntil(() => cga.getMapObjects().filter(e => e.cell === 3 && e.mapx == 64 && e.mapy == 45))
					).then(() => {
						const entry = cga.getMapObjects().filter(e => e.cell === 3 && e.mapx == 64 && e.mapy == 45);
						if (entry) {
							return cga.emogua.walkList([[entry.mapx, entry.mapy, '通往山顶的路100M']]).then(
								() => cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == '半山腰')
							).catch(
								() => cga.emogua.waitAfterBattle().then(() => cga.emogua.logBack())
							);
						} else {
							return cga.emogua.waitAfterBattle().then(() => cga.emogua.logBack());
						}
					});
				} else if (mapInfo.name == '半山腰') {
					return cga.emogua.autoWalk([64, 63]).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.waitAfterBattle().then(() => cga.emogua.logBack())
					);
				}
				return cga.emogua.logBack();
			}
			if (isCaptain) {
				cga.emogua.waitAfterBattle().then(() => cga.emogua.logBack());
			}
			if (!isCaptain) {
				cga.emogua.checkStopEncounter(protect, true);
			}
			return cga.emogua.delay(3000);
		})
	);
});
