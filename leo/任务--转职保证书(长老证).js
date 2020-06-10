var cga = require('.././cgaapi')(function(){

	var playerinfo = cga.GetPlayerInfo();
	var playerName = playerinfo.name;
	cga.isTeamLeader = true;
	
	var callZLZZ = false;
	
	var cb = (flag)=>{
		if(flag){
			cga.SayWords('脚本完成', 0, 3, 1);
		}else{
			cga.SayWords('脚本错误，退出', 0, 3, 1);
		}
	}

	cga.waitTeammateSay((player, msg)=>{

		if(msg.indexOf('长老之证x7 GET') >= 0 ){
			callZLZZ = true;
		}

		return true;
	});
	
	var battleAgain = ()=>{

		if(cga.isInBattle()){
			setTimeout(battleAgain, 5000);
			return;
		}
		if(cga.getItemCount('长老之证') >= 7){
			cga.SayWords('长老之证x7 GET', 0, 3, 1);
			cb(true);
			return;
		}
		if(callZLZZ){
			cb(true);
			return;
		}
		
		if(cga.isTeamLeader)
			cga.ClickNPCDialog(1, 1);
		
		setTimeout(battleAgain, 5000);
	};

	var retryNpc = (result)=>{
		cga.TurnTo(result.xpos, result.ypos);
		cga.AsyncWaitNPCDialog((err, dlg)=>{
			if(dlg && dlg.message && (dlg.message.indexOf('已死的主人') >= 0 || dlg.message.indexOf('呼呼呼呼呼') >= 0 || dlg.message.indexOf('嘻嘻嘻嘻嘻嘻') >= 0)){
				setTimeout(battleAgain, 1000);
			}
			else
			{
				setTimeout(retryNpc, 5000, result);
			}
		});
	}

	var search = ()=>{
		cga.searchMap((units) => {
			return units.find(u => u.unit_name == '守墓员' && u.type == 1 && u.model_id != 0) || cga.GetMapName() == '？？？'
		}, (err, result) => {
			if(result && result.unit_name == '守墓员'){
				retryNpc(result);
			} else {
				cga.SayWords('附近没有找到守墓员', 0, 3, 1);
			}
		});
	}

	search();
	
});