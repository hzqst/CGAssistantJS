var mineArray = [
{
	level : 1,
	name : '神圣米',
	display_name : '神圣米',
	func : (cb)=>{
		cga.travel.newisland.toStone('X', ()=>{
			cga.walkList([
				[130, 50, '盖雷布伦森林'],
				[178, 174],
			], cb);
		});
	}		
},
{
	level : 1,
	name : '蕃茄',
	display_name : '蕃茄',
	func : (cb)=>{
		cga.travel.falan.toStone('E2', ()=>{
			cga.walkList([
				[281, 88, '芙蕾雅'],
				[475, 161],
			], cb);
		});
	}		
},
{
	level : 1,
	name : '鸡蛋',
	display_name : '鸡蛋',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('奇利村', ()=>{
			cga.walkList([
				[7, 6, '村长的家'],
				[7, 1, 3212],
				[1, 9, '奇利村'],
				[79, 76, '索奇亚'],
				[297, 361],
			], cb);
		});
	}
},
{
	level : 2,
	name : '大豆',
	display_name : '大豆',
	func : (cb)=>{
		cga.travel.newisland.toStone('X', ()=>{
			cga.walkList([
				[112, 102, '温迪尔平原'],
				[224, 60, '盖雷布伦森林'],
				[108, 123, '法兰城遗迹'],
				[119, 65,],
			], cb);
		});
	}		
},
{
	level : 2,
	name : '葱',
	display_name : '葱',
	func : (cb)=>{
		cga.travel.newisland.toStone('D', ()=>{
			cga.walkList([
				[190, 116, '盖雷布伦森林'],
				[231, 222, '布拉基姆高地'],
				[61, 195],
			], cb);
		});
	}		
},
{
	level : 2,
	name : '牛奶',
	display_name : '牛奶',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[118, 100, '魔法大学'],
				[55, 154, 4424],
				[10, 10],
			], cb);
		});
	}
},
{
	level : 3,
	name : '盐',
	display_name : '盐',
	func : (cb)=>{
		cga.travel.newisland.toStone('D', ()=>{
			cga.walkList([
				[190, 116, '盖雷布伦森林'],
				[199, 211],
			], cb);
		});
	}		
},
{
	level : 3,
	name : '酱油',
	display_name : '酱油',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('亚留特村', ()=>{
			cga.walkList([
				[8, 3, '村长的家'],
				[6, 14, '亚留特村'],
				[66, 64, '芙蕾雅'],
				[624, 110],
			], cb);
		});
	}
},
{
	level : 3,
	name : '白菜',
	display_name : '白菜',
	func : (cb)=>{
		cga.travel.newisland.toStone('X', ()=>{
			cga.walkList([
				[165, 153],
			], (r)=>{
				cga.TurnTo(165, 154);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(32, -1);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(8, -1);
						cga.AsyncWaitMovement({map:['梅布尔隘地'], delay:1000, timeout:10000}, (err)=>{
							if(err){
								retry();
								return;
							}
							cga.walkList([
							[195, 58],
							],cb);
						});
					});
				});
			});
		});
	}
},
{
	level : 4,
	name : '竹笋',
	display_name : '竹笋',
	func : (cb)=>{
		cga.travel.newisland.toStone('X', ()=>{
			cga.walkList([
				[112, 102, '温迪尔平原'],
				[224, 60, '盖雷布伦森林'],
				[108, 123, '法兰城遗迹'],
				[135, 117,],
			], cb);
		});
	}		
},
{
	level : 4,
	name : '芹菜',
	display_name : '芹菜',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('亚留特村', ()=>{
			cga.walkList([
				[8, 3, '村长的家'],
				[6, 14, '亚留特村'],
				[66, 64, '芙蕾雅'],
				[606, 64],
			], cb);
		});
	}
},
{
	level : 4,
	name : '海苔',
	display_name : '海苔',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('亚留特村', ()=>{
			cga.walkList([
				[8, 3, '村长的家'],
				[6, 14, '亚留特村'],
				[59, 31, '芙蕾雅'],
				[617, 25],
			], cb);
		});
	}
},
{
	level : 5,
	name : '牛肉',
	display_name : '牛肉',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('奇利村', ()=>{
			cga.walkList([
				[7, 6, '村长的家'],
				[7, 1, 3212],
				[1, 9, '奇利村'],
				[79, 76, '索奇亚'],
				[359, 375],
			], cb);
		});
	}
},
{
	level : 5,
	name : '星鳗',
	display_name : '星鳗',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('维诺亚村', ()=>{
			cga.walkList([
				[5, 1, '村长家的小房间'],
				[0, 5, '村长的家'],
				[10, 16, '维诺亚村'],
				[67, 46, '芙蕾雅'],
				[425, 466],
			], cb);
		});
	}
},
{
	level : 5,
	name : '马铃薯',
	display_name : '马铃薯',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[24, 39, '莎莲娜'],
				[182, 487],
			], cb);
		});
	}
},
{
	level : 6,
	name : '砂糖',
	display_name : '砂糖',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[118, 100, '魔法大学'],
				[85, 46],
			], cb);
		});
	}
},
{
	level : 6,
	name : '米',
	display_name : '米',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[71, 18, '莎莲娜'],
				[286, 512],
			], cb);
		});
	}
},
{
	level : 7,
	name : '高级奶油',
	display_name : '高级奶油',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[24, 39, '莎莲娜'],
				[154, 349],
			], cb);
		});
	}
},
{
	level : 7,
	name : '辣椒',
	display_name : '辣椒',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[71, 18, '莎莲娜'],
				[309, 446],
			], cb);
		});
	}
},
{
	level : 7,
	name : '辣椒',
	display_name : '辣椒哥拉尔',
	func : (cb)=>{
		if(cga.GetMapName() != '哥拉尔镇')
			throw new Error('必须从哥拉尔镇启动');
		cga.walkList([
			[176, 105, '库鲁克斯岛'],
			[321, 367],
		], cb);
	}
},
{
	level : 7,
	name : '咖喱块',
	display_name : '咖喱块',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[71, 18, '莎莲娜'],
				[268, 430],
			], cb);
		});
	}
},
{
	level : 8,
	name : '螃蟹',
	display_name : '螃蟹',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[71, 18, '莎莲娜'],
				[318, 503],
			], cb);
		});
	}
},
{
	level : 8,
	name : '霜降牛肉',
	display_name : '霜降牛肉',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[24, 39, '莎莲娜'],
				[115, 320],
			], cb);
		});
	}
},
{
	level : 9,
	name : '伊势虾',
	display_name : '伊势虾',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[95, 112],
			], cb);
		});
	}
},
{
	level : 9,
	name : '海胆',
	display_name : '海胆',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[132, 110],
			], cb);
		});
	}
},
{
	level : 10,
	name : '鱼翅',
	display_name : '鱼翅',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[43, 183],
			], cb);
		});
	}
},
{
	level : 10,
	name : '鳖',
	display_name : '鳖',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[67, 135],
			], cb);
		});
	}
},
{
	level : 10,
	name : '鱼翅',
	display_name : '鱼翅哥拉尔',
	func : (cb)=>{
		if(cga.GetMapName() != '哥拉尔镇')
			throw new Error('必须从哥拉尔镇启动');
		cga.walkList([
			[176, 105, '库鲁克斯岛'],
			[389, 528],
		], cb);
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
		var sayString = '【采集插件】请选择要采集的材料种类';
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