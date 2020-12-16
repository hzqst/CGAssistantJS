require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.say('红叶の护士烧急救脚本，启动~');
	var itemName = '血之耳环的仿造品'
	var playerinfo = cga.GetPlayerInfo();

	var pos = [33, 90];
	var minMp = 100;

	var skillName = '急救';
	var skillLevel = 11;
	var skill = cga.findPlayerSkill(skillName);

	var takeOff = ()=>{
		playerinfo = cga.GetPlayerInfo();
		if (playerinfo.hp == playerinfo.maxhp) {
			//脱下装备
			var item = cga.getEquipItems().filter(equip => {
                if(equip.name == itemName){
                    return true;
                }
            });
            if(item && item.length > 0){
            	var emptyIndex = leo.getEmptyBagIndexes();
            	if(emptyIndex && emptyIndex.length > 0){
            		cga.MoveItem(item[0].pos, emptyIndex[0], -1);
            	}
            }
            return leo.delay(1000);
		}
	}

	var putOn = ()=>{
		playerinfo = cga.GetPlayerInfo();
		if (playerinfo.hp == playerinfo.maxhp) {
			//穿上装备
			var item = cga.getInventoryItems().filter(equip => {
                if(equip.name == itemName){
                    return true;
                }
            });
            if(item && item.length > 0){
            	cga.UseItem(item[0].pos);
            }
            return leo.delay(1000);
		}
	}

	if(!skill){
		console.error('提示：没有急救技能！');
	}else{
		var currentMap = cga.GetMapName();
        
		leo.todo().then(()=>{
			if (currentMap != '里谢里雅堡') {
				return leo.goto(n => n.castle.x);
        	}
		})
		.then(()=>leo.autoWalk(pos))
		.then(()=>{
			return leo.loop(
				()=>leo.todo()
				.then(()=>{
					if(cga.GetPlayerInfo().mp < minMp){
						return leo.autoWalk([34, 89])
						.then(()=>leo.supply(35, 88))
						.then(()=>leo.autoWalk(pos))
						.then(()=>{
							skill = cga.findPlayerSkill(skillName);
							if(skillLevel <= skill.lv){
						        leo.log('红叶の护士烧急救脚本，提示：技能【'+skillName+'】等级已达到【'+skill.lv+'】，达到或者超过了预设的目标等级【'+skillLevel+'】，脚本结束');
						        return leo.reject();
						    }else{
						        return leo.log('红叶の护士烧急救脚本，要烧的技能是【'+skillName+'】，目前等级【'+skill.lv+'】，预设的目标等级【'+skillLevel+'】');
						    }
						});
					}
				})
				.then(()=>{
					const skill = cga.GetSkillsInfo().find(s => s.name == '急救');
					const requireMp = 50;
					playerinfo = cga.GetPlayerInfo();
					if (playerinfo.hp < playerinfo.maxhp && skill && playerinfo.mp >= requireMp) {
						var lv = skill.lv - 1;
						//lv = 0;	//始终用1级技能
						cga.StartWork(skill.index, lv);
						cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => {
	                        if (players && players.length > 0) {
	                            const index = players.findIndex(p => p.name == playerinfo.name);
	                            if (typeof index == 'number') {
	                                cga.PlayerMenuSelect(index);
	                                cga.AsyncWaitUnitMenu((error, units) => setTimeout(() => {
	                                    if (error) {
	                                        leo.next();
	                                    } else {
	                                        cga.UnitMenuSelect(0);
	                                    }
	                                }, 0));
	                            } else leo.next();
	                        } else leo.next();
	                    }, 0), 2000);
					} else{
						return leo.next();
					}
				})
				.then(()=>putOn())
				.then(()=>takeOff())
				.then(()=>leo.delay(1000))
			);
		});
	}

	var i = 0;
	var autoTalk = ()=>{
		leo.say('红叶の护士烧急救脚本，说话防掉线',i);
		++i > 4 ? (i = 0) : 0;
		setTimeout(autoTalk, 60000);
	}
	autoTalk();
});