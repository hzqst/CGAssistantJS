require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;   //关闭战斗状态提示
    leo.moveTimeout = 20;                   //遇敌速度
    //自动跟随队长换线，设置为true时，需要先提前与队长交换名片
    leo.monitor.config.autoChangeLineForLeader = false;
    leo.monitor.config.equipsProtect = false;   //关闭装备低耐久保护
    const battleStatus = false;   //队长打印战斗明细
    const doctorName = '医道之殇';
    const crystalName = '水火的水晶（5：5）';
    const teams = [//自行修改角色名称，可以再加更多的队伍
        ['队长01','小号01','小号02','小号03','小号04'],
        ['队长02','小号05','小号06','小号07','小号08'],
        ['队长03','小号09','小号10','小号11','小号12'],
        ['队长04','小号13','小号14','小号15','小号16'],
        ['队长05','小号17','小号18','小号19','小号20'],
    ];
    
    leo.baseInfoPrint(); //显示基础信息
    let teammates = leo.findMyTeam(teams);
    if(teammates == null){
        await leo.log('红叶の高地银狮脚本，未找到队伍，请确认配置是否正确')
        return leo.exit(1000*60*60*2);
    }else{
        await leo.log('红叶の高地银狮脚本，推荐40~50级使用，启动~');
        await leo.log('我的队伍是：['+teammates.join(',')+']')
    }
    let teamLeader = teammates[0];
    let teamPlayerCount = teammates.length;
    let isTeamLeader = false;
    if (cga.GetPlayerInfo().name == teamLeader) {
        isTeamLeader = true;
        await leo.log('我是队长，预设队伍人数【'+teamPlayerCount+'】');
        if(battleStatus){
            leo.battleMonitor.start(cga);
        }
    }else{
        await leo.log('我是队员，队长是【'+teamLeader+'】');
    }
    
    const protect = {
        //contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false,
        minHp: 150,
        minMp: 100,
        minPetHp: 100,
        minPetMp: 200,
        minTeamNumber: teamPlayerCount
    };
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易

    try{
        await leo.loop(async ()=>{
            await leo.waitAfterBattle()
            await leo.checkHealth(doctorName)
            // await leo.checkCrystal(crystalName)

            let needTeam = false;
            const teamPlayers = leo.getTeamPlayerAll();
            if(isTeamLeader && teamPlayers.length < protect.minTeamNumber){
                needTeam = true;
            }
            if(!isTeamLeader && teamPlayers.length == 1) {
                needTeam = true;
            }
            if(needTeam) {
                console.log(leo.logTime() + '寻找队伍');
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='艾尔莎岛') {
                        return leo.reject();
                    }
                    await leo.logBack()
                    await leo.delay(3000)
                })
                if (isTeamLeader) {
                    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                    await leo.autoWalk([155,100])
                    await leo.buildTeamBlock(teamPlayerCount,teammates)
                } else {
                    await leo.autoWalk([154,100])
                    await leo.enterTeamBlock(teamLeader)
                }
            }

            if(isTeamLeader) {
                if(cga.GetMapName()=='艾尔莎岛') {
                    await leo.autoWalk([157, 93])
                    await leo.loop(async ()=>{
                        if(cga.GetMapName()=='艾夏岛') {
                            return leo.reject();
                        }
                        await leo.turnDir(0)
                        await leo.delay(1000)
                    })
                }
                if(cga.GetMapName()=='艾夏岛') {
                    await leo.autoWalk([102,115,'冒险者旅馆'])
                    await leo.autoWalk([37,30])
                    await leo.walkList([
                        [38,30],[37,30],[38,30],[37,30]
                    ])
                    await leo.sell(37, 29)
                    await leo.delay(3000)
                    await leo.autoWalkList([
                        [38,48,'艾夏岛'],[112,81,'医院'],[35,46]
                    ])
                    await leo.walkList([
                        [35,45],[35,46],[35,45],[35,46]
                    ])
                    await leo.supply(36,46)
                    await leo.statistics(leo.beginTime, leo.oldXp) //打印统计信息
                    await leo.autoWalkList([
                        [28,52,'艾夏岛'],[190,116,'盖雷布伦森林']
                    ])
                }
                if (cga.GetMapName()=='盖雷布伦森林') {
                    await leo.autoWalkList([
                        [231, 222, '布拉基姆高地']
                    ])
                }
                if (cga.GetMapName()=='布拉基姆高地') {
                    await leo.autoWalkList([
                        [148, 116],[147,117]
                    ])
                    console.log(leo.logTime() + '开始战斗');
                    await leo.encounterTeamLeader(protect) //队长遇敌
                    console.log(leo.logTime() + "触发回补");
                    await leo.logBack()
                }
                if (!['艾尔莎岛','艾夏岛','盖雷布伦森林','布拉基姆高地'].includes(cga.GetMapName())) {
                    await leo.logBack()
                }
            }else {
                await leo.loop(async ()=>{
                    await leo.waitAfterBattle()
                    await leo.checkHealth(doctorName)
                    // await leo.checkCrystal(crystalName)
                    if(cga.isInNormalState() && !leo.isInTeam()){
                        return leo.reject();
                    }
                    const mapInfo = leo.getMapInfo();
                    if (mapInfo.name == '冒险者旅馆' && mapInfo.y == 30 && (mapInfo.x == 37 || mapInfo.x == 38)) {
                        await leo.sell(37, 29)
                        await leo.delay(2000)
                    }
                    if (mapInfo.name == '医院' && mapInfo.x == 35 && (mapInfo.y == 45 || mapInfo.y == 46)) {
                        await leo.supply(36,46)
                        await leo.statistics(leo.beginTime, leo.oldXp) //打印统计信息
                    }
                    if (mapInfo.name == '布拉基姆高地'){
                        await leo.encounterTeammate(protect, '布拉基姆高地') //队员遇敌
                    }
                    await leo.delay(3000)
                })
            }
            await leo.delay(1000)
        })
    }catch(e){
        console.log(leo.logTime()+'脚本出错:'+e);
        console.log(leo.logTime()+'重新开始');
    }
    return leo.exit();
});