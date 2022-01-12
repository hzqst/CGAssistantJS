require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    var times = 6;//一次最多跑6个，避免满包

	leo.log('红叶の跑长期(自动吃水)脚本，启动~');

    if(times>6){
        leo.log('一次最多跑6个，避免满包，已为你设置成6个了');
        times = 6;
    }

    var itemCount = cga.getItemCount('蜗牛的包裹');
    var flag = false;

    leo.todo()
    .then(()=>{
        if(itemCount<times){
            return leo.logBack()
            .then(()=>leo.goto(n => n.falan.e2))
            .then(()=>leo.autoWalkList([
                [238, 64, '冒险者旅馆'],
                [33, 27, '冒险者旅馆 2楼'],
                [38, 8]
            ]))
            .then(()=>{
                return leo.loop(()=>{
                    itemCount = cga.getItemCount('蜗牛的包裹');
                    if(itemCount<times && !flag){
                        return retryRoutine();
                    }else{
                        return leo.reject();
                    }
                });
            })
        }
    })
    .then(()=>{//伊尔村
        if(cga.getItemCount('#700298')>0){
            return leo.logBack()
            .then(()=>leo.goto(n => n.teleport.yer))
            .then(()=>leo.autoWalkList([
                [45, 31, '芙蕾雅'],[684, 343]
            ]))
            .then(()=>{
                return leo.loop(()=>{
                    if(cga.getItemCount('#700298')>0){
                        return leo.talkNpc(686, 343, leo.talkNpcSelectorYes);
                        //cga.TurnTo(686, 343);
                        //return leo.delay(1000);
                    }else{
                        return leo.reject();
                    }
                });
            });
        }else{
            return leo.next();
        }
    })
    .then(()=>{//圣拉鲁卡村
        if(cga.getItemCount('#700299')>0){
            return leo.logBack()
            .then(()=>leo.goto(n => n.teleport.laruka))
            .then(()=>leo.autoWalkList([
                [52, 55, '芙蕾雅'],[136, 218]
            ]))
            .then(()=>{
                return leo.loop(()=>{
                    if(cga.getItemCount('#700299')>0){
                        return leo.talkNpc(136, 216, leo.talkNpcSelectorYes);
                        //cga.TurnTo(136, 216);
                        //return leo.delay(1000);
                    }else{
                        return leo.reject();
                    }
                });
            });
        }else{
            return leo.next();
        }
    })
    .then(()=>{//维诺亚村
        if(cga.getItemCount('#700338')>0){
            return leo.logBack()
            .then(()=>leo.goto(n => n.teleport.vinoy))
            .then(()=>leo.autoWalkList([
                [67, 46, '芙蕾雅'],[332, 481]
            ]))
            .then(()=>{
                return leo.loop(()=>{
                    if(cga.getItemCount('#700338')>0){
                        return leo.talkNpc(332, 483, leo.talkNpcSelectorYes);
                        //cga.TurnTo(332, 483);
                        //return leo.delay(1000);
                    }else{
                        return leo.reject();
                    }
                });
            });
        }else{
            return leo.next();
        }
    })
    .then(()=>{//奇利村
        if(cga.getItemCount('#700339')>0){
            return leo.logBack()
            .then(()=>leo.goto(n => n.teleport.kili))
            .then(()=>leo.autoWalkList([
                [59, 45, '索奇亚'],[276, 292]
            ]))
            .then(()=>{
                return leo.loop(()=>{
                    if(cga.getItemCount('#700339')>0){
                        return leo.talkNpc(278, 292, leo.talkNpcSelectorYes);
                        //cga.TurnTo(278, 292);
                        //return leo.delay(1000);
                    }else{
                        return leo.reject();
                    }
                });
            });
        }else{
            return leo.next();
        }
    })
    .then(()=>{//加纳村
        if(cga.getItemCount('#700340')>0){
            return leo.logBack()
            .then(()=>leo.goto(n => n.teleport.ghana))
            .then(()=>leo.autoWalkList([
                [47, 77, '索奇亚'],[704, 148]
            ]))
            .then(()=>{
                return leo.loop(()=>{
                    if(cga.getItemCount('#700340')>0){
                        //先判断要不要吃时水
                        var playerinfo = cga.GetPlayerInfo();
                        var clock = Math.floor(playerinfo.punchclock / 1000 / 3600);
                        if(clock<1){
                            //卡时不够1小时，先吃时水
                            var clockItems = cga.getInventoryItems().filter(item => {
                                return item.name.indexOf('时间水晶Lv') != -1;
                            });
                            if(clockItems && clockItems.length > 0){
                                cga.UseItem(clockItems[0].pos);
                                return leo.waitNPCDialog(dialog => {
                                    cga.ClickNPCDialog(4, -1)
                                    return leo.delay(2000);
                                })
                                .then(()=>leo.next());
                            }else{
                                return leo.log('卡时不足一小时，请手动换草')
                                .then(()=>leo.reject());
                            }
                        }else{
                            return leo.talkNpc(706, 148, leo.talkNpcSelectorYes);
                        }
                    }else{
                        return leo.log('已换完所有的包裹，请愉快地吃草吧~')
                        .then(()=>leo.reject());
                    }
                });
            });
        }else{
            return leo.next();
        }
    })
    .then(()=>leo.log('脚本结束'));

    var retryRoutine = () => {
        cga.TurnTo(38, 7);
        return leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(32, 0);
            return leo.next();
        })
        .then(()=>leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(32, 0);
            return leo.next();
        }))
        .then(()=>leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(4, 0);
            return leo.next();
        }))
        .then(()=>leo.waitNPCDialog(dialog => {
            if(dialog && dialog.message.indexOf('适当休息') >= 0){
                flag = true;
                return leo.reject();
            }
            cga.ClickNPCDialog(32, 0);
            return leo.next();
        }))
        .then(()=>leo.waitNPCDialog(dialog => {
            if(dialog && dialog.message.indexOf('伊尔村') >= 0 
                && dialog.message.indexOf('圣拉鲁卡村') >= 0 
                && dialog.message.indexOf('维诺亚村') >= 0 
                && dialog.message.indexOf('奇利村') >= 0 
                && dialog.message.indexOf('加纳村') >= 0){
                cga.ClickNPCDialog(32, 0);
                return leo.next();
            }else{
                return leo.reject();
            }
        }))
        .then(()=>leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(4, 0);
            return leo.next();
        }))
        .then(()=>leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(1, 0);
            return leo.next();
        }))
        .then(()=>{
            if(cga.getItemCount('蜗牛的包裹') > itemCount){
                itemCount++;
            }
            return leo.next();
        })
        .catch(()=>{});
    }
});