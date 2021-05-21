var Async = require('async');

var cga = global.cga;
var configTable = global.configTable;

var calcLevel = ()=>{
	var total = thisobj.enemyCountArray.reduce((total, num) => {
		return total + num;
	});	
	return parseInt( (1.0 - total / (thisobj.enemyCountArray.length * 10.0)) * 100.0 );
}

var deployPet = (cb)=>{
	var pets = cga.GetPetsInfo();
	if(!pets.length){
		throw Error('身上没有可以释放作为招牌的宠物！');
	}

	var putPet = (pet, index, cb)=>{
		var find_pet = cga.GetMapUnits().find((u)=>{
			return u.valid && (u.flags & 512) == 512 && u.xpos == 32 + index && u.ypos == 84;
		});

		if(find_pet != undefined){
			putPet(pet, index + 1, cb);
			return;
		}
		cga.walkList([
			[31 + index, 84]
		], ()=>{
			cga.turnDir(0);
			setTimeout(()=>{
				cga.ChangePetState(pet.index, 0);
				cga.ChangePetState(pet.index, 3);
				setTimeout(()=>{
					cb(null);
				}, 1500);
			}, 1500);
		});
	}

	var pet = pets[0];

	if(pet.state & 3){
		cb(null);
	} else {
		putPet(pet, 0, cb);		
	}
}

var broadcast = (cb)=>{

	var cards = cga.GetCardsInfo().filter((card)=>{
		return card.title.indexOf('[深蓝率]') >= 0 && card.server != 0;
	});
	var serverStatus = [];
	for(var c in cards){
		serverStatus[parseInt(cards[c].server)] = cards[c].title.substring('[深蓝率]'.length);
	}

	cga.sayLongWords('【CGA深蓝线广播】本线深蓝率：'+thisobj.shenlanLevel+'%', 0, 5, 1);
	for(var i = 1; i <= 10; ++i){
		if(serverStatus[i]){
			cga.sayLongWords('【CGA深蓝线广播】'+i+'线深蓝率：'+serverStatus[i]+'%', 0, 5, 1);
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
	thisobj.suspendUpdate = true;

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
						
						thisobj.enemyCountArray.push(units.length);
					} else {

						//无法遇敌，完全深蓝
						thisobj.enemyCountArray.push(0);

					}

					if(thisobj.enemyCountArray.length > 10){
						thisobj.enemyCountArray.shift();
					}

					thisobj.shenlanLevel = calcLevel();
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

		cga.ChangeNickName('[深蓝率]'+thisobj.shenlanLevel);

		thisobj.suspendUpdate = false;

		setTimeout(loop, 1000);

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

var timer = (index)=>{
	if(index > 10)
		index = 0;

	var pets = cga.GetPetsInfo();
	if(!pets.length){
		throw Error('身上没有可以释放作为招牌的宠物！');
	}
	var pet = pets[0];

	var cards = cga.GetCardsInfo().filter((card)=>{
		return card.title.indexOf('[深蓝率]') >= 0 && card.server != 0;
	});
	var serverStatus = [ thisobj.shenlanLevel ];
	for(var c in cards){
		serverStatus[parseInt(cards[c].server)] = cards[c].title.substring('[深蓝率]'.length);
	}

	if(serverStatus[index] == undefined){
		setTimeout(timer, 100, index + 1);
		return;
	}

	if(thisobj.suspendUpdate){
		setTimeout(timer, 100, index);
		return;
	}
	if(cga.isInNormalState()){
		cga.ChangePetName(pet.index, (index == 0 ? '本' : index) +'线深蓝率：'+serverStatus[index]+'%');
	}
	
	setTimeout(timer, 1500, index + 1);
}

var thisobj = {
	suspendUpdate : false,
	shenlanLevel : 0,
	enemyCountArray : [],
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

		cga.ChangeNickName('');

		callSubPlugins('init');
		cga.gui.LoadSettings({
			"battle": {
				"autobattle": true,
				"bossprot": false,
				"delayfrom": 4000,
				"delayto": 4000,
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
			timer(0);
			loop();
		});		
	},
}

module.exports = thisobj;