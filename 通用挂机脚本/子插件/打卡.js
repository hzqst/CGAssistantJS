var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	prepare : (cb)=>{
		cga.travel.falan.toStone('C', ()=>{
			var playerinfo = cga.GetPlayerInfo();
			if(playerinfo.punchclock > 0 && !playerinfo.usingpunchclock){
				cga.travel.falan.toCastleClock((r)=>{
					cb(null);
				});
			} else {
				cb(null);
			}
		});
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};