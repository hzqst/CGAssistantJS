var cga = global.cga;
var configTable = global.configTable;
var callsupply = false;

module.exports = {
	init : ()=>{

	},
	think : (ctx)=>{
		if(cga.getInventoryItems().length >= 20)
		{
			ctx.result = 'supply';
			ctx.reason = '包满回补';
		}
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};