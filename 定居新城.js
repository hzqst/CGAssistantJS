var cga = require('./cgaapi')(function(){
	
	var travel = null;
	
	var next = ()=>{
		cga.walkList([
		[141, 105]
		], ()=>{
			cga.turnTo(142, 105);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
			});
		});
	};
	
	var map = cga.GetMapName();
	
	if(map == '阿凯鲁法村'){
		cga.travel.AKLF.toFalan(()=>{
			cga.travel.falan.toCity('艾尔莎岛', next);
		});
	}
	else if(map == '哥拉尔镇'){
		cga.travel.gelaer.toFalan(()=>{
			cga.travel.falan.toCity('艾尔莎岛', next);
		});
	}
	else if(map == '法兰城' || map == '里谢里雅堡')
	{
		cga.travel.falan.toCity('艾尔莎岛', next);
	}
	else
	{
		throw new Error('无法从'+map+'启动脚本，只能从法兰城、里堡、阿凯鲁法、哥拉尔启动！');
	}
});