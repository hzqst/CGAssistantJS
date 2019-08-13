/**
 * 注意需要在背包里至少留一个空格
 */
require('../wrapper').then(cga => {
	console.log('PK刷修理技能');
	const captain = '紫西瓜';

	const isCaptain = cga.GetPlayerInfo().name == captain;
	cga.emogua.autoBattle([
		{
			user: 5,
			check: context => context.round_count > 2,
			type: '逃跑',
			targets: context => [context.player_pos]
		},
		{
			user: 7,
			check: context => true,
			type: '攻击',
			targets: context => context.enemies.map(e => e.pos)
		}
	]);
	cga.emogua.setEquipmentMinDurability(0);
	cga.emogua.recursion(() => {
		const info = cga.emogua.getMapInfo();
		if (info.name != '市场三楼 - 修理专区') {
			return cga.emogua.goto(n => n.falan.mbank);
		}
		const target = isCaptain ? [82,8] : [81,8];
		if (info.x != target[0] || info.y != target[1]) {
			return cga.emogua.autoWalk(target);
		}
		return Promise.resolve().then(() => {
			const needRepairChecker = (eq) => {
				if (eq.type >= 0 && eq.type <= 14 && eq.level <= 10) {
					const durability = cga.emogua.getDurability(eq);
					return durability && durability.current < durability.max;
				}
				return false;
			};
			if (cga.getInventoryItems().length >= 20) {
				console.log('需要在背包里至少留一个空格,准备好后重新运行脚本');
				return Promise.reject();
			}
			if (cga.GetItemsInfo().findIndex(needRepairChecker) >= 0) {
				return Promise.resolve().then(() => {
					if (!isCaptain) {
						return cga.emogua.walkList([[82,8]]);
					}
				}).then(() => cga.emogua.recursion(() => {
					let item = cga.getInventoryItems().find(needRepairChecker);
					if (item) {
						let words;
						if (item.type >= 0 && item.type <= 6) words = '修理武器';
						else if (item.type >= 7 && item.type <= 14) words = '修理防具';
						if (words) {
							const tradePromise = cga.emogua.waitTrade({
								itemFilter: eq => eq.pos == item.pos
							}).then(tradeResult => {
								if (tradeResult.success === true) {
									return cga.emogua.recursion(timer => cga.emogua.waitTrade().then(
										(backResult) => backResult.success === true || (Date.now() - timer) > 120000 ? Promise.reject() : Promise.resolve()
									)).then(
										() => cga.emogua.useItem(item.pos)
									);
								}
							});
							cga.emogua.sayWords(words);
							return tradePromise;
						}
					} else {
						item = cga.GetItemsInfo().filter(e => e.pos <= 4).find(needRepairChecker);
						if (item) {
							const emptyIndexes = cga.emogua.getEmptyBagIndexes();
							if (emptyIndexes.length > 0) {
								return Promise.resolve(cga.MoveItem(item.pos, emptyIndexes[0], -1)).then(
									() => cga.emogua.delay(300)
								);
							}
						}
					}
					return Promise.reject();
				}).then(() => {
					let result = Promise.resolve();
					cga.getInventoryItems().filter(
						eq => eq.type >= 0 && eq.type <= 14 && eq.level <= 10
					).forEach(item => {
						result = result.then(() => cga.emogua.useItem(item.pos));
					});
					return result;
				})).then(() => {
					if (!isCaptain) {
						return cga.emogua.walkList([[81,8]]);
					}
				});
			}
		}).then(() => {
			if (isCaptain) {
				const pker = cga.GetMapUnits().find(u => u.type == 8 && u.xpos == 81 && u.ypos == 8);
				if (pker) {
					return cga.emogua.turnOrientation(4).then(() => {
						cga.DoRequest(cga.REQUEST_TYPE_PK);
						return cga.emogua.delay(2000);
					}).then(() => {
						if (cga.isInBattle()) {
							return cga.emogua.waitAfterBattle();
						}
					});
				}
				console.log('没有对战人，稍后尝试');
				return cga.emogua.delay(3000);
			}
			cga.EnableFlags(cga.ENABLE_FLAG_PK, true);
			return cga.emogua.waitUntil(
				() => cga.isInBattle()
			).then(
				() => cga.emogua.waitAfterBattle()
			);
		});
	});
});
