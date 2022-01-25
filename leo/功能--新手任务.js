require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    
    var main = async () => {
        if(cga.GetMapName() == '召唤之间'){
            await leo.autoWalk([18, 6])
            await leo.talkNpc(0, leo.talkNpcSelectorYes)
            if(cga.GetMapName() == '召唤之间')
                await leo.autoWalk([27, 8, '回廊'])
        }
        if(cga.GetMapName() == '回廊'){
            await leo.autoWalkList([
                [23, 19, '灵堂'],[53,2]
            ])
            await leo.talkNpc(0, leo.talkNpcSelectorYes) 
            await leo.delay(1500);           
        }
        if(cga.GetMapName() == '灵堂' && cga.getItemCount('死者的戒指')>0){
            await leo.autoWalkList([
                [31, 48, '回廊'],[44, 15, '召唤之间'],[18,6]
            ])
            await leo.talkNpc(0, leo.talkNpcSelectorYes)
            await leo.delay(1500);
        }
        if(cga.GetMapName() == '谒见之间' && cga.getItemCount('死者的戒指')>0){
            await leo.autoWalkList([
                [7,4]
            ])
            await leo.talkNpc(6, leo.talkNpcSelectorYes)
            await leo.delay(1500);
        }
        if(cga.GetMapName() == '谒见之间' && cga.getItemCount('赏赐状')>0){
            await leo.autoWalkList([
                [8,19,'里谢里雅堡 2楼'],[47,78]
            ])
            await leo.talkNpc(2, leo.talkNpcSelectorYes)
            await leo.delay(1500);
            await leo.logBack()
        }

    }
    
    cga.gui.LoadSettings({
        "battle": {
            "autobattle": true,
            "bossprot": false,
            "delayfrom": 4000,
            "delayto": 4500,
            "highspeed": true,
            "list": [
                {
                    "condition": 0,
                    "condition2": 0,
                    "condition2rel": 0,
                    "condition2val": "",
                    "conditionrel": 0,
                    "conditionval": "",
                    "index": 0,
                    "petaction": -1,
                    "pettarget": -1,
                    "pettargetsel": -1,
                    "playeraction": 3,
                    "playertarget": -1,
                    "playertargetsel": -1
                }
            ],
            "lockcd": false,
            "lv1prot": false,
            "pet2action": false,
            "playerforceaction": false,
            "r1nodelay": true,
            "showhpmp": false
        },
        "player": {
            "noswitchanim": true,
        }
    }, ()=>{
        main().then(()=>leo.log('done!'))
    });

});