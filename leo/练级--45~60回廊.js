require('./common').then(async (cga) => {
    leo.baseInfoPrint();                    //显示基础信息
    leo.moveTimeout = 220;                  //遇敌速度
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;   //关闭战斗状态提示
    //自动跟随队长换线，设置为true时，需要先提前与队长交换名片
    leo.monitor.config.autoChangeLineForLeader = false;
    var battleStatus = true;   //队长打印战斗明细
    leo.monitor.config.equipsProtect = false;   //关闭装备低耐久保护

    var teamLeader = '此处填队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var teammates = [];

    var protect = {
        //contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false, 
        minHp: 500,
        minMp: 30,
        minPetHp: 500,
        minPetMp: 0,
        maxItemNumber: 19,
        minTeamNumber: 2,
        normalNurse: false
    };

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    var prepareOptions = {
        rechargeFlag: -1,
        repairFlag: -1,
        crystalName: '火风的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
        leo.log('我是队长，预设队伍人数【'+teamPlayerCount+'】');
        if(battleStatus){
            leo.battleMonitor.start(cga);
        }
    }else{
        leo.log('我是队员，队长是【'+teamLeader+'】');
    }

    leo.log('红叶の回廊脚本，推荐45~60级使用，启动~');

    var task = async () => {
        await leo.waitAfterBattle()

        if(cga.getInventoryItems().length >= 20){
            await leo.goto(n=>n.falan.bank)
            await leo.turnDir(0)
            await leo.saveToBankAll('时间的结晶')
            if(cga.getItemCount('时间的结晶')>=50){
                await leo.log('银行的空间不足，请清理银行后重新执行脚本！')
                await leo.delay(10000000);
                return;
            }
        }

        // 登出补血，检查水晶
        await leo.logBack()
        await leo.checkHealth(prepareOptions.doctorName)
        await leo.checkCrystal(prepareOptions.crystalName)
        await leo.goto(n=>n.castle.x)
        await leo.autoWalk([31,77])
        await leo.sell(30,77)

        // 进入过去与现在的回廊
        await leo.delay(500)
        await leo.autoWalk([52,72])
        await leo.talkNpc(53, 72, leo.talkNpcSelectorYes,'过去与现在的回廊')
        await leo.delay(500)
        if(isTeamLeader){
            await leo.autoWalk([9,20])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
           }else{
            await leo.enterTeamBlock(teamLeader)
         }

        // 开始练级
        if (isTeamLeader) {
            await leo.autoWalk([9,25])
            console.log(leo.logTime() + '开始战斗');
            await leo.encounterTeamLeader(protect) //队长遇敌
            console.log(leo.logTime() + "登出回补");
        } else {
            await leo.loop(async ()=>{
                await leo.waitAfterBattle()
                if(cga.isInNormalState() && !leo.isInTeam()){
                    return leo.reject();
                }
                await leo.encounterTeammate(protect, '过去与现在的回廊')
                await leo.delay(3000)
            })
        }

  }
    leo.loop(async ()=>{
        try{
            await task();
        }catch(e){
            console.log(leo.logTime()+'脚本出错:'+e);
            console.log(leo.logTime()+'重新开始');
        }
    })
    
});