require('./common').then(async (cga) => {
	//leo.baseInfoPrint();
    leo.log('红叶の烧鉴定(家具)脚本，启动~');

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
        	//去补魔
        	await leo.goto(n => n.castle.x)
            await leo.autoWalk([34, 89])
        	await leo.supply(35, 88)
        }
        if(leo.getMapInfo().name != '哈丝塔的家'){
        	await leo.goto(n => n.asha.n)
            await leo.autoWalk([167,102,'哈丝塔的家'])
        }
        await leo.autoWalk([11,10])
        await leo.talkNpc(0,leo.talkYes)
        await leo.assessAll()
        await leo.dropItemEx(14668)
        await leo.dropItemEx(14669)
        await leo.dropItemEx(14670)
    }
    
    leo.loop(async ()=>{
        await task()
        await leo.delay(100)
    })
    .then(()=>leo.log('脚本结束'))

});