const captain = '';  // 队长名字
const teamNumber = 5;  // 队伍人数

require('../wrapper').then(cga => {
	console.log('战斗一转');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	const isCaptain = cga.GetPlayerInfo().name == captain;

	cga.emogua.logBack().then(
		() => cga.emogua.prepare()
	).then(
		() => cga.emogua.falan.toWeiNuoYa()
	).then(
		() => cga.emogua.autoWalkList([
			[5, 1, '村长家的小房间'],
			[0, 5, '村长的家'],
			[10, 16, '维诺亚村'],
			[61, 53, '医院'],
			[6,5]
		])
	).then(
		() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
	).then(
		() => cga.emogua.autoWalkList([
			[2,9,'维诺亚村'],
			[67,46,'芙蕾雅']
		])
	).then(
		() => {
			if (isCaptain) {
				return cga.emogua.forceMove(0).then(() => cga.emogua.waitTeamBlock(teamNumber)).then(
					() => cga.emogua.autoWalk([380,353,'布满青苔的洞窟1楼'])
				).then(
					() => cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == '叹息之森林')
				).then(
					() => cga.emogua.autoWalk([29,14])
				).then(
					() => cga.emogua.turnOrientation(6)
				).then(cga.emogua.waitAfterBattle).then(cga.emogua.leaveTeam);
			}
			return cga.emogua.joinTeamBlock(cga.GetMapXY().x + 1, cga.GetMapXY().y, captain);
		}
	).then(
		() => cga.emogua.waitUntil(() => cga.emogua.getTeamNumber() == 1)
	).then(
		() => {
			let result = Promise.resolve();
			cga.getInventoryItems().filter(i => ['艾里克的大剑','磨刀石'].indexOf(i.name) >= 0).forEach(i => {
				result = result.then(() => cga.emogua.dropItems([i.pos]));
			});
			return result.then(
				() => cga.emogua.autoWalk([26,13])
			).then(
				() => cga.emogua.talkNpc(6, cga.emogua.talkNpcSelectorYes).then(cga.emogua.logBack)
			);
		}
	).then(cga.emogua.falan.toKatie).then(
		() => cga.emogua.assessRepairFromNpc(0, item => item.name == '树苗？')
	).then(cga.emogua.falan.toWeiNuoYa).then(
		() => cga.emogua.autoWalkList([
			[5, 1, '村长家的小房间'],
			[0, 5, '村长的家'],
			[15,7]
		])
	).then(
		() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
	).then(
		() => console.log('任务完成')
	);
});
