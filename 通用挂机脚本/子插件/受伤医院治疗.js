var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	prepare : (cb)=>{
		if(!cga.needDoctor()){
			cb(null);
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
						
						cb(true);
					});
				});
			});
		});
	},
	think : (ctx)=>{
		if(cga.needDoctor())
		{
			ctx.result = 'logout';
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