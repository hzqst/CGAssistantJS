module.exports = (async () => {
	const cga = await require('./wrapper');
	const Bank = {};

	/**
	 * teller 柜员target
	 * filter name | matcher | 不传存全部
	 */
	Bank.save = async ({teller = undefined, filter = undefined, gold = 0, pets = [], size = 20, maxGold = 1000000}) => {
		if (teller) {
			await cga.emogua.turnTo(teller);
			await cga.emogua.waitNPCDialog();
			const bankList = cga.GetBankItemsInfo();
			const bankMax = 99 + size;
			let bankSlotIndex = 100;
			const toSavableSlotIndex = (item) => {
				let slot = bankList.find(b => b.name == item.name && b.count < cga.emogua.getPileMax(item));
				if (!slot) {
					while (bankSlotIndex <= bankMax && bankList.find(b => b.pos == bankSlotIndex)) {
						bankSlotIndex++;
					}
					if (bankSlotIndex <= bankMax) {
						cga.MoveItem(item.pos, bankSlotIndex, -1);
						bankList.push({pos: bankSlotIndex, count: item.count});
					}
				} else {
					cga.MoveItem(item.pos, slot.pos, -1);
					slot.count = slot.count + item.count;
				}
			};

			cga.getInventoryItems().filter(
				item => !filter || (filter instanceof Function ? filter(item) : item.name == filter)
			).forEach(i => toSavableSlotIndex(i));

			if (gold > 0) {
				const capacity = maxGold - cga.GetBankGold();
				if (capacity > 0) {
					const playerInfo = cga.GetPlayerInfo();
					cga.MoveGold(Math.min(capacity, gold, (playerInfo.gold > 1000 ? playerInfo.gold - 1000 : 0)), cga.MOVE_GOLD_TOBANK);
				}
			}
			if (pets.length > 0) {
				const bankPets = cga.GetBankPetsInfo();
				const emptyIndexes = [100,101,102,103,104].filter(i => !bankPets.find(p => p.index == i));
				for (let emptyIndex = emptyIndexes.shift(); emptyIndex !== undefined; emptyIndex = emptyIndexes.shift()) {
					const bagIndex = pets.shift();
					if (bagIndex !== undefined) {
						cga.MovePet(bagIndex, emptyIndex)
					} else {
						break;
					}
				}
			}
			await cga.emogua.delay(3000);
		}
	};
	Bank.get = async ({teller = undefined, filter = undefined, gold = 0, petsFilter = undefined, exchange = false}) => {
		if (teller) {
			await cga.emogua.turnTo(teller);
			await cga.emogua.waitNPCDialog();
			const bankList = cga.GetBankItemsInfo().filter(item => filter && (filter instanceof Function ? filter(item) : item.name == filter));
			const items = cga.getInventoryItems();
			let bankListIndex = 0;
			if (bankList.length > 0) {
				for (let bagIndex = 8; bagIndex < 28; bagIndex++) {
					if (bankListIndex < bankList.length) {
						const item = items.find(e => e.pos == bagIndex);
						const bankItem = bankList[bankListIndex];
						if (!item || (exchange && item.itemid != bankItem.itemid)) {
							cga.MoveItem(bankItem.pos, bagIndex, -1);
							bankListIndex++;
						}
					} else break;
				}
			}

			if (gold > 0) {
				const bankGold = cga.GetBankGold();
				cga.MoveGold(Math.min(gold, bankGold), cga.MOVE_GOLD_FROMBANK);
			}
			if (petsFilter) {
				const bankPets = cga.GetBankPetsInfo().filter(petsFilter).map(p => p.index);
				if (bankPets.length > 0) {
					const pets = cga.GetPetsInfo()
					const emptyIndexes = [0,1,2,3,4].filter(i => !pets.find(p => p.index == i));
					for (let emptyIndex = emptyIndexes.shift(); emptyIndex !== undefined; emptyIndex = emptyIndexes.shift()) {
						const bankIndex = bankPets.shift();
						if (bankIndex !== undefined) {
							cga.MovePet(bankIndex, emptyIndex)
						} else {
							break;
						}
					}
				}
			}
			await cga.emogua.delay(3000);
		}
	};

	return Bank;
})();
