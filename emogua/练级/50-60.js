/**
 * 需要定居新城
 */
const captain = '';  // 队长名字
const teamNumber = 5;  // 队伍人数
const joinPoint = {x: 11, y: 20}; // 回廊集合点
let protect = { // 遇敌保护条件
	minHp: 200,
	minMp: 10,
	minPetHp: 200,
	minPetMp: 0,
	minTeamNumber: teamNumber
};

require('../wrapper').then(cga => {
	console.log('回廊');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());

	cga.emogua.recursion(() => {
		const currentTeamNumber = cga.emogua.getTeamNumber();
		const isCaptain = cga.GetPlayerInfo().name == captain;
		if (isCaptain) {
			if (cga.GetMapName() == '过去与现在的回廊') {
				if (currentTeamNumber < teamNumber) {
					return cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getEscapeSets()).then(
						() => cga.emogua.autoWalk([joinPoint.x, joinPoint.y])
					).then(
						() => cga.emogua.waitTeamBlock(teamNumber)
					).then(
						() => cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets())
					);
				}
				return cga.emogua.encounter(protect).then(cga.emogua.logBack);
			}
		}
		if (currentTeamNumber == 1) {
			return cga.emogua.logBack().then(
				() => cga.emogua.prepare()
			).then(
				() => cga.emogua.falan.toStone('C')
			).then(
				() => cga.emogua.autoWalk([52,72])
			).then(
				() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
			).then(() => {
				if (!isCaptain) {
					return cga.emogua.joinTeamBlock(joinPoint.x, joinPoint.y, captain);
				}
			});
		}
		if (!isCaptain) {
			cga.emogua.checkStopEncounter(protect, true);
		}
		return cga.emogua.delay(5000);
	});
});
