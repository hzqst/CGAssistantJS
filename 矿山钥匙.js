var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	var task = cga.task.Task('矿山钥匙', [
	{
		intro: '1.到法兰城里谢里雅堡(47.85)进入召唤之间，从召唤之间右上角进入回廊。由回廊(23.19)进入灵堂，再从灵堂(7.52)的楼梯进入地下牢房。在地下牢房的(31.20)跟 乔尔凯夫 交谈取得"给朋友的信"',
		workFunc: function(cb2){
			cga.travel.falan.toStone('C', ()=>{
				cga.walkList([
					[47, 85, '召唤之间'],
					[27, 8, '回廊'],
					[23, 23],
					[23, 19, '灵堂', null, null, true],
					[7, 52, '地下牢房'],
					[31, 20],
				], ()=>{
					cga.TurnTo(33, 20);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(4, -1);
							setTimeout(()=>{
								cb2(true);
							}, 1000);
						});
					});
				});
			});
		}
	},
	{
		intro: '2.到法兰城(61.63)进入仓库，把信交给 德米多夫 换取[矿山钥匙]',
		workFunc: function(cb2){
			cga.travel.falan.toStone('W1', ()=>{
				cga.walkList([
					[61, 63, '仓库内部'],
					[11, 10, null],
				], ()=>{
					cga.TurnTo(12, 9);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, -1);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(1, -1);
								setTimeout(()=>{
									cb2(true);
								}, 1000);
							});
						});
					});
				});
			});
		}
	}
	],
	[//任务阶段是否完成
		function(){//gei peng you de xin
			return (cga.getItemCount('#18422') > 0) ? true : false;
		},
		function(){//矿山钥匙
			return (cga.getItemCount('矿山钥匙') > 0) ? true : false;
		},
	]		
	);
	
	task.doTask();
});