var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	func : (cb)=>{
		var map = cga.GetMapName();
		cga.walkList([
		[31, 48, '回廊'],
		[25, 22],
		], ()=>{
			cga.TurnTo(27, 22);
			setTimeout(cb, 5000, null);
		});
	},
	isLogBack : (map, mapindex)=>{
		return false;
	},
	isAvailable : (map, mapindex)=>{
		return map == '灵堂';
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