module.exports = function(cga, jobName) {
	console.log('就职', jobName);
	const battles = ['剑士','骑士','战斧斗士','弓箭手','魔术师','魔法师','驯兽师','饲养师'];
	return cga.emogua.prepare().then(() => {
		const currentProfession = cga.emogua.getPlayerProfession();
		if (battles.indexOf(jobName) >= 0) {
			if (!currentProfession) {
				console.log('请不要忘记佩戴对应的武器');
			}
			return Promise.resolve().then(() => {
				if (cga.getItemCount('试炼洞穴通行证') > 0) {
					return true;
				}
				return Promise.resolve().then(() => {
					if (cga.getItemCount('止痛药（特价品）') == 0) {
						return cga.emogua.goto(n => n.falan.ehospital).then(
							() => cga.emogua.autoWalk([15,35])
						).then(
							() => cga.emogua.buy(16,35,[{index: 1, count: 1}])
						).then(
							() => cga.emogua.autoWalkList([
								[12,42,'*'],[73,60,'*'],[8,6]
							])
						).then(
							() => cga.emogua.talkNpc(10,6,cga.emogua.talkNpcSelectorYes)
						);
					}
				});
			}).then(
				() => cga.emogua.goto(n => n.falan.wout)
			).then(
				() => cga.emogua.autoWalkList([
					[351,145,'*'],[9,15]
				])
			).then(
				() => cga.emogua.talkNpc(9,14,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.autoWalkList([
					[9,5,'*'],[33,31,'*'],[22,42,'*'],[42,34,'*'],[27,12,'*'],[39,36,'*'],[23,12]
				])
			).then(
				() => cga.emogua.turnOrientation(0)
			).then(() => {
				console.log('新就职需要手动对话推荐信');
				return cga.emogua.sayWords(jobName);
			});
		} else if (jobName == '传教士' && !currentProfession) {
			return cga.emogua.goto(n => n.castle.x).then(
				() => cga.emogua.autoWalkList([
					[41,14,'法兰城'],[154,29,'大圣堂的入口'],[14,7,'礼拜堂'],[23,0,'大圣堂里面'],[16,10]
				])
			).then(() => {
				if (!cga.getInventoryItems().find(i => i.name == '僧侣适性检查合格证')) {
					return cga.emogua.talkNpc(16,11,cga.emogua.talkNpcSelectorYes);
				}
			}).then(
				() => cga.emogua.talkNpc(17,9, dialog => {
					if (dialog.dialog_id == 322) {
						cga.ClickNPCDialog(-1, 0);
						return true;
					} else if (dialog.dialog_id == 346) {
						cga.ClickNPCDialog(32, -1);
						return true;
					} else if (dialog.dialog_id == 324) {
						cga.ClickNPCDialog(-1, 0);
						return true;
					} else if (dialog.type == 0 && dialog.options == 1) {
						cga.ClickNPCDialog(1, -1);
						return true;
					}
				})
			).then(() => {
				if (!cga.GetSkillsInfo().find(s => s.name == '补血魔法')) {
					return cga.emogua.autoWalk([13,6]).then(
						() => cga.emogua.talkNpc(14,6,cga.emogua.talkNpcSelectorYes,'*')
					).then(
						() => cga.emogua.autoWalk([14,11])
					).then(
						() => cga.emogua.learnPlayerSkill(14,10)
					);
				}
			}).then(() => {
				if (!cga.GetSkillsInfo().find(s => s.name == '调教')) {
					return cga.emogua.goto(n => n.falan.e1).then(
						() => cga.emogua.autoWalkList([
							[219,136,'*'],[27,20,'*'],[10,6,'*'],[11,6]
						])
					).then(
						() => cga.emogua.learnPlayerSkill(11,5)
					);
				}
			}).then(() => {
				if (!cga.GetSkillsInfo().find(s => s.name == '宠物强化')) {
					return cga.emogua.goto(n => n.falan.w1).then(
						() => cga.emogua.autoWalkList([
							[122,36,'*'],[14,5]
						])
					).then(
						() => cga.emogua.learnPlayerSkill(14,4)
					);
				}
			}).then(() => {
				if (!cga.GetSkillsInfo().find(s => s.name == '气功弹')) {
					return cga.emogua.goto(n => n.falan.s1).then(
						() => cga.emogua.autoWalk([124, 161])
					).then(
						() => cga.emogua.turnOrientation(4, '竞技场的入口')
					).then(
						() => cga.emogua.autoWalkList([
							[15,6,'*'],[15,57]
						])
					).then(
						() => cga.emogua.learnPlayerSkill(15,56)
					);
				}
			});
		}
	});
};
