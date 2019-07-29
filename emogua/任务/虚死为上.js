
const captain = '';  // 队长名字
const teamNumber = 2;  // 队伍人数 最多2人
require('../wrapper').then(cga => {
	console.log('学习虚死');
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getAttackSets());

	const isCaptain = cga.GetPlayerInfo().name == captain;

	Promise.resolve().then(() => {
		if (cga.GetMapName() == '艾尔莎岛') return cga.emogua.newisland.toLiXia();
	}).then(() => {
		if (cga.GetMapName() == '利夏岛') {
			return cga.emogua.autoWalk(isCaptain ? [118, 100] : [117, 100]).then(() => {
				if (!isCaptain) {
					return cga.emogua.joinTeamBlock(118, 100, captain);
				}
				if (teamNumber == 2) {
					return cga.emogua.waitTeamBlock(teamNumber).then(() => cga.emogua.talkNpc(118,101,cga.emogua.talkNpcSelectorYes));
				}
				return cga.emogua.talkNpc(118,101,cga.emogua.talkNpcSelectorYes);
			}).then(() => {
				if (isCaptain) {
					return cga.emogua.delay(200000).then(() => cga.emogua.leaveTeam());
				}
				return cga.emogua.waitUntil(() => cga.emogua.getTeamNumber() == 1);
			});
		}
	}).then(() => {
		if (cga.GetMapName() == '丘斯特村') return cga.emogua.autoWalk([130,88]).then(
			() => cga.emogua.talkNpc(131,88,cga.emogua.talkNpcSelectorYes)
		).then(
			() => cga.emogua.autoWalk([26,19])
		).then(
			() => cga.emogua.recursion(() => {
				if (cga.GetMapName() == '修拉特瓦尔号') return Promise.reject();
				return cga.emogua.talkNpc(26,18,cga.emogua.talkNpcSelectorYes).then(
					() => cga.emogua.delay(5000)
				);
			})
		).then(
			() => cga.emogua.delay(180000)
		).then(
			() => cga.emogua.walkTo([18,18])
		).then(
			() => cga.emogua.recursion(() => {
				if (cga.GetMapName() == '辛梅尔') return Promise.reject();
				return cga.emogua.talkNpc(18,19,cga.emogua.talkNpcSelectorYes).then(
					() => cga.emogua.delay(5000)
				);
			})
		);
	}).then(() => {
		if (cga.GetMapName() == '辛梅尔' && cga.GetMapIndex().index3 == 59528) return cga.emogua.autoWalk([18,18]).then(
			() => cga.emogua.talkNpc(18,17,cga.emogua.talkNpcSelectorYes)
		);
	}).then(() => {
		if (cga.GetMapName() == '辛梅尔' && cga.GetMapIndex().index3 == 59526) return cga.emogua.autoWalk([207,91,'光之路']);
	}).then(() => {
		if (cga.GetMapName() == '光之路') {
			if (!isCaptain) {
				return cga.emogua.joinTeamBlock(200,18,captain).then(
					() => cga.emogua.waitUntil(() => cga.emogua.getTeamNumber() == 1)
				).then(
					() => cga.emogua.autoWalk([214,194])
				).then(
					() => cga.emogua.talkNpc(215,194,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.joinTeamBlock(219,194,captain)
				);
			}
			let workFlow = Promise.resolve();
			if (teamNumber == 2) {
				workFlow = workFlow.then(() => cga.emogua.autoWalk([200,18]).then(
					() => cga.emogua.waitTeamBlock(teamNumber)
				));
			}
			workFlow = workFlow.then(
				() => cga.emogua.autoWalk([214,194])
			).then(
				() => cga.emogua.talkNpc(215,194,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.autoWalk([219,194])
			).then(
				() => cga.emogua.waitTeamBlock(teamNumber)
			).then(
				() => cga.emogua.autoWalkList([
					[227,202,'*'],
					[223,79]
				])
			);
			return workFlow;
		}
	});
});
