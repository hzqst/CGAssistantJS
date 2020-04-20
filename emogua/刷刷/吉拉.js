/**
 * 如果要获取魅力，一定要人打死，合击也不行
 * 吉拉 23
 *   战斗 1-52(70) 53(20) 54-107(10) 无
 *   生产 1-52(60) 53(10) 无
 * 巴雷利 26
 *   生产 1-55(60) 56-58(50)
 * 伊鲁玛 29
 *   生产 1-61(60) 62-64(50)
 * 伊佐塔 32
 *   生产 1-67(60) 68-70(50)
 * 伍娜 35
 *   生产 1-71(60) 72-76(50)
 */
let npc = '吉拉';
require('../wrapper').then(cga => {
	const player = cga.GetPlayerInfo();
	if (player.level > 54 && player.level < 59) {
		npc = '巴雷利';
	} else if (player.level > 58 && player.level < 65) {
		npc = '伊鲁玛';
	}
	console.log(npc, new Date().toLocaleString());
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.recursion(
		() => cga.emogua.logBack().then(
			() => cga.emogua.prepare({repairFlag: 0})
		).then(
			() => cga.emogua.goto(n => n.falan.s1)
		).then(
			() => cga.emogua.autoWalk([124, 161])
		).then(
			() => cga.emogua.turnOrientation(4, '竞技场的入口')
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
		).then(() => {
			let position = [31,23];
			let orientation = 0;
			if (npc == '巴雷利') {
				position = [28,24];
				orientation = 2;
			}
			return cga.emogua.autoWalk(position).then(
				() => cga.emogua.recursion(
					() => cga.emogua.talkNpc(orientation,cga.emogua.talkNpcSelectorYes).then(
						() => cga.emogua.waitAfterBattle()
					).then(() => {
						const f = cga.getInventoryItems().find(i => i.name == '斗士之证' && i.info != '$4你的斗士之证');
						const pet = cga.GetPetsInfo().find(e => e.battle_flags === 2);
						if (f && cga.GetPlayerInfo().hp > 200 && (!pet || pet.hp > 200)) {
							return cga.emogua.dropItems([f.pos]);
						}
						return Promise.reject();
					})
				)
			);
		})
	);
});
