var fs = require('fs');

var cga = require('./cgaapi')(function(){
	console.log('营地通用脚本 起始地点：艾尔莎岛 里堡 营地 （或医院） 或 肯吉罗岛')
	
	var configPath = __dirname+'/脚本设置';
	var configName = configPath+'/营地_'+cga.GetPlayerInfo().name+'.json';
	
	var minHp = 0.5;//50%hp提醒
	var minMp = 0.2;//10%mp提醒
	
	var playerinfo = cga.GetPlayerInfo();
	
	var teammates = [];
		
	cga.isTeamLeader = false;
	
	cga.callHosiptal = false;
	
	var sellObject = null;
	var supplyObject = null;

	var yd_to_out = (cb)=>{
		const walkTo = [
			[37, 87],
			[36, 87, '肯吉罗岛'],
			[548, 332],
		];
		cga.walkList(walkTo, cb);
	}
	
	var falan_to_yd = cga.travel.falan.toCamp;
	
	var hosiptal_to_gongfang = (cb)=>{
		const walkTo = [
			[9, 20],
			[0, 20, '圣骑士营地'],
			[87, 72, '工房'],
			[21, 22],
			[20, 22],
			[21, 22],
			[20, 22],
			[21, 22],
		];
		cga.walkList(walkTo, function(r){
			if(!r){
				cb(false);
				return;
			}
			cga.TurnTo(21, 24);
			cga.sellStone(function(){
				setTimeout(()=>{
					cga.SayWords('卖石完毕...', 0, 3, 1);
					cb(true);
				}, 5000);
			});
		});
	}
	
	var gongfang_to_out = (cb)=>{
		const walkTo = [
			[30, 37, '圣骑士营地'],
			[36, 87, '肯吉罗岛'],
			[548, 332],
		];
		cga.walkList(walkTo, cb);
	}
	
	var hosiptal_to_out = (cb)=>{
		const walkTo = [
			[0, 20, '圣骑士营地'],
			[36, 87, '肯吉罗岛'],
			[548, 332],
		];
		cga.walkList(walkTo, cb);
	}

	var startBattle = ()=>{
		cga.freqMove(0, function(){
			
			if(cga.isInBattle())
				return true;
			
			var playerinfo = cga.GetPlayerInfo();
			var petinfo = cga.GetPetInfo(playerinfo.petid);

			if(playerinfo.health > 0){
				cga.LogBack();
				process.exit(1);
				return;
			}
			
			var nowteamplayers = cga.getTeamPlayers();
			
			if(teammates.length > 1 && nowteamplayers.length < teammates.length)
			{
				cga.LogBack();
				process.exit(1);
				return;
			}
			
			if( playerinfo.hp < playerinfo.maxhp * minHp ||
				playerinfo.mp < playerinfo.maxmp * minMp || 
				petinfo.hp < petinfo.maxhp * minHp ||
				petinfo.mp < petinfo.maxmp * minMp || 
				cga.callHosiptal ){
					
				supplyObject.func(()=>{
					cga.TurnTo(11,11);
					cga.SayWords('开始补给...', 0, 3, 1);
					setTimeout(()=>{
						cga.SayWords('补给完毕!', 0, 3, 1);
						cga.callHosiptal = false;			
						loop();
					}, 8000);
				});
				
				return false;
			}
			
			return true;
		});
	}

	var wait = ()=>{
		cga.WalkTo(96, 86);
		cga.waitTeammates(teammates, (r)=>{
			if(r){
				loop();
				return;
			}
			setTimeout(wait, 1000);
		});
	}

	var loop = ()=>{
		var map = cga.GetMapName();
		if(map == '医院'){
			sellObject.func(startBattle);
		} else if(map == '工房'){
			gongfang_to_out(()=>{
				startBattle();
			});
		} else if(map == '肯吉罗岛'){
			startBattle();
		} else if(map == '圣骑士营地'){
			yd_to_out(()=>{
				startBattle();
			});
		} else if(map == '艾尔莎岛' || map == '里谢里雅堡'){
			cga.travel.falan.toCamp(()=>{
				var teamplayersnow = cga.getTeamPlayers();
				if(cga.isTeamLeader && teamplayersnow.length < teammates.length)
				{
					wait();
				}
				else
				{
					loop();
				}
			});
		}
	}
	
	var sellArray = [
	{
		type:1,
		name:'卖石',
		func:(cb)=>{
			hosiptal_to_gongfang(()=>{
				gongfang_to_out(cb);
			});
		}
	},
	{
		type:2,
		name:'不卖石',
		func:(cb)=>{
			hosiptal_to_out(cb);
		}
	}
	]
	
	var supplyArray = [
	{
		type:1,
		name:'资深护士回补',
		func:(cb)=>{
			cga.walkList([
				[551, 332, '圣骑士营地'],
				[95, 72, '医院'],
				[9, 11],
				[9, 12],
				[9, 11],
				[9, 12],
				[9, 11],
			], cb);
		}
	},
	{
		type:2,
		name:'普通护士回补',
		func:(cb)=>{
			cga.walkList([
				[551, 332, '圣骑士营地'],
				[95, 72, '医院'],
				[18, 15],
				[18, 16],
				[18, 15],
				[18, 16],
				[18, 15],
			], cb);
		}
	}
	]
	
	var saveConfig = ()=>{
		
		var teamplayers = cga.getTeamPlayers();

		for(var i in teamplayers)
			teammates[i] = teamplayers[i].name;
		
		cga.isTeamLeader = (teammates[0] == playerinfo.name) ? true : false;
		
		cga.SayWords('设置已保存，队伍列表：['+teammates.join(',')+']。输入“c”可清除设置。', 0, 3, 1);
		
		try{
			fs.mkdirSync(configPath);
		}catch(e)
		{

		}
		
		fs.writeFileSync(configName, 
		JSON.stringify({
			sell:sellObject.type,
			supply:supplyObject.type,
			teammates:teammates,
			isTeamLeader:cga.isTeamLeader,
		}));
	}

	var readConfig = ()=>{
		try{
			var json = fs.readFileSync(configName, 'utf8');
			if(typeof json == 'string' && json.length > 0){
				var obj = JSON.parse(json);
				
				for(var i in sellArray){
					if(sellArray[i].type == obj.sell){
						sellObject = sellArray[i];
						break;
					}
				}
				
				for(var i in supplyArray){
					if(supplyArray[i].type == obj.supply){
						supplyObject = supplyArray[i];
						break;
					}
				}
				
				teammates = obj.teammates;
				cga.isTeamLeader = isTeamLeader;
				
				cga.SayWords('设置已读取，队伍列表：['+teammates.join(',')+']。', 0, 3, 1);

				if(sellObject != null && supplyObject != null)
					return true;
			}
		}catch(e)
		{
			console.log()
		}
		
		return false;
	}
	
	var clearConfig = ()=>{
		try {
			fs.unlinkSync(configName);
			cga.SayWords('脚本设置已清除。', 0, 3, 1);
		}catch(e)
		{

		}
	}
	
	var waitClear = ()=>{
		
		if(cga.isTeamLeader)
		{	
			cga.waitTeammateSay((player, msg)=>{

				if(!cga.callHosiptal && msg.indexOf('需要回补') >= 0){
					cga.callHosiptal = true;
				}
				
				return true;
			});
		}
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				if(msg == 'c'){
					clearConfig();
				}
			}

			return true;
		});
	}
	
	var wait2 = ()=>{
		cga.SayWords('欢迎使用CGA通用营地脚本，输入1资深护士回补，输入2普通护士回补。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				for(var i in supplyArray){
					if(supplyArray[i].type == parseInt(msg)){
						supplyObject = supplyArray[i];
						break;
					}
				}
				
				if(supplyObject != null){
					cga.SayWords('您选择了'+supplyObject.name+'。', 0, 3, 1);
					saveConfig();
					waitClear();
					loop();
					return false;
				}
			}

			return true;
		});
	}
	
	if(readConfig())
	{
		cga.SayWords('脚本设置已恢复：'+sellObject.name+'，'+supplyObject.name+'。输入“c”可清除设置。', 0, 3, 1);

		waitClear();
		
		loop();		
	}
	else
	{
		cga.SayWords('欢迎使用CGA通用营地脚本，输入1卖石，输入2不卖石。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				for(var i in sellArray){
					if(sellArray[i].type == parseInt(msg)){
						sellObject = sellArray[i];
						break;
					}
				}
				
				if(sellObject != null){
					cga.SayWords('您选择了'+sellObject.name+'。', 0, 3, 1);
					wait2();				
					return false;
				}
			}

			return true;
		});
	}
});