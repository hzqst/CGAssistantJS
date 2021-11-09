//version 1.3
const fix = true;
const debug = false;
module.exports = function(cga) {
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
			//console.log(this.station.id);
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
			eout: new Station([265,434,'莎莲娜']),
			wout: new Station([216,456,'莎莲娜']),
			nout: new Station([225,442,'莎莲娜'])
		}, dwarf: {
			x: new Station([110,191,'矮人城镇']),
			nurse: new Station([163, 94, '矮人城镇']),
			hnurse: new Station([163, 95, '矮人城镇']),
			doctor: new Station([163, 91, '矮人城镇']),
			bank: new Station([163, 104, '矮人城镇']),
			sell: new Station([121, 110, '矮人城镇']),
			elom: new Station([97, 124, '矮人城镇']),
			out: new Station([231, 434, '肯吉罗岛'])
		}
	};
	Network.elsa.x.links = [
		new Link(Network.elsa.a), new Link(Network.elsa.b),
		new Link(Network.castle.x, () => {
			let times = 0;
			return cga.emogua.recursion(
				() => cga.emogua.waitNPCDialog(dialog => {
					if (typeof dialog.type == 'number') {
						return true;
					}
					return Promise.reject();
				}, 1000)
			).then(
				() => cga.emogua.recursion(
					() => cga.emogua.talkNpc(141,104,cga.emogua.talkNpcSelectorYesFixTimes(1), '里谢里雅堡').then(
						() => Promise.reject(),
						() => {
							if (times > 3) {
								cga.LogOut();
								process.exit(1);
								return Promise.reject(23);
							}
							times++;
							return cga.emogua.logBack()
							.then(()=>cga.emogua.delay(2000));
						}
					)
				).then(r => {
					if (r == 23) {
						return Promise.reject(r);
					}
				})
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
		new Link(Network.falan.w1, () => cga.emogua.turnOrientation(6)
			.then(()=>cga.emogua.delay(1000))),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,'流行商店'],Network.falan.fabric.id]))
	];
	Network.falan.s2.links = [
		new Link(Network.falan.s1), new Link(Network.falan.sell), new Link(Network.falan.sout,() => cga.emogua.autoWalk([153,241,'芙蕾雅'])),
		new Link(Network.falan.w2, () => cga.emogua.turnOrientation(0)
			.then(()=>cga.emogua.delay(1000))),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,'流行商店'],Network.falan.fabric.id]))
	];
	Network.falan.sell.links = [
		new Link(Network.falan.s2), new Link(Network.falan.s1),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,'流行商店'],Network.falan.fabric.id])),
		new Link(Network.castle.s, () => cga.emogua.autoWalkList([[153,100,'里谢里雅堡']]))
	];
	Network.falan.w1.links = [
		new Link(Network.falan.w2), new Link(Network.falan.wout,() => cga.emogua.autoWalk([22,88,'芙蕾雅'])),
		new Link(Network.falan.e1, () => cga.emogua.turnOrientation(6)
			.then(()=>cga.emogua.delay(1000))),
		new Link(Network.falan.whospital, () => cga.emogua.autoWalk([82,83,'医院']))
	];
	Network.falan.w2.links = [
		new Link(Network.falan.w1), new Link(Network.falan.wout,() => cga.emogua.autoWalk([22,88,'芙蕾雅'])),
		new Link(Network.falan.e2, () => cga.emogua.turnOrientation(0)
			.then(()=>cga.emogua.delay(1000)))
	];
	Network.falan.e1.links = [
		new Link(Network.falan.e2), new Link(Network.falan.eout,() => cga.emogua.autoWalk([281,88,'芙蕾雅'])),
		new Link(Network.falan.m1, () => cga.emogua.recursion(async ()=>{
			//if(cga.GetMapName()!='法兰城') {
			if(cga.GetMapName()=='市场三楼 - 修理专区') {	
				return Promise.reject();
			}
			await cga.emogua.turnOrientation(0);
			await cga.emogua.delay(1000);
		})),
		new Link(Network.falan.bank, () => cga.emogua.autoWalkList([
			[238,111,'银行'], Network.falan.bank.id
		]))
	];
	Network.falan.e2.links = [
		new Link(Network.falan.e1), new Link(Network.falan.eout,() => cga.emogua.autoWalk([281,88,'芙蕾雅'])),
		new Link(Network.falan.m2, () => cga.emogua.turnOrientation(6)),
		new Link(Network.falan.ehospital, () => cga.emogua.autoWalk([221,83,'医院']))
	];
	Network.falan.sout.links = [
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[513,282,'曙光骑士团营地'],[55,47,'辛希亚探索指挥部'],[7,4,[91, 6]],[95,9,'*'],[8,21]
		]).then(() => cga.emogua.turnOrientation(4, '圣骑士营地')).then(
			() => cga.emogua.autoWalk(Network.camp.x.id)
		))
	];
	Network.falan.wout.links = [
		new Link(Network.falan.isle, () => cga.emogua.autoWalk([397,168]).then(
			() => cga.GetMapUnits().find(u => u.model_id > 0 && u.unit_name == '阿鲁卡')
		).then(
			() => cga.emogua.talkNpc(398,168,cga.emogua.talkNpcSelectorYesFixTimes(1),'小岛')
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
		])),
		new Link(Network.dwarf.x, () => cga.emogua.autoWalkList([
			[36,87,'肯吉罗岛'],[384,245,'蜥蜴洞穴'],[12,2,'肯吉罗岛'],[231,434,'矮人城镇']
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
	Network.dwarf.x.links = [
		new Link(Network.dwarf.sell),new Link(Network.dwarf.elom)
	];
	Network.dwarf.sell.links = [
		new Link(Network.dwarf.nurse),new Link(Network.dwarf.hnurse),new Link(Network.dwarf.bank),new Link(Network.dwarf.doctor),new Link(Network.dwarf.elom),
		new Link(Network.dwarf.out, () => cga.emogua.autoWalkList([
			[110,191,'肯吉罗岛']
		]))
	];
	Network.dwarf.hnurse.links = [
		new Link(Network.dwarf.nurse),new Link(Network.dwarf.sell),new Link(Network.dwarf.bank),new Link(Network.dwarf.doctor),new Link(Network.dwarf.elom)
	];
	Network.dwarf.nurse.links = Network.dwarf.bank.links = Network.dwarf.doctor.links = [new Link(Network.dwarf.hnurse)];
	Network.dwarf.elom.links = [new Link(Network.dwarf.sell)];
	Network.teleport.jenova.links = [
		new Link(Network.jenova.eout, () => cga.emogua.autoWalk([71,18,'莎莲娜'])),
		new Link(Network.jenova.wout, () => cga.emogua.autoWalk([24,40,'莎莲娜'])),
		new Link(Network.jenova.nout, () => cga.emogua.autoWalk([32,27,'莎莲娜']))
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
	const getCurrentStation = () => {
		const info = cga.emogua.getMapInfo();
		const nameString = info.x + '-' + info.y + '-' + info.name;
		const indexString = info.x + '-' + info.y + '-' + info.indexes.index3;
		for (let obj of Object.values(Network)) {
			if (typeof obj == 'object') {
				for (let station of Object.values(obj)) {
					if (
						station instanceof Station &&
						(station.idString == nameString ||station.idString == indexString)
					) {
						return station;
					}
				}
			}
		}
		// console.log('not valid station', info);
	};
	const getStationOrLogback = (times = 3) => {
		const current = getCurrentStation();
		if (!current) {
			if (times <= 0) {
				console.log('goto can not get station');
				return Promise.reject();
			}
			return cga.emogua.logBack().then(
				() => getStationOrLogback(times - 1)
			);
		}
		return Promise.resolve(current);
	};
	const getLinkPaths = (links, target, preStations = []) => {
		return reducePaths(
			links.map(link => {
				if (preStations.findIndex(s => s.idString == link.station.idString) > -1) return [];
				if (link.station.idString == target.idString) return [link];
				let subs = getLinkPaths(link.station.links, target, preStations.concat(link.station));
				subs.forEach(sub => sub.unshift(link));
				return subs;
			})
		);
	};
	const go = (targetFunction) => {
		const target = targetFunction(Network);
		if (target) {
			return cga.emogua.waitAfterBattle().then(() => {
				if (cga.GetMapName() == '艾尔莎岛') {
					return cga.emogua.autoWalk(Network.elsa.x.id);
				}
			}).then(
				() => getStationOrLogback()
			).then(current => {
				if (current.idString != target.idString) {
					const paths = getLinkPaths(current.links, target);
					if ((!paths || paths.length == 0)) {
						if (!Network.landings.find(l => l.idString == current.idString)) {
							return cga.emogua.logBack().then(() => go(targetFunction));
						}
						console.log('goto no links to', target.id);
						return Promise.reject();
					}
					let short;
					for (let p of paths) {
						if (!short) {
							short = p;
						} else if (short.length > p.length) {
							short = p;
						}
					}
					//console.log(short);
					let errorTimes = 0;
					return short.reduce(
						(a,c) => a.then(async () => {
							if(fix){
								if(debug) console.log('目标：'+c.station.id)
								await cga.emogua.recursion(async ()=>{
									if(debug) console.log('移动中...' + c.station.id)
									await c.arrive();
									if(debug) console.log('到达并进行坐标检查')
									const mapInfo = cga.getMapInfo();
									const mapIndex = mapInfo.indexes.index3;
									if(mapInfo.x == c.station.id[0] && mapInfo.y == c.station.id[1] && (mapInfo.name == c.station.id[2] || mapIndex === c.station.id[2])){
										if(debug) console.log('检查 通过!')
										return Promise.reject();
									}else{
										if(debug) console.log('检查 不通过!')
										await cga.emogua.delay(2000);
										if(debug) console.log('重试!')
										errorTimes++;
										if(errorTimes>20){
											//超过20次无法切图，重启脚本
											process.abort();
										}
									}
								})
								return Promise.resolve();
							}else{
								return c.arrive();
							}
						}), 
						Promise.resolve()
					).catch(r => {
						console.log('goto failed', r);
						return Promise.reject();
					});
				}
			});
		}
		console.log('goto can not get target');
		return Promise.reject();
	};
	return go;
};
