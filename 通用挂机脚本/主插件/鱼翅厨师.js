var Async = require('async');
var cga = global.cga;
var configTable = global.configTable;

var craft_count = 0;
var craft_target = null;

var healObject = require('./../公共模块/治疗自己');
var checkSettle = require('./../公共模块/登出检查定居地');

const io = require('socket.io')();

io.on('connection', (socket) => { 

	socket.emit('init', {
		craft_player : cga.GetPlayerInfo().name,
		craft_materials : craft_target ? craft_target.materials : [],
	});
	
	socket.on('register', (data) => {
		socket.cga_data = data;
		socket.join('buddy_'+data.job_name);
		console.log(socket.cga_data.player_name +' 已加入鱼翅节点');
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
			console.log(socket.cga_data.player_name +' 已退出鱼翅节点');
	})
});

var waitStuffs = (name, materials, cb)=>{

	console.log('正在等待材料 ' + name);

	var repeat = ()=>{
		
		//修复：防止面向方向不正确导致无法交易
		if(cga.GetPlayerInfo().direction != 4){
			cga.turnTo(120, 107);
			setTimeout(repeat, 500);
			return;
		}
		
		var s = io.in('buddy_'+name).sockets;
		var find_player = null;
		for(var key in s){
			if(s[key].cga_data &&
			(s[key].cga_data.job_name == name || (name == '胡椒' && (s[key].cga_data.job_name == '鸡蛋' || s[key].cga_data.job_name == '盐')) ) &&
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

			if(unit == null || unit.xpos != 120 || unit.ypos != 107){
				setTimeout(repeat, 1000);
				return;
			}

			setTimeout(()=>{
				var stuffs = { gold : 0 };
				
				cga.positiveTrade(find_player.cga_data.player_name, stuffs, null, (result)=>{
					if (result.success == true){
						cb(null);
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

	cga.travel.gelaer.toStone('N', ()=>{
		cga.walkList([
		[121, 107]
		], ()=>{
			cga.turnTo(120, 107);
			setTimeout(repeat, 500);
		});
	});
}

var getBestCraftableItem = ()=>{
	
	//refresh
	thisobj.craftSkill = cga.findPlayerSkill('料理');
	if(!thisobj.craftSkill)
		return null;
	
	thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);
	
	return thisobj.craftItemList.find((c)=>{
		return c.name == '鱼翅汤';
	});
}

var loop = ()=>{

	callSubPluginsAsync('prepare', ()=>{
		
		if(cga.GetMapName() != '哥拉尔镇')
		{
			cga.LogBack();
			setTimeout(loop, 1000);
			return;
		}
		
		craft_target = getBestCraftableItem();
		if(!craft_target){
			throw new Error('无法制造鱼翅汤，可能料理技能等级不够!');
			return;
		}

		if(cga.getItemCount('鱼翅汤') > 0){
			cga.travel.gelaer.toBank(()=>{
				cga.AsyncWaitNPCDialog(()=>{
					cga.saveToBankAll('鱼翅汤', 3, (err)=>{
						loop();
					});
				});
			});
			return;
		}

		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < craft_target.cost) {
			cga.travel.gelaer.toHospital(()=>{
				setTimeout(loop, 3000);
			});
			return;
		}
		
		if(playerInfo.health > 0) {
			healObject.func(loop);
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
			
			//包满
			if(cga.getInventoryItems().length > 15){
				loop();
				return;
			}

			console.log('开始制造：'+craft_target.name);
			
			cga.craftItemEx({
				craftitem : craft_target.name,
				immediate : true
			}, (err, results)=>{

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
			
			var sayString = '【鱼翅插件】请选择服务监听端口: 1000~65535';
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
		
		checkSettle.func((err, map)=>{
			if(map != '哥拉尔镇')
				throw new Error('必须定居哥拉尔镇!');
			
			loop();
		});
	},
};

module.exports = thisobj;