var cga = global.cga;
var configTable = global.configTable;

var waitArray = [
{
	mapname:'工房',
	pos:[21, 23],
	cb : ()=>{
		cga.TurnTo(21, 23);
		cga.sellStone(function(){
			cga.SayWords('卖石完毕...', 0, 3, 1);
			setTimeout(cga.waitForMultipleLocation, 5000, waitArray);
		});
	}
},
{
	mapname:'矮人城镇',
	pos:[122, 110],
	cb : ()=>{
		cga.TurnTo(122, 110);
		cga.sellStone(function(){
			cga.SayWords('卖石完毕...', 0, 3, 1);
			setTimeout(cga.waitForMultipleLocation, 5000, waitArray);
		});
	}
},
{
	mapname:'里谢里雅堡',
	pos:[30, 77],
	cb : ()=>{
		cga.TurnTo(30, 77);
		cga.sellStone(function(){
			cga.SayWords('卖石完毕...', 0, 3, 1);
			setTimeout(cga.waitForMultipleLocation, 5000, waitArray);
		});
	}
}
];

module.exports = {
	init : ()=>{
		cga.waitForMultipleLocation(waitArray);
	},
	battle : (ctx)=>{
	
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};