require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    //leo.baseInfoPrint();
    //leo.logStatus = false;
    //leo.monitor.config.equipsProtect = false;
    leo.moveTimeout = 220;//遇敌速度延时，单位毫秒
    var protect = {
        //contactType遇敌类型：-1-旧遇敌(高效)，0-按地图自适应，1-东西移动，2-南北移动，3-随机移动，
        //4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false, 
        minHp: 100,
        minMp: 0,
        minPetHp: 30,
        minPetMp: 0
    }

    await leo.log('红叶の原地高速遇敌脚本，启动~')
    await leo.encounterTeamLeader(protect)
    await leo.log('已停止遇敌')

});