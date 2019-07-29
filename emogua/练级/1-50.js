/**
 * 需要定居新城
 */
const captain = '';  // 队长名字
const teamNumber = 5;  // 队伍人数
const joinPoint = {x: 137, y: 97}; // 新城集合点
let protect = { // 遇敌保护条件
	minHp: 100,
	minMp: 10,
	minPetHp: 100,
	minPetMp: 0,
	minTeamNumber: teamNumber
};

require('../wrapper').then(cga => {
	console.log('1-50');
	const captainPoint = [joinPoint.x, joinPoint.y-1];
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());

	cga.emogua.recursion(
		() => cga.emogua.prepare().then(() => {
			const currentTeamNumber = cga.emogua.getTeamNumber();
			const isCaptain = cga.GetPlayerInfo().name == captain;
			if (currentTeamNumber === 1 && cga.GetMapName() != '艾尔莎岛') {
				return cga.emogua.logBack();
			}
			if (currentTeamNumber === 1 && !isCaptain) {
				return cga.emogua.autoWalk([joinPoint.x, joinPoint.y]).then(
					() => cga.emogua.joinTeamBlock(captainPoint[0], captainPoint[1], captain)
				);
			}
			if (currentTeamNumber < teamNumber && isCaptain) {
				return cga.emogua.autoWalk([captainPoint[0], captainPoint[1]]).then(
					() => cga.emogua.waitTeamBlock(teamNumber)
				);
			}
			if (currentTeamNumber >= teamNumber && isCaptain) {
				const level = cga.emogua.getTeamLevel();
				const [startX, startY] = cga.emogua.newisland.stones.X;
				return cga.emogua.autoWalk([startX, startY]).then(() => {
					if (level < 15) {
						return cga.emogua.autoWalkList([
							[130, 50, '盖雷布伦森林'],
							[177, 177]
						]);
					} else if (level >= 15 && level < 33) {
						return cga.emogua.newisland.toStone('D').then(
							() => cga.emogua.autoWalkList([
								[190, 115, '盖雷布伦森林'],
								[231, 222, '布拉基姆高地'],
								[39, 184]
							])
						);
					} else if (level >= 33 && level < 45) {
						protect = {
							minHp: 150,
							minMp: 10,
							minPetHp: 150,
							minPetMp: 0,
							minTeamNumber: teamNumber
						};
						return cga.emogua.newisland.toStone('D').then(
							() => cga.emogua.autoWalkList([
								[190, 115, '盖雷布伦森林'],
								[231, 222, '布拉基姆高地'],
								[130, 190]
							])
						);
					} else if (level >= 45) {
						protect = {
							minHp: 150,
							minMp: 10,
							minPetHp: 150,
							minPetMp: 0,
							minTeamNumber: teamNumber
						};
						return cga.emogua.newisland.toStone('D').then(
							() => cga.emogua.autoWalkList([
								[190, 115, '盖雷布伦森林'],
								[231, 222, '布拉基姆高地'],
								[147, 116]
							])
						);
					}
				}).then(
					() => cga.emogua.encounter(protect)
				).then(
					() => cga.emogua.logBack()
				);
			}
			if (!isCaptain) {
				cga.emogua.checkStopEncounter(protect, true);
			}
			return cga.emogua.delay(5000);
		})
	);
});
