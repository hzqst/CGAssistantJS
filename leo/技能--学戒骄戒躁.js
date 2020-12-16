require('./common').then(cga => {
    //leo.baseInfoPrint();
    var teamLeader = '红花落雨映山空℡'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var flag = 1;//1-从刷梯子开始，2-有梯子了学技能
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
    leo.log('红叶の学戒骄戒躁技能脚本，启动~');

    var meetingPoint = 4; //集合点1~4
    var meetingPointTeamLeader = [
        [150, 94],
        [152, 94],
        [154, 94],
        [156, 94]
    ];
    var meetingPointTeammate = [
        [150, 95],
        [152, 95],
        [154, 95],
        [156, 95]
    ];

    var itemCheck = ()=>{
        var info = "";
        var itemCount = cga.getItemCount('梯子');
        if(itemCount<2){
            return leo.log('当前梯子数量：【'+itemCount+'】');
        }else{
            return leo.log('梯子已刷够，当前梯子数量：【'+itemCount+'】');
        }
    }

    var buildTeam = async () => {
        if (isTeamLeader) {
            await leo.autoWalk(meetingPointTeamLeader[meetingPoint - 1])
            await leo.buildTeamBlock(teamPlayerCount)
        } else {
            await leo.autoWalk(meetingPointTeammate[meetingPoint - 1])
            await leo.enterTeamBlock(teamLeader)
        }
    }

    var task = async () => {
        await leo.log('去刷梯子')
        if(teamPlayerCount>1 && !leo.isInTeam()){
            await buildTeam()
        }
        if(isTeamLeader){
            if(cga.getMapInfo().name == '艾尔莎岛'){
                await leo.autoWalk([157, 93])
                await leo.delay(500)
                await leo.turnDir(0)
                await leo.delay(500)
            }
            if(cga.getMapInfo().name == '艾夏岛'){
                await leo.autoWalk([190,116,'盖雷布伦森林'])
            }
            if (cga.getMapInfo().name == '盖雷布伦森林') {
                await leo.autoWalk([231, 222, '布拉基姆高地'])
            }
            if (cga.getMapInfo().name == '布拉基姆高地' && cga.getMapInfo().indexes.index3 == 59503) {
                await leo.autoWalk([231, 165, '洞窟之村　第１层'])
            }
            if (cga.getMapInfo().name == '洞窟之村　第１层') {
                await leo.autoWalk([204, 75, '洞窟之村　第２层'])
            }
            if (cga.getMapInfo().name == '洞窟之村　第２层') {
                await leo.autoWalk([209, 214, '洞窟之村　第３层'])
            }
            if (cga.getMapInfo().name == '洞窟之村　第３层') {
                await leo.autoWalk([80, 117, '布拉基姆高地'])
            }
            if (cga.getMapInfo().name == '布拉基姆高地' && cga.getMapInfo().indexes.index3 == 59504 ) {
                await leo.autoWalk([231, 128])
            }
            var isReady = true;
            var count = 0;
            await leo.loop( async ()=>{
                var teammateMap = {};
                if(cga.getMapInfo().name == '布拉基姆高地' && cga.getMapInfo().indexes.index3 == 59504 ){
                    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
                    await leo.say('检查【梯子】数量')
                    await itemCheck()
                    isReady = true;
                    await leo.waitMessageUntil((chat) => {
                        if (chat.msg && chat.msg.indexOf('当前梯子数量')!=-1 &&
                         (chat.msg.indexOf('[GP]') == 0 || teamPlayerCount == 1)) {
                            var name = chat.msg.split(':')[0].replace('[GP]','');
                            if(!teammateMap[name]){
                                if(chat.msg.indexOf('梯子已刷够')!=-1){
                                    teammateMap[name] = true;//已刷够
                                }else{
                                    teammateMap[name] = false;
                                }
                            }
                            //console.log(teammateMap);
                            var count = Object.getOwnPropertyNames(teammateMap).length;
                            if(count == teamPlayerCount){
                                for(var i in teammateMap){
                                    if(!teammateMap[i]){
                                        isReady = false;
                                    }
                                }
                                return true;
                            }
                        }
                    })
                    if(isReady){
                        await leo.log('队伍已刷够【梯子】')
                        await leo.reject()
                    }else{
                        await leo.talkNpcAt(227, 125, leo.talkNo)
                        await leo.waitAfterBattle()
                        await leo.autoWalk([213,112])
                        await leo.talkNpc(0, leo.talkNo)
                        await leo.waitAfterBattle()
                        count++;
                        console.log('已刷梯子【' + count + '】次');
                        return leo.delay(500)
                    }
                }
            })
            await leo.logBack()
        }else{
            //队员
            await leo.loop( async ()=>{
                await leo.waitMessageUntil((chat) => {
                    if (chat.msg && chat.msg.indexOf('检查【梯子】数量') >= 0) {
                        cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
                        itemCheck();
                        return true;
                    }
                    if(!leo.isInTeam()){
                        return true;
                    }
                })
                if(!leo.isInTeam()){
                    return leo.reject();
                }
            })
            await leo.logBack()
        }
    }

    var task2 = async () => {
        await leo.log('去学技能')
        if(cga.getMapInfo().name == '艾尔莎岛'){
            await leo.autoWalk([157, 93])
            await leo.delay(500)
            await leo.turnDir(0)
            await leo.delay(500)
        }
        if(cga.getMapInfo().name == '艾夏岛'){
            await leo.autoWalk([190,116,'盖雷布伦森林'])
        }
        if (cga.getMapInfo().name == '盖雷布伦森林') {
            await leo.autoWalk([231, 222, '布拉基姆高地'])
        }
        if (cga.getMapInfo().name == '布拉基姆高地' && cga.getMapInfo().indexes.index3 == 59503) {
            await leo.autoWalk([91, 192])
            await leo.useItemEx('梯子')
            await leo.talkNpc(leo.talkYes)
        }
        if (cga.getMapInfo().name == '秘道　第３层') {
            await leo.autoWalk([234, 121, '秘道　第２层'])
        }
        if (cga.getMapInfo().name == '秘道　第２层') {
            await leo.autoWalk([133, 54, '秘道　第１层'])
        }
        if (cga.getMapInfo().name == '秘道　第１层') {
            await leo.autoWalk([150, 111])
            await leo.useItemEx('梯子')
            await leo.talkNpc(leo.talkYes)
        }
        if (cga.getMapInfo().name == '布拉基姆高地' && cga.getMapInfo().indexes.index3 == 9999) {
            await leo.autoWalk([157, 62])
            await leo.turnDir(3)
            await leo.log('到达目标地点！请自行手动学习技能~~');
        }
    }

    leo.todo()
    .then(()=>leo.checkHealth(prepareOptions.doctorName))
    .then(()=>{
        if(flag==1){
            return task()
            .then(()=>leo.checkHealth(prepareOptions.doctorName))
        }
    })
    .then(()=>task2());
    
});