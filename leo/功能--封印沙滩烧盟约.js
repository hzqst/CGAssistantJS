require('./common').then(cga => {
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线的话改false

    var teamLeader = '队长名字'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var teammates = [];

    var petOptions = {
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        petChecker: () => {
            //判断是否要购买封印卡
            var sealCardCount = cga.getItemCount(petOptions.sealCardName);
            if (sealCardCount < 1) {
                return true;
            }
        }
    };

    var protect = {
        minHp: 500,
        minMp: 50,
        minPetHp: 200,
        minPetMp: 50,
        maxItemNumber: 19,
        minTeamNumber: 0,
        normalNurse: false
    };

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易

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
    }

    leo.log('高仿红叶の沙滩登出回补脚本，推荐80~100级使用，启动~');

    var task = async () => {
        await leo.waitAfterBattle()
        if(cga.GetPlayerInfo().gold < 5000){
            await leo.goto(n=>n.falan.bank)
            await leo.turnDir(0)
            await leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK)
            if(cga.GetPlayerInfo().gold < 5000){
                await leo.log('任务开始先奶一口！请补充足够银子后重新执行脚本！')
                await leo.delay(10000000);
                return;
            }
        }

    var sealCardCount = cga.getItemCount(petOptions.sealCardName);
        if (sealCardCount < 1) {
            return leo.buySealCard(petOptions.sealCardName, 200, petOptions.sealCardLevel);
        }

// 登出补血卖石，检查水晶
        await leo.logBack()
        await leo.checkHealth(prepareOptions.doctorName)
        await leo.checkCrystal(prepareOptions.crystalName)
        await leo.goto(n=>n.castle.x)
        await leo.autoWalk([31,77])
        await leo.sell(30,77)
//        await leo.autoWalk([34,88])
//        await leo.supplyDir(0)

        // 去营地
        await leo.delay(500)
        await leo.goto(n => n.camp.x)

       // 完成组队
        await leo.autoWalk([92,86])
        if(isTeamLeader){
           await leo.buildTeamBlock(teamPlayerCount)
        }else{
              await leo.autoWalk([93,86])
              await leo.enterTeamBlock(teamLeader)
             }

        if(isTeamLeader){
            await leo.autoWalkList([
			[36, 87, '肯吉罗岛'],
            [479, 207]
			])
            console.log(leo.logTime() + '开始战斗');
            await leo.encounterTeamLeader(protect) //队长遇敌
            console.log(leo.logTime() + "登出回补");
        }else {
            await leo.loop(async ()=>{
                await leo.waitAfterBattle()
                if(cga.isInNormalState() && !leo.isInTeam()){
                    return leo.reject();
                }
                await leo.encounterTeammate(protect, '肯吉罗岛')
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