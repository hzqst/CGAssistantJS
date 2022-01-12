require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    //人物面朝BOSS
    var direction = cga.GetPlayerInfo().direction;
	leo.loop(()=>{
        return leo.waitAfterBattle()
        .then(()=>leo.talkNpc(direction,leo.talkNpcSelectorYes))
        .then(()=>leo.delay(500));
    });
});