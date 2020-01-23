var cga = global.cga;
var configTable = global.configTable;

const repairFilter = (eq) => {
	if (eq.name == '十周年纪念戒指') {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] < 250;
	}
	return false;
}

const fullFilter = (eq) => {
	if (eq.name == '十周年纪念戒指') {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] == 500;
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
		var equippedItem = equipped.find((eq)=>{
			return item.name == eq.name;
		});
		
		if(equippedItem)
			cga.MoveItem(item.pos, equippedItem.pos, -1);
		else
			cga.UseItem(item.pos);
		
		setTimeout(putupEquipments, 1000, equipped, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const repairLoop = (cb)=>{
	cga.turnDir(0);
	cga.AsyncWaitNPCDialog((err, dlg)=>{
		var banks = cga.GetBankItemsInfo();
		var found = banks.find(fullFilter);
		if(found == undefined){
			cb(new Error('银行里没有满耐的十年戒指'));
			return;
		}
		var emptyslot = cga.findInventoryEmptySlot();
		if(emptyslot == -1){
			cb(new Error('物品栏没有空位，无法从银行取出十年戒指'));
			return;
		}
		console.log(found.pos)
		console.log(emptyslot)
		cga.MoveItem(found.pos, emptyslot, -1);
		setTimeout(cb, 1000, null);
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
			repairLoop((err)=>{
				
				if(err){
					console.log(err);
					cb2(null);
					return;
				}
				
				var equipped = cga.getEquipItems();
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
		} else {
			cga.travel.falan.toBank(()=>{
				cga.walkList([
				[11, 8],
				], ()=>{
					buy(()=>{
						cga.walkList([
							[2, 13, '法兰城'],
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