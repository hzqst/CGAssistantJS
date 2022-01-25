require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	leo.monitor.config.autoChangeLineForLeader = true;	//自动跟随队长换线
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 1; //队伍人数
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の开箱子(雪山)脚本，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }
    if (teamPlayerCount <= 1){
    	isTeamLeader = true;
    }
    var count = 0;//开箱子数

    var targetFinder = (units) => {
        return units.find(u => {
    		return (u.flags & leo.UnitFlags.Item) 
    		&& 
    		( (u.item_name == '宝箱' && cga.getItemCount('铜钥匙')>0)  
    		|| (u.item_name == '黑色宝箱' && cga.getItemCount('黑钥匙')>0 )
    		|| (u.item_name == '白色宝箱' && cga.getItemCount('白钥匙')>0 )
    		)
    	});
    }

    var todo = (target) => {
        return leo.todo()
        .then(() => leo.turnTo(target.xpos, target.ypos))
        .then(() =>{
        	if(target.item_name == '黑色宝箱' && cga.getItemCount('黑钥匙')>0){
        		return leo.useItemEx('黑钥匙');
        	}else if(target.item_name == '白色宝箱' && cga.getItemCount('白钥匙')>0){
        		return leo.useItemEx('白钥匙');
        	}else if(target.item_name == '宝箱' && cga.getItemCount('铜钥匙')>0){
        		return leo.useItemEx('铜钥匙');
        	}else{
        		return leo.log('没有钥匙');
        	}
        })
        .then(() => leo.waitAfterBattle())
        .then(() => {
	    	count++;
	    	return leo.log('已开箱子数：【'+count+'】');
	    });
    }

    if(isTeamLeader) {
    	var mapInfo = cga.getMapInfo();
	    if (mapInfo.name.indexOf('积雪的山路')!=-1) {
	        return leo.todo()
	        .then(()=>leo.loop(()=>{
				return leo.lookForNpc(targetFinder, todo);
			}));
	    }
    }

	leo.logBack()
	.then(()=>leo.checkHealth(prepareOptions.doctorName))
	.then(()=>{
		return leo.goto(n => n.castle.teleport)
		.then(() => leo.autoWalk([37,4]))
		.then(() => leo.talkNpc(0,leo.talkYes))
		.then(() => leo.autoWalkList([
            [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村']
        ]))
		.then(()=>{
			if(isTeamLeader){
				return leo.moveAround()
	            .then(() => leo.buildTeamBlock(teamPlayerCount,teammates));
			}else{
				return leo.enterTeamBlock(teamLeader);
			}
		})
		.then(()=>{
			if(isTeamLeader){
				return leo.autoWalkList([
					[38, 71,'莎莲娜'],
                    [84, 193,'积雪的山路海拔100M']
				])
				.then(()=>leo.loop(()=>{
					if(cga.GetMapName()=='雪山之顶'){
						leo.log(leo.logTime()+'已经走出迷宫')
						return leo.delay(1000*60*60*2);
					}
					return leo.lookForNpc(targetFinder, todo);
				}));
			}else{
				return leo.loop(async ()=>{
					await leo.waitAfterBattle()
					if(!leo.isInTeam()){
						return leo.exit();
					}
					return leo.delay(5000);
				})
			}
		});
	});

});