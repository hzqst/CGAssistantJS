/**
 * health 0 1-25(白) 26-50(黄) 51-75(粉) 76-100(红)
 * direction 0(右上)
 * x 东西 y 南北 从左到右 从上到下 递增
 * 高速移动中不可丢东西
 * cga.ForceMove(direction, false); true 人物坐标移动 false 只发包服务器
 * cga.ForceMoveTo(cga.GetMapXY().x, cga.GetMapXY().y, false); x或者y可同时跨越最多+5格子
 *   true | false 本人是否可见 false只有地图可见
 * cga.getMapObjects()
 *     [ { x: 199, y: 209, mapx: 199, mapy: 209, cell: 10 }] cell 10(地图出入口) 3(迷宫出入口)
 * dialog options:
 *     0  : 列表选择 cga.ClickNPCDialog(-1, 6) 第一个参数应该是被忽略的，第二个参数选择列表序号，从0开始
 *     1  : 确定按钮 cga.ClickNPCDialog(1, -1)
 *     2  : 取消按钮 cga.ClickNPCDialog(2, -1)
 *     3  : 确定取消 cga.ClickNPCDialog(1, -1) 1确定 2取消
 *     12 : 是否按钮 cga.ClickNPCDialog(4, -1) 4是 8否
 *     32 : 下一步 cga.ClickNPCDialog(32, -1) 32下一步
 *     23 : 打开银行对话框
 * cga.GetWorldStatus
 *     9 平时 10 战斗 11 与服务器联机被切断
 * cga.GetGameStatus
 *     202 | 205  切图
 *     1 未知
 *     2 卡住战斗 4 战斗选择 5 战斗中 8 战斗结束一瞬间的状态 11 战斗切图，不能用来判断战斗，因为战斗中会有小瞬间是3空闲状态
 *     3 空闲
 * 装备栏顺序
 *     0 头 1 衣服 2 左手 3 右手 4 鞋 5 左饰品 6 右饰品 7 水晶
 * 物品类型
 *     0-6 武器 0剑 1斧 2枪 3杖 4弓 5小刀 6回力
 *     7-14 防具 7盾 8盔 9帽 10铠 11衣 12袍 13靴 14鞋
 *     23 料理 29 矿条 30 木 38 宝石 43 血瓶 34 蔬菜 35 其它食材 32 肉 31 布 26 鹿皮
 * cga.GetMapUnits 返回附近11格范围内的units
 * cga.GetSysTime()
 *     hours 6点以后是早上(4-6黎明无月亮)，18点以后是晚上(16-18黄昏无太阳)
 */
module.exports = new Promise(resolve => {
	const cga = require('../../cgaapi')(() => setTimeout(() => resolve(cga)));
}).then(cga => {
	console.log('cga连接成功', new Date().toLocaleString());
	cga.AsyncConnect = (port,callback) => setTimeout(() => callback());
	cga.emogua = {};
	cga.emogua.UnitFlags = {
		NpcEntry: 4096, // npc 或者 随机入口
		Item: 1024,
		Player: 256
	};
	cga.emogua.delay = (millisecond) => new Promise(resolve => setTimeout(resolve, millisecond));
	// 等待战斗或者切图结束
	cga.emogua.waitForNormal = async () => {
		let battled = false;
		while (cga.GetWorldStatus() != 9 || cga.GetGameStatus() != 3) {
			battled = true;
			await cga.emogua.delay(500);
		}
		return battled;
	};
	let autoDownloadMap = false;
	cga.emogua.setAutoDownloadMap = (value = false) => autoDownloadMap = value;
	cga.emogua.isMapDownloaded = (mapIndex = cga.GetMapIndex()) => {
		if (mapIndex.index1 === 0) {
			if (autoDownloadMap) {
				const table = cga.GetMapTileTable(true);
				const loadedLength = table.cell.filter(c => c > 0).length;
				return loadedLength >= 700 || table.cell.length <= 1200 || (table.cell.length <= 5000 && loadedLength >= 200) || (loadedLength / table.cell.length) >= 0.4;
			}
			return true;
		}
		return cga.isMapDownloaded();
	};
	cga.emogua.downloadPartialMap = ({xfrom, yfrom, xend, yend}) => new Promise(
		(resolve, reject) => cga.downloadMapEx(xfrom, yfrom, xend, yend, error => setTimeout(() => error ? reject(error) : resolve()))
	);
	cga.emogua.downloadMap = (force = false) => {
		if(force || !cga.emogua.isMapDownloaded()) {
			console.log('下载地图');
			return new Promise((resolve, reject) => cga.downloadMap(error => setTimeout(() => error ? reject(error) : resolve()))).then(
				() => console.log('下载地图完成')
			);
		}
		return Promise.resolve();
	};
	/**
	 * destination
	 *   {
	 *     map: map.name || map.index3, name == '*' 则需要 lastMapIndex (cga.GetMapIndex().index3) 才能确保切图逻辑正确 x,y优先级高于map
	 *     x: x,
	 *     y: y
	 *   }
	 */
	cga.emogua.waitForDestination = async (destination, lastMapIndex) => {
		destination.delay = 500;
		destination.timeout = 10000;
		if (destination.map && destination.map == '*') {
			if (typeof lastMapIndex == 'number') {
				const timer = Date.now();
				do {
					await cga.emogua.delay(destination.delay);
					if (cga.GetMapIndex().index3 != lastMapIndex) {
						return;
					}
				} while (Date.now() - timer < destination.timeout);
				throw 3;
			}
			await cga.emogua.delay(2000);
			return;
		} else if (typeof destination.x == 'number' && typeof destination.y == 'number') {
			delete destination.map;
		}
		return new Promise((resolve, reject) => cga.AsyncWaitMovement(
			destination, (error, code) => {
				if (error) {
					console.log(destination, error, code);
				}
				setTimeout(() => error ? reject(code) : resolve());
			}
		));
	};
	/**
	 * target
	 *   [x, y, destination]
	 */
	cga.emogua.walkTo = (target) => {
		return new Promise((resolve, reject) => cga.AsyncWalkTo(
			target[0], target[1], target[2] && target[2].map, target[2] && target[2].x, target[2] && target[2].y,
			(error, code) => setTimeout(() => error ? reject(code) : resolve())
		));
	};
	cga.emogua.walkToList = async (targets) => {
		for (const target of targets) {
			await cga.emogua.walkTo(target);
		}
	};
	const PF = require('pathfinding');
	cga.emogua.autoWalk = async (target, options = {compress: true}) => {
		await cga.emogua.downloadMap();
		const compress = !(options && options.compress === false);
		const matrix = cga.buildMapCollisionMatrix(!compress).matrix;
		let code;
		do {
			await cga.emogua.waitForNormal();
			const mapInfo = cga.GetMapXY();
			const grid = new PF.Grid(matrix);
			const finder = new PF.AStarFinder({allowDiagonal: true, dontCrossCorners: true});
			const path = compress ? PF.Util.compressPath(finder.findPath(mapInfo.x, mapInfo.y, target[0], target[1], grid)) : finder.findPath(mapInfo.x, mapInfo.y, target[0], target[1], grid);
			if (path.length > 0) {
				if (target[2]) path[path.length - 1][2] = target[2];
				if (path.length > 1) path.shift();
				code = await cga.emogua.walkToList(path).catch(c => c);
				if (!code && !target[2]) {
					await cga.emogua.delay(500);
					if (await cga.emogua.waitForNormal()) {
						code = 2;
					} else {
						const current = cga.GetMapXY();
						if (current.x != target[0] || current.y != target[1]) {
							code = 5;
						}
					}
				}
			} else {
				code = undefined;
			}
			if (code == 3) {
				console.log('自动寻路卡住', mapInfo, target);
			}
		} while(code == 2 || code == 5);
		if (code) {
			if (code === 4 && target[2]) {
				if (typeof target[2].map == 'string' && (target[2].map == '*' || target[2].map == cga.GetMapName())) {
					return;
				} else if (typeof target[2].map == 'number' && target[2].map == cga.GetMapIndex().index3) {
					return;
				} else if (typeof target[2].x == 'number' && typeof target[2].y == 'number') {
					const current = cga.GetMapXY();
					if (current.x == target[2].x && current.y == target[2].y) {
						return;
					}
				}
			}
			throw '自动寻路失败 ' + code;
		}
	};
	cga.emogua.autoWalkList = async (targets) => {
		for (let target of targets) {
			await cga.emogua.autoWalk(target);
		}
	};
	cga.emogua.turnTo = async (target) => {
		const lastMapIndex = target[2] && target[2].map == '*' && cga.GetMapIndex().index3;
		cga.turnTo(target[0], target[1]);
		if (target[2]) {
			await cga.emogua.waitForDestination(target[2], lastMapIndex);
		}
	};
	const talkNpcSelectors = {
		yesGenerator: (max) => (dialog, times) => {
			switch (dialog.options) {
				case 12:
					cga.ClickNPCDialog(4, -1);
					break;
				case 32:
					cga.ClickNPCDialog(32, -1);
					break;
				case 1:
					cga.ClickNPCDialog(1, -1);
					break;
				case 2:
					cga.ClickNPCDialog(2, -1);
					break;
				case 3:
					cga.ClickNPCDialog(1, -1);
					break;
				case 8:
					cga.ClickNPCDialog(8, -1);
					break;
				case 4:
					cga.ClickNPCDialog(4, -1);
					break;
				case 0:
					break;
			}
			return dialog && times < max;
		},
		noGenerator: (max) => (dialog, times) => {
			switch (dialog.options) {
				case 12:
					cga.ClickNPCDialog(8, -1);
					break;
				case 32:
					cga.ClickNPCDialog(32, -1);
					break;
				case 1:
					cga.ClickNPCDialog(1, -1);
					break;
				case 2:
					cga.ClickNPCDialog(2, -1);
					break;
				case 3:
					cga.ClickNPCDialog(1, -1);
					break;
				case 8:
					cga.ClickNPCDialog(8, -1);
					break;
				case 4:
					cga.ClickNPCDialog(4, -1);
					break;
				case 0:
					break;
			}
			return dialog && times < max;
		},
		sellGenerator: (sellList) => (dialog, times) => {
			if (dialog.type == 5) {
				cga.ClickNPCDialog(-1, dialog.message.charAt(dialog.message.length - 1) == '3' ? 1 : 0);
			} else if (dialog.type == 7 && times == 2) {
				cga.SellNPCStore(sellList);
			}
			return dialog;
		},
		buyGenerator: (buyList) => (dialog, times) => {
			if (dialog.type == 5) {
				cga.ClickNPCDialog(-1, 0);
			} else if (dialog.type == 6 && times == 2) {
				cga.BuyNPCStore(buyList);
			}
			return dialog;
		},
		exchangeGenerator: (exchangeList) => (dialog, times) => {
			if (dialog.type == 27) {
				cga.ClickNPCDialog(-1, 0);
			} else if (dialog.type == 28 && times == 2) {
				cga.BuyNPCStore(exchangeList);
			}
			return dialog;
		},
		restore: dialog => {
			return dialog;
		},
		elsaToCastle: dialog => {
			if (dialog.options == 12) {
				cga.ClickNPCDialog(4, -1);
				return false;
			}
			return dialog;
		},
		learnPlayerSkill: dialog => {
			if (dialog.type == 16) {
				cga.ClickNPCDialog(-1, 0);
			} else if (dialog.type == 17) {
				cga.ClickNPCDialog(0, -1);
			} else if (dialog.options == 1) {
				cga.ClickNPCDialog(1, -1);
			}
			return dialog;
		},
		forgetPlayerSkillGenerator: (name) => dialog => {
			if (dialog.type == 16) {
				cga.ClickNPCDialog(-1, 1);
			} else if (dialog.type == 18) {
				const skillIndex = cga.GetSkillsInfo().sort((a,b) => a.pos - b.pos).findIndex(s => s.name == name);
				if (skillIndex > -1) {
					cga.ClickNPCDialog(0, skillIndex);
				}
			} else if (dialog.options == 12) {
				cga.ClickNPCDialog(4, -1);
			} else if (dialog.options == 1) {
				cga.ClickNPCDialog(1, -1);
			}
			return dialog;
		},
		giveMaterials: dialog => {
			if (dialog.type == 30) {
				cga.ClickNPCDialog(-1,0);
			} else if (dialog.type == 31) {
				if (dialog.message.includes('|银|')) { // 坎村
					cga.SellNPCStore([{itempos:1,count:(cga.getItemCount('银') - parseInt(dialog.message.split('|').pop()))}]);
				} else if (dialog.message.includes('|黄月木|')) {
					cga.SellNPCStore([{itempos:1,count:(cga.getItemCount('黄月木') - parseInt(dialog.message.split('|').pop()))}]);
				}
			}
			return dialog;
		}
	};
	talkNpcSelectors.yes = talkNpcSelectors.yesGenerator(32);
	talkNpcSelectors.no = talkNpcSelectors.noGenerator(32);
	talkNpcSelectors.healPets = (dialog) => {
		if (dialog.options == 0) {
			cga.ClickNPCDialog(-1, 6);
		}
		return false;
	};
	cga.emogua.waitNPCDialog = () => new Promise((resolve, reject) => cga.AsyncWaitNPCDialog((error, dialog) => setTimeout(() => error ? reject(error) : resolve(dialog))));
	cga.emogua.waitPlayerMenu = () => new Promise((resolve, reject) => cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => error ? reject(error) : resolve(players))));
	cga.emogua.waitUnitMenu = () => new Promise((resolve, reject) => cga.AsyncWaitUnitMenu((error, units) => setTimeout(() => error ? reject(error) : resolve(units))));
	cga.emogua.talkNpc = (target) => async (selectorFunction) => {
		const lastMapIndex = target && target[2] && target[2] == '*' && cga.GetMapIndex().index3;
		const selector = selectorFunction(talkNpcSelectors);
		if (selector) {
			if (target) {
				await cga.emogua.turnTo([target[0], target[1]]);
			}
			let times = 0;
			try {
				while(selector(await cga.emogua.waitNPCDialog(), ++times)) {
				}
			} catch (e) {
				console.log('talk npc',e);
			}
		}
		if (target && target[2]) {
			await cga.emogua.waitForDestination(target[2], lastMapIndex);
		}
	};
	const DropItemNames = ['时间的碎片','时间的结晶','绿头盔','红头盔','秘文之皮','星之砂','奇香木','巨石','龙角','坚硬的鳞片','传说的鹿皮','碎石头'];
	cga.emogua.addDropItemNames = (names) => {
		DropItemNames.push(...names);
	};
	cga.emogua.stopDropItems = () => {
		DropItemNames.splice(0, DropItemNames.length);;
	};
	let droppingItems = false;
	cga.emogua.dropItems = async (positions) => {
		if (cga.isInNormalState() && !droppingItems) { // && cga.GetMoveSpeed() 高速走路不能仍物品
			droppingItems = true;
			if (positions instanceof Array) {
				positions.forEach(position => cga.DropItem(position));
			} else if (typeof positions == 'function') {
				cga.getInventoryItems().filter(positions).forEach(i => cga.DropItem(i.pos));
			} else {
				cga.getInventoryItems().filter(i => DropItemNames.find(n => i.name.indexOf(n) >= 0)).forEach(i => cga.DropItem(i.pos));
			}
			droppingItems = false;
		}
	};
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
	const piles = require('./pile');
	cga.emogua.getPileMax = (item) => typeof piles[item.name] == 'number' ? piles[item.name] : piles[item.type];
	cga.emogua.equipmentMinDurability = 30;
	let autoEquip = false;
	cga.emogua.setAutoEquip = (value = true) => autoEquip = value;
	let sortingItems = false;
	cga.emogua.sortItems = async (force = false) => {
		if ((force || cga.isInNormalState()) && !sortingItems) {
			sortingItems = true;
			const items = cga.GetItemsInfo();
			const pileCache = {};
			for (let i = items.length - 1; i >= 0; i--) {
				const item = items[i];
				if (item.type >= 0 && item.type <= 14) {
					if (item.name != '狐皮披风') {
						item.durability = cga.emogua.getDurability(item);
					}
				} else if (item.pos >= 8) {
					const pileMax = cga.emogua.getPileMax(item);
					if (pileMax && item.count > 0 && item.count < pileMax) {
						const moveTo = pileCache[item.itemid];
						if (moveTo) {
							cga.MoveItem(item.pos, moveTo.pos, -1);
							const sum = item.count + moveTo.count;
							if (sum >= pileMax) {
								moveTo.count = pileMax;
								delete pileCache[item.itemid];
								if (sum > pileMax) {
									item.count = sum - pileMax;
									pileCache[item.itemid] = item;
								} else {
									items.splice(i, 1);
								}
							} else {
								moveTo.count = sum;
								items.splice(i, 1);
							}
						} else {
							pileCache[item.itemid] = item;
						}
					}
				}
			}
			// 0 头 1 衣服 2 左手 3 右手 4 鞋 5 左饰品 6 右饰品 7 水晶
			// 0-6 武器 0剑 1斧 2枪 3杖 4弓 5小刀 6回力
			// 7-14 防具 7盾 8盔 9帽 10铠 11衣 12袍 13靴 14鞋
			const emptyIndexes = cga.emogua.getEmptyBagIndexes(items);
			[0,1,3,2,4].forEach(position => {
				const item = items.find(i => i.pos == position);
				if (item && item.durability && item.durability.current < cga.emogua.equipmentMinDurability) {
					const moveTo = items.find(i => i.pos >= 8 && i.type == item.type);
					if (autoEquip && moveTo) {
						if (cga.MoveItem(item.pos, moveTo.pos, 1)) {
							const moveToPos = moveTo.pos;
							moveTo.pos = item.pos;
							item.pos = moveToPos;
						}
					} else {
						if (emptyIndexes.length > 0) {
							const moveToPos = emptyIndexes.shift();
							if (cga.MoveItem(item.pos, moveToPos, 1)) {
								item.pos = moveToPos;
							}
						} else {
							console.log('背包满了无法替换装备', item);
						}
					}
				} else if (autoEquip) {
					let tryTypes;
					if (position === 0) {
						tryTypes = [8,9];
					} else if (position === 1) {
						tryTypes = [10,11,12];
					} else if (position === 3) {
						tryTypes = [7];
					} else if (position === 2) {
						tryTypes = [0,1,2,3,4,5,6];
					} else if (position === 4) {
						tryTypes = [13,14];
					}
					if (tryTypes) {
						const moveFrom = items.find(i => i.pos >= 8 && i.durability && i.durability.rate == 1 && tryTypes.includes(i.type));
						if (moveFrom) {
							if (cga.MoveItem(moveFrom.pos, position, -1)) {
								moveFrom.pos = position;
							}
						}
					}
				}
			});
			// 换戒指
			let accessory = items.find(i => i.pos == 5);
			if (accessory && (accessory.itemid == 491322 || accessory.itemid == 491323)) {
				const accessoryDurability = cga.emogua.getDurability(accessory);
				if (accessoryDurability.current < 100) {
					cga.DropItem(5);
					accessory = undefined;
				}
			}
			if (!accessory) {
				const moveFrom = items.find(i => i.pos >= 8 && (i.itemid == 491322 || i.itemid == 491323));
				if (moveFrom && cga.MoveItem(moveFrom.pos, 5, -1)) {
					moveFrom.pos = 5;
				}
			}
			sortingItems = false;
		}
	};
	cga.emogua.getGuiSetting = () => new Promise((resolve, reject) => cga.gui.GetSettings((error, setting) => error ? reject(error) : resolve(setting)));
	cga.emogua.loadGuiSetting = (settings) => new Promise((resolve, reject) => cga.gui.LoadSettings(settings, (error, result) => error ? reject(error) : resolve(result)));
	cga.emogua.loadGuiScript = (settings) => new Promise((resolve, reject) => cga.gui.LoadScript(settings, (error, result) => error ? reject(error) : resolve(result)));
	cga.emogua.loadGuiAccount = (settings) => new Promise((resolve, reject) => cga.gui.LoadAccount(settings, (error, result) => error ? reject(error) : resolve(result)));
	cga.emogua.stopScript = async () => {
		await cga.emogua.loadGuiScript({autorestart: false});
		process.exit();
	};
	cga.emogua.shuffle = (arr) => {
		let i = arr.length;
		while (i) {
			let j = Math.floor(Math.random() * i--);
			[arr[j], arr[i]] = [arr[i], arr[j]];
		}
		return arr;
	};
	cga.emogua.getMovablePositionsAround = (target) => {
		const result = [];
		const walls = cga.buildMapCollisionMatrix(true);
		const isPositionMovable = (x, y) => walls.matrix[y][x] == 0;
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
	cga.emogua.sayWords = (words = '', color = 0, range = 1, size = 1) => Promise.resolve(cga.SayWords(words, color, range, size));
	cga.emogua.cachedPlayer = cga.GetPlayerInfo();
	// 不可以在战斗中获取
	let teammates = [];
	cga.emogua.getTeammates = () => {
		if (cga.isInNormalState()) {
			teammates = cga.getTeamPlayers().filter(e => !e.is_me);
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
	/**
	teams: [{names:[]...}]
	 */
	cga.emogua.parseTeams = (teams) => {
		const player = cga.emogua.cachedPlayer;
		const setting = teams.find(t => t.names.find(n => n == player.name));
		if (!setting) {
			console.log('未知队伍', player.name);
			return {};
		}
		console.log('current setting: ', setting);
		return Object.assign(setting, {
			team: setting.names,
			captain: setting.names[0],
			isCaptain: player.name == setting.names[0],
			teamNumber: setting.names.length
		});
	};
	cga.emogua.waitMessage = (teamOnly = false, timeout = 30000) => new Promise(
		(resolve, reject) => cga.AsyncWaitChatMsg((error, chat) => setTimeout(() => error ? reject(error) : resolve(chat)), timeout)
	).then(chat => {
		if (!teamOnly || cga.emogua.getTeammates().find(t => t.unit_id == chat.unitid) || cga.emogua.cachedPlayer.unitid == chat.unitid) {
			if (chat.unitid == -1) {
				chat.player = '';
				chat.content = chat.msg;
			} else {
				const splitter = ': ';
				const [namePart, ...rest] = chat.msg.split(splitter);
				chat.player = namePart.substring(namePart.indexOf(']') + 1);
				chat.content = rest.length == 1 ? rest[0] : rest.join(splitter);
			}
			return chat;
		}
		throw '未等到message';
	});
	cga.emogua.waitTeamDialog = async ({ask, reply, timeout = 30000}) => {
		if (ask) await cga.emogua.sayWords(ask);
		const timer = Date.now();
		do {
			const chat = await cga.emogua.waitMessage(true, timeout).catch(() => {});
			if (chat && chat.content.includes(reply)) {
				return true;
			}
		} while (Date.now() - timer < timeout);
		return false;
	};
	const countRegex = /#(\d+)#/;
	cga.emogua.getCountFromChat = (chat) => {
		if (chat && chat.content) {
			try {
				const matcher = countRegex.exec(chat.content);
				if (matcher) {
					return parseInt(matcher[1]);
				}
			} catch (e) {}
		}
		return 0;
	};
	cga.emogua.turnOrientation = async (orientation, destination) => {
		const lastMapIndex = orientation && orientation.map == '*' && cga.GetMapIndex().index3;
		await cga.emogua.delay(500);
		cga.turnOrientation(orientation);
		if (destination) {
			await cga.emogua.waitForDestination(destination, lastMapIndex);
		}
	};
	cga.emogua.leaveTeam = () => {
		cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
		return cga.emogua.delay(500);
	};
	cga.emogua.kickStranger = async (name) => {
		cga.DoRequest(cga.REQUEST_TYPE_KICKTEAM);
		const dialog = await cga.emogua.waitNPCDialog();
		if (dialog.message && dialog.message.indexOf('你要把谁踢出队伍') > 0) {
			const splits = dialog.message.replace(/\n/g,"\\n").split('\\n');
			const kick = splits.slice(2, splits.length - 1).findIndex(n => n.startsWith(name));
			if (kick >= 0) {
				cga.ClickNPCDialog(-1, kick);
				await cga.emogua.delay(500);
			}
		}
	};
	// coordinate 确保组队位置，以防止意外走开
	cga.emogua.waitTeamBlock = async ({team, coordinate, interruptor}) => {
		let timer = Date.now();
		const totalTimer = timer;
		const max = team ? team.length : 5;
		const startPosition = cga.GetMapXY();
		if (!cga.IsPlayerFlagEnabled(cga.ENABLE_FLAG_JOINTEAM)) {
			cga.SetPlayerFlagEnabled(cga.ENABLE_FLAG_JOINTEAM, true);
		}
		for (;;) {
			let teammates = cga.emogua.getTeammates();
			const strangers = teammates.filter(t => team && !team.includes(t.name)).map(t => t.name);
			if (strangers.length > 0) {
				for (let s of strangers) {
					await cga.emogua.kickStranger(s);
				}
				teammates = cga.emogua.getTeammates();
			}
			if (teammates.length + 1 >= max) {
				break;
			}
			if (typeof interruptor == 'function' && interruptor({totalTimer})) {
				console.log('中断组队', new Date().toLocaleString());
				return true;
			}
			if (coordinate) {
				let currentCoordinate = cga.GetMapXY();
				if (currentCoordinate.x != coordinate[0] || currentCoordinate.y != coordinate[1]) {
					await cga.emogua.autoWalk(coordinate);
				}
			}
			const now = new Date();
			if ((now.getTime() - timer) >= 30000) {
				console.log(`等待组队满人数(${max})...`, now.toLocaleString());
				timer = now.getTime();
			}
			await cga.emogua.delay(2000);
		}
		if (coordinate) await cga.emogua.autoWalk([startPosition.x, startPosition.y]);
	};
	cga.emogua.joinTeam = async ({captainName, currentCoordinate}) => {
		const captain = cga.GetMapUnits().find(u => (u.flags & cga.emogua.UnitFlags.Player) && u.unit_name === captainName && (!currentCoordinate || u.xpos != currentCoordinate.x || u.ypos != currentCoordinate.y));
		if (captain) {
			await cga.emogua.turnTo([captain.xpos, captain.ypos]).then(
				() => cga.emogua.delay(500)
			).then(
				() => cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM)
			).then(
				() => cga.emogua.waitNPCDialog().then(
					dialog => {
						if (dialog.type === 2) {
							cga.ClickNPCDialog(-1, dialog.message.split('\n').findIndex(e => e === captainName) - 2);
							return cga.emogua.delay(500);
						}
					},
					() => {}
				)
			).then(
				() => {
					if (cga.emogua.getTeamNumber() == 1) {
						throw '无法加入队伍-' + captainName;
					} else if (cga.emogua.getTeammates()[0].name != captainName) {
						return cga.emogua.leaveTeam().then(() => {
							throw '无法加入队伍-' + captainName;
						});
					}
				}
			);
		} else {
			throw '无法加入队伍-' + captainName;
		}
	};
	cga.emogua.joinTeamBlock = async ({captainName, interruptor}) => {
		const totalTimer = Date.now();
		const startPosition = cga.GetMapXY();
		while(cga.emogua.getTeamNumber() <= 1) {
			if (typeof interruptor == 'function' && interruptor({totalTimer})) {
				console.log('中断组队', new Date().toLocaleString());
				return true;
			}
			const currentCoordinate = cga.GetMapXY();
			if (currentCoordinate.x != startPosition.x || currentCoordinate.y != startPosition.y) {
				await cga.emogua.autoWalk([startPosition.x, startPosition.y]);
			}
			await cga.emogua.joinTeam({captainName, currentCoordinate: startPosition}).catch(() => {});
			await cga.emogua.delay(2000);
		}
	};
	cga.emogua.isRegroupingTeam = false;
	cga.emogua.waitRegroupTeam = async ({team,arrive}) => {
		if (team.length <= 1) {
			if (arrive) await arrive();
			return;
		}
		const words = '重新组队';
		const timeout = 30000;
		if (cga.emogua.cachedPlayer.name == team[0]) {
			cga.emogua.isRegroupingTeam = true;
			try {
				await cga.emogua.sayWords(words);
				await cga.emogua.delay(2000).then(() => cga.emogua.leaveTeam());
				if (arrive) await arrive();
				const timer = Date.now();
				const waitPosition = cga.emogua.getMovablePositionAround(cga.GetMapXY());
				await cga.emogua.waitTeamBlock({
					team, coordinate: [waitPosition.x,waitPosition.y],
					interruptor: () => {
						if (Date.now() - timer > timeout) throw 'Regroup team timeout';
					}
				});
			} finally {
				cga.emogua.isRegroupingTeam = false;
			}
		} else {
			for(;;) {
				const chat = await cga.emogua.waitMessage(true).catch(() => {});
				if (chat && chat.content.includes(words)) {
					cga.emogua.isRegroupingTeam = true;
					try {
						while (cga.emogua.getTeamNumber() > 1) {
							await cga.emogua.delay(2000);
						}
						if (arrive) await arrive();
						const timer = Date.now();
						await cga.emogua.joinTeamBlock({
							captainName: team[0], interruptor: () => {
								if (Date.now() - timer > timeout) throw 'Regroup team timeout';
							}
						});
					} finally {
						cga.emogua.isRegroupingTeam = false;
					}
					break;
				} else if (cga.emogua.getTeamNumber() <= 1) {
					throw 'Regroup team no words said from captain';
				}
			}
		}
	};
	const waitTradeDialog = (timeout = 3000) => new Promise((resolve, reject) => cga.AsyncWaitTradeDialog((error, name, level) => setTimeout(() => error ? reject(error) : resolve({name, level})), timeout));
	const waitTradeStuffs = () => new Promise((resolve, reject) => cga.AsyncWaitTradeStuffs((error, type, args) => setTimeout(() => error ? reject(error) : resolve({type, args})), 300));
	const waitTradeState = (timeout = 3000) => new Promise((resolve, reject) => cga.AsyncWaitTradeState((error, state) => setTimeout(() => error ? reject(error) : resolve(state)), timeout));
	const getTradeItems = (filter = (item, addedItems) => false) => {
		const tradeItems = [];
		cga.getInventoryItems().forEach(i => {
			if (filter(i, tradeItems)) {
				const item = {itemid: i.itemid, itempos: i.pos, count: (i.count > 1 ? i.count : 1), name: i.name};
				tradeItems.push(item);
			}
		});
		return tradeItems;
	};
	const getTradePets = (filter = (pet, addedPets) => false) => {
		const tradePets = [];
		cga.GetPetsInfo().forEach(p => {
			if (filter(p, tradePets)) {
				tradePets.push(p);
			}
		});
		return tradePets.map(p => p.index);
	};
	/**
	 * return receivedStuffs
	 *   {items: [{name:'', attr:'', itemid: 5281, count: 0, pos: 0, level: 9, type: 6281 }], gold: 0, pets: [{}]}
	 * partyStuffsChecker (receivedStuffs) => boolean 
	 */
	const tradeInternal = async ({itemFilter, petFilter, gold, partyStuffsChecker, active = false}) => {
		if (active) {
			cga.TradeAddStuffs(
				getTradeItems(itemFilter),
				getTradePets(petFilter),
				(typeof gold == 'number') ? gold : 0
			);
		}
		const receivedStuffs = {items: [], gold: 0, pets: []};
		for(;;) {
			const state = await waitTradeState(15000).catch(() => {});
			if (state === cga.TRADE_STATE_READY) {
				const receiveList = await Promise.all([
					waitTradeStuffs().catch(() => {}),
					waitTradeStuffs().catch(() => {}),
					waitTradeStuffs().catch(() => {})
				]);
				receiveList.forEach(receive => {
					if (receive) {
						const {type, args} = receive;
						if (type === cga.TRADE_STUFFS_ITEM) {
							receivedStuffs.items = args;
						} else if (type === cga.TRADE_STUFFS_GOLD) {
							receivedStuffs.gold = args;
						} else if (type === cga.TRADE_STUFFS_PET) {
							receivedStuffs.pets = args;
						}
					}
				});
				if (!partyStuffsChecker || partyStuffsChecker(receivedStuffs)) {
					if (!active) {
						cga.TradeAddStuffs(
							getTradeItems(itemFilter),
							getTradePets(petFilter),
							(typeof gold == 'number') ? gold : 0
						);
					} else {
						cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
					}
				} else {
					cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
					break;
				}
			} else if (state === cga.TRADE_STATE_CONFIRM) {
				cga.DoRequest(cga.REQUEST_TYPE_TRADE_CONFIRM);
			} else if (state === cga.TRADE_STATE_SUCCEED) {
				return receivedStuffs;
			} else if (state === cga.TRADE_STATE_CANCEL) {
				break;
			} else {
				cga.DoRequest(cga.REQUEST_TYPE_TRADE_REFUSE);
				break;
			}
		}
		throw '交易失败';
	};
	/**
	 * party: index (0,1,2...) | name | {index,name} => boolean
	 */
	cga.emogua.trade = async ({party, itemFilter, petFilter, gold, partyStuffsChecker}) => {
		cga.DoRequest(cga.REQUEST_TYPE_TRADE);
		const players = await cga.emogua.waitPlayerMenu();
		const player = players.find(p => {
			if (typeof party == 'number') return p.index == party;
			else if (typeof party == 'function') return party(p);
			else return p.name == party
		});
		if (player) {
			cga.PlayerMenuSelect(player.index);
			return await waitTradeDialog().then(
				() => tradeInternal({itemFilter, petFilter, gold, partyStuffsChecker, active: true})
			);
		}
		throw '找不到交易人 ' + party;
	};
	cga.emogua.waitTrade = async ({partyName = undefined, itemFilter = undefined, petFilter = undefined, gold = 0, partyStuffsChecker = undefined} = {}) => {
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);
		const {name} = await waitTradeDialog(15000).catch(() => {});
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
		if (name && (!partyName || ((typeof partyName == 'function') ? partyName(name) : partyName == name))) {
			return await tradeInternal({itemFilter, petFilter, gold, partyStuffsChecker, active: false});
		}
		throw '没有交易';
	};
	/**
	 * icon
	 *   大 down, 小 up (不全是)
	 *   12002 down 12000 up (狗洞)
	 *   17967 down 17966 up (海底墓场-保证书)
	 *   13273 down 13272 up (虫洞)
	 *   17981 down 17980 up (黑色方舟)
	 *   17975 down 17974 up (黑色的祈祷)
	 *   0 迷宫出入口
	 * return [最远，最近]
	 */
	cga.emogua.getMazeEntries = async () => {
		await cga.emogua.downloadMap();
		const mapObjects = cga.getMapObjects();
		const current = cga.GetMapXY();
		const entryIcons = cga.buildMapCollisionRawMatrix().matrix;
		return mapObjects.filter(o => {
			if (o.cell == 3) {
				o.icon = entryIcons[o.y][o.x];
				return true;
			}
			return false;
		}).sort((a,b) => {
			const aDistance = Math.abs(a.x - current.x) + Math.abs(a.y - current.y);
			const bDistance = Math.abs(b.x - current.x) + Math.abs(b.y - current.y);
			return bDistance - aDistance;
		});
	};
	cga.emogua.walkRandomMaze = async (entryFilter) => {
		const entries = await cga.emogua.getMazeEntries();
		if (entries.length > 1) {
			const target = entryFilter ? entries.find(entryFilter) : entries[0];
			if (target) {
				return await cga.emogua.autoWalk([target.x, target.y, {map: '*'}]);
			}
		}
		throw 'Fail to walk random maze ' + entries;
	};
	cga.emogua.walkRandomMazeUntil = async (check, entryFilter) => {
		let times = 0;
		while (times <= 101 && !check()) {
			times++;
			await cga.emogua.walkRandomMaze(entryFilter);
		}
	};
	const getMovablePoints = (start, diagonal) => {
		const mapCollisionMatrix = cga.buildMapCollisionMatrix();
		if (diagonal && diagonal.length > 1) {
			const [minX,maxX] = [diagonal[0][0], diagonal[1][0]].sort();
			const [minY,maxY] = [diagonal[0][1], diagonal[1][1]].sort();
			const matrix = mapCollisionMatrix.matrix;
			for (let y = 0; y < matrix.length; y++) {
				for (let x = 0; x < matrix[y].length; x ++) {
					if (!(x <= maxX && x >= minX && y <= maxY && y >= minY) && matrix[y][x] == 0) {
						matrix[y][x] = 1;
					}
				}
			}
		}
		const foundedPoints = {};
		foundedPoints[start.x + '-' + start.y] = start;
		const findByNextPoints = (centre) => {
			const nextPoints = [];
			const push = (p) => {
				if (p.x > mapCollisionMatrix.x_bottom && p.x < mapCollisionMatrix.x_size && p.y > mapCollisionMatrix.y_bottom && p.y < mapCollisionMatrix.y_size) {
					if (mapCollisionMatrix.matrix[p.y][p.x] === 0) {
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
	const trimMovablePoints = (points, start) => {
		const remain = points.filter(p => {
			const xd = Math.abs(p.x - start.x);
			const yd = Math.abs(p.y - start.y);
			p.d = xd + yd;
			return !(xd < 12 && yd < 12);
		});
		return {remain, next: remain.find(p => p.d <= 24)};
	}
	/**
	 * targetFilter cga.GetMapUnits() => boolean
	 * diagonal: [[558,20], [526,40]] 限定寻找的矩形范围(对角线两个顶点,注意起点需要在范围内)
	 */
	cga.emogua.searchMap = async ({targetFilter, diagonal}) => {
		let points;
		await cga.emogua.downloadMap();
		for (;;) {
			const target = targetFilter(cga.GetMapUnits());
			if (target) {
				const walkToPoint = cga.emogua.getMovablePositionAround({x: target.xpos,y: target.ypos});
				await cga.emogua.autoWalk([walkToPoint.x, walkToPoint.y]);
				return target;
			}
			const current = cga.GetMapXY();
			const {remain, next} = trimMovablePoints(points || Object.values(getMovablePoints(current, diagonal)), current);
			if (!next) {
				throw 'Not find unit';
			}
			points = remain;
			await cga.emogua.autoWalk([next.x, next.y]);
		}
	};
	cga.emogua.toRandomEntry = async ({xfrom, yfrom, xend, yend, filter}) => {
		console.log('下载部分地图');
		await cga.emogua.downloadPartialMap({xfrom,yfrom,xend,yend});
		console.log('下载部分地图结束');
		const entries = cga.getMapObjects().filter(o => o.cell == 3 && o.x >= xfrom && o.y >= yfrom && o.x <= xend && o.y <= yend);
		let entry = filter ? filter(entries) : entries[0];
		if (entry) {
			await cga.emogua.autoWalk([entry.x, entry.y, {map:'*'}]).catch(async () => {
				const entries = cga.getMapObjects().filter(o => o.cell == 3 && o.x >= xfrom && o.y >= yfrom && o.x <= xend && o.y <= yend);
				entry = filter ? filter(entries) : entries[0];
				if (entry) {
					return await cga.emogua.autoWalk([entry.x, entry.y, {map:'*'}]);
				}
				throw '未找到随机入口';
			});
			return entry;
		}
		throw '未找到随机入口';
	};
	cga.emogua.needHNurse = (playerInfo = cga.GetPlayerInfo(), profession) => {
		if (profession && ['物理系','魔法系','宠物系'].includes(profession.category)) {
			const zsCost = (playerInfo.level - 1) * 15 + 137;
			return playerInfo.maxmp - playerInfo.mp - zsCost > 0;
		}
		return false;
	};
	cga.emogua.restore = (target) => cga.emogua.talkNpc(target)(s => s.restore);
	cga.emogua.defaultSellItemFilter = (i) => i.name == '魔石' || i.name.includes('卡片') || i.name == '锥形水晶';
	cga.emogua.getSellList = (items = cga.getInventoryItems().filter(cga.emogua.defaultSellItemFilter)) => items.map(e => {
		let sellCount = (e.count < 1) ? 1 : e.count;
		if ([29, 30, 34, 35].indexOf(e.type) >= 0 || (e.type == 26 && e.name.charAt(e.name.length-1) == '条')) {
			sellCount = parseInt((e.count / 20).toString());
		} else if ([43, 23].indexOf(e.type) >= 0) {
			sellCount = parseInt((e.count / 3).toString());
		}
		return {itempos: e.pos, itemid: e.itemid, count: sellCount};
	});
	cga.emogua.sell = async (target, sellList = cga.emogua.getSellList()) => {
		if (sellList.length > 0) {
			await cga.emogua.talkNpc(target)(s => s.sellGenerator(sellList));
		}
	};
	// buyList: [{index: 0, count: 20}]
	cga.emogua.buy = async (target, buyList = []) => {
		if (buyList.length > 0) {
			await cga.emogua.talkNpc(target)(s => s.buyGenerator(buyList));
		}
	};

	let keepLiveInterval;
	cga.emogua.keepLive = () => {
		if (!keepLiveInterval) {
			keepLiveInterval = setInterval(() => cga.isInNormalState() && cga.emogua.sayWords(), 60000);
		}
	};

	return cga;
});
