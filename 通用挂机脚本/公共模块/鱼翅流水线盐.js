var cga = global.cga;
var configTable = global.configTable;

var socket = null;

//挖480个原材料（即12组）,附带8组胡椒
const MATERIALS_MULTIPLE_COUNT = 480;

//一次交易80个（即2组）
const MATERIALS_TRADE_COUNT = 80;

//必须定居新城
cga.travel.gelaer.isSettled = false;
cga.travel.falan.isSettled = false;
cga.travel.newisland.isSettled = true;

var thisobj = {
	func : (cb) =>{
		thisobj.object.func(cb);
	},
	doneManager : (cb)=>{
		thisobj.object.doneManager(cb);
	},
	object : {
		name :'盐',
		func : (cb) =>{
			
			if(thisobj.check_done()){
				cb(null);
				return
			}

			cga.travel.newisland.toStone('D', ()=>{
				cga.walkList([
					[190, 116, '盖雷布伦森林'],
					[199, 211],
				], cb);
			});
		},
		gatherCount : MATERIALS_MULTIPLE_COUNT,
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
					socket.emit('done', { count : cga.getItemCount(thisobj.object.name) });
				}
				
				setTimeout(repeat, 1500);
			}
			
			if(cga.GetMapName() == '哥拉尔镇')
			{
				cga.travel.gelaer.toStone('N', ()=>{
					cga.turnTo(121, 107);
					setTimeout(repeat, 1000);
				});
				return;
			}
			
			console.log('去买胡椒...'); 			
			cga.travel.falan.toTeleRoom('伊尔村', ()=>{
				cga.walkList([
					[12, 17, '村长的家'],
					[6, 13, '伊尔村'],
					[32, 65, '旧金山酒吧'],
					[18, 11],
				], ()=>{
					cga.cleanInventoryEx((it)=>{
						if(it.name == '盐' && it.count < 20)
							return true;
						
						return it.name != '盐' && it.name != '胡椒';
					}, ()=>{
						cga.turnTo(20, 11);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(0, 0);
							cga.AsyncWaitNPCDialog((err, dlg)=>{
								var store = cga.parseBuyStoreMsg(dlg);
								if(!store)
								{
									cb(new Error('商店内容解析失败'));
									return;
								}

								var buyitem = [];
								var emptySlotCount = cga.getInventoryEmptySlotCount();

								store.items.forEach((it)=>{
									if(it.name == '胡椒' && emptySlotCount > 0){
										buyitem.push({index: it.index, count: parseInt(emptySlotCount * 40) });
									}
								});

								cga.BuyNPCStore(buyitem);
								cga.AsyncWaitNPCDialog((err, dlg)=>{
									cga.walkList([
									[7, 19, '伊尔村'],
									], ()=>{
										console.log('正在前往哥拉尔...');
										cga.travel.falan.toCity('哥拉尔镇', ()=>{
											cga.travel.gelaer.toStone('N', ()=>{
												cga.turnTo(121, 107);
												setTimeout(repeat, 1000);
											});
										});
									})
									return;
								});
							});
						});
					});					
				});
			});
		},
		state : 'gathering',
	},
	check_done : (result)=>{

		if(cga.getItemCount(thisobj.object.name) >= 20 && cga.GetMapName() == '哥拉尔镇')
			return true;
		
		return cga.getItemCount(thisobj.object.name) >= thisobj.object.gatherCount;
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
			console.log('成功连接到鱼翅流水线节点');
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
				if( m.name == thisobj.object.name )
					thisobj.object.gatherCount = MATERIALS_MULTIPLE_COUNT;
			});
		});

		socket.on('trade', ()=>{

			thisobj.object.state = 'trading';
			
			var count = 0;
			var count_hujiao = 0;
			var stuffs = 
			{
				itemFilter : (item)=>{

					if (item.name == thisobj.object.name && item.count >= 20 && count < MATERIALS_TRADE_COUNT){
						count += item.count;
						return true;
					}
					
					if (item.name == '胡椒' && item.count >= 20 && count_hujiao < MATERIALS_TRADE_COUNT / 2){
						count_hujiao += item.count;
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
			console.log('退出鱼翅流水线节点');
		});
	}
}

module.exports = thisobj;