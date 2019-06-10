//begin from 艾尔莎岛 医院

var cga = require('./cgaapi')(function(){
	console.log('营地 起始地点：艾尔莎岛 里堡 营地 （或医院） 或 肯吉罗岛')
	
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
		
	cga.yingdi = ()=>{
		cga.SayWords('圣骑士营地 开始...', 0, 3, 1);
		var yd_to_out = (cb)=>{
			const walkTo = [
				[37, 87],
				[36, 87, '肯吉罗岛'],
				[548, 332],
			];
			cga.walkList(walkTo, function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		}
		
		var falan_to_yd = cga.travel.falan.toCamp;
		
		var hosiptal_to_gongfang = (cb)=>{
			const walkTo = [
				[9, 20],
				[0, 20, '圣骑士营地'],
				[88, 72],
				[87, 72, '工房'],
				[30, 33],
				[23, 26],
				[23, 19],
				[21, 19],
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
				[21, 19],
				[23, 19],
				[23, 26],
				[30, 34],
				[30, 37, '圣骑士营地'],
				[81, 87],
				[37, 87],
				[36, 87, '肯吉罗岛'],
				[548, 332],
			];
			cga.walkList(walkTo, function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		}
		
		var hosiptal_to_out = (cb)=>{
			const walkTo = [
				[9, 20],
				[0, 20, '圣骑士营地'],
				[81, 87],
				[37, 87],
				[36, 87, '肯吉罗岛'],
				[548, 332],
			];
			cga.walkList(walkTo, function(r){
				if(!r){
					cb(false);
					return;
				}
				cb(true);
			});
		}
		
		var out_to_hosiptal = (cb)=>{
			const walkTo = [
				[551, 332, '圣骑士营地'],
				[81, 87],
				[95, 73],
				[95, 72, '医院'],
				[9, 20],
				[9, 11],
				[9, 12],
				[9, 11],
				[9, 12],
				[9, 11],
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
			cga.freqMove(0, function(){
				
				if(cga.isInBattle())
					return true;
				
				var playerinfo = cga.GetPlayerInfo();
				var petinfo = cga.GetPetInfo(playerinfo.petid);
				if( playerinfo.hp < playerinfo.maxhp * minHp ||
					playerinfo.mp < playerinfo.maxmp * minMp || 
					petinfo.hp < petinfo.maxhp * minHp ||
					petinfo.mp < petinfo.maxmp * minMp || 
					cga.callHosiptal ){
						
					out_to_hosiptal((err)=>{
						cga.TurnTo(11,11);
						cga.SayWords('开始补给...', 0, 3, 1);
						setTimeout(()=>{
							cga.SayWords('补给完毕!', 0, 3, 1);
							cga.callHosiptal = false;			
							cga.yingdi();
						}, 8000);
					});
					
					return false;
				}
				
				return true;
			});
		}
		var map = cga.GetMapName();
		if(map == '医院'){
			hosiptal_to_gongfang(()=>{
				gongfang_to_out(()=>{
					startBattle();
				});
			});
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
			falan_to_yd(()=>{
				yd_to_out(()=>{
					startBattle();
				});
			});
		}
	}
	
	cga.listen();
	
	cga.yingdi();
});