var muteUntil = 0;

var thisobj = {
	mute : 15,
	translate : (pair)=>{
		
		if(pair.field == 'minHpPercent'){
			pair.field = '回补血量百分比';
			pair.value = pair.value + '%';
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'minMpPercent'){
			pair.field = '回补蓝量百分比';
			pair.value = pair.value + '%';
			pair.translated = true;
			return true;
		}
		
		return false;
	},
	battle : (ctx)=>{

		var curTime = new Date().getTime();
		if(ctx.playerinfo.hp < ctx.playerinfo.maxhp * thisobj.minHpPercent / 100 && curTime >= muteUntil){
			cga.SayWords('人物血量不够，需要回补!', 0, 3, 1);
			muteUntil = curTime + 1000 * thisobj.mute;
			ctx.result = 'supply';
			ctx.reason = '人物血量不够';
			return;
		}
		if(ctx.playerinfo.mp < ctx.playerinfo.maxmp * thisobj.minMpPercent / 100 && curTime >= muteUntil){
			cga.SayWords('人物蓝量不够，需要回补!', 0, 3, 1);
			muteUntil = curTime + 1000 * thisobj.mute;
			ctx.result = 'supply';
			ctx.reason = '人物蓝量不够';
			return true;
		}

		if(ctx.petinfo.hp < ctx.petinfo.maxhp * thisobj.minHpPercent / 100 && curTime >= muteUntil){
			cga.SayWords('宠物血量不够，需要回补!', 0, 3, 1);
			muteUntil = curTime + 1000 * thisobj.mute;
			ctx.result = 'supply';
			ctx.reason = '宠物血量不够';
			return true;
		}
		
		if(ctx.petinfo.mp < ctx.petinfo.maxmp * thisobj.minMpPercent / 100 && curTime >= muteUntil){
			cga.SayWords('宠物蓝量不够，需要回补!', 0, 3, 1);
			muteUntil = curTime + 1000 * thisobj.mute;
			ctx.result = 'supply';
			ctx.reason = '宠物蓝量不够';
			return true;
		}
	},
	loadconfig : (obj, cb)=>{
		configTable.minHpPercent = obj.minHpPercent;
		thisobj.minHpPercent = obj.minHpPercent
		
		if(!thisobj.minHpPercent){
			console.error('读取配置：回补血量百分比失败！');
			return false;
		}
		
		configTable.minMpPercent = obj.minMpPercent;
		thisobj.minMpPercent = obj.minMpPercent;
		
		if(!thisobj.minMpPercent){
			console.error('读取配置：回补蓝量百分比失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var ask = (cb2, name, varName)=>{
			var sayString = '【回补提醒插件】请选择'+name+'小于百分之几回补(0~100):';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 0 && val <= 100){
					configTable[varName] = val;
					thisobj[varName] = val;
					
					var sayString2 = '当前已选择:'+name+'小于[' + thisobj[varName] + ']%回补。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return true;
				}
				
				return false;
			});
		}
		
		ask(()=>{
			ask(()=>{
				cb(null);
			}, '蓝量', 'minMpPercent');
		}, '血量', 'minHpPercent');
	}
};

module.exports = thisobj;