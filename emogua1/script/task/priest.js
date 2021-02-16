(async () => {
	const boys = ['boy']; // 男队
	const girls = ['girl']; // 女队

	console.log('自动刷[青之证明][赤之证明]，存银行，背包不能有多个道具，银行只支持20格!');
	const cga = await require('../../component/wrapper');
	const team = boys.includes(cga.emogua.cachedPlayer.name) ? boys : (girls.includes(cga.emogua.cachedPlayer.name) ? girls : undefined);
	if (team) {
		const isCaptain = cga.emogua.cachedPlayer.name == team[0];
		const prepare = require('../../component/prepare');
		const goto = await require('../../component/goto');
		const bank = await require('../../component/bank');
		const battle = await require('../../component/battle');
		await prepare({crystalNameFilter: name => name.includes('水晶')});
		await battle.setBattleStrategies(await battle.getBattleStrategies({preset: battle.Presets.attack}));
		if (cga.getInventoryItems().find(i => i.name.includes('之证明'))) {
			await goto(n => n.falan.mbank);
			await bank.save({teller:[85,12],filter: i => i.name.includes('之证明')});
		}
		await goto(n => n.lisa.n);
		await cga.emogua.autoWalkList([
			[90,99,{map:'国民会馆'}],[108,39,{map:'雪拉威森塔１层'}],[35,96]
		]).then(
			() => cga.emogua.talkNpc([35,95])(s => s.yes)
		);
		(async () => {
			for(;;) {
				const chat = await cga.emogua.waitMessage(true).catch(() => {});
				if (chat && chat.content.includes('银行存证明')) {
					await bank.save({teller:[107,63],filter: i => i.name.includes('之证明')}).catch(console.log);
				}
			}
		})();
		const tryStore = async () => {
			if (cga.GetMapName() == '光之路') {
				await cga.emogua.autoWalk([201,19,{map:'辛梅尔'}]);
			}
			await cga.emogua.autoWalkList([
				[181,81,{map:'公寓'}],[106,64],[106,62],[106,64]
			]);
			await cga.emogua.delay(3000);
			await cga.emogua.sayWords('银行存证明');
			await cga.emogua.delay(6000);
			await cga.emogua.autoWalk([89,58]);
			await cga.emogua.restore([89,57]);
			await cga.emogua.autoWalkList([
				[100,70,{map:'辛梅尔'}],[207,91,{map:'光之路'}]
			]);
		};
		const fight = async () => {
			if (isCaptain) {
				await cga.emogua.autoWalkList([
					[161,117],[161,119],[161,117]
				]);
				await cga.emogua.delay(2000);
				await cga.emogua.waitRegroupTeam({team, arrive: () => cga.emogua.talkNpc([162,118])(s => s.yes)});
				let xy = cga.GetMapXY();
				if ((xy.x == 208 || xy.x == 209) && xy.y == 315) {
					await cga.emogua.autoWalk([208,306,{map:'蓝星考验地下1楼'}]);
				} else {
					await cga.emogua.autoWalk([241,339,{map:'红星考验地下1楼'}]);
				}
				await cga.emogua.walkRandomMazeUntil(() => cga.GetMapName() == '？？？');
				xy = cga.GetMapXY();
				if (xy.x == 194 && xy.y == 141) {
					await cga.emogua.autoWalk([203,141]);
					await cga.emogua.talkNpc([204,141])(s => s.yes);
				} else {
					await cga.emogua.autoWalk([171,109]);
					await cga.emogua.talkNpc([172,109])(s => s.yes);
				}
				await cga.emogua.waitForNormal();
				await cga.emogua.delay(3000);
				await tryStore();
			} else {
				await cga.emogua.waitRegroupTeam({team, arrive: () => cga.emogua.talkNpc([162,118])(s => s.yes)});
			}
		};
		if (isCaptain) {
			await cga.emogua.waitTeamBlock({team,coordinate:[186,90]});
			await cga.emogua.autoWalkList([
				[207,91,{map:'光之路'}]
			]);
		} else {
			await cga.emogua.joinTeamBlock({captainName: team[0]});
		}
		while (cga.getInventoryItems().length < 20) {
			await fight().catch(console.log);
		}
		console.log('背包已满');
		await cga.emogua.stopScript();
	} else {
		console.log('位置配置');
	}
})();
