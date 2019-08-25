var Async = require('async');
var cga = global.cga;
var configTable = global.configTable;

var healObject = require('./../公共模块/治疗自己');
var rebirthArray = ['不变身', '变身'];

var craftSkillList = cga.GetSkillsInfo().filter((sk)=>{
	return (sk.name.indexOf('制') == 0 || sk.name.indexOf('造') == 0 || sk.name.indexOf('铸') == 0 );
});

var loop = ()=>{

	var playerInfo = cga.GetPlayerInfo();
	if(playerInfo.mp < playerInfo.maxmp)
	{
		cga.travel.falan.toCastleHospital(()=>{
			setTimeout(loop, 3000);
		});
		return;
	}
	
	if(playerInfo.health > 0){
		healObject.func(loop);
		return;
	}

	var craft = ()=>{
		
		console.log('carft')

		if(thisobj.rebirth == 1){
			if(cga.GetPlayerInfo().punchclock == 0){
				cga.SayWords('卡时不足，无法精灵变身', 0, 3, 1);
				loop();
			} else {
				cga.DoRequest(cga.REQUEST_TYPE_REBIRTH_ON);
			}
		}

		cga.craftItemEx({
			craftitem : thisobj.craftItem.itemid,
			extraitem : thisobj.addExtraItem,
			immediate : true,
		}, (err, r)=>{
			console.log(err);
			//console.log(r);
			if(r && r.success){
				thisobj.craftedCount ++;
				console.log('已造' + thisobj.craftedCount + '件！');
				if(thisobj.craftedCount >= thisobj.craftCount){
					cga.SayWords('已达到设定的制造数量！', 0, 3, 1);
					return;
				}
				craft();
			} else {
				loop();
			}
		});
	}
	
	craft();
}

var thisobj = {
	craftedCount : 0,
	getDangerLevel : ()=>{
		return 0;
	},
	translate : (pair)=>{
		
		if(pair.field == 'craftType'){
			pair.field = '制造类型';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'craftItem'){
			pair.field = '制造物品';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'addExtraItem'){
			pair.field = '添加宝石';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'craftCount'){
			pair.field = '制造数量';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		if(pair.field == 'rebirth'){
			pair.field = '是否变身';
			pair.value = pair.value == 1 ? '变身' : '不变身';
			pair.translated = true;
			return true;
		}
		
		if(healObject.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{
		
		for(var i in craftSkillList){
			if(craftSkillList[i].name == obj.craftType){
				configTable.craftType = craftSkillList[i].name;
				thisobj.craftSkill = craftSkillList[i];
				thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);
				break;
			}
		}
		
		if(!thisobj.craftSkill){
			console.error('读取配置：制造类型失败！');
			return false;
		}
		
		for(var i in thisobj.craftItemList){
			if(thisobj.craftItemList[i].itemid == obj.craftItem){
				configTable.craftItem = thisobj.craftItemList[i].itemid;
				thisobj.craftItem = thisobj.craftItemList[i];
				break;
			}
		}
		
		if(!thisobj.craftItem){
			console.error('读取配置：制造物品失败！');
			return false;
		}
		
		if(obj.addExtraItem){
			configTable.addExtraItem = obj.addExtraItem;
			thisobj.addExtraItem = obj.addExtraItem;
		}
		
		configTable.rebirth = obj.rebirth;
		thisobj.rebirth = obj.rebirth
		
		if(thisobj.rebirth == undefined){
			console.error('读取配置：是否变身失败！');
			return false;
		}
		
		configTable.craftCount = obj.craftCount;
		thisobj.craftCount = obj.craftCount
		
		if(!thisobj.craftCount){
			console.error('读取配置：制造数量失败！');
			return false;
		}
		
		if(!healObject.loadconfig(obj))
			return false;

		return true;
	},
	inputcb : (cb)=>{
		var stage1 = (cb2)=>{
			var sayString = '【制造插件】请选择制造类型:';
			for(var i in craftSkillList){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + craftSkillList[i].name;
			}
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && craftSkillList[index - 1]){
					configTable.craftType = craftSkillList[index - 1].name;
					thisobj.craftSkill = craftSkillList[index - 1];
					thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);

					var sayString2 = '当前已选择:[' + thisobj.craftSkill.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					return false;
				}
				
				return true;
			});
		}
		var stage2 = (cb2)=>{
			var sayString = '【制造插件】请选择制造物品:';
			for(var i in thisobj.craftItemList){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + thisobj.craftItemList[i].name;
			}
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && thisobj.craftItemList[index - 1]){
					configTable.craftItem = thisobj.craftItemList[index - 1].itemid;
					thisobj.craftItem = thisobj.craftItemList[index - 1];
					
					var sayString2 = '当前已选择:[' + thisobj.craftItem.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					return false;
				}
				
				return true;
			});
		}
		
		var stage3 = (cb2)=>{
									
			var itemObjects = {};
			
			cga.getInventoryItems().forEach((eq)=>{
				if(eq.type == 38)
					itemObjects[eq.name] = 1;
			})
			
			var itemArray = [];
			var index = 0;
			for(var name in itemObjects){
				if(index != 0)
					sayString += ', ';
				sayString += '('+ (index+1) + ')' + name;
				itemArray[index] = name;
				index ++;
			}
			
			if(!itemArray.length){
				cb2(null);
				return;
			}
			
			var sayString = '【制造插件】请选择制造时添加的宝石:';
			for(var i in itemArray){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + itemArray[i];
			}
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && itemArray[index - 1]){
					configTable.addExtraItem = itemArray[index - 1];
					thisobj.addExtraItem = itemArray[index - 1];
					
					var sayString2 = '当前已选择:[' + thisobj.addExtraItem + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					return false;
				}
				
				return true;
			});
		}
		
		var stage4 = (cb2)=>{
			
			var sayString = '【制造插件】请选择是否精灵变身: 0不变身 1变身';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 0 && val <= 1){
					configTable.rebirth = val;
					thisobj.rebirth = val;
					
					var sayString2 = '当前已选择:'+rebirthArray[thisobj.rebirth]+'。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}
		
		var stage5 = (cb2)=>{
			
			var sayString = '【制造插件】请选择制造几件: 1~99999';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 1 && val <= 99999){
					configTable.craftCount = val;
					thisobj.craftCount = val;
					
					var sayString2 = '当前已选择:'+thisobj.craftCount+'件。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}
		
		Async.series([stage1, stage2, stage3, stage4, stage5, healObject.inputcb], cb);
	},
	execute : ()=>{
		callSubPlugins('init');
		loop();
	},
};

module.exports = thisobj;