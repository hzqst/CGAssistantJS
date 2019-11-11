/**
 * health 0 1-25(白) 26-50(黄) 51-75(粉) 76-100(红)
 * direction 0(右上)
 * 高速移动中不可丢东西
 * cga.ForceMove(direction, false); true 人物坐标移动 false 只发包服务器
 * cga.getMapObjects()
 *     [ { x: 199, y: 209, mapx: 199, mapy: 209, cell: 10 }] cell 10(地图出入口) 3(迷宫出入口)
 *
 * dialog options:
 *     0  : 列表选择 cga.ClickNPCDialog(0, 6) 第一个参数应该是被忽略的，第二个参数选择列表序号，从0开始
 *     1  : 确定按钮 cga.ClickNPCDialog(1, -1)
 *     2  : 取消按钮 cga.ClickNPCDialog(2, -1)
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
 *     unitid=-1 系统消息
 * 装备栏顺序
 *     0 头 1 衣服 2 左手 3 右手 4 鞋 5 左饰品 6 右饰品 7 水晶
 * 物品类型
 *     0-6 武器 0剑 1斧 2枪 3杖 4弓 5小刀 6回力
 *     7-14 防具 7盾 8盔 9帽 10铠 11衣 12袍 13靴 14鞋
 *     23 料理 29 矿条 30 木 38 宝石 43 血瓶 34 蔬菜 35 其它食材 32 肉 31 布 26 鹿皮
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
		titles: ['见习魔术师', '魔术师', '王宫魔法师', '魔导士', '大魔术师', '狂魔导师'],
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
		titles: ['投掷武器学徒', '投掷武器工', '资深投掷武器师傅', '御用投掷武器师傅', '投掷武器名师']
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
		titles: ['防具修理学徒', '防具修理工', '资深防具修理师', '御用防具修理师', '修理防具专家']
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
		titles: ['武器修理学徒', '武器修理工', '资深武器修理师', '御用武器修理师', '修理武器专家']
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
const CustomFunctionsFlag = 0;
module.exports = new Promise(resolve => {
	const cga = require('../cgaapi')(() => setTimeout(() => resolve(cga), 0));
}).then(cga => {
	const multicast = () => {
		const dgram = require('dgram');
		const server = dgram.createSocket({type:'udp4',reuseAddr:true});
		server.on('error', (err) => {
			console.log(`服务器异常：\n${err.stack}`);
			server.close();
		});

		server.on('message', (msg, rinfo) => {
			console.log(`服务器收到消息：${msg} 来自 ${rinfo.address}:${rinfo.port}`);
		});

		server.on('listening', () => {
			server.addMembership('239.255.255.255'); //加入组播组
			server.setMulticastTTL(128);
			console.log(`服务器监听 1`);
		});
		server.bind(41234);
	};
	cga.emogua = {};
	cga.emogua.shuffle = (arr) => {
		let i = arr.length;
		while (i) {
			let j = Math.floor(Math.random() * i--);
			[arr[j], arr[i]] = [arr[i], arr[j]];
		}
		return arr;
	};
	cga.emogua.getMapInfo = () => {
		// const info = cga.GetMapXY();
		// info.indexes = cga.GetMapIndex();
		// info.name = cga.GetMapName();
		return cga.getMapInfo();
	};
	cga.emogua.isMoving = () => {
		const speed = cga.GetMoveSpeed();
		return !(speed && speed.x === 0 && speed.y === 0);
	};
	cga.emogua.getPlayerProfession = () => ProfessionsMap[cga.GetPlayerInfo().job];
	// 不可以在战斗中获取
	let teammates = [];
	cga.emogua.getTeammates = () => {
		if (cga.isInNormalState()) {
			try {
				teammates = cga.getTeamPlayers().filter(e => e.is_me !== true);
			} catch (e) {
				console.log('获取teamplayers失败', e);
			}
		}
		return teammates;
	}
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
		cga.SayWords(words, color, range, size);
		return Promise.resolve();
	}
	cga.emogua.recursion = (action, timer = Date.now()) => {
		const result = action(timer);
		if (result instanceof Promise) {
			return result.then(
				() => cga.emogua.recursion(action, timer),
				e => {
					if (e && typeof e != 'number') console.log(e);
					if (e == 'RPC Invocation failed.') {
						console.log('aha!');
					}
					return e;
				}
			);
		}
		if (result === true) {
			return cga.emogua.recursion(action, timer);
		}
		return Promise.resolve(result);
	};
	cga.emogua.waitUntil = (predict, interval = 2000, timer = Date.now()) => {
		if (predict(timer)) {
			return Promise.resolve();
		} else {
			return cga.emogua.delay(interval).then(
				() => cga.emogua.waitUntil(predict, interval, timer)
			);
		}
	};
	// destination '艾尔莎岛' || 1111 || [147, 189]
	cga.emogua.arrived = (destination, mapInfo = cga.getMapInfo()) => {
		if (typeof destination == 'string' && (destination == '*' || destination == mapInfo.name)) {
			return true;
		} else if (destination instanceof Array && mapInfo.x == destination[0] && mapInfo.y == destination[1]) {
			return true;
		} else if (typeof destination == 'number' && mapInfo.indexes.index3 == destination) {
			return true;
		}
		return false;
	}
	cga.emogua.waitDestination = (destination, timeout = 3000, timer = Date.now()) => {
		if ((Date.now() - timer) > timeout) {
			console.log('不能抵达目的地->' + destination);
			return Promise.reject();
		}
		if (destination) {
			if (cga.emogua.arrived(destination)) return cga.emogua.waitAfterBattle();
			else return cga.emogua.delay(500).then(
				() => cga.emogua.waitDestination(destination, timeout, timer)
			);
		}
		return Promise.resolve();
	};
	cga.emogua.waitNPCDialog = (action, timeout = 5000) => new Promise(
		resolve => cga.AsyncWaitNPCDialog((error, dialog) => setTimeout(() => resolve(action(dialog ? dialog : {})), 0), timeout)
	);
	cga.emogua.waitMessage = (check, timeout) => new Promise((resolve, reject) => {
		cga.AsyncWaitChatMsg((error, chat) => setTimeout(() => {
			const checkResult = check(chat ? chat : {});
			if (checkResult instanceof Promise) checkResult.then(resolve).catch(reject);
			else if (checkResult) resolve();
			else reject();
		}, 0), timeout ? timeout : 10000);
	});
	cga.emogua.waitMessageUntil = (check) => cga.emogua.waitMessage(check).catch(() => cga.emogua.waitMessageUntil(check));
	const messagePattern = /^(\[GP\])?(.+)(\: )(.+)/;
	cga.emogua.getNameFromMessage = (message) => {
		const matched = messagePattern.exec(message);
		if (matched) return [matched[2],matched[4]];
		return [undefined, undefined];
	};
	cga.emogua.logBack = (times = 0) => Promise.resolve().then(() => {
		if (times > 9) cga.LogOut();
		else cga.LogBack();
		return cga.emogua.delay(2000).then(() => cga.emogua.waitAfterBattle());
	}).then(() => {
		if (['法兰城','艾尔莎岛'].indexOf(cga.GetMapName()) < 0) {
			return cga.emogua.logBack(times + 1);
		}
	}).catch(e => {
		console.log('登出失败', e);
		return cga.emogua.logBack(times + 1);
	});
	cga.emogua.forceMove = (orientation, times = 1) => {
		if  (times > 0) {
			cga.ForceMove(orientation, true);
			return cga.emogua.delay(1000).then(() => cga.emogua.forceMove(orientation, times - 1));
		}
		return Promise.resolve();
	};
	/**
	 * target: [x, y, destination]
	 *     destination: 'map name' | '*' | [x, y] 切同图
	 * count
	 *     尝试计数, 方法内部使用
	 * return
	 *     Promise.reject(-1) -1 切到了不认识的地图,一般无法恢复 1 卡住，一般可重新寻路
	 */
	cga.emogua.walkTo = (target, startMapIndex = cga.GetMapIndex().index3) => {
		const targetX = target[0];
		const targetY = target[1];
		const destination = target[2];
		let lastPoint = cga.GetMapXY();
		let lastPointTimer = Date.now();
		let tryCount = 1;
		if (cga.isInNormalState()) {
			// console.log('send walk package ' + target);
			cga.WalkTo(targetX, targetY);
		}
		return cga.emogua.recursion(
			() => cga.emogua.delay(120).then(() => {
				if (!cga.isInNormalState()) {
					return cga.emogua.waitAfterBattle();
				}
			}).then(battled => {
				const map = cga.emogua.getMapInfo();
				if (startMapIndex != map.indexes.index3) {
					if (destination instanceof Array && map.x == destination[0] && map.y == destination[1]) {
						return Promise.reject(0);
					}
					if (typeof destination == 'string' && (map.name == destination || destination == '*')) {
						return Promise.reject(0);
					}
					if (typeof destination == 'number' && map.indexes.index3 == destination) {
						return Promise.reject(0);
					}
					console.log('Walked to unknown map, target=' + target + ' start=' + startMapIndex + ' current=' + map.indexes.index3);
					return Promise.reject(-1);
				} else {
					if (map.x == targetX && map.y == targetY) {
						if (!destination || (typeof destination == 'string' && (map.name == destination || destination == '*')) ||
							(typeof destination == 'number' && map.indexes.index3 == destination)
						) {
							return Promise.reject(0);
						}
					} else if (destination instanceof Array && map.x == destination[0] && map.y == destination[1]) {
						return Promise.reject(0);
					}
				}
				if (battled || map.x != lastPoint.x || map.y != lastPoint.y) {
					lastPoint = map;
					lastPointTimer = Date.now();
				}
				const interval = Date.now() - lastPointTimer;
				if (interval >= (500 * tryCount)) {
					// console.log('send walk package ' + target);
					if (map.x != targetX || map.y != targetY) {
						cga.WalkTo(targetX, targetY);
					}
					if (battled) tryCount = 1;
					else tryCount++;
				}
				if (tryCount > 4) {
					console.log('Can not arrive target=' + target);
					if (map.x == targetX && map.y == targetY) {
						return Promise.reject(-3);
					}
					return Promise.reject(1);
				}
			})
		).catch(e => {
			if (!(e instanceof Error)) {
				return Promise.reject();
			}
			console.log('walk to', e);
		});
	};
	// [ [x, y, destination] ]
	cga.emogua.walkList = (list) => {
		return list.reduce(
			(a, c) => a.then(
				() => cga.emogua.walkTo(c).then(r => r === 0 ? r : Promise.reject(r))
			), Promise.resolve()
		).then(() => {
			const endTarget = list[list.length - 1];
			if (endTarget) {
				// 防止非切图或切图但未标明时，遇敌回退
				const endDestination = endTarget[2];
				if (!endDestination) {
					return cga.emogua.delay(1500)
					.then(cga.emogua.waitAfterBattle)
					.then(cga.emogua.dropItems)
					.then(() => {
						const p = cga.GetMapXY();
						if (p.x != endTarget[0] || p.y != endTarget[1]) {
							console.log('最后一步战斗回退');
							return cga.emogua.walkList([endTarget]);
						}
					});
				} else {
					return cga.emogua.delay(1000).then(cga.emogua.waitAfterBattle).then(() => cga.emogua.dropItems());
				}
			}
		});
	};
	const excludedMaps = [27001,61001,43600,43000,2400,11036,11037,15596,11032,15001,15006,5008];
	const isMapDownloaded = (walls, mapIndex = cga.GetMapIndex()) => {
		if (excludedMaps.indexOf(mapIndex.index3) > -1) return true;
		const downloadedFlag = mapIndex.index1 === 1 ? 0 : 1;
		return walls.matrix[0][0] == downloadedFlag && walls.matrix[walls.y_size-1][0] == downloadedFlag && walls.matrix[walls.y_size-1][walls.x_size-1] == downloadedFlag && walls.matrix[0][walls.x_size-1] == downloadedFlag;
	};
	cga.emogua.downloadMap = () => {
		const walls = cga.buildMapCollisionMatrix();
		const mapIndex = cga.GetMapIndex();
		if(!isMapDownloaded(walls, mapIndex)) {
			return new Promise((resolve, reject) => {
				console.log('等待下载地图');
				const ended = () => {
					console.log('下载地图结束');
					if (mapIndex.index1 === 0) excludedMaps.push(mapIndex.index3);
					resolve(cga.buildMapCollisionMatrix());
				};
				const recursiveDownload = (xfrom, yfrom, xsize, ysize, times = 0) => {
					var lastIndex3 = mapIndex.index3;
					if (xfrom < xsize && yfrom < ysize) {
						cga.RequestDownloadMap(xfrom, yfrom, xfrom + 24, yfrom + 24);
						cga.AsyncWaitDownloadMap((error, info) => setTimeout(() => {
							if (error || lastIndex3 != info.index3) {
								if (times <= 2) {
									setTimeout(() => recursiveDownload(xfrom, yfrom, xsize, ysize, times + 1), 500);
								} else {
									console.log('下载地图出错 ' + error + ' last=' + lastIndex3 + ' info=' + info.index3);
									reject();
								}
							} else {
								if (info.xtop >= xsize && info.ytop >= ysize) {
									ended();
								} else {
									xfrom += 24;
									if (xfrom >= xsize) {
										xfrom = 0;
										yfrom += 24;
									}
									if (yfrom >= ysize) {
										ended();
									} else {
										setTimeout(() => recursiveDownload(xfrom, yfrom, xsize, ysize), 500);
									}
								}
							}
						}, 0), 5000);
					} else ended();
				};
				setTimeout(() => recursiveDownload(0, 0, walls.x_size, walls.y_size), 500);
			});
		}
		return Promise.resolve(walls);
	};
	cga.emogua.autoWalk = (target, walls, tryCount = 0, compress = true) => Promise.resolve().then(
		() => walls ? walls : cga.emogua.downloadMap()
	).then(walls => {
		const mapInfo = cga.getMapInfo();
		const matrix = walls.matrix;
		cga.getMapObjects().filter(e => [3,10].indexOf(e.cell) >= 0).forEach(entry => {
			if (entry.x != target[0] || entry.y != target[1]) {
				matrix[entry.y][entry.x] = 1;
			}
		});
		const grid = new PF.Grid(matrix);
		const finder = new PF.AStarFinder({
			allowDiagonal: true,
			dontCrossCorners: true
		});
		let apath = finder.findPath(mapInfo.x, mapInfo.y, target[0], target[1], grid);
		// PF.Util.smoothenPath(grid, apath)
		let path = compress ? PF.Util.compressPath(apath) : apath;
		if (path.length > 0) {
			path.shift();
			if (path.length == 0) return Promise.resolve();
			if (target[2]) path[path.length - 1].push(target[2]);
			return cga.emogua.walkList(path).catch(r => {
				if (r > 0) {
					if (tryCount < 10) {
						console.log('重试target=' + target + ' for ' + tryCount + 'times');
						return cga.emogua.autoWalk(target, walls, tryCount + 1, compress);
					}
				}
				console.log('自动寻路失败不可恢复target=' + target + ' ' + r);
				return Promise.reject(r);
			});
		}
		console.log(`Can not find path to ${target} tried ${tryCount}`);
		if (tryCount < 3) {
			return cga.emogua.autoWalk(target, undefined, tryCount + 1, compress);
		}
		return Promise.reject();
	});
	// [ [x, y, destination] ]
	cga.emogua.autoWalkList = (list) => list.reduce((a, c) => a.then(() => cga.emogua.autoWalk(c)), Promise.resolve());
	cga.emogua.getFarthestEntry = (current, mapObjects = cga.getMapObjects()) => {
		return mapObjects.filter(e => [3,10].indexOf(e.cell) >= 0 && (e.mapx != current.x || e.mapy != current.y)).sort((a, b) => {
			const distanceA = Math.abs(a.mapx - current.x) + Math.abs(a.mapy - current.y);
			const distanceB = Math.abs(b.mapx - current.x) + Math.abs(b.mapy - current.y);
			return distanceB - distanceA;
		}).shift();
	};

	cga.emogua.walkRandomMaze = (times = 0) => cga.emogua.downloadMap().then(walls => {
		const target = cga.emogua.getFarthestEntry(cga.GetMapXY());
		if (target) {
			return cga.emogua.autoWalk([target.mapx, target.mapy, '*'], walls);
		}
		if (times < 3) {
			return cga.emogua.walkRandomMaze(times + 1);
		}
		return Promise.reject('Fail to walk random maze');
	});
	cga.emogua.walkRandomMazeUntil = (check) => cga.emogua.walkRandomMaze().then(() => {
		const checkResult = check();
		if (checkResult instanceof Promise) return checkResult;
		else if (checkResult) return Promise.resolve();
		return cga.emogua.walkRandomMazeUntil(check);
	});
	const getApexes = (map, start) => {
		const searchedPointsCache = {};
		const foundedApexes = [];
		const findByNextPoints = (centre) => {
			const key = centre.x + '-' + centre.y;
			if (!searchedPointsCache[key]) {
				const nextPoints = [];
				let whiteCount = 0;
				const push = (p) => {
					if (p.x > map.x_bottom && p.x < map.x_size && p.y > map.y_bottom && p.y < map.y_size) {
						p.v = map.matrix[p.y][p.x];
						if (p.v === 0) {
							whiteCount++;
						}
						nextPoints.push(p);
					}
				};
				push({x: centre.x + 1, y: centre.y});
				push({x: centre.x + 1, y: centre.y + 1});
				push({x: centre.x, y: centre.y + 1});
				push({x: centre.x - 1, y: centre.y + 1});
				push({x: centre.x - 1, y: centre.y});
				push({x: centre.x - 1, y: centre.y - 1});
				push({x: centre.x, y: centre.y - 1});
				push({x: centre.x + 1, y: centre.y - 1});
				if (nextPoints.length == 8) {
					if (whiteCount == 3) {
						foundedApexes.push(centre);
					}
					searchedPointsCache[key] = true;
					nextPoints.filter(p => p.v === 0).forEach(findByNextPoints);
				}
			}
		};
		findByNextPoints(start);
		return foundedApexes;
	};
	const getMovablePoints = (map, start) => {
		const foundedPoints = {};
		foundedPoints[start.x + '-' + start.y] = start;
		const findByNextPoints = (centre) => {
			const nextPoints = [];
			const push = (p) => {
				if (p.x > map.x_bottom && p.x < map.x_size && p.y > map.y_bottom && p.y < map.y_size) {
					if (map.matrix[p.y][p.x] === 0) {
						const key = p.x + '-' + p.y;
						if (!foundedPoints[key]) {
							foundedPoints[key] = p;
							nextPoints.push(p);
						}
					}
				}
			};
			push({x: centre.x + 1, y: centre.y});
			// push({x: centre.x + 1, y: centre.y + 1});
			push({x: centre.x, y: centre.y + 1});
			// push({x: centre.x - 1, y: centre.y + 1});
			push({x: centre.x - 1, y: centre.y});
			// push({x: centre.x - 1, y: centre.y - 1});
			push({x: centre.x, y: centre.y - 1});
			// push({x: centre.x + 1, y: centre.y - 1});
			nextPoints.forEach(findByNextPoints);
		};
		findByNextPoints(start);
		return foundedPoints;
	};
	// targetFinder 返回unit object 或者 true 都将停止搜索
	cga.emogua.searchMap = (targetFinder, recursion = true) => {
		const start = cga.GetMapXY();
		const getTarget = () => {
			const target = targetFinder(cga.GetMapUnits().filter(u => u.model_id > 0));
			if (typeof target == 'object') {
				target.start = start;
				const walkTo = cga.emogua.getMovablePositionAround({x: target.xpos,y: target.ypos});
				if (walkTo) {
					return cga.emogua.autoWalk([walkTo.x,walkTo.y],undefined,0,false).then(() => Promise.reject(target));
				}
			}
			if (target === true) return Promise.reject(target);
			return Promise.resolve();
		};
		const toNextPoint = (points, centre) => {
			const remain = points.filter(p => {
				const xd = Math.abs(p.x - centre.x);
				const yd = Math.abs(p.y - centre.y);
				p.d = xd + yd;
				return !(xd < 12 && yd < 12);
			}).sort((a,b) => a.d - b.d);
			const next = remain.shift();
			if (next) {
				return cga.emogua.autoWalk([next.x,next.y],undefined,0,false).then(
					() => getTarget()
				).then(() => toNextPoint(remain,next))
			}
			return Promise.resolve();
		};
		let entry;
		return getTarget().then(
			() => cga.emogua.downloadMap()
		).then(w => {
			const current = cga.GetMapXY();
			if (!entry && recursion) entry = cga.emogua.getFarthestEntry(start);
			return toNextPoint(Object.values(getMovablePoints(w, current)), current).then(() => {
				if (typeof entry == 'object') {
					return cga.emogua.autoWalk([entry.x,entry.y,'*'],undefined,0,false).then(() => cga.emogua.searchMap(targetFinder, recursion));
				}
			});
		}).catch(t => t);
	};
	cga.emogua.battleZLZZ = (x, y, turned = false) => {
		if(cga.isInBattle()) return cga.emogua.waitAfterBattle().then(() => cga.emogua.battleZLZZ(x,y,true));
		if (cga.getItemCount('长老之证') >= 7) return Promise.resolve();
		return Promise.resolve().then(() => {
			if (!turned) return cga.emogua.turnTo(x,y);
		}).then(
			() => cga.emogua.waitNPCDialog(dialog => {
				cga.ClickNPCDialog(1, 1);
				return cga.emogua.delay(2000);
			})
		).then(() => {
			if (!cga.isInBattle()) return cga.emogua.delay(15000).then(
				() => cga.emogua.battleZLZZ(x,y,false)
			);
			return cga.emogua.battleZLZZ(x,y,true);
		});
	};
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
		if (destination) return cga.emogua.waitDestination(destination);
		return cga.emogua.delay(2000); // 避免后续事件延迟导致判断有误
	};
	cga.emogua.getOrientation = (x, y) => {
		const p = cga.GetMapXY();
		const xy = Math.max(-1, Math.min(1, x - p.x)).toString() + Math.max(-1, Math.min(1, y - p.y)).toString();
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
	cga.emogua.turnTo = (x, y, destination) => cga.emogua.turnOrientation(cga.emogua.getOrientation(x, y), destination);
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
		} else if (dialog.options == 2) {
			cga.ClickNPCDialog(2, -1);
			return true;
		} else if (dialog.options == 3) {
			cga.ClickNPCDialog(1, -1);
			return true;
		} else if (dialog.options == 8) {
			cga.ClickNPCDialog(8, -1);
			return true;
		} else if (dialog.options == 4) {
			cga.ClickNPCDialog(4, -1);
			return true;
		} else if (dialog.options == 0) {
			return true;
		}
		return false;
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
		} else if (dialog.options == 2) {
			cga.ClickNPCDialog(2, -1);
			return true;
		} else if (dialog.options == 3) {
			cga.ClickNPCDialog(1, -1);
			return true;
		} else if (dialog.options == 8) {
			cga.ClickNPCDialog(8, -1);
			return true;
		} else if (dialog.options == 4) {
			cga.ClickNPCDialog(4, -1);
			return true;
		} else if (dialog.options == 0) {
			return true;
		}
		return false;
	};
	cga.emogua.talkNpc = function(x, y, select, dest) {
		let selector, orientation, targetx, targety, destination;
		for (let i = 0; i < arguments.length; i++) {
			switch (typeof arguments[i]) {
				case 'function':
					selector = arguments[i];
					break;
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
			return Promise.resolve().then(() => {
				if (typeof orientation == 'number' && orientation > -1 && orientation < 8) {
					cga.emogua.turnOrientation(orientation);
				}
			}).then(() => {
				let timeout = 6000;
				return cga.emogua.recursion(
					() => cga.emogua.waitNPCDialog(dialog => {
						if (typeof dialog.type == 'number') {
							timeout = 3000;
							return selector(dialog);
						}
						return false;
					}, timeout).then(r => r ? r : Promise.reject())
				);
			}).then(
				() => cga.emogua.waitDestination(destination)
			);
		}
		return Promise.reject('Talk npc wrong arguments');
	};
	cga.emogua.learnPlayerSkill = (x, y) => cga.emogua.talkNpc(x, y, (dialog) => {
		if (dialog.type == 16) {
			cga.ClickNPCDialog(-1, 0);
			return true;
		}
		if (dialog.type == 17) {
			cga.ClickNPCDialog(0, -1);
			return true;
		}
		if (dialog.options == 1) {
			cga.ClickNPCDialog(1, -1);
			return true;
		}
	});
	cga.emogua.forgetPlayerSkill = (x, y, name) => cga.emogua.talkNpc(x, y, (dialog) => {
		if (dialog.type == 16) {
			cga.ClickNPCDialog(-1, 1);
			return true;
		}
		if (dialog.type == 18) {
			const skillIndex = cga.GetSkillsInfo().sort((a,b) => a.pos - b.pos).findIndex(s => s.name == name);
			if (skillIndex > -1) {
				cga.ClickNPCDialog(0, skillIndex);
				return true;
			}
		}
		if (dialog.options == 12) {
			cga.ClickNPCDialog(4, -1);
			return true;
		}
		if (dialog.options == 1) {
			cga.ClickNPCDialog(1, -1);
			return true;
		}
	});
	cga.emogua.promote = (x, y) => cga.emogua.talkNpc(x, y, (dialog) => {
		if (dialog.type == 2 && dialog.options == 2) {
			cga.ClickNPCDialog(0, 2);
			return true;
		}
		if (dialog.type == 2 && dialog.options == 0) {
			cga.ClickNPCDialog(0, 0);
			return true;
		}
		if (dialog.type == 0 && dialog.options == 1) {
			cga.ClickNPCDialog(1, -1);
			return true;
		}
	});
	class Station {
		// id: [x,y,'map']
		constructor(id) {
			this.id = id;
			this.idString = this.id.join('-');
			this.links = []; // Need to initiated at the end;
		}
	}
	class Link {
		// arrive: () => Promise
		constructor(station, arrive) {
			this.station = station;
			if (typeof arrive == 'function')
				this.arrive = arrive;
		}
		arrive() {
			return cga.emogua.autoWalk(this.station.id);
		}
	}
	const Network = {
		elsa: {
			x: new Station([140, 105, '艾尔莎岛']),
			a: new Station([157, 93, '艾尔莎岛']),
			b: new Station([165, 153, '艾尔莎岛'])
		}, asha: {
			w: new Station([84, 112, '艾夏岛']),
			s: new Station([164, 159, '艾夏岛']),
			n: new Station([151, 97, '艾夏岛'])
		}, falan: {
			e1: new Station([242, 100, '法兰城']),
			s1: new Station([141, 148, '法兰城']),
			w1: new Station([63, 79, '法兰城']),
			m1: new Station([46, 16, 32737]), // '市场三楼 - 修理专区'
			e2: new Station([233, 78, '法兰城']),
			s2: new Station([162, 130, '法兰城']),
			w2: new Station([72, 123, '法兰城']),
			m2: new Station([46, 16, 32735]), // '市场一楼 - 宠物交易区'
			sell: new Station([156, 123, '法兰城']),
			eout: new Station([475,196,'芙蕾雅']),
			sout: new Station([424,259,'芙蕾雅']),
			wout: new Station([374,195,'芙蕾雅']),
			mbank: new Station([83,12,'市场三楼 - 修理专区']),
			mrepair: new Station([82,8,'市场三楼 - 修理专区']),
			bank: new Station([11, 8, '银行']),
			ehospital: new Station([12, 42, 1112]),
			whospital: new Station([12, 42, 1111]),
			fabric: new Station([8, 4, '流行商店']),
			isle:  new Station([65, 98, '小岛'])
		}, castle: {
			x: new Station([27, 82, '里谢里雅堡']),
			s: new Station([41, 91, '里谢里雅堡']),
			nurse: new Station([34, 88, '里谢里雅堡']),
			clock: new Station([58, 83, '里谢里雅堡']),
			f1: new Station([74, 40, '里谢里雅堡 1楼']),
			teleport: new Station([25, 24, '启程之间'])
		}, teleport: {
			yer: new Station([47, 83, '伊尔村']),
			laruka: new Station([49, 81, '圣拉鲁卡村']),
			aleut: new Station([56, 48, '亚留特村']),
			kili: new Station([50, 63, '奇利村']),
			jenova: new Station([58, 43, '杰诺瓦镇']),
			vinoy: new Station([40,36, '维诺亚村']),
			ghana: new Station([36,40, '加纳村'])
		}, aleut: {
			eout: new Station([596,83,'芙蕾雅']),
			nout: new Station([588,50,'芙蕾雅'])
		}, grahl: {
			s: new Station([118, 214, '哥拉尔镇']),
			c: new Station([120, 107, '哥拉尔镇']),
			lumi: new Station([61, 29, '鲁米那斯'])
		}, lumi: {
			sell: new Station([11, 12, '杂货店']),
			hospital: new Station([4, 14, '医院']),
			nurse: new Station([17, 16, '医院']),
			hnurse: new Station([17, 5, '医院']),
			door: new Station([321, 883, '鲁米那斯'])
		}, camp: {
			x: new Station([90, 86, '圣骑士营地']),
			sell: new Station([20, 23, '工房']),
			hnurse: new Station([10, 12, '医院']),
			nurse: new Station([18, 15, '医院']),
			out: new Station([550, 332, '医院'])
		}, jenova: {
			nout: new Station([265,434,'莎莲娜']),
			wout: new Station([216,456,'莎莲娜'])
		}
	};
	Network.getCurrentStation = () => {
		const info = cga.emogua.getMapInfo();
		for (let obj of Object.values(Network)) {
			if (typeof obj == 'object') {
				for (let station of Object.values(obj)) {
					if (
						station instanceof Station && (
							station.idString == (info.x + '-' + info.y + '-' + info.name) ||
							station.idString == (info.x + '-' + info.y + '-' + info.indexes.index3)
						)
					) {
						return station;
					}
				}
			}
		}
	};
	Network.elsa.x.links = [
		new Link(Network.elsa.a), new Link(Network.elsa.b),
		new Link(Network.castle.x, () => {
			let times = 0;
			return cga.emogua.recursion(
				() => cga.emogua.talkNpc(141,104,cga.emogua.talkNpcSelectorYes, '里谢里雅堡').then(
					() => {
						return Promise.reject();
					},
					() => {
						if (times > 3) {
							return cga.LogOut();
						}
						times++;
						return cga.emogua.logBack();
					}
				)
			);
		})
	];
	Network.elsa.a.links = [
		new Link(Network.asha.w, () => cga.emogua.turnOrientation(0))
	];
	Network.asha.w.links = [
		new Link(Network.asha.s, () => cga.emogua.turnOrientation(4))
	];
	Network.asha.s.links = [
		new Link(Network.asha.n, () => cga.emogua.turnOrientation(5))
	];
	Network.asha.n.links = [
		new Link(Network.elsa.a, () => cga.emogua.turnOrientation(4))
	];
	const castleF1Link = new Link(Network.castle.f1, () => cga.emogua.autoWalk([41, 50, '里谢里雅堡 1楼']));
	Network.castle.x.links = [
		new Link(Network.castle.nurse), new Link(Network.castle.clock), new Link(Network.castle.s),
		castleF1Link
	];
	Network.castle.s.links = [
		new Link(Network.castle.nurse), new Link(Network.castle.clock), new Link(Network.castle.x),castleF1Link,
		new Link(Network.falan.sell, () => cga.emogua.autoWalkList([
			[40,98,'法兰城'], Network.falan.sell.id
		])),
		new Link(Network.falan.s1, () => cga.emogua.autoWalkList([
			[40,98,'法兰城'], Network.falan.s1.id
		])),
		new Link(Network.falan.s2, () => cga.emogua.autoWalkList([
			[40,98,'法兰城'], Network.falan.s2.id
		])),
	];
	Network.castle.f1.links = [
		new Link(Network.castle.teleport, () => cga.emogua.autoWalk([45, 20, '启程之间']))
	];
	Network.castle.nurse.links = [
		new Link(Network.castle.s), new Link(Network.castle.x), new Link(Network.castle.clock), castleF1Link
	];
	Network.castle.clock.links = [
		new Link(Network.castle.s), castleF1Link
	];
	Network.castle.teleport.links = [
		new Link(Network.teleport.yer, () => cga.emogua.autoWalk([43,32]).then(
			() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes,'伊尔村的传送点')
		).then(
			() => cga.emogua.autoWalkList([
				[12,17,'村长的家'],[6,13,'伊尔村']
			])
		)),
		new Link(Network.teleport.laruka, () => cga.emogua.autoWalk([43, 43]).then(
			() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes,'圣拉鲁卡村的传送点')
		).then(
			() => cga.emogua.autoWalkList([
				[7,3,'村长的家'],[2,9,'圣拉鲁卡村']
			])
		)),
		new Link(Network.teleport.aleut, () => cga.emogua.autoWalk([43, 22]).then(
			() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes,'亚留特村的传送点')
		).then(
			() => cga.emogua.autoWalkList([
				[8,3,'村长的家'],[6,13,'亚留特村']
			])
		)),
		new Link(Network.teleport.kili, () => cga.emogua.autoWalk([8, 33]).then(
			() => cga.emogua.talkNpc(6,cga.emogua.talkNpcSelectorYes,'奇利村的传送点')
		).then(
			() => cga.emogua.autoWalkList([
				[7, 6, '*'],[7, 1, '*'],[1, 8, '奇利村']
			])
		)),
		new Link(Network.teleport.jenova, () => cga.emogua.autoWalk([15, 4]).then(
			() => cga.emogua.talkNpc(0,cga.emogua.talkNpcSelectorYes,'杰诺瓦镇的传送点')
		).then(
			() => cga.emogua.autoWalkList([
				[14,6,'村长的家'],[1,9,'杰诺瓦镇']
			])
		)),
		new Link(Network.teleport.vinoy, () => cga.emogua.autoWalk([9, 22]).then(
			() => cga.emogua.talkNpc(4,cga.emogua.talkNpcSelectorYes,'维诺亚村的传送点')
		).then(
			() => cga.emogua.autoWalkList([
				[5,1,'村长家的小房间'],[0,5,'村长的家'],[10,16,'维诺亚村']
			])
		)),
		new Link(Network.teleport.ghana, () => cga.emogua.autoWalk([9, 43]).then(
			() => cga.emogua.talkNpc(8,43,cga.emogua.talkNpcSelectorYes,'加纳村的传送点')
		).then(
			() => cga.emogua.autoWalkList([
				[5,12,'村长的家'],[1,9,'加纳村']
			])
		))
	];
	Network.teleport.aleut.links = [
		new Link(Network.aleut.eout, () => cga.emogua.autoWalkList([
			[51,65],[67,64,'芙蕾雅']
		])),
		new Link(Network.aleut.nout, () => cga.emogua.autoWalkList([
			[58,31,'芙蕾雅']
		]))
	];
	Network.teleport.yer.links = [
		new Link(Network.grahl.s, () => cga.emogua.autoWalk([58,71]).then(
			() => cga.emogua.talkNpc(59,71,cga.emogua.talkNpcSelectorYes, '伊尔')
		).then(
			() => cga.emogua.autoWalkList([
				[30,21,'港湾管理处'], [25,25] // 23,35 阿凯鲁法
			])
		).then(
			() => cga.emogua.talkNpc(6,cga.emogua.talkNpcSelectorYes, '往哥拉尔栈桥')
		).then(
			() => cga.emogua.autoWalk([51,50])
		).then(() => cga.emogua.recursion(
			() => cga.emogua.talkNpc(52,50,cga.emogua.talkNpcSelectorYes).then(() => {
				if (cga.GetMapName() == '铁达尼号') return Promise.reject();
				return cga.emogua.delay(10000);
			})
		)).then(
			() => cga.emogua.autoWalk([70,26])
		).then(
			() => cga.emogua.delay(400000)
		).then(() => cga.emogua.recursion(
			() => cga.emogua.talkNpc(71,26,cga.emogua.talkNpcSelectorYes).then(() => {
				if (cga.GetMapName() == '往伊尔栈桥') return Promise.reject();
				return cga.emogua.delay(10000);
			})
		)).then(
			() => cga.emogua.autoWalk([84,55])
		).then(
			() => cga.emogua.talkNpc(84,54,cga.emogua.talkNpcSelectorYes, '哥拉尔镇 港湾管理处')
		).then(
			() => cga.emogua.autoWalkList([
				[14,15,'哥拉尔镇'], [118,214]
			])
		))
	];
	Network.falan.s1.links = [
		new Link(Network.falan.s2), new Link(Network.falan.sell), new Link(Network.falan.sout,() => cga.emogua.autoWalk([153,241,'芙蕾雅'])),
		new Link(Network.falan.w1, () => cga.emogua.turnOrientation(6)),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,'流行商店'],Network.falan.fabric.id]))
	];
	Network.falan.s2.links = [
		new Link(Network.falan.s1), new Link(Network.falan.sell), new Link(Network.falan.sout,() => cga.emogua.autoWalk([153,241,'芙蕾雅'])),
		new Link(Network.falan.w2, () => cga.emogua.turnOrientation(0)),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,'流行商店'],Network.falan.fabric.id]))
	];
	Network.falan.sell.links = [
		new Link(Network.falan.s2), new Link(Network.falan.s1),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,'流行商店'],Network.falan.fabric.id])),
		new Link(Network.castle.s, () => cga.emogua.autoWalkList([[153,100,'里谢里雅堡']]))
	];
	Network.falan.w1.links = [
		new Link(Network.falan.w2), new Link(Network.falan.wout,() => cga.emogua.autoWalk([22,88,'芙蕾雅'])),
		new Link(Network.falan.e1, () => cga.emogua.turnOrientation(6)),
		new Link(Network.falan.whospital, () => cga.emogua.autoWalk([82,83,'医院']))
	];
	Network.falan.w2.links = [
		new Link(Network.falan.w1), new Link(Network.falan.wout,() => cga.emogua.autoWalk([22,88,'芙蕾雅'])),
		new Link(Network.falan.e2, () => cga.emogua.turnOrientation(0))
	];
	Network.falan.e1.links = [
		new Link(Network.falan.e2), new Link(Network.falan.eout,() => cga.emogua.autoWalk([281,88,'芙蕾雅'])),
		new Link(Network.falan.m1, () => cga.emogua.turnOrientation(0)),
		new Link(Network.falan.bank, () => cga.emogua.autoWalkList([
			[238,111,'银行'], Network.falan.bank.id
		]))
	];
	Network.falan.e2.links = [
		new Link(Network.falan.e1), new Link(Network.falan.eout,() => cga.emogua.autoWalk([281,88,'芙蕾雅'])),
		new Link(Network.falan.m2, () => cga.emogua.turnOrientation(6)),
		new Link(Network.falan.ehospital, () => cga.emogua.autoWalk([221,83,'医院']))
	];
	Network.falan.eout.links = [
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[513,282,'曙光骑士团营地'],[55,47,'辛希亚探索指挥部'],[7,4,[91, 6]],[95,9,[19, 28]],[8,21]
		]).then(() => cga.emogua.turnOrientation(4, '圣骑士营地')).then(
			() => cga.emogua.autoWalk(Network.camp.x.id)
		))
	];
	Network.falan.wout.links = [
		new Link(Network.falan.isle, () => cga.emogua.autoWalk([397,168]).then(
			() => cga.emogua.talkNpc(398,168,cga.emogua.talkNpcSelectorYes,'小岛')
		))
	];
	Network.falan.m1.links = [
		new Link(Network.falan.mbank), new Link(Network.falan.mrepair),
		new Link(Network.falan.s1, () => cga.emogua.turnOrientation(6))
	];
	Network.falan.mbank.links = [
		new Link(Network.falan.m1), new Link(Network.falan.mrepair)
	];
	Network.falan.mrepair.links = [
		new Link(Network.falan.m1), new Link(Network.falan.mbank)
	];
	Network.falan.m2.links = [
		new Link(Network.falan.s2, () => cga.emogua.turnOrientation(6))
	];
	Network.grahl.s.links = [
		new Link(Network.grahl.c, () => cga.emogua.turnOrientation(0))
	];
	Network.grahl.c.links = [
		new Link(Network.grahl.s, () => cga.emogua.turnOrientation(6)),
		new Link(Network.grahl.lumi, () => cga.emogua.autoWalkList([
			[176,105,'库鲁克斯岛'],[477,525]
		]).then(
			() => cga.emogua.talkNpc(477,526,cga.emogua.talkNpcSelectorYes,[476,528])
		).then(
			() => cga.emogua.autoWalk([322,883,'鲁米那斯'])
		))
	];
	Network.grahl.lumi.links = [
		new Link(Network.lumi.hospital, () => cga.emogua.autoWalk([87,35,'医院'])),
		new Link(Network.lumi.sell, () => cga.emogua.autoWalkList([
			[88,51,'杂货店'],Network.lumi.sell.id
		]))
	];
	Network.lumi.hospital.links = [
		new Link(Network.lumi.nurse), new Link(Network.lumi.hnurse)
	];
	Network.lumi.nurse.links = [
		new Link(Network.lumi.sell, () => cga.emogua.autoWalkList([
			[4,14,'鲁米那斯'],[88,51,'杂货店'],Network.lumi.sell.id
		])),
		new Link(Network.lumi.door, () => cga.emogua.autoWalkList([
			[4,14,'鲁米那斯'],[60,29,'库鲁克斯岛']
		]))
	];
	Network.lumi.hnurse.links = Network.lumi.nurse.links;
	Network.lumi.sell.links = [
		new Link(Network.lumi.door, () => cga.emogua.autoWalkList([
			[4,14,'鲁米那斯'],[60,29,'库鲁克斯岛']
		])),
		new Link(Network.lumi.hospital, () => cga.emogua.autoWalkList([
			[4,14,'鲁米那斯'],[87,35,'医院']
		]))
	];
	Network.lumi.door.links = [
		new Link(Network.grahl.lumi, () => cga.emogua.autoWalk([322,883,'鲁米那斯']))
	];
	Network.camp.x.links = [
		new Link(Network.camp.sell, () => cga.emogua.autoWalkList([
			[87,72,'工房'],[20,23]
		])),
		new Link(Network.camp.nurse, () => cga.emogua.autoWalkList([
			[95,72,'医院'],Network.camp.nurse.id
		])),
		new Link(Network.camp.hnurse, () => cga.emogua.autoWalkList([
			[95,72,'医院'],Network.camp.hnurse.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[36,87,'肯吉罗岛']
		]))
	];
	Network.camp.sell.links = [
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[30,37,'圣骑士营地'],Network.camp.x.id
		])),
		new Link(Network.camp.nurse, () => cga.emogua.autoWalkList([
			[30,37,'圣骑士营地'],[95,72,'医院'],Network.camp.nurse.id
		])),
		new Link(Network.camp.hnurse, () => cga.emogua.autoWalkList([
			[30,37,'圣骑士营地'],[95,72,'医院'],Network.camp.hnurse.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[30,37,'圣骑士营地'],[36,87,'肯吉罗岛']
		]))
	];
	Network.camp.nurse.links = [
		new Link(Network.camp.hnurse),
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[0,20,'圣骑士营地'],Network.camp.x.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[0,20,'圣骑士营地'],[36,87,'肯吉罗岛']
		]))
	];
	Network.camp.hnurse.links = [
		new Link(Network.camp.nurse),
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[0,20,'圣骑士营地'],Network.camp.x.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[0,20,'圣骑士营地'],[36,87,'肯吉罗岛']
		]))
	];
	Network.teleport.jenova.links = [
		new Link(Network.jenova.nout, () => cga.emogua.autoWalk([71,18,'莎莲娜'])),
		new Link(Network.jenova.wout, () => cga.emogua.autoWalk([24,40,'莎莲娜']))
	];
	Network.landings = [Network.elsa.x, Network.falan.s1, Network.falan.s2, Network.falan.w1, Network.falan.w2, Network.falan.e1, Network.falan.e2];
	const reducePaths = (paths) => {
		const result = [];
		paths.forEach(p => {
			if (p.length > 0) {
				if (p[0] instanceof Array) {
					result.push(...p);
				} else {
					result.push(p);
				}
			}
		});
		return result;
	};
	Network.getLinkPaths = (links, target, preStations = []) => {
		return reducePaths(
			links.map(link => {
				if (preStations.findIndex(s => s.idString == link.station.idString) > -1) return [];
				if (link.station.idString == target.idString) return [link];
				let subs = Network.getLinkPaths(link.station.links, target, preStations.concat(link.station));
				subs.forEach(sub => sub.unshift(link));
				return subs;
			})
		);
	};
	cga.emogua.goto = (targetFunction, count = 0) => {
		const target = targetFunction(Network);
		if (target) {
			return Promise.resolve().then(() => {
				if (cga.GetMapName() == '艾尔莎岛') {
					return cga.emogua.autoWalk(Network.elsa.x.id);
				}
			}).then(
				() => Network.getCurrentStation() || cga.emogua.logBack().then(() => Network.getCurrentStation())
			).then(current => {
				if (!current) {
					console.log('No current to target=' + target.id);
					return Promise.reject();
				}
				if (current.idString != target.idString) {
					return Promise.resolve().then(() => {
						const paths = Network.getLinkPaths(current.links, target);
						if ((!paths || paths.length == 0) && Network.landings.findIndex(l => l.idString == current.idString) < 0) {
							return cga.emogua.logBack().then(
								() => Network.getLinkPaths(Network.getCurrentStation().links, target)
							);
						}
						return paths;
					}).then(paths => {
						if (!paths || paths.length == 0) {
							if (count > 3) {
								console.log('No path to target=' + target.id);
								return Promise.reject();
							}
							return cga.emogua.logBack().then(
								() => cga.emogua.goto(targetFunction, count + 1)
							);
						}
						let short;
						for (let p of paths) {
							if (!short) {
								short = p;
							} else if (short.length > p.length) {
								short = p;
							}
						}
						return short.reduce((a,c) => a.then(() => c.arrive()), Promise.resolve()).catch(() => {
							if (count > 3) {
								console.log('Goto tried ' + count + ' times failed');
								return Promise.reject();
							}
							return cga.emogua.goto(targetFunction, count + 1);
						});
					});
				}
			});
		}
		console.log('targetFunction is not valid');
		return Promise.reject();
	};
	cga.emogua.getDwarfBadge = () => {
		if (cga.getInventoryItems().length == 20) {
			return Promise.resolve();
		}
		return cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getEscapeSets()).then(() => {
			const old = cga.GetItemsInfo().find(i => i.name == '矮人徽章');
			if (old) {
				const durability = cga.emogua.getDurability(old);
				if (durability.current < 100) {
					return cga.emogua.dropItems([old.pos]).then(() => true);
				}
				return Promise.resolve(false);
			}
			return Promise.resolve(true);
		}).then(fetch => {
			if (fetch) {
				return cga.emogua.goto(n => n.castle.nurse).then(
					() => cga.emogua.recharge(0)
				).then(
					() => cga.emogua.goto(n => n.falan.sell)
				).then(
					() => cga.emogua.sell(6)
				).then(
					() => cga.emogua.goto(n => n.camp.x)
				).then(
					() => cga.emogua.autoWalkList([
						[116,55,'酒吧'],[14,4]
					])
				).then(
					() => cga.emogua.talkNpc(14,5,cga.emogua.talkNpcSelectorYes)
				).then(
					() => cga.emogua.autoWalkList([
						[0,23,'圣骑士营地'],[90,86],[36,87,'肯吉罗岛'],[384,245,'蜥蜴洞穴'],[12,2,'肯吉罗岛'],[231,434,'矮人城镇'],[97,124]
					])
				).then(
					() => cga.emogua.talkNpc(96,124,cga.emogua.talkNpcSelectorYes)
				).then(
					() => {
						const badge = cga.GetItemsInfo().find(i => i.name == '矮人徽章');
						if (badge && cga.getEquipItems().findIndex(e => e.name == '王者守护神') < 0) {
							return cga.emogua.useItem(badge.pos);
						}
					}
				).then(() => fetch);
			}
			return fetch;
		}).then(r => {
			if (BattleStrategyCache.length == 2) {
				return cga.emogua.autoBattle(BattleStrategyCache[0]).then(() => r);
			}
			return r;
		});
	};
	const DropItemNames = ['时间的碎片','时间的结晶','绿头盔','秘文之皮','星之砂','奇香木','巨石','龙角','坚硬的鳞片','传说的鹿皮','碎石头'];
	cga.emogua.addDropItemNames = (names) => {
		DropItemNames.push(...names);
	};
	cga.emogua.dropItems = (positions) => {
		if (cga.isInNormalState() && !cga.emogua.isMoving()) {
			if (positions instanceof Array) {
				positions.forEach(position => cga.DropItem(position));
			} else if (typeof positions == 'function') {
				cga.getInventoryItems().filter(positions).forEach(i => cga.DropItem(i.pos));
			} else {
				cga.getInventoryItems().filter(i => DropItemNames.indexOf(i.name) >= 0).forEach(i => cga.DropItem(i.pos));
			}
		}
		return cga.emogua.delay(500);
	};
	cga.emogua.useItem = (position) => {
		if (position) cga.UseItem(position);
		return cga.emogua.delay(500);
	}
	cga.emogua.getEmptyBagIndexes = (items = cga.getInventoryItems()) => {
		const itemIndexes = items.map(e => e.pos);
		const result = new Array();
		for (let bagIndex = 8; bagIndex < 28; bagIndex++) {
			if (itemIndexes.indexOf(bagIndex) < 0) {
				result.push(bagIndex);
			}
		}
		return result;
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
	 *     [[name | matcher, pileMax]]
	 *     pileMax: 最大可叠加数
	 *     空或者不传表示存全部
	 * size
	 *     银行大小  默认20
	 * 返回
	 *     true 银行已满
	 */
	cga.emogua.saveToBank = (list, size = 20) => {
		const bankList = cga.GetBankItemsInfo();
		const bankMax = 99 + size;
		const isSavable = (slot) => {
			return list && list.findIndex(e => {
				if (typeof e[0] == 'string') return e[0] == slot.name && slot.count > 0 && slot.count < e[1];
				else if (typeof e[0] == 'function') return e[0](slot) && slot.count > 0 && slot.count < e[1];
				else return false;
			}) > -1;
		};
		let bankSlotIndex = 100;
		const toSavableSlotIndex = (item) => {
			while (bankSlotIndex <= bankMax) {
				const slot = bankList.find(b => b.pos == bankSlotIndex);
				if ((!slot || isSavable(slot))) {
					cga.MoveItem(item.pos, bankSlotIndex, -1);
					if (slot) slot.count = slot.count + item.count;
					else bankList.push({pos: bankSlotIndex, count: item.count});
					return true;
				}
				bankSlotIndex++;
			}
			return false;
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
		if (items.length > 0) {
			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				result = result.then(() => toSavableSlotIndex(items[itemIndex]));
			}
		}
		return result.then(() => cga.emogua.delay(1000)).then(() => bankList.length >= size);
	};
	const getTradeItems = (filter = (c, previous) => false) => {
		const tradeItems = [];
		cga.getInventoryItems().forEach(i => {
			if (filter(i, tradeItems)) {
				const item = {itemid: i.itemid, itempos: i.pos, count: (i.count > 1 ? i.count : 1), name: i.name};
				tradeItems.push(item);
			}
		});
		return tradeItems;
	};
	const getTradePets = (filter = (c, previous) => false) => {
		const tradePets = [];
		cga.GetPetsInfo().forEach(p => {
			if (filter(p, tradePets)) {
				tradePets.push(p);
			}
		});
		return tradePets.map(p => p.index);
	}
	/**
	 * params {itemFilter: (c, previous) => false, petFilter: (c, previous) => false, gold: 0, partyStuffsChecker: (partyInfo) => true}
	 * partyInfo {partyName: '', items: [{name:'', attr:'', itemid: 5281, count: 0, pos: 0, level: 9, type: 6281 }], gold: 0, pets: [{}]}
	 */
	const tradeInternal = (params = {}, callback, partyName, initiative = false) => {
		const receivedStuffs = {items: [], gold: 0, pets: [], partyName: partyName};
		const waitReceivedStuffsRecursively = (timeout = 15000) => cga.AsyncWaitTradeStuffs((error, type, args) => setTimeout(() => {
			const success = typeof type == 'number';
			if (success) {
				waitReceivedStuffsRecursively(2000);
				if (type == cga.TRADE_STUFFS_ITEM) {
					receivedStuffs.items = args;
				} else if (type == cga.TRADE_STUFFS_GOLD) {
					receivedStuffs.gold = args;
				} else if (type == cga.TRADE_STUFFS_PET) {
					receivedStuffs.pets = args;
				}
			}
		}, 0), timeout);
		const waitTradeStateRecursively = (timeout = 15000, lastState) => cga.AsyncWaitTradeState((error, state) => setTimeout(() => {
			if (typeof state == 'number' && state == cga.TRADE_STATE_READY) {
				if (!params.partyStuffsChecker || (typeof params.partyStuffsChecker == 'function' && params.partyStuffsChecker(receivedStuffs))) {
					if (!initiative) {
						cga.TradeAddStuffs(
							getTradeItems(params.itemFilter),
							getTradePets(params.petFilter),
							(typeof params.gold == 'number') ? params.gold : 0
						);
					}
					cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
					waitTradeStateRecursively(timeout, state);
				} else {
					cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
					callback({success: false});
				}
			} else if (typeof state == 'number' && state == cga.TRADE_STATE_SUCCEED) {
				callback({success: true, received: receivedStuffs});
			} else if (typeof state == 'number' && state == cga.TRADE_STATE_CANCEL) {
				if (typeof lastState == 'number') callback({success: false});
				else waitTradeStateRecursively(2000, state);
			} else if (typeof state == 'number' && state == cga.TRADE_STATE_CONFIRM) {
				cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
				waitTradeStateRecursively(timeout, state);
			} else {
				callback({success: false});
			}
		}, 0), timeout);
		if (initiative) {
			cga.TradeAddStuffs(
				getTradeItems(params.itemFilter),
				getTradePets(params.petFilter),
				(typeof params.gold == 'number') ? params.gold : 0
			);
		}
		waitReceivedStuffsRecursively();
		waitTradeStateRecursively();
	};
	cga.emogua.trade = (partyName, params = {}) => new Promise((resolve) => {
		cga.DoRequest(cga.REQUEST_TYPE_TRADE);
		cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => {
			if (!(players instanceof Array)) players = [];
			var player = players.find(p => (typeof partyName == 'number') ? p.index == partyName : p.name == partyName);
			if (player) {
				cga.PlayerMenuSelect(player.index);
				cga.AsyncWaitTradeDialog((error, partyName, partyLevel) => setTimeout(() => {
					if (typeof partyLevel == 'number') {
						tradeInternal(params, resolve, player.name, true);
					} else {
						resolve({success: false});
					}
				}, 0), 2000);
			} else resolve({success: false});
		}, 0), 2000);
	}).then(result => cga.emogua.delay(300).then(() => result));;
	cga.emogua.waitTrade = (params = {}) => new Promise((resolve) => {
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);
		cga.AsyncWaitTradeDialog((error, partyName, partyLevel) => setTimeout(() => {
			cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
			if (typeof partyLevel == 'number') {
				tradeInternal(params, resolve, partyName);
			} else {
				resolve({success: false});
			}
		}, 0), 15000);
	}).then(result => cga.emogua.delay(300).then(() => result));
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
		const checker = (protect && typeof protect.checker == 'function') ? protect.checker : null;
		// cga.emogua.getTeammates().findIndex(t => t.hp < minHp || t.mp < minMp) > -1
		if (
			playerInfo.hp < minHp || playerInfo.mp < minMp ||
			cga.getInventoryItems().length > maxItemNumber ||
			pets.length > maxPetNumber ||
			pets.filter(e => e.battle_flags == 2).findIndex(p => p.hp < minPetHp || p.mp < minPetMp) >= 0 ||
			(checker && checker())
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
		else return cga.emogua.delay(500).then(() => {
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
					return cga.emogua.delay(80).then(() => {
						if (stopEncounter) return Promise.reject();
						else if (!cga.isInNormalState()) {
							return cga.emogua.waitAfterBattle().then(() => {
								const current = cga.GetMapXY();
								return (current.x == startPosition.x && current.y == startPosition.y) ? recursion(movePosition.orientation) : recursion(cga.emogua.getOrientation(startPosition.x, startPosition.y));
							});
						}
						else return recursion((direction + 4) % 8);
					});
				};
				if (movePosition) {
					protectRecursion().catch(() => console.log('触发保护'));
					cga.emogua.waitMessageUntil((chat) => {
						if (chat.msg && chat.msg.indexOf('触发战斗保护') >= 0) {
							if (cga.emogua.getTeammates().find(t => t.unit_id == chat.unitid)) {
								return stopEncounter = true;
							}
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
			const p = cga.GetMapXY();
			if (entries.findIndex(e => e.mapx == p.x && e.mapy == p.y) >= 0) {
				let position = cga.emogua.getMovablePositionAround(p);
				if (position) return cga.emogua.waitAfterBattle().then(
					() => cga.emogua.walkList([[position.x, position.y]])
				).then(
					() => start()
				);
				return Promise.reject('无法遇敌');
			} else {
				return start();
			}
		}).catch(e => {
			console.log('encounter', e);
		});
	};
	cga.emogua.joinTeam = (x, y, name) => {
		if (cga.emogua.getTeamNumber() == 1) {
			const captain = cga.GetMapUnits().find(e => e.type === 8 && e.unit_name === name);
			if (captain && captain.xpos === x && captain.ypos === y) {
				return cga.emogua.turnTo(x, y).then(
					() => cga.emogua.delay(500)
				).then(
					() => cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM)
				).then(
					() => cga.emogua.waitNPCDialog(dialog => {
						if (dialog.type === 2) {
							cga.ClickNPCDialog(-1, dialog.message.split('\n').findIndex(e => e === name) - 2);
							return cga.emogua.delay(1000);
						}
					})
				).then(() => {
					if (cga.emogua.getTeamNumber() > 1) return Promise.resolve();
					return Promise.reject();
				});
			}
			return Promise.reject();
		}
		return Promise.resolve();
	};
	cga.emogua.leaveTeam = () => {
		cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
		return cga.emogua.delay(1000);
	}
	cga.emogua.waitTeamBlock = (total, interruptor, timer = Date.now()) => {
		return Promise.resolve().then(() => {
			const number = cga.emogua.getTeamNumber();
			if (number >= total) {
				console.log(`组队已满(${total})`);
				return number;
			}
			const inerval = Date.now() - timer;
			if (typeof interruptor == 'function' && interruptor(timer)) {
				console.log(`组队中断`);
				return number;
			}
			if (inerval <= 3000) console.log(`等待组队满人数(${total})...`);
			return cga.emogua.delay(3000).then(
				() => cga.emogua.waitTeamBlock(total, interruptor, timer)
			);
		});
	};
	cga.emogua.joinTeamBlock = (x, y, name) => Promise.resolve().then(() => {
		console.log(`尝试加入(${name})的队伍...`);
		return cga.emogua.joinTeam(x, y, name).catch(
			() => cga.emogua.delay(3000).then(
				() => cga.emogua.joinTeamBlock(x, y, name)
			)
		);
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
		}).then(() => cga.emogua.delay(1000));
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
		}).then(() => cga.emogua.pile(true));
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
		}).then(() => cga.emogua.pile(true));
		else return Promise.resolve();
	};
	cga.emogua.sell = function(x, y, filter) {
		if (typeof y == 'function') {
			filter = y;
			y = null;
		}
		if (!filter) filter = (e) => e.name == '魔石' || e.name.indexOf('卡片') > -1 || e.name == '锥形水晶';

		const sellList = cga.getInventoryItems().filter(filter).map(e => {
			let sellCount = (e.count < 1) ? 1 : e.count;
			if ([30, 34, 35].indexOf(e.type) >= 0) {
				sellCount = parseInt(e.count / 20);
			} else if ([43, 23].indexOf(e.type) >= 0) {
				sellCount = parseInt(e.count / 3);
			}
			return {itempos: e.pos, itemid: e.itemid, count: sellCount};
		});
		if (sellList.length > 0) {
			return cga.emogua.talkNpc(x, y, dialog => {
				if (dialog.type == 5) {
					cga.ClickNPCDialog(-1, dialog.message.charAt(dialog.message.length - 1) == '3' ? 1 : 0);
					return true;
				}
				if (dialog.type == 7) {
					cga.SellNPCStore(sellList);
				}
			}).then(() => cga.emogua.delay(500)).then(
				() => cga.emogua.sell(x, y, filter)
			);
		}
		return Promise.resolve();
	};
	// cga.GetCraftStatus() 0 打开制造界面 1 制造中 2 制造完成 4 修理中 | 鉴定中
	cga.emogua.waitWorkResult = (timeout = 50000) => new Promise((resolve, reject) => {
		cga.AsyncWaitWorkingResult((error, r) => setTimeout(() => {
			let result = r;
			if (error) {
				result = {
					success: false,
					error: true
				};
			}
			resolve(result);
		}, 0), timeout);
	});
	cga.emogua.craft = (name) => {
		const requireInfo = cga.getItemCraftInfo(name);
		if (requireInfo) {
			const findJewel = ['制药', '料理'].indexOf(requireInfo.skill.name) < 0;
			const materials = requireInfo.craft.materials;
			return cga.emogua.recursion(() => {
				const items = cga.getInventoryItems();
				materials.forEach(material => {
					const item = items.find(i => i.name == material.name && i.count >= material.count);
					material.position = item && item.pos;
				});
				let jewelPosition = -1;
				if (findJewel) {
					const jewel = items.find(i => i.type == 38 && i.assessed);
					if (jewel) jewelPosition = jewel.pos;
				}
				if (materials.filter(m => !m.position).length == 0) {
					const positions = [0,0,0,0,0,0];
					materials.forEach((m, index) => {
						positions[index] = m.position;
					});
					if (jewelPosition > 0) positions[5] = jewelPosition;
					cga.SetImmediateDoneWork(true);
					if (cga.StartWork(requireInfo.skill.index, requireInfo.craft.index)) {
						cga.CraftItem(requireInfo.skill.index, requireInfo.craft.index, 0, positions);
						return cga.emogua.waitWorkResult().then(r => cga.emogua.pile(true));
					}
					return Promise.resolve();
				}
				return Promise.reject();
			});
		}
		return Promise.resolve();
	};
	const durabilityPattern = /耐久 (\d+)\/(\d+)/;
	cga.emogua.getDurability = (item) => {
		if (item && item.attr) {
			const matchResult = durabilityPattern.exec(item.attr);
			if (matchResult && matchResult.length == 3) {
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
		return {
			current: 0,
			max: 0,
			rate: 0
		};
	};
	cga.emogua.assessAll = () => {
		const skill = cga.GetSkillsInfo().find(e => e.name == '鉴定');
		let result = Promise.resolve();
		if (skill) {
			cga.getInventoryItems().filter(i => !i.assessed && i.level <= skill.lv).forEach(item => {
				result = result.then(() => cga.emogua.recursion(() => {
					cga.SetImmediateDoneWork(true);
					cga.StartWork(skill.index, 0);
					if (cga.GetPlayerInfo().mp >= (item.level * 10) && cga.AssessItem(skill.index, item.pos)) {
						return cga.emogua.waitWorkResult().then(r => {
							if (r.success) {
								return Promise.reject();
							}
						});
					}
					return Promise.reject();
				})).then(() => cga.emogua.delay(200));
			});
		}
		return result.then(() => cga.emogua.delay(500));
	};
	cga.emogua.repairAll = () => {
		const skill = cga.GetSkillsInfo().filter(e => e.name.indexOf('修理') >= 0).sort((e1, e2) => e2.lv - e1.lv)[0];

		let result = Promise.resolve();
		if (skill) {
			cga.getInventoryItems().filter(eq => {
				if (
					(
						(skill.name == '修理武器' && eq.type >= 0 && eq.type <= 6) ||
						(skill.name == '修理防具' && eq.type >= 7 && eq.type <= 14)
					) && (eq.level <= skill.lv || (eq.level <= 11 && skill.lv == 10))
				) {
					const durability = cga.emogua.getDurability(eq);
					return durability && durability.current < durability.max;
				}
				return false;
			}).forEach(item => result = result.then(
				() => cga.emogua.recursion(() => {
					cga.SetImmediateDoneWork(true);
					cga.StartWork(skill.index, 0);
					if (cga.GetPlayerInfo().mp >= (item.level * 10) && cga.AssessItem(skill.index, item.pos)) {
						return cga.emogua.waitWorkResult().then(r => {
							if (r.success) {
								return Promise.reject();
							}
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
			cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => {
				if (players && players.length > 0) {
					const index = players.findIndex(p => p.name == needHealTeammate.name);
					if (typeof index == 'number') {
						cga.PlayerMenuSelect(index);
						cga.AsyncWaitUnitMenu((error, units) => setTimeout(() => {
							if (error) {
								resolve();
							} else {
								cga.UnitMenuSelect(0);
								cga.AsyncWaitWorkingResult((error, result) => setTimeout(resolve, 0));
							}
						}, 0));
					} else resolve();
				} else resolve();
			}, 0), 2000);
		} else resolve();
	});
	cga.emogua.healSelf = (playerInfo = cga.GetPlayerInfo()) => {
		const skill = cga.GetSkillsInfo().find(s => s.name == '治疗');
		if (skill) {
			const requireMp = 25 + skill.lv * 5;
			if (playerInfo.health > 0 && playerInfo.mp >= requireMp) {
				return new Promise((resolve, reject) => {
					cga.StartWork(skill.index, skill.lv-1);
					cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => {
						if (players && players.length > 0) {
							const index = players.findIndex(p => p.name == playerInfo.name);
							if (typeof index == 'number') {
								cga.PlayerMenuSelect(index);
								cga.AsyncWaitUnitMenu((error, units) => setTimeout(() => {
									if (error) {
										resolve();
									} else {
										cga.UnitMenuSelect(0);
										cga.AsyncWaitWorkingResult((error, result) => setTimeout(resolve, 0));
									}
								}, 0));
							} else resolve();
						} else resolve();
					}, 0), 2000);
				}).then(() => cga.emogua.healSelf());
			}
		}
		return Promise.resolve();
	};
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
				return cga.emogua.goto(n => n.falan.w1).then(
					() => cga.emogua.autoWalkList([
						[94,78,'达美姊妹的店'], [17,18]
					])
				).then(
					() => cga.emogua.buy(0, [{index: crystalStoreIndex, count: 1}])
				).then(
					() => cga.emogua.useCrystal(name)
				);
			}
		}
		return Promise.resolve();
	};
	cga.emogua.needHnurse = (playerInfo = cga.GetPlayerInfo()) => {
		const profession = cga.emogua.getPlayerProfession();
		if (profession && ['物理系','魔法系','宠物系'].indexOf(profession.category) >= 0) {
			const zsCost = (playerInfo.level - 1) * 15 + 137;
			return playerInfo.maxmp - playerInfo.mp - zsCost > 0;
		}
		return false;
	};
	let equipmentMinDurability = 30;
	cga.emogua.setEquipmentMinDurability = (durability) => {
		if (typeof durability == 'number') {
			equipmentMinDurability = durability;
		}
		return Promise.resolve();
	};
	cga.emogua.tidyupEquipments = () => Promise.resolve().then(() => {
		const availableEquipments = cga.getInventoryItems().filter(
			i => i.type >= 0 && i.type <= 14 && i.name != '狐皮披风' && cga.emogua.getDurability(i).current > equipmentMinDurability
		);
		if (availableEquipments.length > 0 && cga.isInNormalState()) {
			availableEquipments.forEach(e => cga.emogua.useItem(e.pos));
			return cga.emogua.delay(500);
		}
	}).then(() => {
		let index = 0;
		let emptyIndexes = cga.emogua.getEmptyBagIndexes();
		if (emptyIndexes.length > 0 && cga.isInNormalState()) {
			cga.GetItemsInfo().filter(
				i => i.pos <= 4 && cga.emogua.getDurability(i).current <= equipmentMinDurability
			).forEach(takeOff => {
				if (emptyIndexes[index]) {
					cga.MoveItem(takeOff.pos, emptyIndexes[index++], -1);
				}
			});
			return cga.emogua.delay(500);
		}
	});
	/**
	 * options
	 *     {
	 *         sellFilter: function | false
	 *         rechargeFlag: -1 不补血魔
	 *         repairFlag: 1 正常 2 全部 -1 not
	 *         crystalName: '',
	 *         badge: false | true,
	 *         doctorName: ''
	 *     }
	 */
	cga.emogua.prepare = (options) => {
		options = options ? options : {};
		const validMaps = ['法兰城', '里谢里雅堡', '艾尔莎岛'];

		const getBackSouls = () => {
			const playerInfo = cga.GetPlayerInfo();
			if (playerInfo.souls > 0) {
				console.log('你丢掉了灵魂');
				if (playerInfo.gold < 10000) {
					console.log('可能没钱招魂!');
					return Promise.reject();
				}
				return cga.emogua.goto(n => n.castle.x).then(
					() => cga.emogua.autoWalkList([
						[41,14,'法兰城'],[154,29,'大圣堂的入口'],[14,7,'礼拜堂'],[12,19]
					])
				).then(
					() => cga.emogua.talkNpc(6,cga.emogua.talkNpcSelectorYes)
				);
			}
			return Promise.resolve();
		};
		const crystal = () => {
			if (options && options.crystalName) return cga.emogua.useCrystal(options.crystalName);
			return Promise.resolve();
		};
		const sell = () => {
			const filter = (item) => {
				if (item.name == '魔石' || item.name.indexOf('卡片') >= 0 || item.name == '锥形水晶') return true;
				else if (item.type >= 0 && item.type <= 14 && item.level <= 10) {
					const durability = cga.emogua.getDurability(item);
					return durability && durability.current == durability.max && durability.current <= equipmentMinDurability;
				} else if (options && typeof options.sellFilter == 'function') {
					return options.sellFilter(item);
				}
				return false;
			};
			if (typeof options.sellFilter != 'boolean' && cga.getInventoryItems().filter(filter).length > 0) {
				return cga.emogua.goto(n => n.falan.sell).then(
					() => cga.emogua.sell(6, filter)
				);
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
							(durability.current < durability.max && (repairFlag == 2 || durability.current <= equipmentMinDurability))
						)
					;
				}
				return false;
			};
			if (repairFlag > 0 && cga.GetItemsInfo().findIndex(needRepairChecker) >= 0 && cga.getInventoryItems().length < 20) {
				return cga.emogua.goto(n => n.falan.mbank).then(
					() => cga.emogua.autoWalk([82,8])
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
								if (tradeResult.success === true) {
									return cga.emogua.recursion(timer => cga.emogua.waitTrade().then(
										(backResult) => backResult.success === true || (Date.now() - timer) > 120000 ? Promise.reject() : Promise.resolve()
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
							const emptyIndexes = cga.emogua.getEmptyBagIndexes();
							if (emptyIndexes.length > 0) {
								return Promise.resolve(cga.MoveItem(item.pos, emptyIndexes[0], -1)).then(
									() => cga.emogua.delay(300)
								);
							}
						}
					}
				}));
			} else return Promise.resolve();
		};
		const recharge = () => {
			const rechargeFlag = typeof options.rechargeFlag == 'number' ? options.rechargeFlag : 1;
			const playerInfo = cga.GetPlayerInfo();
			const pets = cga.GetPetsInfo();
			const petHurt = pets.findIndex(e => e.health > 0) > -1;
			if (rechargeFlag > 0 && (playerInfo.hp < playerInfo.maxhp || playerInfo.mp < playerInfo.maxmp || pets.find(p => p.hp < p.maxhp || p.mp < p.maxmp))) {
				return Promise.resolve().then(() => {
					const needh = cga.emogua.needHnurse(playerInfo);
					if (needh || petHurt) {
						return cga.emogua.goto(n => n.falan.whospital).then(() => {
							if (needh) return cga.emogua.walkTo([8, 32]).then(
								() => cga.emogua.recharge(4)
							);
							return cga.emogua.walkTo([9, 31]).then(
								() => cga.emogua.recharge(6)
							);
						}).then(() => {
							if (petHurt) return cga.emogua.autoWalk([10, 18]).then(
								() => cga.emogua.talkNpc(6, dialog => {
									if (dialog.options == 0) {
										cga.ClickNPCDialog(-1, 6);
									}
								})
							);
						});
					}
					return cga.emogua.goto(n => n.castle.nurse).then(
						() => cga.emogua.recharge(0)
					);
				}).then(() => {
					const newInfo = cga.GetPlayerInfo();
					if (newInfo.hp < newInfo.maxhp) {
						console.log('无法补血魔！！！');
						return Promise.reject();
					}
				});
			}
			return Promise.resolve();
		};
		const findDoctor = () => cga.emogua.recursion(() => {
			if (cga.GetPlayerInfo().health > 0) {
				return cga.emogua.goto(n => n.castle.x).then(() => {
					const profession = Professions.find(p => p.name == '医生');
					const units = cga.GetMapUnits();
					let doctor;
					if (options.doctorName) {
						doctor = units.find(u => u.type == 8 && u.unit_name == options.doctorName);
					} else {
						doctor = units.find(
							u => u.type == 8 && (
								profession.titles.indexOf(u.title_name) >= 0 || u.nick_name.indexOf('治疗') >= 0 || u.nick_name.indexOf('神医') >= 0 || u.nick_name.indexOf('医生') >= 0 || u.title_name.indexOf('医师') >= 0 || u.title_name.indexOf('医生') >= 0
							)
						);
					}
					if (doctor) {
						return cga.emogua.walkTo([doctor.xpos - 1, doctor.ypos]).then(
							() => cga.emogua.joinTeam(doctor.xpos, doctor.ypos, doctor.unit_name)
						).then(
							() => cga.emogua.delay(8000),
							() => false
						).then(cga.emogua.leaveTeam);
					}
					return cga.emogua.delay(10000);
				});
			}
			return false;
		});
		if (cga.emogua.getTeamNumber() == 1 && validMaps.includes(cga.GetMapName())) {
			return cga.emogua.pile(true).then(cga.emogua.dropItems).then(() => {
				const badge = typeof options.badge == 'boolean' ? options.badge : false;
				if (badge) {
					return cga.emogua.getDwarfBadge().then(r => r ? cga.emogua.logBack() : Promise.resolve());
				}
			}).then(findDoctor).then(recharge).then(getBackSouls).then(sell).then(repair).then(cga.emogua.tidyupEquipments).then(crystal);
		} else {
			return cga.emogua.pile(true).then(cga.emogua.dropItems);
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
		FORGET: 0x200
	};
	DebuffFlags.ANY = DebuffFlags.SLEEP | DebuffFlags.MEDUSA | DebuffFlags.DRUNK | DebuffFlags.CHAOS | DebuffFlags.FORGET;
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
	cga.emogua.DebuffFlags = DebuffFlags;
	cga.emogua.BattlePositionMatrix = BattlePositionMatrix;
	cga.emogua.AutoBattlePreset = {
		/**
		 * options {
		 *     rechargeMinHp: 300,
		 *     rechargeMinMp: 300,
		 * }
		 */
		getAttackSets: (options) => {
			options = options ? options : {};
			const sets = [];

			sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeHpAction(options.rechargeMinHp ? options.rechargeMinHp : 300));
			sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeMpAction(options.rechargeMinMp ? options.rechargeMinMp : 300));
			const profession = cga.emogua.getPlayerProfession();
			if (profession) {
				if (profession.name == '弓箭手') {
					sets.push({
						user: 1,
						check: context => context.enemies.length >= 3,
						type: '技能',skillName: '乱射',skillLevel: 3,
						targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
					});
				}
				if (profession.name == '暗黑骑士') {
					sets.push({
						user: 1,
						check: context => context.playerUnit.hpRatio <= 0.4,
						type: '技能',
						skillName: '吸血攻击',
						skillLevel: 6,
						targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos)
					});
					// sets.push({
					// 	user: 1,
					// 	check: context => context.round_count == 0,
					// 	type: '技能',
					// 	skillName: '诸刃·碎玉',
					// 	targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
					// });
				}
				if (profession.name == '传教士') {
					sets.push({
						user: 1,
						check: context => {
							const needHealUnits = context.teammates.filter(u => u.curhp > 0 && u.hpRatio <= 0.3);
							return needHealUnits.length >= 2;
						},
						type: '技能',
						skillName: '生命祈福',
						targets: context => [context.player_pos]
					});
					sets.push({
						user: 1,
						check: context =>  {
							const needReviveUnits = context.teammates.filter(u => u.curhp == 0);
							return needReviveUnits.length > 0;
						},
						type: '技能',
						skillName: '气绝回复',
						targets: context => context.teammates.filter(u => u.curhp == 0).map(u => u.pos)
					});
					sets.push({
						user: 1,
						check: function(context) {
							const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && u.flags & cga.emogua.DebuffFlags.ANY).map(u => u.pos);
							if (needCleanPositions.length >= 2) {
								const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions);
								if (t.count >= 3) {
									subSkillInfo = context.getAvaliableSubSkillInfo(this);
									return subSkillInfo && subSkillInfo.level == 6;
								}
							}
							return false;
						},
						type: '技能',
						skillName: '洁净魔法', skillLevel: 6,
						targets: context => {
							console.log('释放洁净魔法');
							const needCleanPositions = context.teammates.filter(u => u.flags & cga.emogua.DebuffFlags.ANY).map(u => u.pos);
							const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions);
							return [t.position];
						}
					});
					// sets.push({
					// 	user: 1,
					// 	check: function(context) {
					// 		const needCleanPositions = context.teammates.filter(u => u.curhp > 0 && u.flags & cga.emogua.DebuffFlags.ANY).map(u => u.pos);
					// 		if (needCleanPositions.length >= 3) {
					// 			subSkillInfo = context.getAvaliableSubSkillInfo(this);
					// 			return subSkillInfo && subSkillInfo.level == 8;
					// 		}
					// 		return false;
					// 	},
					// 	type: '技能',
					// 	skillName: '洁净魔法', skillLevel: 8,
					// 	targets: context => {
					// 		const needCleanPositions = context.teammates.filter(u => u.flags & cga.emogua.DebuffFlags.ANY).map(u => u.pos);
					// 		const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(needCleanPositions);
					// 		return [t.position];
					// 	}
					// });
					const needHealChecker = (unit) => {
						return unit.curhp > 0 && unit.hpRatio <= 0.7;
					};
					sets.push({
						user: 1,
						check: function(context) {
							const needHealUnits = context.teammates.filter(needHealChecker);
							if (needHealUnits.length >= 3) {
								const t = cga.emogua.BattlePositionMatrix.getMaxTPosition(needHealUnits.map(u => u.pos));
								return t.count > 1;
							}
							return false;
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
						check: function(context) {
							const needHealUnits = context.teammates.filter(needHealChecker);
							return needHealUnits.length >= 3;
						}, type: '技能', skillName: '超强补血魔法', skillLevel: 6,
						targets: context => [context.player_pos]
					});
					sets.push({
						user: 1,
						check: function(context) {
							const needHealUnits = context.teammates.filter(needHealChecker);
							return needHealUnits.length > 0;
						}, type: '技能', skillName: '补血魔法', skillLevel: 6,
						targets: context => context.teammates.sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
					});
				}
				if (profession.name == '魔术师') {
					sets.push({
						user: 1,
						check: context => context.enemies.length >= 5,
						type: '技能', skillName: '超强冰冻魔法', skillLevel: 6,
						targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
					});
					sets.push({
						user: 1,
						check: context => true,
						type: '技能', skillName: '冰冻魔法', skillLevel: 6,
						targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
					});
				}
			}
			sets.push({
				user: 1,
				check: context => context.enemies.front.length >= 3 || context.enemies.back.length >= 3,
				type: '技能', skillName: '因果报应', skillLevel: 3,
				targets: context => cga.emogua.AutoBattlePreset.getMaxHorizontalTargets(context)
			});
			sets.push({
				user: 1,
				check: context => context.enemies.length >= 3,
				type: '技能', skillName: '气功弹', skillLevel: 5,
				targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
			});
			sets.push({
				user: 5,
				check: context => true,
				type: '攻击',
				targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
			});

			sets.push({
				user: 2,
				check: context => context.petUnit.hpRatio <= 0.4,
				skillName: '明镜止水',
				targets: context => [context.petUnit.pos]
			});
			// sets.push({
			// 	user: 2,
			// 	check: context => context.enemies.length >= 7,
			// 	skillName: '飓风吐息',
			// 	targets: context => context.enemies.map(u => u.pos)
			// });
			sets.push({
				user: 2,
				check: context => context.enemies.length >= 3,
				skillName: '气功弹',
				targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
			});
			sets.push({
				user: 2,
				check: context => true,
				skillName: '攻击',
				targets: context => cga.emogua.AutoBattlePreset.getSortedEnemies(context)
			});
			return sets;
		},
		/**
		 * options {
		 *     rechargeMinHp: 200
		 * }
		 */
		getEscapeSets: (options) => {
			options = options ? options : {};
			const sets = [];
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
				targets: context => [context.player_pos]
			});
			sets.push(cga.emogua.AutoBattlePreset.getBattleRechargeHpAction(options.rechargeMinHp ? options.rechargeMinHp : 200));
			sets.push({
				user: 5,
				check: context => true,
				type: '逃跑',
				targets: context => [context.player_pos]
			});
			return sets;
		},
		getBattleRechargeMpAction: (minMp = 200) => {
			return {
				user: 1,
				check: context => context.playerUnit.curmp <= minMp && cga.getInventoryItems().findIndex(i => i.type == 23) >= 0,
				type: '物品',
				item: context => cga.getInventoryItems().find(i => i.type == 23).pos,
				targets: context => [context.player_pos]
			};
		},
		getBattleRechargeHpAction: (minHp = 200) => {
			return {
				user: 1,
				check: context => context.playerUnit.curhp <= minHp && cga.getInventoryItems().findIndex(i => i.type == 43) >= 0,
				type: '物品',
				item: context => cga.getInventoryItems().find(i => i.type == 43).pos,
				targets: context => [context.player_pos]
			};
		},
		getMaxHorizontalTargets: (context) => context.enemies.back.length > context.enemies.front.length ? context.enemies.back.map(u => u.pos) : context.enemies.front.map(u => u.pos),
		KillFirstName: ['帕布提斯马'],
		getSortedEnemies: (context) => context.enemies.sort((a, b) => {
			if (cga.emogua.AutoBattlePreset.KillFirstName.findIndex(n => a.name == n) >= 0) return -1;
			else if (cga.emogua.AutoBattlePreset.KillFirstName.findIndex(n => b.name == n) >= 0) return 1;
			return b.maxhp - a.maxhp;
		}).map(u => u.pos),
		getSortedMinHpEnemies: (context) => context.enemies.sort((a, b) => a.curhp - b.curhp).map(u => u.pos)
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
	 *
	 *         type: '技能 攻击 防御 逃跑 位置 宠物 物品 什么都不做',
	 *
	 *         skillName: '因果报应', // cga.GetSkillsInfo() & cga.GetSubSkillsInfo(info.index)
	 *         skillLevel: 1,
	 *         targets: context => [position],
	 *         rollback: '不能释放回退: 攻击 | 防御 | 什么都不做',
	 *         item: context => position,
	 *     }
	 * ]
	 * 默认首回合不延迟，如果屏蔽切图且第一回合敌人全被飞或者己方全被飞会掉线
	 * 什么都不做目前只有宠物支持
	 */
	const playerStrategies = [], player2Strategies = [], petStrategies = [];
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
			cga.BattleNormalAttack(matchedTarget);
		} else {
			console.log('任务攻击没有可用目标->' + JSON.stringify(targets));
		}
	};
	const applyPlayerRollbackAction = (context, type = '攻击') => {
		if (type == '防御' || type == '什么都不做') {
			cga.BattleGuard();
		} else {
			applyPlayerNormalAttack(context, cga.emogua.AutoBattlePreset.getSortedEnemies(context));
		}
	};
	const applyPlayerStrategy = (context, strategy) => {
		try {
			if (strategy.type == '防御' || strategy.type == '什么都不做') {
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
					applyPlayerRollbackAction(context);
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
					applyPlayerRollbackAction(context);
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
						if (!cga.BattleSkillAttack(subSkillInfo.skillIndex, subSkillInfo.level - 1, target)) {
							applyPlayerRollbackAction(context, strategy.rollback)
						}
					}
				}
			} else {
				console.log('未识别的战斗配置 => ' + JSON.stringify(strategy));
			}
		} catch (e) {
			console.log('战斗技能使用错误: ');
			console.log(strategy);
			console.log(e);
		}
	};
	const applyPetStrategy = (context, strategy, twice = true) => {
		try {
			if (strategy.type == '什么都不做') {
				cga.BattlePetSkillAttack(-1, -1);
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
							cga.BattlePetSkillAttack(skillInfo.index, target, true);
							cga.BattlePetSkillAttack(skillInfo.index, target, true);
						} else {
							cga.BattlePetSkillAttack(skillInfo.index, target, false);
						}
					} else {
						cga.BattlePetSkillAttack(-1, -1, false);
					}
				} else {
					cga.BattlePetSkillAttack(-1, -1, false);
					console.log('没有可用的宠物战斗策略，什么都不做');
				}
			}
		} catch (e) {
			console.log('宠物自动战斗错误: ');
			console.log(strategy);
			console.log(e);
		}
	};
	const petAction = (context, twice = true) => {
		const matchedStrategy = petStrategies.find(strategy =>
			strategy.type == '什么都不做' || (strategy.check(context) && typeof context.getAvaliablePetSkillInfo(strategy) == 'object')
		);
		if (matchedStrategy) applyPetStrategy(context, matchedStrategy, twice);
		else {
			cga.BattlePetSkillAttack(-1, -1, false);
			console.log('没有可用的宠物战斗策略，什么都不做');
		}
	};
	const getSkillsInfoCache = () => {
		try {
			return cga.GetSkillsInfo().map(skillInfo => {
				skillInfo.subSkillsInfo = cga.GetSubSkillsInfo(skillInfo.index).reverse();
				return skillInfo;
			});
		} catch (e) {
			console.log('getSkillsInfoCache', e);
			return getSkillsInfoCache();
		}
	}
	const getPetsSkillsInfoCache = () => {
		try {
			const result = {};
			cga.GetPetsInfo().forEach(pet => result[pet.index] = cga.GetPetSkillsInfo(pet.index))
			return result;
		} catch (e) {
			console.log('getPetsSkillsInfoCache', e);
			return getPetsSkillsInfoCache();
		}
	};
	let SkillsInfoCache = getSkillsInfoCache();
	let PetsSkillsInfoCache = getPetsSkillsInfoCache();
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
		context.considerBackPosition = (position) => !context.isFront(position) && context.units.findIndex(u => u.pos == (position + 5) && u.curhp > 0) >= 0;
		context.petUnit = context.units.find(u => u.pos == (context.player_pos + (context.isFront(context.player_pos) ? -5 : 5)));
		context.playerUnit = context.units.find(u => u.pos == context.player_pos);
		context.getAvaliableSubSkillInfo = (strategy) => {
			const skillInfo = SkillsInfoCache.find(s => s.name == strategy.skillName);
			if (skillInfo) {
				if (skillInfo.subSkillsInfo) {
					const subSkillInfo = skillInfo.subSkillsInfo.find(subSkill =>
						(!strategy.skillLevel || subSkill.level <= strategy.skillLevel) &&
						subSkill.available && (context.skill_allowbit & (1 << skillInfo.index)) &&
						subSkill.cost <= context.playerUnit.curmp
					);
					if (subSkillInfo) {
						subSkillInfo.skillIndex = skillInfo.index;
						return subSkillInfo;
					}
				}
			}
		}
		context.getAvaliablePetSkillInfo = (strategy) => {
			const petSkillsInfo = PetsSkillsInfoCache[context.petid];
			if (petSkillsInfo) {
				const skillInfo = petSkillsInfo.find(info => info.name.startsWith(strategy.skillName));
				if (skillInfo && (context.petskill_allowbit & (1 << skillInfo.index)) && skillInfo.cost <= context.petUnit.curmp) {
					return skillInfo;
				}
			}
		}
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

		if (state & BattleActionFlags.ISPLAYER) {
			// 宠物二动
			if (context.petUnit) petAction(context);

			const matchedStrategy = (state & BattleActionFlags.ISDOUBLE ? player2Strategies : playerStrategies).find(strategy => {
				if (strategy.check(context)) {
					if (strategy.type == '技能') {
						return typeof context.getAvaliableSubSkillInfo(strategy) == 'object';
					}
					return true;
				}
				return false;
			});
			if (matchedStrategy) applyPlayerStrategy(context, matchedStrategy);
			else {
				console.log('人物没有可匹配的战斗策略->' + JSON.stringify(playerStrategies));
			}
		} else {
			petAction(context, false);
		}
	};
	// 等待战斗或者切图
	cga.emogua.waitAfterBattle = (battled = false, doubleCheck = true) => {
		if (cga.isInNormalState()) {
			if (doubleCheck) {
				return cga.emogua.delay(500).then(() => cga.emogua.waitAfterBattle(battled, false));
			}
			return Promise.resolve(battled);
		} else {
			if (cga.isInBattle()) {
				battled = true;
			}
			return cga.emogua.delay(1000).then(() => cga.emogua.waitAfterBattle(battled, true));
		}
	};
	let AutoBattleFirstRoundDelay = 4000;
	let AutoBattleRoundDelay = 4000;
	let isFirstBattleAction = false;
	const waitBattleAction = () => {
		cga.AsyncWaitBattleAction((error, state) => {
			if (typeof state == 'number') {
				if (BattleActionFlags.END & state) {
					setTimeout(cga.emogua.pile, 2500);
				} else if (BattleActionFlags.BEGIN & state) {
					isFirstBattleAction = true;
				} else {
					const context = cga.GetBattleContext();
					let delay = AutoBattleRoundDelay;
					if (isFirstBattleAction) {
						SkillsInfoCache = getSkillsInfoCache();
						PetsSkillsInfoCache = getPetsSkillsInfoCache();
						delay = AutoBattleFirstRoundDelay;
						if (context.round_count == 1) { // 被偷袭
							console.log('被偷袭 @ ' + new Date());
							delay += AutoBattleFirstRoundDelay;
						}
					} else if (context.skill_performed === 1) {
						delay = 0;
					}
					setTimeout(() => {
						if (playerStrategies.length > 0) {
							battle(state, context);
						}
					}, delay);
					isFirstBattleAction = false;
				}
			}
			waitBattleAction();
		}, 120000);
	};
	let AutoBattleEnabled = false;
	if (CustomFunctionsFlag > 0) {
		AutoBattleEnabled = true;
		waitBattleAction();
	}
	const BattleStrategyCache = [];
	cga.emogua.autoBattle = (strategies, firstRoundDelay, roundDelay, force = false) => {
		if (strategies && strategies.length > 0) {
			if (force && !AutoBattleEnabled) {
				AutoBattleEnabled = true;
				waitBattleAction();
			}
			playerStrategies.splice(0, playerStrategies.length, ...strategies.filter(e => e.user & 1));
			player2Strategies.splice(0, player2Strategies.length, ...strategies.filter(e => e.user & 4));
			petStrategies.splice(0, petStrategies.length, ...strategies.filter(e => e.user & 2));
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
		}
		return Promise.resolve();
	};
	const getPileMax = (item) => {
		if (item.name.endsWith('的水晶碎片')) return 999;
		if (['长老之证'].indexOf(item.name) >= 0) return 3;
		if (['黄蜂的蜜'].indexOf(item.name) >= 0) return 6;
		if (['魔族的水晶'].indexOf(item.name) >= 0) return 5;
		if (['巨石','龙角','坚硬的鳞片','竹子','孟宗竹'].indexOf(item.name) >= 0) return 20;
		if (item.type == 29) {// 矿
			if (item.name.endsWith('条')) return 20;
			return 40;
		}
		if (item.type == 30) return 40; // 木
		if (item.type == 23 || item.type == 43) { // 料理 血瓶
			if (item.name == '小护士家庭号' || item.name == '魔力之泉') return 10;
			return 3;
		}
		if (item.type == 31) return 20; // 布
		if ([26,32,34,35].indexOf(item.type) >= 0) { // 狩猎材料
			if (item.name.endsWith('元素碎片')) return 4;
			return 40;
		}
	};
	cga.emogua.pile = (force = false) => {
		if (force || cga.isInNormalState()) {
			const cache = {};
			cga.getInventoryItems().forEach(item => {
				const pileMax = getPileMax(item);
				if (pileMax && item.count < pileMax) {
					const target = cache[item.itemid];
					if (target) {
						cga.MoveItem(item.pos, target.pos, -1);
						const sum = item.count + target.count;
						if (sum >= pileMax) {
							delete cache[item.itemid];
							if (sum > pileMax) {
								item.count = sum - pileMax;
								cache[item.itemid] = item;
							}
						} else {
							target.count = sum;
						}
					} else {
						cache[item.itemid] = item;
					}
				}
			});
		}
		return cga.emogua.delay(500);
	};
	cga.emogua.keepAlive = (say = false) => {
		if (say && cga.isInNormalState()) {
			cga.emogua.pile(true);
			cga.emogua.sayWords();
		}
		setTimeout(() => cga.emogua.keepAlive(true), 50000);
	};

	// 定时任务
	const schedule = () => {
		if (cga.GetWorldStatus() == 11) {
			console.log('已掉线,退出进程' + new Date());
			process.exit();
		} else {
			// 装备保护
			if (
				cga.isInNormalState() && cga.GetItemsInfo().find(i => i.pos <= 4 && cga.emogua.getDurability(i).current <= equipmentMinDurability)
			) {
				cga.emogua.tidyupEquipments();
			}
			setTimeout(schedule, 30000);
		}
	};
	schedule();
	return cga;
});
