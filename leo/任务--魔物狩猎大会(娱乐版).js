require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var teamLeader = '队长名称'; //队长名称
    var teamPlayerCount = 5; //队伍人数
    var autoOpen = true; //自动开壶

    var isLogBackFirst = false; //启动登出
    var protect = {
        minTeamNumber: teamPlayerCount
    };
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の魔物狩猎大会(娱乐版)脚本，希特拉在等你哟~！启动~~~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true); //开启队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }

    if(cga.getItemCount('王冠')==0){
    	leo.log('身上没有【王冠】，脚本结束');
    	return;
    }
    if(cga.getItemCount('王冠')>1){
    	leo.log('身上的【王冠】只能带1个，多余的请先存银行，脚本结束');
    	return;
    }

    var targetMap = {
    	'1' : {
    		title: '这个简单',
    		change : null,
    		pos : [120,178],
    		boss : '强兽人',
    		teamLeaderFilter : null,
    		itemFilter : null
    	},
    	'2' :{
    		title: '这个也简单',
    		change : null,
			pos : [208,226],
    		boss : '骷髅暴君',
    		teamLeaderFilter : null,
    		dropFilter : null
    	},
    	'3' :{
    		title: '这个简单，当心被咬',
    		change : [66,198,59956],
			pos : [297,181],
			boss : '白牙兽',
    		teamLeaderFilter : null,
    		dropFilter : [9]
    	},
    	'4' :{
    		title: '名字很猛，其实很弱',
    		change : null,
			pos : [240,200],
			boss : '暴虐撕裂者',
    		teamLeaderFilter : [0,5],
    		dropFilter : null
    	},
    	'5' :{
    		title: '这个更简单',
    		change : null,
			pos : [201,183],
			boss : '肌肉小鸡',
    		teamLeaderFilter : [1,0],
    		dropFilter : null
    	},
    	'6' :{
    		title: '脏兮兮的，好想给它洗个澡',
    		change : [154,103,59958],
			pos : [273,232],
			boss : '亵渎尘怪',
    		teamLeaderFilter : [2,0],
    		dropFilter : null
    	},
    	'7' :{
    		title: '打完这个就收工了，快快快',
    		change : null,
			pos : [306,257],
			boss : '蛰刺贝壳',
    		teamLeaderFilter : [3,8],
    		dropFilter : null
    	},
    	'8' :{
    		title: '这个很胆大，孤单一只也敢出现',
    		change : null,
			pos : [207,176],
			boss : '音速轰鸣者',
    		teamLeaderFilter : [3,9],
    		dropFilter : [3,13]
    	},
    	'9' :{
    		title: '红红的炸弹，要当心',
    		change : null,
			pos : [250,115],
			boss : '战戟炸弹',
    		teamLeaderFilter : [5,0],
    		dropFilter : null
    	},
    	'10' :{
    		title: '狗狗，帅！',
    		change : null,
			pos : [163,135],
			boss : '白色子弹',
    		teamLeaderFilter : [6,11],
    		dropFilter : null
    	},
    	'11' :{
    		title: '蝙蝠、新冠、扁它！',
    		change : null,
			pos : [205,294],
			boss : '飓风蝙蝠',
    		teamLeaderFilter : [6,0],
    		dropFilter : [2,6]
    	},
    	'12' :{
    		title: '冰怪、雪怪，傻傻分不清楚',
    		change : [196,65,59958],
			pos : [237,216],
			boss : '雪怪',
    		teamLeaderFilter : [8,13],
    		dropFilter : null
    	},
    	'13' :{
    		title: '黑黑的虫子，打它',
    		change : null,
			pos : [230,159],
			boss : '陨石岩虫',
    		teamLeaderFilter : [9,0],
    		dropFilter : null
    	},
    	'14' :{
    		title: '这个地雷很帅',
    		change : null,
			pos : [161,120],
			boss : '重金属地雷',
    		teamLeaderFilter : [9,0],
    		dropFilter : null
    	},
    	'15' :{
    		title: '最难就是这小队，还会超恢，日常翻车处',
    		change : [301,250,59959],
			pos : [219,257],
			boss : '湿气小队',
    		teamLeaderFilter : [9,16],
    		dropFilter : null
    	},
    	'16' :{
    		title: '这个就厉害了，有难度',
    		change : null,
			pos : [233,126],
			boss : '碾碎者',
    		teamLeaderFilter : [11,2],
    		dropFilter : [9]
    	}
    }
    var targetList = [1,2,5,9,6,13,14,3,11,8,10,4,16,12,15,7];
    var itemOwner = {};
    var itemNamePrev = '目标遗留品No';
    var current = 0;
    var getCount = [0,0,0,0,0];//希特拉、萨普地雷、泰坦巨人、托罗帝鸟、岩地跑者

    var getNewLeader = ()=>{
    	var target = targetList[current];
		var option = targetMap[target];
		console.log();//空一行
		leo.log('红叶提醒您：第【'+(current+1)+'/16】步=>当前编号【'+target+'】，'+option.title);
		leo.log('前往坐标'+option.pos+'，击倒魔物名称【'+option.boss+'】，开始选举队长，要求：'+option.teamLeaderFilter);
		console.log('已有道具列表：');
		console.log(itemOwner);
		var newLeader = cga.GetPlayerInfo().name;
		if(option.teamLeaderFilter){
			var includeItem = option.teamLeaderFilter[0];
			var excludeItem = option.teamLeaderFilter[1];
			if(excludeItem != 0 && newLeader == itemOwner[excludeItem]){
				newLeader = teammates.find(t => t.name != itemOwner[excludeItem]).name;
			}
			if(itemOwner[includeItem]){
				newLeader = itemOwner[includeItem];
			}
		}
		return newLeader;
    }

    var itemCheck = ()=>{
    	var target = targetList[current];
		var option = targetMap[target];
    	var itemName = itemNamePrev + target;
    	var ret = false;
    	if(!cga.isInBattle()){
    		var count = cga.getItemCount(itemName);
    		if(count>0){
    			var needDrop = false;
    			if(option.dropFilter){
    				option.dropFilter.forEach(function (val,index) {  
				       	if(cga.getItemCount(itemNamePrev+val)>0){
    						needDrop = true;
    					}
					});
    			}
    			if(target==5 && isTeamLeader){
    				needDrop = true;//队长不留道具5，以免出错
    			}
    			if(needDrop){
    				console.log('需要扔物品：'+itemName);
					leo.dropItem(itemName);
				}else{
					leo.say('触发战斗保护');
					leo.say('获得物品');
					setTimeout(() => {
						leo.say('触发战斗保护');
						leo.say('获得物品');
					}, 3000);
					setTimeout(() => {
						leo.say('触发战斗保护');
						leo.say('获得物品');
					}, 6000);
					ret = true;
				}
    		}
    		if(isTeamLeader && cga.getItemCount('目标遗留品No5')>0){
				leo.dropItem('目标遗留品No5');
    		}
    	}
    	return ret;
    }
    protect.checker = itemCheck;

    var openPrize = ()=>{
    	return leo.todo()
    	.then(()=>{
			console.log();
			console.log('==========刮奖区==========');
			if(cga.getItemCount('不可思议的壶')>0){
				if(autoOpen){
					console.log('获得了【不可思议的壶】，自动开奖');
					var oldPetIndexs = cga.GetPetsInfo().map(pet=>pet.index);
					if(oldPetIndexs.length>=5){
						console.log('开奖失败，宠物已满，请至少留一个空位');
						return leo.next();
					}else{
						return leo.useItemEx('不可思议的壶')
						.then(()=>leo.waitNPCDialog(dialog => {
							cga.ClickNPCDialog(4, -1);
							return leo.delay(1000);
						}))
						.then(()=>{
							var newPets = cga.GetPetsInfo();
							var pet = newPets.find(p=>{
								return !is_array_contain(oldPetIndexs, p.index);
							})
							if(pet.realname == '希特拉'){
								leo.log('恭喜，得到了'+leo.getPetCalcInfo(pet));
								getCount[0]++;
							}
							if(pet.realname == '萨普地雷'){
								//leo.log('恭喜，得到了'+leo.getPetCalcInfo(pet));
								leo.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
								cga.DropPet(pet.index);
								getCount[1]++;
							}
							if(pet.realname == '泰坦巨人'){
								leo.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
								cga.DropPet(pet.index);
								getCount[2]++;
							}
							if(pet.realname == '托罗帝鸟'){
								leo.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
								cga.DropPet(pet.index);
								getCount[3]++;
							}
							if(pet.realname == '岩地跑者'){
								console.log('可惜，得到了'+leo.getPetCalcInfo(pet)+'，扔');
								cga.DropPet(pet.index);
								getCount[4]++;
							}
							return console.log('战利品：【'+getCount+'】 【希特拉、萨普地雷、泰坦巨人、托罗帝鸟、岩地跑者】');
						});
					}
				}else{
					console.log('获得了【不可思议的壶】，请手动开奖');
					return leo.next();
				}
			}else{
				console.log('没有获得【不可思议的壶】');
				return leo.next();
			}
		})
		.then(()=>{
			console.log('==========刮奖区==========');
			console.log();
		});
    }

    leo.todo()
    .then(() => {
        //登出
        if (isLogBackFirst) {
            return leo.logBack()
            .then(()=>leo.sellCastle())
            .then(()=>leo.checkHealth(prepareOptions.doctorName))
			.then(()=>leo.checkCrystal());
        } else {
            return leo.next();
        }
    })
    .then(()=>{
    	//扔掉多余的道具
    	var index = 1;
    	return leo.loop(()=>{
    		if(index <= 16){
    			var itemName = itemNamePrev + index;
    			if(cga.getItemCount(itemName)>0){
    				return leo.dropItemEx(itemName);
    			}else{
    				index++;
    				return leo.next();
    			}
    		}else{
    			return leo.log('初始化：身上的道具已清理完毕')
    			.then(()=>leo.reject());
    		}
    	});
    })
    .then(()=>{
		return leo.loop(()=>{
			var mapInfo = cga.getMapInfo();
			if(mapInfo.name == '里谢里雅堡' || mapInfo.name == '法兰城'){
				return leo.logBack();
			}
			if(mapInfo.name == '艾尔莎岛'){
				return leo.autoWalk([165,153])
				.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛'));
			}
			if(mapInfo.name == '利夏岛'){
				return leo.autoWalk([90,99,'国民会馆']);
			}
			if(mapInfo.name == '国民会馆'){
				return leo.autoWalk([108,39,'雪拉威森塔１层']);
			}
			if(mapInfo.name == '雪拉威森塔１层'){
				return leo.autoWalk([34,95])
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'辛梅尔'));
			}
			if(mapInfo.name == '辛梅尔' && !leo.isInTeam()){
				return leo.autoWalk([181,81,'公寓'])
				.then(()=>leo.autoWalk([89,58]))
				.then(()=>leo.supply(89,57))
				.then(()=>leo.autoWalk([100,70,'辛梅尔']))
				.then(()=>leo.autoWalk([207,91,'光之路']))
				.then(()=>leo.autoWalk([199,95]))
				.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'圣炎高地'))
				.then(()=>{
					if(isTeamLeader){
						return leo.autoWalk([208,328])
						.then(()=>leo.buildTeamBlock(teamPlayerCount));
					}else{
						return leo.enterTeamBlock(teamLeader);
					}
				})
				.then(()=>leo.reject());//退出循环，进入下一步
			}
			if(mapInfo.name == '光之路' && (isTeamLeader || !leo.isInTeam())){
				return leo.autoWalk([201,19,'辛梅尔'])
				.then(()=>{
					if(isTeamLeader && leo.isInTeam()){
						return leo.leaveTeam();
					}
				});
			}
			if(mapInfo.name == '圣炎高地' && (isTeamLeader || !leo.isInTeam())){
				return leo.autoWalk([209,330,'光之路']);
			}
			return leo.delay(2000);
		});
	})
    .then(()=>{
    	if(isTeamLeader){
    		return leo.autoWalkList([
    			[210,271],[210,272],[210,271],[210,272],[210,271]
    		])
    		.then(()=>leo.talkNpc(211,271,leo.talkNpcSelectorYes))
    		.then(()=>leo.delay(5000));
    	}else{
    		return leo.waitUntil(()=>{
				var mapInfo = cga.getMapInfo();
				if (mapInfo.name == '圣炎高地' 
					&& mapInfo.indexes.index3 == 59959 
					&& mapInfo.x == 210
					&& (mapInfo.y == 271 || mapInfo.y == 272)) {
					if(cga.getItemCount('猎人证') == 1){
						leo.log('拿到了猎人证');
						return true;
					}else{
						leo.log('到达位置，拿猎人证');
						leo.talkNpc(211,271,leo.talkNpcSelectorYes);
					}
				}
				return false;
			})
    	}
    })
    .then(()=>{
    	return leo.waitAfterBattle()
    	.then(()=>{
    		teammates = leo.getTeamPlayerAll();
    		return leo.next();
    	});
    })
    .then(()=>{
    	var leader = '';
    	var isLeader = isTeamLeader;
    	var leaderPosX = 0;
    	var leaderPosY = 0;
    	return leo.loop(
    		()=>leo.waitAfterBattle()
    		.then(()=>{
	    		if(isTeamLeader){
	    			leader = getNewLeader();
	    			if (playerName == leader) {
				        isLeader = true;
				    }else{
				    	isLeader = false;
				    }
				    var mapInfo = cga.getMapInfo();
	    			leaderPosX = mapInfo.x;
	    			leaderPosY = mapInfo.y;
	    			return leo.delay(5000)
	    			.then(()=>leo.log('更换队长：'+leader+'=>坐标：'+mapInfo.x+' '+mapInfo.y));
	    		}else{
	    			return leo.waitMessageUntil((chat) => {
						if (chat.msg && chat.msg.indexOf('更换队长：') >= 0) {
							var arr = chat.msg.split('更换队长：')[1].split('=>');
							if(arr.length==2){
								leader = arr[0];
								if (playerName == leader) {
							        isLeader = true;
							    }else{
							    	isLeader = false;
							    }
							    var tempPos = arr[1].replace('坐标：','').split(' ');
							    leaderPosX = parseInt(tempPos[0]);
	    						leaderPosY = parseInt(tempPos[1]);
	    						leo.leaveTeam();
	    						return true;
							}
						}
					});
	    		}
	    	})
	    	.then(()=>{
	    		return leo.waitUntil(()=>{
					if (!leo.isInTeam()) {
						return true;
					}
					return false;
				});
	    	})
	    	.then(()=>{
	    		if(isLeader){
	    			return leo.autoWalkList([[leaderPosX-1,leaderPosY],[leaderPosX,leaderPosY]])
	    			.then(()=>leo.buildTeam(teamPlayerCount));
	    		}else{
	    			return leo.autoWalk([leaderPosX-1,leaderPosY])
	    			.then(()=>leo.enterTeam(leader));
	    		}
	    	})
	    	.then(()=>{
	    		var target = targetList[current];
	    		var option = targetMap[target];
	    		leo.waitMessageUntil((chat) => {
					if (chat.msg && chat.msg.indexOf('获得物品') >= 0) {
						if (teammates.find(t => t.unit_id == chat.unitid)) {
							var name = leo.getNameFromMessage(chat.msg)[0];
							itemOwner[target] = name;
							leo.log('红叶提醒您：当前编号【'+target+'】已完成，道具获得者【'+name+'】');
							return true;
						}
					}
				});
	    		if (isLeader) {
	    			var walkList = [];
	    			if(option.change){
	    				walkList.push(option.change);
	    			}
	    			walkList.push(option.pos);
	    			return leo.autoWalkList(walkList)
	    			.then(()=>leo.log('开始狩猎怪物【'+(current+1)+'/16】，目标【'+targetMap[targetList[current]].boss+'】，编号【'+targetList[current]+'】'))
	    			.then(()=>leo.encounterTeamLeader(protect));
	    		}else{
	    			return leo.waitMessageUntil((chat) => {
						if (chat.msg && chat.msg.indexOf('开始狩猎怪物') >= 0 && teammates.find(t => t.unit_id == chat.unitid)) {
							console.log(chat.msg);
							return true;
						}
					})
					.then(()=>{
						var waitForNext = () => {
		    				if (itemCheck() || itemOwner[target]) {
		    					return leo.next();
		    				}else{
		    					return leo.delay(2000)
		    					.then(()=>waitForNext());
		    				}
		    			}
		    			return waitForNext();
					});
	    		}
	    	})
	    	.then(()=>{
	    		current++;
	    		if(current<16){
	    			return leo.done();
	    		}else{
	    			return leo.reject();//已完成狩猎，去拿奖
	    		}
	    	})
    	)
    	.then(()=>{
    		if(isLeader){
    			return leo.log('红叶提醒您：已完成16种魔物的狩猎，去换奖品');
    		}else{
    			console.log(leo.logTime() + '红叶提醒您：已完成16种魔物的狩猎，去换奖品');
    		}
    	})
    	.then(()=>{
    		if(isLeader){
    			return leo.autoWalk([206,267])
    			.then(()=>leo.talkNpc(207,267,leo.talkNpcSelectorYes))
    			.then(()=>leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.indexes.index3 == 59958 && mapInfo.x == 110 && mapInfo.y == 258) {
						return true;
					}
					return false;
				}))
				.then(()=>leo.leaveTeam());
    		}else{
    			return leo.waitUntil(()=>{
					var mapInfo = cga.getMapInfo();
					if (mapInfo.indexes.index3 == 59958 && mapInfo.x == 110 && mapInfo.y == 258 && !leo.isInTeam()) {
						return true;
					}
					return false;
				});				
    		}
    	})
    	.then(()=>leo.autoWalk([118,249]))
    	.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
    	.then(()=>leo.log('任务完成，大家辛苦了，有没有拿到壶呢？希特拉在等你哟~！'))
    	.then(()=>openPrize());
    });
});