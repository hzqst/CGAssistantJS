var Async = require('async');
var cga = global.cga;
var configTable = global.configTable;

var healObject = require('./../公共模块/治疗自己');

var craft_count = 0;
var craft_target = null;

const MULTIPLE_CRAFT_COUNT = 3;

const io = require('socket.io')();

io.on('connection', (socket) => { 

	socket.emit('init', {
		craft_player : cga.GetPlayerInfo().name,
		craft_materials : craft_target ? craft_target.materials : [],
	});
	
	socket.on('register', (data) => {
		socket.cga_data = data;
		socket.join('gather_'+data.gather_name);
		console.log(socket.cga_data.player_name +' 已加入双百节点');
	});

	socket.on('done', (data) => {
		socket.cga_data.count = data.count;
		socket.cga_data.state = 'done'; 
	});
	
	socket.on('ready_addteam', () => {
		console.log('ready_addteam');
		socket.cga_data.state = 'ready_addteam'; 
	});
	
	socket.on('traveling', () => {
		console.log('traveling');
		socket.cga_data.state = 'traveling'; 
	});
	
	socket.on('exchange_finish', (fn) => {
		if(socket.cga_data.state == 'exchange')
		{
			socket.cga_data.state = 'exchange_finish'; 
			
			var count = 0;
			cga.getInventoryItems().forEach((inv)=>{
				if( inv.itemid == 18526 && inv.assessed == false )
					count ++;
			})
			
			console.log('交易阶段结束：'+count);
			
			fn(count);
		}
	});
	
	socket.on('disconnect', (err) => {
		if(socket.cga_data)
			console.log(socket.cga_data.player_name +' 已退出双百节点');
	})
});

var waitStuffs = (name, materials, cb)=>{
	
	console.log('等待材料 ' + name);

	var repeat = ()=>{
		var s = io.in('buddy_'+name).sockets;
		var find_player = null;
		for(var key in s){
			if(s[key].cga_data &&
			s[key].cga_data.job_name == name &&
			s[key].cga_data.state == 'done' ){
				find_player = s[key];
				break;
			}
		}
		
		if(find_player){
			
			console.log('等待材料... ' + name);
			
			find_player.cga_data.state = 'trade';
			find_player.emit('init', {
				craft_player : cga.GetPlayerInfo().name,
				craft_materials : materials,
			});
			
			find_player.emit('trade');

			var unit = cga.findPlayerUnit(find_player.cga_data.player_name);

			if(unit == null || unit.xpos != 34 || unit.ypos != 45){
				setTimeout(repeat, 1000);
				return;
			}

			setTimeout(()=>{
				var stuffs = { gold:0 };

				/*if(find_player.cga_data.gather_name == '百里香'){
					stuffs.gold += find_player.cga_data.count * 1;
				}*/
				cga.positiveTrade(find_player.cga_data.player_name, stuffs, null, (result)=>{
					if (result.success == true){
						cb(true);
					} else {
						find_player.emit('endtrade');
						setTimeout(repeat, 1500);
					}
				});
			}, 1500);

			return;
		}
		
		setTimeout(repeat, 1000);
	}

	cga.walkList([
		[35, 45]
	], ()=>{
		cga.TurnTo(34, 45);
		setTimeout(repeat, 500);
	});
}

//等待鉴定归还药?
var exchangeItem2 = (name, cb)=>{

	var s = io.in('buddy_鉴定').sockets;
	var find_player = null;
	for(var key in s){
		if(s[key].cga_data &&
		s[key].cga_data.player_name == name &&
		s[key].cga_data.state == 'exchange' || s[key].cga_data.state == 'exchange_finish'){
			find_player = s[key];
			break;
		}
	}
	
	var stuffs = 
	{
		itemFilter : (item)=>{
			if(find_player.cga_data.state == 'exchange_finish')
				return (item.itemid == 18526);
			
			return false;
		}
	}
	
	if(find_player){
		
		console.log('交易阶段： ' + find_player.cga_data.state);
		
		cga.waitTrade(stuffs, null, (result)=>{
			if(find_player.cga_data.state == 'exchange_finish')
				cb(null);
			else
				exchangeItem2(name, cb);
		});
	} else {
		console.log(new Error('未找到鉴定师，可能已掉线'));
		cb(new Error('未找到鉴定师，可能已掉线'));
	}
}

//交易给鉴定未开光深蓝
var exchangeItem = (name, cb)=>{

	var s = io.in('buddy_鉴定').sockets;
	var find_player = null;
	for(var key in s){
		if(s[key].cga_data &&
		s[key].cga_data.player_name == name &&
		s[key].cga_data.state == 'exchange'){
			find_player = s[key];
			break;
		}
	}
	
	var stuffs = 
	{
		itemFilter : (item)=>{
			return (item.itemid == 15630);
		}
	}

	if(find_player){

		console.log('exchangeItem')

		setTimeout(()=>{
			cga.positiveTrade(name, stuffs, null, (result)=>{
				if(result && result.success == true)
				{
					exchangeItem2(name, cb);
					return;
				}
				
				exchangeItem(name, cb);
			});
		}, 1500);
		
	} else {
		cb(new Error('未找到鉴定师，可能已掉线'));
	}
}

var getInRoom = (name, cb)=>{
	cga.walkList([
	[40, 20],
	], ()=>{
		cga.TurnTo(40, 18);
		cga.AsyncWaitNPCDialog(()=>{
			cga.ClickNPCDialog(4, 0);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(1, 0);
				cga.AsyncWaitMovement({map:'教室'}, ()=>{
					cga.walkList([
					[7, 7],
					[7, 6],
					[7, 7],
					[7, 6],
					[7, 7],
					], ()=>{
						exchangeItem(name, cb);
					});
				});
			});
		})
	});
}

var waitAssess = (cb)=>{

	console.log('等待鉴定师');

	cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);

	var s = io.in('buddy_鉴定').sockets;
	var find_player = null;
	for(var key in s){
		if(s[key].cga_data &&
		(s[key].cga_data.state == 'ready_addteam' || s[key].cga_data.state == 'addteam') ){
			find_player = s[key];
			break;
		}
	}
	
	if(find_player){
		
		console.log('等待鉴定师...');

		find_player.cga_data.state = 'addteam';
		find_player.emit('addteam');
		
		cga.waitTeammates([cga.GetPlayerInfo().name, find_player.cga_data.player_name], (r)=>{
			if(r){
				
				find_player.cga_data.state = 'exchange';
				find_player.emit('exchange');
				
				cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false);								
				getInRoom(find_player.cga_data.player_name, cb);
				return;
			}
			setTimeout(waitAssess, 1000, cb);
		});
	}
	else
	{
		setTimeout(waitAssess, 1000, cb);
	}
}

var getExtractedItemCount = (inventory)=>{
	var count = 0;
	inventory.forEach((inv)=>{
		if(inv.itemid == 15630 || (inv.itemid == 18526 && inv.assessed == false))
			count += inv.count;
		else
			count += 1;
	});
	
	return count;
}

var loop = ()=>{
	console.trace();
	callSubPluginsAsync('prepare', ()=>{
		
		var skill = cga.findPlayerSkill('制药');
		
		if(!skill){
			throw new Error('没有制药技能!');
			return;
		}
		
		craft_target = cga.GetCraftsInfo(skill.index).find((craft)=>{
			return craft.name == '香水：深蓝九号';
		})
		
		if(!craft_target){
			throw new Error('没有习得深蓝的制造配方!');
			return;
		}

		var mapindex = cga.GetMapIndex().index3;
		
		if(mapindex != 4410) {
			if(mapindex == 4415){
				cga.walkList([
				[29, 10, '魔法大学内部'],
				[35, 45],
				], loop);
				return;
			}
			cga.travel.falan.toTeleRoom('魔法大学', ()=>{
				cga.walkList([
				[74, 93, '魔法大学内部'],
				[35, 45],
				], loop);
				return;
			});
			return;
		}

		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < craft_target.cost) {
			cga.TurnTo(35, 47);
			setTimeout(loop, 3000);
			return;
		}
		
		if(playerInfo.health > 0) {
			healObject.func(loop);
			return;
		}

		//物品栏里的东西超过15个
		var inventory = cga.getInventoryItems();
		var count = getExtractedItemCount(inventory);
		console.log(count);
		if(count >= 15 && inventory.find((inv)=>{
			return inv.itemid == 15630;
		}) != undefined){
			waitAssess(loop);
			return;
		}

		io.sockets.emit('init', {
			craft_player : cga.GetPlayerInfo().name,
			craft_materials : craft_target ? craft_target.materials : [],
		});

		var lackStuffs = null;
		craft_target.materials.forEach((mat)=>{
			if(cga.getItemCount(mat.name) < mat.count){
				lackStuffs = mat;
				return false;
			}
		})

		if(lackStuffs !== null){
			waitStuffs(lackStuffs.name, craft_target.materials, loop);
			return;
		}

		var craft = ()=>{

			//没蓝
			var playerInfo = cga.GetPlayerInfo();
			if(playerInfo.mp < craft_target.cost){
				loop();
				return;
			}
			
			//物品栏里的东西超过15个
			var inventory = cga.getInventoryItems();
			var count = getExtractedItemCount(inventory);
			console.log(count);
			if(count >= 15 && inventory.find((inv)=>{
				return inv.itemid == 15630;
			}) != undefined){
				loop();
				return;
			}

			console.log('开始制造');
			
			cga.craftItemEx({
				craftitem : craft_target.name,
				immediate : true
			}, (err, results)=>{
				console.log(err);
				if(results && results.success){
					craft_count ++;
					console.log('已造' + craft_count + '次');
					setTimeout(craft, 500);
				} else {
					setTimeout(loop, 500);
				}
				
			});
		}
		
		craft();		
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		return 0;
	},
	translate : (pair)=>{

		if(pair.field == 'listenPort'){
			pair.field = '监听端口';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(healObject.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{
		
		configTable.listenPort = obj.listenPort;
		thisobj.listenPort = obj.listenPort
		
		if(!thisobj.listenPort){
			console.error('读取配置：监听端口失败！');
			return false;
		}
		
		if(!healObject.loadconfig(obj))
			return false;
		
		return true;
	},
	inputcb : (cb)=>{

		var stage3 = (cb2)=>{
			
			var sayString = '【深蓝流水线】请选择服务监听端口: 1000~65535';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 1000 && val <= 65535){
					configTable.listenPort = val;
					thisobj.listenPort = val;
					
					var sayString2 = '当前已选择:监听端口='+thisobj.listenPort+'。';
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
		io.listen(thisobj.listenPort);
		callSubPlugins('init');
		loop();
	},
};

module.exports = thisobj;