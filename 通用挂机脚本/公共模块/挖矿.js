var mineArray = [
{
	level : 1,
	name : '铜',
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
	func : (cb)=>{
		cga.travel.falan.toStone('W1', (r)=>{
			cga.walkList([
				[22, 87, '芙蕾雅'],
				[351, 145, '国营第24坑道 地下1楼'],
				[22, 22, '国营第24坑道 地下2楼'],
				[22, 21],
			], (r)=>{
				cga.TurnTo(22, 20);
				setTimeout(()=>{
					cga.walkList([
						[23, 13, '国营第24坑道  地下3楼'],
						[29, 3, '国营第24坑道  地下4楼'],
						[19, 36],
					], cb);
				}, 1000);				
			});
		});
	},
	prerequisite : ()=>{
		return cga.getItemCount('矿山钥匙') > 0;
	},
	prerequisite_info : '需要矿山钥匙！'
},
{
	level : 3,
	name : '银',
	func : (cb)=>{
		cga.travel.falan.toStone('W1', (r)=>{
			cga.walkList([
				[22, 87, '芙蕾雅'],
				[351, 145, '国营第24坑道 地下1楼'],
				[22, 22, '国营第24坑道 地下2楼'],
				[22, 21],
			], (r)=>{
				cga.TurnTo(22, 20);
				setTimeout(()=>{
					cga.walkList([
						[23, 13, '国营第24坑道  地下3楼'],
						[6, 3, '国营第24坑道  地下4楼'],
						[24, 17],
					], cb);
				}, 1000);
			});
		});
	},
	prerequisite : ()=>{
		return cga.getItemCount('矿山钥匙') > 0;
	},
	prerequisite_info : '需要矿山钥匙！'
},
{
	level : 4,
	name : '纯银',
	func : (cb)=>{
		cga.travel.falan.toStone('S', (r)=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
				[473, 316],
			], function(r){
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, function(r){
						cga.walkList([
						[49, 66],
						], cb);	
					});					
				});					
			});
		});
	}
},
{
	level : 5,
	name : '金',
	func : (cb)=>{
		cga.travel.falan.toStone('S', (r)=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
				[473, 316],
			], function(r){
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, function(r){
						cga.walkList([
						[52, 11],
						], cb);	
					});					
				});					
			});
		});
	}
},
{
	level : 6,
	name : '白金',
	func : (cb)=>{
		cga.travel.falan.toStone('S', (r)=>{
			cga.walkList([
				[153, 241, '芙蕾雅'],
				[473, 316],
			], function(r){
				cga.TurnTo(471, 316);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, -1);
					cga.AsyncWaitMovement({map:'维诺亚洞穴 地下1楼', delay:1000, timeout:5000}, function(r){
						cga.walkList([
						[8, 69],
						], cb);	
					});					
				});					
			});
		});
	}
},
{
	level : 7,
	name : '幻之钢',
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
	level : 9,
	name : '勒格耐席鉧',
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
			pair.field = '要挖的矿';
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
			console.error('读取配置：要挖的矿失败！');
			return false;
		}
				
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【采集插件】请选择要挖的矿:';
		for(var i in mineArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + mineArray[i].name;
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, val)=>{
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