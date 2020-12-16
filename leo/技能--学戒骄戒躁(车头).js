require('./common').then(cga => {
    //leo.baseInfoPrint();
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
    var isTeamLeader = true;
    leo.log('红叶の学戒骄戒躁技能(车头)脚本，队伍人数【'+teamPlayerCount+'】，启动~');

    var itemCheck = ()=>{
        var info = "";
        var itemCount = cga.getItemCount('梯子');
        if(itemCount<2){
            return leo.log('队长当前梯子数量：【'+itemCount+'】');
        }else{
            return leo.log('222,梯子已刷够，队长当前梯子数量：【'+itemCount+'】');
        }
    }

    var color = 0;
    var buildTeam = ()=>{
        if(cga.getMapInfo().name != '艾尔莎岛'){
            return leo.logBack()
            .then(()=>buildTeam());
        }
        leo.say('红叶の学戒骄戒躁技能专车，手动群：936198987',color);
        cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
        return leo.autoWalk([139, 109])
        .then(() => {
            var teamplayers = cga.getTeamPlayers();
            if (teamplayers.length == teamPlayerCount) {
                leo.say('红叶の学戒骄戒躁技能专车，已满员，出发~',color);
                teammates = [];
                var teamplayers = cga.getTeamPlayers();
                for (var i in teamplayers) {
                    teammates[i] = teamplayers[i].name;
                }
                leo.say('欢迎乘坐红叶の专车，本次旅途目的地是[学戒骄戒躁技能]，队员[' + teammates.toString() + ']',color);
                return leo.done(); //已组满人
            }else{
                return leo.delay(10000)
                .then(()=>buildTeam());
            }
        });
    } 

    var task = async () => {
        await leo.log('去刷梯子')
        if(teamPlayerCount>1 && !leo.isInTeam()){
            await buildTeam()
        }
        
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

        var isReady = false;
        var count = 0;
        var teammateMap = {};
        var teamplayers = cga.getTeamPlayers();
        for (var i = 0; i < teamplayers.length; ++i) {
            var teamateName = teamplayers[i].name;
            teammateMap[teamateName] = false;
        }
        await leo.loop( async ()=>{
            if(cga.getMapInfo().name == '布拉基姆高地' && cga.getMapInfo().indexes.index3 == 59504 ){
                cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
                await leo.say('请检查【梯子】数量，刷够了请开启队聊后打3个2，等待时间8秒')
                setTimeout(()=>itemCheck(), 1000);
                setTimeout(()=>leo.log('开始统计'), 8000);
                await leo.waitMessageUntil((chat) => {
                    var unReadyTeammates = [];
                    if (chat.msg && chat.msg.indexOf('222')!=-1
                        && chat.msg.indexOf('[GP]') == 0) {
                        var name = chat.msg.split(':')[0].replace('[GP]','');
                        if(!teammateMap[name]){
                            teammateMap[name] = true;//该队员已刷够
                        }
                        //console.log(teammateMap);
                        isReady = true;
                        for(var name in teammateMap){
                            if(!teammateMap[name]){
                                isReady = false;
                            }
                        }
                        if(isReady){
                            return true;
                        }
                    }
                    if (chat.msg && chat.msg.indexOf('开始统计')!=-1
                        && chat.msg.indexOf('[GP]') == 0) {
                        var unReadyTeammates = [];
                        isReady = true;
                        for(var name in teammateMap){
                            if(!teammateMap[name]){
                                isReady = false;
                                unReadyTeammates.push(name);
                            }
                        }

                        if(!isReady){
                            leo.log('时间到，队员['+unReadyTeammates+']尚未刷够梯子')
                        }
                        return true;
                    }
                })
                if(isReady){
                    await leo.log('队伍已刷够【梯子】，请登出后，在集合点(139, 109)处重新组队，前往学习技能')
                    await leo.delay(3000)
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
    }

    var task2 = async () => {
        await leo.log('去学技能')
        if(teamPlayerCount>1 && !leo.isInTeam()){
            await buildTeam()
        }

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
            await leo.moveAround()
            await leo.autoWalk([91, 192])
            await leo.moveAround()
            await leo.autoWalk([91, 192])
            await leo.log('请在坐标(91, 192)处双击使用道具【梯子】')
            await leo.useItemEx('梯子')
            await leo.talkNpc(leo.talkYes)
        }
        if (cga.getMapInfo().name == '秘道　第３层') {
            await leo.moveAround()
            await leo.buildTeam(teamPlayerCount)
            await leo.autoWalk([234, 121, '秘道　第２层'])
        }
        if (cga.getMapInfo().name == '秘道　第２层') {
            await leo.autoWalk([133, 54, '秘道　第１层'])
        }
        if (cga.getMapInfo().name == '秘道　第１层') {
            await leo.autoWalk([150, 111])
            await leo.moveAround()
            await leo.autoWalk([150, 111])
            await leo.moveAround()
            await leo.autoWalk([150, 111])
            await leo.log('请在坐标(150, 111)处双击使用道具【梯子】')
            await leo.useItemEx('梯子')
            await leo.talkNpc(leo.talkYes)
        }
        if (cga.getMapInfo().name == '布拉基姆高地' && cga.getMapInfo().indexes.index3 == 9999) {
            await leo.moveAround()
            await leo.buildTeam(teamPlayerCount)
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