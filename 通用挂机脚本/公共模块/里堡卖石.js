var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	func : (cb)=>{
		var gogogo = ()=>{
			cga.walkList([
				[31, 77],
			], ()=>{
				cga.walkTeammateToPosition([
				[31, 77],
				[31, 76],
				] , ()=>{
					cga.turnTo(30, 77);
					cga.sellStone(()=>{
												
						setTimeout(()=>{
							
							if(cga.GetPlayerInfo().gold >= 990000)
							{
								if(cga.getTeamPlayers().length)
									cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
								
								cga.walkList([
								[30, 37, '圣骑士营地'],
								[116, 105, '银行'],
								[27, 23],
								], ()=>{
									cga.turnDir(0);
									cga.AsyncWaitNPCDialog(()=>{
										cga.MoveGold(980000, cga.MOVE_GOLD_TOBANK);
										setTimeout(()=>{
											cga.walkList([
											[3, 23, '圣骑士营地'],
											], cb);
										}, 1000);
									});
								});
								return;
							}
							
							cb(null);
							
						}, cga.getTeamPlayers().length ? 5000 : 3000);
					});
				});
			});
		}
		
		if(cga.GetMapName() != '里谢里雅堡'){
			cga.travel.falan.toStone('C', gogogo);
		} else {
			gogogo();
		}		
	},
	isAvailable : (map, mapindex)=>{
		return (map == '里谢里雅堡' || map == '艾尔莎岛') ? true : false;
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