var cga = global.cga;
var configTable = global.configTable;

var socket = null;

const MATERIALS_MULTIPLE_TIMES = 3;

var thisobj = {
	func : (cb) =>{
		thisobj.object.func(cb);
	},
	doneManager : (cb)=>{
		thisobj.object.doneManager(cb);
	},
	supplyManager : (cb)=>{
		thisobj.object.supplyManager(cb);
	},
	object : {
		name :'魔法红萝卜',
		func : (cb) =>{
			
			if(thisobj.object.gatherCount === null){
				setTimeout(thisobj.object.func, 1500, cb);
				return;
			}
			
			if(thisobj.check_done()){
				cb(null);
				return
			}
			
			if(cga.getItemCount('魔法手套') == 0){
				cga.travel.falan.toTeleRoom('魔法大学', ()=>{
					cga.walkList([
					[117, 164, '仓库内部'],
					[18, 10],
					], ()=>{
						cga.TurnTo(18, 8);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.walkList([
								[6, 14, '魔法大学'],
								], ()=>{
									thisobj.object.func(cb);
								});
							});
						})
					});
				});
				return;
			}
			
			cga.travel.falan.toTeleRoom('魔法大学', ()=>{
				cga.walkList([
				[32, 167],
				], cb);
			});
		},
		gatherCount : null,
		doneManager : (cb)=>{
			thisobj.object.state = 'done';
			
			var repeat = ()=>{

				if(!thisobj.check_done()){
					thisobj.object.state = 'gathering';
					socket.emit('gathering');
					cb(true);
					return;
				}

				if(thisobj.object.state == 'done'){
					socket.emit('done', { count : cga.getItemCount('魔法红萝卜') });
				}
				
				setTimeout(repeat, 1500);
			}
			
			if(cga.GetMapName() == '魔法大学内部')
			{
				cga.walkList([
				[34, 45],
				], ()=>{
					cga.TurnTo(36, 45);
					setTimeout(repeat, 1000);
				});
			}
			else
			{
				cga.travel.falan.toTeleRoom('魔法大学', ()=>{
					cga.walkList([
					[74, 93, '魔法大学内部'],
					[34, 45],
					], ()=>{
						cga.TurnTo(36, 45);
						setTimeout(repeat, 1000);
					});
				});
			}
		},
		supplyManager : (cb)=>{
			var mapname = cga.GetMapName();
			if(mapname == '魔法大学内部')
			{
				cga.walkList([
				[34, 45],
				], ()=>{
					cga.TurnTo(35, 46);
					setTimeout(cb, 3000);
				});
			}
			else if(mapname == '魔法大学')
			{
				cga.walkList([
				[74, 93, '魔法大学内部'],
				[34, 45],
				], ()=>{
					cga.TurnTo(35, 46);
					setTimeout(cb, 3000);
				});
			}
		},
		state : 'gathering',
		extra_dropping : (item)=>{
			return (item.name == '苹果薄荷' && item.count >= 40);
		},
	},
	check_done : ()=>{
		if(thisobj.object.gatherCount === null)
			return false;
		
		return cga.getItemCount('魔法红萝卜') >= thisobj.object.gatherCount;
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
			console.log('成功连接到深蓝节点');
			socket.emit('register', {
				state : thisobj.object.state,
				player_name : cga.GetPlayerInfo().name,
				job_name : thisobj.object.name,
			});
		});
		
		socket.on('init', (data)=>{
			thisobj.craft_player = data.craft_player;
			thisobj.craft_materials = data.craft_materials;
			data.craft_materials.forEach((m)=>{
				if( m.name == '魔法红萝卜' )
					thisobj.object.gatherCount = m.count * MATERIALS_MULTIPLE_TIMES;
			});
		});

		socket.on('trade', ()=>{

			thisobj.object.state = 'trading';
			
			var count = 0;
			var stuffs = 
			{
				itemFilter : (item)=>{
					if(count >= thisobj.object.gatherCount)
						return false;
					
					if (item.name == '魔法红萝卜' && item.count >= 20){
						count += item.count;
						return true;
					}
					
					return false;
				}
			}

			cga.waitTrade(stuffs, null, (result)=>{
				if(result && result.success == true)
					cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
				
				thisobj.object.state = 'done';
			});
		})

		socket.on('endtrade', ()=>{
			if(thisobj.object.state == 'trading'){
				thisobj.object.state = 'done';
				//cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
			}
		});

		socket.on('disconnect', ()=>{
			console.log('退出深蓝节点');
		});
	}
}

module.exports = thisobj;