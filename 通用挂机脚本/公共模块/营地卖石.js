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
						
						if(cga.GetPlayerInfo().gold >= 950000)
						{
							if(cga.getTeamPlayers().length)
								cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
							
							cga.travel.falan.toBank(()=>{
								cga.walkList([
								[11, 8],
								], ()=>{
									cga.turnDir(0);
									cga.AsyncWaitNPCDialog(()=>{
										cga.MoveGold(900000, cga.MOVE_GOLD_TOBANK);
										setTimeout(cb, 1000);
									});
								});
							});
							return;
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