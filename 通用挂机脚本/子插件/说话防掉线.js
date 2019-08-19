var cga = global.cga;
var configTable = global.configTable;
var callsupply = false;

var timer = ()=>{
	cga.SayWords('', 0, 3, 1);
	
	setTimeout(timer, 60000);
}

module.exports = {
	init : ()=>{
		setTimeout(timer, 60000);
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};