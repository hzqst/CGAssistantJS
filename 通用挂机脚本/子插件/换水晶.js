var cga = global.cga;
var configTable = global.configTable;

const repairFilter = (eq) => {
	if (eq.type == 22) {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] < 100;
	}
	return false;
}

const putdownEquipments = (cb)=>{
	var items = cga.getEquipItems().filter(repairFilter);
	if(items.length){
		var emptyslot = cga.findInventoryEmptySlot();
		if(emptyslot == -1){
			cb(new Error('物品栏没有空位'));
			return;
		}
		cga.MoveItem(items[0].pos, emptyslot, -1)
		setTimeout(putdownEquipments, 1000, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const putupEquipments = (equipped, cb)=>{
	var currentEquip = cga.getEquipItems();
	var item = cga.getInventoryItems().find((eq)=>{
		
		//必须满耐
		const durability = cga.getEquipEndurance(eq);
		if( durability && durability[0] != durability[1])
			return false;
		
		if( equipped.find((eq2)=>{
			return eq2.name == eq.name;
		}) != undefined){

			var foundEq = currentEquip.find((eq2)=>{
				return eq2.name == eq.name;
			});
			
			if(foundEq == undefined)
				return true;
			
			const durability2 = cga.getEquipEndurance(foundEq);
			if( durability2 && durability2[0] < durability[0])
				return true;
		}
	});
	
	if(item != undefined){
		cga.UseItem(item.pos)
		setTimeout(putupEquipments, 500, equipped, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const repairLoop = (needRepair, cb)=>{
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
				return it.name == needRepair[0].name;
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
		var items = cga.getEquipItems().filter(repairFilter);
		if(!items.length){
			cb(null);
			return;
		}
		
		if(cga.getTeamPlayers().length){
			cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
			setTimeout(thisobj.prepare, 1000, cb);
			return;
		}

		var buy = (cb2)=>{
			var equipped = cga.getEquipItems();
			var needRepair = equipped.filter(repairFilter);
			if(needRepair && needRepair[0]){
				repairLoop(needRepair, ()=>{
					putupEquipments(equipped, ()=>{
						
						var drop = cga.getInventoryItems().filter(repairFilter);
						
						if(drop && drop[0])
						{
							cga.DropItem(drop[0].pos);
							setTimeout(cb2, 1000, null);
						}
						else
						{
							cb2(null);
						}
					});
				});
			} else {
				cb2(null);
			}
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
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};

module.exports = thisobj;