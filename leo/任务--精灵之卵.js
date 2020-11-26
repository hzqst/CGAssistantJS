require('./common').then(async (cga) => {
	//leo.baseInfoPrint();
	var target = 3;//1-地，2-水，3-火，4-风

	if(target<1 || target>4){
		target = 3;
	}
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };

    var targetName = ['','地','水','火','风'];
    leo.log('红叶の精灵之卵任务脚本，启动~');
    leo.log('目标是获取【'+targetName[target]+'】属性的精灵之卵LV3');

    if(leo.has('地之卵LV3')){
        leo.log('身上已经有【地之卵LV3】，脚本结束');
        return;
    }
    if(leo.has('水之卵LV3')){
        leo.log('身上已经有【水之卵LV3】，脚本结束');
        return;
    }
    if(leo.has('火之卵LV3')){
        leo.log('身上已经有【火之卵LV3】，脚本结束');
        return;
    }
    if(leo.has('风之卵LV3')){
        leo.log('身上已经有【风之卵LV3】，脚本结束');
        return;
    }

    var task = async ()=>{
        if(cga.getMapInfo().name == '艾尔莎岛'){
            await leo.checkHealth(prepareOptions.doctorName)
        }
        if(cga.getMapInfo().name != '神殿　里侧大厅'){
            await leo.logBack()
            await leo.autoWalkList([
                [201,96,'神殿　伽蓝'],[95,104,'神殿　前廊'],
                [44,41,'神殿　里侧大厅']
            ])
        }
        await leo.autoWalk([32,30])
        await leo.talkNpc(6,leo.talkNpcSelectorYes)

        if(leo.has('空之卵LV1')||leo.has('空之卵LV2')||leo.has('空之卵LV3')){
            console.log('获取到【空之卵】，出发换取【'+targetName[target]+'之卵】')
        }else{
            return leo.reject('请先手动丢弃身上的水晶，否则获取不到空之卵LV1，任务无法继续')
        }
        await leo.autoWalk([17,33,'精灵之下宫'])
        //选择不同的属性地图
        if(target == 1){
            await leo.autoWalk([103,65])
            await leo.talkNpc(2,leo.talkNpcSelectorYes,'威雷之领域　玄关')
        }
        if(target == 2){
            await leo.autoWalk([80,64])
            await leo.talkNpc(2,leo.talkNpcSelectorYes,'花萝之领域　玄关')
        }
        if(target == 3){
            await leo.autoWalk([104,88])
            await leo.talkNpc(2,leo.talkNpcSelectorYes,'阿陀罗的领域　玄关')
        }
        if(target == 4){
            await leo.autoWalk([81,87])
            await leo.talkNpc(2,leo.talkNpcSelectorYes,'恩·凯之领域　玄关')
        }
        await leo.autoWalk([90,45,'*'])
        await leo.autoWalk([64,54])
        await leo.talkNpc(7,leo.talkNpcSelectorYes)
        await leo.autoWalkList([
            [45,95,'*'],[118,128]
        ])
        await leo.talkNpc(6,leo.talkNpcSelectorYes)
        await leo.autoWalkList([
            [166,79,'*'],[68,51]
        ])
        await leo.talkNpc(0,leo.talkNpcSelectorYes)
        await leo.waitAfterBattle()
        await leo.talkNpc(6,leo.talkNpcSelectorYes)
    }

    leo.loop(async ()=>{
        try{
            if(leo.has('地之卵LV3')){
                leo.log('身上已经有【地之卵LV3】');
                return leo.reject('脚本结束');
            }else if(leo.has('水之卵LV3')){
                leo.log('身上已经有【水之卵LV3】');
                return leo.reject('脚本结束');
            }else if(leo.has('火之卵LV3')){
                leo.log('身上已经有【火之卵LV3】');
                return leo.reject('脚本结束');
            }else if(leo.has('风之卵LV3')){
                leo.log('身上已经有【风之卵LV3】');
                return leo.reject('脚本结束');
            }else{
                await task()
            }
            await leo.delay(2000);
        }catch(e){
            if(e == '脚本结束'){
                return leo.reject();
            }
            console.log(leo.logTime()+'任务出错:'+e);
            await leo.delay(10000)
            console.log(leo.logTime()+'重新开始');
        }
    })
    .then(()=>leo.log('脚本结束'))

});