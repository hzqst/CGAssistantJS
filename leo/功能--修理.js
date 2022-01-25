require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    leo.monitor.config.healSelf = true;
	const skill = cga.GetSkillsInfo().filter(e => e.name.indexOf('修理') >= 0).sort((e1, e2) => e2.lv - e1.lv)[0];
    if (skill) {
        console.log(skill.name);
        cga.emogua.keepAlive();
        cga.emogua.recursion(() => Promise.resolve().then(() =>
            cga.emogua.goto(n => n.falan.mbank).then(
                () => cga.emogua.autoWalk([83, 8])
            ).then(
                () => cga.emogua.turnOrientation(4)
            ).then(() => cga.emogua.recursion(() => {
                const playerInfo = cga.GetPlayerInfo();
                // if (playerInfo.health > 0) {
                //  return false;
                // }
                if (playerInfo.mp < 200) {
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
                                const lastItems = cga.getInventoryItems();
                                const emptyPositions = Array(20).fill(8).map((v, i) => i + v).filter(p => lastItems.findIndex(i => i.pos == p) < 0);
                                return cga.emogua.trade(tradeParty.unit_name, {
                                    partyStuffsChecker: partyInfo => {
                                        return partyInfo.items.findIndex(i => !(i.type >= 0 && i.type <= 14)) < 0;
                                    }
                                }).then(result => {
                                    if (result.received && result.received.items.length > 0) {
                                        const receivedPositions = emptyPositions.slice(0, result.received.items.length);
                                        return cga.emogua.repairAll().then(
                                            () => cga.emogua.recursion(
                                                timer => cga.emogua.trade(tradeParty.unit_name, {
                                                    itemFilter: e => receivedPositions.findIndex(p => e.pos == p) >= 0
                                                }).then(tr => {
                                                    return tr.success === true || (Date.now() - timer) > 120000 ? Promise.reject() : cga.emogua.delay(3000);
                                                })
                                            ).then(() => console.log('交易返还结束'))
                                        );
                                    }
                                    return cga.emogua.delay(1000);
                                });
                            }
                        }
                        return true;
                    });
                }
            })).then(() => cga.emogua.logBack())
        ));
    }
});