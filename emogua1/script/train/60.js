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
	const cga = await require('../../component/wrapper');
	const {team, captain, isCaptain, forceTeamLevel, line} = cga.emogua.parseTeams(config.teams);
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
		const {goto} = await prepare({crystalNameFilter: name => name.includes("火风"),upgrades: config.upgrades});
		await goto(n => n.elsa.x);
		const arriveRegroup = async () => {
			if (cga.GetMapName() == '里谢里雅堡') {
				await cga.emogua.autoWalk([52,72]);
				await cga.emogua.talkNpc([53,72,{map:'过去与现在的回廊'}])(s => s.yesGenerator(3));
			} else {
				await cga.emogua.autoWalk([164, 153]);
				await cga.emogua.talkNpc([165,154,{map:'利夏岛'}])(s => s.yesGenerator(2));
			}
		};
		const leaveTeamAndExit = async () => {
			await cga.emogua.leaveTeam();
			process.exit();
		};
		if (isCaptain) {
			await cga.emogua.waitTeamBlock({team, coordinate: [139, 105]});
			const teamLevel = forceTeamLevel ? forceTeamLevel : cga.emogua.getTeamLevel();
			const protect = {
				minHp: 150,
				minMp: 10,
				minPetHp: 150,
				minPetMp: 0,
				minTeamNumber: team.length,
				maxItemNumber: 19
			};
			if (teamLevel < 10) {
				protect.minHp = protect.minPetHp = 40;
				await goto(n => n.falan.eout);
				await cga.emogua.autoWalkList([
					[281,88,{map:'芙蕾雅'}],[672,223,{map:'哈巴鲁东边洞穴 地下1楼'}]
				]);
			} else if (teamLevel >= 10 && teamLevel < 15) {
				protect.minHp = protect.minPetHp = 50;
				await goto(n => n.elsa.b);
				await cga.emogua.waitRegroupTeam({team, arrive: arriveRegroup}).catch(leaveTeamAndExit);
				await goto(n => n.tower.tower15);
			} else if (teamLevel >= 15 && teamLevel < 20) {
				protect.minHp = protect.minPetHp = 60;
				await goto(n => n.elsa.b);
				await cga.emogua.waitRegroupTeam({team, arrive: arriveRegroup}).catch(leaveTeamAndExit);
				await goto(n => n.tower.tower20);
			} else if (teamLevel >= 20 && teamLevel < 33) {
				protect.minHp = protect.minPetHp = 100;
				await goto(n => n.train.chicken);
			} else if (teamLevel >= 33 && teamLevel < 45) {
				await goto(n => n.train.goldDragon);
			} else if (teamLevel >= 45 && teamLevel < 50) {
				await goto(n => n.train.silverLion);
			} else if (teamLevel >= 50) {
				await goto(n => n.castle.x);
				await cga.emogua.autoWalk([51,74]);
				await cga.emogua.waitRegroupTeam({team, arrive: arriveRegroup}).catch(leaveTeamAndExit);
			} else {
				await cga.emogua.stopScript();
				await leaveTeamAndExit();
			}
			await battle.rencounter(protect);
			await leaveTeamAndExit();
		} else {
			await cga.emogua.joinTeamBlock({captainName: captain});
			cga.emogua.waitRegroupTeam({team, arrive: arriveRegroup}).catch(console.log);
			await battle.teammateCheckRencounterBlock();
			await leaveTeamAndExit();
		}
	} else {
		console.log('请检查配置');
	}
})().catch(e => {
	console.log(e);
	process.exit();
});
