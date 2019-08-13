/**
 * 一定要将界面的自动战斗关闭!
 */
const babyName = '哥布林';
const cardName = '封印卡（人形系）';
const babyMinHp = 50;
const babyMinMp = 50;
const rechargeMinHp = 500; // 人宠吃血瓶
const rechargeMinMp = 300; // 人宠吃料理


const protect = { // 满足以下条件，停止遇敌
	minHp: 200,
	minMp: 20,
	minPetHp: 200,
	minPetMp: 20,
	maxPetNumber: 4
};
require('../wrapper').then(cga => {
	console.log('抓宠-' + babyName);
	if (!cga.getInventoryItems().find(i => i.name == cardName)) {
		console.log('没有封印卡: ' + cardName);
		return false;
	}
	const getBaby = (context) => context.enemies.find(e => e.name == babyName && e.level == 1 && e.maxhp >= babyMinHp && e.maxmp >= babyMinMp);
	cga.emogua.autoBattle([
		{
			user: 1,
			check: context => (context.playerUnit.curhp <= rechargeMinHp || context.petUnit.curhp <= rechargeMinHp) && cga.getInventoryItems().findIndex(i => i.type == 43) >= 0,
			type: '物品',
			item: context => cga.getInventoryItems().find(i => i.type == 43).pos,
			targets: context => [context.playerUnit, context.petUnit].sort((a,b) => a.curhp - b.curhp).map(u => u.pos)
		},
		{
			user: 1,
			check: context => (context.playerUnit.curmp <= rechargeMinMp || context.petUnit.curmp <= rechargeMinMp) && cga.getInventoryItems().findIndex(i => i.type == 23) >= 0,
			type: '物品',
			item: context => cga.getInventoryItems().find(i => i.type == 23).pos,
			targets: context => [context.playerUnit, context.petUnit].sort((a,b) => a.curmp - b.curmp).map(u => u.pos)
		},
		{
			user: 2,
			check: context => {
				const baby = getBaby(context);
				return baby && baby.curhp == baby.maxhp;
			},
			skillName: '风刃魔法-I',
			targets: context => [getBaby(context).pos]
		},
		{
			user: 1,
			check: context => {
				const baby = getBaby(context);
				if (baby) {
					const card = cga.getInventoryItems().find(i => i.name == cardName);
					if (card) {
						console.log('开始封印1级宝宝');
						return true;
					}
					console.log('没有封印卡了!请手动停止!');
					return false;
				}
			},
			type: '物品',
			item: context => cga.getInventoryItems().find(i => i.name == cardName).pos,
			targets: context => [getBaby(context).pos]
		},
		{
			user: 2,
			check: context => true,
			skillName: '防御',
			targets: context => [context.petUnit.pos]
		},
		{
			user: 5,
			check: context => true,
			type: '逃跑',
			targets: context => [context.player_pos]
		}
	], 4000, 4000, true);

	cga.emogua.encounter(protect);
});
