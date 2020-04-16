/**
 * 鲁村刷钱
 */
const protect = { // 遇敌保护条件
	minHp: 300,
	minMp: 30,
	minPetHp: 300,
	minPetMp: 30,
	maxItemNumber: 17
};
require('../wrapper').then(cga => {
	console.log('鲁村刷钱-建议火风水晶');
	const sets = [];
	sets.push({
		user: 1,
		check: context => context.enemies.length >= 3,
		type: '技能', skillName: '气功弹', skillLevel: 5,
		targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
	});
	sets.push({
		user: 5,
		check: context => true,
		type: '攻击',
		targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
	});
	sets.push({
		user: 2,
		check: context => context.enemies.length >= 6,
		skillName: '飓风吐息',
		targets: context => context.enemies.map(u => u.pos)
	});
	sets.push({
		user: 2,
		check: context => context.enemies.length >= 3,
		skillName: '气功弹',
		targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
	});
	sets.push({
		user: 2,
		check: context => true,
		skillName: '攻击',
		targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
	});
	cga.emogua.autoBattle(sets);

	cga.emogua.recursion(
		() => Promise.resolve().then(() => {
			const info = cga.emogua.getMapInfo();
			if (info.name == '库鲁克斯岛' && (info.x >= 290 && info.x <= 320) && (info.y >= 870 && info.y <= 890)) {
				return cga.emogua.autoWalk([321,883]).then(
					() => cga.emogua.delay(3000)
				).then(
					() => cga.emogua.autoWalk([322,883,'鲁米那斯'])
				);
			} else if (info.name == '艾尔莎岛') {
				return cga.emogua.prepare({badge: true, crystalName: '火风的水晶（5：5）'});
			}
		}).then(() => {
			const playerInfo = cga.GetPlayerInfo();
			if (playerInfo.gold >= 990000) {
				console.log('钱包满了');
				return Promise.reject();
			}
			if (playerInfo.souls > 0) {
				return cga.emogua.logBack().then(
					() => cga.emogua.prepare({badge: true, crystalName: '火风的水晶（5：5）'})
				);
			}
			if (playerInfo.hp < playerInfo.maxhp || playerInfo.mp < playerInfo.maxmp) {
				return cga.emogua.goto(n => n.lumi.nurse).then(
					() => cga.emogua.recharge(0)
				);
			}
		}).then(() => {
			if (cga.getInventoryItems().length > protect.maxItemNumber) {
				return cga.emogua.goto(n => n.lumi.sell).then(
					() => cga.emogua.sell(0)
				);
			}
		}).then(
			() => cga.emogua.goto(n => n.lumi.door).then(
				() => cga.emogua.autoWalk([305,883])
			).then(
				() => cga.emogua.encounter(protect)
			)
		)
	);
});
