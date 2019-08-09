var cga = require('./cgaapi')(function(){
	cga.promisify(cga.travel.toCity, '艾尔莎岛')
		cga.TurnTo(143, 105);
		cga.AsyncWaitNPCDialog(()=>{
			cga.ClickNPCDialog(4, -1);
		});
	});
});