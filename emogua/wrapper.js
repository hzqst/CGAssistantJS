/**
 * health 0 1-25(白) 26-50(黄) 51-75(粉) 76-100(红)
 * direction 0(右上)
 * 高速移动中不可丢东西
 * cga.ForceMove(direction, false); true 人物坐标移动 false 只发包服务器
 * cga.getMapObjects()
 *     [ { x: 199, y: 209, mapx: 199, mapy: 209, cell: 10 }] cell 10(地图出入口) 3(迷宫出入口)
 *
 * dialog options:
 *     0  : 列表选择 cga.ClickNPCDialog(-1, 6) 第二个参数选择列表序号，从0开始
 *     1  : 确定按钮 cga.ClickNPCDialog(1, -1)
 *     3  : 确定取消 cga.ClickNPCDialog(1, -1) 1确定 2取消
 *     12 : 是否按钮 cga.ClickNPCDialog(4, -1) 4是 8否
 *     32 : 下一步   cga.ClickNPCDialog(32, -1) 32下一步
 * cga.MoveItem(packageSlot.pos, i, -1);  -1 表示全部 >0 表示存入数量
 * cga.AsyncWaitMovement 等
 *     js native callback 会导致resolve promise时等待setTimeout|setInterval等任务执行一次，一次需要用setTimeout(resolve,0)提升优先级
 * cga.buildMapCollisionMatrix()
 *     matrix[y][x]
 * cga.GetWorldStatus
 *     9 平时 10 战斗 11 与服务器联机被切断
 * cga.GetGameStatus
 *     202 | 205  切图
 *     1 未知
 *     2 卡住战斗 4 战斗选择 5 战斗中 8 战斗结束一瞬间的状态 11 战斗切图，不能用来判断战斗，因为战斗中会有小瞬间是3空闲状态
 *     3 空闲
 * cga.ForceMoveTo(cga.GetMapXY().x, cga.GetMapXY().y, false);
 *     true | false 本人是否可见 false只有地图可见
 * cga.AsyncWaitChatMsg
 *     id=-1 系统消息
 * 装备栏顺序
 *     0 头 1 衣服 2 左手 3 右手 4 鞋 5 左饰品 6 右饰品 7 水晶
 * 物品类型
 *     0-6 武器 0 剑 1 斧 2 枪 3 杖 4 弓 5 小刀 6 回力
 *     7-14 防具
 *     23 料理 29 矿条 30 木 38 宝石 43 血瓶 34 蔬菜 35 其它食材 32 肉
 * cga.SayWords('', 0, 0, 0)
 *     内容
 *     颜色
 *     范围
 *     大小
 * cga.GetMoveSpeed()
 *     x 速度值
 *     y 速度值
 *     都为0表示静止中
 */
const PF = require('pathfinding');
const Professions = [
	{
		name: '暗黑骑士',
		titles: ['见习暗黑骑士', '暗黑骑士', '高阶暗黑骑士', '暗黑领主', '暗黑之魂', '漆黑之影'],
		category: '物理系'
	}, {
		name: '盗贼',
		titles: ['见习盗贼', '盗贼', '小偷', '欺诈师', '偷窃高手', '盗贼头目'],
		category: '物理系'
	}, {
		name: '格斗士',
		titles: ['见习格斗士', '格斗士', '格斗专家', '格斗家师范', '格斗王', '斗圣'],
		category: '物理系'
	}, {
		name: '弓箭手',
		titles: ['见习弓箭手', '弓箭手', '王宫弓箭手', '弓术师范', '弓术大师', '神射手'],
		category: '物理系'
	}, {
		name: '教团骑士',
		titles: ['见习教团骑士', '教团骑士', '高阶教团骑士', '圣骑士', '光明骑士', '仲裁者'],
		category: '物理系'
	}, {
		name: '骑士',
		titles: ['见习骑士', '骑士', '王宫骑士', '近卫骑士', '枪术大师', '枪圣'],
		category: '物理系'
	}, {
		name: '忍者',
		titles: ['初级忍者', '中级忍者', '上级忍者', '影', '忍术大师', '鬼'],
		category: '物理系'
	}, {
		name: '士兵',
		titles: ['见习士兵', '士兵', '王宫士兵', '士兵长', '重战士', '指挥官'],
		category: '物理系'
	}, {
		name: '舞者',
		titles: ['见习舞者', '串场艺人', '舞者', '超级巨星', '天王巨星', '舞圣'],
		category: '物理系'
	}, {
		name: '战斧斗士',
		titles: ['见习战斧斗士', '战斧斗士', '王宫战斧斗士', '战斧师范', '战斧大师', '斧圣'],
		category: '物理系'
	}, {
		name: '传教士',
		titles: ['见习传教士', '传教士', '牧师', '主教', '大主教', '圣使'],
		category: '魔法系'
	}, {
		name: '魔术师',
		titles: ['见习魔术师', '魔术师', '王宫魔术师', '魔导士', '大魔术师', '狂魔导师'],
		category: '魔法系'
	}, {
		name: '巫师',
		titles: ['见习巫师', '巫师', '王宫巫师', '巫术大师', '巫王', '幻之巫王'],
		category: '魔法系'
	}, {
		name: '咒术师',
		titles: ['见习咒术师', '咒术师', '王宫咒术师', '降头师', '咒术大师', '咒缚者'],
		category: '魔法系'
	}, {
		category: '宠物系',
		name: '封印师',
		titles: ['见习封印师', '封印师', '王宫封印师', '封印术师范', '封印大师', '召唤师']
	}, {
		category: '宠物系',
		name: '饲养师',
		titles: ['见习饲养师', '饲养师', '王宫饲养师', '高级饲养师', '饲养大师', '星之饲养师']
	}, {
		category: '宠物系',
		name: '驯兽师',
		titles: ['见习驯兽师', '驯兽师', '王宫驯兽师', '驯兽师范', '驯兽大师', '兽王']
	}, {
		category: '制造系',
		name: '裁缝工',
		titles: ['裁缝学徒', '裁缝工', '资深裁缝师傅', '御用裁缝师', '裁缝名师']
	}, {
		category: '制造系',
		name: '长袍工',
		titles: ['长袍学徒', '长袍工', '资深长袍师傅', '御用长袍师', '长袍名师']
	}, {
		ategory: '制造系',
		name: '厨师',
		titles: ['料理学徒', '厨师', '资深大厨师', '御用厨师', '料理达人']
	}, {
		category: '制造系',
		name: '铠甲工',
		titles: ['铠甲学徒', '铠甲工', '资深铠甲师傅', '御用铠甲师', '铠甲名师']
	}, {
		category: '制造系',
		name: '帽子工',
		titles: ['帽子学徒', '帽子工', '资深帽子师傅', '御用帽子师', '帽子名师']
	}, {
		category: '制造系',
		name: '头盔工',
		titles: ['头盔学徒', '头盔工', '资深头盔师傅', '御用头盔师', '头盔名师']
	}, {
		category: '制造系',
		name: '投掷武器工',
		titles: ['投掷武器学徒', '投掷武器工', '资深投掷武器师傅', '御用投掷武器师', '投掷武器名师']
	}, {
		category: '制造系',
		name: '小刀工',
		titles: ['小刀学徒', '小刀工', '资深小刀师傅', '御用小刀师', '小刀名师']
	}, {
		category: '制造系',
		name: '药剂师',
		titles: ['实习药剂师', '药剂师', '资深药剂大师', '御用药剂师', '炼金术士']
	}, {
		category: '制造系',
		name: '造盾工',
		titles: ['造盾学徒', '造盾工', '资深造盾师傅', '御用造盾师', '造盾名师']
	}, {
		category: '制造系',
		name: '造斧工',
		titles: ['造斧学徒', '造斧工', '资深造斧师傅', '御用造斧师', '造斧名师']
	}, {
		category: '制造系',
		name: '造弓工',
		titles: ['造弓学徒', '造弓工', '资深造弓师傅', '御用造弓师', '造弓名师']
	}, {
		category: '制造系',
		name: '造枪工',
		titles: ['造枪学徒', '造枪工', '资深造枪师傅', '御用造枪师', '造枪名师']
	}, {
		category: '制造系',
		name: '造杖工',
		titles: ['造杖学徒', '造杖工', '资深造杖师傅', '御用造杖师', '造杖名师']
	}, {
		category: '制造系',
		name: '制鞋工',
		titles: ['制鞋学徒', '制鞋工', '资深制鞋师傅', '御用制鞋师', '制鞋名师']
	}, {
		category: '制造系',
		name: '制靴工',
		titles: ['制靴学徒', '制靴工', '资深制靴师傅', '御用制靴师', '制靴名师']
	}, {
		category: '制造系',
		name: '铸剑工',
		titles: ['铸剑学徒', '铸剑工', '资深铸剑师傅', '御用铸剑师', '铸剑名师']
	}, {
		category: '服务系',
		name: '防具修理工',
		titles: ['防具修理学徒', '防具修理工', '资深防具修理师傅', '御用防具修理师傅', '修理防具专家']
	}, {
		category: '服务系',
		name: '护士',
		titles: ['见习护士', '护士', '资深护士', '护士长', '护理专家', '白衣天使']
	}, {
		category: '服务系',
		name: '鉴定师',
		titles: ['鉴定学徒', '鉴定士', '资深鉴定师傅', '御用鉴定师', '鉴定专家']
	}, {
		category: '服务系',
		name: '武器修理工',
		titles: ['武器修理学徒', '武器修理工', '资深武器修理师傅', '御用武器修理师傅', '修理武器专家']
	}, {
		category: '服务系',
		name: '仙人',
		titles: ['道童', '道士', '半仙', '仙人', '歌仙']
	}, {
		category: '服务系',
		name: '侦探',
		titles: ['见习侦探', '侦探', '名侦探', '大侦探', '超级侦探']
	}, {
		name: '医生',
		titles: ['见习医生','医生','资深医生','御医','超级医生','神医'],
		category: '服务系'
	}, {
		category: '采集系',
		name: '矿工',
		titles: ['见习矿工', '矿工', '资深矿工', '御用矿工', '超级矿工']
	}, {
		category: '采集系',
		name: '猎人',
		titles: ['见习猎人', '猎人', '资深猎人', '御用猎人', '超级猎人']
	}, {
		category: '采集系',
		name: '樵夫',
		titles: ['见习樵夫', '樵夫', '资深樵夫', '御用樵夫', '超级樵夫']
	}
];
const ProfessionsMap = (() => {
	let obj = {};
	Professions.forEach(p => p.titles.forEach(t => {
		obj[t] = p;
	}));
	return obj;
})();
const Reputations = [
	{
			name: "恶人",
			index: 0,
			min: null,
			max: -3000
	},
	{
			name: "受忌讳的人",
			index: 1,
			min: -2999,
			max: -2000
	},
	{
			name: "受挫折的人",
			index: 2,
			min: -1999,
			max: -1000
	},
	{
			name: "无名的旅人",
			index: 3,
			min: -999,
			max: 1999
	},
	{
			name: "路旁的落叶",
			index: 4,
			min: 2000,
			max: 4999
	},
	{
			name: "水面上的小草",
			index: 5,
			min: 5000,
			max: 9999
	},
	{
			name: "呢喃的歌声",
			index: 6,
			min: 10000,
			max: 19999
	},
	{
			name: "地上的月影",
			index: 7,
			min: 20000,
			max: 32999
	},
	{
			name: "奔跑的春风",
			index: 8,
			min: 33000,
			max: 49999
	},
	{
			name: "苍之风云",
			index: 9,
			min: 50000,
			max: 69999
	},
	{
			name: "摇曳的金星",
			index: 10,
			min: 70000,
			max: 99999
	},
	{
			name: "欢喜的慈雨",
			index: 11,
			min: 100000,
			max: 129999
	},
	{
			name: "蕴含的太阳",
			index: 12,
			min: 130000,
			max: 159999
	},
	{
			name: "敬畏的寂静",
			index: 13,
			min: 160000,
			max: 199999
	},
	{
			name: "无尽星空",
			index: 14,
			min: 200000,
			max: null
	}
];
module.exports = new Promise(resolve => {
	const cga = require('../cgaapi')(() => setTimeout(() => resolve(cga), 0));
}).then(cga => {
	cga.emogua = {};
	cga.emogua.shuffle = (arr) => {
		let i = arr.length;
		while (i) {
			let j = Math.floor(Math.random() * i--);
			[arr[j], arr[i]] = [arr[i], arr[j]];
		}
		return arr;
	};
	cga.emogua.isMoving = () => {
		const speed = cga.GetMoveSpeed();
		return !(speed && speed.x === 0 && speed.y === 0);
	};
	cga.emogua.getPlayerProfession = () => ProfessionsMap[cga.GetPlayerInfo().job];
	cga.emogua.getTeammates = () => cga.getTeamPlayers().filter(e => e.is_me !== true);
	cga.emogua.getTeamNumber = () => cga.emogua.getTeammates().length + 1;
	cga.emogua.getTeamLevel = () => {
		let level = cga.GetPlayerInfo().level;
		cga.emogua.getTeammates().forEach(e =>{
			if (e.level < level) level = e.level;
		});
		cga.GetPetsInfo().filter(e => e.battle_flags === 2).forEach(e =>{
			if (e.level < level) level = e.level;
		});
		return level;
	};
	cga.emogua.delay = (millis) => new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, millis);
	});
	// range 0 最大 1 最小格
	cga.emogua.sayWords = (words = '', color = 0, range = 1, size = 0) => {
		if (cga.isInNormalState()) {
			cga.SayWords(words, color, range, size);
			return true;
		}
		return false;
	}
	cga.emogua.recursion = (action) => {
		const result = action();
		return (result instanceof Promise) ? result.then(() => cga.emogua.recursion(action)).catch(e => {
			if (e) console.log(e);
		}) : (result === true ? cga.emogua.recursion(action) : Promise.resolve());
	};
	cga.emogua.waitUntil = (predict, interval) => {
		if (predict()) {
			return Promise.resolve();
		} else {
			return cga.emogua.delay(interval ? interval : 6000).then(
				() => cga.emogua.waitUntil(predict, interval)
			);
		}
	};
	cga.emogua.wait = (predict, timeout, interval) => {
		timeout = (typeof timeout == 'number') ? timeout : 6000;
		interval = (typeof interval == 'number') ? interval : 300;
		if (timeout <= 0) {
			return Promise.reject();
		} else {
			const prediction = predict();
			if (prediction) {
				return Promise.resolve();
			} else {
				return cga.emogua.delay(interval).then(
					() => cga.emogua.wait(predict, timeout - interval, interval)
				);
			}
		}
	};
	// destination '艾尔莎岛' || ['艾尔莎岛'] || [147, 189] || [147, 189, '艾尔莎岛']
	cga.emogua.waitDestination = (destination) => {
		if (destination) {
			if (typeof destination == 'string') {
				return cga.emogua.wait(() => destination == cga.GetMapName());
			} else if (destination instanceof Array) {
				if (typeof destination[0] == 'string') {
					return cga.emogua.wait(() => destination.indexOf(cga.GetMapName()) > -1);
				} else {
					return cga.emogua.wait(() =>
						cga.GetMapXY().x == destination[0] && cga.GetMapXY().y == destination[1] &&
						(!destination[2] || destination[2] == cga.GetMapName())
					);
				}
			}
		}
		return Promise.resolve();
	};
	// 等待战斗或者切图
	cga.emogua.waitAfterBattle = () => {
		if (cga.GetWorldStatus() == 10 || (cga.GetWorldStatus() == 9 && cga.GetGameStatus() != 3)) {
			return cga.emogua.delay(1000).then(cga.emogua.waitAfterBattle);
		}
		return Promise.resolve();
	};
	cga.emogua.waitMessage = (check, timeout) => new Promise((resolve, reject) => {
		cga.AsyncWaitChatMsg(chat => setTimeout(() => {
			const checkResult = check(chat);
			if (checkResult instanceof Promise) checkResult.then(resolve).catch(reject);
			else if (checkResult) resolve();
			else reject();
		}, 0), timeout ? timeout : 10000);
	});
	cga.emogua.waitMessageUntil = (check) => cga.emogua.waitMessage(check).catch(() => cga.emogua.waitMessageUntil(check));
	cga.emogua.logBack = () => cga.emogua.delay(1000).then(() => cga.LogBack()).then(
		() => cga.emogua.delay(2000)
	);
	cga.emogua.forceMove = (orientation, times = 1) => {
		if  (times > 0) {
			cga.ForceMove(orientation, true);
			return cga.emogua.delay(1000).then(() => cga.emogua.forceMove(orientation, times - 1));
		}
		return Promise.resolve();
	};
	/**
	 * target: [x, y, destination]
	 *     destination: 'map name' | [x, y] 切同图
	 * count
	 *     尝试计数, 方法内部使用
	 * return
	 *     Promise.reject(1) 1 切到了不认识的地图
	 */
	cga.emogua.walkTo = (target, count = 0, startMapIndex = cga.GetMapIndex().index3) => {
		const targetX = target[0];
		const targetY = target[1];
		const destination = target[2];
		cga.WalkTo(targetX, targetY);
		let battled = false;
		return cga.emogua.delay(100).then(
			() => cga.emogua.waitUntil(() => {
				if (cga.isInBattle()) battled = true;
				return cga.isInNormalState() && !cga.emogua.isMoving();
			}, 200)
		).then(
			() => {
				const p = cga.GetMapXY();
				if (startMapIndex == cga.GetMapIndex().index3) {
					if (
						(destination instanceof Array && p.x == destination[0] && p.y == destination[1]) ||
						(!destination && p.x == targetX && p.y == targetY)
					) {
						return true;
					}
				} else {
					if (
						(destination instanceof Array && p.x == destination[0] && p.y == destination[1]) ||
						(typeof destination == 'string' && (cga.GetMapName() == destination || destination == '*'))
					) {
						return true;
					} else {
						return Promise.reject(1);
					}
				}
				if (count < 20) {
					return cga.emogua.walkTo(target, battled ? count : count + 1, startMapIndex);
				} else {
					console.log('重新寻路target=' + JSON.stringify(target));
					return cga.emogua.autoWalk(target);
				}
			}
		);
	};
	// [ [x, y, destination] ]
	cga.emogua.walkList = (list) => {
		const recursion = (cursor) => {
			const target = list[cursor];
			if (target) {
				return cga.emogua.walkTo(target).then(
					() => recursion(cursor + 1)
				);
			} else {
				if (cursor >= list.length && cursor > 0) {
					const endTarget = list[list.length - 1];
					if (endTarget) {
						// 防止非切图或切同图或切图但未标明时，延迟防止遇敌回退
						const endDestination = endTarget[2];
						if (!endDestination || endDestination instanceof Array) {
							return cga.emogua.delay(2000).then(cga.emogua.waitAfterBattle)
							.then(() => {
								if (
									(cga.GetMapXY().x == endTarget[0] && cga.GetMapXY().y == endTarget[1]) ||
									(endDestination && cga.GetMapXY().x == endDestination[0] && cga.GetMapXY().y == endDestination[1])
								) {
									return Promise.resolve();
								} else {
									console.log('最后一步战斗回退');
									return recursion(list.length - 1);
								}
							});
						} else {
							return cga.emogua.delay(1000);
						}
					}
				}
				return Promise.resolve();
			}
		};
		return recursion(0);
	};
	cga.emogua.downloadMap = () => {
		const walls = cga.buildMapCollisionMatrix();
		return new Promise((resolve, reject) => {
			console.log('等待下载地图');
			cga.downloadMap(walls.x_size, walls.y_size, () => setTimeout(() => {
				console.log('地图下载完毕');
				resolve(cga.buildMapCollisionMatrix());
			}, 0));
		}).then(() => cga.emogua.delay(2000));
	};
	cga.emogua.autoWalk = (target, walls) => {
		const matrix = walls ? walls.matrix : cga.buildMapCollisionMatrix().matrix;
		cga.getMapObjects().filter(e => e.cell == 3).forEach(entry => {
			if (entry.x != target[0] || entry.y != target[1]) {
				matrix[entry.y][entry.x] = 1;
			}
		});
		const grid = new PF.Grid(matrix);
		const finder = new PF.AStarFinder({
			allowDiagonal: true,
			dontCrossCorners: true
		});
		let path = PF.Util.compressPath(finder.findPath(cga.GetMapXY().x, cga.GetMapXY().y, target[0], target[1], grid));
		if (path.length > 0) {
			path[path.length - 1].push(target[2]);
			return cga.emogua.walkList(path);
		}
		if (!walls) {
			return cga.emogua.downloadMap().then(w => cga.emogua.autoWalk(target, w));
		}
		return Promise.reject(`Can not find path to ${JSON.stringify(target)}`);
	};
	// [ [x, y, destination] ]
	cga.emogua.autoWalkList = (list) => {
		let result = Promise.resolve();
		list.forEach(t => {
			result = result.then(() => cga.emogua.autoWalk(t));
		});
		return result;
	};
	cga.emogua.walkRandomMaze = (walls, times = 3) => {
		const current = cga.GetMapXY();
		const target = cga.getMapObjects().filter(e => e.cell === 3 && (e.mapx != current.x || e.mapy != current.y)).sort((a, b) => {
			const distanceA = Math.abs(a.mapx - current.x) + Math.abs(a.mapy - current.y);
			const distanceB = Math.abs(b.mapx - current.x) + Math.abs(b.mapy - current.y);
			return distanceB - distanceA;
		}).shift();
		if (target) {
			return cga.emogua.autoWalk([target.mapx, target.mapy, '*'], walls ? walls : cga.buildMapCollisionMatrix()).then(
				() => cga.GetMapName()
			);
		} else if (times > 0) {
			return cga.emogua.downloadMap().then(w => cga.emogua.walkRandomMaze(w, times - 1));
		}
		return Promise.reject('Fail to walk random maze');
	};
	cga.emogua.walkRandomMazeUntil = (check) => cga.emogua.walkRandomMaze().then(map => {
		const checkResult = check(map);
		if (checkResult instanceof Promise) return checkResult;
		else if (checkResult) return Promise.resolve(map);
		return cga.emogua.walkRandomMazeUntil(check);
	});
	cga.emogua.turnOrientation = (orientation, destination) => {
		const current = cga.GetMapXY();
		switch (orientation) {
			case 0:
				cga.TurnTo(current.x + 2, current.y); break;
			case 1:
				cga.TurnTo(current.x + 2, current.y + 2); break;
			case 2:
				cga.TurnTo(current.x, current.y + 2); break;
			case 3:
				cga.TurnTo(current.x - 2, current.y + 2); break;
			case 4:
				cga.TurnTo(current.x - 2, current.y); break;
			case 5:
				cga.TurnTo(current.x - 2, current.y - 2); break;
			case 6:
				cga.TurnTo(current.x, current.y - 2); break;
			case 7:
				cga.TurnTo(current.x + 2, current.y - 2); break;
			default:
		}
		return cga.emogua.delay(1000).then(() => cga.emogua.waitDestination(destination));
	};
	cga.emogua.getOrientation = (x, y) => {
		const xy = Math.max(-1, Math.min(1, x - cga.GetMapXY().x)).toString() + Math.max(-1, Math.min(1, y - cga.GetMapXY().y)).toString();
		switch (xy) {
			case '10':
				return 0;
			case '11':
				return 1;
			case '01':
				return 2;
			case '-11':
				return 3;
			case '-10':
				return 4;
			case '-1-1':
				return 5;
			case '0-1':
				return 6;
			case '1-1':
				return 7;
			default:
		}
		return -1;
	}
	cga.emogua.turnTo = (x, y) => cga.emogua.turnOrientation(cga.emogua.getOrientation(x, y));
	// 是否选是
	cga.emogua.talkNpcSelectorYes = (dialog) => {
		if (dialog.options == 12) {
			cga.ClickNPCDialog(4, -1);
			return true;
		} else if (dialog.options == 32) {
			cga.ClickNPCDialog(32, -1);
			return true;
		} else if (dialog.options == 1) {
			cga.ClickNPCDialog(1, -1);
			return true;
		} else if (dialog.options == 3) {
			cga.ClickNPCDialog(1, -1);
			return true;
		}
	};
	// 是否选否
	cga.emogua.talkNpcSelectorNo = (dialog) => {
		if (dialog.options == 12) {
			cga.ClickNPCDialog(8, -1);
			return true;
		} else if (dialog.options == 32) {
			cga.ClickNPCDialog(32, -1);
			return true;
		} else if (dialog.options == 1) {
			cga.ClickNPCDialog(1, -1);
			return true;
		} else if (dialog.options == 3) {
			cga.ClickNPCDialog(1, -1);
			return true;
		}
	};
	cga.emogua.talkNpc = function(x, y, select, dest) {
		let selector, orientation, targetx, targety, destination;
		for (let i = 0; i < arguments.length; i++) {
			switch (typeof arguments[i]) {
				case 'function':
					selector = arguments[i]; break;
				case 'number':
					if (!orientation) {
						orientation = arguments[i];
						targetx = arguments[i];
					} else {
						targety = arguments[i];
					}
					break;
				case 'object':
					if (arguments[i] instanceof Array) destination = arguments[i];
					break;
				case 'string':
					destination = arguments[i];
					break;
			}
		}
		if (targety >= 0) {
			orientation = cga.emogua.getOrientation(targetx, targety);
		}
		if (selector) {
			const result = new Promise((resolve, reject) => {
				cga.AsyncWaitNPCDialog(dialog => setTimeout(() => {
					if (typeof dialog.type == 'number') {
						let selectResult = selector(dialog);
						(
							selectResult instanceof Promise ? selectResult : (selectResult === true ? Promise.resolve() : Promise.reject())
						).then(
							() => cga.emogua.talkNpc(selector, destination)
						).then(resolve).catch(resolve);
					} else {
						cga.emogua.waitDestination(destination).then(resolve).catch(resolve);
					}
				}, 0), 2000);
				if (orientation >= 0) cga.emogua.turnOrientation(orientation);
			});
			return result;
		} else {
			return Promise.reject();
		}
	};
	// stones: {C1: [27, 82, '里谢里雅堡']}
	cga.emogua.getCurrentStoneName = (stones) => {
		for (let i in stones) {
			const position = stones[i];
			if (position[0] == cga.GetMapXY().x && position[1] == cga.GetMapXY().y && (!position[2] || position[2] == cga.GetMapName())) {
				return i;
			}
		}
	};
	cga.emogua.falan = {
		stones: {
			C: [27, 82, '里谢里雅堡'],
			E1: [242, 100, '法兰城'],
			S1: [141, 148, '法兰城'],
			W1: [63, 79, '法兰城'],
			M1: [46, 16, '市场三楼 - 修理专区'],
			E2: [233, 78, '法兰城'],
			S2: [162, 130, '法兰城'],
			W2: [72, 123, '法兰城'],
			M2: [46, 16, '市场一楼 - 宠物交易区']
		}
	};
	cga.emogua.falan.toStone = (stone) => new Promise((resolve, reject) => {
		cga.travel.falan.toStone(stone, (r) => setTimeout(() => {
			if (r) resolve();
			else reject();
		}, 0));
	});
	cga.emogua.falan.toWestHospital = () => new Promise((resolve, reject) => {
		cga.travel.falan.toWestHospital(r => setTimeout(() => {
			if (r) resolve();
			else reject();
		}, 0));
	});
	cga.emogua.falan.toCastleClock = () => new Promise((resolve, reject) => {
		cga.travel.falan.toCastleClock(r => setTimeout(() => {
			if (r) resolve();
			else reject();
		}, 0));
	}).then(() => cga.emogua.delay(1000));
	cga.emogua.falan.toBank = () => new Promise((resolve, reject) => {
		cga.travel.falan.toBank(r => setTimeout(() => {
			if (r) resolve();
			else reject();
		}, 0));
	}).then(() => cga.emogua.delay(2000));
	cga.emogua.falan.toFabricStore = () => new Promise((resolve, reject) => {
		cga.travel.falan.toFabricStore(r => setTimeout(() => {
			if (r) resolve();
			else reject();
		}, 0));
	}).then(
		() => cga.emogua.walkList([[8,7]])
	);
	cga.emogua.falan.toKatie = () => cga.emogua.falan.toStone('E1').then(
		() => cga.emogua.autoWalkList([
			[196,78,'凯蒂夫人的店'],
			[15,12]
		])
	);
	cga.emogua.falan.toWeiNuoYa = () => new Promise((resolve, reject) => {
		cga.travel.falan.toWeiNuoYa(r => setTimeout(() => {
			if (r) resolve();
			else reject(r);
		}, 0));
	});
	cga.emogua.falan.toJiaNa = () => new Promise((resolve, reject) => {
		cga.travel.falan.toJiaNaCun(r => setTimeout(() => {
			if (r) resolve();
			else reject(r);
		}, 0));
	});
	cga.emogua.falan.toYaliute = () => new Promise((resolve, reject) => {
		cga.travel.falan.toYaliute(r => setTimeout(() => {
			if (r) resolve();
			else reject(r);
		}, 0));
	});
	cga.emogua.falan.toCamp = () => cga.GetMapName() == '圣骑士营地' ? Promise.resolve() : cga.emogua.falan.toStone('E1').then(
		() => cga.emogua.autoWalkList([
			[281,88,'芙蕾雅'],
			[513,282,'曙光骑士团营地'],
			[55,47,'辛希亚探索指挥部'],
			[7,4,[91, 6]],
			[95,9,[19, 28]],
			[8,21]
		]).then(() => cga.emogua.turnOrientation(4, '圣骑士营地'))
	);
	cga.emogua.newisland = {
		stones: {
			X: [140, 105, '艾尔莎岛'],
			A: [158, 94, '艾尔莎岛'],
			B: [84, 112, '艾夏岛'],
			C: [164, 159, '艾夏岛'],
			D: [151, 97, '艾夏岛'],
			E: [165, 153, '艾尔莎岛']
		}
	};
	cga.emogua.newisland.toStone = (stone) => new Promise((resolve, reject) => {
		cga.travel.newisland.toStone(stone, (r) => {
			if (r) resolve();
			else reject();
		});
	});
	cga.emogua.dropItem = (position) => {
		if (cga.isInNormalState() && !cga.emogua.isMoving()) cga.DropItem(position);
		return cga.emogua.delay(500);
	};
	cga.emogua.useItem = (position) => {
		if (position) cga.UseItem(position);
		return cga.emogua.delay(500);
	}
	cga.emogua.getEmptyBagIndex = () => {
		const itemIndexes = cga.getInventoryItems().map(e => e.pos);
		for (let bagIndex = 8; bagIndex < 28; bagIndex++) {
			if (itemIndexes.indexOf(bagIndex) < 0) return bagIndex;
		}
		return -1;
	};
	/**
	 * filter
	 *     name
	 *     i => boolean
	 * 返回
	 *     true 银行已没有指定物品
	 */
	cga.emogua.getFromBank = (filter) => {
		const bankList = cga.GetBankItemsInfo().filter(e => {
			if (typeof filter == 'string') return e.name == filter;
			else if (typeof filter == 'function') return filter(e);
			else return !filter;
		});
		const items = cga.getInventoryItems();
		let bankListIndex = 0;
		let result = Promise.resolve();
		if (bankList.length > 0) {
			for (let bagIndex = 8; bagIndex < 28; bagIndex++) {
				if (items.findIndex(e => e.pos == bagIndex) < 0) {
					if (bankListIndex < bankList.length) {
						const bankPos = bankList[bankListIndex].pos;
						result = result.then(
							() => cga.MoveItem(bankPos, bagIndex, -1)
						).then(
							() => cga.emogua.delay(300)
						);
						bankListIndex++;
					} else break;
				}
			}
		}
		return result.then(() => bankListIndex >= bankList.length);
	};
	/**
	 * list
	 *     [[name | matcher, groupCount]]
	 *     可存到可叠加物品上，比如水晶碎片
	 * size
	 *     银行大小  默认20
	 * 返回
	 *     true 银行已满
	 */
	cga.emogua.saveToBank = (list, size) => {
		const bankList = cga.GetBankItemsInfo();
		const bankMax = 99 + (size ? size : 20);
		const isSavable = (slot) => {
			return list && list.findIndex(e => {
				if (typeof e[0] == 'string') return e[0] == slot.name && slot.count > 0 && slot.count < e[1];
				else if (typeof e[0] == 'function') return e[0](slot) && slot.count > 0 && slot.count < e[1];
				else return false;
			}) > -1;
		};

		const items = cga.getInventoryItems().filter(item =>
			!list ||
			list.findIndex(e => {
				if (typeof e[0] == 'string') return e[0] == item.name;
				else if (typeof e[0] == 'function') return e[0](item);
				else return false;
			}) > -1
		);
		let result = Promise.resolve();
		let itemIndex = 0;
		if (items.length > 0) {
			for (let bankSlotIndex = 100; bankSlotIndex <= bankMax; bankSlotIndex++) {
				const slot = bankList.find(e => e.pos == bankSlotIndex);
				if ((!slot || isSavable(slot)) && itemIndex < items.length) {
					const currentItemPos = items[itemIndex].pos;
					result = result.then(
						() => Promise.resolve(cga.MoveItem(currentItemPos, bankSlotIndex, -1))
					).then(
						() => cga.emogua.delay(300)
					);
					itemIndex ++;
				} else if (itemIndex >= items.length) break;
			}
		}
		return result.then(
				() => cga.emogua.delay(1000)
			).then(() => cga.GetBankItemsInfo().length >= (bankMax - 99));
	};
	/**
	 * stuff
	 *     {
	 *         itemFilter: result [{'itemid': 12345, 'itempos':第几格物品, 'count': 1}],
	 *         petFilter:  result [petId]
	 *         amount: 0
	 *     }
	 * checkParty(type, args)
	 *     type=1 物品，2 宠物，4 金币
	 *     args 对方放入的物品
	 */
	cga.emogua.tradeInternal = (stuff, checkParty, resolve, playerName) => {
		cga.AsyncWaitTradeDialog((partyName, partyLevel) => setTimeout(() => {
			if (partyLevel > 0) {
				let getInTradeStuffs = false;
				let receivedStuffs;
				const waitTradeState = () => {
					cga.AsyncWaitTradeState((state) => setTimeout(() => {
						if (state == cga.TRADE_STATE_READY) {
							if (!getInTradeStuffs) cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
							waitTradeState();
						} else if (state == cga.TRADE_STATE_SUCCEED || state == cga.TRADE_STATE_CANCEL) {
							resolve({
								success: (state == cga.TRADE_STATE_SUCCEED),
								received: receivedStuffs
							});
						} else if (state == cga.TRADE_STATE_CONFIRM) {
							waitTradeState();
						} else {
							cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
							resolve({success: false});
						}
					}, 0), 10000);
				};
				waitTradeState();
				cga.AsyncWaitTradeStuffs((type, args) => setTimeout(() => {
					getInTradeStuffs = true;
					if (args) {
						if (!checkParty || checkParty(playerName ? playerName : partyName, type, args)) {
							receivedStuffs = args;
							cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
						} else {
							cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
						}
					}
				}, 0), 10000);
				const itemFilter = (stuff && typeof stuff.itemFilter == 'function') ? stuff.itemFilter : () => false;
				const petFilter = (stuff && typeof stuff.petFilter == 'function') ? stuff.petFilter : () => false;
				const tradeItems = cga.getInventoryItems().filter(itemFilter).map(e => {
					return {itemid: e.itemid, itempos: e.pos, count: (e.count > 1 ? e.count : 1)};
				});
				cga.TradeAddStuffs(
					tradeItems,
					cga.GetPetsInfo().filter(petFilter).map(p => p.index),
					(stuff && stuff.amount) ? stuff.amount : 0
				);
			} else {
				cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
				resolve({success: false});
			}
		}, 0), 10000);
	};
	cga.emogua.trade = (name, stuff, checkParty) => new Promise((resolve, reject) => {
		cga.AsyncWaitPlayerMenu(players => setTimeout(() => {
			if (!(players instanceof Array)) players = [];
			var player = players.find((e, index) => typeof name == 'number' ? index == name : e.name == name);
			if (player) {
				cga.emogua.tradeInternal(stuff, checkParty, resolve, name);
				cga.PlayerMenuSelect(player.index);
			} else resolve({success: false});
		}, 0), 3000);
		cga.DoRequest(cga.REQUEST_TYPE_TRADE);
	}).then(result => cga.emogua.delay(500).then(() => result));
	cga.emogua.waitTrade = (stuff, checkParty) => new Promise((resolve, reject) => {
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true)
		cga.emogua.tradeInternal(stuff, checkParty, resolve);
	}).then(result => {
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false)
		return cga.emogua.delay(500).then(() => result);
	});
	cga.emogua.getNearEntry = (target) => {
		return cga.getMapObjects().filter(e => e.cell === 3 || e.cell === 10).sort((a, b) => {
			const distanceA = Math.abs(a.mapx - target.x) + Math.abs(a.mapy - target.y);
			const distanceB = Math.abs(b.mapx - target.x) + Math.abs(b.mapy - target.y);
			return distanceA - distanceB;
		}).shift();
	};
	// target: {x: 0, y: 0}
	cga.emogua.getMovablePositionAround = (target) => {
		const walls = cga.buildMapCollisionMatrix();
		const entries = cga.getMapObjects().filter(e => e.cell === 3 || e.cell === 10);
		const isPositionMovable = (x, y) => {
			return walls.matrix[y][x] == 0 && entries.findIndex(e => e.mapx == x && e.mapy == y) < 0;
		};
		if (isPositionMovable(target.x + 1, target.y)) {
			return {
				orientation: 0,
				x: target.x + 1,
				y: target.y
			};
		} else if (isPositionMovable(target.x - 1, target.y)) {
			return {
				orientation: 4,
				x: target.x - 1,
				y: target.y
			};
		} else if (isPositionMovable(target.x, target.y + 1)) {
			return {
				orientation: 2,
				x: target.x,
				y: target.y + 1
			};
		} else if (isPositionMovable(target.x, target.y - 1)) {
			return {
				orientation: 6,
				x: target.x,
				y: target.y - 1
			};
		}
		return;
	};
	let encounterStopped = true;
	cga.emogua.checkStopEncounter = (protect, talk = false) => {
		const playerInfo = cga.GetPlayerInfo();
		const pets = cga.GetPetsInfo();
		const minHp = (protect && protect.minHp) ? protect.minHp : 100;
		const minMp = (protect && protect.minMp) ? protect.minMp : 60;
		const minPetHp = (protect && protect.minPetHp) ? protect.minPetHp : 100;
		const minPetMp = (protect && protect.minPetMp) ? protect.minPetMp : 0;
		const maxPetNumber = (protect && protect.maxPetNumber) ? protect.maxPetNumber : 5;
		const maxItemNumber = (protect && protect.maxItemNumber) ? protect.maxItemNumber : 20;
		// cga.emogua.getTeammates().findIndex(t => t.hp < minHp || t.mp < minMp) > -1
		if (
			playerInfo.hp < minHp || playerInfo.mp < minMp ||
			cga.getInventoryItems().length > maxItemNumber ||
			pets.length > maxPetNumber ||
			pets.filter(e => e.battle_flags == 2).findIndex(p => p.hp < minPetHp || p.mp < minPetMp) > -1
		) {
			if (talk) {
				cga.emogua.sayWords('触发战斗保护');
			}
			return true;
		}
		return false;
	};
	cga.emogua.encounter = (protect) => {
		if (!encounterStopped) return Promise.reject('repeated encounter');
		else return cga.emogua.delay(1000).then(() => {
			encounterStopped = false;
			let stopEncounter = false;
			const mapName = cga.GetMapName();
			const protectRecursion = () => cga.emogua.delay(2000).then(() => {
				if (stopEncounter) {
					return Promise.reject();
				} else {
					const minTeamNumber = (protect && protect.minTeamNumber) ? protect.minTeamNumber : 1;
					if (
						cga.emogua.checkStopEncounter(protect) ||
						cga.emogua.getTeamNumber() < minTeamNumber ||
						mapName != cga.GetMapName()
					) {
						stopEncounter = true;
						return Promise.reject();
					}
					return Promise.resolve();
				}
			}).then(() => protectRecursion());
			const entries = cga.getMapObjects().filter(e => e.cell === 3 || e.cell === 10);
			const start = () => {
				const startPosition = cga.GetMapXY();
				const movePosition = cga.emogua.getMovablePositionAround(startPosition);
				const recursion = (direction) => {
					if (cga.isInNormalState()) {
						cga.ForceMove(direction, false);
					}
					return cga.emogua.delay(100).then(() => {
						if (stopEncounter) return Promise.reject();
						else if (!cga.isInNormalState()) {
							return cga.emogua.waitAfterBattle().then(() =>
								(cga.GetMapXY().x == startPosition.x && cga.GetMapXY().y == startPosition.y) ? recursion(movePosition.orientation) : recursion(cga.emogua.getOrientation(startPosition.x, startPosition.y))
							);
						}
						else return recursion((direction + 4) % 8);
					});
				};
				if (movePosition) {
					protectRecursion().catch(() => console.log('触发保护'));
					cga.emogua.waitMessageUntil((chat) => {
						if (chat && chat.msg && chat.msg.indexOf('触发战斗保护') >= 0) {
							return stopEncounter = true;
						}
					});
					return recursion(movePosition.orientation).catch(() => {
						console.log('已停止遇敌');
						return cga.emogua.delay(2000).then(
							() => cga.emogua.waitAfterBattle()
						).then(
							() => cga.emogua.delay(5000)
						).then(
							() => encounterStopped = true
						);
					});
				}
				return Promise.reject('无法遇敌');
			};
			if (entries.findIndex(e => e.mapx == cga.GetMapXY().x && e.mapy == cga.GetMapXY().y) >= 0) {
				let position = cga.emogua.getMovablePositionAround(cga.GetMapXY());
				if (position) return cga.emogua.waitAfterBattle().then(
					() => cga.emogua.walkList([[position.x, position.y]])
				).then(
					() => start()
				);
				return Promise.reject('无法遇敌');
			} else {
				return start();
			}
		});
	};
	cga.emogua.joinTeam = (x, y, name) => {
		return new Promise((resolve, reject) => {
			if (cga.getTeamPlayers().length <= 1) {
				const captain = cga.GetMapUnits().find(e => e.type === 8 && e.unit_name === name);
				if (captain && captain.xpos === x && captain.ypos === y) {
					cga.emogua.turnTo(x, y).then(() => cga.emogua.delay(1000)).then(() => {
						cga.AsyncWaitNPCDialog((teamDialog) => setTimeout(() => {
							const resultAction = () => {
								if (cga.getTeamPlayers().length > 1) resolve();
								else reject();
							};
							if (teamDialog.type === 2) {
								cga.ClickNPCDialog(0, teamDialog.message.split('\n').findIndex(e => e === name) - 2);
								setTimeout(resultAction, 1000);
							} else resultAction();
						}, 0), 3000);
						cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM);
					});
				} else reject();
			} else resolve();
		});
	};
	cga.emogua.leaveTeam = () => {
		cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
		return cga.emogua.delay(1000);
	}
	cga.emogua.waitTeamBlock = (total) => {
		return cga.emogua.delay(5000).then(() => {
			if (total <= 1 || cga.getTeamPlayers().length >= total) {
				console.log(`组队已满(${total})`);
				return Promise.resolve();
			} else {
				console.log(`等待组队满人数(${total})...`);
				return cga.emogua.waitTeamBlock(total);
			}
		});
	};
	cga.emogua.joinTeamBlock = (x, y, name) => cga.emogua.delay(5000).then(() => {
		console.log(`尝试加入(${name})的队伍...`);
		return cga.emogua.joinTeam(x, y, name).catch(() => cga.emogua.joinTeamBlock(x, y, name));
	});
	cga.emogua.assessRepairFromNpc = function(x, y, filter) {
		if (typeof y == 'function') {
			filter = y;
			y = null;
		}
		return cga.emogua.talkNpc(x, y, dialog => {
			if (dialog.type == 20 || dialog.type == 22) {
				const assessList = cga.getInventoryItems().filter(filter).map(e => {
					return {itempos: e.pos, itemid: e.itemid, count: 1};
				});
				if (assessList.length > 0) cga.SellNPCStore(assessList);
			}
		}).then(() => cga.emogua.delay(2000));
	};
	// list: [{index: 0, count: 20}]
	cga.emogua.exchange = function(x, y, list) {
		if (y instanceof Array) {
			list = y;
			y = null;
		}
		if (list && list.length > 0) return cga.emogua.talkNpc(x, y, dialog => {
			if (dialog.type == 27) {
				cga.ClickNPCDialog(-1, 0);
				return true;
			}
			if (dialog.type == 28) {
				cga.BuyNPCStore(list);
			}
		}).then(() => cga.emogua.delay(1000));
		else return Promise.resolve();
	};
	// list: [{index: 0, count: 20}]
	cga.emogua.buy = function(x, y, list) {
		if (y instanceof Array) {
			list = y;
			y = null;
		}
		if (list && list.length > 0) return cga.emogua.talkNpc(x, y, dialog => {
			if (dialog.type == 5) {
				cga.ClickNPCDialog(-1, 0);
				return true;
			}
			if (dialog.type == 6) {
				cga.BuyNPCStore(list);
			}
		}).then(() => cga.emogua.delay(1000));
		else return Promise.resolve();
	};
	cga.emogua.sell = function(x, y, filter) {
		if (typeof y == 'function') {
			filter = y;
			y = null;
		}
		if (!filter) filter = (e) => e.name == '魔石' || e.name.indexOf('卡片') > -1;
		return cga.emogua.talkNpc(x, y, dialog => {
			if (dialog.type == 5) {
				cga.ClickNPCDialog(-1, dialog.message.charAt(dialog.message.length - 1) == '3' ? 1 : 0);
				return true;
			}
			if (dialog.type == 7) {
				const sellList = cga.getInventoryItems().filter(filter).map(e => {
					let sellCount = (e.count < 1) ? 1 : e.count;
					if ([30, 34, 35].indexOf(e.type) >= 0) {
						sellCount = parseInt(e.count / 20);
					} else if ([43, 23].indexOf(e.type) >= 0) {
						sellCount = parseInt(e.count / 3);
					}
					return {itempos: e.pos, itemid: e.itemid, count: sellCount};
				});
				if (sellList.length > 0) cga.SellNPCStore(sellList);
			}
		}).then(() => cga.emogua.delay(2000));
	};
	cga.emogua.waitWorkResult = (timeout) => new Promise((resolve, reject) => {
		cga.AsyncWaitWorkingResult(r => setTimeout(() => resolve(r), 0), (timeout ? timeout : 45000));
	});
	let craftOnce = false;
	cga.emogua.craft = (name) => {
		const requireInfo = cga.getItemCraftInfo(name);
		if (requireInfo) {
			const findJewel = ['制药', '料理'].indexOf(requireInfo.skill.name) < 0;
			const materials = requireInfo.craft.materials;
			let jewelPosition = -1;
			for (const i of cga.getInventoryItems()) {
				if (findJewel && i.type == 38 && i.assessed && jewelPosition < 8)  jewelPosition = i.pos;
				const neededMaterials = materials.filter(m => !m.position);
				if (neededMaterials.length > 0) {
					const neededMaterial = neededMaterials.find(m => m.name == i.name && m.count <= i.count);
					if (neededMaterial) neededMaterial.position = i.pos;
				} else if (!findJewel || jewelPosition > 0) break;
			}
			if (materials.filter(m => !m.position).length == 0) {
				const positions = [0,0,0,0,0,0];
				materials.forEach((m, index) => {
					positions[index] = m.position;
				});
				if (jewelPosition > 0) positions[5] = jewelPosition;
				cga.SetImmediateDoneWork(craftOnce);
				cga.StartWork(requireInfo.skill.index, requireInfo.craft.index);
				cga.CraftItem(requireInfo.skill.index, requireInfo.craft.index, 0, positions);
				return cga.emogua.waitWorkResult().then(r => {
					if (r && r.success === true) {
						craftOnce = true;
					}
					return cga.emogua.delay(500);
				}).then(() => cga.emogua.craft(name));
			}
		}
		return Promise.resolve();
	};
	cga.emogua.getDurability = (item) => {
		if (item && item.attr) {
			const matchResult = /耐久 (\d+)\/(\d+)/.exec(item.attr);
			if (matchResult.length == 3) {
				const current = parseInt(matchResult[1]);
				const max = parseInt(matchResult[2]);
				if (current > 0 && max > 0) {
					return {
						current: current,
						max: max,
						rate: current/max
					};
				}
			}
		}
		return;
	};
	let assessOnce = false;
	cga.emogua.assessAll = () => {
		const skill = cga.GetSkillsInfo().find(e => e.name == '鉴定');
		let result = Promise.resolve();
		if (skill) {
			cga.getInventoryItems().filter(i => !i.assessed && i.level <= skill.lv).forEach(item => {
				result = result.then(() => cga.emogua.recursion(() => {
					cga.SetImmediateDoneWork(assessOnce);
					cga.StartWork(skill.index, 0);
					if (cga.GetPlayerInfo().mp >= (item.level * 10) && cga.AssessItem(skill.index, item.pos)) {
						return cga.emogua.waitWorkResult().then(r => {
							if (r && r.success === true) {
								assessOnce = true;
								return Promise.reject();
							}
							return Promise.resolve();
						});
					}
					return Promise.reject();
				})).then(() => cga.emogua.delay(200));
			});
		}
		return result.then(() => cga.emogua.delay(500));
	};
	let repairOnce = false;
	cga.emogua.repairAll = () => {
		const skill = cga.GetSkillsInfo().filter(e => e.name.indexOf('修理') >= 0).sort((e1, e2) => e2.lv - e1.lv)[0];

		let result = Promise.resolve();
		if (skill) {
			cga.getInventoryItems().filter(eq => {
				if (
					(
						(skill.name == '修理武器' && eq.type >= 0 && eq.type <= 6) ||
						(skill.name == '修理防具' && eq.type >= 7 && eq.type <= 14)
					) && eq.level <= skill.lv
				) {
					const durability = cga.emogua.getDurability(eq);
					return durability && durability.current < durability.max;
				}
				return false;
			}).forEach(item => result = result.then(() =>
				cga.emogua.recursion(() => {
					cga.SetImmediateDoneWork(repairOnce);
					cga.StartWork(skill.index, 0);

					if (cga.GetPlayerInfo().mp >= (item.level * 10) && cga.AssessItem(skill.index, item.pos)) {
						return cga.emogua.waitWorkResult().then(r => {
							if (r && r.success === true) {
								repairOnce = true;
								return Promise.reject();
							}
							return Promise.resolve();
						});
					}
					return Promise.reject();
				}).then(() => cga.emogua.delay(200))
			));
		}
		return result.then(() => cga.emogua.delay(500));
	};
	cga.emogua.recharge = (orientation) => {
		return cga.emogua.turnOrientation(orientation).then(() => cga.emogua.delay(5000));
	};
	cga.emogua.healTeammate = () => new Promise((resolve, reject) => {
		const skill = cga.GetSkillsInfo().find(s => s.name == '治疗');
		const requireMp = 25 + skill.lv * 5;
		const needHealTeammate = cga.getTeamPlayers().find(p => p.injury > 0);
		if (needHealTeammate && skill && cga.GetPlayerInfo().mp >= requireMp) {
			cga.StartWork(skill.index, skill.lv-1);
			cga.AsyncWaitPlayerMenu(players => setTimeout(() => {
				if (players && players.length > 0) {
					const index = players.findIndex(p => p.name == needHealTeammate.name);
					if (typeof index == 'number') {
						cga.PlayerMenuSelect(index);
						cga.AsyncWaitUnitMenu(units => setTimeout(() => {
							cga.UnitMenuSelect(0);
							cga.AsyncWaitWorkingResult(r => setTimeout(resolve, 0));
						}, 0));
					} else resolve();
				} else resolve();
			}, 0), 2000);
		} else resolve();
	});
	cga.emogua.useCrystal = (name) => {
		const found = cga.GetItemsInfo().find(e => {
			return e.type == 22 && e.name == name && cga.emogua.getDurability(e).current > 1;
		});
		if (found) {
			if (found.pos > 7) {
				return cga.emogua.useItem(found.pos);
			}
		} else {
			let crystalStoreIndex = 0;
			if (name == '地水的水晶（5：5）') crystalStoreIndex = 9;
			else if (name == '水火的水晶（5：5）') crystalStoreIndex = 10;
			else if (name == '火风的水晶（5：5）') crystalStoreIndex = 11;
			else if (name == '风地的水晶（5：5）') crystalStoreIndex = 12;
			if (crystalStoreIndex > 0) {
				return cga.emogua.falan.toStone('W1').then(
					() => cga.emogua.walkList([
						[66,84],
						[82,84],
						[90,84],
						[92,78],
						[94,78,'达美姊妹的店'],
						[12,15],
						[17,18]
					])
				).then(
					() => cga.emogua.buy(0, [{index: crystalStoreIndex, count: 1}])
				).then(
					() => cga.emogua.delay(500)
				).then(
					() => cga.emogua.useCrystal(name)
				);
			}
		}
		return Promise.resolve();
	};
	/**
	 * options
	 *     {
	 *         sellFilter: function | false
	 *         rechargeFlag: -1 不补血魔
	 *         repairFlag: 1 正常 2 全部 -1 not
	 *         crystalName: ''
	 *     }
	 */
	cga.emogua.prepare = (options) => {
		options = options ? options : {};
		const validMaps = ['法兰城', '里谢里雅堡', '艾尔莎岛'];
		const playerInfo = cga.GetPlayerInfo();

		const crystal = () => {
			if (options && options.crystalName) return cga.emogua.useCrystal(options.crystalName);
			return Promise.resolve();
		};
		const sell = () => {
			const filter = (item) => {
				if (item.name == '魔石' || item.name.indexOf('卡片') >= 0) return true;
				else if (item.type >= 0 && item.type <= 14 && item.level <= 10) {
					const durability = cga.emogua.getDurability(item);
					return durability && durability.current == durability.max && durability.current <= 30;
				} else if (options && typeof options.sellFilter == 'function') {
					return options.sellFilter(item);
				}
				return false;
			};
			if (typeof options.sellFilter != 'boolean' && cga.getInventoryItems().filter(filter).length > 0) {
				return cga.emogua.falan.toStone('S2').then(
					() => cga.emogua.walkTo([156, 123])
				).then(
					() => cga.emogua.sell(6, filter)
				).then(cga.emogua.logBack);
			} else return Promise.resolve();
		};
		const repair = () => {
			const repairFlag = (options && typeof options.repairFlag == 'number') ? options.repairFlag : 1;
			const needRepairChecker = (eq) => {
				if (eq.type >= 0 && eq.type <= 14 && eq.level <= 10) {
					const durability = cga.emogua.getDurability(eq);
					return durability &&
						(
							durability.rate < 0.75 ||
							(durability.current < durability.max && durability.current <= 30) ||
							(repairFlag == 2 && durability.rate < 1)
						)
					;
				}
				return false;
			};
			if (repairFlag > 0 && cga.GetItemsInfo().findIndex(needRepairChecker) >= 0 && cga.getInventoryItems().length < 20) {
				return cga.emogua.falan.toStone('E1').then(
					() => cga.emogua.turnOrientation(0, '市场三楼 - 修理专区')
				).then(
					() => cga.emogua.autoWalk([82, 8])
				).then(
					() => cga.emogua.turnOrientation(2)
				).then(() => cga.emogua.recursion(() => {
					let item = cga.getInventoryItems().find(needRepairChecker);
					if (item) {
						let words;
						if (item.type >= 0 && item.type <= 6) words = '修理武器';
						else if (item.type >= 7 && item.type <= 14) words = '修理防具';
						if (words) {
							const tradePromise = cga.emogua.waitTrade({
								itemFilter: eq => eq.pos == item.pos
							}).then(tradeResult => {
								if (tradeResult && tradeResult.success === true) {
									return cga.emogua.recursion(() => cga.emogua.waitTrade().then(
										(backResult) => (backResult && backResult.success === true) ? Promise.reject() : Promise.resolve()
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
							const emptyIndex = cga.emogua.getEmptyBagIndex();
							if (emptyIndex > 7) {
								return Promise.resolve(cga.MoveItem(item.pos, emptyIndex, -1)).then(
									() => cga.emogua.delay(300)
								);
							}
						}
					}
				})).then(() => {
					let result = Promise.resolve();
					cga.getInventoryItems().filter(eq => {
						if (eq.type >= 0 && eq.type <= 14 && eq.level <= 10) {
							const durability = cga.emogua.getDurability(eq);
							return durability && durability.current > 30;
						}
						return false;
					}).forEach(item => {
						result = result.then(() => cga.emogua.useItem(item.pos));
					});
					return result;
				}).then(cga.emogua.logBack).then(sell);
			} else return Promise.resolve();
		};
		const recharge = () => {
			const rechargeFlag = typeof options.rechargeFlag == 'number' ? options.rechargeFlag : 1;
			if (rechargeFlag > 0 && (playerInfo.hp < playerInfo.maxhp || playerInfo.mp < playerInfo.maxmp)) {
				return cga.emogua.falan.toWestHospital().then(() => {
					let go = Promise.resolve();
					if (cga.emogua.getPlayerProfession() && ['物理系','魔法系','宠物系'].indexOf(cga.emogua.getPlayerProfession().category) >= 0) {
						go = go.then(
							() => cga.emogua.walkTo([8, 32])
						).then(
							() => cga.emogua.recharge(4)
						);
					} else {
						go = go.then(
							() => cga.emogua.walkTo([9, 31])
						).then(
							() => cga.emogua.recharge(6)
						);
					}
					return go;
				}).then(() => {
					if (playerInfo.health > 0 || cga.GetPetsInfo().findIndex(e => e.health > 0) > -1) {
						return cga.emogua.walkList([[9, 31], [10, 18]]).then(() =>
							cga.emogua.talkNpc(6, dialog => {
								if (dialog.options == 0) {
									cga.ClickNPCDialog(-1, 6);
								}
							})
						);
					} else return Promise.resolve();
				}).then(() =>
					cga.emogua.logBack().then(() => {
						let currentInfo = cga.GetPlayerInfo();
						if (currentInfo.hp < currentInfo.maxhp || currentInfo.mp < currentInfo.maxmp) {
							console.log('没有补血，请检查设置或者是否没钱了');
							return Promise.reject();
						} else return Promise.resolve();
					})
				);
			}
			return Promise.resolve();
		};
		const findDoctor = () => cga.emogua.recursion(() => {
			if (cga.GetPlayerInfo().health > 0) {
				return cga.emogua.falan.toStone('C').then(() => {
					if (cga.GetMapXY().x != 27) {
						return cga.emogua.autoWalk([27, 82]);
					}
				}).then(() => {
					const profession = Professions.find(p => p.name == '医生');
					const doctor = cga.GetMapUnits().find(u => u.type == 8 && profession.titles.indexOf(u.title_name) >= 0);
					if (doctor) {
						return cga.emogua.walkTo([doctor.xpos - 1, doctor.ypos]).then(
							() => cga.emogua.joinTeam(doctor.xpos, doctor.ypos, doctor.unit_name)
						).then(
							() => cga.emogua.delay(8000)
						).then(cga.emogua.logBack);
					}
					return cga.emogua.delay(30000);
				});
			} else return false;
		});
		if (cga.emogua.getTeamNumber() == 1 && validMaps.includes(cga.GetMapName())) {
			return sell().then(repair).then(crystal).then(findDoctor).then(recharge);
		} else {
			return Promise.resolve();
		}
	};

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
		ANY: this.SLEEP | this.MEDUSA | this.DRUNK | this.CHAOS | this.FORGET
	};
	const WeapAttackFlags = {
		CLOSE: 0x80
	};
	const BattleActionFlags = {
		ISPLAYER: 1,
		ISDOUBLE: 2,
		ISSKILLPERFORMED: 4,
		END: 8
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
	cga.emogua.isSkillAvailable = (name, level) => {
		const skills = cga.GetSkillsInfo();
		const skill = skills.find(s => s.name == name);
		return skill && cga.GetSubSkillsInfo(skill.index).reverse().findIndex(sub =>
			(!level || sub.level == level) && sub.available
		) >= 0;
	};
	cga.emogua.AutoBattlePreset = {
		NormalAttack: [
			{
				user: 7,
				check: context => true,
				skill: {
					name: '攻击',
					targets: context => context.enemies.map(e => e.pos)
				}
			}
		],
		Escape: [
			{
				user: 2,
				check: context => true,
				skill: {
					name: '防御',
					targets: context => [context.petUnit.pos]
				}
			},
			{
				user: 5,
				check: context => true,
				skill: {
					name: '逃跑',
					targets: context => [context.player_pos]
				}
			}
		],
		getBattleRechargeMpAction: (minMp = 200) => {
			return {
				user: 1,
				check: context => context.playerUnit.curmp <= minMp && cga.getInventoryItems().findIndex(i => i.type == 23) >= 0,
				skill: {
					name: '物品',
					item: context => cga.getInventoryItems().find(i => i.type == 23).pos,
					targets: context => [context.player_pos]
				}
			};
		},
		getBattleRechargeHpAction: (minHp = 200) => {
			return {
				user: 1,
				check: context => context.playerUnit.curhp <= minHp && cga.getInventoryItems().findIndex(i => i.type == 43) >= 0,
				skill: {
					name: '物品',
					item: context => cga.getInventoryItems().find(i => i.type == 43).pos,
					targets: context => [context.player_pos]
				}
			};
		},
		getMaxHorizontalTargets: (context) => context.enemies.back.length >= 3 ? context.enemies.back.map(u => u.pos) : context.enemies.front.map(u => u.pos),
		KillFirstName: ['帕布提斯马'],
		getSortedEnemies: (context) => context.enemies.sort((a, b) => {
			if (cga.emogua.AutoBattlePreset.KillFirstName.findIndex(n => a.name == n) >= 0) return -1;
			else if (cga.emogua.AutoBattlePreset.KillFirstName.findIndex(n => b.name == n) >= 0) return 1;
			return b.curhp - a.curhp;
		}).map(u => u.pos),
		/**
		 * options {
		 *     petBreath: false
		 * }
		 */
		getPetSkillAttack: (options) => {
			options = options ? options : {};
			const attackList = [];
			const pet = cga.GetPetsInfo().find(e => e.battle_flags == 2);
			if (pet) {
				const petSkills = cga.GetPetSkillsInfo(pet.index);
				if (petSkills.find(s => s.name.indexOf('明镜止水') >= 0)) {
					attackList.push(
						{
							user: 2,
							check: context => context.petUnit.hpRatio <= 0.4,
							skill: {
								name: petSkills.find(s => s.name.indexOf('明镜止水') >= 0).name,
								targets: context => [context.petUnit.pos]
							}
						}
					);
				}
				if (options.petBreath && petSkills.find(s => s.name == '飓风吐息')) {
					attackList.push(
						{
							user: 2,
							check: context => context.enemies.length >= 7,
							skill: {
								name: '飓风吐息',
								targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
							}
						}
					);
				}
				if (petSkills.find(s => s.name == '气功弹-Ⅱ')) {
					attackList.push(
						{
							user: 2,
							check: context => context.enemies.length >= 3,
							skill: {
								name: '气功弹-Ⅱ',
								targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
							}
						}
					);
				}
			}
			return attackList;
		},
		/**
		 * options {
		 *     petBreath: false,
		 *     rechargeMinHp: 200,
		 *     rechargeMinMp: 200,
		 * }
		 */
		getCommonAttack: (options) => {
			options = options ? options : {};
			const result = [];
			if (cga.getInventoryItems().findIndex(i => i.type == 23) >= 0) {
				result.push(cga.emogua.AutoBattlePreset.getBattleRechargeMpAction(options.rechargeMinMp ? options.rechargeMinMp : 200));
			}
			if (cga.getInventoryItems().findIndex(i => i.type == 43) >= 0) {
				result.push(cga.emogua.AutoBattlePreset.getBattleRechargeHpAction(options.rechargeMinHp ? options.rechargeMinHp : 200));
			}
			if (cga.getEquipItems().findIndex(i => i.type == 0 ||  i.type == 2) >= 0 && cga.emogua.isSkillAvailable('吸血攻击')) {
				result.push(
					{
						user: 1,
						check: context => context.playerUnit.hpRatio <= 0.4,
						skill: {
							name: '吸血攻击', level: 7,
							targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos)
						}
					}
				);
			}
			if (cga.getEquipItems().findIndex(i => i.type == 0 ||  i.type == 2) >= 0 && cga.emogua.isSkillAvailable('诸刃·碎玉')) {
				result.push(
					{
						user: 1,
						check: context => context.round_count == 0,
						skill: {
							name: '诸刃·碎玉',
							targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
						}
					}
				);
			}
			if (cga.getEquipItems().findIndex(i => i.type == 6) >= 0 && cga.emogua.isSkillAvailable('因果报应')) {
				result.push(
					{
						user: 1,
						check: context => context.enemies.front.length >= 3 || context.enemies.back.length >= 3,
						skill: {
							name: '因果报应', level: 3,
							targets: cga.emogua.AutoBattlePreset.getMaxHorizontalTargets
						}
					}
				);
			}
			if (cga.getEquipItems().findIndex(i => i.type == 4) >= 0 && cga.emogua.isSkillAvailable('乱射')) {
				result.push(
					{
						user: 1,
						check: context => context.enemies.length >= 8,
						skill: {
							name: '乱射', level: 6,
							targets: context => context.enemies.map(u => u.pos)
						}
					}
				);
				result.push(
					{
						user: 1,
						check: context => context.enemies.length >= 5,
						skill: {
							name: '乱射', level: 3,
							targets: context => context.enemies.map(u => u.pos)
						}
					}
				);
				result.push(
					{
						user: 1,
						check: context => context.enemies.length >= 3,
						skill: {
							name: '乱射', level: 1,
							targets: context => context.enemies.map(u => u.pos)
						}
					}
				);
			}
			console.log(cga.emogua.AutoBattlePreset.getPetSkillAttack(options));
			result.push(...cga.emogua.AutoBattlePreset.getPetSkillAttack(options));
			result.push(
				{
					user: 7,
					check: context => true,
					skill: {
						name: '攻击',
						targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
					}
				}
			);
			return result;
		},
		/**
		 * options {
		 *     petBreath: false,
		 *     rechargeMinHp: 200,
		 *     rechargeMinMp: 200,
		 * }
		 */
		getIntelligentHeal: (options) => {
			options = options ? options : {};
			const needHealChecker = (unit) => {
				return unit.curhp > 0 && unit.hpRatio <= 0.75;
			};
			const result = [];
			if (cga.getInventoryItems().findIndex(i => i.type == 23) >= 0) {
				result.push(cga.emogua.AutoBattlePreset.getBattleRechargeMpAction(options.rechargeMinMp ? options.rechargeMinMp : 200));
			}
			if (cga.getInventoryItems().findIndex(i => i.type == 43) >= 0) {
				result.push(cga.emogua.AutoBattlePreset.getBattleRechargeHpAction(options.rechargeMinHp ? options.rechargeMinHp : 200));
			}
			if (cga.emogua.isSkillAvailable('生命祈福')) {
				result.push(
					{
						user: 1,
						check: context => {
							const needHealUnits = context.teammates.filter(u => u.curhp > 0 && u.hpRatio <= 0.3);
							return needHealUnits.length >= 2;
						},
						skill: {
							name: '生命祈福',
							targets: context => [context.player_pos]
						}
					}
				);
			}
			if (cga.emogua.isSkillAvailable('气绝回复')) {
				result.push(
					{
						user: 1,
						check: context => {
							const needReviveUnits = context.teammates.filter(u => u.curhp == 0);
							return needReviveUnits.length > 0;
						},
						skill: {
							name: '气绝回复',
							targets: context => context.teammates.filter(u => u.curhp == 0).map(u => u.pos)
						}
					}
				);
			}
			if (cga.emogua.isSkillAvailable('洁净魔法')) {
				result.push(
					{
						user: 1,
						check: context => {
							const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && u.flags & DebuffFlags.ANY).map(u => u.pos);
							if (needCleanPositions.length >= 2) {
								const t = BattlePositionMatrix.getMaxTPosition(needCleanPositions);
								return t.count >= 3;
							}
							return false;
						},
						skill: {
							name: '洁净魔法', level: 6,
							targets: context => {
								const needCleanPositions = context.teammates.filter(u => u.flags & DebuffFlags.ANY).map(u => u.pos);
								const t = BattlePositionMatrix.getMaxTPosition(needCleanPositions);
								return [t.position];
							}
						}
					}
				);
			}
			if (cga.emogua.isSkillAvailable('洁净魔法', 8)) {
				result.push(
					{
						user: 1,
						check: context => {
							const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && u.flags & DebuffFlags.ANY).map(u => u.pos);
							return needCleanPositions.length >= 3;
						},
						skill: {
							name: '洁净魔法', level: 8,
							targets: context => {
								const needCleanPositions = context.teammates.filter(u => u.flags & DebuffFlags.ANY).map(u => u.pos);
								const t = BattlePositionMatrix.getMaxTPosition(needCleanPositions);
								return [t.position];
							}
						}
					}
				);
			}
			if (cga.emogua.isSkillAvailable('强力补血魔法')) {
				result.push(
					{
						user: 1,
						check: context => {
							const needHealUnits = context.teammates.filter(needHealChecker);
							if (needHealUnits.length >= 3) {
								const t = BattlePositionMatrix.getMaxTPosition(needHealUnits.map(u => u.pos));
								return t.count > 1;
							}
							return false;
						},
						skill: {
							name: '强力补血魔法', level: 8,
							targets: context => {
								const t = BattlePositionMatrix.getMaxTPosition(
									context.teammates.filter(needHealChecker).map(u => u.pos)
								);
								return [t.position];
							}
						}
					}
				);
			}
			if (cga.emogua.isSkillAvailable('超强补血魔法')) {
				result.push(
					{
						user: 1,
						check: context => {
							const needHealUnits = context.teammates.filter(needHealChecker);
							return needHealUnits.length >= 3;
						},
						skill: {
							name: '超强补血魔法', level: 8,
							targets: context => [context.player_pos]
						}
					}
				);
			}
			if (cga.emogua.isSkillAvailable('补血魔法')) {
				result.push(
					{
						user: 1,
						check: context => {
							const needHealUnits = context.teammates.filter(needHealChecker);
							return needHealUnits.length > 0;
						},
						skill: {
							name: '补血魔法', level: 7,
							targets: context => context.teammates.sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
						}
					}
				);
			}
			result.push(...cga.emogua.AutoBattlePreset.getPetSkillAttack(options));
			result.push(
				{
					user: 7,
					check: context => true,
					skill: {
						name: '攻击',
						targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
					}
				}
			);
			return result;
		},
		/**
		 * options {
		 *     rechargeMinHp: 200
		 * }
		 */
		getProtectedEscape: (options) => {
			options = options ? options : {};
			const actionList = [];
			if (cga.getInventoryItems().findIndex(i => i.type == 43) >= 0) {
				actionList.push(cga.emogua.AutoBattlePreset.getBattleRechargeHpAction(options.rechargeMinHp ? options.rechargeMinHp : 200));
			}
			const pet = cga.GetPetsInfo().find(e => e.battle_flags === 2);
			if (pet) {
				const petSkills = cga.GetPetSkillsInfo(pet.index);
				if (petSkills.find(s => s.name.indexOf('明镜止水') >= 0)) {
					const skill = petSkills.find(s => s.name.indexOf('明镜止水') >= 0);
					actionList.push(
						{
							user: 2,
							check: context => context.petUnit.hpRatio <= 0.4 && context.playerUnit.curmp >= skill.cost,
							skill: {
								name: skill.name,
								targets: context => [context.petUnit.pos]
							}
						}
					);
				}
			}
			actionList.push(...cga.emogua.AutoBattlePreset.Escape);
			return actionList;
		}
	};
	/**
	 * context: {
	 *     round_count: 41,
	 *     player_pos: 10,
	 *     player_status: 1,
	 *     skill_performed: 0,
	 *     skill_allowbit: 953,
	 *     weapon_allowbit: 176,
	 *     petid: 0,
	 *     effect_flags: 0
	 * }
	 * battleUnits:  [
	 *     {
	 *     name: 'xxx',
	 *     level: 160,
	 *     modelid: 100358,
	 *     curhp: 3011,
	 *     maxhp: 3011,
	 *     curmp: 771,
	 *     maxmp: 771,
	 *     pos: 0,
	 *     flags: 100663300
	 *     }
	 * ]
	 * strategies: [
	 *     {
	 *         user: 1 (人物) 2 (宠物) 4 (无宠二动)
	 *         check: context => boolean
	 *         skill: {
	 *             name: '补血魔法 攻击 防御 逃跑 位置 宠物 物品名',
	 *             level: 1,
	 *             targets: context => [position],
	 *             backup: '不能释放回退: 攻击 | 防御',
	 *             item: context => position
	 *         }
	 *     }
	 * ]
	 * 默认首回合不延迟，如果屏蔽切图且第一回合敌人全被飞或者己方全被飞会掉线
	 */
	const playerStrategies = [], player2Strategies = [], petStrategies = [];
	const battle = (state, context) => {
		context.isFront = BattlePositionMatrix.isFront;
		context.getMaxTPosition = BattlePositionMatrix.getMaxTPosition;
		context.units = cga.GetBattleUnits().map(u => {
			u.hpRatio = u.curhp / u.maxhp;
			return u;
		});
		context.enemies = context.units.filter(e =>
			(context.player_pos > 9 && e.pos <= 9) ||
			(context.player_pos <= 9 && e.pos > 9)
		);
		context.enemies.front = context.enemies.filter(e => context.isFront(e.pos));
		context.enemies.back = context.enemies.filter(e => !context.isFront(e.pos));
		context.teammates = context.units.filter(e =>
			(context.player_pos > 9 && e.pos > 9) ||
			(context.player_pos <= 9 && e.pos <= 9)
		);
		context.considerBackPosition = (position) => !context.isFront(position) && context.units.find(u => u.pos == (position + 5) && u.curhp > 0);
		context.petUnit = context.units.find(u => u.pos == (context.player_pos + (context.isFront(context.player_pos) ? -5 : 5)));
		context.playerUnit = context.units.find(u => u.pos == context.player_pos);
		const getSubSkillTarget = (targets, subSkill, position) => {
			return targets.find(target => {
				if (
					context.considerBackPosition(position) &&
					SkillFlags.FRONT_ONLY & subSkill.flags &&
					context.enemies.find(e => e.pos == target) &&
					context.units.find(e => e.pos == target).curhp > 0 &&
					context.considerBackPosition(target)
				) {
					return false;
				}
				return true;
			});
		};
		const applyPlayerSkill = (skill) => {
			try {
				const normalAttack = (targets) => {
					return targets.find(target => {
						if (
							context.considerBackPosition(context.player_pos) &&
							context.petid >= 0 && cga.GetPetInfo(context.petid).hp > 0 &&
							context.weapon_allowbit & WeapAttackFlags.CLOSE &&
							context.enemies.find(e => e.pos == target) &&
							context.units.find(e => e.pos == target).curhp > 0 &&
							context.considerBackPosition(target)
						) {
							return false;
						}
						cga.BattleNormalAttack(target);
						return true;
					});
				};
				const backSkill = () => {
					if (skill.backup == '防御') {
						cga.BattleDefense();
					} else {
						normalAttack(context.enemies.map(e => e.pos));
					}
				};
				if (skill.name == '防御') {
					cga.BattleDefense();
				} else if (skill.name == '逃跑') {
					cga.BattleEscape();
				} else if (skill.name == '位置') {
					cga.BattleExchangePosition();
				} else if (skill.name == '宠物') {
					const pets = skill.targets(context);
					if (pets.length > 0) cga.BattleChangePet(pets[0]);
				} else if (skill.name == '攻击') {
					let targets = skill.targets(context);
					if (targets.length == 0) {
						targets = context.enemies.map(e => e.pos);
					}
					normalAttack(targets);
				} else if (skill.name == '物品') {
					const targets = skill.targets(context);
					const item = skill.item(context);
					if (targets.length > 0 && item) {
						cga.BattleUseItem(item, targets[0]);
					} else {
						backSkill();
					}
				} else {
					const skillInfo = cga.GetSkillsInfo().find(s => {
						if (s.name == skill.name && !context.skill_performed) {
							const subSkill = cga.GetSubSkillsInfo(s.index).reverse().find(sub =>
								(!skill.level || sub.level <= skill.level) &&
								sub.available &&
								sub.cost <= cga.GetPlayerInfo().mp
							);
							if (subSkill) {
								let target = getSubSkillTarget(skill.targets(context), subSkill, context.player_pos);
								if (typeof target == 'number') {
									if (SkillFlags.MULTI & subSkill.flags) {
										target = target + 20;
									}
									if (SkillFlags.ALL & subSkill.flags) {
										target = (target >= 10 && target <= 19) ? 41 : 40;
									}
									if (SkillFlags.BOOM & subSkill.flags) {
										target = 42;
									}
									return cga.BattleSkillAttack(s.index, subSkill.level - 1, target);
								}
							}
						}
						return false;
					});
					if (!skillInfo) {
						backSkill();
					}
				}
			} catch (e) {
				console.log('战斗技能使用错误: ');
				console.log(e);
			}
		};
		const applyPetSkill = (skill) => {
			try {
				const petInfo = cga.GetPetInfo(context.petid);
				const tryPetSkill = (skillName, targets) => {
					return cga.GetPetSkillsInfo(context.petid).find(s => {
						if (s.name == skillName && s.cost <= petInfo.mp) {
							let target = getSubSkillTarget(targets, s, context.petUnit.pos);
							if (typeof target == 'number') {
								if (SkillFlags.MULTI & s.flags) {
									target = target + 20;
								}
								if (SkillFlags.ALL & s.flags) {
									target = (target >= 10 && target <= 19) ? 41 : 40;
								}
								if (SkillFlags.BOOM & s.flags) {
									target = 42;
								}
								return cga.BattlePetSkillAttack(s.index, target);
							}
						}
						return false;
					});
				};
				if (petInfo.hp > 0) {
					let skillInfo = tryPetSkill(skill.name, skill.targets(context));
					if (!skillInfo) {
						if (skill.backup == '防御') {
							skillInfo = tryPetSkill('防御', [context.petUnit.pos]);
						}
						if (!skillInfo) {
							skillInfo = tryPetSkill('攻击', context.enemies.map(e => e.pos));
						}
					}
				}
			} catch (e) {
				console.log('宠物自动战斗错误: ');
				console.log(e);
			}
		};
		if (state & BattleActionFlags.ISPLAYER) {
			if (state & BattleActionFlags.ISDOUBLE) {
				player2Strategies.find(s => {
					if (s.check(context)) {
						applyPlayerSkill(s.skill);
						return true;
					}
					return false;
				});
			} else {
				playerStrategies.find(s => {
					if (s.check(context)) {
						applyPlayerSkill(s.skill);
						return true;
					}
					return false;
				});
			}
		} else {
			petStrategies.find(s => {
				if (s.check(context)) {
					applyPetSkill(s.skill);
					return true;
				}
				return false;
			});
		}
	};
	const waitingBattle = (lastRound = -1) => {
		cga.AsyncWaitBattleAction(state => setTimeout(() => {
			if (typeof state == 'number' && !(BattleActionFlags.END & state)) {
				const context = cga.GetBattleContext();
				let timeout = 4200;
				if (context.round_count == 0 || context.round_count == lastRound) {
					timeout = 200;
				}
				setTimeout(() => {
					waitingBattle(context.round_count);
					if (playerStrategies.length > 0) {
						battle(state, context);
					}
				}, timeout);
			} else waitingBattle();
		}, 0), 11000);
	};
	waitingBattle();
	cga.emogua.autoBattle = (strategies) => {
		if (strategies && strategies.length > 0) {
			playerStrategies.splice(0, playerStrategies.length, ...strategies.filter(e => e.user & 1));
			player2Strategies.splice(0, player2Strategies.length, ...strategies.filter(e => e.user & 4));
			petStrategies.splice(0, petStrategies.length, ...strategies.filter(e => e.user & 2));
		}
	};

	// 定时任务
	const protectEquipment = () => {
		let result = Promise.resolve();
		if (cga.getInventoryItems().length < 20) {
			const takeOffEquipments = cga.GetItemsInfo().filter(e => e.pos <= 4).filter(item => {
				const durability = cga.emogua.getDurability(item);
				return durability && durability.current <= 30;
			});
			for (let i = 0; i < takeOffEquipments.length; i++) {
				const item = takeOffEquipments[i];
				result = result.then(() => {
					const sameEquipment = cga.getInventoryItems().find(eq => {
						if (eq.type >= 0 && eq.type <= 14 && eq.level <= 10) {
							const durability = cga.emogua.getDurability(eq);
							return durability && durability.current > 30 && eq.type == item.type;
						}
						return false;
					});
					const exchangeIndex = sameEquipment ? sameEquipment.pos : cga.emogua.getEmptyBagIndex();
					if (exchangeIndex > 7 && cga.isInNormalState() && !cga.emogua.isMoving()) {
						cga.MoveItem(item.pos, exchangeIndex, -1);
					}
					return cga.emogua.delay(500);
				});
			}
		}
		return result;
	};
	let lastPosition = cga.GetMapXY();
	let lastPositionTimer = new Date().getTime();
	const keepAlive = () => {
		if (cga.GetWorldStatus() == 11) {
			console.log('已掉线,退出进程');
			process.exit();
		} else {
			// 防掉线==
			if (cga.GetMapXY().x == lastPosition.x && cga.GetMapXY().y == lastPosition.y) {
				const currentTime = new Date().getTime();
				if ((currentTime - lastPositionTimer) >= 30000 && cga.isInNormalState()) {
					cga.emogua.sayWords();
					lastPositionTimer = currentTime;
				}
			} else {
				lastPosition = cga.GetMapXY();
				lastPositionTimer = new Date().getTime();
			}
			// 防掉线==
			// 装备保护
			protectEquipment();

			setTimeout(keepAlive, 10000);
		}
	};
	keepAlive();
	return cga;
});
