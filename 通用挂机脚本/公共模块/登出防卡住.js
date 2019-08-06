var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	readyToLogBack : false,
	callbackAfterLogBack : null,
	init : ()=>{
		cga.waitForChatInput((msg)=>{
			if(msg == '登出防卡住' && cga.isInNormalState() && thisobj.readyToLogBack == true){
				cga.LogBack();
				thisobj.callbackAfterLogBack();
				thisobj.readyToLogBack = false;
			}
			
			return false;
		});
	},
	func : (cb)=>{
		console.log('logback');
		
		thisobj.readyToLogBack = true;
		thisobj.callbackAfterLogBack = cb;

		var retry = ()=>{
			if(thisobj.readyToLogBack){
				cga.SayWords('登出防卡住', 0, 3, 1);
				setTimeout(retry, 1000);
			}
		}
		
		retry();
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