var cga = require('./cgaapi')(function(){
	
	var travel = null;
	
	var next = ()=>{
		cga.walkList([
		[141, 105]
		], ()=>{
			cga.TurnTo(143, 105);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
			});
		});
	};
	
	if(cga.GetMapName() == '阿凯鲁法村'){
		cga.travel.AKLF.tofalan(()=>{
			cga.travel.falan.toCity('艾尔莎岛', next);
		});
	}
	else
	{
		cga.travel.falan.toCity('艾尔莎岛', next);
	}
	
});