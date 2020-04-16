/**
 * 需要定居新城
 */
const teams = [
	['西瓜保姆','西瓜6号机','西瓜7号机','西瓜8号机','西瓜9号机']
];
const isClock = false; // 是否打卡, 如果打卡必须艾尔莎岛启动
const protect = { // 遇敌保护条件
	minHp: 400,
	minMp: 50,
	minPetHp: 400,
	minPetMp: 0
};

require('../wrapper').then(cga => {
	console.log('半山');
	const {team, captain, isCaptain, teamNumber} = cga.emogua.parseTeams(teams);
	protect.minTeamNumber = teamNumber;

	const joinPoint = {x: 64, y: 98};
	cga.emogua.autoBattle(cga.emogua.getBattleSets(cga, {
		flag: 1, rechargePet: true, rechargeMinMp: 500
	}));
	cga.emogua.recursion(
		() => cga.emogua.prepare({crystalName: '水火的水晶（5：5）', badge: true, repairFlag: 0}).then(() => {
			const currentTeamNumber = cga.emogua.getTeamNumber();
			let mapInfo = cga.emogua.getMapInfo();
			if (currentTeamNumber == 1) {
				if (mapInfo.name == '小岛') {
					if (isCaptain) {
						if (mapInfo.x != joinPoint.x || mapInfo.y != joinPoint.y) {
							return cga.emogua.autoWalk([joinPoint.x, joinPoint.y]).then(
								() => cga.emogua.waitTeamBlock(teamNumber, team)
							);
						}
						return cga.emogua.waitTeamBlock(teamNumber, team);
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
						() => cga.emogua.waitUntil(() => cga.getMapObjects().find(e => e.cell === 3 && e.mapx == 64 && e.mapy == 45))
					).then(
						entry => cga.emogua.autoWalk([entry.mapx, entry.mapy, '通往山顶的路100M'])
					).then(
						() => cga.emogua.walkRandomMazeUntil(() => cga.GetMapName().indexOf('通往山顶的路') < 0)
					);
				} else if (mapInfo.name == '半山腰') {
					return cga.emogua.autoWalk([64, 63]).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.waitAfterBattle()
					).then(
						() => cga.emogua.logBack()
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
			return cga.emogua.delay(5000);
		}).catch(r => console.log('出错重试', r))
	);
});
