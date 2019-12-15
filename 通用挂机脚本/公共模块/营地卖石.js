var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	func : (cb)=>{
		var path = [];
		var map = cga.GetMapName();
		if(map == '医院')
		{
			path = [
				[0, 20, '圣骑士营地'],
				[87, 72, '工房'],
				[21, 22],
			];
		}
		else if(map == '圣骑士营地')
		{
			path = [
				[87, 72, '工房'],
				[21, 22],
			];
		}
		else if(map == '工房')
		{
			path = [
				[21, 22],
			];
		}
		
		cga.walkList(path, ()=>{
			cga.walkTeammateToPosition([
			[21, 22],
			[20, 22],
			] , ()=>{
				cga.turnTo(21, 23);
				cga.sellStone(()=>{
					setTimeout(()=>{
						
						if(cga.GetPlayerInfo().gold >= 990000)
						{
							cga.travel.falan.toBank(()=>{
								cga.AsyncWaitNPCDialog(()=>{
									cga.MoveGold(980000, cga.MOVE_GOLD_TOBANK);
									setTimeout(cb, 1000);
								});
							});
						}
						
						cb(null);
						
					}, cga.getTeamPlayers().length ? 5000 : 3000);
				});
			});
		});
	},
	isAvailable : (map, mapindex)=>{
		return (map == '圣骑士营地' || mapindex == 44692 || mapindex == 44693) ? true : false;
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