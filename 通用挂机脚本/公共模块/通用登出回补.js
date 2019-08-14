var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		console.log('zzz');
		var mapname = cga.GetMapName();
		if(mapname != '艾尔莎岛' && mapname != '法兰城' && mapname != '阿凯鲁法村')
			cga.LogBack();
		
		setTimeout(()=>{
			var mapname = cga.GetMapName();
			switch(mapname)
			{
				case '艾尔莎岛':
					cga.travel.falan.toCastleHospital(()=>{
						setTimeout(cb, 3000);
					});
					break;
				case '阿凯鲁法村':
					cga.LogBack();
					cga.walkList([
					[121, 155, '夏姆吉诊所'],
					[24, 17],
					], ()=>{
						cga.TurnTo(24, 15);
						setTimeout(()=>{
							cga.walkList([
							[16, 23, '阿凯鲁法村']
							], cb);
						}, 3000);
					});
					break;

				case '法兰城':
					cga.travel.falan.toWestHospital(()=>{
						setTimeout(cb, 3000);
					});
					break;
				default: throw new Error('登出回到未知的定居地: '+mapname);
			}
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