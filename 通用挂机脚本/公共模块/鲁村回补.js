var supplyModeArray = [
{
	name : '鲁村普通护士回补',
	func : (cb)=>{
		var map = cga.GetMapName();
		
		if(map == '鲁米那斯'){
			cga.travel.lumi.toHospital(()=>{
				setTimeout(cb, 5000, null);
			}, false);
		}
		else if(map == '库鲁克斯岛'){
			cga.walkList([
			[322, 883, '鲁米那斯']
			], ()=>{
				cga.travel.lumi.toHospital(()=>{
					setTimeout(cb, 5000, null);
				}, false);
			});			
		}
	},
	isLogBack : (map, mapindex)=>{
		return false;
	},
	isAvailable : (map, mapindex)=>{
		return (map == '鲁米那斯' || map == '库鲁克斯岛') ? true : false;
	},
},
{
	name : '鲁村资深护士回补',
	func : (cb)=>{
		var map = cga.GetMapName();
		
		if(map == '鲁米那斯'){
			cga.travel.lumi.toHospital(()=>{
				setTimeout(cb, 5000, null);
			}, true);
		}
		else if(map == '库鲁克斯岛'){
			cga.walkList([
			[322, 883, '鲁米那斯']
			], ()=>{
				cga.travel.lumi.toHospital(()=>{
					setTimeout(cb, 5000, null);
				}, true);
			});			
		}
	},
	isLogBack : (map, mapindex)=>{
		return false;
	},
	isAvailable : (map, mapindex)=>{
		return (map == '鲁米那斯' || map == '库鲁克斯岛') ? true : false;
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
		var sayString = '【鲁村插件】请选择回补方式:';
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