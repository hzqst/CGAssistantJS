var cga = global.cga;
var configTable = global.configTable;

var doneArray = [
{
	name: '换条存银行',
	func: (cb, mineObject)=>{
		cga.travel.falan.toMineStore(mineObject.name, ()=>{
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(0, 0);
				cga.AsyncWaitNPCDialog(()=>{
					var exchangeCount = cga.getItemCount(mineObject.name) / 20;
					var r = cga.BuyNPCStore([{index:0, count:exchangeCount}]);
					cga.AsyncWaitNPCDialog(()=>{
						cga.travel.falan.toBank(()=>{
							cga.AsyncWaitNPCDialog(()=>{
								cga.saveToBankAll(mineObject.name+'条', 20, (r)=>{
									cb(r);
								});
							});
						});
					});
				});
			});
		});
	}
},
{
	name: '直接存银行',
	func: (cb, mineObject)=>{
		cga.travel.falan.toBank(()=>{
			cga.AsyncWaitNPCDialog(()=>{
				cga.saveToBankAll(mineObject.name, 20, (r)=>{
					cb(r);
				});
			});
		});
	}
},
{
	name: '卖店',
	func: (cb, mineObject)=>{
		cga.travel.falan.toStone('C', ()=>{
			cga.walkList([
			[30, 79],
			], ()=>{
				cga.TurnTo(30, 77);
				cga.AsyncWaitNPCDialog(()=>{	
					cga.ClickNPCDialog(0, 0);
					cga.AsyncWaitNPCDialog(()=>{

						var sell = cga.findItemArray(mineObject.name);
						var sellArray = sell.map((item)=>{
							item.count /= 20;
							return item;
						});

						var pattern = /(.+)的卡片/;
						cga.getInventoryItems().forEach((item)=>{
							if(item.name == '魔石' || item.name == '卡片？' || pattern.exec(item.name) ){
								sellArray.push({
									itempos : item.pos,
									itemid : item.itemid,
									count : (item.count < 1) ? 1 : item.count,
								});
							} else if(mineObject && mineObject.extra_selling && mineObject.extra_selling(item)){
								sellArray.push({
									itempos : item.pos,
									itemid : item.itemid,
									count : item.count / 20,
								});
							}
						})

						cga.SellNPCStore(sellArray);
						cga.AsyncWaitNPCDialog(()=>{
							cga.walkList([
							[27, 82]
							], ()=>{
								cb(true);
							});
						});
					});
				});
			});
		});
	}
},
{
	name: '刷双百-布店交易位置1',
	func: (cb, mineObject)=>{
		var count = cga.getItemCount(mineObject.name);
		if(count < 20){
			cb(true);
			return;
		}
		
		cga.travel.falan.toFabricStore((r)=>{

			var wait_trade_player = ()=>{
				
				var teamplayers = cga.getTeamPlayers();
								
				if(!(teamplayers.length >= 2 && teamplayers[1].is_me)){
					if(!teamplayers.length){
						cb(true);
						return;
					}
					setTimeout(wait_trade_player, 1000);
					return;
				}
				
				var count = 0;
				var stuff = 
				{
					itemFilter : (item)=>{
						if(item.name == mineObject.name && item.count >= 20 && count < mineObject.gatherCount){
							count ++;
							return true;
						}
						return false;
					}
				}

				cga.trade(trade_player, stuff, null, (result)=>{
					console.log(result);
					cb(true);
				});
			}
			
			var wait_team_player = ()=>{
								
				cga.WalkTo(8, 8);
				
				cga.addTeammate(trade_player, (r)=>{
					if(r){
						wait_trade_player();						
						return;
					}

					setTimeout(wait_team_player, 1000);
				});
			}
			
			setTimeout(wait_team_player, 1000);
		});
	}
},
{
	name: '刷双百-布店交易位置2',
	func: (cb, mineObject)=>{
		var count = cga.getItemCount(mineObject.name);
		if(count < 20){
			cb(true);
			return;
		}
		
		cga.travel.falan.toFabricStore((r)=>{

			var wait_trade_player = ()=>{
				
				var teamplayers = cga.getTeamPlayers();
								
				if(!(teamplayers.length >= 2 && teamplayers[1].is_me)){
					if(!teamplayers.length){
						cb(true);
						return;
					}
					setTimeout(wait_trade_player, 1000);
					return;
				}
				
				var count = 0;
				var stuff = 
				{
					itemFilter : (item)=>{
						if(item.name == mineObject.name && item.count >= 20 && count < mineObject.gatherCount){
							count ++;
							return true;
						}
						return false;
					}
				}

				cga.trade(trade_player, stuff, null, (result)=>{
					console.log(result);
					cb(true);
				});
			}
			
			var wait_team_player = ()=>{
								
				cga.WalkTo(8, 8);
				
				cga.addTeammate(trade_player, (r)=>{
					if(r){
						wait_trade_player();						
						return;
					}

					setTimeout(wait_team_player, 1000);
				});
			}
			
			setTimeout(wait_team_player, 1000);
		});
	}
},
{
	name: '刷双百-桥头交易位置1',
	func: (cb, mineObject)=>{
		var count = cga.getItemCount(mineObject.name);
		if(count < 20){
			cb(true);
			return;
		}
		
		cga.travel.falan.toStone('C', ()=>{
			cga.walkList([
			[41, 98, '法兰城'],
			], ()=>{
				var wait_trade_player = ()=>{
					
					var teamplayers = cga.getTeamPlayers();
									
					if(!(teamplayers.length >= 2 && teamplayers[1].is_me)){
						if(!teamplayers.length){
							cb(true);
							return;
						}
						setTimeout(wait_trade_player, 1000);
						return;
					}
					
					var count = 0;
					var stuff = 
					{
						itemFilter : (item)=>{
							if(item.name == mineObject.name && item.count >= 20 && count < mineObject.gatherCount){
								count ++;
								return true;
							}
							return false;
						}
					}

					cga.trade(trade_player, stuff, null, (result)=>{
						console.log(result);
						cb(true);
					});
				}

				var wait_team_player = ()=>{
									
					cga.WalkTo(153, 122);
					
					cga.addTeammate(trade_player, (r)=>{
						if(r){
							wait_trade_player();						
							return;
						}

						setTimeout(wait_team_player, 1000);
					});
				}

				setTimeout(wait_team_player, 1000);
			});
		});
	}
}
]

var thisobj = {
	func : (cb, mineObject)=>{
		thisobj.object.func(cb, mineObject);
	},
	translate : (pair)=>{
		if(pair.field == 'doneObject'){
			pair.field = '采集完成后操作';
			pair.value = doneArray[pair.value].name;
			pair.translated = true;
			return true;
		}

		return false;
	},
	loadconfig : (obj, cb)=>{
		for(var i in doneArray){
			if(i == obj.doneObject){
				configTable.doneObject = i;
				thisobj.object = doneArray[i];
				break;
			}
		}
		
		if(!thisobj.object){
			console.error('读取配置：采集完成后操作失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		
		var stage1 = (cb2)=>{
			var sayString = '【采集插件】请选择采集完成后操作:';
			for(var i in doneArray){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + doneArray[i].name;
			}
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && doneArray[index - 1]){
					configTable.doneObject = index - 1;
					thisobj.object = doneArray[index - 1];
					
					var sayString2 = '当前已选择:[' + thisobj.object.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb(null);				
					return true;
				}
				
				return false;
			});
		}
		
		stage1();
	}
}

module.exports = thisobj;