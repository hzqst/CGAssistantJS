require('../wrapper').then(cga => {
	console.log('治疗摆摊');
	cga.emogua.recursion(() => {
		if (cga.GetMapName() != '里谢里雅堡') {
			return cga.emogua.logBack().then(
				() => cga.emogua.falan.toStone('C')
			);
		}
		if (cga.GetPlayerInfo().mp <= 100) {
			return cga.emogua.autoWalk([34,88]).then(
				() => cga.emogua.recharge(0)
			);
		}
		if (cga.GetMapXY().x != 27 || cga.GetMapXY().y != 83) {
			return cga.emogua.autoWalk([27,83]);
		}
		return cga.emogua.healTeammate().then(
			() => cga.emogua.delay(2000)
		);
	});
	// setInterval(() => {
	// 	cga.emogua.sayWords('自动免费治疗，道具github开源免费挂，目前测试尾声，功能已经基本齐备，作者纯因兴趣所作，QQ群300303705，欢迎胆肥伙伴加群交流~~~~',0,5,1);
	// }, 15000);
});
