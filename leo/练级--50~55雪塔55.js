require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;   //关闭战斗状态提示
    leo.moveTimeout = 20;                   //遇敌速度
    //自动跟随队长换线，设置为true时，需要先提前与队长交换名片
    leo.monitor.config.autoChangeLineForLeader = false;
    leo.monitor.config.equipsProtect = false;   //关闭装备低耐久保护
    const battleStatus = false;   //队长打印战斗明细
    const doctorName = '医道之殇';
    const crystalName = '地水的水晶（5：5）';
    const teams = [//自行修改角色名称，可以再加更多的队伍
        ['队长01','小号01','小号02','小号03','小号04'],
        ['队长02','小号05','小号06','小号07','小号08'],
        ['队长03','小号09','小号10','小号11','小号12'],
        ['队长04','小号13','小号14','小号15','小号16'],
        ['队长05','小号17','小号18','小号19','小号20'],
    ];
    const sellStone = true; //卖魔石
    const meetingPoint = 2; //集合点1~3
    
    leo.baseInfoPrint(); //显示基础信息
    let teammates = leo.findMyTeam(teams);
    if(teammates == null){
        await leo.log('红叶の雪塔55脚本，未找到队伍，请确认配置是否正确')
        return leo.exit(1000*60*60*2);
    }else{
        await leo.log('红叶の雪塔55脚本，推荐50~55级使用，启动~');
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
        minPetMp: 100,
        minTeamNumber: teamPlayerCount,
        petIndex: 0,
    };
    if (isTeamLeader) {
        protect.minMp = 350; //队长是传教，回城魔值至少要大于等于一次祈祷的魔
    }
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易

    const meetingPointTeamLeader = [
        [113, 48],
        [113, 51],
        [113, 54]
    ];
    const meetingPointTeammate = [
        [112, 48],
        [112, 51],
        [112, 54]
    ];

    try{
        await leo.loop(async ()=>{
            await leo.waitAfterBattle()
            if(!isTeamLeader){
                await leo.setPetBattle(protect.petIndex)
            }
            await leo.checkHealth(doctorName)
            await leo.checkCrystal(crystalName)

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
                await leo.autoWalk([165,153])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='利夏岛') {
                        return leo.reject();
                    }
                    await leo.talkNpc(2,leo.talkYes)
                    await leo.delay(2000)
                })
                await leo.autoWalk([90,99,'国民会馆'])
                if(sellStone) {
                    await leo.autoWalk([110, 43])
                    await leo.sell(110, 42)
                }
                if (isTeamLeader) {
                    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                    await leo.autoWalk(meetingPointTeamLeader[meetingPoint - 1])
                    await leo.buildTeamBlock(teamPlayerCount,teammates)
                } else {
                    await leo.autoWalk(meetingPointTeammate[meetingPoint - 1])
                    await leo.enterTeamBlock(teamLeader)
                }
            }

            if(isTeamLeader) {
                if(cga.GetMapName()=='艾尔莎岛') {
                    await leo.autoWalk([165,153])
                    await leo.loop(async ()=>{
                        if(cga.GetMapName()=='利夏岛') {
                            return leo.reject();
                        }
                        await leo.talkNpc(2,leo.talkYes)
                        await leo.delay(2000)
                    })
                }
                if(cga.GetMapName()=='利夏岛') {
                    await leo.autoWalk([90,99,'国民会馆'])
                }
                if (cga.GetMapName()=='国民会馆') {
                    await leo.autoWalk([107,52])
                    await leo.walkList([
                        [107, 51],[107, 52],[107, 51],[107, 52]
                    ])
                    await leo.supply(108, 52)
                    await leo.statistics(leo.beginTime, leo.oldXp) //打印统计信息
                    await leo.autoWalk([108,39,'雪拉威森塔１层'])
                }
                if(cga.GetMapName()=='雪拉威森塔１层') {
                    await leo.autoWalkList([
                        [75, 50, '雪拉威森塔５０层'],
                        [27, 55, '雪拉威森塔５５层']
                    ]);
                }
                if (cga.GetMapName()=='雪拉威森塔５５层') {
                    //await leo.moveAround()
                    console.log(leo.logTime() + '开始战斗');
                    await leo.encounterTeamLeader(protect) //队长遇敌
                    console.log(leo.logTime() + "触发回补");
                    await leo.logBack()
                }
                if (!['艾尔莎岛','国民会馆','雪拉威森塔５５层'].includes(cga.GetMapName())) {
                    await leo.logBack()
                }
            }else {
                await leo.loop(async ()=>{
                    await leo.waitAfterBattle()
                    await leo.setPetBattle(protect.petIndex)
                    await leo.checkHealth(doctorName)
                    // await leo.checkCrystal(crystalName)
                    if(cga.isInNormalState() && !leo.isInTeam()){
                        await leo.logBack()
                        return leo.reject();
                    }
                    const mapInfo = leo.getMapInfo();
                    if (mapInfo.name == '国民会馆' && mapInfo.x == 107 && (mapInfo.y == 51 || mapInfo.y == 52)) {
                        await leo.supply(108, 52)
                        await leo.statistics(leo.beginTime, leo.oldXp) //打印统计信息
                    }
                    if (mapInfo.name == '雪拉威森塔５５层'){
                        await leo.encounterTeammate(protect, '雪拉威森塔５５层') //队员遇敌
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