require('../wrapper').then(cga => {
	console.log('生产二转,需要卡好交易再运行', new Date().toLocaleString());
	cga.emogua.autoBattle(cga.emogua.AutoBattlePreset.getEscapeSets());

	cga.emogua.keepAlive();
	cga.getInventoryItems().forEach(i => {
		if (['好像很好喝的酒', '好像很好吃的起司'].indexOf(i.name) >= 0) {
			cga.emogua.dropItems([i.pos]);
		}
	});
	let timer;
	cga.emogua.logBack().then(
		() => cga.emogua.prepare({repairFlag: 0})
	).then(
		() => cga.emogua.goto(n => n.teleport.ghana)
	).then(
		() => cga.emogua.autoWalkList([
			[51,34,'酒吧'],[12,4]
		])
	).then(
		() => cga.emogua.talkNpc(1, cga.emogua.talkNpcSelectorYes)
	).then(
		() => timer = Date.now()
	).then(() => cga.emogua.logBack()).then(
		() => cga.emogua.goto(n => n.falan.eout)
	).then(
		() => cga.emogua.autoWalkList([
			[672,223,'哈巴鲁东边洞穴 地下1楼'],[41,8,'哈巴鲁东边洞穴 地下2楼'],[17,18]
		])
	).then(
		() => cga.emogua.forceMoveTo([17,16])
	).then(
		() => cga.emogua.autoWalkList([
			[16,11,'哈巴鲁东边洞穴 地下1楼'],
			[30,4,'芙蕾雅'],
			[596,84,'亚留特村'],
			[52,63,'医院'],
			[10,5]
		])
	).then(
		() => cga.emogua.recharge(0)
	).then(
		() => cga.emogua.autoWalkList([
			[2,9,'亚留特村'],
			[56,48,'村长的家'],
			[17,12]
		])
	).then(
		() => cga.emogua.waitUntil(() => {
			return (Date.now() - timer) >= 3603000;
		}, 3000)
	).then(
		() => cga.emogua.talkNpc(6, cga.emogua.talkNpcSelectorYes)
	).then(
		() => timer = Date.now()
	).then(() => {
		// Promise.resolve().then(
		// 	() => cga.emogua.autoWalkList([
		// 		[6,13,'亚留特村'],
		// 		[51,65],
		// 		[67,64,'芙蕾雅'],
		// 		[691,188,'哈巴鲁东边洞穴 地下1楼'],
		// 		[21,39,'哈巴鲁东边洞穴 地下2楼'],
		// 		[17,16]
		// 	])
		// ).then(
		// 	() => cga.emogua.forceMoveTo([17,18])
		// ).then(
		// 	() => cga.emogua.autoWalkList([
		// 		[62,65,'哈巴鲁东边洞穴 地下1楼'],
		// 		[9,37,'芙蕾雅'],
		// 		[470,196,'法兰城'],
		// 		[221,83,'医院'],
		// 		[8,31]
		// 	])
		// ).then(
		// 	() => cga.emogua.recharge(6)
		// ).then(
		// 	() => cga.emogua.autoWalkList([
		// 		[12,42,'法兰城'],
		// 		[233,78]
		// 	])
		// );
		return cga.emogua.logBack().then(
			() => cga.emogua.prepare({repairFlag: 0})
		);
	}).then(
		() => cga.emogua.goto(n => n.falan.wout)
	).then(
		() => cga.emogua.autoWalk([200,165])
	).then(
		() => cga.emogua.talkNpc(0, cga.emogua.talkNpcSelectorYes)
	).then(
		() => cga.emogua.autoWalkList([
			[20,8,'莎莲娜海底洞窟 地下2楼'],
			[11,9,'莎莲娜海底洞窟 地下1楼'],
			[24,11,'莎莲娜'],
			[217,455,'杰诺瓦镇'],
			[38,59,'民家'],
			[9,4]
		])
	).then(
		() => cga.emogua.waitUntil(() => {
			return (Date.now() - timer) >= 3603000;
		}, 3000)
	).then(
		() => cga.emogua.talkNpc(6, cga.emogua.talkNpcSelectorYes)
	).then(
		() => console.log('任务完成')
	);
});
