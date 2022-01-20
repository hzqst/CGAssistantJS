var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	console.log('咬花 起始地点：艾尔莎岛')
	
	var loop_count = 0;
	
	var playerinfo = cga.GetPlayerInfo();
	
	var task = cga.task.Task('咬花', [
	{//0
		intro: '1.持有【咬花】时前往艾夏岛与神秘催眠师（107.121）对话，传送至回忆之间。',
		workFunc: function(cb2){
			cga.travel.newisland.toStone('B', ()=>{
				cga.walkList([
				[106, 121],
				], ()=>{
					cga.TurnTo(108, 121);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							setTimeout(cb2, 1500, true);
						});
					});
				});
			});
		}
	},
	{//1
		intro: '2.调查回忆之石（8.7）进入战斗。',
		workFunc: function(cb2){
			
			var loop = ()=>{
				
				cga.AsyncWaitNPCDialog((dlg)=>{
					
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(1, 0);
						setTimeout(battleAgain, 5000);
					});
					cga.ClickNPCDialog(4, 0);
				});
				cga.TurnTo(8, 6);
			}
			
			var battleAgain = ()=>{

				if(cga.isInBattle()){
					setTimeout(battleAgain, 1000);
					return;
				}
				
				loop_count ++;
				cga.SayWords('已刷' + loop_count + '遍！', 0, 3, 1);
				
				if(cga.GetMapIndex().index3 == 44641)
					cb2(true);
				else
					loop();
			};

			cga.walkList([
			[8, 8],
			], loop);
		}
	}
	],
	[//任务阶段是否完成
		function(){//证明信
			return (cga.GetMapIndex().index3 == 44642) ? true : false;
		},
		function(){
			return false;
		},
	]
	);
	
	task.doTask(()=>{
		
	});
});