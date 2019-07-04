/**
 * 需要定居新城
 */
const captain = '弓箭の吉米花';  // 队长名字
const teamNumber = 5;  // 队伍人数
const isClock = false; // 是否打卡, 如果打卡必须艾尔莎岛启动
const joinPoint = {x: 64, y: 98}; // 小岛集合点
const protect = { // 遇敌保护条件
	minHp: 400,
	minMp: 50,
	minPetHp: 400,
	minPetMp: 0,
	minTeamNumber: teamNumber
};

require('./wrapper').then(cga => {
	console.log('半山');

	cga.emogua.recursion(
		() => cga.emogua.prepare({crystalName: '火风的水晶（5：5）', repairFlag: -1}).then(() => {
			const currentTeamNumber = cga.emogua.getTeamNumber();
			const isCaptain = cga.GetPlayerInfo().name == captain;
			let mapName = cga.GetMapName();
			if (currentTeamNumber == 1) {
				let mapXy = cga.GetMapXY();
				if (isCaptain) {
					if (mapName == '小岛' && mapXy.x == 65 && mapXy.y == 98) {
						return cga.emogua.walkList([[joinPoint.x, joinPoint.y]]);
					} else if (mapName == '小岛' && mapXy.x == 64 && mapXy.y == 98) {
						return cga.emogua.waitTeamBlock(teamNumber);
					}
				} else {
					if (mapName == '小岛' && mapXy.x == 65 && mapXy.y == 98) {
						return cga.emogua.joinTeamBlock(joinPoint.x, joinPoint.y, captain);
					}
				}
				if (isClock && mapName == '艾尔莎岛') {
					return cga.emogua.falan.toCastleClock().then(
						() => cga.emogua.autoWalk([41,91])
					);
				}
				if (['法兰城','里谢里雅堡','艾尔莎岛'].indexOf(mapName) < 0) {
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
				if (mapName == '小岛') {
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
				} else if (mapName == '半山腰') {
					return cga.emogua.autoWalk([64, 63]).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.waitAfterBattle().then(cga.emogua.logBack)
					);
				}
				return cga.emogua.logBack();
			}
			if (isCaptain) {
				cga.emogua.waitAfterBattle().then(cga.emogua.logBack);
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
