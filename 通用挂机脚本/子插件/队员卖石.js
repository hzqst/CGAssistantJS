var cga = global.cga;
var configTable = global.configTable;

var waitArray = [
{
	mapname:'工房',
	pos:[21, 23],
	cb : ()=>{
		if(cga.isTeamLeaderEx())
			return false;
		
		cga.TurnTo(21, 23);
		cga.sellStone(function(){
			cga.SayWords('卖石完毕...', 0, 3, 1);
			setTimeout(cga.waitForMultipleLocation, 5000, waitArray);
		});
		return true;
	}
},
{
	mapname:'矮人城镇',
	pos:[122, 110],
	cb : ()=>{
		if(cga.isTeamLeaderEx())
			return false;
		
		cga.TurnTo(122, 110);
		cga.sellStone(function(){
			cga.SayWords('卖石完毕...', 0, 3, 1);
			setTimeout(cga.waitForMultipleLocation, 5000, waitArray);
		});
		return true;
	}
},
{
	mapname:'里谢里雅堡',
	pos:[30, 77],
	cb : ()=>{
		if(cga.isTeamLeaderEx())
			return false;
		
		cga.TurnTo(30, 77);
		cga.sellStone(function(){
			cga.SayWords('卖石完毕...', 0, 3, 1);
			setTimeout(cga.waitForMultipleLocation, 5000, waitArray);
		});
		return true;
	}
}
];

module.exports = {
	init : ()=>{
		cga.waitForMultipleLocation(waitArray);
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};