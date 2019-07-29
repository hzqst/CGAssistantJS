require('../wrapper').then(cga => {
	const skill = cga.GetSkillsInfo().filter(e => e.name.indexOf('修理') >= 0).sort((e1, e2) => e2.lv - e1.lv)[0];
	if (skill) {
		console.log(skill.name);
		cga.emogua.recursion(() => cga.emogua.prepare({
			rechargeFlag: -1, repairFlag: -1
		}).then(() =>
			cga.emogua.falan.toStone('E1').then(
				() => cga.emogua.turnOrientation(0, '市场三楼 - 修理专区')
			).then(
				() => cga.emogua.autoWalk([83, 8])
			).then(
				() => cga.emogua.turnOrientation(4)
			).then(() => cga.emogua.recursion(() => {
				const playerInfo = cga.GetPlayerInfo();
				if (playerInfo.health > 0) {
					return false;
				} else if (playerInfo.mp < 200) {
					return cga.emogua.turnOrientation(0).then(
						() => cga.emogua.delay(5000)
					).then(
						() => cga.emogua.turnOrientation(4)
					);
				} else {
					return cga.emogua.waitMessage(chat => {
						if (chat.msg && chat.msg.indexOf(skill.name) > 0) {
							const tradeParty = cga.GetMapUnits().find(u => u.unit_id == chat.unitid);
							if (tradeParty) {
								return cga.emogua.trade(tradeParty.unit_name).then(result => {
									if (result.received && result.received.items.length > 0) {
										return cga.emogua.repairAll().then(
											() => cga.emogua.recursion(
												(timer) => cga.emogua.trade(tradeParty.unit_name, {
													itemFilter: e => result.received.items.findIndex(r => e.itemid == r.itemid) >= 0
												}).then(tr => tr.success === true || timer > 15000 ? Promise.reject() : cga.emogua.delay(3000))
											)
										);
									}
									return cga.emogua.delay(1000);
								});
							}
						}
						return true;
					});
				}
			})).then(cga.emogua.logBack)
		));
	}
});
