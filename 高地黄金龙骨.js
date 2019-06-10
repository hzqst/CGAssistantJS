var cga = require('./cgaapi')(function(){
	console.log('高地黄金龙骨 起始地点：艾夏岛 医院 或 艾尔莎岛')
	
	var minHp = 0.5;//50%hp提醒
	var minMp = 0.1;//10%mp提醒
	cga.callHosiptal = false;
	
	cga.listen = ()=>{
		cga.AsyncWaitChatMsg((r)=>{

			if(r.msg && r.msg.indexOf('需要回补') >= 0){
				cga.callHosiptal = true;
			}
		
			cga.listen();
		}, 1000);
	}
	
	cga.gaodiji = ()=>{
		cga.SayWords('黄金龙骨 开始...', 0, 3, 1);
		var stone_to_gaodi = (cb)=>{
			cga.travel.newisland.toStone('D', ()=>{
				const walkTo = [
					[190, 116, '盖雷布伦森林'],
					[231, 222, '布拉基姆高地'],
					[135, 175, null],
				];
				cga.walkList(walkTo, function(r){
					if(!r){
						cb(false);
						return;
					}
					cb(true);
				});
			});
		}
		
		var hosiptal_to_gaodi = (cb)=>{
			const walkTo = [
				[28, 52, '艾夏岛'],
				[190, 116, '盖雷布伦森林'],
				[231, 222, '布拉基姆高地'],
				[135, 175, null],
			];
			cga.walkList(walkTo, function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		}
		
		var gaodi_to_hosiptal = (cb)=>{
			const walkTo = [
				[30, 193, '盖雷布伦森林'],
				[199, 211, '艾夏岛'],
				[112, 81, '医院'],
				[35, 45],
				[35, 46],
				[35, 45],
				[35, 46],
				[35, 45],
			];
			cga.walkList(walkTo, function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		}
		
		var startBattle = ()=>{
			cga.freqMove(2, function(){
				
				if(cga.isInBattle())
					return true;
				
				var playerinfo = cga.GetPlayerInfo();
				var petinfo = cga.GetPetInfo(playerinfo.petid);
				if( playerinfo.hp < playerinfo.maxhp * minHp ||
					playerinfo.mp < playerinfo.maxmp * minMp || 
					petinfo.hp < petinfo.maxhp * minHp ||
					petinfo.mp < petinfo.maxmp * minMp || 
					cga.callHosiptal ){

					gaodi_to_hosiptal((err)=>{

						cga.TurnTo(36,46);
						cga.SayWords('开始补给...', 0, 3, 1);
						setTimeout(()=>{
							cga.SayWords('补给完毕!', 0, 3, 1);
							cga.callHosiptal = false;
							cga.gaodiji();
						}, 5000);
					});
					return false;
				}
				
				return true;
			});
		}
		var map = cga.GetMapName();
		if(map == '医院'){
			hosiptal_to_gaodi(()=>{
				startBattle();
			});
		} else if(map == '布拉基姆高地'){
			startBattle();
		} else {
			stone_to_gaodi(()=>{
				startBattle();
			});
		}
	}
	
	cga.listen();
	
	cga.gaodiji();
});