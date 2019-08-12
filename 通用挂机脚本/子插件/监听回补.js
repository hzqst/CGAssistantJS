var cga = global.cga;
var configTable = global.configTable;
var callsupply = false;

module.exports = {
	init : ()=>{
		cga.waitTeammateSay((player, msg)=>{

			if(msg.indexOf('需要回补') >= 0 && global.getMainPlugin().getDangerLevel() > 0){
				callsupply = true;
			}
			
			return true;
		});
	},
	think : (ctx)=>{
		if(callsupply)
		{
			callsupply = false;
			ctx.result = 'supply';
			ctx.reason = '监听回补';
		}
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};