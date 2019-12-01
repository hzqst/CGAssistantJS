var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	prepare : (cb)=>{
		if(cga.GetPlayerInfo().health == 0){
			cb(null);
			return;
		}
		
		var retry = ()=>{
			
			if(cga.GetPlayerInfo().health == 0){
				
				if(cga.getTeamPlayers().length > 0){
					cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
					setTimeout(cb, 1500, true);
					return;
				}
				
				cb(null);
				return;
			}
			
			var doctor = cga.findPlayerUnit((u)=>{
				return ['见习医生','医生','资深医生','御医','超级医生','神医'].find((n)=>{
					return n == u.title_name;
				}) == undefined ? false : true;
			});
						
			if(doctor && cga.getTeamPlayers().length == 0){
				var target = cga.getRandomSpace(doctor.xpos,doctor.ypos);
				cga.walkList([
				target
				], ()=>{
					cga.addTeammate(doctor.unit_name, (r)=>{
						setTimeout(retry, 1500);
					})
				});
			} else {
				setTimeout(retry, 1500);
			}
		}
		
		cga.travel.falan.toStone('C', retry);
	},
	think : (ctx)=>{
		if(cga.GetPlayerInfo().health != 0)
		{
			ctx.result = 'logout';
			ctx.reason = '受伤飞碟治疗';
		}
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};