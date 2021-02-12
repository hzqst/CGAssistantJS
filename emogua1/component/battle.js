const SkillFlags = {
	SELECT_TARGET: 0x1,
	SELECT_DEAD: 0x2,
	TO_PET: 0x4,
	TO_SELF: 0x8,
	TO_TEAMMATE: 0x10,
	TO_ENEMY: 0x20,
	SINGLE: 0x40,
	MULTI: 0x80,
	ALL: 0x100,
	BOOM: 0x200,
	FRONT_ONLY: 0x400
};
const DebuffFlags = {
	SLEEP: 0x20,
	MEDUSA: 0x40,
	DRUNK: 0x80,
	CHAOS: 0x100,
	FORGET: 0x200,
	POISON: 0x400
};
DebuffFlags.ANY = DebuffFlags.SLEEP | DebuffFlags.MEDUSA | DebuffFlags.DRUNK | DebuffFlags.CHAOS | DebuffFlags.FORGET | DebuffFlags.POISON;
const WeapAttackFlags = {
	CLOSE: 0x80
};
const BattleActionFlags = {
	ISPLAYER: 1,
	ISDOUBLE: 2,
	ISSKILLPERFORMED: 4,
	END: 8,
	BEGIN: 16
};
const BattlePositionMatrix = [
	[4,2,0,1,3],
	[9,7,5,6,8],
	[14,12,10,11,13],
	[19,17,15,16,18]
];
BattlePositionMatrix.isFront = (position) => (position >= 5 && position <= 9) || (position >= 15 && position <= 19);
BattlePositionMatrix.getTList = (position) => {
	const row = BattlePositionMatrix.find(r => r.indexOf(position) >= 0);
	if (row) {
		const index = row.indexOf(position);
		const result = [];
		result.push(row[index]);
		if ((index + 1) < 5) {
			result.push(row[index + 1]);
		}
		if ((index - 1) > -1) {
			result.push(row[index - 1]);
		}
		if (BattlePositionMatrix.isFront(position)) {
			result.push(position - 5);
		} else {
			result.push(position + 5);
		}
		return result;
	}
};
BattlePositionMatrix.getMaxTPosition = (positions) => {
	const result = {
		count: 0
	};
	for (let position of positions) {
		const tlist = BattlePositionMatrix.getTList(position);
		const intersect = tlist.filter(p => positions.indexOf(p) > -1);
		if (intersect.length >= 4) {
			result.count = 4;
			result.position = position;
			return result;
		} else if (intersect.length > result.count) {
			result.count = intersect.length;
			result.position = position;
		}
	}
	return result;
};

let AutoBattleFirstRoundDelay = 4000;
let AutoBattleRoundDelay = 4000;
let lastRound = -1;
let isBossBattle = false;
const initBattleState = () => {
	lastRound = -1;
	isBossBattle = false;
};
const KillFirstEnemyNames = ['帕布提斯马','被唤醒的亡魂','暗黑龙','土之斗神','水之斗神','炎之斗神','风之斗神','土之守卫的影子','水之守卫的影子','炎之守卫的影子','风之守卫的影子','守护怪'];
module.exports = (async () => {
	const cga = await require('./wrapper');
	const pushProtectSkills = (sets, profession, playerInfo) => {
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
				if (playerInfo.job == '圣使') {
					sets.push({
						user: 1,
						check: context => context.isBoss && (context.teammates.filter(u => u.curhp > 0 && u.hpRatio <= 0.5).length >= 2 || context.teammates.filter(needHealChecker).length >= 4),
						type: '技能',
						skillName: '生命祈福',
						targets: context => [context.player_pos]
					});
				}
				sets.push({
					user: 1,
					check: context => {
						if (!context.isBoss) return false;
						const needHealUnits = context.teammates.filter(needHealChecker).map(u => u.pos);
						return needHealUnits.length >= 3 && BattlePositionMatrix.getMaxTPosition(needHealUnits).count >= 3;
					}, type: '技能', skillName: '强力补血魔法',
					targets: context => {
						const t = BattlePositionMatrix.getMaxTPosition(
							context.teammates.filter(needHealChecker).map(u => u.pos)
						);
						return [t.position];
					}
				});
				sets.push({
					user: 1,
					check: context => {
						if (context.isBoss) return false;
						const needHealUnits = context.teammates.filter(needHealChecker).map(u => u.pos);
						return needHealUnits.length >= 3 && BattlePositionMatrix.getMaxTPosition(needHealUnits).count >= 3;
					}, type: '技能', skillName: '强力补血魔法', skillLevel: 6,
					targets: context => {
						const t = BattlePositionMatrix.getMaxTPosition(
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
				if (playerInfo.job == '圣使') {
					sets.push({
						user: 1,
						check: (context, strategy) => {
							if (context.isBoss) {
								const subSkillInfo = context.getAvaliableSubSkillInfo(strategy);
								if (subSkillInfo && subSkillInfo.level >= 6) {
									const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & DebuffFlags.ANY)).map(u => u.pos);
									if (needCleanPositions.length >= 3) {
										return BattlePositionMatrix.getMaxTPosition(needCleanPositions).count >= 3;
									}
								}
							}
							return false;
						},
						type: '技能', skillName: '洁净魔法', skillLevel: 6,
						targets: context => {
							console.log('释放洁净魔法6');
							const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & DebuffFlags.ANY)).map(u => u.pos);
							return [BattlePositionMatrix.getMaxTPosition(needCleanPositions).position];
						}
					});
				}
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
				sets.push({
					user: 1,
					check: context => context.playerUnit.curmp >= 100 && context.teammates.find(u => u.curhp == 0),
					type: '技能', skillName: '气绝回复',
					targets: context => context.teammates.filter(u => u.curhp == 0).map(u => u.pos)
				});
			} else if (playerInfo.job == '幻之巫王') {
				sets.push({
					user: 1,
					check: context => context.isBoss && context.round_count == 0 && context.enemies.length >= 3 && context.enemies.find(e => e.curhp > 0 && e.maxhp >= 12000),
					type: '技能', skillName: '超强恢复魔法',
					targets: context => [context.player_pos]
				});
				sets.push({
					user: 1,
					check: function(context, strategy) {
						if (!context.isBoss) return false;
						const subSkillInfo = context.getAvaliableSubSkillInfo(strategy);
						return subSkillInfo && subSkillInfo.level >= 10 && context.teammates.filter(u => u.curhp > 0 && (u.flags & DebuffFlags.ANY)).length >= 4;
					},
					type: '技能', skillName: '洁净魔法', skillLevel: 10,
					targets: context => {
						console.log('释放洁净10');
						return [context.player_pos];
					}
				});
				sets.push({
					user: 1,
					check: function(context, strategy) {
						if (context.isBoss) {
							const subSkillInfo = context.getAvaliableSubSkillInfo(strategy);
							if (subSkillInfo && subSkillInfo.level >= 6) {
								const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & DebuffFlags.ANY)).map(u => u.pos);
								if (needCleanPositions.length >= 3) {
									return BattlePositionMatrix.getMaxTPosition(needCleanPositions).count >= 3;
								}
							}
						}
						return false;
					},
					type: '技能', skillName: '洁净魔法', skillLevel: 6,
					targets: context => {
						console.log('释放洁净魔法6');
						const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && (u.flags & DebuffFlags.ANY)).map(u => u.pos);
						return [BattlePositionMatrix.getMaxTPosition(needCleanPositions).position];
					}
				});
			} else if (profession.name == '魔术师') {
				sets.push({
					user: 1,
					check: context => context.playerUnit.hpRatio < 0.75,
					type: '技能', skillName: '吸血魔法',
					targets: context => context.targetFunctions.getSortedEnemies()
				});
			}
		}
		sets.push({
			user: 2,
			check: context => context.petUnit.hpRatio <= 0.5,
			skillName: '明镜止水',
			targets: context => [context.petUnit.pos]
		});
	};
	const pushPotionSets = (sets, minHp = 300, pet = false) => {
		sets.push(
			{
				user: 1,
				check: context => (context.playerUnit.curhp <= minHp || (pet && context.petUnit.curhp <= minHp)) && context.cga.getInventoryItems().find(i => i.type == 43 && i.name != '香水：深蓝九号'),
				type: '物品',
				item: context => context.cga.getInventoryItems().find(i => i.type == 43).pos,
				targets: context => pet ? [context.playerUnit, context.petUnit].filter(u => u.curhp <= minHp).map(u => u.pos) : [context.player_pos]
			}
		);
	};
	
	const Battle = {};
	Battle.Presets = {
		escape: 0,
		attack: 1,
		custom: 2
	};
	/**
	 * preset: Battle.Presets
	 * restoreMinHp: 300
	 * restorePet: false
	 * custom: (sets) => {}
	 * killFirstNames: ['']
	 */
	Battle.getBattleStrategies = async ({
		preset = Battle.Presets.attack, restoreMinHp = 300, restorePet = false, custom = undefined, killFirstNames = undefined
	} = {}) => {
		const sets = [];
		if (preset == Battle.Presets.attack) {
			const playerInfo = cga.GetPlayerInfo();
			const profession = await (require('./profession')(playerInfo));
			pushProtectSkills(sets, profession, playerInfo);
			pushPotionSets(sets, restoreMinHp, restorePet);
			if (custom) {
				custom(sets);
			}
			killFirstNames = killFirstNames ? killFirstNames.concat(KillFirstEnemyNames) : KillFirstEnemyNames;
			const targetsFunction = context => {
				if (context.isBoss) {
					return context.targetFunctions.getSortedEnemies(killFirstNames);
				}
				return cga.emogua.shuffle(context.enemies.map(e => e.pos));
			}
			if (profession && profession.name == '魔术师') {
				// sets.push({
				// 	user: 1,
				// 	check: context => context.enemies.length >= 6,
				// 	type: '技能', skillName: '超强冰冻魔法',
				// 	targets: targetsFunction
				// });
			} else {
				if (profession && profession.name == '暗黑骑士') {
					const getBoss = (context) => context.enemies.find(e => e.curhp > 5000 && e.maxhp > 11000);
					sets.push({
						user: 1,
						check: (context, strategy) => {
							if (context.isBoss) {
								const boss = getBoss(context);
								if (boss) {
									const subSkillInfo = context.getAvaliableSubSkillInfo(strategy);
									if (subSkillInfo) {
										return typeof context.getSkillTarget([boss.pos], subSkillInfo.flags, context.player_pos) == 'number';
									}
								}
							}
							return false;
						},
						type: '技能', skillName: '诸刃·碎玉',
						targets: context => [getBoss(context).pos]
					});
				}
				sets.push({
					user: 1,
					check: context => context.isBoss && context.enemies.length >= 3 && context.playerSkills.find(s => s.name == '气功弹') && !context.enemies.find(e => killFirstNames.includes(e.name)),
					type: '技能', skillName: '气功弹',
					targets: targetsFunction
				});
				sets.push({
					user: 1,
					check: context => !context.isBoss && context.enemies.length >= 3 && context.playerSkills.find(s => s.name == '气功弹'),
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
			if (playerInfo.job == '兽王') {
				sets.push({
					user: 2,
					check: context => context.petSkills && context.petSkills.find(s => s.name == '飓风吐息') && context.enemies.length > 7 && (!context.isBoss || !context.enemies.find(e => killFirstNames.includes(e.name))),
					skillName: '飓风吐息',
					targets: targetsFunction
				});
			}
			sets.push({
				user: 2,
				check: context => context.petSkills && context.petSkills.find(s => s.name.startsWith('气功弹')) &&
					(
						(!context.isBoss && context.enemies.length >= 3) ||
						(context.isBoss && context.enemies.length >= 2 && !context.enemies.find(e => killFirstNames.includes(e.name)))
					),
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
				type: '什么都不做',
				targets: context => [context.petUnit.pos]
			});
		} else if (preset == Battle.Presets.escape) {
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
			pushPotionSets(sets, restoreMinHp, restorePet);
			sets.push({
				user: 5,
				check: context => true,
				type: '逃跑',
				targets: context => [context.player_pos]
			});
		} else {
			pushPotionSets(sets, restoreMinHp, restorePet);
			if (custom) {
				custom(sets);
			}
		}
		return sets;
	};
	
	/**
	 * context: {
	 *     round_count: 41,
	 *     player_pos: 10,
	 *     player_status: 1, // 一动二动都为1 宠物回合为4
	 *     skill_performed: 0, // 二动 宠物回合为1
	 *     skill_allowbit: 953,
	 *     weapon_allowbit: 176,
	 *     petskill_allowbit: 127,
	 *     petid: 0,
	 *     effect_flags: 0
	 *
	 *     cga
	 *     targetFunctions
	 *     BattlePositionMatrix
	 *     playerUnit
	 *     petUnit
	 *     playerSkills
	 *     petSkills
	 *     DebuffFlags
	 * }
	 * battleUnits:  [
	 *     {
	 *       name: 'xxx',
	 *       level: 160,
	 *       modelid: 100358,
	 *       curhp: 3011,
	 *       maxhp: 3011,
	 *       curmp: 771,
	 *       maxmp: 771,
	 *       pos: 0,
	 *       flags: 100663300
	 *     }
	 * ]
	 * strategies: [
	 *     {
	 *         user: 1 (人物) 2 (宠物) 4 (无宠二动)
	 *         check: (context, strategy) => boolean
	 *
	 *         type: '技能 攻击 防御 逃跑 位置 宠物 物品 什么都不做',
	 *
	 *         skillName: '因果报应', // cga.GetSkillsInfo() & cga.GetSubSkillsInfo(info.index)
	 *         skillLevel: 1,
	 *         force: false, //强制释放
	 *         targets: context => [position],
	 *         rollback: '攻击 | 防御 | 什么都不做', // 技能不能释放回退到基础动作,不设置默认是 '攻击'
	 *         item: context => position,
	 *     }
	 * ]
	 * 默认首回合不延迟，如果屏蔽切图且第一回合敌人全被飞或者己方全被飞会掉线
	 */
	let playerStrategies = [], player2Strategies = [], petStrategies = [];
	const applyPlayerNormalAttack = (context, targets) => {
		const matchedTarget = targets.find(target => {
			if (
				context.enemies.back.findIndex(e => e.pos == target && e.curhp > 0) >= 0 &&
				(context.weapon_allowbit & WeapAttackFlags.CLOSE) &&
				context.considerBackPosition(context.player_pos) && context.considerBackPosition(target)
			) {
				return false;
			}
			return true;
		});
		if (typeof matchedTarget == 'number') {
			context.cga.BattleNormalAttack(matchedTarget);
		} else {
			console.log('人物战斗没有可用目标->' + JSON.stringify(targets));
		}
	};
	const applyPlayerRollbackAction = (context, type = '攻击') => {
		if (type == '防御') {
			context.cga.BattleGuard();
		} else if (type == '什么都不做') {
			context.cga.BattleDoNothing();
			console.log('player rollabck 什么都不做');
		} else {
			applyPlayerNormalAttack(context, context.targetFunctions.getSortedEnemies());
		}
	};
	const applyPlayerStrategy = (context, strategy) => {
		try {
			if (strategy.type == '什么都不做') {
				cga.BattleDoNothing();
			} else if (strategy.type == '防御') {
				cga.BattleGuard();
			} else if (strategy.type == '逃跑') {
				cga.BattleEscape();
			} else if (strategy.type == '位置') {
				cga.BattleExchangePosition();
			} else if (strategy.type == '宠物') {
				const pets = strategy.targets(context);
				if (pets.length > 0) {
					cga.BattleChangePet(pets[0]);
				} else {
					applyPlayerRollbackAction(context, strategy.rollback);
				}
			} else if (strategy.type == '攻击') {
				let targets = strategy.targets(context);
				if (targets.length == 0) {
					targets = context.enemies.map(e => e.pos);
				}
				applyPlayerNormalAttack(context, targets);
			} else if (strategy.type == '物品') {
				const targets = strategy.targets(context);
				const item = strategy.item(context);
				if (targets.length > 0 && item) {
					cga.BattleUseItem(item, targets[0]);
				} else {
					applyPlayerRollbackAction(context, strategy.rollback);
				}
			} else if (strategy.type == '技能')  {
				const subSkillInfo = context.getAvaliableSubSkillInfo(strategy);
				if (subSkillInfo) {
					let target = context.getSkillTarget(strategy.targets(context), subSkillInfo.flags, context.player_pos);
					if (typeof target == 'number') {
						if (SkillFlags.MULTI & subSkillInfo.flags) {
							target = target + 20;
						}
						if (SkillFlags.ALL & subSkillInfo.flags) {
							target = (target >= 10 && target <= 19) ? 41 : 40;
						}
						if (SkillFlags.BOOM & subSkillInfo.flags) {
							target = 42;
						}
						cga.BattleSkillAttack(subSkillInfo.skillIndex, subSkillInfo.level - 1, target, strategy.force === true);
					} else {
						console.log('人物技能目标不可用，将使用rollback设置', strategy);
						applyPlayerRollbackAction(context, strategy.rollback);
					}
				} else {
					console.log('人物技能不可用，将使用rollback设置', strategy);
					applyPlayerRollbackAction(context, strategy.rollback);
				}
			} else {
				console.log('未识别的战斗配置 => ', JSON.stringify(strategy));
			}
		} catch (e) {
			console.log('战斗技能使用错误:', e);
			console.log(strategy);
		}
	};
	const applyPetStrategy = (context, strategy, twice = true) => {
		try {
			if (strategy.type == '什么都不做') {
				cga.BattlePetSkillAttack(255, 255, twice);
			} else {
				const skillInfo = context.getAvaliablePetSkillInfo(strategy);
				if (skillInfo) {
					let target = context.getSkillTarget(strategy.targets(context), skillInfo.flags, context.petUnit.pos);
					if (typeof target == 'number') {
						if (SkillFlags.MULTI & skillInfo.flags) {
							target = target + 20;
						}
						if (SkillFlags.ALL & skillInfo.flags) {
							target = (target >= 10 && target <= 19) ? 41 : 40;
						}
						if (SkillFlags.BOOM & skillInfo.flags) {
							target = 42;
						}
						if (twice) {
							cga.BattlePetSkillAttack(skillInfo.index, target, twice);
							cga.BattlePetSkillAttack(skillInfo.index, target, twice);
						} else {
							cga.BattlePetSkillAttack(skillInfo.index, target, twice);
						}
					} else {
						cga.BattlePetSkillAttack(255, 255, twice);
						console.log('没有可用的宠物战斗策略，什么都不做');
					}
				} else {
					cga.BattlePetSkillAttack(255, 255, twice);
					console.log('没有可用的宠物战斗策略，什么都不做');
				}
			}
		} catch (e) {
			console.log('宠物自动战斗错误: ', e);
			console.log(strategy);
		}
	};
	const petAction = (context, twice = true) => {
		const matchedStrategy = petStrategies.find(
			strategy => strategy.check(context, strategy) && (strategy.type == '什么都不做' || typeof context.getAvaliablePetSkillInfo(strategy) == 'object')
		);
		if (matchedStrategy) applyPetStrategy(context, matchedStrategy, twice);
		else {
			cga.BattlePetSkillAttack(255, 255, twice);
			console.log('没有可用的宠物战斗策略，什么都不做');
		}
	};
	const getSkillsInfoCache = () => {
		try {
			return cga.GetSkillsInfo().map(skillInfo => {
				const subSkills = cga.GetSubSkillsInfo(skillInfo.index).reverse();
				if (!skillInfo.subSkillsInfo || subSkills.length > 0) {
					skillInfo.subSkillsInfo = subSkills ? subSkills : [];
				}
				return skillInfo;
			});
		} catch (e) {
			console.log('getSkillsInfoCache', e);
		}
	}
	const getPetsSkillsInfoCache = () => {
		try {
			const result = {};
			cga.GetPetsInfo().forEach(pet => {
				const petSkills = cga.GetPetSkillsInfo(pet.index);
				if (!result[pet.index] || petSkills.length > 0) {
					result[pet.index] = petSkills ? petSkills : [];
				}
			});
			return result;
		} catch (e) {
			console.log('getPetsSkillsInfoCache', e);
		}
	};
	let SkillsInfoCache = getSkillsInfoCache();
	let PetsSkillsInfoCache = getPetsSkillsInfoCache();
	let pet2 = true;
	Battle.updateBattleSkillsCache = () => {
		SkillsInfoCache = getSkillsInfoCache();
		PetsSkillsInfoCache = getPetsSkillsInfoCache();
	};
	Battle.setPet2Action = (value = true) => {
		pet2 = value;
	};
	const battle = (state, context) => {
		context.BattlePositionMatrix = BattlePositionMatrix;
		context.DebuffFlags = DebuffFlags;
		context.units = context.cga.GetBattleUnits().map(u => {
			u.hpRatio = u.curhp / u.maxhp;
			return u;
		});
		context.enemies = context.units.filter(e =>
			(context.player_pos > 9 && e.pos <= 9 && e.curhp > 0) ||
			(context.player_pos <= 9 && e.pos > 9 && e.curhp > 0)
		);
		context.enemies.front = context.enemies.filter(e => context.BattlePositionMatrix.isFront(e.pos));
		context.enemies.back = context.enemies.filter(e => !context.BattlePositionMatrix.isFront(e.pos));
		context.teammates = context.units.filter(e =>
			(context.player_pos > 9 && e.pos > 9) ||
			(context.player_pos <= 9 && e.pos <= 9)
		);
		context.considerBackPosition = (position) => !context.BattlePositionMatrix.isFront(position) && context.units.findIndex(u => u.pos == (position + 5) && u.curhp > 0) >= 0;
		context.petUnit = context.units.find(u => u.pos == (context.player_pos + (context.BattlePositionMatrix.isFront(context.player_pos) ? -5 : 5)));
		context.playerUnit = context.units.find(u => u.pos == context.player_pos);
		context.playerSkills = SkillsInfoCache;
		context.petSkills = PetsSkillsInfoCache[context.petid];
		context.getAvaliableSubSkillInfo = (strategy) => {
			const skillInfo = SkillsInfoCache.find(s => s.name == strategy.skillName);
			if (skillInfo) {
				if (skillInfo.subSkillsInfo) {
					const subSkillInfo = skillInfo.subSkillsInfo.find(subSkill =>
						(!strategy.skillLevel || subSkill.level <= strategy.skillLevel) &&
						(strategy.force || (subSkill.available && (context.skill_allowbit & (1 << skillInfo.index)))) &&
						subSkill.cost <= context.playerUnit.curmp
					);
					if (subSkillInfo) {
						subSkillInfo.skillIndex = skillInfo.index;
						return subSkillInfo;
					}
				}
			}
		};
		context.getAvaliablePetSkillInfo = (strategy) => {
			if (context.petSkills) {
				const skillInfo = context.petSkills.find(info => info.name.startsWith(strategy.skillName));
				if (skillInfo && (context.petskill_allowbit & (1 << skillInfo.index)) && skillInfo.cost <= context.petUnit.curmp) {
					return skillInfo;
				}
			}
		};
		context.getSkillTarget = (targets, skillFlags, position) => {
			return targets.find(target => {
				if (
					context.enemies.back.findIndex(e => e.pos == target && e.curhp > 0) >= 0 &&
					((SkillFlags.FRONT_ONLY & skillFlags) && (context.weapon_allowbit & WeapAttackFlags.CLOSE)) &&
					context.considerBackPosition(position) && context.considerBackPosition(target)
				) {
					return false;
				}
				return true;
			});
		};
		context.targetFunctions = {
			getMaxHorizontalEnemies: () => context.enemies.back.length > context.enemies.front.length ? context.enemies.back.map(u => u.pos) : context.enemies.front.map(u => u.pos),
			getSortedEnemies: (names = KillFirstEnemyNames) => context.enemies.sort((a, b) => {
				const aindex = names.findIndex(n => n == a.name);
				const bindex = names.findIndex(n => n == b.name);
				if (aindex >= 0) {
					if (bindex >= 0) return aindex - bindex;
					else return -1;
				} else if (bindex >= 0) return 1;
				return a.curhp - b.curhp;
			}).map(u => u.pos),
			getSortedMinHpEnemies: () => context.enemies.sort((a, b) => a.curhp - b.curhp).map(u => u.pos)
		};
	
		if (state & BattleActionFlags.ISPLAYER) {
			const matchedStrategy = (state & BattleActionFlags.ISDOUBLE ? player2Strategies : playerStrategies).find(strategy => {
				if (strategy.check(context, strategy)) {
					if (strategy.type == '技能') {
						return typeof context.getAvaliableSubSkillInfo(strategy) == 'object';
					}
					return true;
				}
				return false;
			});
			if (matchedStrategy) {
				// 宠物二动
				if (pet2 && matchedStrategy.type != '逃跑' && context.petUnit && context.petUnit.curhp > 0) {
					petAction(context);
				}
				applyPlayerStrategy(context, matchedStrategy);
			} else {
				console.log('人物没有可匹配的战斗策略->' + JSON.stringify(playerStrategies));
			}
		} else {
			petAction(context, false);
		}
	};
	let listeningBattleAction = false;
	const listenBattleAction = async () => {
		if (!listeningBattleAction) {
			listeningBattleAction = true;
			while (listeningBattleAction) {
				try {
					const state = await new Promise(resolve => cga.AsyncWaitBattleAction((error, state) => setTimeout(() => resolve(state)), 30000));
					if (typeof state == 'number') {
						if (BattleActionFlags.END & state) {
							cga.emogua.waitForNormal().then(
								() => cga.emogua.sortItems()
							).then(
								() => cga.emogua.dropItems()
							);
							initBattleState();
						} else if (BattleActionFlags.BEGIN & state) {
							initBattleState();
						} else {
							if (playerStrategies.length > 0) {
								const context = cga.GetBattleContext();
								context.cga = cga;
								let delay = AutoBattleRoundDelay;
								if (lastRound < 0) {
									isBossBattle = (cga.GetBGMIndex() == 14);
									delay = AutoBattleFirstRoundDelay;
									if (isBossBattle) {
										console.log('BOSS战斗');
									}
									if (context.round_count == 1) { // 被偷袭
										console.log('被偷袭');
										delay += 4000;
									}
								} else if (lastRound === context.round_count) {
									delay = 0;
								}
								context.isBoss = isBossBattle;
								lastRound = context.round_count;
								if (delay > 0) setTimeout(() => battle(state, context), delay);
								else battle(state, context);
							}
						}
					}
				} catch (e) {
					console.log('脚本自动战斗', e);
				}
			}
		}
	};
	const BattleStrategyCache = [];
	Battle.setBattleStrategies = async (strategies, firstRoundDelay = 4000, roundDelay = 4000) => {
		if (strategies && strategies.length > 0) {
			playerStrategies = strategies.filter(e => e.user & 1);
			player2Strategies = strategies.filter(e => e.user & 4);
			petStrategies = strategies.filter(e => e.user & 2);
			if (typeof firstRoundDelay == 'number') {
				AutoBattleFirstRoundDelay = Math.max(0, firstRoundDelay);
			}
			if (typeof roundDelay == 'number') {
				AutoBattleRoundDelay = Math.max(0, roundDelay);
			}
			if (BattleStrategyCache.length == 2) {
				BattleStrategyCache.shift();
			}
			BattleStrategyCache.push(strategies);
			const guiSetting = await cga.emogua.getGuiSetting();
			if (guiSetting.battle.autobattle === false) {
				console.log('启用脚本战斗, 并自动重启脚本');
				if (!guiSetting.battle.autorestart) cga.emogua.loadGuiScript({autorestart: true});
				listenBattleAction();
			}
		} else {
			console.log('脚本战斗取消');
			playerStrategies = [];
			player2Strategies = [];
			petStrategies = [];
			listeningBattleAction = false;
		}
	};
	Battle.switchToLastBattleStrategies = async () => {
		if (BattleStrategyCache.length == 2) {
			await Battle.setBattleStrategies(BattleStrategyCache[0]);
		}
	};

	const stopRencounterWords = '触发战斗保护';
	Battle.tryStopRencounter = () => cga.emogua.sayWords(stopRencounterWords);
	Battle.protectWithDefaults = (protect) => {
		const defaults = {
			minHp: 50, minMp: 10, minPetHp: 50, minPetMp: 0, maxPetNumber: 5, maxItemNumber: 20, maxGold: 1000001, minTeamNumber: 1, checker: undefined
		};
		if (protect) {
			if (typeof protect.minHp == 'number') {
				defaults.minHp = protect.minHp;
			}
			if (typeof protect.minMp == 'number') {
				defaults.minMp = protect.minMp;
			}
			if (typeof protect.minPetHp == 'number') {
				defaults.minPetHp = protect.minPetHp;
			}
			if (typeof protect.minPetMp == 'number') {
				defaults.minPetMp = protect.minPetMp;
			}
			if (typeof protect.maxPetNumber == 'number') {
				defaults.maxPetNumber = protect.maxPetNumber;
			}
			if (typeof protect.maxItemNumber == 'number') {
				defaults.maxItemNumber = protect.maxItemNumber;
			}
			if (typeof protect.minTeamNumber == 'number') {
				defaults.minTeamNumber = protect.minTeamNumber;
			}
			if (typeof protect.maxGold == 'number') {
				defaults.maxGold = protect.maxGold;
			}
			if (typeof protect.checker == 'function') {
				defaults.checker = protect.checker;
			}
		}
		console.log(defaults);
		return defaults;
	}
	Battle.checkStopRencounter = (protect, talk = false, checkTeam = false) => {
		const playerInfo = cga.GetPlayerInfo();
		const pets = cga.GetPetsInfo();
		if (
			playerInfo.hp < protect.minHp || playerInfo.mp < protect.minMp || playerInfo.gold > protect.maxGold || cga.getInventoryItems().length > protect.maxItemNumber ||
			pets.length > protect.maxPetNumber || pets.filter(e => e.battle_flags == 2).find(p => p.hp < protect.minPetHp || p.mp < protect.minPetMp) ||
			(
				checkTeam &&
				(cga.emogua.getTeamNumber() < protect.minTeamNumber || cga.emogua.getTeammates().find(t => t.hp > 0 && t.mp > 0 && (t.hp < protect.minHp || t.mp < protect.minMp)))
			) ||
			(protect.checker && protect.checker())
		) {
			if (talk) {
				Battle.tryStopRencounter();
			}
			return true;
		}
		return false;
	};
	/**
	protect = {
		minHp: 200,
		minMp: 10,
		minPetHp: 200,
		minPetMp: 0,
		minTeamNumber: 5,
		maxItemNumber: 19,
		maxGold: 1000001,
		checker: () => false
	}
	 */
	let rencountering = false;
	Battle.rencounter = async (protect, battleTimes) => {
		if (!rencountering) {
			rencountering = true;
			protect = Battle.protectWithDefaults(protect);
			await cga.emogua.downloadMap();
			const mapName = cga.GetMapName();
			const startTime = new Date();
			const startPosition = cga.emogua.getMovablePositionAround(cga.GetMapXY());
			const movePosition = cga.emogua.getMovablePositionAround(startPosition);
			const points = [startPosition, movePosition];

			let counter = 0;
			(async () => {
				while(rencountering) {
					const chat = await cga.emogua.waitMessage(true, 3000).catch(() => {});
					if (
						(battleTimes && counter >= battleTimes) ||
						(chat && chat.content.includes(stopRencounterWords)) ||
						Battle.checkStopRencounter(protect, false, true) ||
						mapName != cga.GetMapName()
					) {
						rencountering = false;
					}
				}
			})();
			console.log('开始遇敌', startTime.toLocaleString(), mapName);
			let pointer = 0;
			let normal = true;
			(async () => {
				while (rencountering) {
					normal = cga.GetWorldStatus() == 9 && cga.GetGameStatus() == 3;
					if (normal) {
						await cga.emogua.delay(1000);
					} else {
						await cga.emogua.waitForNormal();
						counter++;
					}
				}
			})();
			while(rencountering) {
				if (normal) {
					pointer = (pointer + 1) % 2;
					cga.WalkTo(points[pointer].x, points[pointer].y);
				}
				await cga.emogua.delay(300);
			}
			const currentDate = new Date();
			console.log('已停止遇敌', counter, parseInt(((currentDate.getTime() - startTime.getTime()) / 1000).toString()), currentDate.toLocaleString());
			await cga.emogua.delay(1000);
			await cga.emogua.waitForNormal();
		}
	};
	Battle.teammateCheckRencounterBlock = async ({maxGold = 1000001} = {}) => {
		let lastBagItems = 0;
		while (cga.emogua.getTeamNumber() > 1 || cga.emogua.isRegroupingTeam) {
			const chat = await cga.emogua.waitMessage(true).catch(() => {});
			if (chat && chat.content.includes('营地卖魔石')) {
				await cga.emogua.sell([21,23]);
			} else if (chat && chat.content.includes('矮人卖魔石')) {
				await cga.emogua.sell([122,110]);
			} else {
				const currentBagItems = cga.getInventoryItems().length
				if (lastBagItems < 20 && currentBagItems >= 20) {
					await Battle.tryStopRencounter();
				}
				lastBagItems = currentBagItems;
				const info = cga.GetPlayerInfo();
				if (info.health > 0 || info.souls > 0 || info.gold > maxGold) {
					await Battle.tryStopRencounter();
					await cga.emogua.waitForNormal();
					await cga.emogua.leaveTeam();
					break;
				}
			}
		}
	};

	return Battle;
})();
