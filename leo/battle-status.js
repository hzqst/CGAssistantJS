const version = '1.0';
const BattleActionFlags = {
    ISPLAYER: 1,
    ISDOUBLE: 2,
    ISSKILLPERFORMED: 4,
    END: 8,
    BEGIN: 16
};
const BattlePositionMatrix = [
    [4,2,0,1,3],
    [9,7,5,6,8],
    [14,12,10,11,13],
    [19,17,15,16,18]
];
let first = false;
let battleRound = -1;
let logStatus = false;
const waitBattleAction = (cga) => {
    const leo = cga.emogua;
    cga.AsyncWaitBattleAction((error, state) => {
        if (typeof state == 'number' && logStatus) {
            if (BattleActionFlags.BEGIN & state) {
                console.log('========战斗开始========')
            } else if (BattleActionFlags.END & state) {
                console.log('~~~~~~~~战斗结束~~~~~~~~')
                console.log('')
            } else {
                const context = cga.GetBattleContext();
                if(context.round_count!=battleRound){
                    battleRound = context.round_count;
                    console.log('')
                    console.log(leo.logTime()+'第【'+(battleRound+1)+'】回合：')
                    context.units = cga.GetBattleUnits().map(u => {
                        u.hpRatio = u.curhp / u.maxhp;
                        return u;
                    });
                    context.enemies = context.units.filter(e =>
                        (context.player_pos > 9 && e.pos <= 9) ||
                        (context.player_pos <= 9 && e.pos > 9)
                    );
                    context.teammates = context.units.filter(e =>
                        (context.player_pos > 9 && e.pos > 9) ||
                        (context.player_pos <= 9 && e.pos <= 9)
                    );

                    const battleInfo = [];
                    {
                        const row = [];
                        const posArr = [3,1,0,2,4];
                        for (var i = 0; i < posArr.length; i++) {
                            let index = i;
                            const col = context.enemies.find(e=>e.pos%10==posArr[i]);
                            if(col){
                                row[index] = 'Lv'+col.level+'.'+col.name+'(HP:'+col.curhp+'/'+col.maxhp+' MP:'+col.curmp+'/'+col.maxmp+')';
                            }else{
                                row[index] = '';
                            }
                        }
                        battleInfo.push(row);
                    }
                    {
                        const row = [];
                        const posArr = [8,6,5,7,9];
                        for (var i = 0; i < posArr.length; i++) {
                            let index = i;
                            const col = context.enemies.find(e=>e.pos%10==posArr[i]);
                            if(col){
                                row[index] = 'Lv'+col.level+'.'+col.name+'(HP:'+col.curhp+'/'+col.maxhp+' MP:'+col.curmp+'/'+col.maxmp+')';
                            }else{
                                row[index] = '';
                            }
                        }
                        battleInfo.push(row);
                    }
                    {
                        const row = [];
                        const posArr = [8,6,5,7,9];
                        for (var i = 0; i < posArr.length; i++) {
                            let index = i;
                            const col = context.teammates.find(e=>e.pos%10==posArr[i]);
                            if(col){
                                row[index] = 'Lv'+col.level+'.'+col.name+'(HP:'+col.curhp+'/'+col.maxhp+' MP:'+col.curmp+'/'+col.maxmp+')';
                            }else{
                                row[index] = '';
                            }
                        }
                        battleInfo.push(row);
                    }
                    {
                        const row = [];
                        const posArr = [3,1,0,2,4];
                        for (var i = 0; i < posArr.length; i++) {
                            let index = i;
                            const col = context.teammates.find(e=>e.pos%10==posArr[i]);
                            if(col){
                                row[index] = 'Lv'+col.level+'.'+col.name+'(HP:'+col.curhp+'/'+col.maxhp+' MP:'+col.curmp+'/'+col.maxmp+')';
                            }else{
                                row[index] = '';
                            }
                        }
                        battleInfo.push(row);
                    }
                    for (var i = 0; i < battleInfo.length; i++) {
                        const row = battleInfo[i];
                        if(i==0){
                            console.log('敌方：【'+context.enemies.length+'】')
                        }
                        if(i==2){
                            console.log('已方：【'+context.teammates.length+'】')
                        }
                        for (var j = 0; j < row.length; j++) {
                            let info = row[j];
                            if(info!=''){
                                console.log('['+(i+1)+'_'+(j+1)+']'+info);
                            }
                        }
                    }
                }
            }
        }
        waitBattleAction(cga);
    }, 120000)
}
const start = (cga) => {
    const leo = cga.emogua;
    if(!first){
        first = true;
        tips(cga);
        waitBattleAction(cga);
    }
    logStatus = true;
    console.log(leo.logTime()+'战斗监控状态【开启】')
}
const stop = (cga) => {
    const leo = cga.emogua;
    logStatus = false;
    console.log(leo.logTime()+'战斗监控状态【关闭】')
}
const getVersion = () => {
    return version;
}
const tips = async (cga) => {
    const leo = cga.emogua;
    await leo.log('已成功加载战斗状态监控插件，插件版本['+version+']')
}
module.exports = {
    start,
    stop,
}
