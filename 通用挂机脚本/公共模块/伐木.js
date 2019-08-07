var mineArray = [
	{
		level : 1,
		name : '印度轻木',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[361, 184],
				], cb);
			});
		}		
	},
	{
		level : 2,
		name : '枞',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[451, 163],
				], cb);
			});
		}
	},
	{
		level : 3,
		name : '黄月木',
		func : (cb)=>{
			cga.travel.falan.toStone('W1', (r)=>{
				cga.walkList([
					[22, 87, '芙蕾雅'],
					[361, 182],
				], cb);
			});
		},
		extra_selling : (item)=>{
			return item.name == '印度轻木';
		}
	},
	{
		level : 4,
		name : '铁杉',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('维诺亚村', (r)=>{
				cga.walkList([
					[5, 1, '村长家的小房间'],
					[0, 5, '村长的家'],
					[10, 16, '维诺亚村'],
					[67, 46, '芙蕾雅'],
					[416, 440],
				], cb);
			});
		}
	},
	{
		level : 5,
		name : '琵琶木',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('维诺亚村', (r)=>{
				cga.walkList([
					[5, 1, '村长家的小房间'],
					[0, 5, '村长的家'],
					[10, 16, '维诺亚村'],
					[67, 46, '芙蕾雅'],
					[347, 410],
				], cb);
			});
		}
	},
	{
		level : 6,
		name : '赤松',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('维诺亚村', (r)=>{
				cga.walkList([
					[5, 1, '村长家的小房间'],
					[0, 5, '村长的家'],
					[10, 16, '维诺亚村'],
					[67, 46, '芙蕾雅'],
					[400, 550],
				], cb);
			});
		}
	},
	{
		level : 7,
		name : '朴',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('杰诺瓦镇', (r)=>{
				cga.walkList([
					[14, 6, '村长的家'],
					[1, 9, '杰诺瓦镇'],
					[24, 39, '莎莲娜'],
					[183, 459],
				], cb);
			});
		}
	},
	{
		level : 8,
		name : '杉',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('杰诺瓦镇', (r)=>{
				cga.walkList([
					[14, 6, '村长的家'],
					[1, 9, '杰诺瓦镇'],
					[24, 39, '莎莲娜'],
					[161, 354],
				], cb);
			});
		}
	},
	{
		level : 9,
		name : '丝柏',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('阿巴尼斯村', (r)=>{
				cga.walkList([
					[5, 4, '村长的家'],
					[6, 13, 4312],
					[6, 13, '阿巴尼斯村'],
					[37, 71, '莎莲娜'],
					[105, 158],
				], cb);
			});
		}
	},
	{
		level : 10,
		name : '梣',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('阿巴尼斯村', (r)=>{
				cga.walkList([
					[5, 4, '村长的家'],
					[6, 13, 4312],
					[6, 13, '阿巴尼斯村'],
					[37, 71, '莎莲娜'],
					[231, 147],
				], cb);
			});
		}
	},
	{
		level : 8,
		name : '魔法红萝卜',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
				cga.walkList([
					[5, 4, '村长的家'],
					[6, 13, 4312],
					[6, 13, '阿巴尼斯村'],
					[37, 71, '莎莲娜'],
					[117, 100, '魔法大学'],
					[32, 167],
				], cb);
			});
		}
	},
];

var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb) =>{
		thisobj.object.func(cb);
	},
	check_done : ()=>{
		return cga.getInventoryItems().length >= 20
	},
	translate : (pair)=>{
		if(pair.field == 'mineObject'){
			pair.field = '要伐的木';
			pair.value = mineArray[pair.value].name;
			pair.translated = true;
			return true;
		}
		return false;
	},
	loadconfig : (obj)=>{
		for(var i in mineArray){
			if(i == obj.mineObject){
				configTable.mineObject = i;
				thisobj.object = mineArray[i];
				break;
			}
		}
		
		if(!thisobj.object){
			console.error('读取配置：要伐的木失败！');
			return false;
		}
				
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【采集插件】请选择要伐的木:';
		for(var i in mineArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + mineArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{
			if(index !== null && index >= 1 && mineArray[index - 1]){
				configTable.mineObject = index - 1;
				thisobj.object = mineArray[index - 1];
				
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