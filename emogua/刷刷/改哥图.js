/**
 * 默认单刷
 * 需要开亚留特传送
 * 每一个列表为一队，每个列表的第一个名字是队长,如果角色找不到队伍视为单刷
 */
const teams = [];
require('../wrapper').then(cga => {
	const player = cga.GetPlayerInfo();
	let team = teams.find(t => t.find(n => n == player.name));
	if (!team) {
		team = [player.name];
	}
	console.log('team', team);
	const captain = team[0];
	const isCaptain = player.name == captain;

	let npcPosition;
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getEscapeSets());
	cga.emogua.prepare().then(
		() => cga.emogua.recursion(
			() => Promise.resolve().then(() => {
				if (cga.GetPlayerInfo().gold < 4000) {
					console.log('没有足够的金币');
					return Promise.reject();
				}
				if (cga.getInventoryItems().length == 20) {
					console.log('背包满了');
					return Promise.reject();
				}
				if (cga.emogua.getTeamNumber() == 1 && cga.GetMapName() != '亚留特村') {
					return cga.emogua.goto(n => n.teleport.aleut);
				}
			}).then(() => {
				if (isCaptain) {
					return cga.emogua.autoWalk([52,47]).then(
						() => cga.emogua.waitTeamBlock(team.length)
					).then(
						() => cga.emogua.autoWalkList([
							[52,63,'*'],[10,5]
						])
					).then(
						() => cga.emogua.recharge(0)
					).then(
						() => cga.emogua.autoWalkList([
							[2,9,'*'],[58,31,'*'],[551,26]
						])
					).then(
						() => cga.emogua.recursion(() => {
							const entry = cga.getMapObjects().find(m => m.cell == 3 && m.x > 529 && m.x < 560 && m.y > 20 && m.y < 43);
							if (entry) {
								const around = cga.emogua.getMovablePositionAround(entry);
								return cga.emogua.autoWalk([around.x, around.y], undefined, 0, false).then(
									() => cga.emogua.delay(5000)
								).then(
									() => cga.emogua.autoWalk([entry.x, entry.y, '*'])
								);
							}
							console.log('等待迷宫入口');
							return cga.emogua.delay(10000);
						})
					).then(() => {
						if (cga.GetMapName() == '芙蕾雅') {
							return Promise.reject();
						}
						if (!cga.emogua.isMapDownloaded()) {
							npcPosition = null;
						}
						if (npcPosition) {
							return cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == npcPosition.mapName).then(() => {
								const up = cga.emogua.getFarthestEntry(npcPosition.start);
								const walkTo = cga.emogua.getMovablePositionAround({x: npcPosition.xpos, y: npcPosition.ypos})
								return cga.emogua.autoWalk([walkTo.x, walkTo.y],undefined,0,false).then(
									() => cga.emogua.talkNpc(npcPosition.xpos, npcPosition.ypos, cga.emogua.talkNpcSelectorYes)
								).then(
									() => cga.emogua.autoWalk([up.x, up.y, '*'],undefined,0,false)
								);
							});
						}
						return cga.emogua.searchMap(
							units => units.find(u => u.unit_name == '无照护士米内鲁帕' && u.type == 1)
						).then(unit => {
							if (typeof unit == 'object') {
								npcPosition = unit;
								npcPosition.mapName = cga.GetMapName();
								const up = cga.emogua.getFarthestEntry(npcPosition.start);
								return cga.emogua.talkNpc(npcPosition.xpos, npcPosition.ypos, cga.emogua.talkNpcSelectorYes).then(
									() => cga.emogua.autoWalk([up.x, up.y, '*'],undefined,0,false)
								);
							}
						});
					}).then(() => {
						if (cga.GetMapName() != '阿鲁巴斯实验所') {
							return cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == '阿鲁巴斯实验所');
						}
					}).then(
						() => cga.emogua.autoWalk([21,19])
					).then(
						() => cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets())
					).then(
						() => cga.emogua.talkNpc(21, 18, cga.emogua.talkNpcSelectorYes)
					).then(
						() => cga.emogua.delay(2000)
					).then(
						() => cga.emogua.waitAfterBattle()
					).then(() => {
						cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getEscapeSets());
						if (cga.GetMapName() == '阿鲁巴斯研究所') {
							return cga.emogua.autoWalk([12,15]).then(
								() => cga.emogua.turnOrientation(6,'*')
							).then(
								() => cga.emogua.autoWalk([9,7])
							).then(
								() => cga.emogua.talkNpc(10, 7, cga.emogua.talkNpcSelectorYes)
							);
						}
					}).then(
						() => cga.emogua.autoWalk([588,51,'*'])
					);
				}
				if (cga.emogua.getTeamNumber() == 1) return cga.emogua.autoWalk([52,48]).then(
					() => cga.emogua.joinTeamBlock(52, 47, captain)
				);
				return cga.emogua.delay(5000);
			}).catch(r => {
				console.log('随即迷宫可能刷新,回亚留特重新开始');
				if (cga.GetMapName() == '芙蕾雅') {
					return cga.emogua.autoWalk([588,51,'*']);
				}
			})
		)
	);
});
