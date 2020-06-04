require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.log('红叶の开箱子(T8)脚本，启动~');

    var count = 0;//开箱子数
    var type = '铜钥匙';
    var keyPosition = {
        '铜钥匙' : [
            [102,50],[67,105],[121,129],[125,146]
        ]
    }

    leo.todo()
    .then(()=>{
        return leo.loop(()=>{
            var mapInfo = cga.getMapInfo();
            if(mapInfo.name == '里谢里雅堡' || (mapInfo.name == '法兰城')){
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
                return leo.autoWalk([108,51])
                .then(()=>leo.supplyDir(2))
                .then(()=>leo.autoWalk([108,39,'雪拉威森塔１层']));
            }
            if(mapInfo.name == '雪拉威森塔１层'){
                return leo.autoWalk([76,58,'雪拉威森塔１０层']);
            }
            if(mapInfo.name == '雪拉威森塔１０层'){
                return leo.autoWalk([56,25,'雪拉威森塔９层']);
            }
            if(mapInfo.name == '雪拉威森塔９层'){
                return leo.autoWalkList([[129,61],[130,61],[130,63],[132,63],[132,67,'雪拉威森塔８层']]);
            }
            if(mapInfo.name == '雪拉威森塔８层'){
                return leo.reject();
            }
            return leo.delay(2000);
        });
    })
    .then(()=>{
        var index = 0;
        return leo.loop(()=>{
            if(cga.getItemCount(type)<=0){
                leo.log('身上已经没有【'+type+'】，脚本结束');
                return leo.reject();
            }

            if(index<keyPosition[type].length){
                var pos = keyPosition[type][index];
                index++;
                var keyCount = cga.getItemCount(type);
                return leo.autoWalk([pos[0],pos[1]])
                .then(()=>leo.moveAround())
                .then(()=>leo.turnTo(pos[0],pos[1]))
                .then(()=>leo.delay(2000))
                .then(()=>leo.useItemEx(type))
                .then(()=>leo.waitAfterBattle())
                .then(()=>{
                    if(cga.getItemCount(type)<keyCount){
                        count++;
                        return leo.log('红叶の开箱子(T8)脚本：找到箱子('+pos[0]+','+pos[1]+')，已开箱子数：【'+count+'】');
                    }else{
                        return leo.log('红叶の开箱子(T8)脚本：没有找到箱子('+pos[0]+','+pos[1]+')');
                    }
                });
            }else{
                index = 0;
                return leo.next();
            }
        });
    })
    .catch(()=>leo.log('脚本结束'));
});