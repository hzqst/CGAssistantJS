/**
 * 矮人徽章
 */
require('../wrapper').then(cga => {
	console.log('矮人徽章');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getEscapeSets());
	const old = cga.GetItemsInfo().find(i => i.name == '矮人徽章');
	(old ? cga.emogua.dropItems([old.pos]) : Promise.resolve()).then(
		() => cga.emogua.prepare({repairFlag: -1})
	).then(cga.emogua.falan.toCamp).then(
		() => cga.emogua.autoWalkList([
			[116,55,'酒吧'],
			[14,4]
		])
	).then(
		() => cga.emogua.talkNpc(14,5,cga.emogua.talkNpcSelectorYes)
	).then(
		() => cga.emogua.autoWalkList([
			[0,23,'圣骑士营地'],
			[90,86],
			[36,87,'肯吉罗岛'],
			[384,245,'蜥蜴洞穴'],
			[12,2,'肯吉罗岛'],
			[231,434,'矮人城镇'],
			[97,124]
		])
	).then(
		() => cga.emogua.talkNpc(96,124,cga.emogua.talkNpcSelectorYes)
	).then(
		() => {
			const badge = cga.GetItemsInfo().find(i => i.name == '矮人徽章');
			if (badge && cga.getEquipItems().findIndex(e => e.name == '王者守护神') < 0) {
				cga.emogua.useItem(badge.pos);
			}
		}
	);
});
