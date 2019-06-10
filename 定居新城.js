var cga = require('./cgaapi')(function(){
	cga.travel.toCity('艾尔莎岛', function(r){
		cga.TurnTo(143, 105);
		cga.AsyncWaitNPCDialog(function(dlg){
			cga.ClickNPCDialog(4, -1);
		});
	});
});