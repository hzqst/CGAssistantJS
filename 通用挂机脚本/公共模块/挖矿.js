var mineArray = [
{
	level : 1,
	name : '铜',
	display_name : '铜',
	func : (cb)=>{
		cga.travel.falan.toStone('W1', (r)=>{
			cga.walkList([
				[22, 87, '芙蕾雅'],
				[351, 145, '国营第24坑道 地下1楼'],
			], cb);
		});
	}
},
{
	level : 2,
	name : '铁',
	display_name : '铁',
	func : (cb)=>{
		var retry = ()=>{
			cga.walkList([
				[473, 316],
			], (r)=>{
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, (err)=>{
						if(err){
							retry();
							return;
						}
						cga.walkList([
						[20, 14],
						], cb);
					});
				});
			});
		}
		cga.travel.falan.toStone('S', ()=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
			], retry);
		});
	},
},
{
	level : 3,
	name : '银',
	display_name : '银',
	func : (cb)=>{
		var retry = ()=>{
			cga.walkList([
				[473, 316],
			], (r)=>{
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, (err)=>{
						if(err){
							retry();
							return;
						}
						cga.walkList([
						[20, 59, '维诺亚洞穴 地下2楼'],
						[37, 32],
						], cb);
					});
				});
			});
		}
		cga.travel.falan.toStone('S', ()=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
			], retry);
		});
	},
},
{
	level : 4,
	name : '纯银',
	display_name : '纯银',
	func : (cb)=>{
		var retry = ()=>{
			cga.walkList([
				[473, 316],
			], (r)=>{
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, (err)=>{
						if(err){
							retry();
							return;
						}
						cga.walkList([
						[49, 66],
						], cb);
					});
				});
			});
		}
		cga.travel.falan.toStone('S', ()=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
			], retry);
		});
	}
},
{
	level : 5,
	name : '金',
	display_name : '金',
	func : (cb)=>{
		var retry = ()=>{
			cga.walkList([
				[473, 316],
			], (r)=>{
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, (err)=>{
						if(err){
							retry();
							return;
						}
						cga.walkList([
						[52, 11],
						], cb);
					});
				});
			});
		}

		cga.travel.falan.toStone('S', ()=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
			], retry);
		});
	}
},
{
	level : 6,
	name : '白金',
	display_name : '白金',
	func : (cb)=>{
		var retry = ()=>{
			cga.walkList([
				[473, 316],
			], (r)=>{
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, (err)=>{
						if(err){
							retry();
							return;
						}
						cga.walkList([
						[8, 69],
						], cb);
					});
				});
			});
		}
		cga.travel.falan.toStone('S', ()=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
			], retry);
		});
	}
},
{
	level : 7,
	name : '幻之钢',
	display_name : '幻之钢',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[24, 39, '莎莲娜'],
				[196, 443, '莎莲娜海底洞窟 地下1楼'],
				[14, 41, '莎莲娜海底洞窟 地下2楼'],
				[11, 47],
			], cb);
		});
	}
},
{
	level : 8,
	name : '幻之银',
	display_name : '幻之银',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('杰诺瓦镇', ()=>{
			cga.walkList([
				[14, 6, '村长的家'],
				[1, 9, '杰诺瓦镇'],
				[24, 39, '莎莲娜'],
				[196, 443, '莎莲娜海底洞窟 地下1楼'],
				[14, 41, '莎莲娜海底洞窟 地下2楼'],
				[12, 6],
			], cb);
		});
	}
},
{
	level : 9,
	name : '勒格耐席鉧',
	display_name : '勒格耐席鉧',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[258, 180, '莎莲娜西方洞窟'],
				[30, 44, 14001],
				[67, 36],
			], cb);
		});
	}
},
{
	level : 10,
	name : '奥利哈钢',
	display_name : '奥利哈钢',
	func : (cb)=>{
		cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
			cga.walkList([
				[5, 4, '村长的家'],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[258, 180, '莎莲娜西方洞窟'],
				[30, 44, 14001],
				[51, 43],
			], cb);
		});
	}
},
{
	level : 3,
	name : '铝',
	display_name : '铝',
	func : (cb)=>{
		cga.travel.newisland.toStone('D', ()=>{
			cga.walkList([
				[190, 116, '盖雷布伦森林'],
				[231, 222, '布拉基姆高地'],
				[144, 126],
				], (r)=>{
				cga.TurnTo(145, 126);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'布拉基姆高地', delay:1000, timeout:5000}, (err)=>{
						if(err){
							retry();
							return;
						}
						cga.walkList([
						[267, 267, '黑历史之石洞 第1层'],
						], cb);
					});
				});
			});
		})
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