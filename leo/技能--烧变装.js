require('./common').then(cga=>{
    //leo.baseInfoPrint();
    leo.log('红叶の烧变装脚本，启动~');

    var target = 8;
    var name = '医道之殇';

    var pos = [30, 87];
    var minMp = 100;
    var timeout = 500;
    var playerinfo = cga.GetPlayerInfo();

    var skillName = '变装';
    var level = 0;
    if(!cga.findPlayerSkill(skillName)){
        console.error('提示：没有'+skillName+'技能！');
        return;
    }

    var working = ()=>{
        return leo.todo()
        .then(()=>{
            var skill = cga.GetSkillsInfo().find(s => s.name == skillName);
            if(skill && cga.GetPlayerInfo().mp >= minMp){
                if(level == 0){
                    cga.StartWork(skill.index, skill.lv-1);
                }else{
                    cga.StartWork(skill.index, level-1);
                }
                cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => {
                    if (players && players.length > 0) {
                        const index = players.findIndex(p => p.name == playerinfo.name);
                        if (typeof index == 'number') {
                            cga.PlayerMenuSelect(index);
                            cga.AsyncWaitUnitMenu((error, units) => setTimeout(() => {
                                if (error) {
                                    leo.next();
                                } else {
                                    cga.UnitMenuSelect(0);
                                }
                            }, 0));
                        } else leo.next();
                    } else leo.next();
                }, 0), 2000);
            }else{
                return leo.leaveTeam()
                .then(()=>leo.autoWalk([34, 89]))
                .then(()=>leo.supply(35, 88))
                .then(()=>leo.autoWalk(pos))
                .then(()=>leo.enterTeam(name));
            }
        });
    }

    leo.todo().then(()=>{
        var currentMap = cga.GetMapName();
        if (currentMap != '里谢里雅堡') {
            return leo.goto(n => n.castle.x);
        }
    })
    .then(()=>leo.autoWalk(pos))
    .then(()=>leo.enterTeam(name))
    .then(()=>{
        return leo.loop(()=>{
            var skill = cga.findPlayerSkill(skillName);
            if(target <= skill.lv){
                leo.log('红叶の烧'+skillName+'脚本，提示：技能【'+skillName+'】等级已达到【'+skill.lv+'】，达到或者超过了预设的目标等级【'+target+'】，脚本结束');
                return leo.reject();
            }
            return working()
            .then(()=>leo.delay(timeout));
        })
    })
    

    var i = 0;
    var autoTalk = ()=>{
        leo.say('红叶の烧变装脚本，说话防掉线',i);
        ++i > 4 ? (i = 0) : 0;
        setTimeout(autoTalk, 60000);
    }
    autoTalk();

    
});