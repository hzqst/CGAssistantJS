//begin from 艾尔莎岛

var cga = require('./cgaapi')(function(){
	console.log('回廊刷气绝 起始地点：灵堂 回廊 或 艾尔莎岛')
	
	cga.loopcount = 0;
	
	cga.huilang = ()=>{
		cga.SayWords('回廊 开始...', 0, 3, 1);
		var stone_to_huilang = (cb)=>{
			cga.travel.falan.toStone('C', ()=>{
				const walkTo = [
					[47, 85, '召唤之间'],
					[27, 8, '回廊'],
					[23, 23],
					[23, 19, '灵堂', null, null, true],
					[30, 49],
				];
				cga.walkList(walkTo, cb);
			});
		}
		
		var hosiptal_to_huilang = (cb)=>{
			const walkTo = [
				[23, 19, '灵堂', null, null, true],
				[30, 49, null, null, null, true],
			];
			cga.walkList(walkTo, cb);
		}
		
		var huilang_to_hosiptal = (cb)=>{
			const walkTo = [
				[31, 48, '回廊', null, null, true],
				[25, 22, null, null, null, true],
			];
			cga.walkList(walkTo, cb);
		}
		
		var startBattle = ()=>{
			cga.freqMove(0, function(){
				
				if(cga.isInBattle())
					return true;
				
				var playerinfo = cga.GetPlayerInfo();
				if( playerinfo.mp < 15 ){

					huilang_to_hosiptal(()=>{

						cga.TurnTo(27,22);
						cga.SayWords('开始补给...', 0, 3, 1);
						setTimeout(()=>{
							cga.SayWords('补给完毕!', 0, 3, 1);
							cga.loopcount ++;
							cga.SayWords('已刷'+cga.loopcount+'轮', 0, 3, 1);
							cga.callHosiptal = false;
							cga.huilang();
						}, 3000);
					});
					return false;
				}
				
				return true;
			});
		}
		var map = cga.GetMapName();
		if(map == '回廊'){
			hosiptal_to_huilang(()=>{
				startBattle();
			});
		} else if(map == '灵堂'){
			startBattle();
		} else {
			stone_to_huilang(()=>{
				startBattle();
			});
		}
	}
	
	cga.huilang();
});