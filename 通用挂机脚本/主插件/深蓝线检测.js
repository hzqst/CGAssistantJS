var Async = require('async');

var cga = global.cga;
var configTable = global.configTable;

var putPet = (cb)=>{
	var pets = cga.GetPetsInfo();
	if(!pets.length){
		console.error('身上没有可以释放作为招牌的宠物！');
		cb(null);
	}

	var changeName = (pet, cb2)=>{
		var stateArray = ['待检测', '未深蓝', '半深蓝', '全深蓝'];
		cga.ChangePetName(pet.index, '本线状态：'+stateArray[thisobj.shenlanLevel]);
		setTimeout(()=>{
			cb2(null);
		}, 1500);
	}

	var pet = pets[0];
	if(pet.state & 3){

		changeName(pet, cb);

	} else {

		cga.walkList([
		[31 + pet.index, 84]
		], ()=>{
			cga.turnDir(0);
			setTimeout(()=>{
				cga.ChangePetState(pet.index, 0);
				cga.ChangePetState(pet.index, 3);
				setTimeout(()=>{				
					changeName(pet, cb);
				}, 1000);
			}, 1000);
		});

	}
}

var broadcast = (cb)=>{
	var stateArray = ['待检测', '未深蓝', '半深蓝', '全深蓝'];
	cga.sayLongWords('【CGA深蓝线广播】本线深蓝状态：'+stateArray[thisobj.shenlanLevel], 0, 5, 5);
	cga.sayLongWords('【CGA深蓝线广播】其他线路深蓝状态将在下个版本中加入', 0, 5, 5);
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
			putPet(()=>{
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