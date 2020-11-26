require('./common').then(async (cga) => {
	await leo.log('红叶の买800耐回力脚本，启动~')
	var task = async ()=>{
		var emptyIndexes = leo.getEmptyBagIndexes()
	    if(emptyIndexes && emptyIndexes.length > 0){
	        await leo.log('身上空位数量【'+emptyIndexes.length+'】')
	        await leo.goto(n=>n.falan.e2)
	        await leo.autoWalkList([[238,64,'冒险者旅馆'],[36,44]])
	        var npcPos = {x:0,y:0}
	        await leo.loop(async ()=>{
	        	var npc = cga.GetMapUnits().filter(u => (u.flags & leo.UnitFlags.NpcEntry) && u.model_id > 0 && u.unit_name == '约翰·荷里');
		        if(npc && npc.length>0){
		        	npcPos.x = npc[0].xpos;
		        	npcPos.y = npc[0].ypos;
		            await leo.autoWalk([npcPos.x,npcPos.y])
		            await leo.moveAround()
		            return leo.reject()
		        }
		        await leo.log('NPC没有出现，可能是还没到购买时间')
		       	return leo.delay(60000)
	        })
	        await leo.log('发现NPC【约翰·荷里】，所在坐标为('+npcPos.x+','+npcPos.y+')')
	        for (var i = 0; i < emptyIndexes.length; i++) {
	        	await leo.talkNpc(npcPos.x,npcPos.y,leo.talkNpcSelectorYes)
	        }
	        await leo.goto(n => n.falan.bank)
	        await leo.turnDir(0)
	        await leo.saveToBankAll('ㄑ型手里剑')
	        await leo.saveToBankAll('ㄟ型手里剑')
	        return leo.logBack()
	    }else{
	    	await leo.log('身上已没有空位，脚本结束');
	    	return leo.exit()
	    }
	}

    //循环
    leo.loop(async ()=>{
        try{
            await task();
        }catch(e){
            if(e == '脚本结束'){
                return leo.reject();
            }
            console.log(leo.logTime()+'脚本出错:'+e);
            console.log(leo.logTime()+'重新开始');
        }
    })
    
});