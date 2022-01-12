require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    
    var taskIndex = 1;

    leo.monitor.config.keepAlive = false;
    var doctorName = '医道之殇';
    leo.log('红叶の卵1脚本，本脚本只支持单人启动~');

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
                    }else{
                        await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【黄昏或夜晚】')
                    }
                }
                return await leo.delay(30000);
            })
        }
        if(cga.GetMapName()!='艾尔莎岛'){
            await leo.logBack()
            await leo.delay(1000)
            if(cga.GetMapName()!='艾尔莎岛'){
                return leo.log('必须先定居新城【艾尔莎岛】');
            }
        }
        await leo.autoWalk([157,93])
        await leo.turnDir(0)
        await leo.delay(1000)
        await leo.autoWalkList([
            [102,115,'冒险者旅馆'],[30,21]
        ])
        await leo.turnDir(6)
        await leo.say('安登')
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(4, -1);
            return leo.delay(1000);
        })
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(1, -1);
            return leo.delay(1000);
        })
        await leo.say('贝尔达')
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(4, -1);
            return leo.delay(1000);
        })
        await leo.waitNPCDialog(dialog => {
            cga.ClickNPCDialog(1, -1);
            return leo.delay(1000);
        })
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
        await leo.autoWalk([157,93])
        await leo.turnDir(0)
        await leo.delay(1000)
        await leo.autoWalkList([[133, 77, '查尔博士的家'], [10, 12]]) 
        await leo.loop(async ()=>{
            if(cga.getItemCount('查尔的介绍信')>0){
                return leo.reject();   //退出loop循环
            }else{
                if(leo.getSysTimeEx() == '黄昏' || leo.getSysTimeEx() == '夜晚'){
                    await leo.talkNpc(0,leo.talkNpcSelectorYes)
                }else{
                    await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【黄昏或夜晚】')
                }
            }
            return await leo.delay(30000);
        })
        taskIndex++;
        await leo.logBack()
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
        await leo.autoWalkList([[130, 50, '盖雷布伦森林'], [246, 76, '路路耶博士的家'], [7, 8]])
        await leo.panel.egg()
        await leo.talkNpc(0, leo.talkNpcSelectorYes) 
        await leo.waitAfterBattle() 
        await leo.delay(1000) 
        await leo.autoWalkList([[3, 10, '盖雷布伦森林']]) 
        await leo.delay(1000) 
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
            if(taskIndex >= 4){
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