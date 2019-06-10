var cga = require('./cgaapi')(function(){
	
	var healme = function(){
		
		var skill = cga.findPlayerSkill('治疗');
		
		var requiremp = 25 + skill.lv * 5;
		
		//补魔
		if (cga.GetPlayerInfo().mp < requiremp){
			cga.walkList([
			[34, 89],
			], ()=>{
				cga.TurnTo(35, 88);
				setTimeout(function(){
					cga.walkList([
					[29, 85],
					], ()=>{
						cga.TurnTo(27, 85);
						healme();
					});
				}, 3000);
			})
			
			return;
		}
		
		//寻找队伍里带拐杖的玩家
		
		var teamplayers = cga.getTeamPlayers();
		
		var index = -1;
		
		for(var i in teamplayers){
			if(teamplayers[i].injury){
				index = i;
				break;
			}
		}

		//找到了
		if(index != -1)
		{
			cga.StartWork(skill.index, skill.lv-1);
			cga.AsyncWaitPlayerMenu(function(players){
				
				console.log(teamplayers);
				console.log(players);
				
				for(var i in players){
					if(players[i].name == teamplayers[index].name){
						
						cga.AsyncWaitUnitMenu(function(units){
							console.log(units);
							
							cga.AsyncWaitWorkingResult(function(r){
								healme();
							});
							cga.UnitMenuSelect(0);
						});
						cga.PlayerMenuSelect(i);
						break;
					}
				}
			});
		}
		else
		{
			//说话防掉线
			cga.SayWords('', 0, 3, 1);
			setTimeout(healme, 2000);
		}
	}
	
	healme();
});