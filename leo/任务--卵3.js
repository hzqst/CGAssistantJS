require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    leo.monitor.config.keepAlive = false;

    var taskIndex = 1;
    var doctorName = '医道之殇';
    var json = '一条龙小号.json';
    leo.log('红叶の卵3脚本，本脚本只支持单人启动~');

    var task1 = async () => {
        await leo.waitAfterBattle()
        if(cga.getItemCount('琥珀之卵')==0){
            await leo.logBack()
            await leo.autoWalkList([
                [201,96,'神殿　伽蓝'],[95,80,'神殿　前廊'],[44,41,59531],
                [34,34,59535],[48,60,'约尔克神庙'],[39,22]
            ])
            await leo.loop(async ()=>{
                if(cga.getItemCount('琥珀之卵')>0){
                    return leo.reject();   //退出loop循环
                }else{
                    if(leo.getSysTimeEx() == '黄昏' || leo.getSysTimeEx() == '夜晚'){
                        await leo.talkNpc(6,leo.talkNpcSelectorYes)
                        await leo.talkNpc(6,leo.talkNpcSelectorYes)
                        await leo.talkNpc(6,leo.talkNpcSelectorYes)
                    }else{
                        await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【黄昏或夜晚】')
                    }
                }
                return await leo.delay(30000);
            })
        }
        taskIndex++;
        await leo.logBack()
    }

    var task2 = async () => {
        await leo.waitAfterBattle()
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.checkHealth(doctorName)
        await leo.panel.escape()
        await leo.autoWalkList([[165, 153]]) 
        await leo.loop(async ()=>{
            if(cga.GetMapName()=='梅布尔隘地') {
                return leo.reject();
            }
            await leo.talkNpc(2, leo.talkNpcSelectorNo) 
            await leo.delay(2000)
        })
        await leo.autoWalkList([[169, 120]]) 
        //await leo.panel.egg()
        await leo.panel.load(json);
        await leo.loop(async ()=>{
            if(cga.isInBattle()) {
                return leo.reject();
            }
            await leo.talkNpc(0, leo.talkNpcSelectorNo)
            await leo.delay(1000)
        })
        await leo.waitAfterBattle()
        if(cga.getItemCount('魔导书抄本')>=0){
            taskIndex++;
        }
    }

    var task3 = async ()=>{
        await leo.waitAfterBattle()
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        
        await leo.checkHealth(doctorName)
        await leo.panel.escape()
        await leo.autoWalkList([[130, 50, '盖雷布伦森林'], [244, 73]])
        await leo.talkNpc(0, leo.talkNpcSelectorYes) 
        await leo.talkNpc(0, leo.talkNpcSelectorYes) 
        await leo.talkNpc(0, leo.talkNpcSelectorYes) 
        taskIndex++;
    }

    var task4 = async ()=>{
        await leo.waitAfterBattle()
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        
        await leo.autoWalkList([
            [201,96,'神殿　伽蓝'],[91,138]
        ])
        await leo.loop(async ()=>{
            if(cga.findNPC('荷特普')){
                await leo.talkNpc(92, 138,leo.talkNpcSelectorYes)
                await leo.talkNpc(92, 138,leo.talkNpcSelectorYes)
                await leo.talkNpc(92, 138,leo.talkNpcSelectorYes)
                return leo.reject();//退出循环
            }else{
                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待黄昏或夜晚【荷特普】出现');
                await leo.delay(30000);
            }
        })
        taskIndex++;
    }

    var task5 = async ()=>{
        await leo.waitAfterBattle()
        await leo.goto(n =>n.asha.w) 
        await leo.autoWalkList([[102, 115, '冒险者旅馆'], [56, 32]]) 
        await leo.talkNpc(6, leo.talkNpcSelectorYes) 
        await leo.talkNpc(6, leo.talkNpcSelectorYes) 
        await leo.talkNpc(6, leo.talkNpcSelectorYes) 
        taskIndex++;
    }

    var task6 = async ()=>{
        var targetFinder = (units) =>{ //发现NPC
            return units.find(u =>u.unit_name == '纳塞' && u.type == 1);
        }
        var todo = async (target) =>{　 　　
            //走向NPC对话传送退出　　
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='？？？') {
                    return leo.reject();
                }
                await leo.talkNpc(target.xpos, target.ypos, leo.talkNpcSelectorYes)
                await leo.delay(2000)
            })
        }
        await leo.waitAfterBattle()
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.checkHealth(doctorName)
        await leo.panel.escape()
        await leo.autoWalkList([[165, 153]])
        await leo.loop(async ()=>{
            if(cga.GetMapName()=='梅布尔隘地') {
                return leo.reject();
            }
            await leo.talkNpc(2, leo.talkNpcSelectorNo)
            await leo.delay(2000)
        })
        await leo.autoWalkList([[256, 166, '布拉基姆高地'], [203, 265]])
        await leo.loop(async()=>{
            if(cga.getMapInfo().name.indexOf('虫洞地下') != -1){
                return leo.reject();
            }
            await leo.autoWalk([203, 266])
            var objs = cga.getMapObjects();
            var entrance = objs.find((obj)=>{
                return (obj.cell == 3 && obj.mapx >= 197 && obj.mapx <= 207 && obj.mapy >= 260 && obj.mapy <= 270);
            });
            if(entrance){
                await leo.autoWalkList([[entrance.x, entrance.y, '*']])
            }
            return leo.delay(2000);
        })

        await leo.lookForNpc(targetFinder, todo, false)
        if(cga.getMapInfo().name == '布拉基姆高地'){
            //迷宫刷新
            return leo.log('迷宫刷新');
        }
        await leo.delay(2000)
        console.log(leo.logTime()+'到达'+cga.getMapInfo().name);
        // await leo.panel.egg()
        await leo.panel.load(json);
        await leo.autoWalk([195, 33])
        await leo.talkNpc(195, 32, leo.talkNpcSelectorYes)
        await leo.waitAfterBattle()
        await leo.delay(1000)
        await leo.autoWalk([229, 67])
        await leo.talkNpc(229, 66, leo.talkNpcSelectorYes)
        await leo.waitAfterBattle()
        await leo.autoWalk([230, 57, '布拉基姆高地'])
        taskIndex++;
    }

    var task7 = async ()=>{
        await leo.waitAfterBattle()
        await leo.panel.escape()
        if(cga.GetMapName()!='布拉基姆高地'){
            if(cga.GetMapName()!='艾尔莎岛'){
                await leo.logBack()
                await leo.delay(1000)
                if(cga.GetMapName()!='艾尔莎岛'){
                    return leo.log('必须先定居新城【艾尔莎岛】');
                }
            }
            await leo.checkHealth(doctorName)
            await leo.autoWalkList([[165, 153]])
            await leo.loop(async ()=>{
                if(cga.GetMapName()=='梅布尔隘地') {
                    return leo.reject();
                }
                await leo.talkNpc(2, leo.talkNpcSelectorNo)
                await leo.delay(2000)
            })
            await leo.autoWalkList([[256, 166, '布拉基姆高地'], [203, 265]])
        }
        await leo.loop(async()=>{
            if(cga.getMapInfo().name.indexOf('虫洞地下') != -1){
                return leo.reject();
            }
            await leo.autoWalk([203, 266])
            var objs = cga.getMapObjects();
            var entrance = objs.find((obj)=>{
                return (obj.cell == 3 && obj.mapx >= 197 && obj.mapx <= 207 && obj.mapy >= 260 && obj.mapy <= 270);
            });
            if(entrance){
                await leo.autoWalkList([[entrance.x, entrance.y, '*']])
            }
            return leo.delay(2000);
        })

        await leo.walkRandomMazeUntil(() =>{
            if (cga.getMapInfo().indexes.index3 == 59714 
                || cga.getMapInfo().name == '布拉基姆高地') {
                return true;
            }
            return false;
        },false)
        if(cga.getMapInfo().name == '布拉基姆高地'){
            //迷宫刷新
            return leo.log('迷宫刷新');
        }

        await leo.autoWalk([50, 114])
        //await leo.panel.egg()
        await leo.panel.load(json);
        await leo.loop(async ()=>{
            if(cga.findNPC('安洁可')){
                await leo.talkNpc(50, 113, leo.talkNpcSelectorYes)
                await leo.delay(2000)
                if(cga.isInBattle()) {
                    return leo.reject();//退出循环
                }
            }else{
                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待夜晚或清晨【安洁可】出现');
                await leo.delay(30000);
            }
        })
        await leo.waitAfterBattle()
        await leo.autoWalk([131, 101])
        await leo.loop(async ()=>{
            if(cga.GetMapName()=='布拉基姆高地') {
                return leo.reject();
            }
            await leo.talkNpc(131, 100, leo.talkNpcSelectorYes)
            await leo.delay(2000)
        })
        taskIndex++;
    }

    leo.loop(async ()=>{
        try{
            if(taskIndex == 1){
                await task1()
            }
            if(taskIndex == 2){
                await task2()
            }
            if(taskIndex == 3){
                await task3()
            }
            if(taskIndex == 4){
                await task4()
            }
            if(taskIndex == 5){
                await task5()
            }
            if(taskIndex == 6){
                await task6()
            }
            if(taskIndex == 7){
                await task7()
            }
            if(taskIndex >= 8){
                await leo.log('任务已完成')
                return leo.reject();//退出循环
            }
            return leo.delay(1000);
        }catch(e){
            console.log(leo.logTime()+'任务出错:'+e);
            await leo.delay(10000)
            console.log(leo.logTime()+'重新开始');
        }
    })
    .then(()=>leo.log('脚本结束'))
    
});