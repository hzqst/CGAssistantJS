require('./common').then(cga=>{
    //leo.baseInfoPrint();
    leo.say('红叶の医生随队治疗脚本，启动~');

    var minMp = 100;

    var skill = cga.findPlayerSkill('治疗');
    if(!skill){
        leo.log('提示：没有治疗技能！');
    }else{
        leo.loop(
            ()=>leo.todo()
            .then(()=>{
                if(cga.GetPlayerInfo().mp >= minMp){
                    return leo.healTeammate().then(()=>leo.delay(2000));
                }else{
                    return leo.log('医生MP不足，脚本结束')
                    .then(()=>leo.reject());
                }
            })
        );
        
    }
});