/**
 * options
 *  flag: 0
 *  rechargeMinHp: 300
 *  rechargeMinMp: 300
 *  rechargePet: false
 *  customAttackSets: (sets, profession, options) => {}
 */
const Flags = {
	escape: 0,
	attack: 1
};
const pushProtectHp = (cga, sets, profession, options) => {
	if (profession) {
		if (profession.name == '暗黑骑士') {
			sets.push({
				user: 1,
				check: context => context.playerUnit.hpRatio <= 0.4,
				type: '技能',
				skillName: '吸血攻击',
				skillLevel: 8,
				targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos)
			});
		} else if (profession.name == '传教士') {
			const needHealChecker = (unit) => unit && unit.curhp > 0 && unit.hpRatio <= 0.7;
			if (profession.player.job == '圣使') {
				sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeMpAction(149));
				sets.push({
					user: 1,
					check: context => context.isBoss && (context.teammates.filter(u => u.curhp > 0 && u.hpRatio <= 0.5).length >= 2 || context.teammates.filter(needHealChecker).length >= 4),
					type: '技能',
					skillName: '生命祈福',
					targets: context => [context.player_pos]
				});
				// sets.push({
				// 	user: 1,
				// 	check: function(context) {
				// 		if (!context.isBoss) {
				// 			return false;
				// 		}
				// 		const subSkillInfo = context.getAvaliableSubSkillInfo(this);
				// 		return subSkillInfo && subSkillInfo.level == 8 && context.teammates.filter(u => u.curhp > 0 && (u.flags & cga.emogua.DebuffFlags.ANY)).length >= 4;
				// 	},
				// 	type: '技能', skillName: '洁净魔法', skillLevel: 8,
				// 	targets: context => {
				// 		console.log('释放洁净8');
				// 		return [context.player_pos];
				// 	}
				// });
				sets.push({
					user: 1,
					check: function(context) {
						if (!context.isBoss) {
							return false;
						}
						const subSkillInfo = context.getAvaliableSubSkillInfo(this);
						if (subSkillInfo && subSkillInfo.level == 6) {
							const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & cga.emogua.DebuffFlags.ANY)).map(u => u.pos);
							if (needCleanPositions.length >= 3) {
								return cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions).count >= 3;
							}
						}
						return false;
					},
					type: '技能', skillName: '洁净魔法', skillLevel: 6,
					targets: context => {
						console.log('释放洁净魔法6');
						const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & cga.emogua.DebuffFlags.ANY)).map(u => u.pos);
						return [cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions).position];
					}
				});
			}
			if (['见习传教士','传教士'].includes(profession.player.job) && profession.player.maxhp >= profession.player.maxmp) {
				sets.push({
					user: 1,
					check: context => [context.playerUnit, context.petUnit].filter(needHealChecker).length > 0,
					type: '技能', skillName: '补血魔法', skillLevel: 6,
					targets: context => [context.playerUnit, context.petUnit].filter(needHealChecker).sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
				});
			} else {
				sets.push({
					user: 1,
					check: context => {
						if (!context.isBoss) {
							return false;
						}
						const needHealUnits = context.teammates.filter(needHealChecker).map(u => u.pos);
						return needHealUnits.length >= 3 && cga.emogua.BattlePositionMatrix.getMaxTPosition(needHealUnits).count >= 3;
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
					check: context => {
						if (context.isBoss) {
							return false;
						}
						const needHealUnits = context.teammates.filter(needHealChecker).map(u => u.pos);
						return needHealUnits.length >= 3 && cga.emogua.BattlePositionMatrix.getMaxTPosition(needHealUnits).count >= 3;
					}, type: '技能', skillName: '强力补血魔法', skillLevel: 6,
					targets: context => {
						const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(
							context.teammates.filter(needHealChecker).map(u => u.pos)
						);
						return [t.position];
					}
				});
				sets.push({
					user: 1,
					check: context => context.isBoss && context.teammates.filter(needHealChecker).length >= 2,
					type: '技能', skillName: '超强补血魔法',
					targets: context => [context.player_pos]
				});
				sets.push({
					user: 1,
					check: context => context.isBoss && context.teammates.filter(needHealChecker).length > 0,
					type: '技能', skillName: '补血魔法',
					targets: context => context.teammates.filter(needHealChecker).sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
				});
				sets.push({
					user: 1,
					check: context => !context.isBoss && context.teammates.filter(needHealChecker).length > 0,
					type: '技能', skillName: '补血魔法', skillLevel: 6,
					targets: context => context.teammates.filter(needHealChecker).sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
				});
			}
			sets.push({
				user: 1,
				check: context => context.playerUnit.curmp >= 100 && context.teammates.find(u => u.curhp == 0),
				type: '技能', skillName: '气绝回复',
				targets: context => context.teammates.filter(u => u.curhp == 0).map(u => u.pos)
			});
		} else if (profession.player.job == '幻之巫王') {
			sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeMpAction(149));
			sets.push({
				user: 1,
				check: context => context.isBoss && context.enemies.find(e => e.curhp > 0 && e.maxhp >= 15000) && context.round_count === 0,
				type: '技能', skillName: '超强恢复魔法',
				targets: context => [context.player_pos]
			});
			sets.push({
				user: 1,
				check: function(context) {
					if (!context.isBoss) {
						return false;
					}
					const subSkillInfo = context.getAvaliableSubSkillInfo(this);
					return subSkillInfo && subSkillInfo.level == 10 && context.teammates.filter(u => u.curhp > 0 && (u.flags & cga.emogua.DebuffFlags.ANY)).length >= 4;
				},
				type: '技能', skillName: '洁净魔法', skillLevel: 10,
				targets: context => {
					console.log('释放洁净10');
					return [context.player_pos];
				}
			});
			sets.push({
				user: 1,
				check: function(context) {
					if (!context.isBoss) {
						return false;
					}
					const subSkillInfo = context.getAvaliableSubSkillInfo(this);
					if (subSkillInfo && subSkillInfo.level == 6) {
						const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & cga.emogua.DebuffFlags.ANY)).map(u => u.pos);
						if (needCleanPositions.length >= 3) {
							return cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions).count >= 3;
						}
					}
					return false;
				},
				type: '技能', skillName: '洁净魔法', skillLevel: 6,
				targets: context => {
					console.log('释放洁净魔法6');
					const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & cga.emogua.DebuffFlags.ANY)).map(u => u.pos);
					return [cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions).position];
				}
			});
		} else if (profession.name == '魔术师') {
			sets.push({
				user: 1,
				check: context => context.playerUnit.hpRatio < 0.75,
				type: '技能', skillName: '吸血魔法',
				targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
			});
		}
	}
	sets.push({
		user: 2,
		check: context => context.petUnit.hpRatio <= 0.5,
		skillName: '明镜止水',
		targets: context => [context.petUnit.pos]
	});
	sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeHpAction(options.rechargeMinHp ? options.rechargeMinHp : 300, options.rechargePet));
};
module.exports = function(cga, options = {}) {
	const sets = [];
	if (options.flag > Flags.escape) {
		const profession = cga.emogua.getPlayerProfession();
		pushProtectHp(cga, sets, profession, options);
		sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeMpAction(options.rechargeMinMp ? options.rechargeMinMp : 300, options.rechargePet));
		if (typeof options.customAttackSets == 'function') {
			options.customAttackSets(sets, profession, options);
		}
		let targetsFunction = context => {
			if (context.isBoss) {
				return cga.emogua.AutoBattlePreset.getSortedEnemies(context);
			}
			return cga.emogua.shuffle(context.enemies.map(e => e.pos));
		}
		let multiChecker = context => {
			if (context.isBoss) {
				return (!options.ComboBossNames || !context.enemies.find(e => options.ComboBossNames.includes(e.name))) && context.enemies.length >= 3;
			}
			return context.enemies.length >= 3;
		}
		if (profession && profession.name == '魔术师') {
			// sets.push({
			// 	user: 1,
			// 	check: context => context.enemies.length >= 6,
			// 	type: '技能', skillName: '超强冰冻魔法',
			// 	targets: targetsFunction
			// });
		} else {
			sets.push({
				user: 1,
				check: context => context.enemies.front.length >= 3 || context.enemies.back.length >= 3,
				type: '技能', skillName: '因果报应', skillLevel: 3,
				targets: context => cga.emogua.AutoBattlePreset.getMaxHorizontalTargets(context)
			});
			sets.push({
				user: 1,
				check: multiChecker,
				type: '技能', skillName: '气功弹', skillLevel: 3,
				targets: targetsFunction
			});
		}
		sets.push({
			user: 5,
			check: context => true,
			type: '攻击',
			targets: targetsFunction
		});
		sets.push({
			user: 2,
			check: context => context.isBoss && context.enemies.length > 5,
			skillName: '飓风吐息',
			targets: targetsFunction
		});
		sets.push({
			user: 2,
			check: multiChecker,
			skillName: '气功弹',
			targets: targetsFunction
		});
		sets.push({
			user: 2,
			check: context => true,
			skillName: '攻击',
			targets: targetsFunction
		});
		sets.push({
			user: 2,
			check: context => true,
			skillName: '防御',
			targets: context => [context.petUnit.pos]
		});
		sets.push({
			user: 2,
			check: context => true,
			type: '什么都不做',
			targets: context => [context.petUnit.pos]
		});
	} else {
		sets.push({
			user: 2,
			check: context => context.petUnit.hpRatio <= 0.4,
			skillName: '明镜止水',
			targets: context => [context.petUnit.pos]
		});
		sets.push({
			user: 2,
			check: context => true,
			skillName: '防御',
			targets: context => [context.petUnit.pos]
		});
		sets.push({
			user: 2,
			check: context => true,
			type: '什么都不做',
			targets: context => [context.petUnit.pos]
		});
		sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeHpAction(options.rechargeMinHp ? options.rechargeMinHp : 300, options.rechargePet));
		sets.push({
			user: 5,
			check: context => true,
			type: '逃跑',
			targets: context => [context.player_pos]
		});
	}
	return sets;
};
