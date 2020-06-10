var cga = require('.././cgaapi')(function(){
	
	var playerinfo = cga.GetPlayerInfo();
	var playerName = playerinfo.name;
	cga.isTeamLeader = true;

	var goodToGoZDZ = ()=>{
		
		var findZDZ_D = ()=>{
			cga.walkList([
				[193, 184],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 192, 184)){
					cga.turnTo(192, 184);
					return;
				}
				cga.SayWords('错误：找不到任何活着的障碍物!', 0, 3, 1);
				goodToGoZDZ();
				return;
			});
		}
		
		var findZDZ_C = ()=>{
			cga.walkList([
				[213, 225],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 213, 226)){
					cga.turnTo(213, 226);
					return;
				}
				findZDZ_D();
				return;
			});
		}
		
		var findZDZ_BC = ()=>{
			cga.walkList([
				[228, 206],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 228, 207)){
					cga.turnTo(228, 207);
					return;
				}
				findZDZ_C();
				return;
			});
		}

		var findZDZ_B = ()=>{
			cga.walkList([
				[234, 202],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 235, 202)){
					cga.turnTo(235, 202);
					return;
				}
				findZDZ_BC();
				return;
			});
		}
		
		var findZDZ_A = ()=>{
			cga.walkList([
				[229, 177],
			], ()=>{
				if(cga.findNPCByPosition('障碍物', 230, 177)){
					cga.turnTo(230, 177);
					return;
				}
				findZDZ_B();
				return;
			});
		}
		
		if(cga.isTeamLeader)
		{
			setTimeout(findZDZ_A, 1000);
		}
		
		var battleAgain = ()=>{

			if(cga.isInBattle()){
				setTimeout(battleAgain, 1500);
				return;
			}
			
			var pos = cga.GetMapXY();
			if(pos.x == 163 && pos.y == 100){
				return;
			}
			
			setTimeout(battleAgain, 1500);
		};

		setTimeout(battleAgain, 1500);
	}
	

	goodToGoZDZ();
	
});