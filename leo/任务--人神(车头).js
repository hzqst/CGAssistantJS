require('./common').then(async (cga) => {
	var teamPlayerCount = 5;
	var task = async () => {
        var mapInfo = cga.getMapInfo();
        if(mapInfo.name == '里谢里雅堡' || mapInfo.name == '法兰城' || mapInfo.name == '艾尔莎岛'){
            await leo.goto(n=>n.grahl.c)
        }
        if(cga.getMapInfo().name == '哥拉尔镇'){
        	await leo.buildTeamBlock(teamPlayerCount)
        	await leo.autoWalk([176,105,'库鲁克斯岛'])
        }
        if(cga.getMapInfo().name == '库鲁克斯岛'){
            await leo.autoWalk([476,526])
            await leo.walkList([[476,525],[476,526],[476,525],[476,526]])
            await leo.talkNpc(477,526,leo.talkYes);
            await leo.buildTeamBlock(teamPlayerCount)
            await leo.autoWalk([322,883,'鲁米那斯'])
        }
        if(cga.getMapInfo().name == '鲁米那斯'){
        	await leo.autoWalk([87, 35, '医院'])
            await leo.autoWalk([17, 16])
            await leo.supplyDir(0)
            await leo.autoWalk([4, 14, '鲁米那斯'])
            await leo.autoWalk([71, 48, '酒场'])
            await leo.autoWalk([13, 13])
            await leo.talkNpc(14,13, (dialog) => {
            	//现在交给我吧，下一步
	            //有两个奖励，下一步
	            //要爱心礼物么，否
	            //看下我的新研究成功，是
	            //好好享受下吧，确定
                if(dialog && dialog.message && dialog.message.indexOf('现在交给我吧') >= 0){
                    cga.ClickNPCDialog(32, -1);
                    return true;
                }else if(dialog && dialog.message && dialog.message.indexOf('有两个奖励') >= 0){
                    cga.ClickNPCDialog(32, -1);
                    return true;
                }else if(dialog && dialog.message && dialog.message.indexOf('要爱心礼物么') >= 0){
                    cga.ClickNPCDialog(8, -1);
                    return true;
                }else if(dialog && dialog.message && dialog.message.indexOf('看下我的新研究成功') >= 0){
                    cga.ClickNPCDialog(4, -1);
                    return true;
                }else if(dialog && dialog.message && dialog.message.indexOf('好好享受下吧') >= 0){
                    cga.ClickNPCDialog(1, -1);
                    return false;
                }
                return false;
            });
        }
        if(cga.getMapInfo().name == '迷宫入口'){
            await leo.autoWalk([10, 4, '迷宫1层'])
            await leo.walkRandomMazeUntil(() => {
                    const name = cga.GetMapName();
                    if (name == '迷宫50层') {
                        return true;
                    }
                    return false;
            },false)
        }
        if(cga.getMapInfo().name == '迷宫50层'){
        	await leo.log('到达阿鲁巴斯前，准备开始第一战，本次战斗为两连战')
            await leo.log('输入3个go，将开始战斗')
            await leo.waitMessageUntil((chat) => {
                if (chat.msg && chat.msg.indexOf('gogogo') >= 0) {
                    return true;
                }
            })
            await leo.talkNpcAt(9,8,leo.talkNo)
            await leo.waitAfterBattle()
            await leo.talkNpcAt(9,8)
            await leo.log('后续的传送石需要手动寻找，第一次提示扳手选否，第二次提示选是')
        }
        console.log('脚本结束')
    }

    task();
});