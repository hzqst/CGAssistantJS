
require('../wrapper').then(cga => {
	console.log('法兰-艾尔莎');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getEscapeSets());
	cga.emogua.logBack().then(
		() => cga.emogua.prepare()
	).then(
		() => cga.emogua.goto(n => n.castle.x)
	).then(
		() => cga.emogua.autoWalk([28,88])
	).then(
		() => cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes, '*')
	).then(
		() => cga.emogua.autoWalkList([
			[19, 21, '法兰城遗迹'],[96, 138, '盖雷布伦森林'],[124, 168, '温迪尔平原'],[264, 108, '艾尔莎岛'],[141,105]
		])
	).then(
		() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
	);
});
