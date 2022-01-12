require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    const jiuzhi = false;
    leo.baseInfoPrint();
    leo.panel.escape();
    await leo.log('红叶の就职咒术任务脚本，启动~');
    await leo.delay(3000)
    leo.panel.itemdroplistAdd(['魔石'])

    const task = async () => {
        if(!leo.has('咒术师推荐信')) {
            if(!leo.has('咒器·红念珠')){
                await leo.logBack()
                await leo.checkHealth('医道之殇') 
                await leo.goto(n => n.falan.w1)
                await leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]])
                await leo.talkNpc(201, 165,leo.talkYes,'莎莲娜海底洞窟 地下1楼')
                await leo.autoWalkList([[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]])
                await leo.turnTo(31, 22)
                await leo.delay(1000)
                await leo.say('咒术')
                await leo.talkNpc(-1,-1,leo.talkYes)
                await leo.autoWalkList([
                    [38, 37 ,'咒术师的秘密住处'],[12, 7]
                ])
                await leo.loop(async ()=> {
                    if(leo.has('咒器·红念珠')){
                        return leo.reject();
                    }
                    await leo.talkNpc(13, 7, leo.talkYes)
                    await leo.delay(1000)
                })
                await leo.log('红叶の就职咒术任务脚本，拿到【咒器·红念珠】')
            }

            if(!leo.has('神器·紫念珠')){
                await leo.logBack()
                await leo.checkHealth('医道之殇') 
                await leo.goto(n => n.falan.w2)
                await leo.autoWalkList([
                    [96, 149, '豪宅'],
                    [33, 22, '豪宅  地下'],
                    [9, 5, '豪宅'],
                    [33, 10, '镜中的豪宅'],
                    [35, 2]
                ])
                await leo.talkNpc(35, 1, leo.talkYes)
                await leo.autoWalk([36, 9])
                await leo.talkNpc(36, 10, leo.talkYes)
                await leo.autoWalkList([
                    [27, 67, '豪宅'],
                    [58, 66, '豪宅  地下'],
                    [41, 23, '豪宅'],
                    [59, 6, '豪宅  2楼'],
                    [16, 9, '镜中的豪宅  2楼'],
                    [40, 10]
                ])
                await leo.talkNpc(41, 10, leo.talkYes)
                await leo.autoWalk([40,16])
                await leo.talkNpc(40, 17, leo.talkYes)
                await leo.autoWalkList([
                    [17, 61, '豪宅  2楼'],
                    [5, 23, '豪宅  阁楼'],
                    [14, 30, '镜中的豪宅  阁楼'],
                    [14, 36, '镜中的豪宅  2楼'],
                    [11, 35]
                ])
                await leo.talkNpc(12, 35, leo.talkYes)
                await leo.autoWalkList([
                    [16, 51, '镜中的豪宅  阁楼'],[23, 20]
                ])
                await leo.talkNpc(23, 19, leo.talkYes)
                await leo.autoWalk([23, 11])
                await leo.loop(async ()=> {
                    if(leo.has('神器·紫念珠')){
                        return leo.reject();
                    }
                    await leo.talkNpc(23, 10, leo.talkYes)
                    await leo.delay(1000)
                })
                await leo.log('红叶の就职咒术任务脚本，拿到【神器·紫念珠】')
            }

            if(leo.has('神器·紫念珠')){
                await leo.logBack()
                await leo.checkHealth('医道之殇') 
                await leo.goto(n => n.falan.w1)
                await leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]])
                await leo.talkNpc(201, 165,leo.talkYes,'莎莲娜海底洞窟 地下1楼')
                await leo.autoWalkList([[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]])
                await leo.turnTo(31, 22)
                await leo.delay(1000)
                await leo.say('咒术')
                await leo.talkNpc(-1,-1,leo.talkYes)
                await leo.autoWalkList([
                    [38, 37 ,'咒术师的秘密住处'],[12, 7]
                ])
                await leo.loop(async ()=> {
                    if(leo.has('咒术师推荐信')){
                        return leo.reject();
                    }
                    await leo.talkNpc(13, 7, leo.talkYes)
                    await leo.delay(1000)
                })
            }
        }
        if(leo.has('咒术师推荐信')){
            await leo.log('红叶の就职咒术任务脚本，拿到【咒术师推荐信】')
        }else{
            await leo.log('出错，未能拿到【咒术师推荐信】')
        }

        if(jiuzhi && leo.has('咒术师推荐信')) {
            console.log(leo.logTime()+'开始')
            if(cga.GetMapName()!='咒术师的秘密住处' && cga.getMapInfo().indexes.index3 != 15008){
                await leo.logBack()
                await leo.checkHealth('医道之殇') 
                await leo.goto(n => n.falan.w1)
                await leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]])
                await leo.talkNpc(201, 165,leo.talkYes,'莎莲娜海底洞窟 地下1楼')
                await leo.autoWalkList([[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]])
                await leo.turnTo(31, 22)
                await leo.delay(1000)
                await leo.say('咒术')
                await leo.talkNpc(-1,-1,leo.talkYes)
                await leo.autoWalkList([
                    [38, 37 ,'咒术师的秘密住处']
                ])
            }
            if(cga.GetMapName()=='咒术师的秘密住处') {
                await leo.autoWalk([10, 0 ,15008])
            }
            await leo.autoWalk([10, 0])
            await leo.talkNpc(11, 0,leo.talkYes)
            await leo.autoWalk([10, 10])
            await leo.turnTo(11, 10)
            if(leo.has('转职保证书')){
                await leo.talkNpc(0, (dialog) => {
                    if(dialog && dialog.message && dialog.message.indexOf('我想转职') >= 0){
                        cga.ClickNPCDialog(0, 1);
                        return true;
                    }
                    if(dialog && dialog.message && dialog.message.indexOf('转职以后') >= 0){
                        cga.ClickNPCDialog(32, -1);
                        return true;
                    }
                    if(dialog && dialog.message && dialog.message.indexOf('5000个金币') >= 0){
                        cga.ClickNPCDialog(0, 0);
                        return false;
                    }
                    return false;
                })
                await leo.log('到达转职位置!身上【有】转职保证书，已自动完成转职')
                await leo.delay(2000)
            }else{
                await leo.log('到达转职位置!请注意：身上【没有】转职保证书!!!');
            }
        }

    }

    await leo.loop(async ()=> {
        try{
            await task()
            await leo.log('脚本结束')
            return leo.reject();
        }catch(e){
            console.log('出错，e：' + e)
        }
        await leo.delay(10000)
    })
    
});