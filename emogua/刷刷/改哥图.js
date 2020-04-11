/**
 * 单刷,组队通过teams配置
 */
const teams = [
	['队长名','队员名1','队员名2','队员名3','队员名4'],
	['队长名','队员名1','队员名2','队员名3','队员名4']
];
require('../wrapper').then(cga => {
	console.log('刷改哥图,单刷|组队通过脚本teams配置');
	const {team, captain, isCaptain, teamNumber, player} = cga.emogua.parseTeams(teams);
	let npcPosition;
	cga.emogua.autoBattle(cga.emogua.getBattleSets(cga, {flag: 1}));
	cga.emogua.addDropItemNames(['魔石','的水晶碎片','卡片','设计图？','贪欲的罪书']);
	if (!isCaptain) {
		cga.emogua.waitMessageUntil(chat => {
			if (chat.msg && chat.msg.indexOf('拿实验药') >= 0) {
				const npc = cga.GetMapUnits().find(u => u.unit_name == '无照护士米内鲁帕' && u.type == 1);
				if (npc) cga.emogua.talkNpc(npc.xpos, npc.ypos, cga.emogua.talkNpcSelectorYes);
			}
		}, true);
	}
	cga.emogua.prepare().then(
		() => cga.emogua.recursion(
			() => Promise.resolve().then(() => {
				const map = cga.GetMapName();
				const currentTeamNumber = cga.emogua.getTeamNumber();
				if (map == '阿鲁巴斯研究所') {
					return Promise.resolve().then(() => {
						if (currentTeamNumber > 1) {
							return cga.emogua.leaveTeam();
						}
					}).then(
						() => cga.emogua.autoWalk([12,15])
					).then(
						() => cga.emogua.turnOrientation(6,'*')
					).then(
						() => cga.emogua.autoWalk([9,7])
					).then(
						() => cga.emogua.talkNpc(10, 7, cga.emogua.talkNpcSelectorYes)
					).then(() => {
						if (cga.GetPlayerInfo().gold < 4000) {
							console.log('没有足够的金币');
							return Promise.reject();
						}
						const itemFilter = i => i.name.startsWith('哥布林矿工');
						if (cga.getInventoryItems().filter(itemFilter).length > 5) {
							return require('../component/bank')(cga, {
								itemFilter: itemFilter
							});
						}
					});
				} else if (map == '芙蕾雅' && (currentTeamNumber == 1 || isCaptain)) {
					return cga.emogua.autoWalk([588,51,'*']);
				} else if (map == '亚留特村') {
					if (isCaptain) {
						return cga.emogua.autoWalk([52,47]).then(
							() => cga.emogua.waitTeamBlock(teamNumber, team)
						).then(
							() => cga.emogua.autoWalkList([
								[52,63,'*'],[10,5]
							])
						).then(
							() => cga.emogua.recharge(0)
						).then(
							() => cga.emogua.autoWalkList([
								[2,9,'*'],[58,31,'*']
							])
						).then(
							() => cga.emogua.toRandomEntry(520, 15, 40, 40,[[549,43]])
						).then(
							() => Promise.resolve().then(() => {
								if (!cga.emogua.isMapDownloaded(cga.buildMapCollisionMatrix())) {
									npcPosition = null;
								}
								const gotoNpc = (npc) => {
									const positions = cga.emogua.getMovablePositionsAround({x: npc.xpos, y: npc.ypos});
									return cga.emogua.autoWalk([positions[0].x, positions[0].y],undefined,undefined,{compress: false}).then(
										() => cga.emogua.autoWalkList([
											[positions[1].x, positions[1].y],[positions[0].x, positions[0].y],[positions[1].x, positions[1].y],[positions[0].x, positions[0].y]
										])
									).then(
										() => cga.emogua.sayWords('拿实验药')
									).then(
										() => cga.emogua.talkNpc(npc.xpos, npc.ypos, cga.emogua.talkNpcSelectorYes)
									).then(
										() => cga.emogua.delay(3000)
									).then(
										() => cga.emogua.autoWalk([npc.entries[0].x, npc.entries[0].y, '*'],undefined,undefined,{compress: false})
									);
								};
								if (npcPosition) {
									return cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == npcPosition.mapName, false).then(
										() => gotoNpc(npcPosition)
									);
								}
								return cga.emogua.searchMap(
									units => units.find(u => u.unit_name == '无照护士米内鲁帕' && u.type == 1), true, false
								).then(unit => {
									npcPosition = unit;
									npcPosition.mapName = cga.GetMapName();
									return gotoNpc(npcPosition);
								});
							}).then(() => {
								if (cga.GetMapName() != '阿鲁巴斯实验所') {
									return cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == '阿鲁巴斯实验所', false);
								}
							}).then(
								() => cga.emogua.autoWalk([21,19])
							).then(
								() => cga.emogua.talkNpc(21, 18, cga.emogua.talkNpcSelectorYes)
							).then(
								() => cga.emogua.delay(2000)
							).then(
								() => cga.emogua.waitAfterBattle()
							).then(() => {
								if (cga.GetMapName() != '阿鲁巴斯研究所' && cga.emogua.getTeamNumber() > 1) {
									return cga.emogua.leaveTeam();
								}
							})
						).catch(
							() => console.log('迷宫出错重来')
						);
					} else if (currentTeamNumber == 1) {
						return cga.emogua.autoWalk([52,48]).then(
							() => cga.emogua.joinTeamBlock(52, 47, captain)
						);
					}
				} else if (currentTeamNumber == 1) {
					return cga.emogua.goto(n => n.teleport.aleut);
				}
				return cga.emogua.dropItems().then(
					() => cga.emogua.delay(5000)
				);
			})
		)
	);
});
