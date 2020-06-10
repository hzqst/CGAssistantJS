require('./common').then(cga=>{
	//leo.baseInfoPrint();

    //伊尔村
    var yer = true;
    //亚留特村
    var aleut = true;
    //圣拉鲁卡村
    var laruka = true;
    //维诺亚村
    var vinoy = true;
    //杰诺瓦镇
    var jenova = true;
    //阿巴尼斯村
    var abanis = true;
    //加纳村
    var ghana = true;

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var targetVillage = '';
    if(yer){
        targetVillage += '【伊尔村】';
    }
    if(aleut){
        targetVillage += '【亚留特村】';
    }
    if(laruka){
        targetVillage += '【圣拉鲁卡村】';
    }
    if(vinoy){
        targetVillage += '【维诺亚村】';
    }
    if(jenova){
        targetVillage += '【杰诺瓦镇】';
    }
    if(abanis){
        targetVillage += '【阿巴尼斯村】';
    }
    if(ghana){
        targetVillage += '【加纳村】';
    }

	leo.log('红叶の新城到各村开传脚本，启动~');
    leo.log('目标村子：'+targetVillage);

    leo.forceMoveEx = (orientation, times = 1) => {
        if  (times > 0) {
            cga.ForceMove(orientation, true);
            return leo.delay(500)
            .then(() => leo.waitAfterBattle())
            .then(() => leo.forceMoveEx(orientation, times - 1));
        }
        return leo.done();
    }

    leo.todo()
    .then(()=>{
        if(yer){
            return leo.logBack()
            .then(()=>leo.checkHealth())
            .then(()=>leo.supplyCastle())
            .then(()=>leo.log('红叶の自动开传脚本，当前目标村子【伊尔村】'))
            .then(()=>leo.goto(n=>n.falan.eout))
            .then(()=>leo.autoWalkList([
                [681,343,'伊尔村'],[47,83,'村长的家'],[14,17,'伊尔村的传送点'],[20,11]
            ]))
            .then(()=>leo.talkNpc(7,leo.talkNpcSelectorYes))
            .then(()=>leo.log('伊尔村开启传送完成了哦!'))
            .then(()=>leo.logBack());
        }
    })
    .then(()=>{
        if(aleut){
            return leo.logBack()
            .then(()=>leo.checkHealth())
            .then(()=>leo.supplyCastle())
            .then(()=>leo.log('红叶の自动开传脚本，当前目标村子【亚留特村】'))
            .then(()=>leo.goto(n=>n.falan.eout))
            .then(()=>leo.autoWalkList([
                [672,223,'哈巴鲁东边洞穴 地下1楼'],[41,8,'哈巴鲁东边洞穴 地下2楼'],[17,20]
            ]))
            .then(()=>leo.forceMoveEx(6,4))
            .then(()=>leo.autoWalkList([
                [16,11,'哈巴鲁东边洞穴 地下1楼'],[30,4,'芙蕾雅'],[596,84,'亚留特村'],[56,48,'村长的家'],[22,9,'亚留特村的传送点'],[5,13]
            ]))
            .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes))
            .then(()=>leo.log('亚留特村开启传送完成了哦!'))
            .then(()=>leo.logBack());
        }
    })
    .then(()=>{
        if(laruka){
            return leo.logBack()
            .then(()=>leo.checkHealth())
            .then(()=>leo.supplyCastle())
            .then(()=>leo.log('红叶の自动开传脚本，当前目标村子【圣拉鲁卡村】'))
            .then(()=>leo.goto(n=>n.falan.wout))
            .then(()=>leo.autoWalkList([
                [134,219,'圣拉鲁卡村'],[49,81,'村长的家'],[8,10,'圣拉鲁卡村的传送点'],[15,4]
            ]))
            .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
            .then(()=>leo.log('圣拉鲁卡村开启传送完成了哦!'))
            .then(()=>leo.logBack());
        }
    })
    .then(()=>{
        if(vinoy){
            return leo.logBack()
            .then(()=>leo.checkHealth())
            .then(()=>leo.supplyCastle())
            .then(()=>leo.log('红叶の自动开传脚本，当前目标村子【维诺亚村】'))
            .then(()=>leo.goto(n=>n.falan.sout))
            .then(()=>leo.autoWalk([473,316]))
            .then(()=>leo.talkNpc(4,leo.talkNpcSelectorYes,'维诺亚洞穴 地下1楼'))
            .then(()=>leo.autoWalkList([
                [20,59,'维诺亚洞穴 地下2楼'],[24,81,'维诺亚洞穴 地下3楼'],[26,64,'芙蕾雅'],[330,480,'维诺亚村'],[40,36,'村长的家'],[18,10,'村长家的小房间'],[8,2,'维诺亚村的传送点'],[5,3]
            ]))
            .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
            .then(()=>leo.log('维诺亚村开启传送完成了哦!'))
            .then(()=>leo.logBack());
        }
    })
    .then(()=>{
        if(jenova){
            return leo.logBack()
            .then(()=>leo.checkHealth())
            .then(()=>leo.supplyCastle())
            .then(()=>leo.log('红叶の自动开传脚本，当前目标村子【杰诺瓦镇】'))
            .then(()=>leo.goto(n=>n.falan.wout))
            .then(()=>leo.autoWalk([200,165]))
            .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'莎莲娜海底洞窟 地下1楼'))
            .then(()=>leo.autoWalkList([
                [20,8,'莎莲娜海底洞窟 地下2楼'],[11,9,'莎莲娜海底洞窟 地下1楼'],[24,11,'莎莲娜'],[217,455,'杰诺瓦镇'],[58,43,'村长的家'],[13,7,'杰诺瓦镇的传送点'],[7,8]
            ]))
            .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
            .then(()=>leo.log('杰诺瓦镇开启传送完成了哦!'))
            .then(()=>leo.logBack());
        }
    })
    .then(()=>{
        if(abanis){
            return leo.logBack()
            .then(()=>leo.checkHealth())
            .then(()=>leo.supplyCastle())
            .then(()=>leo.log('红叶の自动开传脚本，当前目标村子【阿巴尼斯村】'))
            .then(()=>{
                return leo.goto(n=>n.castle.teleport)
                .then(()=>leo.autoWalk([15, 4]))
                .then(()=>leo.talkNpc(16, 4, leo.talkNpcSelectorYes))
                .then(()=>leo.delay(3000))
                .then(()=>{
                    var mapInfo = cga.getMapInfo();
                    if(mapInfo.name == '启程之间'){
                        return leo.logBack()
                        .then(()=>leo.goto(n=>n.falan.wout))
                        .then(()=>leo.autoWalk([200,165]))
                        .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'莎莲娜海底洞窟 地下1楼'))
                        .then(()=>leo.autoWalkList([
                            [20,8,'莎莲娜海底洞窟 地下2楼'],[11,9,'莎莲娜海底洞窟 地下1楼'],[24,11,'莎莲娜']
                        ]));
                    }else{
                        return leo.autoWalkList([
                            [14,6,'村长的家'],[1,9,'杰诺瓦镇'],[24,40,'莎莲娜']
                        ]);
                    }
                })
            })
            .then(()=>leo.autoWalkList([
                [235,338,'莎莲娜西方洞窟'],[45,9,14001],[57,13,14002],[36,7,'莎莲娜'],[183,161,'阿巴尼斯村'],[36,54,'村长的家'],[6,5,4313],[9,9,'阿巴尼斯村的传送点'],[5,14]
            ]))
            .then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes))
            .then(()=>leo.log('阿巴尼斯村开启传送完成了哦!'))
            .then(()=>leo.logBack());
        }
    })
    .then(()=>{
        if(ghana){
            return leo.logBack()
            .then(()=>leo.checkHealth())
            .then(()=>leo.supplyCastle())
            .then(()=>leo.log('红叶の自动开传脚本，当前目标村子【加纳村】'))
            .then(()=>{
                return leo.goto(n=>n.castle.teleport)
                .then(()=>leo.autoWalk([8, 33]))
                .then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes))
                .then(()=>leo.delay(3000))
                .then(()=>{
                    var mapInfo = cga.getMapInfo();
                    if(mapInfo.name == '启程之间'){
                        return leo.log('没有开奇利村传送，无法直接去加纳村开传!请先开好奇利村传送')
                        .then(()=>leo.reject());
                    }
                })
            })
            .then(()=>leo.autoWalkList([
                [7,6,'*'],[7,1,'*'],[1,8,'奇利村'],[79,76,'索奇亚'],[356,334,'角笛大风穴'],[133,26,'索奇亚'],[704,147,'加纳村'],[36,40,'村长的家'],[17,6,'加纳村的传送点'],[14,7]
            ]))
            .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
            .then(()=>leo.log('加纳村开启传送完成了哦!'))
            .then(()=>leo.logBack());
        }
    })
    .then(()=>leo.log('红叶の新城到各村开传脚本执行完毕!脚本结束'))
    .catch(console.log);
});