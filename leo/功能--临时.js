require('./common').then(cga=>{
    //人物面朝BOSS
    var direction = cga.GetPlayerInfo().direction;
	leo.loop(()=>{
        return leo.say('头目万岁')
        .then(()=>leo.talkNpc(leo.talkNpcSelectorYes))
        .then(()=>leo.delay(500));
    });
});