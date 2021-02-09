module.exports = (async () => {
	const cga = await require('./wrapper');
	class Station {
		// id: [x,y,destination]
		constructor(id) {
			this.id = id;
			if (this.id[2]) {
				this.id[2].x = this.id[0];
				this.id[2].y = this.id[1];
			}
			this.idString = this.id.map(i => typeof i == 'object' ? i.map : i).join('-');
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
			x: new Station([140, 105, {map:'艾尔莎岛'}]),
			a: new Station([157, 93, {map:'艾尔莎岛'}]),
			b: new Station([164, 153, {map:'艾尔莎岛'}]),
			wout: new Station([264, 108, {map:'温迪尔平原'}]),
			nout: new Station([185, 186, {map:'盖雷布伦森林'}]),
			sout: new Station([198, 48, {map:'梅布尔隘地'}])
		}, asha: {
			w: new Station([84, 112, {map:'艾夏岛'}]),
			s: new Station([164, 159, {map:'艾夏岛'}]),
			n: new Station([151, 97, {map:'艾夏岛'}]),
			bank: new Station([49, 25, {map:'银行'}])
		}, lisa: {
			n: new Station([93, 62, {map:'利夏岛'}])
		}, falan: {
			e1: new Station([242, 100, {map:'法兰城'}]),
			s1: new Station([141, 148, {map:'法兰城'}]),
			w1: new Station([63, 79, {map:'法兰城'}]),
			m1: new Station([46, 16, {map:'市场三楼 - 修理专区'}]), // {map:32737}
			e2: new Station([233, 78, {map:'法兰城'}]),
			s2: new Station([162, 130, {map:'法兰城'}]),
			w2: new Station([72, 123, {map:'法兰城'}]),
			m2: new Station([46, 16, {map:'市场一楼 - 宠物交易区'}]), // 32735
			sell: new Station([156, 123, {map:'法兰城'}]),
			eout: new Station([475,196,{map:'芙蕾雅'}]),
			sout: new Station([424,259,{map:'芙蕾雅'}]),
			wout: new Station([374,195,{map:'芙蕾雅'}]),
			mbank: new Station([83,12,{map:'市场三楼 - 修理专区'}]),
			mtrade: new Station([82,8,{map:'市场三楼 - 修理专区'}]),
			mnurse: new Station([83,8,{map:'市场三楼 - 修理专区'}]),
			bank: new Station([11, 8, {map:'银行'}]),
			ehospital: new Station([12, 42, {map:1112}]),
			whospital: new Station([12, 42, {map:1111}]),
			fabric: new Station([8, 7, {map:'流行商店'}]),
			isle: new Station([65, 98, {map:'小岛'}]),
			work: new Station([26, 24, {map:'米克尔工房'}])
		}, castle: {
			x: new Station([27, 82, {map:'里谢里雅堡'}]),
			s: new Station([41, 91, {map:'里谢里雅堡'}]),
			wout: new Station([138, 88, {map:'法兰城'}]),
			nurse: new Station([34, 88, {map:'里谢里雅堡'}]),
			clock: new Station([58, 83, {map:'里谢里雅堡'}]),
			f1: new Station([74, 40, {map:'里谢里雅堡 1楼'}]),
			teleport: new Station([25, 24, {map:'启程之间'}])
		}, teleport: {
			yer: new Station([47, 83, {map:'伊尔村'}]),
			laruka: new Station([49, 81, {map:'圣拉鲁卡村'}]),
			aleut: new Station([56, 48, {map:'亚留特村'}]),
			kili: new Station([50, 63, {map:'奇利村'}]),
			jenova: new Station([58, 43, {map:'杰诺瓦镇'}]),
			vinoy: new Station([40,36, {map:'维诺亚村'}]),
			ghana: new Station([36,40, {map:'加纳村'}]),
			albanese: new Station([36,54, {map:'阿巴尼斯村'}]),
		}, aleut: {
			eout: new Station([596,83,{map:'芙蕾雅'}]),
			nout: new Station([588,50,{map:'芙蕾雅'}])
		}, kili: {
			eout: new Station([295,325,{map:'索奇亚'}]),
			nout: new Station([274,293,{map:'索奇亚'}])
		}, grahl: {
			s: new Station([118, 214, {map:'哥拉尔镇'}]),
			c: new Station([120, 107, {map:'哥拉尔镇'}]),
			wout: new Station([226, 437, {map:'库鲁克斯岛'}]),
			eout: new Station([284, 437, {map:'库鲁克斯岛'}]),
			nout: new Station([257, 400, {map:'库鲁克斯岛'}]),
			lumi: new Station([61, 29, {map:'鲁米那斯'}])
		}, akalufa: {
			c: new Station([99, 165, {map:'阿凯鲁法村'}]),
			eout: new Station([235, 314, {map:'米内葛尔岛'}]),
			sout: new Station([203, 346, {map:'米内葛尔岛'}]),
			kan: new Station([167, 108, {map:'阿凯鲁法村'}]) // [167,10]传送坎那贝拉
		}, lumi: {
			sell: new Station([11, 12, {map:'杂货店'}]),
			hospital: new Station([4, 14, {map:'医院'}]),
			nurse: new Station([17, 16, {map:'医院'}]),
			hnurse: new Station([17, 5, {map:'医院'}]),
			wout: new Station([321, 883, {map:'鲁米那斯'}])
		}, camp: {
			x: new Station([90, 86, {map:'圣骑士营地'}]),
			sell: new Station([20, 23, {map:'工房'}]),
			hnurse: new Station([10, 12, {map:'医院'}]),
			nurse: new Station([18, 15, {map:'医院'}]),
			out: new Station([550, 332, {map:'医院'}])
		}, jenova: {
			eout: new Station([265,434,{map:'莎莲娜'}]),
			wout: new Station([216,456,{map:'莎莲娜'}]),
			nout: new Station([225,442,{map:'莎莲娜'}])
		}, dwarf: {
			x: new Station([110,191,{map:'矮人城镇'}]),
			nurse: new Station([163, 94, {map:'矮人城镇'}]),
			hnurse: new Station([163, 95, {map:'矮人城镇'}]),
			doctor: new Station([163, 91, {map:'矮人城镇'}]),
			bank: new Station([163, 104, {map:'矮人城镇'}]),
			sell: new Station([121, 110, {map:'矮人城镇'}]),
			elom: new Station([97, 124, {map:'矮人城镇'}]),
			out: new Station([231, 434, {map:'肯吉罗岛'}])
		}, train: {
			chicken: new Station([39,184,{map:'布拉基姆高地'}]),
			goldDragon: new Station([130,190,{map:'布拉基姆高地'}]),
			silverLion: new Station([147,116,{map:'布拉基姆高地'}])
		}, tower: {
			tower1: new Station([34,99,{map:'雪拉威森塔１层'}]),
			tower9: new Station([104,82,{map:'雪拉威森塔９层'}]),
			tower10: new Station([54,39,{map:'雪拉威森塔１０层'}]),
			tower11: new Station([140,114,{map:'雪拉威森塔１１层'}]),
			tower15: new Station([136,69,{map:'雪拉威森塔１５层'}]),
			tower20: new Station([87,146,{map:'雪拉威森塔２０层'}])
		}
	};
	Network.elsa.x.links = [
		new Link(Network.elsa.a), new Link(Network.elsa.b),
		new Link(Network.elsa.wout, () => cga.emogua.autoWalk([112,102,{map:'温迪尔平原'}])),
		new Link(Network.elsa.nout, () => cga.emogua.autoWalk([130,50,{map:'盖雷布伦森林'}])),
		new Link(Network.castle.x, () => cga.emogua.talkNpc([141,104,{map:'里谢里雅堡'}])(s => s.elsaToCastle))
	];
	Network.elsa.a.links = [
		new Link(Network.asha.w, () => cga.emogua.turnOrientation(0, Network.asha.w.id[2]))
	];
	Network.elsa.b.links = [
		new Link(Network.lisa.n, () => cga.emogua.talkNpc([165,154,{map:'利夏岛'}])(s => s.yesGenerator(2))),
		new Link(Network.elsa.sout, () => cga.emogua.talkNpc([165,154,{map:'梅布尔隘地'}])(s => s.noGenerator(2)))
	];
	Network.asha.w.links = [
		new Link(Network.asha.s, () => cga.emogua.turnOrientation(4, Network.asha.s.id[2])),
		new Link(Network.asha.bank, () => cga.emogua.autoWalkList([[114,104,{map:'银行'}], Network.asha.bank.id]))
	];
	Network.asha.s.links = [
		new Link(Network.asha.n, () => cga.emogua.turnOrientation(5, Network.asha.n.id[2]))
	];
	Network.asha.n.links = [
		new Link(Network.elsa.a, () => cga.emogua.turnOrientation(4, Network.elsa.a.id[2])),
		new Link(Network.train.chicken, () => cga.emogua.autoWalkList([
			[190,115,{map:'盖雷布伦森林'}],[231,222,{map:'布拉基姆高地'}],[39,184]
		])),
		new Link(Network.train.goldDragon, () => cga.emogua.autoWalkList([
			[190,115,{map:'盖雷布伦森林'}],[231,222,{map:'布拉基姆高地'}],[130,190]
		])),
		new Link(Network.train.silverLion, () => cga.emogua.autoWalkList([
			[190,115,{map:'盖雷布伦森林'}],[231,222,{map:'布拉基姆高地'}],[147,116]
		]))
	];
	Network.lisa.n.links = [
		new Link(Network.tower.tower1, () => cga.emogua.autoWalkList([
			[90,99,{map:'国民会馆'}],[108,39,{map:'雪拉威森塔１层'}]
		]))
	];
	const castleF1Link = new Link(Network.castle.f1, () => cga.emogua.autoWalk([41, 50, {map:'里谢里雅堡 1楼'}]));
	Network.castle.x.links = [
		new Link(Network.castle.nurse), new Link(Network.castle.clock), new Link(Network.castle.s), castleF1Link,
		new Link(Network.castle.wout, () => cga.emogua.autoWalk([17, 53, {map:'法兰城'}]))
	];
	Network.castle.wout.links = [
		new Link(Network.falan.work, () => cga.emogua.autoWalk([106, 61, {map:'米克尔工房'}]))
	];
	Network.castle.s.links = [
		new Link(Network.castle.nurse), new Link(Network.castle.clock), new Link(Network.castle.x), castleF1Link,
		new Link(Network.falan.sell, () => cga.emogua.autoWalkList([
			[40,98,{map:'法兰城'}], Network.falan.sell.id
		])),
		new Link(Network.falan.s1, () => cga.emogua.autoWalkList([
			[40,98,{map:'法兰城'}], Network.falan.s1.id
		])),
		new Link(Network.falan.s2, () => cga.emogua.autoWalkList([
			[40,98,{map:'法兰城'}], Network.falan.s2.id
		])),
	];
	Network.castle.f1.links = [
		new Link(Network.castle.teleport, () => cga.emogua.autoWalk([45, 20, {map:'启程之间'}]))
	];
	Network.castle.nurse.links = [
		new Link(Network.castle.x), new Link(Network.castle.s), new Link(Network.castle.clock)
	];
	Network.castle.clock.links = [
		new Link(Network.castle.s), castleF1Link
	];
	Network.castle.teleport.links = [
		new Link(Network.teleport.yer, () => cga.emogua.autoWalk([43,32]).then(
			() => cga.emogua.talkNpc([44,32,{map:'伊尔村的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[12,17,{map:'村长的家'}],[6,13,{map:'伊尔村'}]
			])
		)),
		new Link(Network.teleport.laruka, () => cga.emogua.autoWalk([43, 43]).then(
			() => cga.emogua.talkNpc([44,43,{map:'圣拉鲁卡村的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[7,3,{map:'村长的家'}],[2,9,{map:'圣拉鲁卡村'}]
			])
		)),
		new Link(Network.teleport.aleut, () => cga.emogua.autoWalk([43, 22]).then(
			() => cga.emogua.talkNpc([44,22,{map:'亚留特村的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[8,3,{map:'村长的家'}],[6,13,{map:'亚留特村'}]
			])
		)),
		new Link(Network.teleport.kili, () => cga.emogua.autoWalk([8, 33]).then(
			() => cga.emogua.talkNpc([8,32,{map:'奇利村的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[7, 6, {map:3214}],[7, 1, {map:3212}],[1, 8, {map:'奇利村'}]
			])
		)),
		new Link(Network.teleport.jenova, () => cga.emogua.autoWalk([15, 4]).then(
			() => cga.emogua.talkNpc([16,4,{map:'杰诺瓦镇的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[14,6,{map:'村长的家'}],[1,9,{map:'杰诺瓦镇'}]
			])
		)),
		new Link(Network.teleport.vinoy, () => cga.emogua.autoWalk([9, 22]).then(
			() => cga.emogua.talkNpc([8,22,{map:'维诺亚村的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[5,1,{map:'村长家的小房间'}],[0,5,{map:'村长的家'}],[10,16,{map:'维诺亚村'}]
			])
		)),
		new Link(Network.teleport.ghana, () => cga.emogua.autoWalk([9, 43]).then(
			() => cga.emogua.talkNpc([8,43,{map:'加纳村的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[5,12,{map:'村长的家'}],[1,9,{map:'加纳村'}]
			])
		)),
		new Link(Network.teleport.albanese, () => cga.emogua.autoWalk([37, 4]).then(
			() => cga.emogua.talkNpc([38,4,{map:'阿巴尼斯村的传送点'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[5,4,{map:4313}],
				[6,13,{map:4312}],
				[6,13,{map:'阿巴尼斯村'}]
			])
		))
	];
	Network.teleport.aleut.links = [
		new Link(Network.aleut.eout, () => cga.emogua.autoWalkList([
			[67,64,{map:'芙蕾雅'}]
		])),
		new Link(Network.aleut.nout, () => cga.emogua.autoWalkList([
			[58,31,{map:'芙蕾雅'}]
		]))
	];
	Network.teleport.kili.links = [
		new Link(Network.kili.eout, () => cga.emogua.autoWalkList([
			[79,76,{map:'索奇亚'}]
		])),
		new Link(Network.kili.nout, () => cga.emogua.autoWalkList([
			[59,45,{map:'索奇亚'}]
		]))
	];
	Network.teleport.yer.links = [
		new Link(Network.grahl.s, () => cga.emogua.autoWalk([58,71]).then(
			() => cga.emogua.talkNpc([59,71,{map:'伊尔'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[30,21,{map:'港湾管理处'}], [25,25]
			])
		).then(
			() => cga.emogua.talkNpc([25,23,{map:'往哥拉尔栈桥'}])(s => s.yes)
		).then(
			() => cga.emogua.autoWalk([51,50])
		).then(async () => {
			while (cga.GetMapName() != '铁达尼号') {
				await cga.emogua.talkNpc([52,50])(s => s.yes);
				await cga.emogua.delay(10000);
			}
		}).then(
			() => cga.emogua.delay(300000)
		).then(async () => {
			while (cga.GetMapName() != '往伊尔栈桥') {
				await cga.emogua.talkNpc([71,26])(s => s.yes);
				await cga.emogua.delay(10000);
			}
		}).then(
			() => cga.emogua.autoWalk([84,55])
		).then(
			() => cga.emogua.talkNpc([84,54,{map:'哥拉尔镇 港湾管理处'}])(s => s.yes)
		).then(
			() => cga.emogua.autoWalkList([
				[14,15,{map:'哥拉尔镇'}], [118,214]
			])
		)),
		new Link(Network.akalufa.c, () => cga.emogua.autoWalk([58,71]).then(
			() => cga.emogua.talkNpc([59,71,{map:'伊尔'}])(s => s.yesGenerator(1))
		).then(
			() => cga.emogua.autoWalkList([
				[30,21,{map:'港湾管理处'}], [23,25]
			])
		).then(
			() => cga.emogua.talkNpc([23,23,{map:'往阿凯鲁法栈桥'}])(s => s.yes)
		).then(
			() => cga.emogua.autoWalk([51,50])
		).then(async () => {
			while (cga.GetMapName() != '艾欧奇亚号') {
				await cga.emogua.talkNpc([52,50])(s => s.yes);
				await cga.emogua.delay(10000);
			}
		}).then(
			() => cga.emogua.delay(300000)
		).then(async () => {
			while (cga.GetMapName() != '往伊尔栈桥') {
				await cga.emogua.talkNpc([71,26])(s => s.yes);
				await cga.emogua.delay(10000);
			}
		}).then(
			() => cga.emogua.autoWalk([20,53])
		).then(
			() => cga.emogua.talkNpc([19,53,{map:'港湾管理处'}])(s => s.yes)
		).then(
			() => cga.emogua.autoWalkList([
				[22,31,{map:'阿凯鲁法'}], [28,30]
			])
		).then(
			() => cga.emogua.talkNpc([29,30,{map:'阿凯鲁法村'}])(s => s.yes)
		).then(
			() => cga.emogua.autoWalk(Network.akalufa.c.id)
		))
	];
	Network.falan.s1.links = [
		new Link(Network.falan.s2), new Link(Network.falan.sell), new Link(Network.falan.sout,() => cga.emogua.autoWalk([153,241,{map:'芙蕾雅'}])),
		new Link(Network.falan.w1, () => cga.emogua.turnOrientation(6, Network.falan.w1.id[2])),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,{map:'流行商店'}],Network.falan.fabric.id]))
	];
	Network.falan.s2.links = [
		new Link(Network.falan.s1), new Link(Network.falan.sell), new Link(Network.falan.sout,() => cga.emogua.autoWalk([153,241,{map:'芙蕾雅'}])),
		new Link(Network.falan.w2, () => cga.emogua.turnOrientation(0, Network.falan.w2.id[2])),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,{map:'流行商店'}],Network.falan.fabric.id]))
	];
	Network.falan.sell.links = [
		new Link(Network.falan.s2), new Link(Network.falan.s1),
		new Link(Network.falan.fabric, () => cga.emogua.autoWalkList([[117,112,{map:'流行商店'}],Network.falan.fabric.id])),
		new Link(Network.castle.s, () => cga.emogua.autoWalkList([[153,100,{map:'里谢里雅堡'}]]))
	];
	Network.falan.w1.links = [
		new Link(Network.falan.w2), new Link(Network.falan.wout,() => cga.emogua.autoWalk([22,88,{map:'芙蕾雅'}])),
		new Link(Network.falan.e1, () => cga.emogua.turnOrientation(6, Network.falan.e1.id[2])),
		new Link(Network.falan.whospital, () => cga.emogua.autoWalk([82,83,{map:'医院'}]))
	];
	Network.falan.w2.links = [
		new Link(Network.falan.w1), new Link(Network.falan.wout,() => cga.emogua.autoWalk([22,88,{map:'芙蕾雅'}])),
		new Link(Network.falan.e2, () => cga.emogua.turnOrientation(0, Network.falan.e2.id[2]))
	];
	Network.falan.e1.links = [
		new Link(Network.falan.e2), new Link(Network.falan.eout,() => cga.emogua.autoWalk([281,88,{map:'芙蕾雅'}])),
		new Link(Network.falan.m1, () => cga.emogua.turnOrientation(0, Network.falan.m1.id[2])),
		new Link(Network.falan.bank, () => cga.emogua.autoWalkList([
			[238,111,{map:'银行'}], Network.falan.bank.id
		]))
	];
	Network.falan.e2.links = [
		new Link(Network.falan.e1), new Link(Network.falan.eout,() => cga.emogua.autoWalk([281,88,{map:'芙蕾雅'}])),
		new Link(Network.falan.m2, () => cga.emogua.turnOrientation(6, Network.falan.m2.id[2])),
		new Link(Network.falan.ehospital, () => cga.emogua.autoWalk([221,83,{map:'医院'}]))
	];
	Network.falan.sout.links = [
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[513,282,{map:'曙光骑士团营地'}],[55,47,{map:'辛希亚探索指挥部'}],[7,4,{map:'*',x:91,y:6}],[95,9,{map:27101}],[8,21]
		]).then(() => cga.emogua.turnTo([7,21,{map:'圣骑士营地'}])).then(
			() => cga.emogua.autoWalk(Network.camp.x.id)
		))
	];
	Network.falan.wout.links = [
		new Link(Network.falan.isle, () => cga.emogua.autoWalk([397,168]).then(
			() => cga.GetMapUnits().find(u => u.model_id > 0 && u.unit_name == '阿鲁卡')
		).then(
			() => cga.emogua.talkNpc([398,168,{map:'小岛'}])(s => s.yesGenerator(1))
		))
	];
	Network.falan.m1.links = [
		new Link(Network.falan.mbank), new Link(Network.falan.mtrade),
		new Link(Network.falan.s1, () => cga.emogua.turnOrientation(6, Network.falan.s1.id[2]))
	];
	Network.falan.mbank.links = [
		new Link(Network.falan.m1), new Link(Network.falan.mtrade)
	];
	Network.falan.mtrade.links = [
		new Link(Network.falan.m1), new Link(Network.falan.mbank), new Link(Network.falan.mnurse)
	];
	Network.falan.mnurse.links = [
		new Link(Network.falan.mtrade)
	];
	Network.falan.m2.links = [
		new Link(Network.falan.s2, () => cga.emogua.turnOrientation(6, Network.falan.s2.id[2]))
	];
	Network.grahl.s.links = [
		new Link(Network.grahl.c, () => cga.emogua.turnOrientation(0, Network.grahl.c.id[2]))
	];
	Network.grahl.c.links = [
		new Link(Network.grahl.s, () => cga.emogua.turnOrientation(6, Network.grahl.s.id[2])),
		new Link(Network.grahl.eout, () => cga.emogua.autoWalkList([
			[176,105,{map:'库鲁克斯岛'}]
		])),
		new Link(Network.grahl.wout, () => cga.emogua.autoWalkList([
			[62,104,{map:'库鲁克斯岛'}]
		])),
		new Link(Network.grahl.nout, () => cga.emogua.autoWalkList([
			[119,38,{map:'库鲁克斯岛'}]
		]))
	];
	Network.grahl.eout.links = [
		new Link(Network.grahl.lumi, () => cga.emogua.autoWalkList([
			[477,525]
		]).then(
			() => cga.emogua.talkNpc([477,526,{x:476,y:528}])(s => s.yes)
		).then(
			() => cga.emogua.autoWalk([322,883,{map:'鲁米那斯'}])
		))
	];
	Network.grahl.lumi.links = [
		new Link(Network.lumi.hospital, () => cga.emogua.autoWalk([87,35,{map:'医院'}])),
		new Link(Network.lumi.sell, () => cga.emogua.autoWalkList([
			[88,51,{map:'杂货店'}],Network.lumi.sell.id
		]))
	];
	Network.akalufa.c.links = [
		new Link(Network.akalufa.kan),
		new Link(Network.akalufa.eout, () => cga.emogua.autoWalk([233,171,{map:'米内葛尔岛'}])),
		new Link(Network.akalufa.sout, () => cga.emogua.autoWalk([178,227,{map:'米内葛尔岛'}]))
	];
	Network.lumi.hospital.links = [
		new Link(Network.lumi.nurse), new Link(Network.lumi.hnurse)
	];
	Network.lumi.nurse.links = [
		new Link(Network.lumi.sell, () => cga.emogua.autoWalkList([
			[4,14,{map:'鲁米那斯'}],[88,51,{map:'杂货店'}],Network.lumi.sell.id
		])),
		new Link(Network.lumi.wout, () => cga.emogua.autoWalkList([
			[4,14,{map:'鲁米那斯'}],[60,29,{map:'库鲁克斯岛'}]
		]))
	];
	Network.lumi.hnurse.links = Network.lumi.nurse.links;
	Network.lumi.sell.links = [
		new Link(Network.lumi.wout, () => cga.emogua.autoWalkList([
			[4,14,{map:'鲁米那斯'}],[60,29,{map:'库鲁克斯岛'}]
		])),
		new Link(Network.lumi.hospital, () => cga.emogua.autoWalkList([
			[4,14,{map:'鲁米那斯'}],[87,35,{map:'医院'}]
		]))
	];
	Network.lumi.wout.links = [
		new Link(Network.grahl.lumi, () => cga.emogua.autoWalk([322,883,{map:'鲁米那斯'}]))
	];
	Network.camp.x.links = [
		new Link(Network.camp.sell, () => cga.emogua.autoWalkList([
			[87,72,{map:'工房'}],[20,23]
		])),
		new Link(Network.camp.nurse, () => cga.emogua.autoWalkList([
			[95,72,{map:'医院'}],Network.camp.nurse.id
		])),
		new Link(Network.camp.hnurse, () => cga.emogua.autoWalkList([
			[95,72,{map:'医院'}],Network.camp.hnurse.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[36,87,{map:'肯吉罗岛'}]
		])),
		new Link(Network.dwarf.x, () => cga.emogua.autoWalkList([
			[36,87,{map:'肯吉罗岛'}],[384,245,{map:'蜥蜴洞穴'}],[12,2,{map:'肯吉罗岛'}],[231,434,{map:'矮人城镇'}]
		]))
	];
	Network.camp.sell.links = [
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[30,37,{map:'圣骑士营地'}],Network.camp.x.id
		])),
		new Link(Network.camp.nurse, () => cga.emogua.autoWalkList([
			[30,37,{map:'圣骑士营地'}],[95,72,{map:'医院'}],Network.camp.nurse.id
		])),
		new Link(Network.camp.hnurse, () => cga.emogua.autoWalkList([
			[30,37,{map:'圣骑士营地'}],[95,72,{map:'医院'}],Network.camp.hnurse.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[30,37,{map:'圣骑士营地'}],[36,87,{map:'肯吉罗岛'}]
		]))
	];
	Network.camp.nurse.links = [
		new Link(Network.camp.hnurse),
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[0,20,{map:'圣骑士营地'}],Network.camp.x.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[0,20,{map:'圣骑士营地'}],[36,87,{map:'肯吉罗岛'}]
		]))
	];
	Network.camp.hnurse.links = [
		new Link(Network.camp.nurse),
		new Link(Network.camp.x, () => cga.emogua.autoWalkList([
			[0,20,{map:'圣骑士营地'}],Network.camp.x.id
		])),
		new Link(Network.camp.out, () => cga.emogua.autoWalkList([
			[0,20,{map:'圣骑士营地'}],[36,87,{map:'肯吉罗岛'}]
		]))
	];
	Network.dwarf.x.links = [
		new Link(Network.dwarf.sell),new Link(Network.dwarf.elom)
	];
	Network.dwarf.sell.links = [
		new Link(Network.dwarf.nurse),new Link(Network.dwarf.hnurse),new Link(Network.dwarf.bank),new Link(Network.dwarf.doctor),new Link(Network.dwarf.elom),
		new Link(Network.dwarf.out, () => cga.emogua.autoWalkList([
			[110,191,{map:'肯吉罗岛'}]
		]))
	];
	Network.dwarf.hnurse.links = [
		new Link(Network.dwarf.nurse),new Link(Network.dwarf.sell),new Link(Network.dwarf.bank),new Link(Network.dwarf.doctor),new Link(Network.dwarf.elom)
	];
	Network.dwarf.nurse.links = Network.dwarf.bank.links = Network.dwarf.doctor.links = [new Link(Network.dwarf.hnurse)];
	Network.dwarf.elom.links = [new Link(Network.dwarf.sell)];
	Network.teleport.jenova.links = [
		new Link(Network.jenova.eout, () => cga.emogua.autoWalk([71,18,{map:'莎莲娜'}])),
		new Link(Network.jenova.wout, () => cga.emogua.autoWalk([24,40,{map:'莎莲娜'}])),
		new Link(Network.jenova.nout, () => cga.emogua.autoWalk([32,27,{map:'莎莲娜'}]))
	];
	Network.tower.tower1.links = [
		new Link(Network.tower.tower10, () => cga.emogua.autoWalk([76,58,{map:'雪拉威森塔１０层'}])),
		new Link(Network.tower.tower15, () => cga.emogua.autoWalk([76,56,{map:'雪拉威森塔１５层'}])),
		new Link(Network.tower.tower20, () => cga.emogua.autoWalk([76,54,{map:'雪拉威森塔２０层'}])),
	];
	Network.tower.tower10.links = [
		new Link(Network.tower.tower9, () => cga.emogua.autoWalk([56,25,{map:'雪拉威森塔９层'}])),
		new Link(Network.tower.tower11, () => cga.emogua.autoWalk([66,45,{map:'雪拉威森塔１１层'}])),
	];
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
		const info = cga.getMapInfo();
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
	const getStationOrLogback = async () => {
		for (let i = 0; i < 3; i++) {
			const current = getCurrentStation();
			if (current) return current;
			cga.LogBack();
			await cga.emogua.delay(2000);
		}
		throw 'goto can not get station';
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
	const go = async (targetFunction) => {
		const target = targetFunction(Network);
		let times = 2;
		await cga.emogua.waitForNormal();
		if (cga.GetMapName() == '艾尔莎岛') {
			await cga.emogua.autoWalk(Network.elsa.x.id);
		}
		while (target && times > 0) {
			const current = await getStationOrLogback();
			if (current.idString != target.idString) {
				const paths = getLinkPaths(current.links, target);
				if ((!paths || paths.length == 0)) {
					cga.LogBack();
					await cga.emogua.delay(2000);
					times--;
				} else {
					let short;
					for (let p of paths) {
						if (!short) {
							short = p;
						} else if (short.length > p.length) {
							short = p;
						}
					}
					try {
						for (const p of short) {
							await p.arrive();
						}
						return;
					} catch (e) {
						console.log('goto fail to arrive', e, current);
						times--;
					}
				}
			} else return;
		}
		throw 'goto fail to ' + target;
	};
	return go;
})();
