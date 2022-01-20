var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		console.log('登出检查定居地...');
		cga.logBack(cb);
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