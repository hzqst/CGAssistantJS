var sellStoreArray = [
{
	name : '卖石',
	func : (cb)=>{
		cga.walkList([
			[31, 77],
		], ()=>{
			cga.TurnTo(30, 77);
			cga.sellStone(()=>{
				setTimeout(()=>{
					cb(true);
				}, 5000);
			});
		});
	}
},
{
	name : '不卖石',
	func : (cb)=>{
		cb(true);
	}
}
]

var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		thisobj.object.func(cb);
	},
	translate : (pair)=>{
		if(pair.field == 'sellStore'){
			pair.field = '是否卖石';
			pair.value = sellStoreArray[pair.value].name;
			pair.translated = true;
			return true;
		}
		return false;
	},
	loadconfig : (obj)=>{
		for(var i in sellStoreArray){
			if(i == obj.sellStore){
				configTable.sellStore = i;
				thisobj.object = sellStoreArray[i];
				break;
			}
		}
		
		if(!thisobj.object){
			console.error('读取配置：是否卖石失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【里堡插件】请选择是否卖石:';
		for(var i in sellStoreArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + sellStoreArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg)=>{
			var index = parseInt(msg);
			if(index >= 1 && sellStoreArray[index - 1]){
				configTable.sellStore = index - 1;
				thisobj.object = sellStoreArray[index - 1];
				
				var sayString2 = '当前已选择:[' + thisobj.object.name + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb(null);
				
				return true;
			}
			
			return false;
		});
	}
}

module.exports = thisobj;