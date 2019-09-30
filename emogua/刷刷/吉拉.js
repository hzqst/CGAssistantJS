/**
 * 吉拉
 */
require('../wrapper').then(cga => {
	console.log('吉拉');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.recursion(
		() => cga.emogua.logBack().then(
			() => cga.emogua.prepare({repairFlag: -1})
		).then(
			() => cga.emogua.goto(n => n.falan.s1)
		).then(
			() => cga.emogua.autoWalk([124, 161])
		).then(
			() => cga.emogua.talkNpc(4, cga.emogua.talkNpcSelectorYes, '竞技场的入口')
		).then(
			() => cga.emogua.autoWalkList([
				[27,14,'治愈的广场'],
				[25,13]
			])
		).then(
			() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes,'竞技场')
		).then(
			() => cga.emogua.autoWalkList([
				[22,13,'*'],
				[15,8,'*'],
				[22,8,'*'],
				[15,8,'*'],
				[22,16,'*'],
				[16,12]
			])
		).then(
			() => cga.emogua.dropItems(i => i.name == '斗士之证')
		).then(
			() => cga.emogua.talkNpc(6,cga.emogua.talkNpcSelectorYes)
		).then(
			() => cga.emogua.autoWalk([16,6])
		).then(
			() => cga.emogua.talkNpc(4,cga.emogua.talkNpcSelectorYes)
		).then(
			() => cga.emogua.talkNpc(7,cga.emogua.talkNpcSelectorYes)
		).then(
			() => cga.emogua.autoWalk([31,23])
		).then(() => cga.emogua.recursion(
			() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes).then(cga.emogua.waitAfterBattle).then(() => {
				const f = cga.getInventoryItems().find(i => i.info == '$4吉拉的斗士之证');
				if (f && cga.GetPlayerInfo().hp > 150) {
					return cga.emogua.dropItems([f.pos]);
				}
				return Promise.reject();
			})
		))
	);
});
