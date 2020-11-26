require('./common').then(cga => {
    //leo.baseInfoPrint();
    //leo.monitor.config.keepAlive = false;   //关闭防掉线
    //输入‘0’从头（朵拉）开始任务，
    //输入‘1’从打长老证之前开始任务，
    //输入‘2’从荷普特开始任务，
    //输入‘3’从祭坛守卫开始任务，
    //输入‘4’从打完BOSS换保证书开始任务（必须有文言抄本）
    var taskIndex = 0;

    var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var teammates = [];

    var taskInfo = {
        0 : '0：(朵拉)消任务',
        1 : '1：打长老证*7',
        2 : '2：天黑对话(荷普特)',
        3 : '3：寻阻碍者，战BOSS',
        4 : '4：BOSS完毕换保证书(必须有觉醒的文言抄本)'
    }
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

    leo.log('红叶の卵4保证书脚本，任务起始进度【'+taskInfo[taskIndex]+'】，启动~');
    leo.log('队伍人数【'+teamPlayerCount+'】，队长是【'+teamLeader+'】'+(isTeamLeader?'，没错，就是我':''));
    leo.log('身上已有【保证书】数量为【'+cga.getItemCount('转职保证书')+'】');

    var zhanglaozheng = {
        flag : false,
        messageMonitor : ()=>{
            leo.waitMessageUntil((chat) => {
                if (chat.msg && chat.msg.indexOf('[GP]') >= 0 && chat.msg.indexOf('get:长老之证*7') >= 0) {
                    zhanglaozheng.flag = true;
                }
            });
        },
        targetFinder : (units) => {
            return units.find(u => u.unit_name == '守墓员' && u.type == 1 
                && (u.flags & leo.UnitFlags.NpcEntry) && u.model_id > 0);
        },
        todo :(target) => {
            zhanglaozheng.messageMonitor();//队长监听队友消息
            return leo.loop(async ()=>{
                await leo.talkNpc(target.xpos,target.ypos,leo.talkNpcSelectorYes)
                if(cga.isInBattle()){
                    await leo.waitUntil(()=>{
                        if(cga.getItemCount('长老之证')>=7 || zhanglaozheng.flag){
                            console.log(leo.logTime()+'已经集齐7颗长老证，可以召唤神龙了');
                            zhanglaozheng.flag = true;
                            return true;
                        }else{
                            if(!cga.isInBattle()){
                                console.log(leo.logTime()+'get:长老之证*'+cga.getItemCount('长老之证'));
                                cga.ClickNPCDialog(1, 1);
                            }
                            return false;
                        }
                    })
                }else{
                    console.log(leo.logTime()+'没能触发战斗');
                }
                if(zhanglaozheng.flag){
                    return leo.reject(); //退出循环
                }else{
                    return leo.delay(5000);
                }
            })
            .then(()=>leo.walkRandomMaze(true,true));
        }
    }

    var task0 = async () => {
        await leo.waitAfterBattle()
        await leo.log('红叶の卵4保证书脚本，当前任务进度【'+taskInfo[taskIndex]+'】');
        if(cga.getItemCount('琥珀之卵')==0){
            await leo.logBack()
            await leo.autoWalkList([
                [201,96,'神殿　伽蓝'],[95,80,'神殿　前廊'],[44,41,59531],
                [34,34,59535],[48,60,'约尔克神庙'],[39,22]
            ])
            await leo.loop(async ()=>{
                if(cga.getItemCount('琥珀之卵')>0){
                    return leo.reject();   //退出loop循环
                }else{
                    if(leo.getSysTimeEx() == '黄昏' || leo.getSysTimeEx() == '夜晚'){
                        await leo.talkNpc(6,leo.talkNpcSelectorYes)
                    }else{
                        await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【黄昏或夜晚】')
                    }
                }
                return await leo.delay(30000);
            })
        }
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.autoWalk([157,93])
        await leo.turnDir(0)
        await leo.delay(1000)
        await leo.autoWalkList([
            [102,115,'冒险者旅馆'],[30,21]
        ])
        await leo.turnDir(6)
        await leo.say('朵拉')
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(4, -1);
            return leo.delay(1000);
        })
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(1, -1);
            return leo.delay(1000);
        })
        await leo.say('朵拉')
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(4, -1);
            return leo.delay(1000);
        })
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(1, -1);
            return leo.delay(1000);
        })
        taskIndex++;
        await leo.logBack()
    }

    var task1 = async () => {
        await leo.waitAfterBattle()
        await leo.log('红叶の卵4保证书脚本，当前任务进度【'+taskInfo[taskIndex]+'】');
        await leo.checkHealth(prepareOptions.doctorName)
        await leo.supplyCastle()
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.autoWalkList([
            [130, 50, '盖雷布伦森林'],[246, 76, '路路耶博士的家'],[3,10,'？？？']
        ])
        if(isTeamLeader){
            await leo.autoWalk([132, 62])
            await leo.buildTeamBlock(teamPlayerCount)
            await leo.delay(1000)
            zhanglaozheng.flag = false;
            await leo.loop(async ()=>{
                try{
                    await leo.waitAfterBattle()
                    var mapInfo = cga.getMapInfo();
                    if(mapInfo.name == '？？？'){
                        await leo.autoWalk([122, 69,'海底墓场外苑第1地带'])
                        await leo.log('开始找守墓员');
                    }
                    await leo.findOne(zhanglaozheng.targetFinder, zhanglaozheng.todo, true);
                    if(zhanglaozheng.flag){
                        return leo.reject(); //退出循环
                    }
                }catch(e){
                    await leo.log('迷宫刷新');
                    await leo.delay(10000);
                }
            })
            if(cga.GetMapName()=='？？？' && zhanglaozheng.flag){
                await leo.autoWalk([131,61])
                await leo.walkList([
                    [132,61],[131,61],[132,61],[131,61]
                ])
                if(zhanglaozheng.flag){
                    console.log('我来对话NPC');
                    await leo.talkNpc(131, 60, leo.talkNpcSelectorYes);
                    await leo.delay(1000)
                    await leo.talkNpc(131, 60, leo.talkNpcSelectorYes);
                    await leo.delay(1000)
                    await leo.talkNpc(131, 60, leo.talkNpcSelectorYes);
                }
                await leo.waitUntil(()=>{
                    if (cga.GetMapName()=='盖雷布伦森林'){
                        return true;
                    }
                    return false;
                })
            }
        }else{
            await leo.enterTeamBlock(teamLeader)
            zhanglaozheng.flag = false;
            await leo.loop(async ()=>{
                //await leo.waitAfterBattle()
                console.log(leo.logTime()+'get:长老之证*'+cga.getItemCount('长老之证'));
                if(!zhanglaozheng.flag && cga.getItemCount('长老之证')>=7){
                    zhanglaozheng.flag = true;
                    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
                    await leo.say('get:长老之证*7')
                    await leo.delay(2000)
                    await leo.say('get:长老之证*7')
                }
                var mapInfo = cga.getMapInfo();
                if(zhanglaozheng.flag && mapInfo.name=='？？？' && mapInfo.y == 61){
                    console.log(leo.logTime()+'我来对话NPC');
                    await leo.talkNpc(131, 60, leo.talkNpcSelectorYes);
                    await leo.delay(1000)
                    await leo.talkNpc(131, 60, leo.talkNpcSelectorYes);
                    await leo.delay(1000)
                    await leo.talkNpc(131, 60, leo.talkNpcSelectorYes);
                }
                if(cga.GetMapName()=='盖雷布伦森林'){
                    return leo.reject();
                }
                await leo.delay(5000);
            })
        }
        taskIndex++;
    }

    var task2 = async ()=>{
        await leo.waitAfterBattle()
        await leo.log('红叶の卵4保证书脚本，当前任务进度【'+taskInfo[taskIndex]+'】');
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.autoWalkList([
            [201,96,'神殿　伽蓝'],[91,138]
        ])
        await leo.loop(async ()=>{
            if(cga.findNPC('荷特普')){
                await leo.talkNpc(92, 138,leo.talkNpcSelectorYes)
                return leo.reject();//退出循环
            }else{
                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待黄昏或夜晚【荷特普】出现');
                await leo.delay(30000);
            }
        })
        taskIndex++;
    }

    var task3 = async ()=>{
        await leo.waitAfterBattle()
        await leo.log('红叶の卵4保证书脚本，当前任务进度【'+taskInfo[taskIndex]+'】');
        if(cga.getItemCount('逆十字')==0){
            if(cga.GetMapName()!='艾尔莎岛'){
                await leo.logBack()
                await leo.delay(1000)
                if(cga.GetMapName()!='艾尔莎岛'){
                    return leo.log('必须先定居新城【艾尔莎岛】');
                }
            }
            await leo.autoWalk([157,93])
            await leo.turnDir(0)
            await leo.delay(1000)
            await leo.autoWalkList([
                [102,115,'冒险者旅馆'],[55,31]
            ])
            await leo.talkNpc(0,leo.talkNpcSelectorYes)
            if(cga.getItemCount('逆十字')==0){
                return leo.log('没有获得【逆十字】，请检查任务进度是否有误');
            }
        }
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.checkHealth(prepareOptions.doctorName)
        await leo.supplyCastle()
        await leo.autoWalk([165,153])
        await leo.talkNpc(2,leo.talkNpcSelectorNo,'梅布尔隘地')
        await leo.autoWalk([211, 117])
        await leo.talkNpc(212, 116,leo.talkNpcSelectorYes,'？？？')
        await leo.autoWalk([135, 197])
        await leo.forceMoveEx(0,7)
        await leo.autoWalk([156, 197, [213, 164]])
        if(isTeamLeader){
            await leo.autoWalk([213, 165])
            await leo.buildTeamBlock(teamPlayerCount)
            var zudangzheArr = [{
                standPos : [229, 177],
                npcPos : [230, 177]
            },{
                standPos : [234, 202],
                npcPos : [235, 202]
            },{
                standPos : [228, 206],
                npcPos : [228, 207]
            },{
                standPos : [213, 225],
                npcPos : [213, 226]
            },{
                standPos : [193, 184],
                npcPos : [192, 184]
            }]
            var index = 0;
            var len = zudangzheArr.length;
            await leo.loop(async ()=>{
                if(index==len) index = 0;
                await leo.autoWalk(zudangzheArr[index].standPos)
                if(cga.findNPCByPosition('障碍物', zudangzheArr[index].npcPos[0],zudangzheArr[index].npcPos[1])){
                    await leo.turnTo(zudangzheArr[index].npcPos[0], zudangzheArr[index].npcPos[1]);
                    await leo.waitAfterBattle()
                    await leo.delay(1000)
                    var pos = cga.GetMapXY();
                    if(pos.x == 163 && pos.y == 100){
                        return leo.reject();//退出循环
                    }
                }
                await leo.delay(1000)
                index++;
            })
            await leo.autoWalk([163, 107])
            await leo.forceMoveEx(2,4)
            await leo.autoWalkList([
                [242, 117, 59716],[221, 187]
            ])
            await leo.talkNpc(222, 188,leo.talkNpcSelectorNo)
            await leo.waitAfterBattle()
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.waitUntil(()=>{
                if(!leo.isInTeam()){
                    return true;
                }
                return false;
            })
        }
        await leo.logBack()
        taskIndex++;
    }

    var task4 = async ()=>{
        await leo.waitAfterBattle()
        await leo.log('红叶の卵4保证书脚本，当前任务进度【'+taskInfo[taskIndex]+'】');
        if(cga.getItemCount('觉醒的文言抄本')==0){
            return leo.log('身上没有【觉醒的文言抄本】，请先准备好道具再去换【保证书】');
        }
        if(cga.getItemCount('转职保证书')==1){
            return leo.log('身上已经有一本【保证书】，请先使用后再去换保证书');
        }
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.checkHealth(prepareOptions.doctorName)
        await leo.supplyCastle()
        await leo.autoWalkList([
            [130, 50, '盖雷布伦森林'],[244, 74]
        ])
        await leo.talkNpc(245, 73,leo.talkNpcSelectorYes)
        if(cga.getItemCount('转职保证书')==1){
            await leo.log('恭喜你！获得了【转职保证书】')
        }
        taskIndex++;
    }

    leo.loop(async ()=>{
        try{
            if(taskIndex == 0){
                await task0()
            }
            if(taskIndex == 1){
                await task1()
            }
            if(taskIndex == 2){
                await task2()
            }
            if(taskIndex == 3){
                await task3()
            }
            if(taskIndex == 4){
                await task4()
            }
            if(taskIndex >= 5){
                await leo.log('任务已完成')
            }
            return leo.reject();//退出循环
        }catch(e){
            console.log(leo.logTime()+'任务出错:'+e);
            await leo.delay(10000)
            console.log(leo.logTime()+'重新开始');
        }
    })
    .then(()=>leo.log('脚本结束'))
    
});