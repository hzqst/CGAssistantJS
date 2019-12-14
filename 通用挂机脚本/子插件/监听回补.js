var cga = global.cga;
var configTable = global.configTable;
var callsupply = false;

module.exports = {
	prepare : (cb)=>{
		if(callsupply){
			console.log('已经回补，强制取消回补状态')
			callsupply = false;
		}
		cb(null);
	},
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
			if(global.getMainPlugin().getDangerLevel() > 0)
			{
				callsupply = false;
				ctx.result = 'supply';
				ctx.reason = '监听回补';
			}
			else
			{
				console.log('不在危险区域，强制取消回补状态')
				callsupply = false;
			}
		}
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};