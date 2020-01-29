var cga = global.cga;
var configTable = global.configTable;

const buyFilter = (eq) => {
	if (eq.type == 40 && eq.assessed == true) {
		return true;
	}
	return false;
}

const buyLoop = (cb)=>{
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
			
			var buyitem = [];
			var buyCount = 0;
			var emptySlotCount = cga.getInventoryEmptySlotCount();
			
			store.items.forEach((it)=>{
				if(it.name.indexOf('封印卡') >= 0 && buyCount < emptySlotCount){
					buyitem.push({index: it.index, count:20});
					buyCount ++;
				}
			});
			if(!buyitem.length)
			{
				cb(new Error('商店没有封印卡出售，可能已被买完或者背包没空间'));
				return;
			}
			
			cga.BuyNPCStore(buyitem);
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
		var items = cga.getInventoryItems().filter(buyFilter);
		if(items.length){
			cb(null);
			return;
		}
		
		if(cga.getTeamPlayers().length){
			cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
			setTimeout(thisobj.prepare, 1000, cb);
			return;
		}

		var buy = buyLoop;
		
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