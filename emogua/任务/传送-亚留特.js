const teams = [
	['队长名','队员名1','队员名2','队员名3','队员名4'],
	['队长名','队员名1','队员名2','队员名3','队员名4']
];
require('../wrapper').then(cga => {
	console.log('亚留特开传送');
	const {team, captain, isCaptain, teamNumber} = cga.emogua.parseTeams(teams);

	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.waitMessageUntil(chat => {
		if (chat.msg && chat.msg.indexOf('开传送') >= 0) {
			const npc = cga.GetMapUnits().find(u => u.unit_name.indexOf('传送石管理') >= 0);
			if (npc) cga.emogua.turnTo(npc.xpos, npc.ypos);
		}
	});
	Promise.resolve().then(() => {
		if (cga.emogua.getTeamNumber() == 1) {
			return cga.emogua.logBack().then(
				() => cga.emogua.prepare()
			).then(
				() => cga.emogua.logBack()
			).then(() => {
				if (isCaptain) {
					return cga.emogua.autoWalk([141,110]).then(
						() => cga.emogua.waitTeamBlock(teamNumber)
					).then(
						() => cga.emogua.goto(n => n.falan.eout)
					).then(
						() => cga.emogua.autoWalkList([
							[672,223,'哈巴鲁东边洞穴 地下1楼'],[41,8,'哈巴鲁东边洞穴 地下2楼'],[17,18]
						])
					).then(
						() => cga.emogua.forceMoveTo([17,16])
					).then(
						() => cga.emogua.autoWalkList([
							[16,11,'哈巴鲁东边洞穴 地下1楼'],[30,4,'芙蕾雅'],[596,84,'亚留特村'],[49,65],[49,47],[56,48,'*'],[22,9,'*'],
							[5,13],[4,14],[5,13],[4,14],[5,13]
						])
					).then(
						() => cga.emogua.sayWords('开传送')
					);
				}
				return cga.emogua.autoWalk([141,109]).then(
					() => cga.emogua.joinTeamBlock(141, 110, captain)
				);
			});
		}
	});
});
