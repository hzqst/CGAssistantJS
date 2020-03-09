var cga = global.cga;
var configTable = global.configTable;

var socket = null;

var isFabricName = (name)=>{
	return name == '麻布' || name == '木棉布' || name == '毛毡';
}

//购买原材料需求的5倍（即造5件的量）
const MATERIALS_MULTIPLE_TIMES = 5;

var thisobj = {
	func : (cb) =>{
		thisobj.object.func(cb);
	},
	doneManager : (cb)=>{
		thisobj.object.doneManager(cb);
	},
	object : {
		name :'买布',
		func : (cb) =>{

			if(Object.keys(thisobj.object.gatherCount) == 0){
				setTimeout(thisobj.object.func, 1500, cb);
				return;
			}
			
			if(thisobj.check_done()){
				cb(true);
				return
			}

			console.log('开始买布...');
			
			var buyArray = [];
			if(thisobj.object.gatherCount['麻布']){
				buyArray.push({index:0, count: thisobj.object.gatherCount['麻布']});
			}
			if(thisobj.object.gatherCount['木棉布']){
				buyArray.push({index:1, count: thisobj.object.gatherCount['木棉布']});
			}
			if(thisobj.object.gatherCount['毛毡']){
				buyArray.push({index:2, count: thisobj.object.gatherCount['毛毡']});
			}

			cga.craft.buyFabricLv1Multi(buyArray, ()=>{
				if(!thisobj.check_done()){
					thisobj.object.func(cb);
					return;
				}
				cb(true);
			});
		},
		doneManager : (cb)=>{
			thisobj.object.state = 'done';
			
			var repeat = ()=>{
				
				console.log('更新买布状态：'+thisobj.object.state);
				
				if(!thisobj.check_done()){
					thisobj.object.state = 'gathering';
					socket.emit('gathering');
					cb(true);
					return;
				}
				
				if(thisobj.object.state == 'done'){
					var count = {};
					var stuffs = 
					{
						itemFilter : (item)=>{
							if(!isFabricName(item.name))
								return false;
							
							if(typeof count[item.name] == 'undefined')
								count[item.name] = 0;
							
							if(count[item.name] >= thisobj.object.gatherCount[item.name])
								return false;
							
							count[item.name] += item.count;
							return true;
						}
					}
					
					var filteredStuffs = cga.getInventoryItems().filter(stuffs.itemFilter);
					
					socket.emit('done', { count : count });
				}

				setTimeout(repeat, 1500);
			}
			
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
				[33, 88]
				], ()=>{
					cga.turnTo(35, 88);
					setTimeout(repeat, 1000);
				});
			});
		},
		state : 'gathering',
		gatherCount : {},
	},
	check_done : ()=>{
		if(Object.keys(thisobj.object.gatherCount) == 0)
			return false;
		
		for(var key in thisobj.object.gatherCount){
			if(cga.getItemCount(key) < thisobj.object.gatherCount[key])
				return false;
		}

		return true;
	},
	translate : (pair)=>{
		
		if(pair.field == 'serverPort'){
			pair.field = '服务端口';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		return false;
	},
	loadconfig : (obj, cb)=>{
		configTable.serverPort = obj.serverPort;
		thisobj.serverPort = obj.serverPort;
		
		if(!thisobj.serverPort){
			console.error('读取配置：服务端口失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【采集插件】请选择连接的服务端口(1000~65535):';
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, val)=>{
			if(val !== null && val >= 1000 && val <= 65535){
				configTable.serverPort = val;
				thisobj.serverPort = val;
				
				var sayString2 = '当前已选择:服务端口[' + thisobj.serverPort + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb(null);
				
				return false;
			}
			
			return true;
		});
	},
	init : ()=>{

		socket = require('socket.io-client')('http://localhost:'+thisobj.serverPort, { reconnection: true });

		socket.on('connect', ()=>{
			console.log('成功连接到双百节点');
			socket.emit('register', {
				state : thisobj.object.state,
				player_name : cga.GetPlayerInfo().name,
				job_name : thisobj.object.name,
			});
		});
		
		socket.on('init', (data)=>{
			thisobj.craft_player = data.craft_player;
			thisobj.craft_materials = data.craft_materials;
			if(data.craft_materials){
				//重置材料需求
				thisobj.object.gatherCount = {};
				data.craft_materials.forEach((m)=>{
					if(isFabricName(m.name)){
						thisobj.object.gatherCount[m.name] = m.count * MATERIALS_MULTIPLE_TIMES;						
					}
				});
			}
			
			console.log(thisobj.object.gatherCount);
		});

		socket.on('trade', (required_stuffs)=>{

			thisobj.object.state = 'trading';
			
			var count = {};
			var stuffs = 
			{
				itemFilter : (item)=>{
					if(!isFabricName(item.name))
						return false;
					
					if(typeof count[item.name] == 'undefined')
						count[item.name] = 0;
					
					if(count[item.name] >= thisobj.object.gatherCount[item.name])
						return false;
					
					count[item.name] += item.count;
					return true;
				}
			}

			cga.waitTrade(stuffs, null, (result)=>{
				if(result && result.success == true)
					cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
				
				thisobj.object.state = 'done';
			});
		});
		
		socket.on('endtrade', ()=>{
			if(thisobj.object.state == 'trading'){
				thisobj.object.state = 'done';
				//cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
			}
		});
		
		socket.on('disconnect', ()=>{
			console.log('退出双百节点');
		});
	}
}

module.exports = thisobj;