var ProResupply = (cb)=>{
	var map = cga.GetMapName();
	
	var path = [
		[8, 33],
		[7, 33],
		[8, 33],
		[7, 33],
		[8, 33],
	];
	if(map == '芙蕾雅'){
		path.unshift([82, 83, '医院']);
		path.unshift([378, 195, '法兰城']);
	} else if(map == '法兰城'){
		path.unshift([82, 83, '医院']);
	} else if(map == '里谢里雅堡'){
		path.unshift([82, 83, '医院']);
		path.unshift([41, 98, '法兰城']);
	} else if(map == '艾尔莎岛'){
		cga.travel.falan.toCastle(()=>{
			ProResupply(cb);
		});
		return;
	}
	
	cga.walkList(path, ()=>{
		cga.TurnTo(6, 31);
		setTimeout(cb, 5000);
	});
}

var NonProResupply = (cb)=>{
	var map = cga.GetMapName();
	
	var path = [
		[9, 31],
		[8, 31],
		[9, 31],
		[8, 31],
		[9, 31],
	];
	if(map == '芙蕾雅') {
		path.unshift([82, 83, '医院']);
		path.unshift([378, 195, '法兰城']);
	} else if(map == '法兰城') {
		path.unshift([82, 83, '医院']);
	} else if(map == '里谢里雅堡') {
		path.unshift([82, 83, '医院']);
		path.unshift([41, 98, '法兰城']);
	} else if(map == '艾尔莎岛'){
		cga.travel.falan.toCastle(()=>{
			NonProResupply(cb);
		});
		return;
	}
	
	cga.walkList(path, ()=>{
		cga.TurnTo(9, 29);
		setTimeout(cb, 5000);
	});
}

var supplyModeArray = [
{
	name : '法兰西医资深护士回补',
	func : ProResupply,
	isLogBack : (map, mapindex)=>{
		return false;
	},
	isAvailable : (map, mapindex)=>{
		return (map == '芙蕾雅' || map == '法兰城' || map == '里谢里雅堡' || map == '艾尔莎岛' || map.indexOf('诅咒的迷宫') >= 0) ? true : false;
	},
},
{
	name : '法兰西医普通护士回补',
	func : NonProResupply,
	isLogBack : (map, mapindex)=>{
		return false;
	},
	isAvailable : (map, mapindex)=>{
		return (map == '芙蕾雅' || map == '法兰城' || map == '里谢里雅堡' || map == '艾尔莎岛' || map.indexOf('诅咒的迷宫') >= 0) ? true : false;
	},
},
{
	name : '登出飞碟回补',
	func : (cb)=>{
		cga.travel.falan.toCastleHospital(()=>{
			setTimeout(cb, 5000);
		});
	},
	isLogBack : (map, mapindex)=>{
		return true;
	},
	isAvailable : (map, mapindex)=>{
		return true;
	},
},
]

var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		thisobj.object.func(cb);
	},
	isLogBack : (map, mapindex)=>{
		return thisobj.object.isLogBack(map, mapindex);
	},
	isAvailable : (map, mapindex)=>{
		return thisobj.object.isAvailable(map, mapindex);
	},
	translate : (pair)=>{
		if(pair.field == 'supplyMode'){
			pair.field = '回补方式';
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
			console.error('读取配置：回补方式失败！');
			return false;			
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【法兰插件】请选择回补方式:';
		for(var i in supplyModeArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + supplyModeArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{
			if(index !== null && index >= 1 && supplyModeArray[index - 1]){
				configTable.supplyMode = index - 1;
				thisobj.object = supplyModeArray[index - 1];
				
				var sayString2 = '当前已选择:[' + thisobj.object.name + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb(null);
				
				return false;
			}
			
			return true;
		});
	}
}

module.exports = thisobj;