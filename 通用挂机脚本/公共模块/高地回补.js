var supplyModeArray = [
{
	name : '艾夏岛医院,资深护士回补',
	func : (cb)=>{
		cga.walkList([
			[30, 193, '盖雷布伦森林'],
			[199, 211, '艾夏岛'],
			[112, 81, '医院'],
			[35, 43],
			[35, 42],
			[35, 43],
			[35, 42],
			[35, 43],
		], ()=>{
			cga.TurnTo(37, 43);
			setTimeout(cb, 5000);
		});
	},
	isLogBack : false,
	isInitialSupply : false,
},
{
	name : '艾夏岛医院,普通护士回补',
	func : (cb)=>{
		cga.walkList([
			[30, 193, '盖雷布伦森林'],
			[199, 211, '艾夏岛'],
			[112, 81, '医院'],
			[35, 46],
			[35, 45],
			[35, 46],
			[35, 45],
			[35, 46],
		], ()=>{
			cga.TurnTo(37, 46);
			setTimeout(cb, 5000);
		});
	},
	isLogBack : false,
	isInitialSupply : false,
},
{
	name : '登出飞碟回补',
	func : (cb)=>{
		cga.travel.falan.toCastleHospital(()=>{
			setTimeout(cb, 5000);
		});
	},
	isLogBack : true,
	isInitialSupply : true,
},
]

var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		thisobj.object.func(cb);
	},
	isLogBack : ()=>{
		return thisobj.object.isLogBack;
	},
	isInitialSupply : ()=>{
		return thisobj.object.isInitialSupply;
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
		var sayString = '【高地插件】请选择回补方式:';
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
				
				return true;
			}
			
			return false;
		});
	}
}

module.exports = thisobj;