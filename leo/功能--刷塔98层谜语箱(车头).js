require('./common').then(cga => {
    //leo.baseInfoPrint();
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    var teamLeader = '香莲碧水动风凉°'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var fly = false; 
    var teammates = [];
    var boxs = ['谜语箱１','谜语箱２','谜语箱３','谜语箱４','谜语箱５','谜语箱６','谜语箱７','谜语箱８','谜语箱９','谜语箱１０'];
    var dropList = ['宠物水晶','奇美拉的羽毛','不可思议的鳞片','液体','精灵','妖草的血','火焰之魂','风龙蜥的甲壳','德特家的布'];
    var logFlag = true;
    // if(leo.has('塞特的护身符')){
    //     leo.dropItemEx('塞特的护身符')
    // }
    // if(leo.has('梅雅的护身符')){
    //     leo.dropItemEx('梅雅的护身符')
    // }

    var shuangye = cga.getItemCount('双叶妹妹');

    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var protect = {
        minHp: 500,
        minMp: 100,
        minPetHp: 150,
        minPetMp: 100,
        maxItemNumber: 19,
        minTeamNumber: 5,
        checker: ()=>{
            if(cga.isInNormalState()){
                var dropItem = cga.getInventoryItems().find(item => {
                    var idDrop = false;
                    for (var i = 0; i < dropList.length; i++) {
                        if(item.name.indexOf(dropList[i])>-1){
                            idDrop = true;
                        }
                    }
                    return idDrop;
                });
                if(dropItem){
                    leo.log('扔掉了【'+dropItem.name+'】')
                    leo.dropItemEx(dropItem.name);
                }

                var items = cga.getInventoryItems().filter(item => {
                    return boxs.indexOf(item.name)>-1;
                });
                if(items && items.length>0){
                    if(items.length == 1){
                        var box = items[0]
                        leo.log('获得了【'+box.name+'】')
                        leo.useItemEx(box.name)
                        leo.talkNpc(leo.talkYes)
                        var shuangye2 = cga.getItemCount('双叶妹妹');
                        if(shuangye2>shuangye){
                            leo.log('恭喜，获得了【双叶妹妹】');
                            shuangye = shuangye2;
                        }
                    }else{
                        if(logFlag){
                            logFlag = false;
                            leo.log('身上的【谜语箱】数量大于1，无法开启');
                        }
                    }
                }
            }
            if(cga.getMapInfo.name=='雪拉威森塔９５层'){
                return true;
            }
            if(cga.getMapInfo.name=='雪拉威森塔９６层'){
                return true;
            }
            if(cga.getMapInfo.name=='雪拉威森塔９７层'){
                return true;
            }
        }
    };
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }
    leo.log('红叶の刷塔98层谜语箱(车头)脚本，启动~');

    var color = 4;
    var countDown = 30;
    var builTeam = (teamPlayerCount,minTeamNumber,log = false)=>{
        leo.say('红叶の刷塔98层谜语箱班车[2线]，欢迎推子(封印)和碎子(圣骑)搭乘，手动群：936198987',color);
        cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
        if (teamPlayerCount <= 1) {
            return leo.next(); //单人队伍，直接下一步
        }
        return leo.todo()
        .then(() => {
            var teamplayers = cga.getTeamPlayers();
            if (teamplayers.length == teamPlayerCount) {
                if(log){
                    leo.say('红叶の刷塔98层谜语箱班车，已满员，出发~',color);
                }
                teammates = [];
                var teamplayers = cga.getTeamPlayers();
                for (var i in teamplayers) {
                    teammates[i] = teamplayers[i].name;
                }
                if(log){
                    leo.say('欢迎乘坐红叶の班车，本次旅途目的地是[塔98层]，队员[' + teammates.toString() + ']',color);
                }
                return leo.done(); //已组满人
            }else if(teamplayers.length >= minTeamNumber){
                if(countDown>0){
                    if(log){
                        leo.say('已满最小人数【'+minTeamNumber+'】，出发倒计时'+countDown+'秒',color);
                    }
                    countDown = countDown - 5;
                    return leo.delay(5000)
                    .then(()=>builTeam(teamPlayerCount, minTeamNumber));
                }else{
                    if(log){
                        leo.say('已满最小人数【'+minTeamNumber+'】，倒计时结束，出发',color);
                    }
                    teammates = [];
                    var teamplayers = cga.getTeamPlayers();
                    for (var i in teamplayers) {
                        teammates[i] = teamplayers[i].name;
                    }
                    if(log){
                        leo.say('欢迎乘坐红叶の班车，本次旅途目的地是[塔98层]，队员[' + teammates.toString() + ']',color);
                    }
                    countDown = 30;
                    return leo.done(); //等待时间满30秒
                }
            }else{
                countDown = 30;
                return leo.delay(10000)
                .then(()=>builTeam(teamPlayerCount, minTeamNumber));
            }
        });
    } 

    var task = async () => {
        await leo.checkHealth(prepareOptions.doctorName)
        await leo.checkCrystal(prepareOptions.crystalName)
        if(leo.has('提斯的护身符') && !leo.isInTeam() && fly){
            await leo.useItemEx('提斯的护身符')
            await leo.talkNpc(leo.talkYes)
            await leo.talkNpc(0, leo.talkYes)
            await leo.moveAround()
        }
        if(cga.getMapInfo().name == '艾尔莎岛'){
            await leo.autoWalk([138,108])
            await builTeam(teamPlayerCount,protect.minTeamNumber,true)
            await leo.autoWalk([165,153])
            await leo.walkList([[164,153],[165,153],[164,153],[165,153]])
            await leo.talkNpc(2,leo.talkYes,'利夏岛')
        }
        if(cga.getMapInfo().name == '利夏岛'){
            await leo.autoWalk([93,63])
            await builTeam(teamPlayerCount,protect.minTeamNumber)
            await leo.autoWalk([90,99,'国民会馆'])
        }
        if(cga.getMapInfo().name == '国民会馆'){
            await leo.autoWalk([107,51])
            await leo.autoWalk([109,51])
            await leo.autoWalk([107,51])
            await leo.supply(108, 52)
            await leo.autoWalk([108,39,'雪拉威森塔１层'])
        }
        if(cga.getMapInfo().name == '雪拉威森塔１层'){
            await leo.autoWalk([75,50,'雪拉威森塔５０层'])
        }
        if(cga.getMapInfo().name == '雪拉威森塔５０层'){
            await leo.autoWalk([16,44,'雪拉威森塔９５层'])
        }
        if(cga.getMapInfo().name == '雪拉威森塔９５层'){
            await leo.autoWalk([28, 105])
            await leo.autoWalkList([
                [27, 104],[28, 105],[27, 104],[28, 105]
            ])
            await leo.leaveTeam()
            await leo.talkNpc(28,104,leo.talkYes)
            await leo.moveAround()
        }
        if(cga.getMapInfo().name == '雪拉威森塔９６层'){
            await builTeam(teamPlayerCount,protect.minTeamNumber)
            await leo.autoWalk([87, 118])
            await leo.autoWalkList([
                [88, 119],[87, 118],[88, 119],[87, 118]
            ])
            await leo.leaveTeam()
            await leo.talkNpc(88,118,leo.talkYes)
            await leo.moveAround()
        }
        if(cga.getMapInfo().name == '雪拉威森塔９７层'){
            await builTeam(teamPlayerCount,protect.minTeamNumber)
            await leo.autoWalk([117, 126])
            await leo.autoWalkList([
                [116, 125],[117, 126],[116, 125],[117, 126]
            ])
            await leo.leaveTeam()
            await leo.talkNpc(117,125,leo.talkYes)
            await leo.moveAround()
        }
        if(cga.getMapInfo().name == '雪拉威森塔９８层'){
            await builTeam(teamPlayerCount,protect.minTeamNumber)
            await leo.autoWalk([117,90])
            console.log(leo.logTime() + '开始战斗');
            await leo.encounterTeamLeader(protect)
            await leo.log('触发回补，停止遇敌');
        }
    }

    leo.loop(async ()=>{
        try{
            await task();
        }catch(e){
            if(e){
                console.log(leo.logTime()+'任务出错:'+e);
                console.log(leo.logTime()+'重新开始');
            }else{
                console.log(leo.logTime()+'退出循环，重新开始');
            }
        }
    })
    
});