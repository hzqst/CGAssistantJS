var cga = global.cga;
var configTable = global.configTable;

var repairLocArray = [
{
	name : '新城登入点',
	walker : (cb)=>{
		cga.travel.newisland.toStone('X', ()=>{
			cga.walkList([
			[143, 110]
			], cb);
		});
	},
	//武修和防修的面向方向
	dir : [6, 2]
},
{
	name : '新城登入点',
	walker : (cb)=>{
		cga.travel.falan.toStone('M3', ()=>{
			cga.walkList([
			[82, 8]
			], cb);
		});
	},
	//武修和防修的面向方向
	dir : [0, 0]
}
]

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

const repairLoop = (flags, failure, cb)=>{
	var words = '';
	var item = cga.getInventoryItems().filter(flags == 0 ? repairFilter : ((flags & 1) ? repairFilterArmor : repairFilterWeapon) );
	if (item.length) {
		if (item[0].type >= 0 && item[0].type <= 6)
			words = '修理武器';
		else if (item[0].type >= 7 && item[0].type <= 14)
			words = '修理防具';
	}
	
	if(!words.length) {
		setTimeout(cb, 1000);
		return;
	}
	
	cga.turnDir(words == '修理武器' ? thisobj.repairLocation.dir[0] : thisobj.repairLocation.dir[1]);
	
	var tradePlayerName = '';
	cga.waitTrade({
		itemFilter : (words == '修理武器') ? repairFilterWeapon : repairFilterArmor,
	}, (playerName, received)=>{
		tradePlayerName = playerName;
		return true;
	}, (result)=>{
		if(result.success == true){
			
		}
		else
		{
			//重新请求修理
			if(failure + 1 >= 3)
				setTimeout(cb, 1000);
			else
				setTimeout(repairLoop, 1000, flags, failure + 1, cb);
			return;
		}
		
		//等待接收修理好的装备
		var waitReceive = ()=>{
			cga.waitTrade({

			}, (playerName, received)=>{
				return (tradePlayerName == playerName);
			}, (result)=>{
				if(result.success == true){
					//接收成功，继续修理其他类型的装备，或者全部都修理完成的情况下结束修理
					if(words == '修理武器')
						flags |= 1;
					else if(words == '修理防具')
						flags |= 2;
					
					if(flags == 3)
						setTimeout(cb, 1000);
					else
						setTimeout(repairLoop, 1000, flags, 0, cb);
				}
				else
				{
					//接收失败，重新接收
					waitReceive();
				}				
			});
		}
		
		waitReceive();
	});
	
	cga.SayWords(words, 0, 3, 1);
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
				
		thisobj.repairLocation.walker(()=>{
			setTimeout(()=>{
				cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);
				cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false);
				setTimeout(()=>{
					var equipped = cga.getEquipItems();
					putdownEquipments(()=>{
						repairLoop(0, 0, ()=>{
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
	},
	loadconfig : (obj, cb)=>{
		
		for(var i in repairLocArray){
			if(repairLocArray[i].name == obj.repairLocation){
				configTable.repairLocation = repairLocArray[i].name;
				thisobj.repairLocation = repairLocArray[i];
				break;
			}
		}
		
		if(thisobj.repairLocation === undefined){
			console.error('读取配置：修理地点失败！默认使用新城登入点修理！');
			thisobj.repairLocation = repairLocArray[0];
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【修理装备】请选择修理地点:';
		for(var i in repairLocArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + repairLocArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{
			if(index !== null && index >= 1 && repairLocArray[index - 1]){
				configTable.repairLocation = repairLocArray[index - 1].name;
				thisobj.repairLocation = repairLocArray[index - 1];
				
				var sayString2 = '当前已选择:[' + thisobj.repairLocation.name + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb(null);
				
				return false;
			}
			
			return true;
		});
	}
};

module.exports = thisobj;