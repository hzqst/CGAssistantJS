require('./common').then(async (cga) => {
    //leo.baseInfoPrint();
    leo.log('红叶の兽王学完美调教脚本，启动~');
    var skillName = '完美调教术';
    if(cga.findPlayerSkill(skillName)){
        console.error('提示：已经学有【'+skillName+'】技能！');
        return;
    }
    var playerInfo = cga.GetPlayerInfo();
	if(playerInfo.job != '兽王'){
		console.error('提示：职业必须是5转【兽王】！');
        return;
	}
	if(playerInfo.gold<=100000){
		console.error('提示：身上的魔币不足，请至少准备10W！');
        return;
	}

	if(cga.GetMapName()!='圣骑士营地'){
		await leo.goto(n => n.camp.x)
	}
	await leo.autoWalk([116,69,'总部1楼'])
	await leo.autoWalk([41,72])
	await leo.learnPlayerSkill(41,71)
	if(cga.findPlayerSkill(skillName)){
        await leo.log('提示：已经完成【'+skillName+'】技能学习！');
    } else{
    	await leo.log('已到达位置，请检查技能是否已经学习')
    }
	
});