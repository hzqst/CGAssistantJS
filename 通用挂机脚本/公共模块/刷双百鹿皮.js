var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	object : {
		name :'鹿皮'，
		func : (cb) =>{
			cga.travel.falan.toStone('E1', ()=>{
				cga.walkList([
				[281, 88, '芙蕾雅'],
				[596, 247]
				], cb);
			});
		},
	},
	check_done : ()=>{
		return cga.getItemCount('鹿皮') >= 40 * 5;
	},
	check_drop : ()=>{
		var dropItemPos = -1;
		cga.getInventoryItems().forEach((item)=>{
			if(dropItemPos != -1)
				return;
			if(item.name == '传说中的鹿皮' && item.count >= 40){
				dropItemPos = item.pos;
				return;
			}
		});
		
		if(dropItemPos != -1)
			cga.DropItem(dropItemPos);
	},
	translate : (pair)=>{
		
		if(pair.field == 'gatherCount'){
			pair.field = '采集数量';
			pair.value = pair.value + '组';
			pair.translated = true;
			return true;
		}
		
		return false;
	},
	loadconfig : (obj, cb)=>{
		configTable.gatherCount = obj.gatherCount;
		thisobj.gatherCount = obj.gatherCount;
		thisobj.object.gatherCount = obj.gatherCount;
		
		if(!thisobj.gatherCount){
			console.error('读取配置：采集数量失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【采集插件】请选择采集数量(组):';
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, val)=>{
			if(val !== null && val >= 1 && val <= 20){
				configTable.gatherCount = val;
				thisobj.gatherCount = val;
				thisobj.object.gatherCount = val;
				
				var sayString2 = '当前已选择:采集数量[' + thisobj.gatherCount + ']组。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb2(null);
				
				return false;
			}
			
			return true;
		});
	}
}

module.exports = thisobj;