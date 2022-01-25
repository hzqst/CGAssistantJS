require('./common').then(async (cga) => {
    const isLogBackFirst = false; //启动登出
    const autoBoss = true;

    var teams = [//自行修改角色名称，可以再加更多的队伍
        ['奇迹之殇','琉璃之殇'],
        ['繁花红雨落城中℡','半夏琉璃叶撕阳°'],
    ];
    const crystalName = '水火的水晶（5：5）';
    const doctorName = '医道之殇';
    const jsonFile = '';
    
    await leo.log('红叶の时空之门2(风鸣之塔)脚本，启动~')
    const teammates = leo.findMyTeam(teams);
    if(teammates == null){
        await leo.log('红叶の时空之门2(风鸣之塔)脚本，未找到队伍，请确认配置是否正确')
        return leo.exit(1000*60*60*2);
    }else{
        await leo.log('我的队伍是：['+teammates.join(',')+']')
    }
    let teamLeader = teammates[0];
    let teamPlayerCount = teammates.length;
    let isTeamLeader = false;
    if (cga.GetPlayerInfo().name == teamLeader) {
        isTeamLeader = true;
        await leo.log('我是队长，预设队伍人数【'+teamPlayerCount+'】')
    }else{
        await leo.log('我是队员，队长是【'+teamLeader+'】')
    }

    //登出
    if (isLogBackFirst) {
        await leo.logBack()
    }
    if(jsonFile != ''){
        await leo.panel.load(jsonFile)
    }

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易

    if(['艾尔莎岛','里谢里雅堡','法兰城','银行'].includes(cga.GetMapName())){
        await leo.logBack()
        await leo.sellCastle()
        await leo.checkHealth(doctorName)
        await leo.checkCrystal(crystalName)
        await leo.goto(n => n.teleport.jenova)
    }
    if(cga.GetMapName()=='杰诺瓦镇') {
        console.log(leo.logTime()+'到达【杰诺瓦镇】')
        if(isTeamLeader) {
            await leo.autoWalk([58,44])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalk([32,27,'莎莲娜'])
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='莎莲娜') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='莎莲娜') {
        console.log(leo.logTime()+'到达【莎莲娜】')
        if(isTeamLeader) {
            await leo.autoWalkList([
                [259,360],[259, 359],[259,360],[259, 359]
            ])
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='参道') {
                    return leo.reject();
                }
                await leo.talkNpc(260,359,leo.talkYes)
                await leo.delay(1000)
            })
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().x==259) {
                    await leo.talkNpc(260,359,leo.talkYes)
                }
                if(cga.GetMapName()=='参道') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='参道') {
        console.log(leo.logTime()+'到达【参道】')
        if(isTeamLeader) {
            await leo.autoWalk([8,34])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalkList([
                [27,11,14011],[34,12,14012],[16,9,14013],[34,9,14014],
                [24,8,14015],[18,28,14016],[22,10,'阿斯提亚镇']
            ])
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='阿斯提亚镇') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='阿斯提亚镇') {
        console.log(leo.logTime()+'到达【阿斯提亚镇】')
        if(isTeamLeader) {
            await leo.autoWalk([101,72,'神殿'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='神殿'){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='神殿' && cga.getMapInfo().indexes.index3==4130) {
        console.log(leo.logTime()+'到达【神殿】')
        if(isTeamLeader) {
            await leo.autoWalk([20,22,'大厅'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='大厅'){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='大厅') {
        console.log(leo.logTime()+'到达【大厅】')
        if(isTeamLeader) {
            await leo.autoWalk([20,0,'神殿'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='神殿'){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='神殿' && cga.getMapInfo().indexes.index3==4143) {
        console.log(leo.logTime()+'到达【神殿】')
        if(isTeamLeader) {
            await leo.autoWalk([12,4,4145])
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3==4145){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='神殿' && cga.getMapInfo().indexes.index3==4145) {
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        await leo.autoWalk([8,10])
        await leo.loop(async ()=>{
            if(cga.getMapInfo().indexes.index3==4146){
                return leo.reject();
            }
            await leo.talkNpc(0,leo.talkYes)
            await leo.delay(2000)
        })
    }
    if(cga.GetMapName()=='神殿' && cga.getMapInfo().indexes.index3==4146) {
        await leo.autoWalk([11,5])
        await leo.talkNpc(0,leo.talkYes)
        await leo.talkNpc(0,leo.talkYes)
        await leo.talkNpc(0,leo.talkYes)
        await leo.autoWalk([11,10])
        await leo.loop(async ()=>{
            if(cga.GetMapName()=='没落的村庄'){
                return leo.reject();
            }
            await leo.talkNpc(0,leo.talkYes)
            await leo.delay(2000)
        })
    }
    if(cga.GetMapName()=='没落的村庄') {
        console.log(leo.logTime()+'到达【没落的村庄】')
        await leo.autoWalk([50,26])
        await leo.loop(async ()=>{
            if(leo.has('风鸣之杖')){
                await leo.log('拿到了【风鸣之杖】')
                return leo.reject();
            }
            await leo.talkNpc(0,leo.talkYes)
            await leo.delay(2000)
        })
        await leo.autoWalk([54,66,'索奇亚'])
    }
    if(cga.GetMapName()=='索奇亚') {
        console.log(leo.logTime()+'到达【索奇亚】')
        if(isTeamLeader) {
            await leo.autoWalk([595,381])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalkList([
                [462, 404],[463, 404],[462, 404],[463, 404]
            ])
            await leo.leaveTeam()
            await leo.autoWalk([463, 404])
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='契约的海道') {
                    return leo.reject();
                }
                await leo.turnDir(4)
                await leo.say('以军神之名开启海路')
                await leo.talkNpc(-1,-1,leo.talkYes)
            })
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.loop(async ()=>{
                if(!leo.isInTeam()){
                    await leo.autoWalk([463, 404])
                    await leo.turnDir(4)
                    await leo.say('以军神之名开启海路')
                    await leo.talkNpc(-1,-1,leo.talkYes)
                }
                if(cga.GetMapName()=='契约的海道') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='契约的海道') {
        console.log(leo.logTime()+'到达【契约的海道】')
        if(isTeamLeader) {
            await leo.autoWalk([102, 24])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalk([17, 12, '阿卡斯'])
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='阿卡斯') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='阿卡斯') {
        console.log(leo.logTime()+'到达【阿卡斯】')
        if(isTeamLeader) {
            await leo.autoWalkList([
                [45, 69, '风鸣之塔 1楼']
            ])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='风鸣之塔 1楼') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='风鸣之塔 1楼') {
        console.log(leo.logTime()+'到达【风鸣之塔 1楼】')
        if(isTeamLeader) {
            await leo.autoWalkList([
                [50, 15, '风鸣之塔 2楼'],
                [50, 62, '风鸣之塔 3楼'],    
                [66, 81, '风鸣之塔 4楼'],
                [72, 81, '风鸣之塔 3楼'],
                [88, 29, '风鸣之塔 4楼'],
                [94, 74, '风鸣之塔 5楼'],
                [89, 30, '风鸣之塔 6楼'],
                [50, 90, '风鸣之塔 7楼'],
                [50, 85, '风鸣之塔 8楼'],
                [93, 65, '风鸣之塔 9楼'],
                [50, 28, '风鸣之塔 8楼'],
                [50, 47, '风鸣之塔 9楼'],
                [27, 53, '风鸣之塔 10楼'],
                [37, 20, '阿卡斯传送点']
            ])
        }else{
            let mapName = cga.GetMapName();
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='阿卡斯传送点') {
                    return leo.reject();
                }
                if(mapName != cga.GetMapName()) {
                    mapName = cga.GetMapName();
                    console.log(leo.logTime()+'到达【'+mapName+'】')
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='阿卡斯传送点' && cga.getMapInfo().indexes.index3==20002) {
        console.log(leo.logTime()+'到达【阿卡斯传送点】')
        if(isTeamLeader) {
            await leo.autoWalk([42,7])
            console.log(leo.logTime()+'到达【BOSS前】')
            if(autoBoss){
                await leo.loop(async ()=>{
                    if(cga.getMapInfo().indexes.index3==20003){
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkYes)
                    await leo.delay(2000)
                    await leo.waitAfterBattle()
                    await leo.delay(2000)
                })
            }else{
                console.log(leo.logTime() + '已到达BOSS前，请手动战斗，战斗结束后脚本将继续');
                await leo.waitAfterBattle()
                await leo.loop(async ()=>{
                    if(cga.getMapInfo().indexes.index3==20003){
                        return leo.reject();
                    }
                    await leo.delay(2000)
                })
            }
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3==20003){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='阿卡斯传送点' && cga.getMapInfo().indexes.index3==20003) {
        console.log(leo.logTime()+'打完BOSS，对话NPC，结束任务')
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        await leo.autoWalk([43,7])
        await leo.loop(async ()=>{
            if(cga.GetMapName()=='召唤之间'){
                return leo.reject();
            }
            await leo.talkNpc(7,leo.talkYes)
            await leo.delay(1000)
        })
    }
    if(cga.GetMapName()=='召唤之间') {
        await leo.log('红叶の时空之门2(风鸣之塔)脚本，任务已完成')
    }else{
        await leo.log('红叶の时空之门2(风鸣之塔)脚本，未预期的地图，请登出后重启脚本')
    }
});