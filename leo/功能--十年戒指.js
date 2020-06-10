require('./common').then(cga=>{
	leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
	var teamPlayerCount = 5; //队伍人数
	var teammates = [];

	leo.monitor.config.keepAlive = false;	//关闭防掉线
	leo.monitor.config.autoHp = false;
	leo.monitor.config.autoHpValue = 500;
	leo.monitor.config.autoHpItem = '小护士家庭号';
	leo.monitor.config.autoMp = false;
	leo.monitor.config.autoMpValue = 350;
	leo.monitor.config.autoMpItem = '魔力之泉';

	var autoDrop = true;	//自动扔戒指
	var autoDropPlace = 1;	//0-扔飞碟，1-扔组队点，2-扔过了小帕
	var autoDropId = '491323'; //攻戒ID:491323 魔戒ID:491323 两种都扔:十周年纪念戒指
	var weaponName = '平民斧';//武器

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        crystalName: '水火的水晶（5：5）',
        doctorName: '医道之殇'
    };
    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
        weaponName = '';
    }

	leo.log('红叶の十年戒指脚本，启动~');

	var count = 0;
	leo.loop(
		() => leo.waitAfterBattle()
		.then(()=>leo.logBack())
		//.then(()=>leo.prepare(prepareOptions))
		.then(()=>{
			//判断人物身上的道具数量已满
			if(cga.getInventoryItems().length >= 20){
				return leo.goto(n=>n.falan.bank)
				.then(()=>leo.turnDir(0))
				.then(()=>leo.saveToBankAll('十周年纪念戒指'));
			}
		})
		.then(()=>{
			//判断人物身上的道具数量已满
			if(cga.getInventoryItems().length >= 20){
				return leo.log('十周年纪念戒指已满！存银行！')
				.then(()=>leo.goto(n => n.falan.bank))
				.then(()=>leo.turnDir(0))
				.then(()=>leo.saveToBankAll('十周年纪念戒指'));
			}
		})
		.then(()=>{
			//判断人物身上的道具数量已满
			if(cga.getInventoryItems().length >= 20){
				return leo.log('十周年纪念戒指已满！请先整理仓库！')
				.then(()=>leo.reject());
			}
		})
		.then(()=>leo.getBackSoul())
		.then(()=>leo.healPlayer(prepareOptions.doctorName))
		.then(()=>leo.healPet())
		.then(()=>leo.checkCrystal(prepareOptions.crystalName))
		.then(()=>leo.autoEquipLv1(weaponName))
		.then(()=>leo.goto(n => n.castle.x))
		.then(()=>leo.dropItemEx('平民帽'))
		.then(()=>leo.dropItemEx('平民衣'))
		.then(()=>leo.dropItemEx('平民鞋'))
		.then(()=>{
			if(weaponName && weaponName!=''){
				return leo.dropItemEx(weaponName);
			}else{
				return leo.next();
			}
		})
		.then(()=>{
			if(autoDrop && autoDropPlace == 0){
				return leo.dropItemEx(autoDropId);
			}else{
				return leo.next();
			}
		})
		.then(()=>leo.autoWalk([34,88]))
		.then(()=>leo.supply(35,88))
		.then(()=>leo.autoWalk([29,80]))
		.then(()=>leo.talkNpc(30, 80, leo.talkNpcSelectorYes, '追忆之路'))
		.then(()=>leo.autoWalk([14,120]))
		.then(()=>{
			if(isTeamLeader){
				return leo.autoWalk([14,119])
				.then(() => leo.buildTeam(teamPlayerCount)).then(() => {
                    var teamplayers = cga.getTeamPlayers();
                    //console.log(teamplayers);
                    if (teamplayers && teamplayers.length == teamPlayerCount) {
                        for (var i in teamplayers) {
                            teammates[i] = teamplayers[i].name;
                        }
                    }
                    leo.log('组队完成，队员[' + teammates.toString() + ']');
                    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
                    return leo.next();
                });
			}else{
				return leo.enterTeam(teamLeader)
				.then(() => {
                    leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
                    return leo.next();
                });
			}
		})
		.then(()=>{
			if(autoDrop && autoDropPlace == 1){
				return leo.dropItemEx(autoDropId);
			}else{
				return leo.next();
			}
		})
		.then(()=>{
			if(isTeamLeader){
				return leo.autoWalk([15,111])
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>{
					var mapInfo = cga.getMapInfo();
					if(mapInfo.y != 103){
						return leo.log('翻车，没有打过露比！')
						.then(()=>leo.reject());
					}
				})
				.then(()=>leo.autoWalk([15,100]))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>{
					var mapInfo = cga.getMapInfo();
					if(mapInfo.y != 92){
						return leo.log('翻车，没有打过法尔肯！')
						.then(()=>leo.reject());
					}
				})
				.then(()=>leo.autoWalk([15,89]))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>{
					var mapInfo = cga.getMapInfo();
					if(mapInfo.y != 81){
						return leo.log('翻车，没有打过犹大！')
						.then(()=>leo.reject());
					}
				})
				.then(()=>leo.autoWalk([15,78]))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>{
					var mapInfo = cga.getMapInfo();
					if(mapInfo.y != 70){
						return leo.log('翻车，没有打过海贼！')
						.then(()=>leo.reject());
					}
				})
				.then(()=>leo.autoWalk([15,67]))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>{
					var mapInfo = cga.getMapInfo();
					if(mapInfo.y != 59){
						return leo.log('翻车，没有打过双王！')
						.then(()=>leo.reject());
					}
				})
				.then(()=>leo.autoWalk([15,56]))
				.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
				.then(()=>leo.waitAfterBattle())
				.then(()=>{
					var mapInfo = cga.getMapInfo();
					if(mapInfo.y != 48){
						return leo.log('翻车，没有打过小帕！')
						.then(()=>leo.reject());
					}
				})
				.then(()=>{
					if(autoDrop && autoDropPlace == 2){
						return leo.dropItemEx(autoDropId);
					}else{
						return leo.next();
					}
				})
				.then(()=>leo.autoWalk([15,5]))
				.then(()=>leo.autoWalk([14,5]))
				.then(()=>leo.autoWalk([15,5]))
				.then(()=>leo.autoWalk([14,5]))
				.then(()=>leo.autoWalk([15,5]))
				.then(()=>leo.talkNpc(15,4,leo.talkNpcSelectorYes,'里谢里雅堡'))
				.then(()=>{
					count++;
					return leo.log('十周年戒指，完成第' + count + '次');
				});
			}else{
				return leo.loop(
	                () => leo.waitAfterBattle()
	                .then(() => {
	                	var mapInfo = cga.getMapInfo();
			            if (!leo.isInTeam() && (mapInfo.x == 14 || mapInfo.x == 15) && mapInfo.y == 5 ) {
			                return leo.talkNpc(15,4,leo.talkNpcSelectorYes,'里谢里雅堡')
			                .then(()=>{
								count++;
								return leo.log('十周年戒指，完成第' + count + '次');
							})
			                .then(()=>leo.reject());
			            }
			            if (!leo.isInTeam() && mapInfo.y != 5 ) {
			                return leo.reject();
			            }
		                return leo.delay(5000);
	                })
	            );
			}
		})
		.catch(()=>{

		})
	);
});