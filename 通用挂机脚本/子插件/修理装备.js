var cga = global.cga;
var configTable = global.configTable;

const repairFilter = (eq) => {
	if (eq.type >= 0 && eq.type <= 14 && eq.level <= 10) {
		const durability = cga.getEquipEndurance(eq);
		return durability &&
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
		return durability &&
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
		return durability &&
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
		if(emptyslot == -1)
			throw new Error('物品栏没有空位');
		cga.MoveItem(items[0].pos, emptyslot, -1)
		setTimeout(putdownEquipments, 500, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const putupEquipments = (equipped, cb)=>{
	var item = cga.getInventoryItems().find((eq)=>{
		return equipped.find((eq2)=>{
			return eq2.name == eq.name;
		}) != undefined && cga.getEquipItems().find((eq2)=>{
			return eq2.name == eq.name;
		}) == undefined;
	});
	
	if(item != undefined){
		cga.UseItem(item.pos)
		setTimeout(putupEquipments, 500, equipped, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

const repairLoop = (flags, cb)=>{
	var words = '';
	var item = cga.getInventoryItems().filter(flags == 0 ? repairFilter : ((flags & 1) ? repairFilterArmor : repairFilterWeapon) );
	if (item.length) {
		if (item[0].type >= 0 && item[0].type <= 6){
			words = '修理武器';
			flags |= 1;
		}
		else if (item[0].type >= 7 && item[0].type <= 14){
			words = '修理防具';
			flags |= 2;
		}
	}
	
	if(!words.length)
	{
		setTimeout(cb, 1000);
		return;
	}
	
	var tradePlayerName = '';
	cga.waitTrade({
		itemFilter : (words == '修理武器') ? repairFilterWeapon : repairFilterArmor,
	}, (playerName, received)=>{
		tradePlayerName = playerName;
		return true;
	}, (result)=>{
		if(result.success == true){
			
		}
		cga.waitTrade({

		}, (playerName, received)=>{
			return (tradePlayerName == playerName);
		}, (result)=>{
			if(result.success == true){
				
			}
			if(flags == 3)
				setTimeout(cb, 1000);
			else
				setTimeout(repairLoop, 1000, flags, cb);
		});
	});
	
	cga.SayWords(words, 0, 3, 1);
}

module.exports = {
	prepare : (cb)=>{
		var items = cga.getEquipItems().filter(repairFilter);
		if(!items.length){
			cb(null);
			return;
		}
		
		cga.travel.falan.toStone('M3', ()=>{
			cga.walkList([
			[82, 8]
			], ()=>{
				cga.TurnTo(84, 8);
				setTimeout(()=>{
					cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);
					cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false);
					setTimeout(()=>{
						var equipped = cga.getEquipItems();
						putdownEquipments(()=>{
							repairLoop(0, ()=>{
								putupEquipments(equipped, ()=>{
									cga.EnableFlags(cga.ENABLE_FLAG_TRADE, false);
									cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, true);
									cb(null);
								});
							});
						});
					}, 1000);
				}, 1000);
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