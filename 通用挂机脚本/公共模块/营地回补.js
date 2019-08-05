var supplyModeArray = [
{
	name : '圣骑士营地资深护士回补',
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
	},
	isLogBack : false,
	isInitialSupply : false,
},
{
	name : '圣骑士营地普通护士回补',
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
	},
	isLogBack : false,
	isInitialSupply : false,
},
{
	name : '登出飞碟回补',
	func : (cb)=>{
		if(cga.GetMapName() == '圣骑士营地'){
			cga.walkList([
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
			return;
		}
		
		cga.travel.falan.toCastleHospital(()=>{
			setTimeout(cb, 5000);
		});
	},
	isLogBack : true,
	isInitialSupply : true,
},
{
	name : '登出，到曙光营地医院回补',
	func : (cb)=>{
		
		if(cga.GetMapName() == '圣骑士营地'){
			cga.walkList([
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
			return;
		}
		
		cga.travel.falan.toCamp(()=>{
			cga.walkList([
			[42, 56, '曙光营地医院'],
			[11, 8]
			], ()=>{
				cga.TurnTo(11, 6);
				setTimeout(()=>{
					cga.walkList([
					[1, 8, '曙光骑士团营地'],
					], ()=>{
						cga.travel.falan.toCamp(cb);
					});
				}, 5000);
			})
		}, true);
	},
	isLogBack : true,
	isInitialSupply : true,
}
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
		var sayString = '【营地插件】请选择回补方式:';
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