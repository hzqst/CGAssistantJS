require('./common').then(cga => {
	let boys = true; //true-男队，false-女队

	const teamNumber = 1; //单人脚本
	const captain = cga.GetPlayerInfo().name;
	const isCaptain = true;
	let team = [];
	console.log('UD', boys ? '男队' : '女队', '需要手动交换蜡烛，交换玩以后游戏聊天输入gogo就会继续');
	cga.emogua.keepAlive();
	cga.emogua.autoBattle(cga.emogua.getBattleSets(cga, {
		flag: 2,
		rechargeMinHp: 600,
		rechargeMinMp: 600
	}));
	cga.emogua.logBack().then(
		() => cga.emogua.prepare({repairFlag: -1})
	).then(
		() => cga.emogua.goto(n => n.teleport.jenova)
	).then(() => {
		if (isCaptain) {
			return cga.emogua.autoWalk([56,43]).then(
				() => cga.emogua.waitTeamBlock(teamNumber, team)
			).then(
				() => cga.emogua.autoWalkList([
					[32,27,'莎莲娜'],[259,360],[260,360],[259,360],[260,360],[259,360]
				])
			).then(
				() => cga.emogua.sayWords('对话神官')
			).then(
				() => cga.emogua.talkNpc(260,359,cga.emogua.talkNpcSelectorYes,'*')
			).then(
				() => cga.emogua.walkList([[8,34]])
			).then(
				() => cga.emogua.waitTeamBlock(teamNumber, team)
			).then(
				() => cga.emogua.autoWalkList([
					[27,11,'*'],[34,12,'*'],[16,9,'*'],[34,9,'*'],[24,8,'*'],[18,28,'*'],[22,10,'*'],[101,72,'*'],[20,22,'*'],
					[25,23],[25,24],[25,23],[25,24],[25,23]
				])
			).then(
				() => cga.emogua.sayWords('对话祭祀')
			).then(
				() => cga.emogua.talkNpc(26,23,cga.emogua.talkNpcSelectorYes,'*')
			).then(
				() => cga.emogua.autoWalk([39,12])
			).then(
				() => cga.emogua.talkNpc(40,12,cga.emogua.talkNpcSelectorYes,'*')
			);
		}
		return cga.emogua.autoWalk([57,43]).then(
			() => cga.emogua.joinTeamBlock(56,43,captain)
		).then(
			() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('对话神官') > -1, true)
		).then(
			() => cga.emogua.talkNpc(260,359,cga.emogua.talkNpcSelectorYes,'*')
		).then(
			() => cga.emogua.joinTeamBlock(8,34,captain)
		).then(
			() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('对话祭祀') > -1, true)
		).then(
			() => cga.emogua.talkNpc(26,23,cga.emogua.talkNpcSelectorYes,'*')
		).then(
			() => cga.emogua.autoWalk([39,12])
		).then(
			() => cga.emogua.talkNpc(40,12,cga.emogua.talkNpcSelectorYes,'*')
		);
	}).then(() => {
		// 男蜡烛 18496 女蜡烛 18492
		if (boys) {
			if (isCaptain) {
				return cga.emogua.autoWalk([10,24]).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[24,24,[24,19]],[29,29],[30,30],[29,29],[30,30],[29,29]
					])
				).then(
					() => cga.emogua.sayWords('拿蜡烛')
				).then(
					() => cga.emogua.talkNpc(29,30,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.delay(30000)
				).then(
					() => cga.emogua.autoWalkList([
						[24,19,[24,24]],[74,47],[69,47]
					])
				).then(
					() => cga.emogua.sayWords('第一次交换蜡烛')
				).then(
					() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('gogo') > -1, true)
				).then(
					() => cga.emogua.autoWalkList([
						[101,57],[102,58],[101,57],[102,58],[101,57]
					])
				).then(
					() => cga.emogua.sayWords('第一次对话圣坛')
				).then(
					() => cga.emogua.talkNpc(101,58,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.autoWalk([9,85])
				).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[7,54,[7,49]],[15,53,[22,53]],[26,53,[31,50]],[60,3,[59,10]],[101,16,[101,22]],
						[79,50],[84,50]
					])
				).then(
					() => cga.emogua.sayWords('第二次交换蜡烛')
				).then(
					() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('gogo') > -1, true)
				).then(
					() => cga.emogua.autoWalkList([
						[106,44,[115,43]],[128,43,[135,42]],
						[142,13],[143,12],[142,13],[143,12],[142,13]
					])
				).then(
					() => cga.emogua.sayWords('第二次对话圣坛')
				).then(
					() => cga.emogua.talkNpc(142,12,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.autoWalk([15,16])
				).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[23,15,[32,15]],[36,23,[36,31]],[37,46,[37,53]],[37,68,[37,75]],[47,80,[56,80]],[60,75,[60,68]],[56,60,[47,60]],[47,59,[56,59]]
					])
				).then(
					() => cga.emogua.sayWords('第三次交换蜡烛')
				).then(
					() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('gogo') > -1, true)
				).then(
					() => cga.emogua.autoWalkList([
						[71,59,[78,59]],
						[82,62],[83,63],[82,62],[83,63],[82,62]
					])
				).then(
					() => cga.emogua.sayWords('第三次对话圣坛')
				).then(
					() => cga.emogua.talkNpc(82,63,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.autoWalk([26,75])
				).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[93,48],[94,49],[93,48],[94,49],[93,48]
					])
				).then(
					() => cga.emogua.sayWords('对话进入UD')
				).then(
					() => cga.emogua.talkNpc(93,49,cga.emogua.talkNpcSelectorYes)
				);
			}
			return cga.emogua.joinTeamBlock(10,24,captain).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('拿蜡烛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(29,30,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('第一次对话圣坛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(101,58,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.joinTeamBlock(9,85,captain)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('第二次对话圣坛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(142,12,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.joinTeamBlock(15,16,captain)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('第三次对话圣坛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(82,63,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.joinTeamBlock(26,75,captain)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('对话进入UD') > -1, true)
			).then(
				() => cga.emogua.talkNpc(93,49,cga.emogua.talkNpcSelectorYes)
			);
		} else {
			if (isCaptain) {
				return cga.emogua.autoWalk([11,75]).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[24,76,[24,71]],[29,80],[30,81],[29,80],[30,81],[29,80]
					])
				).then(
					() => cga.emogua.sayWords('拿蜡烛')
				).then(
					() => cga.emogua.talkNpc(29,81,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.delay(30000)
				).then(
					() => cga.emogua.autoWalkList([
						[24,71,[24,76]],[74,49],[69,49]
					])
				).then(
					() => cga.emogua.sayWords('第一次交换蜡烛')
				).then(
					() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('gogo') > -1, true)
				).then(
					() => cga.emogua.autoWalkList([
						[81,80,[73,82]],[97,34,[103,34]],
						[111,33],[112,34],[111,33],[112,34],[111,33]
					])
				).then(
					() => cga.emogua.sayWords('第一次对话圣坛')
				).then(
					() => cga.emogua.talkNpc(111,34,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.autoWalk([9,17])
				).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[14,29,[19,27]],[31,70,[31,65]],[74,82,[75,76]],[62,64,[68,63]],
						[79,52],[84,52]
					])
				).then(
					() => cga.emogua.sayWords('第二次交换蜡烛')
				).then(
					() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('gogo') > -1, true)
				).then(
					() => cga.emogua.autoWalkList([
						[68,63,[62,64]],[94,71,[95,65]],[67,34,[61,36]],[58,47,[58,51]],
						[135,77],[136,78],[135,77],[136,78],[135,77]
					])
				).then(
					() => cga.emogua.sayWords('第二次对话圣坛')
				).then(
					() => cga.emogua.talkNpc(135,78,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.autoWalk([16,82])
				).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[54,57],[53,57],[54,57],[53,57],[54,57]
					])
				).then(
					() => cga.emogua.sayWords('第三次交换蜡烛')
				).then(
					() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('gogo') > -1, true)
				).then(
					() => cga.emogua.autoWalkList([
						[76,30,[78,25]],
						[82,42],[83,43],[82,42],[83,43],[82,42]
					])
				).then(
					() => cga.emogua.sayWords('第三次对话圣坛')
				).then(
					() => cga.emogua.talkNpc(82,43,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.autoWalk([26,22])
				).then(
					() => cga.emogua.waitTeamBlock(teamNumber, team)
				).then(
					() => cga.emogua.autoWalkList([
						[93,48],[94,49],[93,48],[94,49],[93,48]
					])
				).then(
					() => cga.emogua.sayWords('对话进入UD')
				).then(
					() => cga.emogua.talkNpc(93,49,cga.emogua.talkNpcSelectorYes)
				);
			}
			return cga.emogua.joinTeamBlock(11,75,captain).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('拿蜡烛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(29,81,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('第一次对话圣坛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(111,34,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.joinTeamBlock(9,17,captain)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('第二次对话圣坛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(135,78,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.joinTeamBlock(16,82,captain)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('第三次对话圣坛') > -1, true)
			).then(
				() => cga.emogua.talkNpc(82,43,cga.emogua.talkNpcSelectorYes)
			).then(
				() => cga.emogua.joinTeamBlock(26,22,captain)
			).then(
				() => cga.emogua.waitMessageUntil(chat => chat.msg && chat.msg.indexOf('对话进入UD') > -1, true)
			).then(
				() => cga.emogua.talkNpc(93,49,cga.emogua.talkNpcSelectorYes)
			);
		}
	});
});
