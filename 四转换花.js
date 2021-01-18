var cga = require('./cgaapi')(function(){

	console.log('重要提示：每一层白色方舟地图档都要下载，否则自动寻路会失败！')

	var myname = cga.GetPlayerInfo().name;

	var loop_count = 0;
	
	var flowerTable = [
	{
		'红花' : 622051,
		'黄花' : 622052,
		'绿花' : 622053,
		'蓝花' : 622054,
	},
	{
		'红花' : 622055,
		'黄花' : 622056,
		'绿花' : 622057,
		'蓝花' : 622058,
	},
	{
		'红花' : 622059,
		'黄花' : 622060,
		'绿花' : 622061,
		'蓝花' : 622062,
	},
	{
		'红花' : 622059,
		'黄花' : 622060,
		'绿花' : 622061,
		'蓝花' : 622062,
	}
	]
	var	waitFlower = (layerIndex, myItem, waitForItem, waitForPos, cb)=>{
		
		cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false);
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);
		
		cga.TurnTo(waitForPos[0], waitForPos[1]);

		var isLeft = myItem > waitForItem;
		
		var stuffs = 
		{
			itemFilter : (item)=>{
				if(item.itemid == flowerTable[layerIndex][myItem]){
					return true;
				}
				return false;
			}
		}

		var waitChat = ()=>{
			cga.AsyncWaitChatMsg((err, r)=>{
				if(r && r.unitid != -1)
				{
					var findpos = r.msg.indexOf(': CGA四转脚本等待换花');
					if(findpos > 0)
					{
						var playername = r.msg.substr(0, findpos);
						
						if(myname != playername)
						{
							var playerunit = cga.findPlayerUnit(playername);
							if(playerunit != null && playerunit.xpos == waitForPos[0] && playerunit.ypos ==waitForPos[1])
							{
								cga.positiveTrade(playername, stuffs, undefined, result => {
									if (result && result.success == true){
										cb(true);
									} else {
										waitChat();
									}
								});
								return;
							}
						}
					}
				}
				
				waitChat();
			}, 5000);
		}
		
		var waitTrade = ()=>{
			cga.waitTrade(stuffs, null, (results)=>{
				if(results && results.success == true)
				{
					cb(true);
				}
				else
				{
					cga.SayWords('CGA四转脚本等待换花，['+myItem+']交换'+'['+waitForItem+']', 0, 3, 1);
					waitTrade();
				}
			}, 5000);
		}

		if(isLeft)
			waitChat();
		else
			waitTrade();
	}
	
	var mineArray = [
	{
		type : 1,
		name : '红组',
		desired_flowers : [
		'黄花',
		'绿花',
		'蓝花',
		],
		func_layer0 : (cb)=>{
			cga.walkList([
			[21, 96],
			], ()=>{
				cga.TurnTo(23, 96);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:96, delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer0b : (cb)=>{
			cga.walkList([
			[58, 92],
			], ()=>{
				cga.TurnTo(58, 94);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({x:75, y:93, delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer1 : (cb)=>{
			cga.walkList([
			[89, 75],
			], ()=>{
				waitFlower(0, '红花', '黄花', [89, 73], cb);
			});
		},
		func_layer1b : (cb)=>{
			cga.walkList([
			[163, 77],
			], ()=>{
				cga.TurnTo(165, 77);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[126, 100],
			], ()=>{
				waitFlower(1, '黄花', '绿花', [126, 102], cb);
			});
		},
		func_layer2b : (cb)=>{
			cga.walkList([
			[152, 88],
			], ()=>{
				cga.TurnTo(154, 88);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[122, 92],
			], ()=>{
				waitFlower(2, '绿花', '蓝花', [122, 90], cb);
			});
		},
		func_layer3b : (cb)=>{
			cga.walkList([
			[88, 40],
			], ()=>{
				cga.TurnTo(90, 40);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[100, 94],
			], ()=>{
				cga.SayWords('已到达黑色方舟入口，请组队完成剩余部分！', 0, 3, 1);
				cb(true);
			});
		}
	},
	{
		type : 2,
		name : '蓝组',
		desired_flowers : [
		'绿花',
		'黄花',
		'红花',
		],
		func_layer0 : (cb)=>{
			cga.walkList([
			[21, 108],
			], ()=>{
				cga.TurnTo(23, 108);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:108, delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer0b : (cb)=>{
			cga.walkList([
			[60, 141],
			], ()=>{
				cga.TurnTo(60, 142);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({x:74, y:141, delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer1 : (cb)=>{
			cga.walkList([
			[89, 131],
			], ()=>{
				waitFlower(0, '蓝花', '绿花', [89, 129], cb);
			});
		},
		func_layer1b : (cb)=>{
			cga.walkList([
			[147, 138],
			], ()=>{
				cga.TurnTo(149, 136);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[126, 102],
			], ()=>{
				waitFlower(1, '绿花', '黄花', [126, 100], cb);
			});
		},
		func_layer2b : (cb)=>{
			cga.walkList([
			[152, 108],
			], ()=>{
				cga.TurnTo(154, 108);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[54, 120],
			], ()=>{
				waitFlower(2, '黄花', '红花', [54, 118], cb);
			});
		},
		func_layer3b : (cb)=>{
			cga.walkList([
			[37, 121],
			], ()=>{
				cga.TurnTo(37, 119);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[100, 94],
			], ()=>{
				cga.SayWords('已到达黑色方舟入口，请组队完成剩余部分！', 0, 3, 1);
				cb(true);
			});
		}
	},
	{
		type : 3,
		name : '黄组',
		desired_flowers : [
		'红花',
		'蓝花',
		'绿花',
		'黄花',
		],
		func_layer0 : (cb)=>{
			cga.walkList([
			[21, 92],
			], ()=>{
				cga.TurnTo(23, 92);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:92, delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer0b : (cb)=>{
			cga.walkList([
			[59, 63],
			], ()=>{
				cga.TurnTo(61, 63);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({x:75, y:57, delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer1 : (cb)=>{
			cga.walkList([
			[89, 73],
			], ()=>{
				waitFlower(0, '黄花', '红花', [89, 75], cb);
			});
		},
		func_layer1b : (cb)=>{
			cga.walkList([
			[136, 48],
			], ()=>{
				cga.TurnTo(138, 48);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[70, 102],
			], ()=>{
				waitFlower(1, '红花', '蓝花', [70, 104], cb);
			});
		},
		func_layer2b : (cb)=>{
			cga.walkList([
			[84, 88],
			], ()=>{
				cga.TurnTo(86, 88);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[122, 90],
			], ()=>{
				waitFlower(2, '蓝花', '绿花', [122, 92], cb);
			});
		},
		func_layer3b : (cb)=>{
			cga.walkList([
			[101, 17],
			], ()=>{
				cga.TurnTo(101, 15);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[99, 83],
			], ()=>{
				waitFlower(3, '绿花', '黄花', [101, 83], ()=>{
					cga.SayWords('已换完花，请自行完成剩余部分！', 0, 3, 1);
					cb(true);				
				});
			});
		}
	},
	{
		type : 4,
		name : '绿组',
		desired_flowers : [
		'蓝花',
		'红花',
		'黄花',
		'绿花',
		],
		func_layer0 : (cb)=>{
			cga.walkList([
			[21, 104],
			], ()=>{
				cga.TurnTo(23, 104);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(1, 0);
							cga.AsyncWaitMovement({x:28, y:104, delay:1000, timeout:5000}, cb);
						});
					});
				});
			});
		},
		func_layer0b : (cb)=>{
			cga.walkList([
			[60, 121],
			], ()=>{
				cga.TurnTo(60, 123);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({x:75, y:121, delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer1 : (cb)=>{
			cga.walkList([
			[89, 129],
			], ()=>{
				waitFlower(0, '绿花', '蓝花', [89, 131], cb);
			});
		},
		func_layer1b : (cb)=>{
			cga.walkList([
			[164, 110],
			], ()=>{
				cga.TurnTo(164, 108);
				cga.AsyncWaitNPCDialog(()=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第二层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer2 : (cb)=>{
			cga.walkList([
			[70, 104],
			], ()=>{
				waitFlower(1, '蓝花', '红花', [70, 102], cb);
			});
		},
		func_layer2b : (cb)=>{
			cga.walkList([
			[84, 112],
			], ()=>{
				cga.TurnTo(86, 112);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第三层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer3 : (cb)=>{
			cga.walkList([
			[54, 118],
			], ()=>{
				waitFlower(2, '红花', '黄花', [54, 120], cb);
			});
		},
		func_layer3b : (cb)=>{
			cga.walkList([
			[68, 97],
			], ()=>{
				cga.TurnTo(70, 95);
				cga.AsyncWaitNPCDialog((dlg)=>{
					cga.ClickNPCDialog(1, 0);
					cga.AsyncWaitMovement({map:'白色方舟·第四层', delay:1000, timeout:5000}, cb);
				});
			});
		},
		func_layer4 : (cb)=>{
			cga.walkList([
			[101, 83],
			], ()=>{
				waitFlower(3, '黄花', '绿花', [99, 83], ()=>{
					cga.SayWords('已换完花，请自行完成剩余部分！', 0, 3, 1);
					cb(true);				
				});
			});
		}
	},
	]
	
	var mineObject = null;
	
	var task = cga.task.Task('誓言之花', [
	{//0
		intro: '1.前往光之路调查（165.81）处石碑，选“是”进入白色方舟第一层。',
		workFunc: function(cb2){
	
			var dropItem = cga.findItem('誓约之花');
			if(dropItem != -1)
			{
				cga.DropItem(dropItem);
				setTimeout(cb2, 1000, 'restart stage');
				return;
			}
	
			if(cga.needSupplyInitial())
			{
				cga.travel.falan.toCastleHospital(()=>{
					setTimeout(cb2, 3000, 'restart stage');
				});
				return;
			}
			
			cga.travel.newisland.toLiXiaIsland(()=>{
				cga.walkList([
				[90, 99, '国民会馆'],
				[108, 39, '雪拉威森塔１层'],
				[35, 96],
				], ()=>{
					cga.TurnTo(35, 94);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(4, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(1, 0);
									cga.AsyncWaitMovement({map:'辛梅尔', delay:1000, timeout:5000}, ()=>{
										cga.walkList([
										[207, 91, '光之路'],
										[165, 82]
										], ()=>{
											cga.TurnTo(165, 80);
											cga.AsyncWaitNPCDialog(()=>{
												cga.ClickNPCDialog(4, 0);
												cga.AsyncWaitMovement({map:'白色方舟·第一层', delay:1000, timeout:5000}, cb2);
											});
										});
									});
								});
							});
						});
					});
				});
			});
		}
	},
	{//1
		intro: '2.根据职业与对应守卫对话，获得对应的【誓言之花】并进入白色方舟迷宫。',
		workFunc: function(cb2){
			mineObject.func_layer0(cb2);
		}
	},
	{//2
		intro: '3.地图切到换花部分',
		workFunc: function(cb2){
			mineObject.func_layer0b(cb2);
		}
	},
	{//3
		intro: '4.白色方舟·第一层换花。',
		workFunc: function(cb2){
			mineObject.func_layer1(cb2);
		}
	},
	{//4
		intro: '5.白色方舟·第一层换花完成，去第二层。',
		workFunc: function(cb2){
			mineObject.func_layer1b(cb2);
		}
	},
	{//5
		intro: '6.白色方舟·第二层换花',
		workFunc: function(cb2){
			mineObject.func_layer2(cb2);
		}
	},
	{//6
		intro: '7.白色方舟·第二层换花完成，去第三层。',
		workFunc: function(cb2){
			mineObject.func_layer2b(cb2);
		}
	},
	{//7
		intro: '8.白色方舟·第三层换花',
		workFunc: function(cb2){
			mineObject.func_layer3(cb2);
		}
	},
	{//8
		intro: '9.白色方舟·第三层换花完成，去第四层。',
		workFunc: function(cb2){
			mineObject.func_layer3b(cb2);
		}
	},
	{//9
		intro: '10.白色方舟·第四层,战斗系组队，生产系换花。',
		workFunc: function(cb2){
			mineObject.func_layer4(cb2);
		}
	},
	],
	[//任务阶段是否完成
		function(){
			return (cga.GetMapName() == '白色方舟·第一层' && cga.GetMapXY().x < 23) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第一层' && cga.GetMapXY().x >= 23 && cga.GetMapXY().x <= 70) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第一层' && cga.GetMapXY().x > 70 && cga.getItemCount(flowerTable[0][ mineObject.desired_flowers[0] ]) == 0) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第一层' && cga.getItemCount(flowerTable[0][ mineObject.desired_flowers[0] ]) > 0) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第二层' && cga.getItemCount(flowerTable[1][ mineObject.desired_flowers[1] ]) == 0) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第二层' && cga.getItemCount(flowerTable[1][ mineObject.desired_flowers[1] ]) > 0) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第三层' && cga.getItemCount(flowerTable[2][ mineObject.desired_flowers[2] ]) == 0) ? true : false;
		},
		function(){
			return (cga.GetMapName() == '白色方舟·第三层' && cga.getItemCount(flowerTable[2][ mineObject.desired_flowers[2] ]) > 0) ? true : false;
		},
		function(){
			if (cga.GetMapName() == '白色方舟·第四层'){
				if(mineObject.desired_flowers[3] != undefined)
					return cga.getItemCount(flowerTable[2][ mineObject.desired_flowers[3] ]) > 0;
			}
			
			return false;
		},
	]
	);

	cga.SayWords('欢迎使用CGA通用四转脚本换花，红组输入‘1’，蓝组输入‘2’，黄组输入‘3’，绿组输入‘4’。', 0, 3, 1);
	
	cga.waitTeammateSay((player, msg)=>{

		if(player.is_me == true){
			
			for(var i in mineArray){
				if(mineArray[i].type == parseInt(msg)){
					mineObject = mineArray[i];
					break;
				}
			}
			
			if(mineObject != null){
				cga.SayWords('您选择了'+mineObject.name+'。', 0, 3, 1);
				task.doTask(()=>{
					
				});
				return false;
			}
		}

		return true;
	});
});