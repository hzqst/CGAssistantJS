require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の半山5脚本，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队

	leo.logBack()
	.then(() => leo.checkHealth(prepareOptions.doctorName))
	.then(()=>leo.prepare(prepareOptions))
	.then(()=>leo.logBack())
	.then(()=>{
		return leo.goto(n => n.castle.x)
		.then(()=>leo.autoWalk([41, 50,'里谢里雅堡 1楼']))
		.then(()=>leo.autoWalk([74, 19,'里谢里雅堡 2楼']))
		.then(()=>leo.autoWalk([0, 74,'图书室']))
		.then(()=>leo.autoWalk([27, 16]))
		.then(()=>leo.talkNpc(27, 15, leo.talkNpcSelectorYes));
	})
	.then(()=>{
		return leo.useItems('阿斯提亚锥形水晶')
		.then(()=>leo.waitUntil(()=>{
			var mapInfo = cga.getMapInfo();
            if (mapInfo.name == '小岛') {
                return leo.next();
            }
		}));
	})
	.then(()=>{
		return leo.autoWalk([64, 45, '通往山顶的路100M'])
		.then(()=>leo.walkRandomMazeUntil(() => {
				const mn = cga.GetMapName();
				if (mn == '半山腰') {
					return true;
				}
				return false;
		},false))
		.then(()=>leo.autoWalk([78, 52, '通往山顶的路1100M']))
		.then(()=>leo.walkRandomMazeUntil(() => {
				const mn = cga.GetMapName();
				if (mn == '圣鸟之巢') {
					return true;
				}
				return false;
		},false))
		.then(()=>leo.autoWalk([13, 11]))
		.then(()=>leo.talkNpc(14, 11, leo.talkNpcSelectorYes))
		.then(()=>leo.autoWalk([23, 23]))
		.then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes))
		.then(()=>leo.log('半山5任务已完成，恭喜，可以去半山练级了~'));
	});
});