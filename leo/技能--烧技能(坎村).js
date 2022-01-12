require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    leo.baseInfoPrint();
    //leo.logStatus = false;

    var skillName = '补血魔法';
    var skillLevel = 4;

    var protect = {
        //contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false, 
        minHp: 500,
        minMp: 50,
        minPetHp: 300,
        minPetMp: 120,
        normalNurse: false,
        checker: ()=>{
            
        }
    };
    var isLogBackFirst = false; //启动登出
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '火风的水晶（5：5）',
        doctorName: '医道之殇'
    };
    
    leo.log('红叶の坎村烧技能脚本，启动~');

    var skill = cga.findPlayerSkill(skillName);
        
    if(!skill){
        leo.log('提示：当前人物没有学习技能【'+skillName+'】，请确认脚本设置！脚本结束');
        return leo.delay(24*60*60*1000);
    }

    if(skillLevel <= skill.lv){
        leo.log('提示：技能【'+skillName+'】等级已达到【'+skill.lv+'】，达到或者超过了预设的目标等级【'+skillLevel+'】，脚本结束');
        return leo.delay(24*60*60*1000);
    }else{
        leo.log('要烧的技能是【'+skillName+'】，目前等级【'+skill.lv+'】，预设的目标等级【'+skillLevel+'】');
    }
    
    cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
    cga.EnableFlags(cga.ENABLE_FLAG_CARD, false); //关闭名片
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false); //关闭交易
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = true;
    var oldGold = cga.GetPlayerInfo().gold;

    leo.todo().then(() => {
        //登出
        if (isLogBackFirst) {
            return leo.logBackA();
        } else {
            return leo.next();
        }
    }).then(() => {
        return leo.loop(
            () => leo.waitAfterBattle()
            .then(() => leo.checkHealthA(prepareOptions.doctorName,false))
            .then(() => leo.checkCrystalA(prepareOptions.crystalName))
            .then(() => {
                //判断是否要去银行取钱
                playerinfo = cga.GetPlayerInfo();
                if(playerinfo.gold<5000){
                    return leo.gotoBankA()
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>leo.moveGold(100000,cga.MOVE_GOLD_FROMBANK))
                    .then(()=>{
                        playerinfo = cga.GetPlayerInfo();
                        if(playerinfo.gold<5000){
                            return leo.reject('钱到用时方恨少！请补充足够银子后重新执行脚本！');       //跳出总循环
                        }
                    });
                }
            })
            .then(() => {
                if(isTeamLeader) {
                    var nowTime = leo.now();
                    var time = parseInt((nowTime - leo.beginTime)/1000/60);//已持续练级时间
                    var newGold = cga.GetPlayerInfo().gold;
                    var useGold = oldGold - newGold;
                    var skillNow = cga.findPlayerSkill(skillName);
                    if(skillLevel <= skillNow.lv){
                        leo.log('提示：技能【'+skillName+'】等级已达到【'+skillNow.lv+'】，达到了预设的目标等级【'+skillLevel+'】，共耗时【'+time+'】分钟，消耗魔币【'+useGold+'】，脚本结束');
                        return leo.delay(24*60*60*1000);
                    }else{
                        return leo.log('技能【'+skillName+'】，等级【'+skillNow.lv+'/'+skillLevel+'】，已耗时【'+time+'】分钟，消耗魔币【'+useGold+'】');
                    }
                }
            })
            .then(() => {
                if (isTeamLeader) {
                    var currentMap = cga.GetMapName();
                    if (currentMap == '阿凯鲁法村') {
                        return leo.gotoKan();
                    }
                    if (currentMap == '坎那贝拉村') {
                        return leo.autoWalk([38, 44, '医院']);
                    }
                    if (currentMap == '医院') {
                        return leo.autoWalk([16, 8])
                        .then(()=>leo.supplyDir(6))
                        .then(()=>leo.autoWalkList([
                            [15, 25, '坎那贝拉村'],[13, 48, '米内葛尔岛']
                        ]));
                    }
                    if (currentMap == '米内葛尔岛') {
                        return leo.autoWalk([622, 303])
                        .then(()=>console.log(leo.logTime() + '开始战斗'))
                        .then(()=>leo.encounterTeamLeader(protect))
                        .then(() => {
                            console.log(leo.logTime() + "触发回补");
                            return leo.autoWalk([627, 304, '坎那贝拉村']);
                        });
                    }
                }
                //console.log('延时3秒');
                return leo.delay(3000);
            }).
            catch (console.log)
        );
    });
});