var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		var gogogo = ()=>{
			cga.walkList([
				[30, 79],
			], ()=>{
				cga.TurnTo(30, 77);
				cga.sellStone(()=>{
					setTimeout(cb, cga.getTeamPlayers().length ? 5000 : 3000, true);
				});
			});
		}
		
		if(cga.GetMapName() != '里谢里雅堡'){
			cga.travel.falan.toStone('C', gogogo);
		} else {
			gogogo();
		}		
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

module.exports = thisobj;