var cga = global.cga;
var configTable = global.configTable;

var buyArray = [
{
	name : '平民剑',
	type : 0,
},
{
	name : '平民斧',
	type : 1,	
},
{
	name : '平民枪',
	type : 2,	
},
{
	name : '平民弓',
	type : 3,	
},
{
	name : '平民回力镖',
	type : 4,	
},
{
	name : '平民小刀',
	type : 5,	
},
{
	name : '平民杖',
	type : 6,	
}
]

const filterWeapon = (eq) => {
	if (eq.type >= 0 && eq.type <= 6) {
		return true
	}
	return false;
}

const repairFilterWeapon = (eq) => {
	if (eq.type >= 0 && eq.type <= 6 && eq.level <= 10) {
		const durability = cga.getEquipEndurance(eq);
		return durability && durability[0] < durability[1] &&
			(
				parseFloat(durability[0])/parseFloat(durability[1]) < 0.5 || durability[0] <= 30
			)
		;
	}
	return false;
}

const putdownEquipments = (cb)=>{
	var items = cga.getEquipItems().filter(repairFilterWeapon);
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

const putupEquipments = (cb)=>{
	var currentEquip = cga.getEquipItems();
	var item = cga.getInventoryItems().find((eq)=>{
		return eq.name == thisobj.buyWeapon.name && repairFilterWeapon(eq) == false;
	});
	
	if(item != undefined){
		cga.UseItem(item.pos)
		setTimeout(putupEquipments, 1000, cb);
		return;
	}
	
	setTimeout(cb, 1000);
}

var thisobj = {
	prepare : (cb)=>{
		var items = cga.getEquipItems();
		if(items.filter(filterWeapon).length && !items.filter(repairFilterWeapon).length){			
			cb(null);
			return;
		}

		if(cga.getTeamPlayers().length){
			cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
			setTimeout(thisobj.prepare, 1000, cb);
			return;
		}

		cga.travel.falan.toStone('B1', ()=>{
			cga.turnTo(150, 122);
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
					var buyCount = 0;
					var emptySlotCount = cga.getInventoryEmptySlotCount();

					store.items.forEach((it)=>{
						if(it.name == thisobj.buyWeapon.name && buyCount < emptySlotCount){
							buyitem.push({index: it.index, count:1});
							buyCount ++;
						}
					});
					if(!buyitem.length)
					{
						cb(new Error('桥头武器购买失败，可能已被买完或者背包没空间'));
						return;
					}

					cga.BuyNPCStore(buyitem);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(dlg && dlg.message.indexOf('谢谢') >= 0){
							putdownEquipments(()=>{
								putupEquipments(()=>{
									cb(null);
								});
							});
							return;
						}
						else
						{
							cb(null);
							return;
						}
					});
				});
			});
		});
	},
	translate : (pair)=>{
		
		if(pair.field == 'buyWeapon'){
			pair.field = '购买武器';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		return false;
	},
	loadconfig : (obj, cb)=>{
		for(var i in buyArray){
			if(buyArray[i].name == obj.buyWeapon){
				configTable.buyWeapon = buyArray[i].name;
				thisobj.buyWeapon = buyArray[i];
				break;
			}
		}
		
		if(thisobj.buyWeapon === undefined){
			console.error('读取配置：购买武器失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【买桥头装】请选择购买武器:';
		for(var i in buyArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + buyArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{
			if(index !== null && index >= 1 && buyArray[index - 1]){
				configTable.buyWeapon = buyArray[index - 1].name;
				thisobj.buyWeapon = buyArray[index - 1];
				
				var sayString2 = '当前已选择:[' + thisobj.buyWeapon.name + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb(null);
				
				return false;
			}
			
			return true;
		});
	}
};

module.exports = thisobj;