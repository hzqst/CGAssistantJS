/**
 * 需要定居新城
 */
const captain = 'xxx';  // 队长名字
const teamNumber = 5;  // 队伍人数
let protect = { // 遇敌保护条件
	minHp: 200,
	minMp: 10,
	minPetHp: 200,
	minPetMp: 10,
	maxItemNumber: 19,
	minTeamNumber: teamNumber
};

require('../wrapper').then(cga => {
	console.log('塔-80');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());

	const isCaptain = cga.GetPlayerInfo().name == captain;
	cga.emogua.recursion(
		() => Promise.resolve().then(() => {
			if (cga.emogua.getTeamNumber() == 1) {
				return cga.emogua.logBack().then(
					() => cga.emogua.prepare()
				).then(
					() => cga.emogua.goto(n => n.elsa.x)
				).then(
					() => cga.emogua.autoWalk([165,153])
				).then(
					() => cga.emogua.talkNpc(2,cga.emogua.talkNpcSelectorYes,'*')
				).then(() => {
					if (isCaptain) {
						return cga.emogua.autoWalk([93,63]).then(
							() => cga.emogua.waitTeamBlock(teamNumber)
						);
					}
				});
			}
		}).then(() => {
			if (isCaptain || teamNumber == 1) {
				return cga.emogua.autoWalkList([
					[90,99,'*'],[108,39,'*'],[75,50,'*'],[22,44,'*']
				]).then(
					() => cga.emogua.encounter(protect)
				).then(cga.emogua.leaveTeam);
			}
		}).then(() => {
			if (!isCaptain) {
				cga.emogua.checkStopEncounter(protect, true);
			}
			return cga.emogua.delay(5000);
		})
	);
});
