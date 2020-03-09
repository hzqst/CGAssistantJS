var cga = global.cga;
var configTable = global.configTable;

var socket = null;

//购买原材料需求的3倍（即造3件的量）
const MATERIALS_MULTIPLE_TIMES = 3;

var thisobj = {
	func : (cb) =>{
		thisobj.object.func(cb);
	},
	doneManager : (cb)=>{
		thisobj.object.doneManager(cb);
	},
	object : {
		name :'铜条',
		func : (cb) =>{
			
			if(thisobj.object.gatherCount === null){
				setTimeout(thisobj.object.func, 1500, cb);
				return;
			}
			
			if(thisobj.check_done()){
				cb(null);
				return
			}
			
			cga.travel.falan.toStone('W1', ()=>{
				cga.walkList([
				[22, 87, '芙蕾雅'],
				[351, 145, '国营第24坑道 地下1楼'],
				], cb);
			});
		},
		gatherCount : null,
		doneManager : (cb)=>{
			
			var exchange = (cb2)=>{			
				cga.travel.falan.toMineStore('铜', ()=>{
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(0, 0);
						cga.AsyncWaitNPCDialog(()=>{
							var exchangeCount = cga.getItemCount('铜') / 20;
							cga.BuyNPCStore([{index:0, count:exchangeCount}]);
							cga.AsyncWaitNPCDialog(()=>{
								cb2(null);
							});
						});
					});
				});
			}
			
			exchange(()=>{
				thisobj.object.state = 'done';
			
				var repeat = ()=>{

					if(!thisobj.check_done()){
						thisobj.object.state = 'gathering';
						socket.emit('gathering');
						cb(true);
						return;
					}

					if(thisobj.object.state == 'done'){
						socket.emit('done', { count : cga.getItemCount('铜条') });
					}
					
					setTimeout(repeat, 1500);
				}
				
				cga.travel.falan.toStone('C', ()=>{
					cga.walkList([
					[33, 88]
					], ()=>{
						cga.TurnTo(35, 88);
						setTimeout(repeat, 1000);
					});
				});
			});
		},
		state : 'gathering',
	},
	check_done : ()=>{
		if(thisobj.object.gatherCount === null)
			return false;

		return (cga.getItemCount('铜') / 20 + cga.getItemCount('铜条')) >= thisobj.object.gatherCount;
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
			data.craft_materials.forEach((m)=>{
				if( m.name == '铜条' )
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
					
					if (item.name == '铜条'){
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
			console.log('退出双百节点');
		});
	}
}

module.exports = thisobj;