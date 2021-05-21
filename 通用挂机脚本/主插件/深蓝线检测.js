var Async = require('async');

var cga = global.cga;
var configTable = global.configTable;

var deployPet = (cb)=>{
	var pets = cga.GetPetsInfo();
	if(!pets.length){
		console.error('身上没有可以释放作为招牌的宠物！');
		cb(null);
	}

	var changeName = (pet, cb2)=>{
		var stateArray = ['待检测', '未深蓝', '半深蓝', '全深蓝'];
		cga.ChangeNickName('[本线状态]'+stateArray[thisobj.shenlanLevel]);
		cga.ChangePetName(pet.index, '本线状态：'+stateArray[thisobj.shenlanLevel]);
		setTimeout(()=>{
			cb2(null);
		}, 1500);
	}

	var putPet = (pet, index, cb)=>{
		cga.walkList([
			[31 + index, 84]
		], ()=>{
			cga.turnDir(0);
			setTimeout(()=>{
				cga.ChangePetState(pet.index, 0);
				cga.ChangePetState(pet.index, 3);
				setTimeout(()=>{
					var npet = cga.GetPetInfo(pet.index);
					if(!npet || !(npet.state & 3)){
						putPet(npet, index+1, cb);
					} else {
						cb(null);
					}
				}, 1000);
			}, 1000);
		});
	}

	var pet = pets[0];

	if(pet.state & 3){

		changeName(pet, cb);
	} else {

		putPet(pet, 0, ()=>{
			changeName(pet, cb);
		});
		
	}
}

var broadcast = (cb)=>{

	var cards = cga.GetCardsInfo().filter((card)=>{
		return card.title.indexOf('[本线状态]') >= 0 && card.server != 0;
	});
	var serverStatus = [];
	for(var c in cards){
		serverStatus[cards[c].server] = cards[c].title.substring('[本线状态]'.length);
	}

	var stateArray = ['待检测', '未深蓝', '半深蓝', '全深蓝'];
	cga.sayLongWords('【CGA深蓝线广播】本线状态：'+stateArray[thisobj.shenlanLevel], 0, 5, 1);
	for(var i = 1; i <= 10; ++i){
		if(serverStatus[i]){
			cga.sayLongWords('【CGA深蓝线广播】'+i+'线状态：'+serverStatus[i], 0, 5, 1);
		}
	}
	cb(null);
}

var gotoBoss = (cb)=>{
	cga.walkList([
		[30, 81]
	], ()=>{
		cga.turnTo(30, 80);
		cga.AsyncWaitNPCDialog(()=>{
			cga.ClickNPCDialog(32, 0);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, 0);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'追忆之路', delay:1000, timeout:5000}, ()=>{
						cga.walkList([
							[15, 111],
						], cb);
					});
				});
			});
		});
	});
}

var testBoss = (cb)=>{
	cga.turnTo(15, 110);
	cga.AsyncWaitNPCDialog(()=>{
		cga.ClickNPCDialog(1, 0);
		cga.AsyncWaitBattleAction((err, flags)=>{
			if(flags & cga.FL_BATTLE_ACTION_BEGIN){
				setTimeout(()=>{
					if(cga.isInBattle()){
						//成功进入战斗，获取所有敌方单位
						var units = cga.GetBattleUnits().filter((u)=>{
							return u.pos >= 10;
						});
						if(units.length == 10){
							//满10人，未深蓝
							thisobj.shenlanLevel = 1;
						} else {
							//不满10人，半深蓝
							thisobj.shenlanLevel = 2;
						}
					} else {
						//无法遇敌，完全深蓝
						thisobj.shenlanLevel = 3;
					}					
					cb(null);
				}, 1000);				
			} else {
				//something wrong, try again
				testBoss(cb);
				return;
			}
		})
	});
}

var retry = ()=>{
	if(cga.isInNormalState()){
		loop();
	} else {
		setTimeout(retry, 1000);
	}
}

var loop = ()=>{
	callSubPluginsAsync('prepare', ()=>{
		cga.travel.falan.toStone('C', ()=>{			
			deployPet(()=>{
				broadcast(()=>{
					gotoBoss(()=>{						
						testBoss(retry);
					});
				});
			});			
		});
	});
}

var thisobj = {
	shenlanLevel : 0,
	getDangerLevel : ()=>{
		return 0;
	},
	translate : (pair)=>{
		return false;
	},
	loadconfig : (obj)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	},
	execute : ()=>{
		callSubPlugins('init');
		cga.gui.LoadSettings({
			"battle": {
				"autobattle": true,
				"bossprot": false,
				"delayfrom": 4000,
				"delayto": 4500,
				"highspeed": true,
				"list": [
					{
						"condition": 0,
						"condition2": 0,
						"condition2rel": 0,
						"condition2val": "",
						"conditionrel": 0,
						"conditionval": "",
						"index": 0,
						"petaction": -1,
						"pettarget": -1,
						"pettargetsel": -1,
						"playeraction": 7,
						"playertarget": -1,
						"playertargetsel": -1
					}
				],
				"lockcd": false,
				"lv1prot": false,
				"pet2action": false,
				"playerforceaction": false,
				"r1nodelay": true,
				"showhpmp": false
			},
			"player": {
				"noswitchanim": true,
			}
		}, ()=>{
			loop();
		});		
	},
}

module.exports = thisobj;