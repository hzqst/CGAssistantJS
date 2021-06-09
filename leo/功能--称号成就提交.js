require('./common').then(async (cga) => {
	await leo.log('红叶の称号成就提交脚本，启动~');

	var pos = [31, 72];
	var target = '空山映雨落花红℡';

	const enterTeam = (teamLeader) => {
        return leo.todo()
        .then(() => cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM))
        .then(() => leo.waitNPCDialog(dialog => {
            if (dialog.type === 2) {
                cga.ClickNPCDialog(-1, dialog.message.split('\n').findIndex(e => e === teamLeader) - 2);
                return leo.delay(1000);
            }
        }))
    }

	try{
		let playerInfo = cga.GetPlayerInfo();
		let titles = playerInfo.titles;
		if(titles && titles.length>0){
			for (var i = 0; i < titles.length; i++) {
				let title = titles[i];
				if(title != ''){
					if(cga.GetMapName() != '里谢里雅堡') {
						await leo.goto(n => n.castle.x)
					}
					await leo.autoWalk(pos)
					if(cga.ChangeTitleName(i)){
						console.log(leo.logTime()+'设置称号【'+title + '】成功')
						await enterTeam(target)
					}else{
						console.log(leo.logTime()+'称号设置失败：' + title)
					}
					await leo.waitUntil(()=>!leo.isInTeam())
					await leo.delay(500)
				}
			}
		}
		await leo.log('完成')
	}catch(e){
		console.log(leo.logTime() + e);
	}
});