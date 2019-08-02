var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		cga.waitForChatInput((msg)=>{
			if(msg == '登出防卡住' && cga.isInNormalState())
			{
				cga.LogBack();
				
				setTimeout(cb, 1500);
				return true;
			}

			setTimeout(thisobj.func, 5000);
			return true;
		});
		cga.SayWords('登出防卡住', 0, 3, 1);
	},
	translate : (pair)=>{
		return false;
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
}

module.exports = thisobj;