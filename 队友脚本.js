var fs = require('fs');

var cga = require('./cgaapi')(function(){
	console.log('队员脚本，起始地点任意，功能：回补提醒、卖石、换龙角')
	
	var configPath = __dirname+'/脚本设置';
	var configName = configPath+'/队友脚本_'+cga.GetPlayerInfo().name+'.json';
	
	var minHpPercent = 0;
	var minMpPercent = 0;
	
	var eatBottle = '';//恰瓶子
	var eatFood = '';//恰料理

	var mute = 0;
	
	var bottleArray = {
		0 : '不使用血瓶',
		300 : '生命力回复药（300）',
		500 : '生命力回复药（500）',
	};
		
	var useBottle = -1;
		
	var foodArray = {
		0 : '不使用料理',
		550 : '炒面面包',
		650 : '寿喜锅',
	};
	
	var useFood = -1;
	
	var leaderName = '';
	
	var gatherArray = [
	{
		type:0,
		name :'无集合地',
		func:(cb)=>{
			cb(true);
		}
	},
	{
		type:1,
		name :'圣骑士营地',
		func:(cb)=>{
			
			var waitAdd = ()=>{					
				console.log('waitadd2');
				cga.addTeammate(leaderName, (r)=>{
					if(r){
						cb(true);
						return;
					}
					setTimeout(waitAdd, 1000);
				});
			}
			
			var retry = ()=>{
				cga.walkList([
				[8, 21],
				], ()=>{
					cga.TurnTo(7, 21);
					cga.AsyncWaitMovement({map:'圣骑士营地', delay:1000, timeout:5000}, cb);
				})
			}
			
			if(cga.GetMapName() == '圣骑士营地'){
				waitAdd();
			} else if(cga.GetMapIndex().index3 == 27101){
				retry();
			} else {
				cga.travel.falan.toCamp(waitAdd);
			}
		}
	}
	]
	
	var gatherObject = null;
	
	var playerinfo = cga.GetPlayerInfo();

	var openbox = (cb)=>{
		var box = cga.findItem('加强补给品');
		if(box != -1){
			cga.AsyncWaitNPCDialog(function(dlg){
				cga.ClickNPCDialog(4, 0);
				setTimeout(openbox, 1500);
			});
			cga.UseItem(box);
		}
	}
	
	var saveConfig = ()=>{
		
		var teamplayers = cga.getTeamPlayers();
				
		leaderName = teamplayers[0].name;
		
		cga.SayWords('设置已保存，队长：['+leaderName+']。输入“c”可清除设置。', 0, 3, 1);
		
		try{
			fs.mkdirSync(configPath);
		}catch(e)
		{

		}
		
		fs.writeFileSync(configName, 
		JSON.stringify({
			minHpPercent:minHpPercent,
			minMpPercent:minMpPercent,
			bottle:useBottle,
			food:useFood,
			leaderName:leaderName,
			gather:gatherObject.type,
		}));
	}

	var readConfig = ()=>{
		try{
			var json = fs.readFileSync(configName, 'utf8');
			if(typeof json == 'string' && json.length > 0){
				var obj = JSON.parse(json);
								
				minHpPercent = obj.minHpPercent;
				
				minMpPercent = obj.minMpPercent;
				
				for(var i in bottleArray)
				{
					if(i == obj.bottle)
					{
						useBottle = obj.bottle;
						break;
					}
				}
				
				for(var i in foodArray)
				{
					if(i == obj.food)
					{
						useFood = obj.food;
						break;
					}
				}
				
				for(var i in gatherArray){
					if(gatherArray[i].type == obj.gather){
						gatherObject = gatherArray[i];
						break;
					}
				}
				
				leaderName = obj.leaderName;
				
				cga.SayWords('设置已读取，队长：['+leaderName+']。', 0, 3, 1);
				
				return true;
			}
		}catch(e)
		{
			
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
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				if(msg == 'c'){
					clearConfig();
				}
			}

			return true;
		});
	}
	
	var waitArray = [
	{
		mapname:'肯吉罗岛',
		pos:[475, 208],
		cb : ()=>{

			if(cga.getItemCount('龙角') >= 30){
				cga.TurnTo(475, 208);
				cga.AsyncWaitNPCDialog(function(dlg){
					if(typeof dlg.message == 'string' && 
					dlg.message.indexOf('非常好') >= 0){
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(function(dlg){
							cga.ClickNPCDialog(1, 0);
						});
					}
					else if(typeof dlg.message == 'string' && 
					dlg.message.indexOf('滚开') >= 0){
						openbox();
					}
					else if(typeof dlg.message == 'string' && 
					dlg.message.indexOf('新的增援') >= 0){
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(function(dlg){
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog(function(dlg){
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(function(dlg){
									cga.ClickNPCDialog(1, 0);
									
								});
							});
						});
					}
					else if(typeof dlg.message == 'string' && 
					dlg.message.indexOf('哦？不错') >= 0){
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(function(dlg){
							cga.ClickNPCDialog(1, 0);
						});
					}
				});
			}
			
			setTimeout(cga.waitForMultipleLocation, 5000, waitArray);
		}
	},
	{
		mapname:'工房',
		pos:[21, 23],
		cb : ()=>{
			cga.TurnTo(21, 23);
			cga.sellStone(function(){
				cga.SayWords('卖石完毕...', 0, 3, 1);
				setTimeout(cga.waitForMultipleLocation, 15000, waitArray);
			});
		}
	},
	{
		mapname:'矮人城镇',
		pos:[122, 110],
		cb : ()=>{
			cga.TurnTo(122, 110);
			cga.sellStone(function(){
				cga.SayWords('卖石完毕...', 0, 3, 1);
				setTimeout(cga.waitForMultipleLocation, 15000, waitArray);
			});
		}
	},
	{
		mapname:'里谢里雅堡',
		pos:[30, 77],
		cb : ()=>{
			cga.TurnTo(30, 77);
			cga.sellStone(function(){
				cga.SayWords('卖石完毕...', 0, 3, 1);
				setTimeout(cga.waitForMultipleLocation, 15000, waitArray);
			});
		}
	}/*,
	{
		mapindex:27101,//辛希亚探索指挥部
		pos:[7, 21],
		leaveteam:true,
		cb : ()=>{
			
			if(!leaderName.length){
				setTimeout(cga.waitForMultipleLocation, 1500, waitArray);
				return;
			}
			var retry = ()=>{
				console.log('retry');
				cga.TurnTo(7, 21);
				cga.AsyncWaitMovement({map:'圣骑士营地', delay:1000, timeout:5000}, (r)=>{
					setTimeout(cga.waitForMultipleLocation, 1500, waitArray);
				});
			}
			
			retry();
		}
	},
	{
		mapname:'圣骑士营地',
		pos:[97, 86],
		cb : ()=>{
			
			var nowteamplayers = cga.getTeamPlayers();
			if(leaderName.length > 0 && !nowteamplayers.length){
				
				console.log('inposition');
				
				var waitAdd = ()=>{
					
					console.log('waitadd');
					
					cga.addTeammate(leaderName, (r)=>{
						if(r){
							setTimeout(cga.waitForMultipleLocation, 1500, waitArray);
							return;
						}
						setTimeout(waitAdd, 1000);
					});
				}
				
				waitAdd();
			} else {
				setTimeout(cga.waitForMultipleLocation, 1500, waitArray);
			}
		}
	}*/
	];
	
	var check = ()=>{
	
		var playerinfo = cga.GetPlayerInfo();
		
		var petinfo = cga.GetPetInfo(playerinfo.petid);
		
		if(playerinfo.health > 50){
			return false;
		}
		
		var nowteamplayers = cga.getTeamPlayers();
		
		if(leaderName.length > 0 && !nowteamplayers.length){
			return false;
		}

		if(cga.getItemCount('加强补给品') >= 1 && new Date().getTime() >= mute){
			openbox();
			mute = new Date().getTime() + 1000 * 3;
			return true;
		}
		
		if(playerinfo.hp < playerinfo.maxhp * minHpPercent / 100 && new Date().getTime() >= mute){
			cga.SayWords('人物血量不够，需要回补!', 0, 3, 1);
			mute = new Date().getTime() + 1000 * 15;
			return true;
		}
		if(useBottle > 0 && playerinfo.hp < playerinfo.maxhp - useBottle){
			if(eatBottle.length > 0){
				var foodPos = cga.findItem(bottleArray[useBottle]);
				if(foodPos != -1){
					cga.UseItem(foodPos);
					cga.AsyncWaitPlayerMenu(function(players){
						console.log(players);
						cga.PlayerMenuSelect(0);
						cga.AsyncWaitUnitMenu(function(units){
							console.log(units);
							cga.UnitMenuSelect(0);
						});
					});
					
					mute = new Date().getTime() + 1000 * 15;
					return true;
				}
			}
		}
		
		if(playerinfo.mp < playerinfo.maxmp * minMpPercent / 100 && new Date().getTime() >= mute){
			cga.SayWords('人物蓝量不够，需要回补!', 0, 3, 1);
			mute = new Date().getTime() + 1000 * 15;
			return true;
		}
		if(useFood > 0 && playerinfo.mp < playerinfo.maxmp - useFood && new Date().getTime() >= mute){
			if(eatFood.length > 0){
				var foodPos = cga.findItem(foodArray[useFood]);
				if(foodPos != -1){
					cga.UseItem(foodPos);
					cga.AsyncWaitPlayerMenu(function(players){
						console.log(players);
						cga.PlayerMenuSelect(0);
						cga.AsyncWaitUnitMenu(function(units){
							console.log(units);
							cga.UnitMenuSelect(0);
						});
					});
					
					mute = new Date().getTime() + 1000 * 15;
					return true;
				}
			}
		}
		
		if(petinfo.hp < petinfo.maxhp* minHpPercent / 100 && new Date().getTime() >= mute){
			cga.SayWords('宠物血量不够，需要回补!', 0, 3, 1);
			mute = new Date().getTime() + 1000 * 15;
			return true;
		}
		
		if(petinfo.mp < petinfo.maxmp* minMpPercent / 100 && new Date().getTime() >= mute){
			cga.SayWords('宠物蓝量不够，需要回补!', 0, 3, 1);
			mute = new Date().getTime() + 1000 * 15;
			return true;
		}
		
		return true;
	}
	
	var loop = ()=>{
		
		if(!cga.isInBattle())
		{
			if(!check())
			{
				start();
				return;
			}
		}
		
		setTimeout(loop, 1000);
	}

	var start = ()=>{
		if(cga.getTeamPlayers().length == 0 && leaderName && gatherObject)
		{
			gatherObject.func(start);
			return;
		}
		
		cga.waitForMultipleLocation(waitArray);		
		loop();
	}

	var wait5 = ()=>{
		cga.SayWords('欢迎使用CGA通用队友脚本，输入0不设定集合地，输入1设定圣骑士营地作为集合地。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				for(var i in gatherArray){
					if(gatherArray[i].type == parseInt(msg)){
						gatherObject = gatherArray[i];
						break;
					}
				}
				
				if(gatherObject != null){
					cga.SayWords('您选择了'+gatherObject.name+'。', 0, 3, 1);					
					saveConfig();
					waitClear();
					start();
					return false;
				}
			}

			return true;
		});
	}

	var wait4 = ()=>{
		cga.SayWords('欢迎使用CGA通用队友脚本，输入100~1000设置自动使用料理，0代表不使用料理。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				var food = parseInt(msg);
				for(var i in foodArray)
				{
					if(i == food)
					{
						useFood = food;
						break;
					}
				}
				
				if(useFood >= 0){
					cga.SayWords('您选择了'+foodArray[useFood]+'。', 0, 3, 1);					
					wait5();
					return false;
				}
			}

			return true;
		});
	}
	
	
	var wait3 = ()=>{
		cga.SayWords('欢迎使用CGA通用队友脚本，输入100~1000设置自动使用血瓶，0代表不使用血瓶。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				var bottle = parseInt(msg);
				for(var i in bottleArray)
				{
					if(i == bottle)
					{
						useBottle = bottle;
						break;
					}
				}
				
				if(useBottle >= 0){
					cga.SayWords('您选择了'+bottleArray[useBottle]+'。', 0, 3, 1);					
					wait4();
					return false;
				}
			}

			return true;
		});
	}
	
	var wait2 = ()=>{
		cga.SayWords('欢迎使用CGA通用队友脚本，输入0~100设定回补提醒的蓝量百分比。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				var percent = parseInt(msg);
				
				if(percent >= 0 && percent <= 100){
					minMpPercent = percent;
					cga.SayWords('您选择了蓝量少于'+minMpPercent+'%提醒。', 0, 3, 1);					
					wait3();
					return false;
				}
			}

			return true;
		});
	}
	
	if(readConfig())
	{
		cga.SayWords('脚本设置已恢复：回补血量'+minHpPercent+'%，回补蓝量'+minMpPercent+'%，使用血瓶：'+bottleArray[useBottle]+'，使用料理：'+foodArray[useFood]+'，集合地：'+gatherObject.name+'。输入“c”可清除设置。', 0, 3, 1);
		waitClear();		
		start();		
	}
	else
	{
		cga.SayWords('欢迎使用CGA通用队友脚本，输入0~100设定回补提醒的血量百分比。', 0, 3, 1);
		
		cga.waitTeammateSay((player, msg)=>{

			if(player.is_me == true){
				
				var percent = parseInt(msg);
				
				if(percent >= 0 && percent <= 100){
					minHpPercent = percent;
					cga.SayWords('您选择了血量少于'+minHpPercent+'%提醒。', 0, 3, 1);
					wait2();
					return false;
				}
			}

			return true;
		});
	}
});