require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var doctorName = '绿蔓之殇';

	var playerinfo = cga.GetPlayerInfo();
	var isDoctor = false;
	var fightType = 2;
	if(playerinfo.name == doctorName){
		isDoctor = true;
	}
	if(isDoctor){
		leo.say('红叶の医生烧治疗脚本，我是医生,启动~');
	}else{
		leo.say('红叶の医生烧治疗脚本，我是炮灰,启动~');
	}
	
	var defaultDoctor = '医道之殇';
	if(isDoctor){
		var pos = [30, 87];
		var minMp = 100;
		var skill = cga.findPlayerSkill('治疗');
			
		if(!skill){
			console.error('提示：没有治疗技能！');
		}else{
			var currentMap = cga.GetMapName();
			leo.todo().then(()=>{
				if (currentMap != '里谢里雅堡') {
					return leo.goto(n => n.castle.x);
	        	}
			})
			.then(()=>leo.autoWalk(pos))
			.then(()=>leo.turnDir(4))
			.then(()=>{
				return leo.loop(
					()=>leo.todo()
					.then(()=>{
						if(cga.GetPlayerInfo().mp < minMp){
							return leo.autoWalk([34, 89])
							.then(()=>leo.supply(35, 88))
							.then(()=>leo.autoWalk(pos))
							.then(()=>leo.turnDir(4));
						}
					})
					.then(()=>{
						return leo.healTeammate().then(()=>leo.delay(2000));
					})
				);
			});
		}
	}else{
		if(fightType==1){
			leo.todo()
			.then(()=>{
				return leo.loop(
					()=>leo.todo()
					.then(()=>{
						if(cga.GetPlayerInfo().health>0){
							return leo.logBack()
							.then(()=>leo.goto(n => n.castle.x))
							.then(()=>leo.autoWalk([34,89]))
							.then(()=>leo.supply(35,88))
							.then(()=>leo.autoWalk([29,87]))
							.then(()=>leo.enterTeam(doctorName))
							.then(()=>leo.waitUntil(()=>{
								if(cga.GetPlayerInfo().health==0){
									return true;
								}
								if(!leo.isInTeam()){
									return true;
								}
				                return false;
				            }));
						}else{
							return leo.logBack()
							.then(()=>leo.goto(n => n.castle.x))
							.then(()=>leo.autoWalk([29,80]))
							.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'追忆之路'))
							.then(()=>leo.autoWalk([14,110]))
							.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
							.then(()=>leo.waitAfterBattle());
						}
					})
				);
			});
		}else if(fightType==2){
			leo.todo()
			.then(()=>{
				return leo.loop(
					()=>leo.todo()
					.then(()=>{
						var flag = true;
						if(cga.GetPlayerInfo().health>50){
							//health 0 1-25(白) 26-50(黄) 51-75(粉) 76-100(红)
							flag = false;
						}
						if(cga.GetPlayerInfo().health>0){
							return leo.logBack()
							.then(()=>leo.goto(n => n.castle.x))
							//.then(()=>leo.autoWalk([34,89]))
							//.then(()=>leo.supply(35,88))
							.then(()=>leo.autoWalk([29,87]))
							.then(()=>leo.enterTeam(flag?doctorName:defaultDoctor))
							.then(()=>leo.waitUntil(()=>{
								if(cga.GetPlayerInfo().health==0){
									return true;
								}
								if(!leo.isInTeam()){
									return true;
								}
								if(flag&&cga.GetPlayerInfo().health>50){
									return true;//伤势恶化了
								}
				                return false;
				            }));
						}else{
							var protect = {
						        minHp: -1,
						        minMp: 0,
						        minPetHp: 0,
						        minPetMp: 0,
						        checker:()=>{
						        	return cga.GetPlayerInfo().health>0;
						        }
						    };
							return leo.goto(n => n.falan.eout)
							.then(()=>leo.encounterTeamLeader(protect));
						}
					})
				);
			});
		}
		
	}


	var i = 0;
	var autoTalk = ()=>{
		leo.say('红叶の医生烧治疗脚本，说话防掉线',i);
		++i > 4 ? (i = 0) : 0;
		setTimeout(autoTalk, 60000);
	}
	autoTalk();
});