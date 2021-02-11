(async () => {
	const config = require('../../component/config').read({
		teams:[
			{
				names: [],
				"forceTeamLevel": undefined,
				line: 8
			}
		]
	});
	if (config.teams) {
		const cga = await require('../../component/wrapper');
		const {team, captain, isCaptain, protectConfig, forceTeamLevel, line} = cga.emogua.parseTeams(config.teams);
		const protect = protectConfig ? protectConfig : {
			minHp: 400,
			minMp: 20,
			minPetHp: 400,
			minPetMp: 0,
			minTeamNumber: team.length,
			maxItemNumber: 19
		};
		if (team) {
			if (line) {
				const account = await require('../../component/account');
				await account.keepLine(line);
			}
			if (!cga.IsPlayerFlagEnabled(cga.ENABLE_FLAG_TEAMCHAT)) {
				cga.SetPlayerFlagEnabled(cga.ENABLE_FLAG_TEAMCHAT, true);
			}
			const prepare = require('../../component/prepare');
			const battle = await require('../../component/battle');
			await battle.setBattleStrategies(await battle.getBattleStrategies());
			let crystalName = (forceTeamLevel && forceTeamLevel < 104) ? '风地' : '水火';

			const {goto} = await prepare({crystalNameFilter: name => name.includes(crystalName),upgrades: config.upgrades});
			await goto(n => n.camp.x);
			if (isCaptain) {
				await cga.emogua.waitTeamBlock({team, coordinate: [91, 86]});
				const restoreAtCamp = async () => {
					if (cga.emogua.getTeamNumber() < team.length) {
						return process.exit();
					}
					await cga.emogua.autoWalkList([
						[551,332,{map:'圣骑士营地'}],[87,72,{map:'工房'}],[20,23],[20,24],[20,22],[20,23]
					]).then(
						() => cga.emogua.delay(2000)
					).then(
						() => cga.emogua.sayWords('营地卖魔石')
					).then(
						() => cga.emogua.sell([21,23])
					).then(
						() => cga.emogua.delay(6000)
					).then(
						() => goto(n => n.camp.hnurse)
					).then(
						() => cga.emogua.restore([10, 11])
					);
					// await goto(n => n.camp.nurse).then(() => cga.emogua.restore([10, 11]));
					await goto(n => n.camp.x);
				};
				const restoreAtDwarf = async (sell = true) => {
					if (cga.emogua.getTeamNumber() < team.length) {
						return process.exit();
					}
					await goto(n => n.dwarf.hnurse).then(
						() => cga.emogua.restore([164,95])
					);
					if (sell) {
						await goto(n => n.dwarf.sell).then(
							() => cga.emogua.autoWalkList([[121,110],[121,111],[121,109],[121,110]])
						).then(
							() => cga.emogua.delay(2000)
						).then(
							() => cga.emogua.sayWords('矮人卖魔石')
						).then(
							() => cga.emogua.sell([122,110])
						).then(
							() => cga.emogua.delay(6000)
						);
					}
				};

				for (;;) {
					const currentMap = cga.GetMapName();
					if (currentMap != '圣骑士营地' && currentMap != '矮人城镇') {
						await cga.emogua.leaveTeam();
						process.exit();
						break;
					}
					const teamLevel = forceTeamLevel ? forceTeamLevel : cga.emogua.getTeamLevel();
					if (teamLevel < 72) {
						if (currentMap == '圣骑士营地') {
							await cga.emogua.autoWalkList([
								[36,87,{map:'肯吉罗岛'}],[547,324]
							]);
							await battle.rencounter(protect);
							await restoreAtCamp();
						} else {
							await cga.emogua.leaveTeam();
							process.exit();
							break;
						}
					} else if (teamLevel >= 72 && teamLevel < 82) {
						await goto(n => n.dwarf.x);
						await cga.emogua.autoWalkList([[110,191,{map:'肯吉罗岛'}],[233, 439]]);
						await battle.rencounter(protect);
						await cga.emogua.autoWalk([231,434,{map:'矮人城镇'}]);
						await restoreAtDwarf();
					} else if (teamLevel >= 82 && teamLevel < 95) {
						const badge = cga.GetItemsInfo().find(i => i.name == '矮人徽章');
						if (!badge) {
							if (currentMap == '圣骑士营地') {
								await cga.emogua.autoWalkList([[116,55,{map:'酒吧'}],[14,4]]).then(
									() => cga.emogua.talkNpc([14,5])(s => s.yes)
								).then(
									() => cga.emogua.autoWalkList([[0,23,{map:'圣骑士营地'}],[90,86]])
								).then(
									() => goto(n => n.dwarf.elom)
								).then(
									() => cga.emogua.talkNpc([96,124])(s => s.yes)
								);
							} else {
								await cga.emogua.leaveTeam();
								process.exit();
								break;
							}
						} else {
							await goto(n => n.dwarf.elom).then(
								() => cga.emogua.talkNpc([96,124,{x:91,y:125}])(s => s.yes) // 确保切图正确
							).then(
								() => cga.emogua.autoWalk([63,125])
							);
							await battle.rencounter(protect);
							await cga.emogua.autoWalkList([[92,125,{x:101,y:131,map:'矮人城镇'}],[121,110]]);
							await restoreAtDwarf();
						}
					} else if (teamLevel >= 95 && teamLevel < 104) {
						if (currentMap == '圣骑士营地') {
							await cga.emogua.autoWalkList([
								[36,87,{map:'肯吉罗岛'}],[384,245,{map:'蜥蜴洞穴'}],[17,4,{map:'蜥蜴洞穴上层第1层'}]
							]);
							const entry = cga.GetMapXY();
							await battle.rencounter(protect);
							if (cga.GetMapName() == '蜥蜴洞穴上层第1层') {
								await cga.emogua.autoWalk([entry.x,entry.y,{map:'蜥蜴洞穴'}]);
							}
							await cga.emogua.autoWalk([11,13,{map:'肯吉罗岛'}]);
							await restoreAtCamp();
						} else {
							await cga.emogua.leaveTeam();
							process.exit();
							break;
						}
					} else if (teamLevel >= 104) {
						if (currentMap == '圣骑士营地') {
							await cga.emogua.autoWalkList([
								[36,87,{map:'肯吉罗岛'}],[424,343]
							]);
							while (!cga.getMapObjects().find(e => e.cell === 3 && e.mapx == 424 && e.mapy == 345)) {
								await cga.emogua.delay(10000);
							}
							await cga.emogua.autoWalk([424,345,{map:'黑龙沼泽1区'}]);
							if (teamLevel < 120) {
								const entry = cga.GetMapXY();
								const entries = await cga.emogua.getMazeEntries();
								if (entries.length > 0) {
									await cga.emogua.autoWalk([entries[0].x, entries[0].y]);
								}
								await battle.rencounter(protect);
								if (cga.GetMapName() == '黑龙沼泽1区') {
									await cga.emogua.autoWalk([entry.x,entry.y,{map:'肯吉罗岛'}]);
								}
								await restoreAtCamp();
							} else if (teamLevel >= 120 && teamLevel < 128) {
								await cga.emogua.walkRandomMazeUntil(() => {
									const map = cga.GetMapName();
									if (map == '黑龙沼泽5区') {
										return true;
									} else if (map == '肯吉罗岛') {
										process.exit();
										return true;
									}
								}).catch(() => process.exit());
								await battle.rencounter(protect);
								await cga.emogua.leaveTeam();
								process.exit();
							}  else {
								await cga.emogua.walkRandomMazeUntil(() => {
									const map = cga.GetMapName();
									if (map == '黑龙沼泽') {
										return true;
									} else if (map == '肯吉罗岛') {
										process.exit();
										return true;
									}
								}).catch(() => process.exit());
								await cga.emogua.autoWalk([11,17,{map:'*'}]);
								await battle.rencounter(protect);
								await cga.emogua.leaveTeam();
								process.exit();
							}
						} else {
							await cga.emogua.leaveTeam();
							process.exit();
							break;
						}
					} else {
						await cga.emogua.leaveTeam();
						await cga.emogua.stopScript();
						break;
					}
				}
			} else {
				await cga.emogua.joinTeamBlock({captainName: captain});
				await battle.teammateCheckRencounterBlock();
				process.exit();
			}
		} else {
			console.log('请检查配置');
		}
	}
})().catch(console.log);
