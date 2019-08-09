var cga = require('./cgaapi')(function(){
	cgacga.travel.toCity('阿凯鲁法村', ()=>{
		cga.walkList([
		[99, 164]
		], ()=>{
			cga.TurnTo(99, 162);
			cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
			});
		});
	});
});