/**
 * 百人，最高层数100，使用时一般设置maxFloor=10或者20，30等
 * 请尽可能清空背包，以免重复去银行
 */
const teams = [
	['队长名','队员1','队员2','队员3','队员4']
];
let maxFloor = 10;
let mode = 'CH'; // 目前支持 'H' 'CH'
require('../wrapper').then(cga => {
	const {team, captain, isCaptain, teamNumber} = cga.emogua.parseTeams(teams);
	console.log('百人', '模式: ' + mode, '队伍: ' + team);
	// cga.emogua.autoBattle(cga.emogua.getBattleSets(cga, {flag: 1}), 4000, 4000, true);
	cga.emogua.autoBattle(cga.emogua.getBattleSets(cga, {flag: 1}));
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
	cga.emogua.addDropItemNames([
		'火焰鼠闪卡「C1奖」','火焰鼠闪卡「C2奖」','火焰鼠闪卡「C3奖」','火焰鼠闪卡「C4奖」','宝石鼠残念奖','迷之手册',
		'火焰鼠闪卡「D1奖」','火焰鼠闪卡「D2奖」','火焰鼠闪卡「D3奖」','火焰鼠闪卡「D4奖」','宝石鼠铜奖','宝石鼠银奖'
	]);
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
		const elements = ['地','水','风','火'];
		const getNeedSJ = () => elements.filter(e => !cga.getInventoryItems().find(i => (e + '元素水晶') == i.name));
		const exchangeC = () => cga.emogua.autoWalk([23,24]).then(
			() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
		).then(() => {
			cga.emogua.sayWords('C');
			return cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes);
		});
		const needSJ = getNeedSJ();
		if (needSJ.length <= 1) {
			return exchangeC();
		}
		return exchangeShuiJing(needSJ).then(() => {
			const sj = getNeedSJ();
			if (sj.length <= 1) {
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
				if (teamNumber > 1) {
					return cga.emogua.autoWalk([5,11]).then(
						() => cga.emogua.waitTeamBlock(teamNumber, team, (timer) => Date.now() - timer > 180000)
					);
				}
			}).then(() => cga.emogua.recursion(() => {
				if (teamNumber > 1 && cga.emogua.getTeamNumber() < teamNumber) {
					return cga.emogua.logBack().then(() => Promise.reject());
				}
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
		if (map.indexOf('一') > 0) {
			const timer = Date.now();
			return cga.emogua.joinTeamBlock(5,11,captain,() => Date.now() - timer > 180000).then(() => cga.emogua.recursion(() => {
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
		}
		return cga.emogua.logBack();
	};
	cga.emogua.recursion(
		() => Promise.resolve().then(() => {
			const currentInfo = cga.GetPlayerInfo();
			const minHpRate = teamNumber == 1 ? 0.4 : 0.9;
			if (currentInfo.hp / currentInfo.maxhp < minHpRate) return cga.emogua.prepare({repairFlag: 0});
		}).then(() => {
			const ticket = cga.getInventoryItems().find(i => i.name == '道场记忆');
			if (ticket) {
				if (teamNumber == 1) {
					return cga.emogua.dropItems([ticket.pos]);
				}
				return cga.emogua.useItem(ticket.pos).then(
					() => cga.emogua.talkNpc(cga.emogua.talkNpcSelectorYes,'*')
				);
			}
		}).then(() => {
			const map = cga.GetMapName();
			if (map != '百人道场大厅' && map.indexOf('道场') > 0) {
				if (getCurrentFloor(map) <= maxFloor) {
					return battle(map);
				}
				return cga.emogua.logBack();
			}
			return Promise.resolve().then(() => {
				const itemFilter = (i) => i.name.indexOf('碎片') < 0 && i.name.indexOf('元素水晶') < 0 && i.name.indexOf('承认') < 0 && i.name.indexOf('十周年') < 0 && i.name.indexOf('欧兹尼克') < 0 && i.name != '道场记忆' && i.name.indexOf('推荐信') < 0;
				console.log(cga.getInventoryItems().filter(itemFilter));
				if (cga.getInventoryItems().filter(itemFilter).length > 0) {
					return require('../component/bank')(cga, {
						role: 2, itemFilter: itemFilter
					});
				}
			}).then(
				() => cga.emogua.goto(n => n.falan.s1)
			).then(
				() => cga.emogua.autoWalk([124, 161])
			).then(
				() => cga.emogua.turnOrientation(4, '竞技场的入口')
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
		}).catch(console.log)
	);
});
