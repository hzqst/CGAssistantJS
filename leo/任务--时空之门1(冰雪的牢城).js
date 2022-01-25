require('./common').then(async (cga) => {
    const isLogBackFirst = false; //启动登出
    const autoBoss = true;
    const flyTo8 = true;

    var teams = [//自行修改角色名称，可以再加更多的队伍
        ['奇迹之殇','金玉之殇','琉璃之殇'],
        ['繁花红雨落城中℡','半夏琉璃叶撕阳°'],
    ];
    const crystalName = '水火的水晶（5：5）';
    const doctorName = '医道之殇';
    const jsonFile = '';
    
    await leo.log('红叶の时空之门1(冰雪的牢城)脚本，启动~')
    const teammates = leo.findMyTeam(teams);
    if(teammates == null){
        await leo.log('红叶の时空之门1(冰雪的牢城)脚本，未找到队伍，请确认配置是否正确')
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
        if(flyTo8 && leo.has('冰之约束')){
            await leo.useItemEx('冰之约束')
            await leo.talkNpc(-1,-1,leo.talkYes)
            await leo.delay(2000)
        }else{
            await leo.goto(n => n.teleport.jenova)
        }
    }
    if(cga.GetMapName()=='杰诺瓦镇') {
        console.log(leo.logTime()+'到达【杰诺瓦镇】')
        if(isTeamLeader) {
            await leo.autoWalk([58,44])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalk([71, 19, '莎莲娜'])
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
                [528, 210],[527, 210],[528, 210],[527, 210]
            ])
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='莎莲娜东方洞窟 地下1楼') {
                    return leo.reject();
                }
                await leo.talkNpc(528,209,leo.talkYes)
                await leo.delay(1000)
            })
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().y==210) {
                    await leo.talkNpc(528,209,leo.talkYes)
                }
                if(cga.GetMapName()=='莎莲娜东方洞窟 地下1楼') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='莎莲娜东方洞窟 地下1楼') {
        console.log(leo.logTime()+'到达【莎莲娜东方洞窟 地下1楼】')
        if(isTeamLeader) {
            await leo.autoWalk([10,42])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalkList([
                [18,5,'莎莲娜东方洞窟 地下2楼'],[32,9,'莎莲娜东方洞窟 地下3楼'],
                [9,17,'莎莲娜东方洞窟 地下2楼'],[9,12,'莎莲娜东方洞窟 地下1楼'],
                [10,15,'莎莲娜'],[381,27,'被封闭的祭坛']
            ])
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='被封闭的祭坛') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    if(cga.GetMapName()=='被封闭的祭坛') {
        if(cga.getMapInfo().indexes.index3 == 4501) {
            console.log(leo.logTime()+'到达【被封闭的祭坛】，准备打依代')
            if(isTeamLeader){
                await leo.autoWalk([9,9])
                if(autoBoss){
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3==4502){
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
                        if(cga.getMapInfo().indexes.index3==4502){
                            return leo.reject();
                        }
                        await leo.delay(2000)
                    })
                }
            }else{
                await leo.loop(async ()=>{
                    if(cga.getMapInfo().indexes.index3==4502) {
                        return leo.reject();
                    }
                    await leo.delay(3000)
                })
            }
        }
        if(cga.getMapInfo().indexes.index3 == 4502) {
            console.log(leo.logTime()+'打完依代，继续上路')
            if(leo.isInTeam()){
                await leo.leaveTeam()
            }
            await leo.autoWalk([14,5])
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='佛利波罗'){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })
        }
    }
    if(cga.GetMapName()=='佛利波罗') {
        console.log(leo.logTime()+'到达【佛利波罗】')
        if(isTeamLeader) {
            await leo.autoWalk([27,186])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalkList([
                [96,166,'冰之洞窟'],[66,16,'佛利波罗'],[174,103,'冰雪之牢城 第1层']
            ])
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第1层') {
                    return leo.reject();
                }
                await leo.delay(3000)
            })
        }
    }
    let mapInfo = cga.getMapInfo();
    if(mapInfo.name=='冰雪之牢城 第1层' && mapInfo.indexes.index3 == 20501 && mapInfo.x < 70) {
        console.log(leo.logTime()+'到达【冰雪之牢城 第1层】')
        if(isTeamLeader) {
            await leo.autoWalkList([
                [17, 45],[16, 45],[17, 45],[16, 45]
            ])
            await leo.loop(async ()=>{
                if(leo.has('火把') || leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(17,46,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.delay(1000*10)
            await leo.autoWalkList([
                [26, 51],[26, 50],[26, 51],[26, 50]
            ])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(25,51,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.delay(1000*10)
            await leo.autoWalk([30,51,20514])
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().y==45) {
                    await leo.talkNpc(17,46,leo.talkYes)
                }
                if(leo.has('火把') || leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
            await leo.loop(async ()=>{
                if(cga.getMapInfo().x==26) {
                    await leo.talkNpc(25,51,leo.talkYes)
                }
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3==20514){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第1层' && cga.getMapInfo().indexes.index3 == 20514) {
        if(isTeamLeader) {
            await leo.autoWalk([75,50])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20501){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3==20501){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    mapInfo = cga.getMapInfo();
    if(mapInfo.name=='冰雪之牢城 第1层' && mapInfo.indexes.index3 == 20501 && (mapInfo.x > 70 || mapInfo.y > 70)) {
        if(isTeamLeader) {
            await leo.autoWalk([16,80,'冰雪之牢城 第2层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第2层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第2层') { //20502
        console.log(leo.logTime()+'到达【冰雪之牢城 第2层】')
        if(isTeamLeader) {
            await leo.autoWalk([16,71,[9,71]])
            await leo.autoWalk([27,62,[34,60]])
            await leo.autoWalk([44,66])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.autoWalk([76,71,'冰雪之牢城 第3层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第3层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第3层') { //20503
        console.log(leo.logTime()+'到达【冰雪之牢城 第3层】')
        if(isTeamLeader) {
            await leo.autoWalk([72,33,'冰雪之牢城 第2层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第2层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第2层') { //20502
        console.log(leo.logTime()+'到达【冰雪之牢城 第2层】')
        if(isTeamLeader) {
            await leo.autoWalk([63,34,[56,36]])
            await leo.autoWalk([41,21,[41,15]])
            await leo.autoWalk([61,81,'冰雪之牢城 第3层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第3层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第3层') { //20503
        console.log(leo.logTime()+'到达【冰雪之牢城 第3层】')
        if(isTeamLeader) {
            await leo.autoWalk([33,79,[26,82]])
            await leo.autoWalk([12,70])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20516){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.autoWalk([23,69,'冰雪之牢城 第4层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第4层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第4层') { //20504
        console.log(leo.logTime()+'到达【冰雪之牢城 第4层】')
        if(isTeamLeader) {
            await leo.autoWalk([18,86])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([27,81])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().x == 30 && cga.getMapInfo().y == 81){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([52,80])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([30,48])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().x == 27 && cga.getMapInfo().y == 48){
                    return leo.reject();
                }
                await leo.talkNpc(4,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([24,51])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([62,15])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().x == 65 && cga.getMapInfo().y == 15){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.autoWalk([75,16,'冰雪之牢城 第5层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第5层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第5层') { //20505 20517
        console.log(leo.logTime()+'到达【冰雪之牢城 第5层】')
        if(isTeamLeader) {
            await leo.autoWalk([27,47,20517])
            await leo.autoWalk([9,6])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.autoWalk([3,6,20505])
            await leo.autoWalk([51,46,[60,46]])
            await leo.autoWalk([92,46,'冰雪之牢城 第6层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第6层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第6层') { //20506 20524
        console.log(leo.logTime()+'到达【冰雪之牢城 第6层】')
        if(isTeamLeader) {
            await leo.autoWalk([78,47])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20506){
                    return leo.reject();
                }
                await leo.talkNpc(4,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.autoWalk([36,47,[26,50]])
            await leo.autoWalk([53,83,[67,81]])
            await leo.autoWalk([86,83,'冰雪之牢城 第7层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第7层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第7层') { //20507
        console.log(leo.logTime()+'到达【冰雪之牢城 第7层】')
        if(isTeamLeader) {
            await leo.autoWalk([21,46,[24,46]])
            await leo.autoWalk([42,46,[45,46]])
            await leo.autoWalk([63,46,'冰雪之牢城 第8层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第8层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第8层' && cga.getMapInfo().indexes.index3 == 20527) { //20508 20527 20530
        console.log(leo.logTime()+'到达【冰雪之牢城 第8层】')
        if(isTeamLeader) {
            await leo.autoWalk([45,47])
            if(autoBoss){
                await leo.loop(async ()=>{
                    if(cga.getMapInfo().indexes.index3==20530){
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
                    if(cga.getMapInfo().indexes.index3==20530){
                        return leo.reject();
                    }
                    await leo.delay(2000)
                })
            }
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20530){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第8层' && cga.getMapInfo().indexes.index3 == 20530) { //20508 20527 20530
        console.log(leo.logTime()+'打完LB，继续上路')
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        await leo.loop(async ()=>{
            if(cga.getMapInfo().indexes.index3 == 20508){
                return leo.reject();
            }
            await leo.talkNpc(0,leo.talkYes)
            await leo.delay(1000)
        })
    }
    if(cga.GetMapName()=='冰雪之牢城 第8层' && cga.getMapInfo().indexes.index3 == 20508) { //20508 20527 20530
        console.log(leo.logTime()+'到达【冰雪之牢城 第8层】')
        await leo.loop(async ()=>{
            if(leo.has('苍炎的火把')){
                return leo.reject();
            }
            await leo.talkNpc(0,leo.talkYes)
            await leo.delay(1000)
        })
        if(isTeamLeader) {
            await leo.autoWalk([45,48])
            await leo.buildTeamBlock(teamPlayerCount,teammates)
            await leo.autoWalk([52,47,[64,45]])

            await leo.autoWalk([74,31])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20519){
                    return leo.reject();
                }
                await leo.talkNpc(6,leo.talkYes)
                await leo.delay(1000)
            })
            await leo.autoWalk([14,46,'冰雪之牢城 第9层'])
        }else{
            await leo.enterTeamBlock(teamLeader)
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第9层'){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第9层') { //20509
        console.log(leo.logTime()+'到达【冰雪之牢城 第9层】')
        if(isTeamLeader) {
            await leo.autoWalk([22,65,[40,73]])
            await leo.autoWalk([82,77,'冰雪之牢城 第10层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第10层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第10层') { //20510
        console.log(leo.logTime()+'到达【冰雪之牢城 第10层】')
        if(isTeamLeader) {
            await leo.autoWalkList([
                [9, 76],[9, 77],[9, 76],[9, 77]
            ])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20525){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
            await leo.autoWalk([12,46,20510])
            await leo.autoWalk([82,47,'冰雪之牢城 第11层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.getMapInfo().x==9 && leo.has('苍炎的火把')) {
                    await leo.talkNpc(8,76,leo.talkYes)
                }
                if(cga.getMapInfo().indexes.index3 == 20525){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第11层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第11层') { //20511
        console.log(leo.logTime()+'到达【冰雪之牢城 第11层】')
        if(isTeamLeader) {
            await leo.autoWalk([69,59,[61,62]])
            await leo.autoWalk([48,57,[41,59]])
            await leo.autoWalk([35,51,[36,43]])

            await leo.autoWalk([32,18])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([36,43,[35,51]])
            await leo.autoWalk([41,59,[48,57]])
            await leo.autoWalk([61,62,[69,59]])
            await leo.autoWalk([69,29,[61,32]])

            await leo.autoWalk([48,27])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20520){
                    return leo.reject();
                }
                await leo.talkNpc(4,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([32,18])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([36,43,[35,51]])
            await leo.autoWalk([35,70,[41,69]])
            await leo.autoWalk([6,40,[11,41]])
            await leo.autoWalk([10,17,'冰雪之牢城 第12层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第12层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第12层') { //20512
        console.log(leo.logTime()+'到达【冰雪之牢城 第12层】')
        if(isTeamLeader) {
            await leo.autoWalk([44,10,'冰雪之牢城 第13层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第13层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第13层') { //20513
        console.log(leo.logTime()+'到达【冰雪之牢城 第13层】')
        if(isTeamLeader) {
            await leo.autoWalk([73,10,'冰雪之牢城 第12层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第12层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第12层') { //20512
        console.log(leo.logTime()+'到达【冰雪之牢城 第12层】')
        if(isTeamLeader) {
            await leo.autoWalk([73,23])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20521){
                    return leo.reject();
                }
                await leo.talkNpc(2,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([66,45,[71,47]])

            await leo.autoWalk([70,57])
            await leo.loop(async ()=>{
                if(leo.has('苍炎的火把')){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([72,67,[67,67]])
            await leo.autoWalk([73,78,'冰雪之牢城 第13层'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='冰雪之牢城 第13层') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='冰雪之牢城 第13层') { //20513
        console.log(leo.logTime()+'到达【冰雪之牢城 第13层】')
        if(isTeamLeader) {
            await leo.autoWalk([56,68,20522])

            await leo.autoWalk([9,8])
            await leo.loop(async ()=>{
                if(cga.getMapInfo().indexes.index3 == 20526){
                    return leo.reject();
                }
                await leo.talkNpc(4,leo.talkYes)
                await leo.delay(1000)
            })

            await leo.autoWalk([3,12,20513])
            await leo.autoWalk([42,14,'神篱'])
        }else{
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='神篱') {
                    return leo.reject();
                }
                await leo.delay(2000)
            })
        }
    }
    if(cga.GetMapName()=='神篱') { //20414 20428
        if(cga.getMapInfo().indexes.index3==20414){
            console.log(leo.logTime()+'到达【BOSS前】')
            if(isTeamLeader) {
                await leo.autoWalk([26,11])
                if(autoBoss){
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3==20428){
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
                        if(cga.getMapInfo().indexes.index3==20428){
                            return leo.reject();
                        }
                        await leo.delay(2000)
                    })
                }
            }else{
                await leo.loop(async ()=>{
                    if(cga.getMapInfo().indexes.index3==20428){
                        return leo.reject();
                    }
                    await leo.delay(2000)
                })
            }
        }
        if(cga.getMapInfo().indexes.index3==20428){
            console.log(leo.logTime()+'打完BOSS')
            if(leo.isInTeam()){
                await leo.leaveTeam()
            }
            await leo.autoWalk([30,7])
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='佛利波罗传送点'){
                    return leo.reject();
                }
                await leo.talkNpc(0,leo.talkYes)
                await leo.delay(1000)
            })
        }
    }
    if(cga.GetMapName()=='佛利波罗传送点') {
        console.log(leo.logTime()+'对话NPC，结束任务')
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        await leo.autoWalk([35,27])
        await leo.loop(async ()=>{
            if(cga.GetMapName()=='召唤之间'){
                return leo.reject();
            }
            await leo.talkNpc(0,leo.talkYes)
            await leo.delay(1000)
        })
    }
    if(cga.GetMapName()=='召唤之间') {
        await leo.log('红叶の时空之门1(冰雪的牢城)脚本，任务已完成')
    }else{
        await leo.log('红叶の时空之门1(冰雪的牢城)脚本，未预期的地图，请登出后重启脚本')
    }
});