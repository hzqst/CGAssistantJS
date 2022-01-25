require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    const flag = {
        player : true,
        pet : true,
        item : true,
        npcOrEntry :　true,
    }
    const seconds = 10;
    leo.UnitFlags.Pet = 512;

    const log = (context) => {
        // console.log(leo.logTime()+context);
        console.log(context);
    }

    await leo.loop(async () => {
        console.log(leo.logTime()+'=============================================>');
        //1.周围的玩家
        if(flag.player){
            const nearPlayers = cga.GetMapUnits().filter(u=>u.flags&leo.UnitFlags.Player);
            log('【附近的玩家】:'+nearPlayers.length);
            for (var i = 0; i < nearPlayers.length; i++) {
                const player = nearPlayers[i];
                const index = i + 1;
                log(index.toString().padStart(3, ' ')+'.[Lv.'+player.level.toString().padStart(3, ' ')+'] ('+player.xpos.toString().padStart(3, ' ')+','+player.ypos.toString().padStart(3, ' ')+') ['+player.unit_name+']');
                //console.log(player)
            }
        }
        //2.周围的宠物
        if(flag.pet){
            const nearPets = cga.GetMapUnits().filter(u=>u.flags&leo.UnitFlags.Pet);
            log('【附近的宠物】:'+nearPets.length);
            for (var i = 0; i < nearPets.length; i++) {
                const pet = nearPets[i];
                const index = i + 1;
                log(index.toString().padStart(3, ' ')+'.[Lv.'+pet.level.toString().padStart(3, ' ')+'] ('+pet.xpos.toString().padStart(3, ' ')+','+pet.ypos.toString().padStart(3, ' ')+') ['+pet.unit_name+']('+pet.nick_name+')');
                //console.log(pet)
            }
        }
        //3.周围的物品
        if(flag.item){
            const nearItems = cga.GetMapUnits().filter(u=>u.flags&leo.UnitFlags.Item);
            log('【附近的物品】:'+nearItems.length);
            for (var i = 0; i < nearItems.length; i++) {
                const item = nearItems[i];
                const index = i + 1;
                log(index.toString().padStart(3, ' ')+'.('+item.xpos.toString().padStart(3, ' ')+','+item.ypos.toString().padStart(3, ' ')+') ['+item.item_name+']');
                //console.log(item)
            }
        }
        //4.周围的NPC或者迷宫水晶
        if(flag.npcOrEntry){
            const nearNpcOrEntrys = cga.GetMapUnits().filter(u=>u.flags&leo.UnitFlags.NpcEntry && u.model_id > 0 && u.level == 1);
            log('【附近的NPC或者迷宫水晶】:'+nearNpcOrEntrys.length);
            for (var i = 0; i < nearNpcOrEntrys.length; i++) {
                const npcOrEntry = nearNpcOrEntrys[i];
                const index = i + 1;
                log(index.toString().padStart(3, ' ')+'.('+npcOrEntry.xpos.toString().padStart(3, ' ')+','+npcOrEntry.ypos.toString().padStart(3, ' ')+') ['+npcOrEntry.unit_name +']');
                //console.log(npcOrEntry)
            }
        }
        await leo.delay(1000*seconds)
    })

    await leo.log('脚本结束')
});
