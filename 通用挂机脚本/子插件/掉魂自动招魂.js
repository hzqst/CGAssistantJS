var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	prepare : (cb)=>{
		if(cga.GetPlayerInfo().souls == 0){
			cb(null);
			return;
		}
		
		cga.travel.falan.toStone('C', ()=>{
			cga.walkList([
			[41, 14, '法兰城'],
			[153, 29, '大圣堂的入口'],
			[14, 7, '礼拜堂'],
			[12, 19],
			], ()=>{
				cga.TurnTo(12, 17);
				cga.AsyncWaitNPCDialog((err, dlg)=>{
					if(dlg.message && dlg.message.indexOf('我将为你取回') >= 0)
					{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog((err, dlg)=>{
							if(dlg.message && dlg.message.indexOf('不够') >= 0){
								throw '招魂钱不够！';
							}
							
							cb(true);
						});
					}
					else
					{
						cb(true);
					}
				});
			});
		});
	},
	think : (ctx)=>{
		if(cga.GetPlayerInfo().souls != 0)
		{
			ctx.result = 'logout_forced';
			ctx.reason = '掉魂自动招魂';
		}
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
};