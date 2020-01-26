var supplyModeArray = [
{
	name : '矮人城镇资深护士回补',
	func : (cb)=>{
		var map = cga.GetMapName();
		
		var path = [
			[163, 95],
		];
		
		if(map == '肯吉罗岛'){
			path.unshift([231, 434, '矮人城镇']);
		}
		
		cga.walkList(path, ()=>{
			cga.turnDir(0);
			setTimeout(cb, 5000);
		});
	},
	isLogBack : (map, mapindex)=>{
		return false;
	},
	isAvailable : (map, mapindex)=>{
		var mapXY = cga.GetMapXY();
		return (cga.travel.camp.getRegion(map, mapXY) == '矮人城镇域' || map == '矮人城镇') ? true : false;
	},
},
{
	name : '矮人城镇普通护士回补',
	func : (cb)=>{
		var map = cga.GetMapName();
		
		var path = [
			[163, 94],
		];
		
		if(map == '肯吉罗岛'){
			path.unshift([231, 434, '矮人城镇']);
		}
		
		cga.walkList(path, ()=>{
			cga.turnDir(0);
			setTimeout(cb, 5000);
		});
	},
	isLogBack : (map, mapindex)=>{
		return false;
	},
	isAvailable : (map, mapindex)=>{
		var mapXY = cga.GetMapXY();
		return (cga.travel.camp.getRegion(map, mapXY) == '矮人城镇域' || map == '矮人城镇') ? true : false;
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
}
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
		var sayString = '【矮人回补】请选择回补方式:';
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