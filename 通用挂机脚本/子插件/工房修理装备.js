var cga = global.cga;
var configTable = global.configTable;

const repairFilter = (eq) => {
	if (eq.type >= 0 && eq.type <= 14 && eq.level <= 10) {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] < durability[1] &&
			(
				parseFloat(durability[0])/parseFloat(durability[1]) < 0.75 || durability[0] <= 30
			)
		;
	}
	return false;
}

const repairFilterWeapon = (eq) => {
	if (eq.type >= 0 && eq.type <= 6 && eq.level <= 10) {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] < durability[1] &&
			(
				parseFloat(durability[0])/parseFloat(durability[1]) < 0.75 || durability[0] <= 30
			)
		;
	}
	return false;
}

const repairFilterArmor = (eq) => {
	if (eq.type >= 7 && eq.type <= 14 && eq.level <= 10) {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] < durability[1] &&
			(
				parseFloat(durability[0])/parseFloat(durability[1]) < 0.75 || durability[0] <= 30
			)
		;
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
		return equipped.find((eq2)=>{
			return eq2.name == eq.name;
		}) != undefined && currentEquip.find((eq2)=>{
			return eq2.name == eq.name;
		}) == undefined;
	});
	
	if(item != undefined){
		cga.UseItem(item.pos)
		setTimeout(putupEquipments, 1000, equipped, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const repairLoop = (needRepair, cb)=>{
	cga.turnTo(6, 7);
	cga.AsyncWaitNPCDialog(()=>{
		cga.SellNPCStore(needRepair);
		cga.AsyncWaitNPCDialog(()=>{
			cb(null);
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

		cga.travel.falan.toMineStore(null, ()=>{
			cga.walkList([
			[8, 9],
			], (r)=>{
				var equipped = cga.getEquipItems();
				putdownEquipments(()=>{
					
					var needRepair = [];
					
					cga.getInventoryItems().filter((item)=>{
						if(repairFilter(item)){							
							needRepair.push({
								itemid : item.itemid,
								itempos : item.pos,
								count : 1
							});
						}
					});
					
					repairLoop(needRepair, ()=>{
						putupEquipments(equipped, ()=>{
							cb(null);
						});
					});
				});
			});			
		});
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};

module.exports = thisobj;