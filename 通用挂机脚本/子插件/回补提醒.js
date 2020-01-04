var thisobj = {
	muteUntil : 0,
	mute : 15,
	translate : (pair)=>{
		
		if(pair.field == 'minHp'){
			pair.field = '回补血量';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'minMp'){
			pair.field = '回补蓝量';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		return false;
	},
	think : (ctx)=>{

		var curTime = new Date().getTime();
		if(thisobj.minHpPercent !== undefined)
		{
			if(ctx.playerinfo.hp < ctx.playerinfo.maxhp * thisobj.minHpPercent / 100 && curTime >= thisobj.muteUntil){
				cga.SayWords('人物血量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '人物血量不够';
				return;
			}
			if(ctx.petinfo != null && ctx.petinfo.hp < ctx.petinfo.maxhp * thisobj.minHpPercent / 100 && curTime >= thisobj.muteUntil){
				cga.SayWords('宠物血量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '宠物血量不够';
				return true;
			}
		}
		else if(thisobj.minHpValue !== undefined)
		{
			if(ctx.playerinfo.hp < thisobj.minHpValue && curTime >= thisobj.muteUntil){
				cga.SayWords('人物血量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '人物血量不够';
				return;
			}
			if(ctx.petinfo != null && ctx.petinfo.hp < thisobj.minHpValue / 100 && curTime >= thisobj.muteUntil){
				cga.SayWords('宠物血量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '宠物血量不够';
				return true;
			}
		}
		if(thisobj.minMpPercent !== undefined)
		{			
			if(ctx.playerinfo.mp < ctx.playerinfo.maxmp * thisobj.minMpPercent / 100 && curTime >= thisobj.muteUntil){
				cga.SayWords('人物蓝量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '人物蓝量不够';
				return true;
			}
			if(ctx.petinfo != null && ctx.petinfo.mp < ctx.petinfo.maxmp * thisobj.minMpPercent / 100 && curTime >= thisobj.muteUntil){
				cga.SayWords('宠物蓝量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '宠物蓝量不够';
				return true;
			}
		}
		else if(thisobj.minMpValue !== undefined)
		{
			if(ctx.playerinfo.mp < thisobj.minMpValue && curTime >= thisobj.muteUntil){
				cga.SayWords('人物蓝量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '人物蓝量不够';
				return true;
			}
			if(ctx.petinfo != null && ctx.petinfo.mp < thisobj.minMpValue && curTime >= thisobj.muteUntil){
				cga.SayWords('宠物蓝量不够，需要回补!', 0, 3, 1);
				thisobj.muteUntil = curTime + 1000 * thisobj.mute;
				ctx.result = 'supply';
				ctx.reason = '宠物蓝量不够';
				return true;
			}
		}
	},
	loadconfig : (obj, cb)=>{
		
		//legacy
		if(obj.minHpPercent != undefined)
		{
			configTable.minHp = obj.minHpPercent;
			thisobj.minHpPercent = obj.minHpPercent;
		}
		if(obj.minHp != undefined)
		{
			if(typeof obj.minHp == 'string' && obj.minHp.charAt(obj.minHp.length - 1) == '%')
			{
				configTable.minHp = obj.minHp;
				thisobj.minHpPercent = parseInt(obj.minHp.substring(0, obj.minHp.length - 1));
			}
			else
			{
				configTable.minHp = obj.minHp;
				thisobj.minHpValue = obj.minHp;
			}
		}
		
		if(thisobj.minHpPercent === undefined && thisobj.minHpValue === undefined){
			console.error('读取配置：回补血量失败！');
			return false;
		}
		
		//legacy
		if(obj.minMpPercent != undefined)
		{
			configTable.minMp = obj.minMpPercent + '%';
			thisobj.minMpPercent = obj.minMpPercent;
		}
		if(obj.minMp != undefined)
		{
			if(typeof obj.minMp == 'string' && obj.minMp.charAt(obj.minMp.length - 1) == '%')
			{
				configTable.minMp = obj.minMp;
				thisobj.minMpPercent = parseInt(obj.minMp.substring(0, obj.minMp.length - 1));
			}
			else
			{
				configTable.minMp = obj.minMp;
				thisobj.minMpValue = obj.minMp;
			}
		}
		
		if(thisobj.minMpPercent === undefined && thisobj.minMpValue === undefined){
			console.error('读取配置：回补蓝量失败！');
			return false;
		}

		return true;
	},
	inputcb : (cb)=>{
		var ask = (cb2, name, varName)=>{
			var sayString = '【回补提醒插件】请选择'+name+'小于多少回补(0%~100%) (0~99999):';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{

				if(msg.charAt(msg.length - 1) == '%')
				{
					var val2 = parseInt(msg.substring(0, msg.length - 1));
					if(val2 !== NaN && val2 >= 0 && val2 <= 100)
					{
						configTable[varName] = val2 + '%';
						thisobj[varName+'Percent'] = val2 + '%';
						
						var sayString2 = '当前已选择:'+name+'小于[' + configTable[varName] + ']回补。';
						cga.sayLongWords(sayString2, 0, 3, 1);
						
						cb2(null);
						return false;
					}
				}
				
				if(val !== null && val >= 0 && val <= 99999){
					configTable[varName] = val;
					thisobj[varName+'Value'] = val;
					
					var sayString2 = '当前已选择:'+name+'小于[' + configTable[varName] + ']回补。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}
		
		ask(()=>{
			ask(()=>{
				cb(null);
			}, '蓝量', 'minMp');
		}, '血量', 'minHp');
	}
};

module.exports = thisobj;