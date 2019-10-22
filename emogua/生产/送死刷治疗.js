const doctorName = 'ｍｉｌｋ'; // 指定医生名字
require('../wrapper').then(cga => {
	console.log('送死刷治疗');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());

	cga.emogua.recursion(() => cga.emogua.prepare({
		rechargeFlag: -1,
		repairFlag: -1,
		doctorName: doctorName
	}).then(() => {
		return cga.emogua.goto(n => n.castle.x).then(
			() => cga.emogua.autoWalk([30, 81])
		).then(
			() => cga.emogua.talkNpc(6, cga.emogua.talkNpcSelectorYes, '追忆之路')
		).then(
			() => cga.emogua.walkList([[15, 111]])
		).then(
			() => cga.emogua.talkNpc(6, cga.emogua.talkNpcSelectorYes).then(
				() => cga.emogua.delay(3000)
			).then(cga.emogua.waitAfterBattle)
		).then(() => cga.emogua.logBack());
	}));
});
