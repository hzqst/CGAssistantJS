require('./common').then(cga => {
    //leo.baseInfoPrint();
    leo.logStatus = false;
    var protect = {
        minHp: 100,
        minMp: 0,
        minPetHp: 30,
        minPetMp: 0
    }

    leo.log('红叶の原地高速遇敌脚本，启动~');

    leo.todo()
    .then(()=>leo.encounterTeamLeader(protect))
    .then(()=>leo.log('已停止遇敌'));

});