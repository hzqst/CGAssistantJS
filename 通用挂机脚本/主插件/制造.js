var Async = require('async');
var cga = global.cga;
var configTable = global.configTable;

var healObject = require('./../公共模块/治疗自己');

var craftSkillList = cga.GetSkillsInfo().filter((sk)=>{
	return (sk.name.indexOf('制') == 0 || sk.name.indexOf('造') == 0 );
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
		cga.SetImmediateDoneWork((thisobj.craft_count > 0) ? true : false);

		var r = cga.craftNamedItem(thisobj.craftItem.name);
		if(r !== true){
			if(r instanceof Error){
				cga.SayWords(r.message, 0, 3, 1);
				console.log(r);
			}
			setTimeout(loop, 5000);
			return;
		}

		cga.AsyncWaitWorkingResult(function(r){

			if(r.success){
				thisobj.craft_count ++;
				console.log('已造' + thisobj.craft_count + '次！');
			}
			craft();
		}, 30000);
	}
	
	craft();
}

var thisobj = {
	craft_count : 0,
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
			if(thisobj.craftItemList[i].name == obj.craftItem){
				configTable.craftItem = thisobj.craftItemList[i].name;
				thisobj.craftItem = thisobj.craftItemList[i];
				break;
			}
		}
		
		if(!thisobj.craftItem){
			console.error('读取配置：制造物品失败！');
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
			cga.waitForChatInput((msg)=>{
				var pattern=/^[1-9]\d*$|^0$/;
				var index = parseInt(msg);
				if(pattern.test(msg) && index >= 1 && craftSkillList[index - 1]){
					configTable.craftType = craftSkillList[index - 1].name;
					thisobj.craftSkill = craftSkillList[index - 1];
					thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);

					var sayString2 = '当前已选择:[' + thisobj.craftSkill.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					return true;
				}
				
				return false;
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
			cga.waitForChatInput((msg)=>{
				var pattern=/^[1-9]\d*$|^0$/;
				var index = parseInt(msg);
				if(pattern.test(msg) && index >= 1 && thisobj.craftItemList[index - 1]){
					configTable.craftItem = thisobj.craftItemList[index - 1].name;
					thisobj.craftItem = thisobj.craftItemList[index - 1];
					
					var sayString2 = '当前已选择:[' + thisobj.craftItem.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					return true;
				}
				
				return false;
			});
		}
		
		Async.series([stage1, stage2, healObject.inputcb], cb);
	},
	execute : loop,
};

module.exports = thisobj;