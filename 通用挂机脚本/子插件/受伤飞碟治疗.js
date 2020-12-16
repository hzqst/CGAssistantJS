var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	prepare : (cb)=>{
		if(cga.GetPlayerInfo().health == 0){
			cb(null);
			return;
		}
		
		if(cga.getTeamPlayers().length){
			cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
			setTimeout(thisobj.prepare, 1000, cb);
			return;
		}
		
		var retry = ()=>{
			
			if(cga.GetPlayerInfo().health == 0){
				
				if(cga.getTeamPlayers().length > 0){
					cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
					setTimeout(cb, 1500, null);
					return;
				}
				
				cb(null);
				return;
			}
			
			var doctor = cga.findPlayerUnit((u)=>{
				if((u.injury & 2) == 2 && u.icon == 13)//检测头上的打针图标
					return true;

				return ['实习医师','医师','资深医师','御医','超级医生','神医'].find((n)=>{
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
		
		cga.travel.falan.toStone('C', ()=>{
			cga.walkList([
			[27, 82],
			], retry);
		});
	},
	think : (ctx)=>{
		if(cga.GetPlayerInfo().health != 0)
		{
			ctx.result = 'logback_forced';
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

module.exports = thisobj;