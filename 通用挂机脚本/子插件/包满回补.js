var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	muteUntil : 0,
	mute : 15,
	think : (ctx)=>{
		if(ctx.inventory.length >= 20)
		{
			var curTime = new Date().getTime();
			if(curTime >= thisobj.muteUntil){
				cga.SayWords('包满需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
			}
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

module.exports = thisobj;