require('./common').then(async (cga) => {
	//leo.baseInfoPrint();
    leo.log('红叶の烧鉴定(鱼)脚本，启动~');

    var target = 10;
    var minMp = 100;

    var playerinfo = cga.GetPlayerInfo();

    var skillName = '鉴定';
    var level = 0;
    if(!cga.findPlayerSkill(skillName)){
        console.error('提示：没有'+skillName+'技能！');
        return;
    }

    var task = async ()=>{
    	var skill = cga.findPlayerSkill(skillName);
        if(target <= skill.lv){
            leo.log('红叶の烧'+skillName+'脚本，提示：技能【'+skillName+'】等级已达到【'+skill.lv+'】，达到或者超过了预设的目标等级【'+target+'】，脚本结束');
            return leo.reject();
        }
        if(cga.GetPlayerInfo().mp <= minMp){
        	//去医院补魔
        	if(leo.getMapInfo().name == '拿潘食品店'){
        		await leo.autoWalkList([
        			[3,13,'法兰城'],[221,83,'医院'],[8,31]
        		])
        	}else{
        		await leo.goto(n => n.falan.ehospital)
        		await leo.autoWalk([8,31])
        	}
        	await leo.supply(8, 30)
    		await leo.autoWalkList([
    			[12,42,'法兰城'],[217,53,'拿潘食品店'],[10,14]
    		])
        }
        if(leo.getMapInfo().name != '拿潘食品店'){
        	await leo.goto(n => n.falan.e2)
	    	await leo.autoWalk([217,53,'拿潘食品店'])
        }
        await leo.autoWalk([10,14])
        await leo.talkNpc(0,leo.talkYes)
        await leo.assessAll()
        await leo.dropItemEx(18184)
    }


    leo.loop(async ()=>{
        await task()
        await leo.delay(100)
    })
    .then(()=>leo.log('脚本结束'))

    
});