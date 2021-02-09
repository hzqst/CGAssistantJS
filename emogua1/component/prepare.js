const getCrystalStoreIndexInFalan = (nameFilter) => {
	let crystalStoreIndex = -1;
	if (nameFilter('地水的水晶（5：5）')) crystalStoreIndex = 9;
	else if (nameFilter('水火的水晶（5：5）')) crystalStoreIndex = 10;
	else if (nameFilter('火风的水晶（5：5）')) crystalStoreIndex = 11;
	else if (nameFilter('风地的水晶（5：5）')) crystalStoreIndex = 12;
	return crystalStoreIndex;
};
const getCurrentPoints = (detail, attr) => {
	switch (attr) {
		case 0: return detail.points_endurance;
		case 1: return detail.points_strength;
		case 2: return detail.points_defense;
		case 3: return detail.points_agility;
		case 4: return detail.points_magical;
	}
};
const changePoints = (detail, attr) => {
	switch (attr) {
		case 0:
			--detail.points_remain;
			return ++detail.points_endurance;
		case 1:
			--detail.points_remain;
			return ++detail.points_strength;
		case 2:
			--detail.points_remain;
			return ++detail.points_defense;
		case 3:
			--detail.points_remain;
			return ++detail.points_agility;
		case 4:
			--detail.points_remain;
			return ++detail.points_magical;
	}
};
/**
 * upgrades: [{names:[],assign:[{attr:0,points:1,max:233,maxTo:3}]}]
 *   attr：体力=0，力量=1，防御=2，敏捷=3，魔法=4
 */
module.exports = async ({
	doctorName = undefined, crystalNameFilter = undefined, repair = false, sellFilter = undefined, upgrades = undefined
} = {}) => {
	const cga = await require('./wrapper');
	const goto = await require('./goto');
	const battle = await require('./battle');
	const profession = await require('./profession')();
	const bank = await require('./bank');
	battle.updateBattleSkillsCache();
	let playerInfo = cga.GetPlayerInfo();

	if (playerInfo.souls > 0) {
		console.log('你丢掉了灵魂', playerInfo.souls);
		if (playerInfo.gold < 10000) {
			console.log('没钱招魂!', playerInfo.gold);
			await cga.emogua.stopScript();
		}
		await goto(n => n.castle.x).then(
			() => cga.emogua.autoWalkList([
				[41,14,{map:'法兰城'}],[154,29,{map:'大圣堂的入口'}],[14,7,{map:'礼拜堂'}],[12,19]
			])
		).then(
			() => cga.emogua.talkNpc([12,18])(s => s.yes)
		);
	}

	// 升级人物加点
	if (upgrades) {
		const upgrade = upgrades.find(u => u.names.includes(playerInfo.name));
		if (upgrade) {
			while (playerInfo.detail.points_remain) {
				console.log('人物加点', upgrade);
				let pointsPerLevel = Math.min(playerInfo.detail.points_remain, 4);
				let assignIndex = 0;
				while (pointsPerLevel > 0 && assignIndex < upgrade.assign.length) {
					const assign = upgrade.assign[assignIndex++];
					for (let points = assign.points; points > 0; points--) {
						if (!assign.max || getCurrentPoints(playerInfo.detail, assign.attr) < assign.max) {
							cga.UpgradePlayer(assign.attr);
							changePoints(playerInfo.detail, assign.attr);
							--pointsPerLevel;
						} else if (typeof assign.maxTo == 'number') {
							cga.UpgradePlayer(assign.maxTo);
							changePoints(playerInfo.detail, assign.maxTo);
							--pointsPerLevel;
						}
					}
				}
			}
		}
	}
	// 升级宠物加点
	let pets = cga.GetPetsInfo();
	if (upgrades) {
		let battlePet = pets.find(p => p.battle_flags == cga.PET_STATE_BATTLE);
		if (battlePet) {
			const upgrade = upgrades.find(u => u.names.includes(battlePet.name || battlePet.realname));
			if (upgrade && upgrade.assign.length > 0) {
				while (battlePet.detail.points_remain) {
					console.log('宠物加点', upgrade);
					const assign = upgrade.assign[0];
					const oldPoints = battlePet.detail.points_remain;
					cga.UpgradePet(battlePet.index, assign.attr);
					await cga.emogua.delay(2000);
					pets = cga.GetPetsInfo();
					battlePet = pets.find(p => p.battle_flags == cga.PET_STATE_BATTLE);
					if (oldPoints == battlePet.detail.points_remain) {
						const altAssign = upgrade.assign[1];
						if (altAssign && altAssign.attr != assign.attr) {
							cga.UpgradePet(battlePet.index, altAssign.attr);
							await cga.emogua.delay(2000);
							pets = cga.GetPetsInfo();
							battlePet = pets.find(p => p.battle_flags == cga.PET_STATE_BATTLE);
						} else {
							console.log('宠物爆点，且没有候选加点', upgrade);
							break;
						}
					}
				}
			}
		}
	}

	const petHurt = pets.find(e => e.health > 0);
	if (playerInfo.hp < playerInfo.maxhp || playerInfo.mp < playerInfo.maxmp || pets.find(p => p.hp < p.maxhp || p.mp < p.maxmp) || petHurt) {
		const hNurse = cga.emogua.needHNurse(playerInfo, profession);
		if (hNurse || petHurt) {
			await goto(n => n.falan.whospital);
			if (hNurse) {
				await cga.emogua.walkTo([8, 32]).then(
					() => cga.emogua.restore([7,32])
				);
			} else {
				await cga.emogua.walkTo([9, 31]).then(
					() => cga.emogua.restore([9,30])
				);
			}
			if (petHurt) {
				await cga.emogua.autoWalk([10, 18]).then(
					() => cga.emogua.talkNpc([10, 17])(s => s.healPets)
				);
			}
		} else {
			await goto(n => n.castle.nurse).then(
				() => cga.emogua.restore([35, 88])
			);
		}
	}

	if (playerInfo.health > 0) {
		do {
			await goto(n => n.castle.x);
			const doctor = cga.GetMapUnits().find(
				u => (u.flags & cga.emogua.UnitFlags.Player) && (doctorName ? u.unit_name == doctorName : ((u.injury & 2) == 2 && u.icon == 13) || u.title_name.includes('医'))
			);
			if (doctor) {
				await cga.emogua.autoWalk([doctor.xpos - 1, doctor.ypos]).then(
					() => cga.emogua.joinTeam({captainName: doctor.unit_name})
				).then(
					() => cga.emogua.delay(8000)
				).then(
					() => cga.emogua.leaveTeam()
				).catch(() => {});
				playerInfo = cga.GetPlayerInfo();
			}
		} while (playerInfo.health > 0);
	}

	const sellItems = cga.getInventoryItems().filter(item => {
		if (cga.emogua.defaultSellItemFilter(item)) {
			return true;
		} else if (item.type >= 0 && item.type <= 14 && item.level <= 10) {
			const durability = cga.emogua.getDurability(item);
			return durability && durability.current == durability.max && durability.current < cga.emogua.equipmentMinDurability && !item.name.startsWith('平民') && item.name != 'ㄟ型手里剑';
		} else if (sellFilter) {
			return sellFilter(item);
		}
		return false;
	});
	if (sellItems.length > 0) {
		await goto(n => n.falan.sell).then(
			() => cga.emogua.sell([156, 122], cga.emogua.getSellList(sellItems))
		);
	}

	if (crystalNameFilter) {
		const dropList = [];
		const getCrystalItem = (items) => items.find(i => {
			if (i.type == 22 && crystalNameFilter(i.name)) {
				const durability = cga.emogua.getDurability(i);
				if (durability.current >= 10) {
					return true;
				} else {
					dropList.push(i.pos);
				}
			}
			return false;
		});
		const crystalItem = getCrystalItem(cga.GetItemsInfo());
		if (crystalItem) {
			if (crystalItem.pos > 7) {
				cga.UseItem(crystalItem.pos);
			}
		} else {
			const falanStoreIndex = getCrystalStoreIndexInFalan(crystalNameFilter);
			if (falanStoreIndex > 0) {
				await goto(n => n.falan.w1).then(
					() => cga.emogua.autoWalkList([
						[94,78,{map:'达美姊妹的店'}], [17,18]
					])
				).then(
					() => cga.emogua.buy([18,18], [{index: falanStoreIndex, count: 1}])
				).then(
					() => cga.emogua.delay(500)
				).then(
					() => {
						const item = getCrystalItem(cga.getInventoryItems());
						if (item) {
							cga.UseItem(item.pos);
						}
					}
				);
			}
		}
		if (dropList.length > 0) cga.emogua.dropItems(dropList);
	}

	await cga.emogua.sortItems();
	await cga.emogua.dropItems();

	if (repair) {
		const allItems = cga.GetItemsInfo();
		const needRepairEquipments = allItems.filter(item => {
			if (item.type >= 0 && item.type <= 14 && item.level <= 10) {
				item.durability = cga.emogua.getDurability(item);
				return item.durability && (item.durability.rate < 0.75 || (item.durability.current < item.durability.max && item.durability.current < cga.emogua.equipmentMinDurability));
			}
		});
		if (needRepairEquipments.length > 0) {
			const emptyIndexes = cga.emogua.getEmptyBagIndexes(allItems);
			const tryWaitRepair = async (words, position, itemId) => {
				for (let i = 5; i > 0; i--) {
					cga.emogua.sayWords(words);
					await cga.emogua.waitTrade({itemFilter: i => i.pos == position}).then(
						async () => {
							let timer = Date.now();
							do {
								await cga.emogua.waitTrade().then(
									async () => {
										timer = 0;
										if (itemId) {
											const equipItem = cga.getInventoryItems().find(i => i.itemid == itemId && cga.emogua.getDurability(i).current >= cga.emogua.equipmentMinDurability);
											if (equipItem) {
												cga.UseItem(equipItem.pos);
												await cga.emogua.delay(1000);
											}
										}
									},
									() => {}
								);
							} while (Date.now() - timer < 120000);
							i = 0;
						}, () => {}
					);
				}
			};
			const doRepair = async (items, words) => {
				while (items.length > 0) {
					const item = items.shift();
					if (item.pos < 8) {
						const emptyIndex = emptyIndexes[0];
						if (emptyIndex) {
							if (cga.MoveItem(item.pos, emptyIndex, -1)) {
								await cga.emogua.delay(500);
								await tryWaitRepair(words, emptyIndex, item.itemid);
								if (!cga.MoveItem(emptyIndex, item.pos, -1)) {
									emptyIndexes.shift();
								}
							}
						}
					} else {
						await tryWaitRepair(words, item.pos);
					}
					
				}
			};
			const weapons = needRepairEquipments.filter(item => item.type >= 0 && item.type <= 6);
			const armors = needRepairEquipments.filter(item => item.type >= 7 && item.type <= 14);
			if (weapons.length > 0 || armors.length > 0) {
				await goto(n => n.castle.x).then(() => cga.emogua.walkTo([26,81]));
				if (weapons.length > 0) {
					await doRepair(weapons, '修理武器');
				}
				if (armors.length > 0) {
					await doRepair(armors, '修理防具');
				}
			}
		}
	}

	if (playerInfo.gold > 980000) {
		await goto(n => n.falan.mbank).then(
			() => bank.save({teller: [84,12], gold: 900000})
		);
	}

	return {cga,goto,battle,profession};
};
