/**
 * 百人，最高层数100，使用时一般设置maxFloor=10或者20，30等
 * teamNumber=1，为单刷模式，此时队长可以不用设置
 */
let captain = 'xxx';  // 队长名字
let teamNumber = 5;  // 队伍人数
let maxFloor = 80;
let mode = 'H'; // 目前支持 'H' 'CH'
require('../wrapper').then(cga => {
	const player = cga.GetPlayerInfo();
	if (player.name == 'yyyyy') {
		captain = 'xxx1';
		teamNumber = 1;
		maxFloor = 10;
		mode = 'H';
	}
	console.log('百人', '模式: ' + mode, '队伍人数: ' + teamNumber);
	const sets = [];
	const profession = cga.emogua.getPlayerProfession();
	console.log(profession);
	if (profession) {
		if (profession.name == '暗黑骑士') {
			sets.push({
				user: 1,
				check: context => context.playerUnit.hpRatio <= 0.4,
				type: '技能',
				skillName: '吸血攻击',
				skillLevel: 6,
				targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos)
			});
			sets.push({
				user: 1,
				check: context => context.round_count == 0 && context.enemies.find(e => e.maxhp > 10000),
				type: '技能',
				skillName: '诸刃·碎玉',
				targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
			});
		}
		if (profession.name == '传教士') {
			sets.push({
				user: 1,
				check: context => {
					const needHealUnits = context.teammates.filter(u => u.curhp > 0 && u.hpRatio <= 0.3);
					return needHealUnits.length >= 2;
				},
				type: '技能',
				skillName: '生命祈福',
				targets: context => [context.player_pos]
			});
			sets.push({
				user: 1,
				check: context =>  {
					const needReviveUnits = context.teammates.filter(u => u.curhp == 0);
					return needReviveUnits.length > 0;
				},
				type: '技能',skillName: '气绝回复',
				targets: context => context.teammates.filter(u => u.curhp == 0).map(u => u.pos)
			});
			sets.push({
				user: 1,
				check: function(context) {
					const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && u.flags & cga.emogua.DebuffFlags.ANY).map(u => u.pos);
					if (needCleanPositions.length >= 2) {
						const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions);
						if (t.count >= 3) {
							subSkillInfo = context.getAvaliableSubSkillInfo(this);
							return subSkillInfo && subSkillInfo.level == 6;
						}
					}
					return false;
				},
				type: '技能',
				skillName: '洁净魔法', skillLevel: 6,
				targets: context => {
					const needCleanPositions = context.teammates.filter(u => u.flags & cga.emogua.DebuffFlags.ANY).map(u => u.pos);
					const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions);
					return [t.position];
				}
			});
			const needHealChecker = (unit) => {
				return unit.curhp > 0 && unit.hpRatio <= 0.65;
			};
			sets.push({
				user: 1,
				check: function(context) {
					const needHealUnits = context.teammates.filter(needHealChecker);
					if (needHealUnits.length >= 3) {
						const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(needHealUnits.map(u => u.pos));
						return t.count > 1;
					}
					return false;
				}, type: '技能', skillName: '强力补血魔法', skillLevel: 10,
				targets: context => {
					const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(
						context.teammates.filter(needHealChecker).map(u => u.pos)
					);
					return [t.position];
				}
			});
			sets.push({
				user: 1,
				check: function(context) {
					const needHealUnits = context.teammates.filter(needHealChecker);
					return needHealUnits.length >= 3;
				}, type: '技能', skillName: '超强补血魔法', skillLevel: 10,
				targets: context => [context.player_pos]
			});
			sets.push({
				user: 1,
				check: function(context) {
					const needHealUnits = context.teammates.filter(needHealChecker);
					return needHealUnits.length > 0;
				}, type: '技能', skillName: '补血魔法', skillLevel: 10,
				targets: context => context.teammates.sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
			});
		}
	}
	sets.push({
		user: 1,
		check: context => context.enemies.length >= 3,
		type: '技能', skillName: '气功弹', skillLevel: 5,
		targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
	});
	sets.push({
		user: 5,
		check: context => true,
		type: '攻击',
		targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
	});

	sets.push({
		user: 2,
		check: context => context.petUnit.hpRatio <= 0.4,
		skillName: '明镜止水',
		targets: context => [context.petUnit.pos]
	});
	sets.push({
		user: 2,
		check: context => context.enemies.length >= 7,
		skillName: '飓风吐息',
		targets: context => context.enemies.map(u => u.pos)
	});
	sets.push({
		user: 2,
		check: context => context.enemies.length >= 3,
		skillName: '气功弹',
		targets: context => cga.emogua.AutoBattlePreset.getSortedMinHpEnemies(context)
	});
	sets.push({
		user: 2,
		check: context => true,
		skillName: '攻击',
		targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
	});
	cga.emogua.autoBattle(sets, 4000, 4000, false);
	const isCaptain = player.name == captain;
	const getCurrentFloor = (map) => {
		if (map.indexOf('道场') > 0) {
			if (map.startsWith('第十')) return 20;
			else if (map.startsWith('第二十')) return 30;
			else if (map.startsWith('第三十')) return 40;
			else if (map.startsWith('第四十')) return 50;
			else if (map.startsWith('第五十')) return 60;
			else if (map.startsWith('第六十')) return 70;
			else if (map.startsWith('第七十')) return 80;
			else if (map.startsWith('第八十')) return 90;
			else if (map.startsWith('第九十')) return 100;
			else return 10;
		}
		return 200;
	};
	const openCard = () => {
		let flow = Promise.resolve();
		cga.getInventoryItems().filter(i => i.name == '宝石鼠闪卡' || i.name == '火焰鼠闪卡').forEach(i => {
			flow = flow.then(() => {
				cga.emogua.useItem(i.pos);
				cga.emogua.useItem(i.pos);
				cga.emogua.useItem(i.pos);
				cga.emogua.useItem(i.pos);
				cga.emogua.useItem(i.pos);
				cga.emogua.useItem(i.pos);
				cga.emogua.useItem(i.pos);
				return cga.emogua.delay(500);
			});
		});
		return flow;
	};
	const exchangeShuiJing = (list) => cga.emogua.autoWalk([28,29]).then(
		() => cga.emogua.talkNpc(6, cga.emogua.talkNpcSelectorYes)
	).then(() => {
		var flow = Promise.resolve();
		list.forEach(l => {
			flow = flow.then(() => {
				cga.emogua.sayWords(l);
				return cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes);
			});
		});
		return flow;
	});
	cga.emogua.addDropItemNames(['火焰鼠闪卡「C1奖」','火焰鼠闪卡「C2奖」','火焰鼠闪卡「C3奖」','火焰鼠闪卡「C4奖」','宝石鼠残念奖']);
	const exchangeH = (times) => {
		if (times > 0) {
			return cga.emogua.autoWalk([23,24]).then(
				() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
			).then(() => {
				cga.emogua.sayWords('H');
				return cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes);
			}).then(openCard).then(() => exchangeH(times-1));
		}
		return Promise.resolve();
	};
	const exchangeCH = () => {
		const elements = ['地','水','风'];
		const getNeedSJ = () => elements.filter(e => !cga.getInventoryItems().find(i => (e + '元素水晶') == i.name));
		const exchangeC = () => cga.emogua.autoWalk([23,24]).then(
			() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
		).then(() => {
			cga.emogua.sayWords('C');
			return cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes);
		});
		const needSJ = getNeedSJ();
		if (needSJ.length == 0) {
			return exchangeC();
		}
		return exchangeShuiJing(needSJ).then(() => {
			const sj = getNeedSJ();
			if (sj.length == 0) {
				return exchangeC();
			}
			if (!sj.find(e => e == '地')) {
				const hcount = cga.getItemCount('地元素碎片') - 4;
				if (hcount > 0) {
					cga.getInventoryItems().filter(i => i.name == '地元素碎片').forEach((item,index) => {
						cga.MoveItem(item.pos, 8 + index, -1);
					});
					return cga.emogua.delay(1000).then(
						() => exchangeH(hcount)
					).then(() => {
						if (!sj.find(e => e == '水')) {
							const hcount = cga.getItemCount('水元素碎片') - 4;
							if (hcount > 0) {
								cga.getInventoryItems().filter(i => i.name == '水元素碎片').forEach((item,index) => {
									cga.MoveItem(item.pos, 8 + index, -1);
								});
								return cga.emogua.delay(1000).then(
									() => exchangeH(hcount)
								)
							}
						}
					});
				}
			}
		});
	};
	const battle = (map = cga.GetMapName()) => {
		if ((isCaptain && map.indexOf('一') > 0) || teamNumber == 1) {
			return Promise.resolve().then(() => {
				if (teamNumber > 1)
					return cga.emogua.autoWalk([5,11]).then(
						() => cga.emogua.waitTeamBlock(teamNumber)
					);
			}).then(() => cga.emogua.recursion(() => {
				const oldMap = cga.GetMapName();
				return cga.emogua.autoWalk([15,10]).then(() => {
					if (cga.GetMapUnits().find(u => u.type == 1 && u.xpos == 16 && u.ypos == 10))
						return cga.emogua.talkNpc(16,10,cga.emogua.talkNpcSelectorYes);
					else
						return cga.emogua.talkNpc(16,11,cga.emogua.talkNpcSelectorYes);
				}).then(
					() => cga.emogua.delay(3000)
				).then(
					() => cga.emogua.waitAfterBattle()
				).then(() => {
					const currentMap = cga.GetMapName();
					if (oldMap == currentMap) {
						console.log('没有打过boss,请检查配置!');
						return Promise.reject(process.exit());
					}
					if (currentMap.indexOf('组通过') > 0) {
						return cga.emogua.autoWalk([20,12]).then(
							() => cga.emogua.talkNpc(21,12,cga.emogua.talkNpcSelectorYes)
						).then(
							() => Promise.reject()
						);
					}
				});
			}));
		}
		if (map.indexOf('一') > 0) return cga.emogua.joinTeamBlock(5,11,captain).then(() => cga.emogua.recursion(() => {
			if (cga.isInNormalState()) {
				const currentMap = cga.GetMapName();
				if (currentMap.indexOf('组通过') > 0) {
					return cga.emogua.waitUntil(() => cga.emogua.getTeamNumber() == 1).then(
						() => cga.emogua.autoWalk([20,12])
					).then(
						() => cga.emogua.talkNpc(21,12,cga.emogua.talkNpcSelectorYes)
					).then(
						() => Promise.reject()
					);
				} else if (cga.emogua.getTeamNumber() == 1) {
					return Promise.reject();
				}
			}
			return cga.emogua.delay(3000);
		}));
		return cga.emogua.logBack();
	};
	cga.emogua.recursion(
		() => cga.emogua.prepare({repairFlag: -1}).then(() => {
			const ticket = cga.getInventoryItems().find(i => i.name == '道场记忆');
			if (ticket) {
				return cga.emogua.useItem(ticket.pos).then(
					() => cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes,'*')
				);
			}
		}).then(() => {
			const map = cga.GetMapName();
			if (map.indexOf('道场') > 0) {
				if (getCurrentFloor(map) <= maxFloor) {
					return battle(map);
				}
				return cga.emogua.logBack();
			}
			return Promise.resolve().then(() => {
				if (cga.getInventoryItems().length > 19) {
					console.log('背包满了');
					process.exit();
					return Promise.reject();
				}
			}).then(
				() => cga.emogua.goto(n => n.falan.s1)
			).then(
				() => cga.emogua.autoWalk([124, 161])
			).then(
				() => cga.emogua.talkNpc(4, cga.emogua.talkNpcSelectorYes, '竞技场的入口')
			).then(
				() => cga.emogua.autoWalkList([
					[27,14,'治愈的广场'],[25,28]
				])
			).then(
				() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes,'百人道场大厅')
			).then(() => {
				if (mode == 'CH') {
					return exchangeCH();
				}
				const chipNumber = cga.getInventoryItems().reduce((c, i) => {
					if (i.name.indexOf('元素碎片') > 0) {
						return c + i.count;
					}
					return c;
				}, 0);
				console.log(chipNumber);
				if (chipNumber > 0) {
					return exchangeH(chipNumber);
				}
			}).then(
				() => cga.emogua.autoWalk([15, 23])
			).then(
				() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes)
			).then(
				() => battle()
			);
		})
	);
});
