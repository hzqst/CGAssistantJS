var cga = global.cga;
var configTable = global.configTable;

var callsupply = false;

module.exports = {
	init : ()=>{
		cga.waitTeammateSay((player, msg)=>{

			if(msg.indexOf('需要回补') >= 0){
				callsupply = true;
			}
			
			return true;
		});
	},
	battle : (ctx)=>{
		if(callsupply)
		{
			ctx.result = 'supply';
			callsupply = false;
		}
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};