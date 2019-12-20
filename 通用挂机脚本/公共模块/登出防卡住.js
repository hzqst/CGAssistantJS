var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	readyToLogBack : false,
	callbackAfterLogBack : null,
	init : ()=>{
		cga.waitForChatInput((msg)=>{
			if(msg.indexOf('登出防卡住') >= 0 && cga.isInNormalState() && thisobj.readyToLogBack == true){
				thisobj.readyToLogBack = false;
				cga.LogBack();
				setTimeout(thisobj.callbackAfterLogBack, 1500);
				thisobj.callbackAfterLogBack = null;
			}
			
			return true;
		});
		
		/*cga.waitSysMsg((msg)=>{
			if(msg.indexOf('注销回到传送点。') >= 0 && thisobj.readyToLogBack == true){
				console.log('注销回到传送点。');
				thisobj.readyToLogBack = false;
				setTimeout(thisobj.callbackAfterLogBack, 1500);
				thisobj.callbackAfterLogBack = null;
			}
			
			return true;
		});*/
	},
	func : (cb)=>{
		thisobj.readyToLogBack = true;
		thisobj.callbackAfterLogBack = cb;

		var retry = ()=>{
			if(thisobj.readyToLogBack && thisobj.callbackAfterLogBack){
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