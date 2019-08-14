var Async = require('async');
var cga = global.cga;
var configTable = global.configTable;

var craft_count = 0;
var craft_target = null;

var isFabricName = (name)=>{
	return name == '麻布' || name == '木棉布' || name == '毛毡';
}

const io = require('socket.io')();

io.on('connection', (socket) => { 

	console.log('A client is connected');
	
	socket.emit('init', {
		craft_player : cga.GetPlayerInfo().name,
		craft_materials : craft_target ? craft_target.materials : [],
	});
	
	socket.on('register', (data) => {
		socket.cga_data = data;
		socket.join('gather_'+data.gather_name);
		console.log('client '+ socket.cga_data.player_name +' is registered');
	});

	socket.on('done', (data) => {
		socket.cga_data.count = data.count;
		socket.cga_data.state = 'done'; 
	});
	
	socket.on('gathering', () => {
		socket.cga_data.state = 'gathering'; 
	});
	
	socket.on('disconnect', (err) => {
		if(socket.cga_data)
			console.log('client '+ socket.cga_data.player_name +' is disconnected');
	})
});

var wait_stuffs = (name, materials, cb)=>{

	console.log('wait_stuffs ' + name);

	var repeat = ()=>{
		var s = io.in('gather_'+name).sockets;
		var find_player = null;
		for(var key in s){
			if(s[key].cga_data &&
			((s[key].cga_data.gather_name == name) || (s[key].cga_data.gather_name == '买布' && isFabricName(name))) &&
			s[key].cga_data.state == 'done' ){
				find_player = s[key];
				break;
			}
		}
		
		if(find_player){
			
			find_player.cga_data.state = 'trade';
			find_player.emit('init', {
				craft_player : cga.GetPlayerInfo().name,
				craft_materials : materials,
			});
			find_player.emit('trade');

			var unit = cga.findPlayerUnit(find_player.cga_data.player_name);

			if(unit == null || unit.xpos != 33 || unit.ypos != 88){
				setTimeout(repeat, 1500);
				return;
			}

			cga.positiveTrade(find_player.cga_data.player_name, {

			}, null, (result)=>{
				if (result.success == true){
					cb(true);
				} else {
					find_player.emit('endtrade');
					setTimeout(repeat, 1500);
				}
			});

			return;
		}
		
		setTimeout(repeat, 1500);
	}

	cga.travel.falan.toStone('C', ()=>{
		cga.walkList([
		[34, 88]
		], ()=>{
			cga.TurnTo(32, 88);
			setTimeout(repeat, 1000);
		});
	});
}

var healObject = require('./../公共模块/治疗自己');

var craftSkillList = cga.GetSkillsInfo().filter((sk)=>{
	return (sk.name.indexOf('制') == 0 || sk.name.indexOf('造') == 0 );
});

var allowMats = ['麻布', '印度轻木', '铜条', '鹿皮', '毛毡', '木棉布'];

var getBestCraftableItem = ()=>{
	var item = null;
	for(var i = thisobj.craftItemList.length - 1; i >= 0; i--){
		if(thisobj.craftItemList[i].level > thisobj.craftSkill.level)
			continue;
		
		var allow = true;

		thisobj.craftItemList[i].materials.forEach((mat)=>{

			if(allowMats.find((m)=>{ return m == mat.name} ) == undefined){
				allow = false;
				return false;
			}
		})
		
		if(allow == false)
			continue;
		
		item = thisobj.craftItemList[i];
		break;
	}
	
	return item;
}

var loop = ()=>{

	callSubPluginsAsync('prepare', ()=>{
		
		craft_target = getBestCraftableItem();
		if(!craft_target){
			throw new Error('没有可制造的双百物品!');
			return;
		}

		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < craft_target.cost) {
			cga.travel.falan.toCastleHospital(()=>{
				setTimeout(loop, 3000);
			});
			return;
		}
		
		if(playerInfo.health > 0) {
			healObject.func(loop);
			return;
		}
		
		if(cga.getInventoryItems().length >= 15){
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
					[41, 98, '法兰城'],
					[151, 122],
				], ()=>{
					cga.TurnTo(149, 122);
					var sellarray = cga.findItemArray(craft_target.name);
					cga.sellArray(sellarray, ()=>{
						setTimeout(loop, 1000);
					});
				});
			});
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
			wait_stuffs(lackStuffs.name, craft_target.materials, loop);
			return;
		}
		
		var craft = ()=>{

			var playerInfo = cga.GetPlayerInfo();
			if(playerInfo.mp < craft_target.cost){
				loop();
				return;
			}
			
			if(cga.getInventoryItems().length >= 15){
				loop();
				return;
			}
			
			cga.SetImmediateDoneWork((craft_count > 0) ? true : false);
			
			try
			{
				cga.craftNamedItem(craft_target.name);
				
				cga.AsyncWaitWorkingResult((err, result)=>{
					if(result && result.success){
						craft_count ++;
						console.log('已造' + craft_count + '次');
						craft();
					} else {
						loop();
					}
					
				}, 60000);
			
			}catch(e){
				console.log(e);
				loop();
			}
		}
		
		craft();		
	});
}

var thisobj = {
	craftedCount : 0,
	getDangerLevel : ()=>{
		return 0;
	},
	translate : (pair)=>{
		
		if(pair.field == 'craftType'){
			pair.field = '制造类型';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
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
		
		for(var i in craftSkillList){
			if(craftSkillList[i].name == obj.craftType){
				configTable.craftType = craftSkillList[i].name;
				thisobj.craftSkill = craftSkillList[i];
				thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);
				break;
			}
		}
		
		if(!thisobj.craftSkill){
			console.error('读取配置：制造类型失败！');
			return false;
		}
		
		for(var i in thisobj.craftItemList){
			if(thisobj.craftItemList[i].name == obj.craftItem){
				configTable.craftItem = thisobj.craftItemList[i].name;
				thisobj.craftItem = thisobj.craftItemList[i];
				break;
			}
		}
			
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

		var stage1 = (cb2)=>{
			var sayString = '【双百插件】请选择刷的技能:';
			for(var i in craftSkillList){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + craftSkillList[i].name;
			}
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && craftSkillList[index - 1]){
					configTable.craftType = craftSkillList[index - 1].name;
					thisobj.craftSkill = craftSkillList[index - 1];
					thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);

					var sayString2 = '当前已选择:[' + thisobj.craftSkill.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					return false;
				}
				
				return true;
			});
		}
		
		var stage5 = (cb2)=>{
			
			var sayString = '【双百插件】请选择服务监听端口: 1000~65535';
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
		
		Async.series([stage1, stage5, healObject.inputcb], cb);
	},
	execute : ()=>{
		io.listen(thisobj.listenPort);
		callSubPlugins('init');
		loop();
	},
};

module.exports = thisobj;