var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		cga.walkList([
			[0, 20, '圣骑士营地'],
			[87, 72, '工房'],
			[21, 22],
			[20, 22],
			[21, 22],
			[20, 22],
			[21, 22],
		], ()=>{
			cga.TurnTo(21, 24);
			cga.sellStone(()=>{
				setTimeout(cb, 5000, true);
			});
		});
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