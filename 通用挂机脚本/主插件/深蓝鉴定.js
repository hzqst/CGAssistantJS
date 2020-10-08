var Async = require('async');
var cga = global.cga;
var configTable = global.configTable;

var healObject = require('./../公共模块/治疗自己');

var socket = null;

var exchangeItem2 = (name, cb)=>{
	var stuffs = 
	{
		itemFilter : (item)=>{
			if (item.itemid == 18526){
				return true;
			}
			
			return false;
		}
	}

	console.log('交易阶段2： '+ thisobj.state);

	cga.positiveTrade(name, thisobj.state == 'exchange_finish' ? {} : stuffs, null, (result)=>{
		if(result && result.success == true)
		{
			if(thisobj.state == 'exchange_finish' && result.received 
			&& result.received.items && result.received.items.find((item)=>{
				return item.itemid == 18526;
			}))
			{
				console.log('已经拿到所有深蓝');
				cb(null);
			}
			else
			{
				exchangeNPC(name, cb);
			}
			return;
		}
		if(thisobj.state != 'exchange_finish' && thisobj.state != 'exchange' && thisobj.state != 'addteam'){
			console.log('状态错误：'+thisobj.state);
			cb(new Error('状态错误'));
		} else {
			exchangeItem2(name, cb);
		}
	});
}

//从NPC那里换取药？
var exchangeNPC = (name, cb)=>{
	console.log('从NPC那里换取药');
	
	cga.TurnTo(6, 7);
	cga.AsyncWaitNPCDialog((err, dlg)=>{
		cga.ClickNPCDialog(4, 0);
		cga.AsyncWaitNPCDialog(()=>{
			//如果身上有未开光深蓝和药？
			if(cga.getInventoryItems().find((inv)=>{
				return inv.itemid == 15630;
			}) != undefined)
			{
				//把药？交易给药剂师
				exchangeItem2(name, cb);
			}
			else
			{
				//身上只有药？，没有未开光深蓝
				thisobj.state = 'exchange_finish';
				socket.emit('exchange_finish', (remain)=>{
					//等待药剂师交还所有药？
					if(remain > 0){
						exchangeItem2(name, cb);
					} else {
						//药剂没有剩余的药？了
						console.log('已经拿到所有深蓝');
						cb(null);
					}
				});
			}
		});
	});
}

//从药剂师那边拿
var exchangeItem = (name, cb)=>{
	
	console.log('exchangeItem');
	
	cga.waitTrade({}, null, (result)=>{
		if(result && result.success == true)
		{
			//第一次交易，拿到所有未开光
			exchangeNPC(name, cb);
			return;
		}
		
		if(thisobj.state != 'exchange_finish' && thisobj.state != 'exchange' && thisobj.state != 'addteam'){
			console.log('状态错误：'+thisobj.state);
			cb(new Error('状态错误'));
		} else {
			exchangeItem(name, cb);
		}
	});
	
	
}

var addTeam = (cb)=>{
	cga.addTeammate(thisobj.craft_player, (r)=>{
		if(r){
			exchangeItem(thisobj.craft_player, cb);
			return;
		}
		setTimeout(addTeam, 1000, cb);
	});
}

var loop = ()=>{
	
	thisobj.state = 'traveling';
	socket.emit('traveling');

	if(cga.getTeamPlayers().length){
		cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
		setTimeout(loop, 1000);
		return;
	}
	
	var inventory = cga.getInventoryItems();
	var found_assessed = inventory.find((inv)=>{
		return (inv.assessed == true && inv.itemid == 18526);
	});
	if(found_assessed != undefined){

		cga.travel.falan.toBank(()=>{
			cga.walkList([
			[11, 8],
			], ()=>{
				cga.turnDir(0);
				cga.AsyncWaitNPCDialog(()=>{
					cga.saveToBankAll((item)=>{
						return item.itemid == 18526 && item.assessed == true;
					}, 3, (err)=>{
						loop();
					});
				});
			});
		});
		return;
	}
	
	var mapindex = cga.GetMapIndex().index3;
	
	var playerInfo = cga.GetPlayerInfo();
	if(playerInfo.mp < 80 || playerInfo.hp < playerInfo.maxhp) {
		if(mapindex == 4410)
		{
			cga.walkList([
			[34, 45],
			], ()=>{
				cga.TurnTo(35, 46);
				setTimeout(loop, 3000);
			});
			
		}
		else if(mapindex == 4415)
		{
			cga.walkList([
			[29, 10, '魔法大学内部'],
			[34, 45],
			], ()=>{
				cga.TurnTo(35, 46);
				setTimeout(loop, 3000);
			});
		}
		else
		{
			cga.travel.falan.toCastleHospital(()=>{
				setTimeout(loop, 3000);
			});
		}
		return;
	}
	
	if(playerInfo.health > 0) {
		healObject.func(loop);
		return;
	}

	//药？
	var count = 0;
	var inventory = cga.getInventoryItems();
	var found_unassessed = inventory.find((inv)=>{
		return (inv.assessed == false && inv.itemid == 18526);
	});
	if(found_unassessed != undefined){
		console.log('开始鉴定')
		cga.assessAllItems(loop);
		return;
	}

	callSubPluginsAsync('prepare', ()=>{

		var mapindex = cga.GetMapIndex().index3;
		
		if(mapindex != 4410)
		{
			if(mapindex == 4415){
				cga.walkList([
				[29, 10, '魔法大学内部'],
				[34, 45],
				], loop);
				return;
			}
			cga.travel.falan.toTeleRoom('魔法大学', ()=>{
				cga.walkList([
				[74, 93, '魔法大学内部'],
				[34, 45],
				], loop);
				return;
			});
			return;
		}
			
		cga.walkList([
			[34, 45],
		], ()=>{			
			thisobj.state = 'ready_addteam';
			socket.emit('ready_addteam');
		});
	});
}

var thisobj = {
	state : 'traveling',
	craftedCount : 0,
	getDangerLevel : ()=>{
		return 0;
	},
	translate : (pair)=>{

		if(pair.field == 'serverPort'){
			pair.field = '服务端口';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(healObject.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{
		
		configTable.serverPort = obj.serverPort;
		thisobj.serverPort = obj.serverPort;
		
		if(!thisobj.serverPort){
			console.error('读取配置：服务端口失败！');
			return false;
		}
		
		if(!healObject.loadconfig(obj))
			return false;
		
		return true;
	},
	inputcb : (cb)=>{

		var stage3 = (cb2)=>{
			
			var sayString = '【深蓝流水线】请选择连接的服务端口(1000~65535):';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 1000 && val <= 65535){
					configTable.serverPort = val;
					thisobj.serverPort = val;
					
					var sayString2 = '当前已选择:服务端口[' + thisobj.serverPort + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}
		
		Async.series([stage3, healObject.inputcb], cb);
	},
	execute : ()=>{

		callSubPlugins('init');

		socket = require('socket.io-client')('http://localhost:'+thisobj.serverPort, { reconnection: true });

		socket.on('connect', ()=>{
			console.log('连接到深蓝节点');
			socket.emit('register', {
				state : thisobj.state,
				player_name : cga.GetPlayerInfo().name,
				job_name : '鉴定',
			});
		});
		
		socket.on('init', (data)=>{
			thisobj.craft_player = data.craft_player;
			thisobj.craft_materials = data.craft_materials;
		});

		socket.on('exchange', ()=>{
			thisobj.state = 'exchange';
			console.log('进入交易阶段');
		})

		socket.on('disconnect', ()=>{
			console.log('退出深蓝节点');
		});
				
		socket.on('addteam', ()=>{
			if(thisobj.state == 'ready_addteam'){
				console.log('进入组队阶段');
				thisobj.state = 'addteam';
				addTeam(loop);
			}
		});

		loop();
	},
};

module.exports = thisobj;