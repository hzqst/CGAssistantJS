var cga = global.cga;
var configTable = global.configTable;
var callsupply = false;

module.exports = {
	prepare : (cb)=>{
		cb(null);
	},
	init : ()=>{
		cga.waitSysMsg((msg)=>{

			if(msg.indexOf('您已经进入疲劳游戏时间') >= 0 || msg.indexOf('您已进入不健康游戏时间') >= 0){
				cga.LogOut();
			}
			
			return true;
		});
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};