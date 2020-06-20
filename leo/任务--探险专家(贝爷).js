require('./common').then(cga => {
    leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线

    var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var teammates = [];

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
        weaponName = '';
    }

    leo.log('红叶の探险专家(贝爷)任务脚本，启动~');

    var count = 0;
    var task = async () => {
        await leo.waitAfterBattle()
        if(cga.getItemCount('贝尔的军刀')==0){
            await leo.logBack()
            await leo.checkHealth(prepareOptions.doctorName)
            await leo.checkCrystal(prepareOptions.crystalName)
            await leo.goto(n=>n.castle.x)
            await leo.autoWalk([52,22])
            await leo.talkNpc(53, 22, leo.talkNpcSelectorYes)
            await leo.goto(n=>n.castle.teleport)
            await leo.autoWalk([37,4])
            await leo.talkNpc(0,leo.talkNpcSelectorYes)
            await leo.autoWalkList([
                [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                [38, 71,'莎莲娜'],[258, 180, '莎莲娜西方洞窟'],[30, 44, 14001],
                [14, 68, 14000],[13, 11]
            ])
            await leo.talkNpc(13, 9, leo.talkNpcSelectorYes, '隐秘山道上层')
            await leo.autoWalk([17,9,'隐秘山道上层B1'])
            try{
                await leo.walkRandomMazeUntil(() => {
                        const mn = cga.GetMapName();
                        if (mn == '山道尽头') {
                            return true;
                        }
                        return false;
                },false)
            }catch(e){
                await leo.log('迷宫刷新');
                await leo.waitUntil(()=>{
                    var mapInfo = cga.getMapInfo();
                    if (mapInfo.name.indexOf('B1')!=-1) {
                        return true;
                    }
                    await leo.autoWalk([mapInfo.x,mapInfo.y,'*']);
                    await leo.delay(2000)
                    return false;
                })
                await leo.walkRandomMazeUntil(() => {
                        const mn = cga.GetMapName();
                        if (mn == '山道尽头') {
                            return true;
                        }
                        return false;
                },false)
            }
            await leo.autoWalk([13,6])
            await leo.talkNpc(13,5,leo.talkNpcSelectorYes)
        }
        await leo.logBack()
        await leo.supplyCastle()
        await leo.goto(n=>n.castle.x)
        await leo.autoWalk([52,22])
        await leo.talkNpc(53, 22, leo.talkNpcSelectorYes)
        await leo.autoWalk([23,19])
        if(isTeamLeader){
            await leo.autoWalk([23,18])
            await leo.buildTeamBlock(teamPlayerCount)
            await leo.autoWalk([20,18])
            await leo.talkNpc(6,leo.talkNpcSelectorYes)
            await leo.delay(2000)
            await leo.waitAfterBattle()
            var mapInfo = cga.getMapInfo();
            if (mapInfo.name == '贝尔的隐居地' && mapInfo.indexes.index3 == 57199) {
                console.log(leo.logTime()+'翻车，没有打过贝爷！');
            }
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.waitUntil(()=>{
                var mapInfo = cga.getMapInfo();
                if (mapInfo.name == '贝尔的隐居地' && mapInfo.indexes.index3 == 57200) {
                    return true;
                }
                return false;
            })
        }
        await leo.talkNpc(20,16,leo.talkNpcSelectorYes)
        //await leo.log('探险专家(贝爷)，任务完成')
        await leo.log('探险专家(贝爷)，完成第' + count + '次')
    }

    while(true){
        try{
            task();
        }catch(e){
            console.log(leo.logTime()+'任务出错:'+e);
            console.log(leo.logTime()+'重新开始');
        }
    }
    
});