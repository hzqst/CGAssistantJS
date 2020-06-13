/**
 * health 0 1-25(白) 26-50(黄) 51-75(粉) 76-100(红)
 * direction 0(右上)
 * 高速移动中不可丢东西
 * cga.ForceMove(direction, false); true 人物坐标移动 false 只发包服务器
 * cga.ForceMoveTo(cga.GetMapXY().x, cga.GetMapXY().y, false); x或者y可同时跨越最多+5格子
 *   true | false 本人是否可见 false只有地图可见
 * cga.getMapObjects()
 *     [ { x: 199, y: 209, mapx: 199, mapy: 209, cell: 10 }] cell 10(地图出入口) 3(迷宫出入口)
 * dialog options:
 *     0  : 列表选择 cga.ClickNPCDialog(0, 6) 第一个参数应该是被忽略的，第二个参数选择列表序号，从0开始
 *     1  : 确定按钮 cga.ClickNPCDialog(1, -1)
 *     2  : 取消按钮 cga.ClickNPCDialog(2, -1)
 *     3  : 确定取消 cga.ClickNPCDialog(1, -1) 1确定 2取消
 *     12 : 是否按钮 cga.ClickNPCDialog(4, -1) 4是 8否
 *     32 : 下一步 cga.ClickNPCDialog(32, -1) 32下一步
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
 * cga.FixMapWarpStuck(1)
 *     1 站在迷宫入口 如果卡着没进去就强制进去
 *     0 切图的时候黑屏 强制切回来
 * cga.GetMapUnits 返回附近11格范围内的units
 *     unit_name 角色名
 *     title_name 特别称号
 *     nick_name 玩家称号
 * cga.ChangePetState(petpos, 0~3 | 16) 1=待命 2=战斗 3=休息 16=宠物散步
 * cga.DropPet(petpos)
 */
const PF = require('pathfinding');
const CustomFunctionsFlag = 0;
module.exports = new Promise(resolve => {
	const cga = require('../cgaapi')(() => setTimeout(() => resolve(cga), 0));
}).then(cga => {
	cga.emogua = {};
	cga.emogua.UnitFlags = {
		NpcEntry: 4096, // npc 或者 随机入口
		Item: 1024,
		Player: 256
	};
	cga.emogua.shuffle = (arr) => {
		let i = arr.length;
		while (i) {
			let j = Math.floor(Math.random() * i--);
			[arr[j], arr[i]] = [arr[i], arr[j]];
		}
		return arr;
	};
	cga.emogua.getMapInfo = () => {
		const info = cga.GetMapXY();
		info.name = cga.GetMapName();
		info.indexes = cga.GetMapIndex();
		return info;
	};
	cga.emogua.isMoving = () => {
		const speed = cga.GetMoveSpeed();
		return !(speed && speed.x === 0 && speed.y === 0);
	};
	const getProfession = require('./profession');
	cga.emogua.getPlayerProfession = () => getProfession(cga);
	// 不可以在战斗中获取
	let teammates = [];
	cga.emogua.getTeammates = () => {
		try {
			if (cga.isInNormalState()) {
				teammates = cga.getTeamPlayers().filter(e => !e.is_me);
			}
		} catch (e) {
			console.log('获取teamplayers失败', e);
		}
		return teammates;
	}
	cga.emogua.getTeamNumber = () => cga.emogua.getTeammates().length + 1;
	const cachedPlayer = cga.GetPlayerInfo();
	cga.emogua.getCachedPlayer = () => cachedPlayer;
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
	cga.emogua.parseTeams = (teams, player = cga.GetPlayerInfo()) => {
		const team = teams.find(t => t.find(n => n == player.name));
		if (!team) {
			console.log('未知队伍', player.name);
			return {};
		}
		console.log('current team: ', team);
		return {
			team: team,
			captain: team[0],
			isCaptain: player.name == team[0],
			teamNumber: team.length,
			player: player
		};
	};
	cga.emogua.delay = (millis) => new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, millis);
	});
	// range 0 最大 1 最小格
	cga.emogua.sayWords = (words = '', color = 0, range = 1, size = 1) => {
		cga.SayWords(words, color, range, size);
		return Promise.resolve();
	}
	cga.emogua.recursion = (action, timer = Date.now()) => {
		const result = action(timer);
		if (result instanceof Promise) {
			return result.then(
				() => cga.emogua.recursion(action, timer),
				e => {
					if (e && typeof e != 'number') console.log('recursion', e);
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
		const result = predict(timer);
		if (result) {
			return Promise.resolve(result).catch(
				() => cga.emogua.waitUntil(predict, interval, timer)
			);
		} else {
			return cga.emogua.delay(interval).then(
				() => cga.emogua.waitUntil(predict, interval, timer)
			);
		}
	};
	// destination '艾尔莎岛' || 1111 || [147, 189]
	cga.emogua.arrived = (destination, oldMapInfo, currentMapInfo = cga.emogua.getMapInfo()) => {
		if (destination) {
			if (typeof destination == 'string' && (
				(destination == '*' && oldMapInfo.indexes.index3 !== currentMapInfo.indexes.index3) ||
				(destination == currentMapInfo.name && destination != oldMapInfo.name)
			)) {
				return true;
			} else if (destination instanceof Array && currentMapInfo.x == destination[0] && currentMapInfo.y == destination[1]) {
				return true;
			} else if (typeof destination == 'number' && oldMapInfo.indexes.index3 !== currentMapInfo.indexes.index3 && currentMapInfo.indexes.index3 === destination) {
				return true;
			}
		}
		return false;
	}
	cga.emogua.waitDestination = (destination, oldMapInfo, timeout = 5000, timer = Date.now()) => {
		if ((Date.now() - timer) > timeout) {
			console.log('不能抵达目的地->', destination);
			return Promise.reject();
		}
		if (destination) {
			return cga.emogua.delay(300).then(() => {
				if (cga.emogua.arrived(destination, oldMapInfo)) return cga.emogua.waitAfterBattle();
				return cga.emogua.waitDestination(destination, oldMapInfo, timeout, timer);
			});
		}
		return Promise.resolve();
	};
	cga.emogua.waitNPCDialog = (action, timeout = 5000) => new Promise(
		resolve => cga.AsyncWaitNPCDialog((error, dialog) => setTimeout(() => resolve(action(dialog ? dialog : {})), 0), timeout)
	);
	cga.emogua.waitMessage = (check, teamOnly = false, timeout = 30000) => new Promise((resolve, reject) => {
		cga.AsyncWaitChatMsg((error, chat) => setTimeout(() => {
			if (error) {
				reject();
			} else {
				if (!teamOnly || cga.emogua.getTeammates().find(t => t.unit_id == chat.unitid) || cga.emogua.getCachedPlayer().unitid == chat.unitid) {
					const checkResult = check(chat ? chat : {});
					if (checkResult instanceof Promise) checkResult.then(resolve, reject);
					else if (checkResult) resolve();
					else reject();
				} else {
					reject();
				}
			}
		}, 0), timeout);
	});
	cga.emogua.waitMessageUntil = (check, teamOnly = false) => cga.emogua.waitMessage(check, teamOnly).catch(() => cga.emogua.waitMessageUntil(check, teamOnly));
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
	// 无法遇敌重试,只适合不遇敌场景
	cga.emogua.forceMove = (orientation, times = 1) => {
		if  (times > 0) {
			cga.ForceMove(orientation, true);
			return cga.emogua.delay(1000).then(() => cga.emogua.forceMove(orientation, times - 1));
		}
		return Promise.resolve();
	};
	// 遇敌重试，但一次在x或y上可同时最多移动5格,2格内不会触发npc战斗，超过会触发（比如熊男）
	cga.emogua.forceMoveTo = (target, xy = cga.GetMapXY()) => {
		if (Math.abs(xy.x - target[0]) > 5 || Math.abs(xy.y - target[1]) > 5) {
			console.log('forceMoveTo的x或者y可同时最多移动5格');
			return Promise.reject();
		}
		cga.ForceMoveTo(target[0], target[1], true);
		return cga.emogua.delay(2000).then(
			() => cga.emogua.waitAfterBattle()
		).then(() => {
			const current = cga.GetMapXY();
			if (current.x != target[0] || current.y != target[1]) {
				console.log('重试forceMoveTo', target);
				return cga.emogua.forceMoveTo(target, current);
			}
		});
	};
	const asyncWalkTo = (targetX, targetY, destination, currentMapInfo) => new Promise(resolve => {
		let [targetMap, destinationX, destinationY] = (destination instanceof Array) ? [currentMapInfo.name, destination[0], destination[1]] : [destination, null, null];
		if ((currentMapInfo.name == targetMap || currentMapInfo.indexes.index3 == targetMap) && destinationX === null && destinationY === null) {
			targetMap = currentMapInfo.name;
			destinationX = targetX;
			destinationY = targetY;
		}
		// console.log('walkTo', targetX, targetY, destination, targetMap, destinationX, destinationY);
		cga.AsyncWalkTo(
			targetX, targetY, targetMap, destinationX, destinationY,
			(error, reason) => setTimeout(() => resolve({error: error, reason: reason}), 0)
		);
	});
	cga.emogua.walkTo = (target, currentMapInfo = cga.emogua.getMapInfo()) => {
		const [targetX, targetY, destination] = target;
		return Promise.resolve().then(() => {
			if (
				(targetX == currentMapInfo.x && targetY == currentMapInfo.y && !destination) ||
				cga.emogua.arrived(destination, currentMapInfo, currentMapInfo)
			) {
				return;
			}
			if (targetX == currentMapInfo.x && targetY == currentMapInfo.y && destination && destination != currentMapInfo.name) {
				console.log('强制切图');
				cga.FixMapWarpStuck(1);
			}
			return asyncWalkTo(targetX, targetY, destination, currentMapInfo);
		}).then(result => {
			if (result && result.error) {
				if (result.reason == 4) { // Unexcepted map changed
					if (destination === '*') {
						return;
					}
				} else if (result.reason == 2 || result.reason == 5) { // 2 battle, 5 force to move back by server
					return Promise.reject(7);
				} else if (result.reason == 3) { // 卡住
					return Promise.reject(3);
				}
				console.log('walkTo error', result);
				return Promise.reject();
			}
		});
	};
	// [ [x, y, destination] ]
	cga.emogua.walkList = (list) => list.reduce(
		(r, t) => r.then(() => cga.emogua.walkTo(t)),
		Promise.resolve()
	);
	const excludedMaps = [27001,61001,43600,43000,15592,15593,15594,15595,15596,11032,11034,11035,11036,11037,15000,15001,15002,15003,15004,15005,15006,14000,14001,14002,14014,4400,5008,11000,11001,11002,11003,11004,11005,59501,2400];
	cga.emogua.isMapDownloaded = (walls = cga.buildMapCollisionMatrix(), mapIndex = cga.GetMapIndex()) => {
		if (mapIndex.index1 === 0 && excludedMaps.indexOf(mapIndex.index3) > -1) return true;
		const downloadedFlag = mapIndex.index1 === 1 ? 0 : 1;
		return walls.matrix[0][0] == downloadedFlag && walls.matrix[walls.y_size-1][0] == downloadedFlag && walls.matrix[walls.y_size-1][walls.x_size-1] == downloadedFlag && walls.matrix[0][walls.x_size-1] == downloadedFlag;
	};
	cga.emogua.downloadMap = (mapIndex = cga.GetMapIndex()) => {
		const walls = cga.buildMapCollisionMatrix();
		if(!cga.emogua.isMapDownloaded(walls, mapIndex)) {
			return new Promise((resolve, reject) => {
				console.log('当前地图：'+cga.GetMapName()+'，等待下载地图');
				const ended = () => {
					console.log('下载地图结束');
					if (mapIndex.index1 === 0 && !excludedMaps.includes(mapIndex.index3)) excludedMaps.push(mapIndex.index3);
					resolve(cga.buildMapCollisionMatrix());
				};
				const recursiveDownload = (xfrom, yfrom, xsize, ysize, times = 0) => {
					if (xfrom < xsize && yfrom < ysize) {
						cga.RequestDownloadMap(xfrom, yfrom, xfrom + 24, yfrom + 24);
						cga.AsyncWaitDownloadMap((error, info) => setTimeout(() => {
							const currentMap = cga.emogua.getMapInfo();
							if (error) {
								if (times <= 2) {
									setTimeout(() => recursiveDownload(xfrom, yfrom, xsize, ysize, times + 1), 1000);
								} else {
									console.log('下载地图出错 ' + error);
									reject();
								}
							} else if (mapIndex.index3 != currentMap.indexes.index3) {
								console.log('下载地图出错: 地图改变 last=' + mapIndex.index3 + ' info=' + currentMap);
								reject();
							} else {
								xfrom += 24;
								if (xfrom >= xsize) {
									xfrom = 0;
									yfrom += 24;
								}
								setTimeout(() => recursiveDownload(xfrom, yfrom, xsize, ysize), 500);
							}
						}, 0), 5000);
					} else ended();
				};
				setTimeout(() => recursiveDownload(0, 0, walls.x_size, walls.y_size), 500);
			});
		}
		return Promise.resolve(walls);
	};
	cga.emogua.downloadMapEx = (xfrom, yfrom, xsize, ysize) => new Promise(resolve => cga.downloadMapEx(xfrom, yfrom, xsize, ysize, () => setTimeout(resolve, 0)));
	cga.emogua.toRandomEntry = (xfrom, yfrom, xsize, ysize, except = []) => cga.emogua.downloadMapEx(xfrom, yfrom, xsize, ysize).then(() => {
		xmax = xfrom + xsize;
		ymax = yfrom + ysize;
		const entry = cga.getMapObjects().find(o => o.cell == 3 && o.x >= xfrom && o.y >= yfrom && o.x <= xmax && o.y <= ymax && !except.find(p => p[0] == o.x && p[1] == o.y));
		if (entry) return cga.emogua.autoWalk([entry.x, entry.y, '*']);
		return Promise.reject();
	});
	const SafeMaps = ['法兰城','里谢里雅堡','艾尔莎岛','艾夏岛','圣骑士营地','矮人城镇','哥拉尔镇','医院','流行商店']
	cga.emogua.autoWalk = (target, walls, mapInfo = cga.emogua.getMapInfo(), options = {compress: true}) => Promise.resolve().then(() => {
		// console.log('walkto', target, mapInfo);
		if (
			(target[2] && cga.emogua.arrived(target[2], mapInfo, mapInfo)) ||
			(!target[2] && mapInfo.x == target[0] && mapInfo.y == target[1])
		) {
			return;
		} else if (target[2] && mapInfo.x == target[0] && mapInfo.y == target[1]) {
			return cga.emogua.walkTo(target, mapInfo);
		}
		return Promise.resolve().then(() => {
			if (Math.abs(mapInfo.x - target[0]) < 3 && Math.abs(mapInfo.y - target[1]) < 3) {
				return [target];
			} else {
				return Promise.resolve().then(
					() => walls ? walls : cga.emogua.downloadMap()
				).then(confirmedWalls => {
					const compress = (options && options.compress == false) ? false : true;
					walls = confirmedWalls;
					const matrix = confirmedWalls.matrix;
					if (!compress) cga.getMapObjects().filter(e => [3,10].indexOf(e.cell) >= 0).forEach(entry => {
						if (entry.x != target[0] || entry.y != target[1]) {
							if (matrix[entry.y] && matrix[entry.y][entry.x] == 0) {
								matrix[entry.y][entry.x] = 1;
							}
						}
					});
					const grid = new PF.Grid(matrix);
					const finder = new PF.AStarFinder({
						allowDiagonal: true,
						dontCrossCorners: true
					});
					let apath = finder.findPath(mapInfo.x, mapInfo.y, target[0], target[1], grid);
					return compress ? PF.Util.compressPath(apath) : apath;
				});
			}
		}).then(path => {
			if (path.length > 0) {
				if (target[2]) path[path.length - 1][2] = target[2];
				return cga.emogua.walkList(path);
			}
			console.log(`Can not find path to ${target}`);
			return Promise.reject();
		});
	}).then(
		() => {
			var currentMapName = cga.GetMapName();
			if (!target[2] || (mapInfo.name == currentMapName && target[2] === currentMapName)) {
				// 非切图，防止遇敌或强制回退
				return Promise.resolve().then(() => {
					if (SafeMaps.includes(currentMapName)) return;
					return cga.emogua.delay(2000).then(
						() => cga.emogua.waitAfterBattle()
					);
				}).then(() => {
					const p = cga.emogua.getMapInfo();
					if (p.x != target[0] || p.y != target[1]) {
						return cga.emogua.autoWalk(target, walls, p, options);
					}
				});
			}
		}, r => {
			if (typeof r == 'number') {
				if (r == 7) {
					return cga.emogua.waitAfterBattle().then(() => {
						const currentMapInfo = cga.emogua.getMapInfo();
						if (cga.emogua.arrived(target[2], mapInfo, currentMapInfo)) {
							return;
						}
						return cga.emogua.autoWalk(target, walls, currentMapInfo, options);
					});
				}
				if (r == 3) {
					console.log('被卡住');
				}
			}
			//console.log('自动寻路失败', target, r);
			return Promise.reject(r);
		}
	);
	// [ [x, y, destination] ]
	cga.emogua.autoWalkList = (list) => list.reduce((a, c) => a.then(() => cga.emogua.autoWalk(c)), Promise.resolve());
	cga.emogua.goto = require('./goto')(cga);
	cga.emogua.getFarthestEntry = (current, mapObjects = cga.getMapObjects()) => {
		return mapObjects.filter(e => [3,10].indexOf(e.cell) >= 0 && (e.mapx != current.x || e.mapy != current.y)).sort((a, b) => {
			const distanceA = Math.abs(a.mapx - current.x) + Math.abs(a.mapy - current.y);
			const distanceB = Math.abs(b.mapx - current.x) + Math.abs(b.mapy - current.y);
			return distanceB - distanceA;
		}).shift();
	};
	/**
	 * icon 大 down, 小 up; 12002 down 12000 up, 13997 down 13996 up
	 * return [前进，后退]
	 */
	const getMazeEntries = (up = true, mapObjects = cga.getMapObjects(), current = cga.GetMapXY()) => {
		const entryIcons = cga.buildMapCollisionRawMatrix().matrix;
		return mapObjects.filter(o => {
			const match = o.cell == 3;
			if (match) {
				o.icon = entryIcons[o.y][o.x];
				if (o.icon == 0 && up) {
					o.icon = Number.MAX_VALUE;
				}
			}
			return match;
		}).sort((a,b) => {
			if (a.x == current.x && a.y == current.y) return 1;
			if (b.x == current.x && b.y == current.y) return 0;
			return up ? (a.icon - b.icon) : (b.icon - a.icon);
		});
	};
	cga.emogua.getMazeEntries = (up = true) => cga.emogua.downloadMap().then(walls => getMazeEntries(up));
	cga.emogua.walkRandomMaze = (up = true, back = false) => cga.emogua.downloadMap().then(walls => {
		const mapInfo = cga.emogua.getMapInfo();
		const entries = getMazeEntries(up, cga.getMapObjects(), mapInfo);
		if (entries.length > 1) {
			const target = back ? entries[1] : entries[0];
			return cga.emogua.autoWalk([target.x, target.y, '*'], walls, mapInfo);
		}
		console.log('Fail to walk random maze', entries);
		return Promise.reject();
	});
	cga.emogua.walkRandomMazeUntil = (check, up = true, back = false) => cga.emogua.walkRandomMaze(up, back).then(() => {
		const checkResult = check();
		if (checkResult instanceof Promise) return checkResult;
		else if (checkResult) return Promise.resolve();
		return cga.emogua.walkRandomMazeUntil(check, up, back);
	});
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
	/**
	 * targetFinder 返回unit object 或者 true 都将停止搜索
	 * parameters
	 *     diagonal: [[558,20], [526,40]] 限定寻找的矩形范围(对角线两个顶点,注意起点需要在范围内)
	 */
	cga.emogua.searchMap = (targetFinder, recursion = true, up = true, parameters = {}) => cga.emogua.downloadMap().then(walls => {
		const entries = getMazeEntries(up);
		const getTarget = () => {
			const target = targetFinder(cga.GetMapUnits().filter(u => (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0));
			if (typeof target == 'object') {
				target.entries = entries;
				target.found = true;
				const walkTo = cga.emogua.getMovablePositionAround({x: target.xpos,y: target.ypos});
				if (walkTo) {
					return cga.emogua.autoWalk([walkTo.x,walkTo.y],undefined,undefined,{compress: false}).then(() => Promise.reject(target));
				}
			}
			if (target === true) return Promise.reject({found: true, entries: entries});
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
				return cga.emogua.autoWalk([next.x,next.y],undefined,undefined,{compress: false}).then(
					() => getTarget()
				).then(() => toNextPoint(remain,next))
			}
			return Promise.resolve();
		};
		if (parameters.diagonal && parameters.diagonal.length > 1) {
			const [minX,maxX] = [parameters.diagonal[0][0],parameters.diagonal[1][0]].sort();
			const [minY,maxY] = [parameters.diagonal[0][1],parameters.diagonal[1][1]].sort();
			for (let y = 0; y < walls.matrix.length; y++) {
				for (let x = 0; x < walls.matrix[y].length; x ++) {
					if (!(x <= maxX && x >= minX && y <= maxY && y >= minY) && walls.matrix[y][x] == 0) {
						walls.matrix[y][x] = 1;
					}
				}
			}
		}
		return getTarget().then(() => {
			const current = cga.GetMapXY();
			return toNextPoint(Object.values(getMovablePoints(walls, current)), current);
		}).then(
			() => {
				if (entries.length > 1 && recursion) {
					return cga.emogua.autoWalk([entries[0].x, entries[0].y, '*'], undefined, undefined, {compress: false}).then(
						() => cga.emogua.searchMap(targetFinder, recursion, up)
					);
				}
				console.log('地图搜索失败');
				return Promise.reject();
			},
			t => {
				if (t && t.found) return t;
				console.log('地图搜索失败');
				return Promise.reject();
			}
		);
	});
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
		const current = cga.emogua.getMapInfo();
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
		if (destination) return cga.emogua.waitDestination(destination, current);
		return cga.emogua.delay(1500); // 避免后续事件延迟导致判断有误
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
	cga.emogua.talkNpcSelectorYesFixTimes = (max = 32) => (dialog, times) => {
		if (dialog.options == 12) {
			cga.ClickNPCDialog(4, -1);
			return times < max;
		} else if (dialog.options == 32) {
			cga.ClickNPCDialog(32, -1);
			return times < max;
		} else if (dialog.options == 1) {
			cga.ClickNPCDialog(1, -1);
			return times < max;
		} else if (dialog.options == 2) {
			cga.ClickNPCDialog(2, -1);
			return times < max;
		} else if (dialog.options == 3) {
			cga.ClickNPCDialog(1, -1);
			return times < max;
		} else if (dialog.options == 8) {
			cga.ClickNPCDialog(8, -1);
			return times < max;
		} else if (dialog.options == 4) {
			cga.ClickNPCDialog(4, -1);
			return times < max;
		} else if (dialog.options == 0) {
			return times < max;
		}
		return false;
	};
	cga.emogua.talkNpcSelectorYes = cga.emogua.talkNpcSelectorYesFixTimes();
	// 是否选否
	cga.emogua.talkNpcSelectorNoFixTimes = (max = 32) => (dialog, times) => {
		if (dialog.options == 12) {
			cga.ClickNPCDialog(8, -1);
			return times < max;
		} else if (dialog.options == 32) {
			cga.ClickNPCDialog(32, -1);
			return times < max;
		} else if (dialog.options == 1) {
			cga.ClickNPCDialog(1, -1);
			return times < max;
		} else if (dialog.options == 2) {
			cga.ClickNPCDialog(2, -1);
			return times < max;
		} else if (dialog.options == 3) {
			cga.ClickNPCDialog(1, -1);
			return times < max;
		} else if (dialog.options == 8) {
			cga.ClickNPCDialog(8, -1);
			return times < max;
		} else if (dialog.options == 4) {
			cga.ClickNPCDialog(4, -1);
			return times < max;
		} else if (dialog.options == 0) {
			return times < max;
		}
		return false;
	};
	cga.emogua.talkNpcSelectorNo = cga.emogua.talkNpcSelectorNoFixTimes();
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
		const mapInfo = cga.emogua.getMapInfo();
		if (targety >= 0) {
			orientation = cga.emogua.getOrientation(targetx, targety);
		}
		if (selector) {
			return Promise.resolve().then(() => {
				if (typeof orientation == 'number' && orientation > -1 && orientation < 8) {
					cga.emogua.turnOrientation(orientation);
				}
			}).then(() => {
				let timeout = 2000;
				let times = 1;
				return cga.emogua.recursion(
					() => cga.emogua.waitNPCDialog(dialog => {
						if (typeof dialog.type == 'number') {
							return selector(dialog, times++);
						}
						return false;
					}, timeout).then(r => r ? r : Promise.reject())
				);
			}).then(
				() => cga.emogua.waitDestination(destination, mapInfo)
			);
		}
		console.log('Talk npc wrong arguments');
		return Promise.reject();
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
	cga.emogua.getDwarfBadge = () => {
		if (cga.getInventoryItems().length == 20) {
			return Promise.resolve(false);
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
	const DropItemNames = ['时间的碎片','时间的结晶','绿头盔','红头盔','秘文之皮','星之砂','奇香木','巨石','龙角','坚硬的鳞片','传说的鹿皮','碎石头'];
	cga.emogua.addDropItemNames = (names) => {
		DropItemNames.push(...names);
	};
	cga.emogua.stopDropItems = () => {
		DropItemNames.splice(0, DropItemNames.length);
	};
	cga.emogua.dropItems = (positions) => {
		if (cga.isInNormalState() && !cga.emogua.isMoving()) {
			if (positions instanceof Array) {
				positions.forEach(position => cga.DropItem(position));
			} else if (typeof positions == 'function') {
				cga.getInventoryItems().filter(positions).forEach(i => cga.DropItem(i.pos));
			} else {
				cga.getInventoryItems().filter(i => DropItemNames.find(n => i.name.indexOf(n) >= 0)).forEach(i => cga.DropItem(i.pos));
			}
		}
		return Promise.resolve();
	};
	cga.emogua.useItem = (position) => {
		if (position) cga.UseItem(position);
		return cga.emogua.delay(500);
	}
	cga.emogua.getEmptyBagIndexes = (items = cga.getInventoryItems()) => {
		const itemIndexes = items.map(e => e.pos);
		const result = new Array();
		for (let bagIndex = 8; bagIndex < 28; bagIndex++) {
			if (!itemIndexes.includes(bagIndex)) {
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
			if (typeof filter == 'string') return e.name == filter || e.itemid == filter;
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
	 * filter
	 *     name | matcher
	 *     空或者不传表示存全部
	 * size
	 *     银行大小  默认20
	 * 返回
	 *     true 银行已满
	 */
	cga.emogua.saveToBank = (filter, gold = 0, pets = [], size = 20) => {
		const bankList = cga.GetBankItemsInfo();
		const bankMax = 99 + size;
		let bankSlotIndex = 100;
		const toSavableSlotIndex = (item) => {
			let slot = bankList.find(b => b.name == item.name && b.count < getPileMax(item));
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
			item => !filter || (filter instanceof Function ? filter(item) : (item.name == filter || item.itemid == filter))
		).forEach(i => toSavableSlotIndex(i));
		if (gold > 0) {
			cga.MoveGold(options.gold, cga.MOVE_GOLD_TOBANK);
		}
		return Promise.resolve(bankList.length >= size);
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
		return cga.getMapObjects().filter(e => (e.cell === 3 || e.cell === 10) && !(e.x == target.x && e.y == target.y)).sort((a, b) => {
			const distanceA = Math.abs(a.mapx - target.x) + Math.abs(a.mapy - target.y);
			const distanceB = Math.abs(b.mapx - target.x) + Math.abs(b.mapy - target.y);
			return distanceA - distanceB;
		}).shift();
	};
	cga.emogua.getMovablePositionsAround = (target) => {
		const result = [];
		const walls = cga.buildMapCollisionMatrix();
		const entries = cga.getMapObjects().filter(e => e.cell === 3 || e.cell === 10);
		const isPositionMovable = (x, y) => {
			return walls.matrix[y][x] == 0 && entries.findIndex(e => e.mapx == x && e.mapy == y) < 0;
		};
		if (isPositionMovable(target.x + 1, target.y)) {
			result.push({
				orientation: 0,
				x: target.x + 1,
				y: target.y
			});
		}
		if (isPositionMovable(target.x, target.y + 1)) {
			result.push({
				orientation: 2,
				x: target.x,
				y: target.y + 1
			});
		}
		if (isPositionMovable(target.x - 1, target.y)) {
			result.push({
				orientation: 4,
				x: target.x - 1,
				y: target.y
			});
		}
		if (isPositionMovable(target.x, target.y - 1)) {
			result.push({
				orientation: 6,
				x: target.x,
				y: target.y - 1
			});
		}
		return result;
	};
	// target: {x: 0, y: 0}
	cga.emogua.getMovablePositionAround = (target) => cga.emogua.getMovablePositionsAround(target)[0];
	let encounterStopped = true;
	cga.emogua.checkStopEncounter = (protect, talk = false, checkTeam = false) => {
		if (!cga.isInNormalState()) {
			return false;
		}
		const playerInfo = cga.GetPlayerInfo();
		const pets = cga.GetPetsInfo();
		const minHp = (protect && protect.minHp) ? protect.minHp : 100;
		const minMp = (protect && protect.minMp) ? protect.minMp : 60;
		const minPetHp = (protect && protect.minPetHp) ? protect.minPetHp : 100;
		const minPetMp = (protect && protect.minPetMp) ? protect.minPetMp : 0;
		const maxPetNumber = (protect && protect.maxPetNumber) ? protect.maxPetNumber : 5;
		const maxItemNumber = (protect && protect.maxItemNumber) ? protect.maxItemNumber : 20;
		const checker = (protect && typeof protect.checker == 'function') ? protect.checker : null;
		const minTeamNumber = (protect && protect.minTeamNumber) ? protect.minTeamNumber : 1;
		if (
			playerInfo.hp < minHp || playerInfo.mp < minMp || cga.getInventoryItems().length > maxItemNumber ||
			pets.length > maxPetNumber || pets.filter(e => e.battle_flags == 2).find(p => p.hp < minPetHp || p.mp < minPetMp) ||
			(
				checkTeam &&
				(cga.emogua.getTeamNumber() < minTeamNumber)
			) ||
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
		else return cga.emogua.downloadMap().then(() => {
			encounterStopped = false;
			let stopEncounter = false;
			const mapName = cga.GetMapName();
			const protectRecursion = () => cga.emogua.delay(2000).then(
				() => cga.emogua.waitAfterBattle()
			).then(() => {
				if (stopEncounter) {
					return Promise.reject();
				}
				if (
					cga.emogua.checkStopEncounter(protect, false, true) ||
					mapName != cga.GetMapName()
				) {
					stopEncounter = true;
					return Promise.reject();
				}
				return Promise.resolve();
			}).then(() => protectRecursion());
			const entries = cga.getMapObjects().filter(e => e.cell === 3 || e.cell === 10);
			let counter = 0;
			let timer = new Date();
			const start = () => new Promise((resolve, reject) => {
				const startPosition = cga.GetMapXY();
				const movePosition = cga.emogua.getMovablePositionAround(startPosition);
				const afterBattle = () => {
					cga.emogua.waitAfterBattle().then(() => {
						counter++;
						const current = cga.GetMapXY();
						move(
							(current.x == startPosition.x && current.y == startPosition.y) ? movePosition.orientation : cga.emogua.getOrientation(startPosition.x, startPosition.y)
						);
					});
				};
				const move = (direction) => {
					try {
						if (stopEncounter) resolve();
						else if (cga.isInNormalState()) {
							cga.ForceMove(direction, false);
							setTimeout(() => move((direction + 4) % 8), 100);
						} else afterBattle();
					} catch(e) {
						console.log('遇敌错误', e);
						afterBattle();
					}
				};
				if (movePosition) {
					//console.log('开始遇敌', timer.toLocaleString());
					protectRecursion().catch(r => r);
					cga.emogua.waitMessageUntil((chat) => {
						if (chat.msg && chat.msg.indexOf('触发战斗保护') >= 0) {
							if (cga.emogua.getTeammates().find(t => t.unit_id == chat.unitid)) {
								return stopEncounter = true;
							}
						}
					});
					move(movePosition.orientation);
				} else {
					console.log('无法遇敌');
					reject();
				}
			}).catch(r => r).then(() => {
				const cd = new Date();
				//console.log('已停止遇敌', counter, parseInt((cd.getTime() - timer.getTime()) / 1000), cd.toLocaleString());
				return cga.emogua.delay(2000).then(
					() => cga.emogua.waitAfterBattle()
				).then(
					() => cga.emogua.delay(2000)
				).then(
					() => encounterStopped = true
				);
			});
			const p = cga.GetMapXY();
			if (entries.findIndex(e => e.mapx == p.x && e.mapy == p.y) >= 0) {
				let position = cga.emogua.getMovablePositionAround(p);
				if (position) return cga.emogua.waitAfterBattle().then(
					() => cga.emogua.autoWalk([position.x, position.y])
				).then(
					() => start()
				);
				console.log('无法遇敌');
				return Promise.reject();
			} else {
				return start();
			}
		});
	};
	cga.emogua.joinTeam = (x, y, name) => {
		if (cga.emogua.getTeamNumber() == 1) {
			const captain = cga.GetMapUnits().find(u => (u.flags & cga.emogua.UnitFlags.Player) && u.unit_name === name);
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
	};
	cga.emogua.kickStranger = (name) => {
		cga.DoRequest(cga.REQUEST_TYPE_KICKTEAM);
		return cga.emogua.waitNPCDialog(dialog => {
			if (dialog && dialog.message && dialog.message.indexOf('你要把谁踢出队伍') > 0) {
				const splits = dialog.message.replace(/\n/g,"\\n").split('\\n');
				const kick = splits.slice(2, splits.length - 1).findIndex(n => n.startsWith(name));
				if (kick >= 0) {
					cga.ClickNPCDialog(-1, kick);
				}
			}
		}).then(() => cga.emogua.delay(3000));
	};
	cga.emogua.waitTeamBlock = (total, teamates = [], interruptor, timer = Date.now()) => {
		return Promise.resolve().then(() => {
			const number = cga.emogua.getTeamNumber();
			const currentTeamates = cga.emogua.getTeammates();
			if (number >= total) {
				if (teamates && teamates.length > 0) {
					const strangers = currentTeamates.filter(t => !teamates.includes(t.name)).map(t => t.name);
					if (strangers.length > 0) {
						console.log('踢出陌生人', strangers);
						let kick = Promise.resolve();
						strangers.forEach(s => kick = kick.then(() => cga.emogua.kickStranger(s)));
						return kick.then(
							() => cga.emogua.waitTeamBlock(total, teamates, interruptor, timer)
						);
					}
				}
				console.log(`组队已满(${total})`, new Date().toLocaleString());
				return number;
			}
			const inerval = Date.now() - timer;
			if (typeof interruptor == 'function' && interruptor(timer)) {
				console.log(`组队中断`);
				return number;
			}
			if (inerval <= 3000) console.log(`等待组队满人数(${total})...`);
			return cga.emogua.delay(3000).then(
				() => cga.emogua.waitTeamBlock(total, teamates, interruptor, timer)
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
		});
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
		});
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
			}).then(() => cga.emogua.delay(1000)).then(
				() => cga.emogua.sell(x, y, filter)
			);
		}
		return Promise.resolve();
	};
	cga.SetImmediateDoneWork(true);
	// cga.GetCraftStatus() 0 打开制造界面 1 制造中 2 制造完成 4 修理中 | 鉴定中
	cga.emogua.waitWorkResult = (timeout = 90000) => new Promise((resolve, reject) => {
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
	let craftedOnce = false;
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
					if (cga.StartWork(requireInfo.skill.index, requireInfo.craft.index)) {
						cga.CraftItem(requireInfo.skill.index, requireInfo.craft.index, 0, positions);
						return cga.emogua.waitWorkResult(craftedOnce ? 2000 : 90000).then(r => {
							if (!craftedOnce) craftedOnce = r.success;
							if (r.success) return cga.emogua.pile(true).then(
								() => cga.emogua.delay(500)
							);
						});
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
	let assessedOnce = false;
	cga.emogua.assessAll = () => {
		const skill = cga.GetSkillsInfo().find(e => e.name == '鉴定');
		let result = Promise.resolve();
		if (skill) {
			cga.getInventoryItems().filter(i => !i.assessed && i.level <= skill.lv).forEach(item => {
				result = result.then(() => cga.emogua.recursion(() => {
					cga.StartWork(skill.index, 0);
					if (cga.GetPlayerInfo().mp >= (item.level * 10) && cga.AssessItem(skill.index, item.pos)) {
						return cga.emogua.waitWorkResult(assessedOnce ? 2000 : 900000).then(r => {
							if (r.success) {
								assessedOnce = true;
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
	let repairedOnce = false;
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
					cga.StartWork(skill.index, 0);
					if (cga.GetPlayerInfo().mp >= (item.level * 10) && cga.AssessItem(skill.index, item.pos)) {
						return cga.emogua.waitWorkResult(repairedOnce ? 2000 : 900000).then(r => {
							if (r.success) {
								repairedOnce = true;
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
	cga.emogua.recharge = (orientation) => cga.emogua.turnOrientation(orientation).then(() => cga.emogua.delay(3000)).then(() => {
		const info = cga.GetPlayerInfo();
		if (info.hp < info.maxhp || info.mp < info.maxmp) {
			if (info.gold < 5000) {
				console.log('无法补血魔！！！');
				return Promise.reject();
			}
			return cga.emogua.recharge(orientation);
		}
	});
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
	cga.emogua.healSelf = (stopHealth = 200, skill = cga.GetSkillsInfo().find(s => s.name == '治疗')) => {
		const playerInfo = cga.GetPlayerInfo();
		if (skill) {
			const requireMp = 25 + skill.lv * 5;
			if (playerInfo.health > 0 && playerInfo.health < stopHealth && playerInfo.mp >= requireMp) {
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
				}).then(() => cga.emogua.healSelf(stopHealth, skill));
			}
			if (playerInfo.health == 0) {
				return Promise.resolve();
			}
		}
		return Promise.reject();
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
					() => cga.emogua.delay(1000)
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
	let autoEquip = true;
	cga.emogua.setEquipmentMinDurability = (durability) => {
		if (typeof durability == 'number') {
			equipmentMinDurability = durability;
		}
		return Promise.resolve();
	};
	cga.emogua.setAutoEquip = (on = true) => autoEquip = on;
	/**
	 * options
	 *     {
	 *         sellFilter: function
	 *         rechargeFlag: 1 补血魔 0 不补血魔
	 *         repairFlag: 1 修理 0 关闭
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
					return durability && durability.current == durability.max && durability.current <= equipmentMinDurability && !item.name.startsWith('平民') && item.name != 'ㄟ型手里剑';
				} else if (options && typeof options.sellFilter == 'function') {
					return options.sellFilter(item);
				}
				return false;
			};
			if (cga.getInventoryItems().filter(filter).length > 0) {
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
							(durability.current < durability.max && durability.current <= equipmentMinDurability)
						)
					;
				}
				return false;
			};
			if (repairFlag > 0 && cga.GetItemsInfo().findIndex(needRepairChecker) >= 0 && cga.getInventoryItems().length < 20) {
				return Promise.resolve().then(() => {
					// cga.emogua.goto(n => n.falan.mbank).then(
					// 	() => cga.emogua.autoWalk([82,8])
					// );
					return cga.emogua.goto(n => n.elsa.x).then(
						() => cga.emogua.autoWalk([143,110])
					);
				}).then(() => cga.emogua.recursion(() => {
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
			if (rechargeFlag > 0 && (playerInfo.hp < playerInfo.maxhp || playerInfo.mp < playerInfo.maxmp || pets.find(p => p.hp < p.maxhp || p.mp < p.maxmp) || petHurt)) {
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
								() => cga.emogua.delay(2000)
							).then(
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
				});
			}
			return Promise.resolve();
		};
		const findDoctor = () => cga.emogua.recursion(() => {
			if (cga.GetPlayerInfo().health > 0) {
				return cga.emogua.goto(n => n.castle.x).then(() => {
					const units = cga.GetMapUnits();
					let doctor;
					if (options.doctorName) {
						doctor = units.find(u => (u.flags & cga.emogua.UnitFlags.Player) && u.unit_name == options.doctorName);
					} else {
						doctor = units.find(
							u => (u.flags & cga.emogua.UnitFlags.Player) && (
								u.nick_name.indexOf('治疗') >= 0 || u.nick_name.indexOf('医') >= 0 || u.title_name.indexOf('医') >= 0
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
			cga.emogua.updateSkillsCache();
			return cga.emogua.pile(true).then(
				() => cga.emogua.dropItems()
			).then(
				() => findDoctor()
			).then(
				() => getBackSouls()
			).then(
				() => recharge()
			).then(
				() => sell()
			).then(
				() => crystal()
			).then(
				() => repair()
			).then(() => {
				const badge = typeof options.badge == 'boolean' ? options.badge : false;
				if (badge) {
					return cga.emogua.getDwarfBadge().then(r => r ? cga.emogua.logBack().then(() => recharge()) : Promise.resolve());
				}
			});
		} else {
			return cga.emogua.pile().then(() => cga.emogua.dropItems());
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
	cga.emogua.DebuffFlags = DebuffFlags;
	cga.emogua.BattlePositionMatrix = BattlePositionMatrix;
	cga.emogua.getBattleSets = require('./battle-sets');
	cga.emogua.AutoBattlePreset = {
		getAttackSets: (options = {}) => {
			options.flag = 1;
			return cga.emogua.getBattleSets(cga, options);
		},
		getEscapeSets: () => cga.emogua.getBattleSets(cga, {flag: 0}),
		getBattleRechargeMpAction: (minMp = 300, pet = false) => {
			return {
				user: 1,
				check: context => (context.playerUnit.curmp <= minMp || (pet && context.petUnit.curmp <= minMp)) && cga.getInventoryItems().find(i => i.type == 23 && !['星鳗饭团','香水：深蓝九号'].includes(i.name)),
				type: '物品',
				item: context => cga.getInventoryItems().find(i => i.type == 23 && i.name != '星鳗饭团').pos,
				targets: context => pet ? [context.playerUnit, context.petUnit].filter(u => u.curmp <= minMp).map(u => u.pos) : [context.player_pos]
			};
		},
		getBattleRechargeHpAction: (minHp = 300, pet = false) => {
			return {
				user: 1,
				check: context => (context.playerUnit.curhp <= minHp || (pet && context.petUnit.curhp <= minHp)) && cga.getInventoryItems().find(i => i.type == 43 && i.name != '香水：深蓝九号'),
				type: '物品',
				item: context => cga.getInventoryItems().find(i => i.type == 43).pos,
				targets: context => pet ? [context.playerUnit, context.petUnit].filter(u => u.curhp <= minHp).map(u => u.pos) : [context.player_pos]
			};
		},
		getMaxHorizontalTargets: (context) => context.enemies.back.length > context.enemies.front.length ? context.enemies.back.map(u => u.pos) : context.enemies.front.map(u => u.pos),
		KillFirstName: ['帕布提斯马','被唤醒的亡魂'],
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
	 *
	 *     playerUnit
	 *     petUnit
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
	 *         check: context => boolean
	 *
	 *         type: '技能 攻击 防御 逃跑 位置 宠物 物品 什么都不做',
	 *
	 *         skillName: '因果报应', // cga.GetSkillsInfo() & cga.GetSubSkillsInfo(info.index)
	 *         skillLevel: 1,
	 *         force: false, //强制释放
	 *         targets: context => [position],
	 *         rollback: '不能释放回退: 攻击 | 防御 | 什么都不做',
	 *         item: context => position,
	 *     }
	 * ]
	 * 默认首回合不延迟，如果屏蔽切图且第一回合敌人全被飞或者己方全被飞会掉线
	 * 什么都不做目前只有宠物支持
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
			cga.BattleNormalAttack(matchedTarget);
		} else {
			console.log('任务攻击没有可用目标->' + JSON.stringify(targets));
		}
	};
	const applyPlayerRollbackAction = (context, type = '攻击') => {
		if (type == '防御') {
			cga.BattleGuard();
		} else if (strategy.type == '什么都不做') {
			cga.BattleDoNothing();
			console.log('player rollabck 什么都不做');
		} else {
			applyPlayerNormalAttack(context, cga.emogua.AutoBattlePreset.getSortedEnemies(context));
		}
	};
	const applyPlayerStrategy = (context, strategy) => {
		try {
			if (strategy.type == '什么都不做') {
				cga.BattleDoNothing();
				// console.log('player 什么都不做');
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
					}
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
				// console.log('宠物 什么都不做');
			} else {
				const skillInfo = context.getAvaliablePetSkillInfo(strategy);
				if (skillInfo) {
					//console.log(skillInfo);
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
		const matchedStrategy = petStrategies.find(strategy =>
			strategy.type == '什么都不做' || (strategy.check(context) && typeof context.getAvaliablePetSkillInfo(strategy) == 'object')
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
			return getSkillsInfoCache();
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
			return getPetsSkillsInfoCache();
		}
	};
	let SkillsInfoCache = getSkillsInfoCache();
	let PetsSkillsInfoCache = getPetsSkillsInfoCache();
	let pet2 = true;
	cga.emogua.updateSkillsCache = () => {
		SkillsInfoCache = getSkillsInfoCache();
		PetsSkillsInfoCache = getPetsSkillsInfoCache();
	};
	cga.emogua.setBattlePet2 = (set = true) => {
		pet2 = set;
	};
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

		if (state & BattleActionFlags.ISPLAYER) {
			const matchedStrategy = (state & BattleActionFlags.ISDOUBLE ? player2Strategies : playerStrategies).find(strategy => {
				if (strategy.check(context)) {
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
	// 等待战斗或者切图
	cga.emogua.waitAfterBattle = (battled = false) => Promise.resolve().then(() => {
		const world = cga.GetWorldStatus();
		const game = cga.GetGameStatus();
		if (world == 9 && game == 3) {
			return battled;
		}
		return cga.emogua.delay(1000).then(() => cga.emogua.waitAfterBattle(battled ? battled : world == 10));
	}).catch(r => cga.emogua.waitAfterBattle(battled));
	let AutoBattleFirstRoundDelay = 4000;
	let AutoBattleRoundDelay = 4000;
	let isFirstBattleAction = false;
	let lastRound = -1;
	let isBossBattle = false;
	const waitBattleAction = () => {
		cga.AsyncWaitBattleAction((error, state) => {
			if (typeof state == 'number') {
				if (BattleActionFlags.END & state) {
					cga.emogua.waitAfterBattle().then(() => {
						cga.emogua.pile().then(
							() => cga.emogua.dropItems()
						);
					});
					isFirstBattleAction = true;
					lastRound = -1;
					isBossBattle = false;
				} else if (BattleActionFlags.BEGIN & state) {
					isFirstBattleAction = true;
					lastRound = -1;
					isBossBattle = false;
				} else {
					if (playerStrategies.length > 0) {
						const context = cga.GetBattleContext();
						let delay = AutoBattleRoundDelay;
						if (isFirstBattleAction) {
							isBossBattle = (cga.GetBGMIndex() == 14);
							delay = AutoBattleFirstRoundDelay;
							if (isBossBattle) {
								console.log('BOSS战斗');
							}
							if (context.round_count == 1) { // 被偷袭
								console.log('被偷袭');
								//delay += AutoBattleFirstRoundDelay;
							}
						} else if (lastRound === context.round_count) {
							delay = 0;
						}
						context.isBoss = isBossBattle;
						if (delay > 0) setTimeout(() => battle(state, context), delay);
						else battle(state, context);
						lastRound = context.round_count;
						//console.log(context);
					}
					isFirstBattleAction = false;
				}
			}
			waitBattleAction();
		}, 120000);
	};
	let AutoBattleEnabled = false;
	const BattleStrategyCache = [];
	cga.emogua.autoBattle = (strategies, firstRoundDelay, roundDelay, force = false) => {
		if (strategies && strategies.length > 0) {
			if ((force || CustomFunctionsFlag) && !AutoBattleEnabled) {
				AutoBattleEnabled = true;
				waitBattleAction();
			}
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
		} else {
			console.log('取消脚本战斗');
			playerStrategies = [];
			player2Strategies = [];
			petStrategies = [];
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
			if (item.name.startsWith('隐秘的徽记')) return 20;
			return 40;
		}
	};
	cga.emogua.pile = (force = false) => {
		if (force || cga.isInNormalState()) {
			const cache = {};
			const items = cga.GetItemsInfo();

			let emptyCursor = 0;
			const emptyIndexes = cga.emogua.getEmptyBagIndexes(items);
			const equips = items.filter(i => {
				if (i.pos <= 4) {
					if (cga.emogua.getDurability(i).current <= equipmentMinDurability) {
						if (emptyIndexes[emptyCursor]) {
							cga.MoveItem(i.pos, emptyIndexes[emptyCursor++], -1);
						}
						return false;
					}
					return true;
				}
				return false;
			});
			let head, body, foot, weapon, shield;
			items.filter(i => i.pos >= 8 && i.pos < 100).forEach(item => {
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
				} else {
					if (autoEquip && item.type >= 0 && item.type <= 14 && item.name != '狐皮披风' && cga.emogua.getDurability(item).current > equipmentMinDurability) {
						if (!weapon && item.type >= 0 && item.type <= 6 && !equips.find(i => [2,3].includes(i.pos) && i.type >= 0 && i.type <= 6)) {
							weapon = item;
							cga.MoveItem(item.pos, 2, -1);
						} else if (!shield && item.type == 7 && !equips.find(i => [2,3].includes(i.pos) && i.type == 7)) {
							shield = item;
						} else if (!head && [8,9].includes(item.type) && !equips.find(i => i.pos == 0)) {
							head = item;
							cga.UseItem(item.pos);
						} else if (!body && [10,11,12].includes(item.type) && !equips.find(i => i.pos == 1)) {
							body = item;
							cga.UseItem(item.pos);
						} else if (!foot && [13,14].includes(item.type) && !equips.find(i => i.pos == 4)) {
							foot = item;
							cga.UseItem(item.pos);
						}
					}
				}
			});
			const currentWeapon = weapon || equips.find(i => [2,3].includes(i.pos) && i.type >= 0 && i.type <= 6);
			if (shield && (!currentWeapon || currentWeapon.type == 2 || ([0,1].includes(currentWeapon.type) && currentWeapon.attr.includes('$0种类 单手')))) {
				cga.MoveItem(shield.pos, 3, -1);
			}
		}
		return Promise.resolve();
	};
	cga.emogua.keepAlive = (say = false) => {
		if (say && cga.isInNormalState()) {
			cga.emogua.sayWords();
		}
		setTimeout(() => cga.emogua.keepAlive(true), 55000);
	};
	return cga;
});
