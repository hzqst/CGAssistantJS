require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	var items = ['金币','小护士家庭号','魔力之泉'];
	
	var itemFilter = (unit)=>{
		if(!(unit.flags & cga.emogua.UnitFlags.NpcEntry) && !(unit.flags & leo.UnitFlags.Player)){
			for(var i in items){
				if(unit.item_name.indexOf(items[i]) != -1){
					return true;
				}
			}
		}
	}

	var autoTalk = ()=>{
		leo.say('');
		setTimeout(autoTalk, 30000);
	}
	autoTalk();
	leo.log('红叶の原地拾荒脚本，启动~');

	leo.todo()
	.then(()=>{
		var emptyIndex = leo.getEmptyBagIndexes();
		if(emptyIndex.length == 0){
			return leo.log('背包已满')
			.then(()=>{return leo.reject()});
		}
	})
	.then(()=>{
		return leo.loop(
			()=>leo.todo()
			.then(()=>{
				var emptyIndex = leo.getEmptyBagIndexes();
				if(emptyIndex.length == 0){
					return leo.log('背包已满')
					.then(()=>{return leo.reject()});
				}else{
					var units = cga.GetMapUnits().filter(itemFilter);
					if(units && units.length>0){
						var i = 0;
				    	return leo.loop(
				    		()=>{
				    			if(i < units.length){
				    				var unit = units[i++];
				    				//console.log(unit.xpos,unit.ypos ,unit);
				    				console.log('发现【'+unit.item_name+'】，坐标【'+unit.xpos+','+unit.ypos+'】')
				    				return leo.pickup(unit.xpos,unit.ypos);
				    			}else{
				    				return leo.reject();
				    			}
				    		}
				    	).catch(()=>{return leo.next()});
					}
				}
			})
		)
	})
	.catch(()=>{return leo.log('脚本停止')});
	
});