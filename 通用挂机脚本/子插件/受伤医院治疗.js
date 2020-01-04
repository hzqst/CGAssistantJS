var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	prepare : (cb)=>{
		if(!cga.needDoctor()){
			cb(null);
			return;
		}
		
		if(cga.getTeamPlayers().length){
			cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
			setTimeout(thisobj.prepare, 1000, cb);
			return;
		}
		
		cga.travel.falan.toStone('E2', ()=>{
			cga.walkList([
			[221, 83, '医院'],
			[12, 18],
			], ()=>{
				cga.TurnTo(10, 18);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(0, 6);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(dlg.message.indexOf('不够') >= 0){
							throw '受伤治疗钱不够！';
						}
						
						cb(null);
					});
				});
			});
		});
	},
	think : (ctx)=>{
		if(cga.needDoctor())
		{
			ctx.result = 'logback_forced';
			ctx.reason = '受伤医院治疗';
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