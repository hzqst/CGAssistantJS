const teams = [
	['队长', '队员2', '队员3', '队员4', '队员5']
];
const protect = {
	minHp: 300,
	minMp: 30,
	minPetHp: 300,
	minPetMp: 0,
	maxItemNumber: 19
};
const prepareOptions = {
	crystalName: '火风的水晶（5：5）',
	repairFlag: 0
};

require('../wrapper').then(cga => {
	console.log('罪一练级(90怪), 需要开启者称号(UD)');
	const {team, captain, isCaptain, teamNumber} = cga.emogua.parseTeams(teams);
	protect.minTeamNumber = teamNumber;

	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.recursion(() => Promise.resolve().then(() => {
		const currentMap = cga.GetMapName();
		const currentTeamNumber = cga.emogua.getTeamNumber();

		if (cga.getItemCount('灵魂晶石') == 0) {
			return cga.emogua.goto(n => n.castle.x).then(
				() => cga.emogua.autoWalk([34,71])
			).then(
				() => cga.emogua.talkNpc(34,70,cga.emogua.talkNpcSelectorYes)
			);
		}
		if (currentMap == '杰诺瓦镇') {
			if (currentTeamNumber == 1) {
				if (isCaptain) {
					return cga.emogua.autoWalk([56,43]).then(
						() => cga.emogua.waitTeamBlock(teamNumber, team)
					).then(
						() => cga.emogua.autoWalkList([
							[24,40,'莎莲娜'],[150,335],[151,334],[150,335],[151,334],[150,335]
						])
					).then(
						() => cga.emogua.sayWords('对话神官')
					).then(
						() => cga.emogua.talkNpc(150,334,cga.emogua.talkNpcSelectorNo,'*')
					).then(
						() => cga.emogua.autoWalk([32,53])
					).then(
						() => cga.emogua.waitTeamBlock(teamNumber)
					).then(
						() => cga.emogua.encounter(protect)
					).then(
						() => cga.emogua.leaveTeam()
					);
				}
				return cga.emogua.autoWalk([57,43]).then(
					() => cga.emogua.joinTeamBlock(56,43,captain)
				).then(
					() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('对话神官') > -1)
				).then(
					() => cga.emogua.talkNpc(150,334,cga.emogua.talkNpcSelectorYes,'*')
				).then(
					() => cga.emogua.joinTeamBlock(32,53,captain)
				);
			}
		}
		if (currentTeamNumber == 1) {
			return cga.emogua.logBack().then(
				() => cga.emogua.prepare(prepareOptions)
			).then(
				() => cga.emogua.goto(n => n.teleport.jenova)
			);
		}
		if (!isCaptain) {
			cga.emogua.checkStopEncounter(protect, true);
		}
		return cga.emogua.delay(5000);
	}).catch(console.log));
});
