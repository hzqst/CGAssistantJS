/**
 * 卵1-3
 */
const captain = '';  // 队长名字
const teamNumber = 5;  // 队伍人数
require('../wrapper').then(cga => {
	console.log('卵1-3');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());

	cga.emogua.waitMessageUntil(chat => {
		if (chat.msg && chat.msg.indexOf('对话玄武') >= 0) {
			cga.emogua.talkNpc(229, 66, cga.emogua.talkNpcSelectorYes);
		}
		if (chat.msg && chat.msg.indexOf('对话荷特普') >= 0) {
			cga.emogua.talkNpc(131, 100, cga.emogua.talkNpcSelectorYes);
		}
	});
	const isCaptain = cga.GetPlayerInfo().name == captain;
	cga.emogua.prepare().then(() => {
		if (cga.getItemCount('逆十字') > 0) {
			return cga.emogua.dropItems(i => i.name == '逆十字');
		}
	}).then(() => {
		// 卵1
		return cga.emogua.newisland.toPUB().then(
			() => cga.emogua.autoWalk([31, 21])
		).then(
			() => cga.emogua.turnTo(30, 20)
		).then(
			() => cga.emogua.waitNPCDialog(() => {})
		).then(
			() => cga.emogua.sayWords('安登')
		).then(
			() => cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes)
		).then(() => {
			if (cga.getItemCount('琥珀之卵') == 0) {
				return cga.emogua.newisland.toStone('X').then(
					() => cga.emogua.autoWalkList([
						[201, 96, '神殿　伽蓝'],
						[95, 104, '神殿　前廊'],
						[44, 41, '神殿　里侧大厅'],
						[34, 34, '*'],
						[48, 60, '约尔克神庙'],
						[39, 22]
					])
				).then(() => cga.emogua.recursion(
					() => cga.emogua.talkNpc(39,20,cga.emogua.talkNpcSelectorYes).then(() => {
						if (cga.getItemCount('琥珀之卵') == 0) {
							return cga.emogua.delay(30000);
						}
						return Promise.reject();
					})
				));
			}
		}).then(
			() => cga.emogua.newisland.toStone('D')
		).then(
			() => cga.emogua.autoWalkList([
				[133, 77, '查尔博士的家'],
				[10, 12]
			])
		).then(
			() => cga.emogua.waitUntil(() => cga.findNPC('查尔博士'))
		).then(
			() => cga.emogua.talkNpc(11,12,cga.emogua.talkNpcSelectorYes)
		).then(
			() => cga.emogua.newisland.toStone('X').then(() => cga.emogua.autoWalkList([
				[130, 50, '盖雷布伦森林'],
				[246, 76, '路路耶博士的家'],
				[7, 8]
			]))
		).then(
			() => cga.emogua.talkNpc(8,8,cga.emogua.talkNpcSelectorYes)
		).then(
			() => cga.emogua.delay(2000)
		).then(cga.emogua.waitAfterBattle).then(
			() => cga.emogua.autoWalk([3, 10, '*'])
		).then(() => {
			if (cga.getItemCount('路路耶的字典') == 0) {
				console.log('路路耶的字典拿不到');
				return Promise.reject();
			}
			return cga.emogua.dropItems(i => i.name == '路路耶的字典');
		}).then(cga.emogua.logBack);
	}).then(() => {
		// 卵3
		return cga.emogua.prepare().then(
			() => cga.emogua.newisland.toPUB().then(
				() => cga.emogua.autoWalk([31, 21])
			).then(
				() => cga.emogua.turnTo(30, 20)
			).then(
				() => cga.emogua.waitNPCDialog(() => {})
			).then(
				() => cga.emogua.sayWords('贝尔达')
			).then(
				() => cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes)
			)
		).then(
			() => cga.emogua.newisland.toStone('X').then(
				() => cga.emogua.autoWalk([165, 153])
			).then(
				() => cga.emogua.talkNpc(165,154,cga.emogua.talkNpcSelectorNo)
			).then(
				() => cga.emogua.autoWalk([169, 120])
			).then(
				() => cga.emogua.talkNpc(170,120,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.delay(2000)
			).then(cga.emogua.waitAfterBattle)
		).then(
			() => cga.emogua.newisland.toStone('X').then(() => cga.emogua.autoWalkList([
				[130, 50, '盖雷布伦森林'],
				[244, 73]
			])).then(
				() => cga.emogua.talkNpc(245,73,cga.emogua.talkNpcSelectorYes)
			)
		).then(
			() => cga.emogua.newisland.toStone('X').then(() => cga.emogua.autoWalkList([
				[201, 96, '神殿　伽蓝'],
				[91, 138]
			])).then(
				() => cga.emogua.waitUntil(() => cga.findNPC('荷特普'))
			).then(
				() => cga.emogua.talkNpc(92, 138, cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.newisland.toPUB()
			).then(
				() => cga.emogua.autoWalk([56, 32])
			).then(
				() => cga.emogua.talkNpc(56,31,cga.emogua.talkNpcSelectorYes)
			)
		).then(
			() => cga.emogua.newisland.toStone('X').then(
				() => cga.emogua.prepare().then(() => cga.emogua.newisland.toStone('X'))
			).then(() => {
				if (isCaptain) return cga.emogua.autoWalk([138,95]).then(
					() => cga.emogua.waitTeamBlock(teamNumber)
				).then(
					() => cga.emogua.autoWalk([165, 153]).then(
						() => cga.emogua.talkNpc(165,154,cga.emogua.talkNpcSelectorNo)
					).then(
						() => cga.emogua.autoWalkList([
							[256, 166, '布拉基姆高地'],
							[200, 270]
						])
					).then(() => {
						if (cga.GetMapName() == '布拉基姆高地') {
							const entry = cga.emogua.getNearEntry(cga.GetMapXY());
							return cga.emogua.autoWalk([entry.x, entry.y, '*']);
						}
					}).then(
						() => cga.emogua.searchMap(
							units => units.find(u => u.unit_name == '纳塞' && u.type == 1)
						).then(r=> {
							if (typeof r == 'object') {
								return cga.emogua.talkNpc(r.xpos,r.ypos,cga.emogua.talkNpcSelectorYes).then(
									() => cga.emogua.autoWalk([195, 33])
								).then(
									() => cga.emogua.talkNpc(195,32,cga.emogua.talkNpcSelectorYes)
								).then(
									() => cga.emogua.delay(2000)
								).then(
									() => cga.emogua.waitAfterBattle()
								).then(
									() => cga.emogua.autoWalkList([
										[229, 67],
										[230, 67],
										[229, 67],
										[230, 67],
										[229, 67]
									])
								).then(
									() => cga.emogua.sayWords('对话玄武')
								).then(
									() => cga.emogua.delay(10000)
								).then(
									() => cga.emogua.autoWalkList([
										[231, 58],
										[231, 57],
										[231, 58],
										[231, 57],
										[231, 58]
									])
								).then(
									() => cga.emogua.delay(15000)
								).then(
									() => cga.emogua.autoWalkList([
										[230, 57, '布拉基姆高地'],
										[200, 270]
									])
								).then(() => {
									if (cga.GetMapName() == '布拉基姆高地') {
										const entry = cga.emogua.getNearEntry(cga.GetMapXY());
										return cga.emogua.autoWalk([entry.x, entry.y, '*']);
									}
								}).then(
									() => cga.emogua.walkRandomMazeUntil(
										() => cga.GetMapName() == '？？？'
									)
								).then(
									() => cga.emogua.autoWalk([50, 114])
								).then(() => cga.emogua.recursion(
									() => cga.emogua.talkNpc(50,113,cga.emogua.talkNpcSelectorYes).then(
										() => cga.emogua.delay(2000)
									).then(() => {
										if (!cga.isInNormalState()) {
											return cga.emogua.waitAfterBattle().then(() => Promise.reject());
										}
										return cga.emogua.delay(30000)
									})
								)).then(
									() => cga.emogua.autoWalkList([
										[131, 101],
										[132, 101],
										[131, 101],
										[132, 101],
										[131, 101]
									])
								).then(
									() => cga.emogua.sayWords('对话荷特普')
								);
							}
							console.log('未找到纳塞');
							return Promise.reject();
						})
					)
				);
				return cga.emogua.autoWalk([138,96]).then(
					() => cga.emogua.joinTeamBlock(138, 95, captain)
				);
			})
		);
	});
});
