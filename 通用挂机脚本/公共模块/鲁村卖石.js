var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	func : (cb)=>{
		var map = cga.GetMapName();
		if(map != '鲁米那斯' && map != '医院'){
			throw new Error('鲁村卖石必须在鲁米那斯执行');
		}
		var path = [];
		if(map == '鲁米那斯')
		{
			path = [
				[88, 51, '杂货店'],
				[11, 12],
			];
		}
		else if(map == '医院')
		{
			path = [
				[4, 14, '鲁米那斯'],
				[88, 51, '杂货店'],
				[11, 12],
			];
		}
		cga.walkList(path, ()=>{
			cga.turnDir(0);
			cga.sellStone(()=>{
				setTimeout(()=>{
					
					if(cga.GetPlayerInfo().gold >= 990000)
					{
						if(cga.travel.gelaer.isSettled)
						{
							cga.LogBack();
							setTimeout(()=>{
								cga.travel.gelaer.toBank(()=>{
									cga.AsyncWaitNPCDialog(()=>{
										cga.MoveGold(980000, cga.MOVE_GOLD_TOBANK);
										setTimeout(cb, 1000, null);
									});
								});
							}, 1000);
						}
						else
						{
							cga.LogBack();
							setTimeout(()=>{
								cga.travel.falan.toBank(()=>{
									cga.walkList([
									[11, 8],
									], ()=>{
										cga.turnDir(0);
										cga.AsyncWaitNPCDialog(()=>{
											cga.MoveGold(980000, cga.MOVE_GOLD_TOBANK);
											setTimeout(cb, 1000, null);
										});
									});
								});
							}, 1000);
						}
						return;
					}
					
					cb(null);
					
				}, 3000);
			});
		});
	},
	isAvailable : (map, mapindex)=>{
		return (map == '鲁米那斯' || mapindex == 43610);
	},
	translate : (pair)=>{
		return false;
	},
	loadconfig : (obj)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
}