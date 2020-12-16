require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.log('红叶の学虚死为上技能脚本，启动~');
	if(cga.getItemCount('王冠')==0){
        leo.log('身上没有【王冠】，脚本结束');
        return;
    }
    if(cga.getItemCount('王冠')>1){
        leo.log('身上的【王冠】只能带1个，多余的请先存银行，脚本结束');
        return;
    }

    var gotoNpc = ()=>{
        return leo.todo()
        .then(()=>{
            return leo.loop(()=>{
                var mapInfo = cga.getMapInfo();
                if(mapInfo.name == '里谢里雅堡' || mapInfo.name == '法兰城'){
                    return leo.logBack();
                }
                if(mapInfo.name == '艾尔莎岛'){
                    return leo.autoWalk([165,153])
                    .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'));
                }
                if(mapInfo.name == '利夏岛'){
                    return leo.autoWalk([90,99,'国民会馆']);
                }
                if(mapInfo.name == '国民会馆'){
                    return leo.autoWalk([108,39,'雪拉威森塔１层']);
                }
                if(mapInfo.name == '雪拉威森塔１层'){
                    return leo.autoWalk([34,95])
                    .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'辛梅尔'));
                }
                if(mapInfo.name == '辛梅尔'){
                    return leo.autoWalk([181,81,'公寓'])
                    .then(()=>leo.autoWalk([89,58]))
                    .then(()=>leo.supply(89,57))
                    .then(()=>leo.autoWalk([100,70,'辛梅尔']))
                    .then(()=>leo.autoWalk([207,91,'光之路']));
                }
                if(mapInfo.name == '光之路'){
                	return leo.autoWalk([214,194])
                    .then(()=>leo.talkNpc(0, leo.talkNpcSelectorYes))
                    .then(()=>leo.autoWalk([227,202,'*']))
                    .then(()=>leo.autoWalk([224,78]))
                    .then(()=>leo.reject());//退出循环，进入下一步
                }
                return leo.delay(2000);
            });
        })
    }

    var task = async () => {
        await gotoNpc()
        console.log('到达目标地点！请自行手动学习技能~~')
    }

    task();
});