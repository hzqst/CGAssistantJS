require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	var teamLeader = '此处填写队长名称';
	var teamPlayerCount = 5;

	var doctorName = '医道之殇';
    var crystalName = '水火的水晶（5：5）';
	var playerinfo = cga.GetPlayerInfo();
	var playerName = playerinfo.name;
	var isTeamLeader = false;
    if (playerName == teamLeader) {
        isTeamLeader = true;
    }
    var teamplayers = cga.getTeamPlayers();
    if(isTeamLeader){
    	if(teamplayers.length!=teamPlayerCount){
    		await leo.waitAfterBattle()
    		await leo.logBack()
    		await leo.checkHealth(doctorName)
        	await leo.checkCrystal(crystalName)
        	await leo.goto(n=>n.elsa.x)
        	await leo.autoWalk([150, 94])
        	await leo.buildTeamBlock(teamPlayerCount)
    	}
    }else{
    	if(!leo.isInTeam()){
    		await leo.waitAfterBattle()
    		await leo.logBack()
    		await leo.checkHealth(doctorName)
        	await leo.checkCrystal(crystalName)
        	await leo.goto(n=>n.elsa.x)
        	await leo.autoWalk([150, 95])
        	await leo.enterTeamBlock(teamLeader)
    	}
    }
    //await leo.panel.load('通用任务配置.json');

	var teammates = [];
	var teamplayers = cga.getTeamPlayers();

	for(var i in teamplayers)
		teammates[i] = teamplayers[i].name;
	
	cga.isTeamLeader = (teammates[0] == playerinfo.name || teammates.length == 0) ? true : false;

	var task = cga.task.Task('诅咒的迷宫 (战斗系三转)', [
	{//0
		intro: '1.前往阿巴尼斯村民家（40.30）与历史学家雷伯尔森（14.10）对话，选“是”获得【野草莓】。',
		workFunc: function(cb2){
			
			var go_1 = ()=>{
				cga.cleanInventory(1, ()=>{
					cga.turnTo(14, 10);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog(()=>{
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(4, 0);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(32, 0);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(1, 0);
											setTimeout(()=>{ 
												cga.SayWords('拿野草莓，然后传送至民家地下，与帕鲁凯斯对话获得“刀刃的碎片”。然后返回民家与队长重新组队！', 0, 3, 1);
												setTimeout(cb2, 1500, true);
											}, 1500);
										});
									});
								});
							});
						});
					});
				});
			}
						
			var go = ()=>{
				cga.walkList([
				[5, 4, 4313],
				[6, 13, 4312],
				[6, 13, '阿巴尼斯村'],
				[40, 30, '民家'],
				[13, 10],
				[13, 11],
				[13, 10],
				[13, 11],
				[13, 10],
				], ()=>{
					setTimeout(()=>{
						cga.DoRequest(cga.REQUEST_TYPE_LEAVETEAM);
						setTimeout(go_1, 1500);
					}, 1500);
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.cleanInventory(1, ()=>{
						cga.turnTo(14, 10);
						cga.AsyncWaitNPCDialog((err)=>{
							if(err){
								cga.walkList([ [13, 11], [13, 10] ], retry);
								return;
							}
							cga.ClickNPCDialog(32, 0);
							cga.AsyncWaitNPCDialog(()=>{
								cga.ClickNPCDialog(32, 0);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(32, 0);
									cga.AsyncWaitNPCDialog(()=>{
										cga.ClickNPCDialog(4, 0);
										cga.AsyncWaitNPCDialog(()=>{
											cga.ClickNPCDialog(32, 0);
											cga.AsyncWaitNPCDialog(()=>{
												cga.ClickNPCDialog(1, 0);
												setTimeout(cb2, 1500, true);
											});
										});
									});
								});
							});
						});
					});
				}
				
				cga.waitForLocation({mapname : '民家', pos : [14, 10], leaveteam : true, walkto : [13, 10]}, retry);
			}
			
			var wait3 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						go2();
						return;
					}
					setTimeout(wait3, 1000);
				});
			}

			var wait = ()=>{
				cga.WalkTo(5, 13);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						go();
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			var wait2 = ()=>{
				var retry = ()=>{
					cga.turnTo(38, 4);
					cga.AsyncWaitNPCDialog((err)=>{
						if(err){
							cga.walkList([ [37, 5], [37, 4] ], retry);
							return;
						}
						cga.ClickNPCDialog(4, -1);
						setTimeout(wait3, 1500);
					});
				}
				
				cga.waitForLocation({mapname : '启程之间', pos : [38, 4], leaveteam : true, walkto : [37, 4]}, retry);
			}
			
			if(cga.isTeamLeader){
				cga.travel.falan.toTeleRoom('阿巴尼斯村', ()=>{
					wait();
				});
			} else {
				wait2();
			}
		}
	},
	{//1
		intro: '2.与米希安（9.4）对话，交出【野草莓】并传送至民家地下。3.调查连接时空的石盘（15.7），选“是”传送至民家地下。4.与战士帕鲁凯斯（15.7）对话，获得【刀刃碎片】。5.通过（5.3）处楼梯至民家，与历史学家雷伯雷翁（14.10）对话。通过（9.4）处楼梯返回民家地下。6.调查连接时空的石盘（15.10），选“是”传送至民家地下。',
		workFunc: function(cb2){
			
			if(cga.getItemCount('野草莓') == 0){
				throw new Error('执行出错，没有拿到野草莓，可能是因为没有开启者称号！')
			}
			
			var wait = ()=>{
				cga.WalkTo(9, 5);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			var wait3 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait3, 1000);
				});
			}
			
			var go = ()=>{
				cga.walkList([
				[9, 5],				
				], ()=>{
					cga.turnTo(9, 4);
					cga.AsyncWaitNPCDialog(()=>{
						cga.ClickNPCDialog(1, 0);
						cga.AsyncWaitMovement({map:4331, delay:1000, timeout:5000}, ()=>{
							cga.walkList([
							[14, 7],
							], ()=>{
								cga.turnTo(15, 7);
								cga.AsyncWaitNPCDialog(()=>{
									cga.ClickNPCDialog(4, 0);
									cga.AsyncWaitMovement({map:4332, delay:1000, timeout:5000}, ()=>{
										cga.walkList([
										[14, 7],
										], ()=>{
											cga.turnTo(15, 7);
											cga.AsyncWaitNPCDialog(()=>{
												cga.ClickNPCDialog(1, 0);
												setTimeout(()=>{
													cga.walkList([
													[5, 3, 4333],
													[9, 4, 4334],
													[14, 10],
													], ()=>{
														cga.turnTo(15, 10);
														cga.AsyncWaitNPCDialog(()=>{
															cga.ClickNPCDialog(4, 0);
															cga.AsyncWaitMovement({map:4335, delay:1000, timeout:5000}, ()=>{
																cga.walkList([
																[7, 3, 4320],
																], ()=>{
																	setTimeout(cga.isTeamLeader ? wait : wait3, 1000);
																});
															});
														});
													});
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

			go();
		}
	},
	{//2
		intro: '7.出阿巴尼斯村，前往莎莲娜岛（54.161）处，持有【刀刃的碎片】调查鼓动的石盘，交出【刀刃的碎片】传送至诅咒的迷宫。通过（35.9）处楼梯进入诅咒的迷宫。',
		workFunc: function(cb2){
			var wait = ()=>{
				cga.WalkTo(8, 8);
				cga.waitTeammates(teammates, (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait, 1000);
				});
			}
			
			var wait3 = ()=>{
				cga.addTeammate(teammates[0], (r)=>{
					if(r){
						cb2(true);
						return;
					}
					setTimeout(wait3, 1000);
				});
			}
			
			var go = ()=>{
				cga.walkList([
				[12, 17, '阿巴尼斯村'],
				[37, 71, '莎莲娜'],
				[54, 162],
				], ()=>{
					cga.walkTeammateToPosition([
					[54, 162],
					[55, 162],
					], ()=>{
						cga.turnTo(54, 161);
						cga.AsyncWaitMovement({map:'诅咒的迷宫', delay:1000, timeout:5000}, ()=>{
							setTimeout(wait, 1000);
						});
					});
				});
			}
			
			var go2 = ()=>{
				var retry = ()=>{
					cga.turnTo(54, 161);
					cga.AsyncWaitMovement({map:'诅咒的迷宫', delay:1000, timeout:5000}, (err)=>{
						if(err){
							cga.walkList([ [54, 162], [55, 162] ], retry);
							return;
						}
						
						setTimeout(wait3, 1000);
					});
				}
				
				cga.waitForLocation({mapname : '莎莲娜', pos : [54, 161], walkto : [54, 162], leaveteam : true}, retry);
			}
			
			
			if(cga.isTeamLeader){
				go();
			} else {
				go2();
			}
		}
	},
	{//3
		intro: '9.抵达第一个难关，与纳帕（22.14）对话进入战斗。',
		workFunc: function(cb2){
			var checkSkill = (cb3)=>{
				var skills = cga.GetSkillsInfo();
				var pass = false;
				skills.filter((sk)=>{
					if(sk.name == '精灵的盟约' || sk.name == '调教' || sk.name == '宠物强化'){
						if(sk.lv >= 8){
							pass = true;
						}
					}
					return true;
				});
				return pass;
			}
			
			var nextMap = [
			{
				moving : true,
				mapindex: 24069, 
				cb : ()=>{
					cb2(true);
					return true;
				}
			},
			{
				moving : true,
				mapname: '诅咒的迷宫 地下11楼', 
				cb : ()=>{
					cb2(true);
					return true;
				}
			}
			];
			
			var fuckBOSS = ()=>{
				cga.turnTo(22, 14);
				cga.AsyncWaitNPCDialog((err)=>{
					if(cga.isInBattle()){
						return;
					}
					if(err){
						return;
					}
					cga.ClickNPCDialog(1, 0);
				});
				cga.waitForMultipleLocation(nextMap);
			}
			
			var wait15 = (counter)=>{

				if(cga.GetMapName() != '第一个难关')
				{
					cga.waitForMultipleLocation(nextMap);
					return;
				}

				if(counter == 0){
					fuckBOSS();
					return;
				} else if(counter == 5){
					cga.SayWords("倒计时5秒！", 0, 3, 1);
				} else if(counter == 10){
					cga.SayWords("倒计时10秒！", 0, 3, 1);
				}
				
				setTimeout(wait15, 1000, counter-1);
			}
			
			var go = ()=>{
				
				var list = [
				[22, 15],
				[21, 15],
				[22, 15],
				[21, 15],
				[22, 15],
				];
				
				if (cga.GetMapName() == '诅咒的迷宫')
				{
					list.unshift(
					[35, 9, '诅咒的迷宫 地下1楼'],
					[25, 13, '诅咒的迷宫 地下2楼'],
					[17, 4, '诅咒的迷宫 地下3楼'],
					[23, 20, '诅咒的迷宫 地下4楼'],
					[16, 10, '诅咒的迷宫 地下5楼'],
					[6, 3, '诅咒的迷宫 地下6楼'],
					[15, 3, '诅咒的迷宫 地下7楼'],
					[25, 18, '诅咒的迷宫 地下8楼'],
					[14, 18, '诅咒的迷宫 地下9楼'],
					[24, 4, '第一个难关']
					);
				}

				cga.walkList(list, ()=>{
					if(checkSkill()){
						fuckBOSS();
					} else {
						cga.SayWords("拥有Lv.8+精灵的盟约、调教或宠物强化的队员与BOSS对话可直接通过，如果15秒内没有队员对话则直接开始战斗！", 0, 3, 1);

						setTimeout(wait15, 1000, 15);
					}
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForMultipleLocation(nextMap.concat({
					mapindex: 24018, 
					pos:[22, 14], 
					cb : ()=>{
						if(checkSkill()){
							fuckBOSS();
							return true;
						}
						
						return false;
					}
				}));
			}
		}
	},
	{//4
		intro: '11.抵达第二个难关，与德尔麦（26.17）对话进入战斗。',
		workFunc: function(cb2){
			var checkSkill = (cb3)=>{
				var skills = cga.GetSkillsInfo();
				var pass = false;
				skills.filter((sk)=>{
					if(sk.name == '吸血魔法'
					|| sk.name.indexOf('陨石魔法') >= 0 
					|| sk.name.indexOf('冰冻魔法') >= 0
					|| sk.name.indexOf('火焰魔法') >= 0
					|| sk.name.indexOf('风刃魔法') >= 0){
						if(sk.lv >= 8){
							pass = true;
						}
					}
					return true;
				});
				return pass;
			}
			
			var nextMap = [
			{
				moving : true,
				mapindex: 24070, 
				cb : ()=>{
					cb2(true);
					return true;
				}
			},
			{
				moving : true,
				mapname: '诅咒的迷宫 地下21楼', 
				cb : ()=>{
					cb2(true);
					return true;
				}
			}
			];
			
			var fuckBOSS = ()=>{
				cga.turnTo(26, 17);
				cga.AsyncWaitNPCDialog((err)=>{
					if(cga.isInBattle()){
						return;
					}
					if(err){
						return;
					}
					cga.ClickNPCDialog(1, 0);
				});
				cga.waitForMultipleLocation(nextMap);
			}
			
			var wait15 = (counter)=>{

				if(cga.GetMapName() != '第二个难关')
				{
					cga.waitForMultipleLocation(nextMap);
					return;
				}

				if(counter == 0){
					fuckBOSS();
					return;
				} else if(counter == 5){
					cga.SayWords("倒计时5秒！", 0, 3, 1);
				} else if(counter == 10){
					cga.SayWords("倒计时10秒！", 0, 3, 1);
				}
				
				setTimeout(wait15, 1000, counter-1);
			}
			
			var go = ()=>{
				var list = [
				[25, 17],
				[25, 18],
				[25, 17],
				[25, 18],
				[25, 17],
				];
				
				var index = cga.GetMapIndex().index3;
				var name = cga.GetMapName();
				
				if (name == '诅咒的迷宫 地下11楼' || index == 24069)
				{
					list.unshift(
					[15, 4, '诅咒的迷宫 地下12楼'],
					[24, 15, '诅咒的迷宫 地下13楼'],
					[16, 3, '诅咒的迷宫 地下14楼'],
					[25, 12, '诅咒的迷宫 地下15楼'],
					[22, 5, '诅咒的迷宫 地下16楼'],
					[17, 18, '诅咒的迷宫 地下15楼'],
					[25, 21, '诅咒的迷宫 地下16楼'],
					[22, 18, '诅咒的迷宫 地下17楼'],
					[23, 4, '诅咒的迷宫 地下18楼'],
					[7, 12, '诅咒的迷宫 地下19楼'],
					[18, 18, '第二个难关']
					);
				}
				
				if (index == 24069)
					list.unshift([31, 30, '诅咒的迷宫 地下11楼']);

				cga.walkList(list, ()=>{
					if(checkSkill()){
						fuckBOSS();
					} else {
						cga.SayWords("拥有任意Lv.8四属性攻击魔法（单体/强力/超强）、吸血魔法与BOSS对话可直接通过，如果15秒内没有队员对话则直接开始战斗！", 0, 3, 1);
						setTimeout(wait15, 1000, 15);
					}
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForMultipleLocation(nextMap.concat({
					mapindex: 24028, 
					pos:[26, 17], 
					cb : ()=>{
						if(checkSkill()){
							fuckBOSS();
							return true;
						}
						
						return false;
					}
				}));
			}
		}
	},
	{//5
		intro: '13.抵达第三个难关，与瑟贝塔（20.21）对话进入战斗。',
		workFunc: function(cb2){
			var checkSkill = (cb3)=>{
				var skills = cga.GetSkillsInfo();
				var pass = false;
				skills.filter((sk)=>{
					if(sk.name == '乾坤一掷'
					|| sk.name == '连击' 
					|| sk.name == '诸刃'
					|| sk.name == '阳炎'
					|| sk.name == '乱射'
					|| sk.name == '暗杀'
					|| sk.name == '反击'
					|| sk.name == '护卫'
					|| sk.name == '气功弹'
					|| sk.name == '战栗袭心'
					|| sk.name == '明镜止水'
					|| sk.name == '混乱攻击'
					|| sk.name == '圣盾'){
						if(sk.lv >= 8){
							pass = true;
						}
					}
					return true;
				});
				return pass;
			}
			
			var nextMap = [
			{
				moving : true,
				mapindex: 24071, 
				cb : ()=>{
					cb2(true);
					return true;
				}
			},
			{
				moving : true,
				mapname: '诅咒的迷宫 地下31楼', 
				cb : ()=>{
					cb2(true);
					return true;
				}
			}
			];
			
			var fuckBOSS = ()=>{
				cga.turnTo(20, 21);
				cga.AsyncWaitNPCDialog((err)=>{
					if(cga.isInBattle()){
						return;
					}
					if(err){
						return;
					}
					cga.ClickNPCDialog(1, 0);
				});
				cga.waitForMultipleLocation(nextMap);
			}
			
			var wait15 = (counter)=>{

				if(cga.GetMapName() != '第三个难关')
				{
					cga.waitForMultipleLocation(nextMap);
					return;
				}

				if(counter == 0){
					fuckBOSS();
					return;
				} else if(counter == 5){
					cga.SayWords("倒计时5秒！", 0, 3, 1);
				} else if(counter == 10){
					cga.SayWords("倒计时10秒！", 0, 3, 1);
				}
				
				setTimeout(wait15, 1000, counter-1);
			}

			var go = ()=>{
				var list = [
				[20, 20],
				[19, 20],
				[20, 20],
				[19, 20],
				[20, 20],
				];
				
				var name = cga.GetMapName();
				var index = cga.GetMapIndex().index3;
				var name = cga.GetMapName();
				
				if (name == '诅咒的迷宫 地下21楼' || index == 24070)
				{
					list.unshift(
					[20, 3, '诅咒的迷宫 地下22楼'],
					[7, 4, '诅咒的迷宫 地下23楼'],
					[14, 12, '诅咒的迷宫 地下22楼'],
					[17, 12, '诅咒的迷宫 地下23楼'],
					[27, 2, '诅咒的迷宫 地下24楼'],
					[7, 20, '诅咒的迷宫 地下25楼'],
					[24, 20, '诅咒的迷宫 地下26楼'],
					[17, 5, '诅咒的迷宫 地下27楼'],
					[9, 11, '诅咒的迷宫 地下28楼'],
					[25, 21, '诅咒的迷宫 地下27楼'],
					[23, 16, '诅咒的迷宫 地下28楼'],
					[16, 12, '诅咒的迷宫 地下29楼'],
					[7, 1, '第三个难关']
					);
				}
				
				if (index == 24070)
					list.unshift([30, 5, '诅咒的迷宫 地下21楼']);

				cga.walkList(list, ()=>{
					if(checkSkill()){
						fuckBOSS();
					} else {
						cga.SayWords("拥有Lv.8+乾坤一掷、连击、诸刃、阳炎、乱射、暗杀、反击、护卫、气功弹、战栗袭心、明镜止水、混乱攻击或圣盾与BOSS对话可直接通过，如果15秒内没有队员对话则直接开始战斗！", 0, 3, 1);

						setTimeout(wait15, 1000, 15);
					}
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForMultipleLocation(nextMap.concat({
					mapindex: 24038, 
					pos:[20, 21], 
					cb : ()=>{
						if(checkSkill()){
							fuckBOSS();
							return true;
						}
						
						return false;
					}
				}));
			}
		}
	},
	{//6
		intro: '15.抵达第四个难关，与亚尔法（15.18）对话进入战斗。',
		workFunc: function(cb2){
			var checkSkill = (cb3)=>{
				var skills = cga.GetSkillsInfo();
				var pass = false;
				skills.filter((sk)=>{
					if(sk.name == '气绝回复'
					|| sk.name == '洁净魔法' 
					|| sk.name.indexOf('补血魔法') >= 0
					|| sk.name.indexOf('恢复魔法') >= 0
					){
						if(sk.lv >= 8){
							pass = true;
						}
					}
					return true;
				});
				return pass;
			}

			var nextMap = [
			{
				moving : true,
				mapindex: 24072, 
				cb : ()=>{
					cb2(true);
					return true;
				}
			},
			{
				moving : true,
				mapname: '诅咒的迷宫 地下41楼', 
				cb : ()=>{
					cb2(true);
					return true;
				}
			}
			];
			
			var fuckBOSS = ()=>{
				cga.turnTo(15, 18);
				cga.AsyncWaitNPCDialog((err)=>{
					if(cga.isInBattle()){
						return;
					}
					if(err){
						return;
					}
					cga.ClickNPCDialog(1, 0);
				});
				cga.waitForMultipleLocation(nextMap);
			}
			
			var wait15 = (counter)=>{

				if(cga.GetMapName() != '第四个难关')
				{
					cga.waitForMultipleLocation(nextMap);
					return;
				}

				if(counter == 0){
					fuckBOSS();
					return;
				} else if(counter == 5){
					cga.SayWords("倒计时5秒！", 0, 3, 1);
				} else if(counter == 10){
					cga.SayWords("倒计时10秒！", 0, 3, 1);
				}
				
				setTimeout(wait15, 1000, counter-1);
			}
			
			var go = ()=>{
				var list = [
				[16, 18],
				[16, 17],
				[16, 18],
				[16, 17],
				[16, 18],
				];
				
				var name = cga.GetMapName();
				var index = cga.GetMapIndex().index3;
				var name = cga.GetMapName();
				
				if (name == '诅咒的迷宫 地下31楼' || index == 24071)
				{
					list.unshift(
					[24, 13, '诅咒的迷宫 地下32楼'],
					[15, 12, '诅咒的迷宫 地下33楼'],
					[24, 12, '诅咒的迷宫 地下34楼'],
					[23, 4, '诅咒的迷宫 地下33楼'],
					[6, 13, '诅咒的迷宫 地下34楼'],
					[9, 21, '诅咒的迷宫 地下35楼'],
					[6, 13, '诅咒的迷宫 地下36楼'],
					[9, 21, '诅咒的迷宫 地下37楼'],
					[24, 21, '诅咒的迷宫 地下38楼'],
					[8, 21, '诅咒的迷宫 地下39楼'],
					[23, 25, '第四个难关']
					);
				}
				
				if (index == 24071)
					list.unshift([20, 28, '诅咒的迷宫 地下31楼']);

				cga.walkList(list, ()=>{
					if(checkSkill()){
						fuckBOSS();
					} else {
						cga.SayWords("拥有Lv.8气绝回复、洁净魔法、补血类魔法（单体/强力/超强）或恢复类魔法（单体/强力/超强）与BOSS对话可直接通过，如果15秒内没有队员对话则直接开始战斗！", 0, 3, 1);

						setTimeout(wait15, 1000, 15);
					}
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForMultipleLocation(nextMap.concat({
					mapindex: 24048, 
					pos:[15, 18], 
					cb : ()=>{
						if(checkSkill()){
							fuckBOSS();
							return true;
						}
						
						return false;
					}
				}));
			}
		}
	},
	{//7
		intro: '17.抵达第五个难关，与马帝亚（22.14）对话进入战斗。',
		workFunc: function(cb2){
			var checkSkill = (cb3)=>{
				var skills = cga.GetSkillsInfo();
				var pass = false;
				skills.filter((sk)=>{
					if(
					sk.name.indexOf('抗') == 0
					|| sk.name.indexOf('石化魔法') >= 0
					|| sk.name.indexOf('混乱魔法') >= 0
					|| sk.name.indexOf('昏睡魔法') >= 0
					|| sk.name.indexOf('酒醉魔法') >= 0
					|| sk.name.indexOf('遗忘魔法') >= 0
					|| sk.name.indexOf('中毒魔法') >= 0
					|| sk.name.indexOf('反弹') >= 0
					|| sk.name.indexOf('吸收') >= 0
					|| sk.name.indexOf('无效') >= 0
					){
						if(sk.lv >= 8){
							pass = true;
						}
					}
					return true;
				});
				return pass;
			}

			var nextMap = [
			{
				moving : true,
				mapindex: 24073, 
				cb : ()=>{
					cb2(true);
					return true;
				}
			},
			{
				moving : true,
				mapname: '诅咒的迷宫 地下51楼', 
				cb : ()=>{
					cb2(true);
					return true;
				}				
			}
			];
			
			var fuckBOSS = ()=>{
				cga.turnTo(22, 14);
				cga.AsyncWaitNPCDialog((err)=>{
					if(cga.isInBattle()){
						return;
					}
					if(err){
						return;
					}
					cga.ClickNPCDialog(1, 0);
				});
				cga.waitForMultipleLocation(nextMap);
			}
			
			var wait15 = (counter)=>{

				if(cga.GetMapName() != '第五个难关')
				{
					cga.waitForMultipleLocation(nextMap);
					return;
				}

				if(counter == 0){
					fuckBOSS();
					return;
				} else if(counter == 5){
					cga.SayWords("倒计时5秒！", 0, 3, 1);
				} else if(counter == 10){
					cga.SayWords("倒计时10秒！", 0, 3, 1);
				}
				
				setTimeout(wait15, 1000, counter-1);
			}
			
			var go = ()=>{
				var list = [
				[22, 15],
				[21, 15],
				[22, 15],
				[21, 15],
				[22, 15],
				];
				
				var name = cga.GetMapName();
				var index = cga.GetMapIndex().index3;
				var name = cga.GetMapName();
				
				if (name == '诅咒的迷宫 地下41楼' || index == 24072)
				{
					list.unshift(
					[8, 18, '诅咒的迷宫 地下42楼'],
					[24, 21, '诅咒的迷宫 地下43楼'],
					[23, 4, '诅咒的迷宫 地下44楼'],
					[24, 21, '诅咒的迷宫 地下45楼'],
					[26, 9, '诅咒的迷宫 地下46楼'],
					[9, 2, '诅咒的迷宫 地下47楼'],
					[22, 3, '诅咒的迷宫 地下48楼'],
					[17, 12, '诅咒的迷宫 地下49楼'],
					[9, 2, '第五个难关']
					);
				}
				
				if (index == 24072)
					list.unshift([29, 26, '诅咒的迷宫 地下41楼']);

				cga.walkList(list, ()=>{
					if(checkSkill()){
						fuckBOSS();
					} else {
						cga.SayWords("拥有Lv.8各种状态魔法（单体/强力/超强）、各种状态抵抗或各种制御魔法时与BOSS对话可直接通过，如果15秒内没有队员对话则直接开始战斗！", 0, 3, 1);

						setTimeout(wait15, 1000, 15);
					}
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForMultipleLocation(nextMap.concat({
					mapindex: 24058, 
					pos:[22, 14], 
					cb : ()=>{
						if(checkSkill()){
							fuckBOSS();
							return true;
						}
						
						return false;
					}
				}));
			}
		}
	},
	{//7
		intro: '19.抵达第六个难关，调查封印石（24.19）进入战斗。',
		workFunc: function(cb2){

			var nextMap = [
			{
				moving : true,
				mapindex: 24074, 
				cb : ()=>{
					cb2(true);
					return true;
				}
			},
			];
			
			var fuckBOSS = ()=>{
				cga.turnTo(24, 19);
				cga.AsyncWaitNPCDialog((err)=>{
					if(cga.isInBattle()){
						return;
					}
					if(err){
						return;
					}
					cga.ClickNPCDialog(1, 0);
				});
				cga.waitForMultipleLocation(nextMap);
			}
			
			var go = ()=>{
				var list = [
				[23, 18],
				];
				
				var name = cga.GetMapName();
				var index = cga.GetMapIndex().index3;
				var name = cga.GetMapName();
				
				if (name == '诅咒的迷宫 地下51楼' || index == 24073)
				{
					list.unshift(
					[25, 23, '诅咒的迷宫 地下52楼'],
					[23, 4, '诅咒的迷宫 地下53楼'],
					[25, 23, '诅咒的迷宫 地下54楼'],
					[23, 4, '诅咒的迷宫 地下55楼'],
					[19, 17, '诅咒的迷宫 地下54楼'],
					[13, 14, '诅咒的迷宫 地下53楼'],
					[15, 5, '诅咒的迷宫 地下54楼'],
					[15, 11, '诅咒的迷宫 地下55楼'],
					[15, 8, '诅咒的迷宫 地下56楼'],
					[25, 12, '诅咒的迷宫 地下57楼'],
					[23, 3, '诅咒的迷宫 地下58楼'],
					[18, 25, '诅咒的迷宫 地下57楼'],
					[13, 15, '诅咒的迷宫 地下58楼'],
					[20, 15, '诅咒的迷宫 地下59楼'],
					[8, 13, '第六个难关']
					);
				}
				
				if (index == 24073)
					list.unshift([24, 4, '诅咒的迷宫 地下51楼']);

				cga.walkList(list, ()=>{
					fuckBOSS();
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForMultipleLocation(nextMap);
			}
		}
	},
	{//8
		intro: '20.战斗胜利后与神官贝米乌斯（21.12）对话，获得晋阶资格并传送至莎莲娜岛，任务完结。',
		workFunc: function(cb2){

			var fuckBOSS = ()=>{
				cga.turnTo(21, 12);
				cga.AsyncWaitNPCDialog((err)=>{
					if(err){
						fuckBOSS();
						return;
					}
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog((dlg)=>{
						cga.ClickNPCDialog(32, 0);
						cga.AsyncWaitNPCDialog((dlg)=>{
							cga.ClickNPCDialog(1, 0);
							cga.waitForLocation({
								mapname: '莎莲娜'
							}, ()=>{
								cb2(true);
							});
						});
					});
				});
			}
			
			var go = ()=>{
				cga.walkList([
				[21, 13],
				[22, 13],
				[21, 13],
				[22, 13],
				[21, 13],
				], ()=>{
					fuckBOSS();
				});
			}
			
			if(cga.isTeamLeader){
				go();
			} else {
				cga.waitForLocation({
					mapindex: 24074, 
					pos:[21, 12]
				}, fuckBOSS);
			}
		}
	},
	],
	[//任务阶段是否完成
		function(){
			return (cga.getItemCount('野草莓') >= 1) ? true : false;
		},
		function(){
			return (cga.getItemCount('刀刃的碎片') >= 1) ? true : false;
		},
		function(){//进入诅咒的迷宫并组队
			return (cga.GetMapName() == '诅咒的迷宫' || cga.GetMapIndex().index3 == 24018) ? true : false;
		},
		function(){//第一个王
			var index = cga.GetMapIndex().index3;
			return (cga.GetMapName() == '诅咒的迷宫 地下11楼' || index == 24069 || index == 24028) ? true : false;
		},
		function(){//第二个王
			var index = cga.GetMapIndex().index3;
			return (cga.GetMapName() == '诅咒的迷宫 地下21楼' || index == 24070 || index == 24038) ? true : false;
		},
		function(){//第三个王
			var index = cga.GetMapIndex().index3;
			return (cga.GetMapName() == '诅咒的迷宫 地下31楼' || index == 24071 || index == 24048) ? true : false;
		},
		function(){//第四个王
			var index = cga.GetMapIndex().index3;
			return (cga.GetMapName() == '诅咒的迷宫 地下41楼' || index == 24072 || index == 24058) ? true : false;
		},
		function(){//第五个王
			var index = cga.GetMapIndex().index3;
			return (cga.GetMapName() == '诅咒的迷宫 地下51楼' || index == 24073 || index == 24068) ? true : false;
		},
		function(){//双王 ok
			var index = cga.GetMapIndex().index3;
			return (index == 24074 || index == 24078) ? true : false;
		},
		function(){
			return false;
		},
	]
	);
	
	task.doTask();
});