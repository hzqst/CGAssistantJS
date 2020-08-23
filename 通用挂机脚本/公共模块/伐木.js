var mineArray = [
	{
		level : 1,
		name : '印度轻木',
		display_name : '印度轻木',
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
		display_name : '枞',
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
		display_name : '黄月木',
		func : (cb)=>{
			cga.travel.falan.toTeleRoom('亚留特村', (r)=>{
				cga.walkList([
					[8, 3, '村长的家'],
					[6, 13, '亚留特村'],
					[59, 31, '芙蕾雅'],
					[638, 141],
				], cb);
			});
		}
	},
	{
		level : 4,
		name : '铁杉',
		display_name : '铁杉',
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
		display_name : '琵琶木',
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
		display_name : '赤松',
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
		display_name : '朴',
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
		display_name : '杉',
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
		display_name : '丝柏',
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
		display_name : '梣',
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
		display_name : '魔法红萝卜',
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
		},
		extra_selling : (item)=>{ 
			if(item.name == '苹果薄荷')
				return true;
			return false;
		}
	},
	{
		level : 5,
		name : '琵琶木',
		display_name : '琵琶木阿凯鲁法',
		func : (cb)=>{
			if(cga.GetMapName() != '阿凯鲁法村')
				throw new Error('必须从阿凯鲁法村启动');

			cga.walkList([
				[178, 227, '米内葛尔岛'],
				[206, 347],
			], cb);
		}
	},

	{
		level : 6,
		name : '赤松',
		display_name : '赤松阿凯鲁法',
		func : (cb)=>{
			if(cga.GetMapName() != '阿凯鲁法村')
				throw new Error('必须从阿凯鲁法村启动');

			cga.walkList([
				[178, 227, '米内葛尔岛'],
				[154, 395],
			], cb);
		}
	},
	{
		level : 8,
		name : '单木',
		display_name : '单木阿凯鲁法',
		func : (cb)=>{
			if(cga.GetMapName() != '阿凯鲁法村')
				throw new Error('必须从阿凯鲁法村启动');

			cga.walkList([
				[178, 227, '米内葛尔岛'],
				[250, 402],
			], cb);
		}
	},
	{
		level : 3,
		name : '茱萸木',
		display_name : '茱萸木',
		func : (cb)=>{
			cga.travel.newisland.toStone('X', ()=>{
				cga.walkList([
				[130, 50, '盖雷布伦森林'],
				[187, 43],
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
			pair.field = '采集材料种类';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		return false;
	},
	loadconfig : (obj)=>{
		for(var i in mineArray){
			if(mineArray[i].display_name == obj.mineObject){
				configTable.mineObject = mineArray[i].display_name;
				thisobj.object = mineArray[i];
				break;
			}
		}

		if(!thisobj.object){
			console.error('读取配置：采集材料种类失败！');
			return false;
		}

		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【采集插件】请选择采集材料种类:';
		for(var i in mineArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + mineArray[i].display_name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{
			if(index !== null && index >= 1 && mineArray[index - 1]){
				configTable.mineObject = mineArray[index - 1].display_name;
				thisobj.object = mineArray[index - 1];

				var sayString2 = '当前已选择:[' + thisobj.object.display_name + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);

				cb(null);

				return false;
			}

			return true;
		});
	},
	init : ()=>{

	}
}

module.exports = thisobj;