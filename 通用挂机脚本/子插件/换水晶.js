var cga = global.cga;
var configTable = global.configTable;

var buyArray = [
	{
		name : '地水的水晶（5：5）',
		type : 0,
	},
	{
		name : '水火的水晶（5：5）',
		type : 1,	
	},
	{
		name : '火风的水晶（5：5）',
		type : 2,	
	},
	{
		name : '风地的水晶（5：5）',
		type : 3,	
	},
]

const repairFilter = (eq) => {
	if (eq.type == 22) {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] < 150;
	}
	return false;
}

const hasFilter = (eq) => {
	if (eq.type == 22) {
		return true;
	}
	return false;
}

const putdownEquipments = (cb)=>{
	var items = cga.getEquipItems().filter(repairFilter);
	if(items.length){
		/*var emptyslot = cga.findInventoryEmptySlot();
		if(emptyslot == -1){
			cb(new Error('物品栏没有空位'));
			return;
		}
		cga.MoveItem(items[0].pos, emptyslot, -1)*/
		cga.DropItem(items[0].pos);
		setTimeout(putdownEquipments, 1000, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const putupEquipments = (buyCrystal, cb)=>{
	var currentEquip = cga.getEquipItems();
	var item = cga.getInventoryItems().find((eq)=>{
		
		//必须满耐
		const durability = cga.getEquipEndurance(eq);
		if( durability && durability[0] != durability[1])
			return false;
		
		if( buyCrystal.name == eq.name ){
			return true;
		}

		return false;
	});
	
	if(item != undefined){
		cga.UseItem(item.pos)
		setTimeout(putupEquipments, 500, buyCrystal, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const repairEquipments = (buyCrystal, cb)=>{
	cga.turnDir(0);
	cga.AsyncWaitNPCDialog(()=>{
		cga.ClickNPCDialog(0, 0);
		cga.AsyncWaitNPCDialog((err, dlg)=>{
			
			var store = cga.parseBuyStoreMsg(dlg);			
			if(!store)
			{
				cb(new Error('商店内容解析失败'));
				return;
			}
			
			var buyitem = store.items.find((it)=>{
				return it.name == buyCrystal.name;
			});
			if(buyitem == undefined)
			{
				cb(new Error('商店没有该种水晶出售，可能已被买完'));
				return;
			}
			
			cga.BuyNPCStore([{index: buyitem.index, count:1}]);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				if(dlg && dlg.message.indexOf('谢谢') >= 0){					
					cb(null);
					return;
				}
				else
				{
					cb(new Error('购买失败，可能钱不够或物品栏没有空位！'));
					return;
				}
			});
		});
	});
}

var thisobj = {
	prepare : (cb)=>{
		var anyitems = cga.getEquipItems().filter(hasFilter);
		var items = cga.getEquipItems().filter(repairFilter);
		if(!items.length && anyitems.length){
			cb(null);
			return;
		}

		if(cga.GetPlayerInfo().gold < 600){
			cb(null);
			return;
		}
		
		if(cga.getTeamPlayers().length){
			cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
			setTimeout(thisobj.prepare, 1000, cb);
			return;
		}

		var buy = (cb)=>{
			putdownEquipments(()=>{
				repairEquipments(thisobj.buyCrystal, ()=>{
					putupEquipments(thisobj.buyCrystal, ()=>{
						cb(null);
					});
				});
			});
		}
		
		var map = cga.GetMapName();
		var mapindex = cga.GetMapIndex().index3;
		if(map == '圣骑士营地'){
			cga.walkList([
				[92, 118, '商店'],
				[14, 26],
			], ()=>{
				buy(()=>{
					cga.travel.falan.toCamp(cb);
				});
			});
		} else if(mapindex == 44692){
			cga.walkList([
				[0, 20, '圣骑士营地'],
				[92, 118, '商店'],
				[14, 26],
			], ()=>{
				buy(()=>{
					cga.travel.falan.toCamp(cb);
				});
			});
		} else if(mapindex == 44693){
			cga.walkList([
				[30, 37, '圣骑士营地'],
				[92, 118, '商店'],
				[14, 26],
			], ()=>{
				buy(()=>{
					cga.travel.falan.toCamp(cb);
				});
			});
		} else if(mapindex == 44698){
			cga.walkList([
				[3, 23, '圣骑士营地'],
				[92, 118, '商店'],
				[14, 26],
			], ()=>{
				buy(()=>{
					cga.travel.falan.toCamp(cb);
				});
			});
		} else if(mapindex == 44699){
			cga.walkList([
				[14, 26],
			], ()=>{
				buy(()=>{
					cga.travel.falan.toCamp(cb);
				});
			});
		} else if(map == '哥拉尔镇'){
			cga.walkList([
				[146, 117, '魔法店'],
				[18, 12],
			], ()=>{
				buy(()=>{
					cga.walkList([
					[5, 14, '哥拉尔镇'],
					], cb);
				});
			});
		} else {
			cga.travel.falan.toCrystalStore(()=>{
				cga.walkList([
				[17, 18]
				], ()=>{
					buy(()=>{
						cga.walkList([
							[3, 13, '法兰城'],
						], cb);
					});
				});
			});
		}
	},
	translate : (pair)=>{
		
		if(pair.field == 'buyCrystal'){
			pair.field = '购买水晶';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		return false;
	},
	loadconfig : (obj, cb)=>{
		for(var i in buyArray){
			if(buyArray[i].name == obj.buyCrystal){
				configTable.buyCrystal = buyArray[i].name;
				thisobj.buyCrystal = buyArray[i];
				break;
			}
		}
		
		if(thisobj.buyCrystal === undefined){
			console.error('读取配置：购买水晶失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【换水晶】请选择水晶类型:';
		for(var i in buyArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + buyArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{
			if(index !== null && index >= 1 && buyArray[index - 1]){
				configTable.buyCrystal = buyArray[index - 1].name;
				thisobj.buyCrystal = buyArray[index - 1];
				
				var sayString2 = '当前已选择:[' + thisobj.buyCrystal.name + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb(null);
				
				return false;
			}
			
			return true;
		});
	}
};

module.exports = thisobj;