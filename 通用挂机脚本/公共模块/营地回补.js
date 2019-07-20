var supplyModeArray = [
{
	name : '资深护士回补',
	func : (cb)=>{
		cga.walkList([
			[551, 332, '圣骑士营地'],
			[95, 72, '医院'],
			[9, 11],
			[9, 12],
			[9, 11],
			[9, 12],
			[9, 11],
		], ()=>{
			cga.TurnTo(11,11);
			setTimeout(cb, 5000);
		});
	}
},
{
	name : '普通护士回补',
	func : (cb)=>{
		cga.walkList([
			[551, 332, '圣骑士营地'],
			[95, 72, '医院'],
			[18, 15],
			[17, 15],
			[18, 15],
			[17, 15],
			[18, 15],
		], ()=>{
			cga.TurnTo(18,13);
			setTimeout(cb, 5000);
		});
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
		if(pair.field == 'supplyMode'){
			pair.field = '回补护士';
			pair.value = supplyModeArray[pair.value].name;
			pair.translated = true;
			return true;
		}
		return false;
	},
	loadconfig : (obj)=>{
		for(var i in supplyModeArray){
			if(i == obj.supplyMode){
				configTable.supplyMode = i;
				thisobj.object = supplyModeArray[i];
				break;
			}
		}
		
		if(!thisobj.object){
			console.error('读取配置：回补护士失败！');
			return false;			
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【营地插件】请选择回补护士:';
		for(var i in supplyModeArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + supplyModeArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg)=>{
			var index = parseInt(msg);
			if(index >= 1 && supplyModeArray[index - 1]){
				configTable.supplyMode = index - 1;
				thisobj.object = supplyModeArray[index - 1];
				
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