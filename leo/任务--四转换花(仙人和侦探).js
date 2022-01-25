require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    //leo.baseInfoPrint();
    leo.log('红叶の四转换花(仙人和侦探)任务脚本，启动~');

    var task = async () => {
        if(cga.GetMapXY().x == 95 && cga.GetMapXY().y == 82){
            if(leo.has('仙花') || leo.has('侦探眼镜')) {
                return;
            }
            await leo.autoWalk([91,85])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 84 && cga.GetMapXY().y == 132){
            await leo.autoWalk([120,124])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 133 && cga.GetMapXY().y == 72){
            await leo.autoWalk([144,88])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 54 && cga.GetMapXY().y == 96){
            await leo.autoWalk([52,56])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 81 && cga.GetMapXY().y == 163){
            await leo.autoWalk([120,124])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 93 && cga.GetMapXY().y == 140){
            await leo.autoWalk([96,108])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 93 && cga.GetMapXY().y == 56){
            await leo.autoWalk([96,84])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 152 && cga.GetMapXY().y == 108){
            await leo.autoWalk([88,112])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 108 && cga.GetMapXY().y == 108){
            if(cga.GetPlayerInfo().job=='大侦探'){
                await leo.autoWalk([114,114])
                await leo.turnDir(0)
                await leo.turnDir(0)
            }
            await leo.autoWalk([108,124])
            return leo.turnDir(0)
        }
        if(cga.GetMapXY().x == 109 && cga.GetMapXY().y == 92){
            if(cga.GetPlayerInfo().job=='仙人'){
                await leo.autoWalk([114,85])
                await leo.turnDir(0)
                await leo.turnDir(0)
            }
            await leo.autoWalk([108,76])
            return leo.turnDir(0)
        }
    }

    leo.loop(async()=>{
        if(leo.has('仙花') || leo.has('侦探眼镜') 
            && cga.GetMapXY().x == 95 && cga.GetMapXY().y == 82){
            await leo.log('已获得任务道具')
            await leo.autoWalk([94,78])
            await leo.talkNpc(0,leo.talkYes)
            await leo.autoWalk([98,15])
            await leo.talkNpc(0,leo.talkYes)
            return leo.reject();
        }
        await task()
        await leo.delay(1000)
    })
    
});