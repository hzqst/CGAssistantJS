
const captain = 'xxx';  // 队长名字
const teamNumber = 5;  // 队伍人数
const joinPoint = {x: 141, y: 109}; // 新城集合点
require('../wrapper').then(cga => {
	console.log('加纳开传送');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());
	cga.emogua.waitMessageUntil(chat => {
		if (chat.msg && chat.msg.indexOf('开传送') >= 0) {
			const npc = cga.GetMapUnits().find(u => u.unit_name.indexOf('传送石管理') >= 0);
			if (npc) cga.emogua.turnTo(npc.xpos, npc.ypos);
		}
	}, true);
	cga.emogua.recursion(
		() => cga.emogua.prepare().then(() => {
			const isCaptain = cga.GetPlayerInfo().name == captain;
			if (cga.emogua.getTeamNumber() == 1 && teamNumber > 1) {
				if (cga.GetMapName() == '芙蕾雅' && cga.GetMapXY().x == 473 && [316,317].indexOf(cga.GetMapXY().y) >= 0) {
					return cga.emogua.talkNpc(472, 316, cga.emogua.talkNpcSelectorYes);
				} else if (cga.GetMapName() == '维诺亚洞穴 地下1楼') {
					if (isCaptain) {
						return cga.emogua.walkList([[20,15]]).then(() => cga.emogua.waitTeamBlock(teamNumber));
					}
					return cga.emogua.joinTeamBlock(20, 15, captain);
				} else if (cga.GetMapName() == '艾尔莎岛') {
					if (isCaptain) {
						return cga.emogua.autoWalk([joinPoint.x+1,joinPoint.y]).then(() => cga.emogua.waitTeamBlock(teamNumber));
					}
					return cga.emogua.autoWalk([joinPoint.x,joinPoint.y]).then(() => cga.emogua.joinTeamBlock(joinPoint.x+1, joinPoint.y, captain));
				}
				return cga.emogua.logBack();
			}
			if (isCaptain && cga.emogua.getTeamNumber() < teamNumber) {
				if (['维诺亚洞穴 地下1楼', '艾尔莎岛'].indexOf(cga.GetMapName()) < 0) {
					return cga.emogua.logBack();
				}
			}
			if (cga.emogua.getTeamNumber() >= teamNumber && isCaptain) {
				if (cga.GetMapName() == '艾尔莎岛') {
					return cga.emogua.goto(n => n.falan.sout).then(
						() => cga.emogua.autoWalkList([
							[473,316],[473,317],[473,316],[473,317],[473,316]
						])
					).then(
						() => cga.emogua.leaveTeam()
					).then(
						() => cga.emogua.talkNpc(472, 316, cga.emogua.talkNpcSelectorYes, '维诺亚洞穴 地下1楼')
					);
				} else if (cga.GetMapName() == '维诺亚洞穴 地下1楼') {
					return cga.emogua.autoWalkList([
						[20,59,'维诺亚洞穴 地下2楼'],
						[24,81,'维诺亚洞穴 地下3楼'],
						[26,64,'芙蕾雅'],
						[330,480,'维诺亚村'],
						[40,36,'村长的家'],
						[18,10,'村长家的小房间'],
						[8,2,'维诺亚村的传送点'],
						[5,3]
					]).then(
						() => cga.emogua.walkList([
							[4,4],[5,3],[4,4],[5,3]
						])
					).then(
						() => cga.emogua.delay(3000)
					).then(
						() => cga.emogua.sayWords('开传送')
					).then(
						() => cga.emogua.delay(15000)
					).then(
						() => cga.emogua.autoWalkList([
							[5, 1, '村长家的小房间'],
							[0, 5, '村长的家'],
							[10, 16, '维诺亚村'],
							[67, 46, '芙蕾雅'],
							[343, 497, '索奇亚海底洞窟 地下1楼'],
							[18, 34, '索奇亚海底洞窟 地下2楼'],
							[27, 29, '索奇亚海底洞窟 地下1楼'],
							[7,37]
						])
					).then(
						() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes, '索奇亚')
					).then(
						() => cga.emogua.autoWalkList([
							[274, 294, '奇利村'],
							[64, 56, '医院'],
							[11, 6]
						])
					).then(
						() => cga.emogua.recharge(6)
					).then(
						() => cga.emogua.autoWalkList([
							[3, 9, '奇利村'],
							[50, 63, '*'],
							[10, 15, '*'],
							[5, 3, '奇利村的传送点'],
							[13, 9]
						])
					).then(
						() => cga.emogua.walkList([
							[12,8],[13, 9],[12,8],[13, 9]
						])
					).then(
						() => cga.emogua.delay(3000)
					).then(
						() => cga.emogua.sayWords('开传送')
					).then(
						() => cga.emogua.delay(15000)
					).then(
						() => cga.emogua.autoWalkList([
							[7, 6, '*'],
							[7, 1, '*'],
							[1, 8, '奇利村'],
							[79, 76, '索奇亚'],
							[356, 334, '角笛大风穴'],
							[133, 26, '索奇亚'],
							[528,328],[527,328],[528,328],[527,328],[528,328]
						])
					).then(
						() => cga.emogua.sayWords('学乱射')
					).then(
						() => cga.emogua.delay(20000)
					).then(
						() => cga.emogua.autoWalkList([
							[704, 147, '加纳村'],
							[36, 40, '村长的家'],
							[17, 6, '加纳村的传送点'],
							[15, 8]
						])
					).then(
						() => cga.emogua.walkList([
							[14,7],[15, 8],[14,7],[15, 8]
						])
					).then(
						() => cga.emogua.delay(3000)
					).then(
						() => cga.emogua.sayWords('开传送')
					).then(
						() => cga.emogua.delay(15000)
					).then(() => cga.emogua.logBack());
				}
				return cga.emogua.logBack();
			}

			return cga.emogua.delay(5000);
		})
	);
});
