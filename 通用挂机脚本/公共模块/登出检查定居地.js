var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		cga.LogBack();
		setTimeout(()=>{
			var mapname = cga.GetMapName();
			switch(mapname)
			{
				case '艾尔莎岛':
					cga.travel.newisland.isSettled = true;
					cga.travel.gelaer.isSettled = false;
					cga.travel.AKLF.isSettled = false;
					cga.travel.falan.isSettled = false;
					break;
				case '阿凯鲁法村':
					cga.travel.newisland.isSettled = false;
					cga.travel.gelaer.isSettled = false;
					cga.travel.AKLF.isSettled = true;
					cga.travel.falan.isSettled = false;
					break;
				case '哥拉尔镇':
					cga.travel.newisland.isSettled = false;
					cga.travel.gelaer.isSettled = true;
					cga.travel.AKLF.isSettled = false;
					cga.travel.falan.isSettled = false;
					break;
				case '法兰城':
					cga.travel.newisland.isSettled = false;
					cga.travel.gelaer.isSettled = false;
					cga.travel.AKLF.isSettled = false;
					cga.travel.falan.isSettled = true;
					break;
				default: cb(new Error('检测到未知的定居地: '+mapname));
			}
			console.log('登出检查定居地:'+mapname);
			cb(null, mapname);
		}, 1000);
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