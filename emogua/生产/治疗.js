let point = [27,83];  // 可自定义飞碟站的坐标
require('../wrapper').then(cga => {
	console.log('治疗摆摊');
	cga.emogua.keepAlive();
	const player = cga.GetPlayerInfo();
	if (player.name == 'xxx1') {
		point = [27,83];
	} else if (player.name == 'xxx2') {
		point = [27,83];
	}
	cga.emogua.recursion(
		() => Promise.resolve().then(() => {
			if (cga.GetMapName() != '里谢里雅堡') {
				return cga.emogua.goto(n => n.castle.x);
			}
			if (cga.GetPlayerInfo().mp <= 100) {
				return cga.emogua.autoWalk([34,88]).then(
					() => cga.emogua.recharge(0)
				);
			}
			const xy = cga.GetMapXY();
			if (xy.x != point[0] || xy.y != point[1]) {
				return cga.emogua.autoWalk(point);
			}
			return cga.emogua.healTeammate().then(
				() => cga.emogua.delay(2000)
			);
		}).catch(r => {
			console.log(r);
			return cga.emogua.delay(3000);
		})
	);
	// setInterval(() => {
	// 	cga.emogua.sayWords('自动免费治疗，道具github开源免费挂，目前测试尾声，功能已经基本齐备，作者纯因兴趣所作，QQ群300303705，欢迎胆肥伙伴加群交流~~~~',0,5,1);
	// }, 15000);
});
