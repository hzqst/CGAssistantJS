var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	func : (cb)=>{
		var path = [];
		var map = cga.GetMapName();
		if(map == '矮人城镇')
		{
			path = [
				[121, 110],
			];
		}
		else if(map == '肯吉罗岛')
		{
			path = [
				[231, 434, '矮人城镇'],
				[121, 110],
			];
		}
		
		cga.walkList(path, ()=>{
			cga.walkTeammateToPosition([
			[121, 111],
			[121, 110],
			] , ()=>{
				cga.turnTo(122, 110);
				cga.sellStone(()=>{
					setTimeout(()=>{
						
						if(cga.GetPlayerInfo().gold >= 950000)
						{
							if(cga.getTeamPlayers().length)
								cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
							
							cga.walkList([
								[163, 104],
							], ()=>{
								cga.turnDir(0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.MoveGold(900000, cga.MOVE_GOLD_TOBANK);
									setTimeout(cb, 1000);
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
		var mapXY = cga.GetMapXY();
		return (cga.travel.camp.getRegion(map, mapXY) == '矮人城镇域' || map == '矮人城镇') ? true : false;
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