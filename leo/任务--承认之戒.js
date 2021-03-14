require('./common').then(async (cga)=> {
    var teamLeader = '此处填队长名称'; //队长名称
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
    }
    if (teamPlayerCount <= 1){//单人模式
        teamPlayerCount = 1;
        teamLeader = playerName;
        isTeamLeader = true;
    }
    var autoDrop = true;
    var autoBoss = true;

    leo.log('红叶の承认之戒脚本，启动~');
    leo.log('队伍人数【'+teamPlayerCount+'】，队长是【'+teamLeader+'】'+(isTeamLeader?'，没错，就是我':''));

    if(isTeamLeader && leo.has('承认之戒')){
        if(autoDrop){
            await leo.dropItemEx('承认之戒')
        }else{
            return leo.log('队长身上已经有【承认之戒】，请先手动丢弃，再重新启动脚本');
        }
    }

    var task = async () => {
        await leo.waitAfterBattle()
        await leo.checkHealth(prepareOptions.doctorName)
        if(isTeamLeader){//队长
            if(!leo.has('信笺') && !leo.has('团长的证明') 
                && !leo.has('怪物碎片') && !leo.has('信') && !leo.has('承认之戒')){
                await leo.goto(n=>n.castle.f1)
                await leo.autoWalkList([
                    [74,19,'里谢里雅堡 2楼'],[49,22,'谒见之间']
                ])
                await leo.talkNpcAt(5,3)
            }
            if(leo.has('信笺')){
                await leo.goto(n=>n.castle.x)
                await leo.autoWalk([41,84])
                await leo.buildTeamBlock(teamPlayerCount)
                await leo.autoWalkList([
                    [41,98,'法兰城'],[153,241,'芙蕾雅'],[513,282,'曙光骑士团营地'],
                    [52,68,'曙光营地指挥部'],[69,70,[85,3]]
                ])
                await leo.talkNpcAt(95,7)
            }
            if(leo.has('团长的证明')){
                if(cga.GetMapName()=='曙光营地指挥部'){
                    await leo.autoWalkList([
                        [85,3,[69,70]],[53,79,'曙光骑士团营地'],[55,47,'辛希亚探索指挥部'],
                        [7,4,[91,6]],[95,9,27101]
                    ])
                    await leo.talkNpcAt(40,22)
                    await leo.autoWalk([44,22,'废墟地下1层'])
                }
                if(cga.GetMapName().indexOf('废墟地下')!=-1){
                    try {
                        await leo.walkRandomMazeUntil(() => {
                            if (cga.GetMapName() == '遗迹') {
                                return true;
                            }
                        })
                    }catch(e){
                        await leo.log('迷宫刷新');
                        await leo.delay(10000);
                        await leo.autoWalk([44,22,'废墟地下1层'])
                        await leo.walkRandomMazeUntil(() => {
                            if (cga.GetMapName() == '遗迹') {
                                return true;
                            }
                        })
                    }
                }
                if(cga.GetMapName() == '遗迹'){//44707
                    await leo.autoWalk([15,14])
                    if(autoBoss){
                        await leo.talkNpc(4,leo.talkYes)
                    }else{
                        await leo.turnDir(2)
                        await leo.log('准备好后，输入3个1继续，进入战斗')
                        await leo.waitMessageUntil((chat) => {
                            if (chat.msg && chat.msg.indexOf('111') >= 0) {
                                return true;
                            }
                        })
                        await leo.talkNpc(4,leo.talkYes)
                    }
                    await leo.waitAfterBattle()
                }
                if(cga.GetMapName() == '研究室'){//44708
                    await leo.leaveTeam()
                    await leo.talkNpcAt(14,14)
                }
            }
            if(leo.has('怪物碎片')){
                await leo.logBack()
                await leo.supplyCastle()
                await leo.goto(n=>n.castle.x)
                await leo.autoWalkList([
                    [41,98,'法兰城'],[153,241,'芙蕾雅'],[513,282,'曙光骑士团营地'],
                    [52,68,'曙光营地指挥部'],[69,70,[85,3]]
                ])
                await leo.talkNpcAt(95,7)
            }
            if(leo.has('信')){
                await leo.goto(n=>n.castle.f1)
                await leo.autoWalkList([
                    [74,19,'里谢里雅堡 2楼'],[49,22,'谒见之间']
                ])
                await leo.talkNpcAt(5,3)
                await leo.log('任务已完成')
            }
        }else{//队员
            await leo.loop(async ()=>{
                if(!leo.isInTeam()){
                    if(cga.GetMapName() == '研究室'){//44708
                        await leo.talkNpcAt(14,14)
                    }
                    if(!leo.has('怪物碎片') && !leo.has('信')){
                        await leo.goto(n=>n.castle.x)
                        await leo.autoWalk([41,83])
                        await leo.enterTeamBlock(teamLeader)
                    }
                    if(leo.has('怪物碎片')){
                        await leo.logBack()
                        await leo.supplyCastle()
                        await leo.goto(n=>n.castle.x)
                        await leo.autoWalkList([
                            [41,98,'法兰城'],[153,241,'芙蕾雅'],[513,282,'曙光骑士团营地'],
                            [52,68,'曙光营地指挥部'],[69,70,[85,3]]
                        ])
                        await leo.talkNpcAt(95,7) 
                    }
                    if(leo.has('信')){
                        await leo.goto(n=>n.castle.f1)
                        await leo.autoWalkList([
                            [74,19,'里谢里雅堡 2楼'],[49,22,'谒见之间']
                        ])
                        await leo.talkNpcAt(5,3)
                        await leo.log('任务已完成')
                        return leo.reject();
                    }
                }
                return leo.delay(3000);
            })
        }
    }

    await task()
    await leo.log('脚本结束')
});