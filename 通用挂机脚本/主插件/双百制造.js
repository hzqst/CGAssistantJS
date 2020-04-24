var Async = require('async');
var cga = global.cga;
var configTable = global.configTable;

var craft_count = 0;
var craft_target = null;

var healObject = require('./../公共模块/治疗自己');

const allowMats = ['麻布', '印度轻木', '铜条', '鹿皮', '毛毡', '木棉布'];

const isFabricName = (name)=>{
	return name == '麻布' || name == '木棉布' || name == '毛毡';
}

const teachers = [
{
	skillname : '制鞋',
	path : [
		[7, 3, '村长的家'],
		[2, 9, '圣拉鲁卡村'],
		[32, 70, '装备品店'],
		[14, 4, '1楼小房间'],
		[9, 3, '地下工房'],
		[22, 23],
	],
	pos : [23, 24],	
},
]

const io = require('socket.io')();

io.on('connection', (socket) => { 

	socket.emit('init', {
		craft_player : cga.GetPlayerInfo().name,
		craft_materials : craft_target ? craft_target.materials : [],
	});
	
	socket.on('register', (data) => {
		socket.cga_data = data;
		socket.join('buddy_'+data.job_name);
		console.log(socket.cga_data.player_name +' 已加入双百节点');
	});

	socket.on('done', (data) => {
		socket.cga_data.count = data.count;
		socket.cga_data.state = 'done'; 
	});
	
	socket.on('gathering', () => {
		socket.cga_data.state = 'gathering'; 
	});
	
	socket.on('disconnect', (err) => {
		if(socket.cga_data)
			console.log(socket.cga_data.player_name +' 已退出双百节点');
	})
});

var waitStuffs = (name, materials, cb)=>{

	console.log('正在等待材料 ' + name);

	var repeat = ()=>{
		
		//修复：防止面向方向不正确导致无法交易
		if(cga.GetPlayerInfo().direction != 4){
			cga.turnTo(32, 88);
			setTimeout(repeat, 500);
			return;
		}
		
		var s = io.in('buddy_'+name).sockets;
		var find_player = null;
		for(var key in s){
			if(s[key].cga_data &&
			((s[key].cga_data.job_name == name) || (s[key].cga_data.job_name == '买布' && isFabricName(name))) &&
			s[key].cga_data.state == 'done' ){
				find_player = s[key];
				break;
			}
		}
		
		if(find_player){
			
			find_player.cga_data.state = 'trade';
			find_player.emit('init', {
				craft_player : cga.GetPlayerInfo().name,
				craft_materials : materials,
			});
			
			find_player.emit('trade');

			var unit = cga.findPlayerUnit(find_player.cga_data.player_name);

			if(unit == null || unit.xpos != 33 || unit.ypos != 88){
				setTimeout(repeat, 1000);
				return;
			}

			setTimeout(()=>{
				var stuffs = { gold:0 };
				
				if(find_player.cga_data.job_name == '买布' && Object.keys(find_player.cga_data.count).length > 0){
					for(var key in find_player.cga_data.count){
						if(key == '麻布')
							stuffs.gold += find_player.cga_data.count[key] * 20;
						else if(key == '木棉布')
							stuffs.gold += find_player.cga_data.count[key] * 25;
						else if(key == '毛毡')
							stuffs.gold += find_player.cga_data.count[key] * 29;
					}
				}
				if(find_player.cga_data.job_name == '鹿皮'){
					stuffs.gold += find_player.cga_data.count * 1;
				}
				if(find_player.cga_data.job_name == '印度轻木'){
					stuffs.gold += find_player.cga_data.count * 1;
				}
				if(find_player.cga_data.job_name == '铜条'){
					stuffs.gold += find_player.cga_data.count * 20;
				}
				cga.positiveTrade(find_player.cga_data.player_name, stuffs, null, (result)=>{
					if (result.success == true){
						cb(true);
					} else {
						find_player.emit('endtrade');
						setTimeout(repeat, 1500);
					}
				});
			}, 1500);

			return;
		}
		
		setTimeout(repeat, 1000);
	}

	cga.travel.falan.toStone('C', ()=>{
		cga.walkList([
		[34, 88]
		], ()=>{
			cga.turnTo(32, 88);
			setTimeout(repeat, 500);
		});
	});
}

var getBestCraftableItem = ()=>{
	
	//refresh
	thisobj.craftSkill = cga.findPlayerSkill(thisobj.craftSkill.name);
	thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);
	
	var minGatherType = 999;
	
	var item = null;
	for(var i = thisobj.craftItemList.length - 1; i >= 0; i--){
		if(thisobj.craftItemList[i].level > thisobj.craftSkill.level)
			continue;
		if(!thisobj.craftItemList[i].available)
			continue;
		var allow = true;
		var gather_type = 0;

		thisobj.craftItemList[i].materials.forEach((mat)=>{

			if(allowMats.find((m)=>{ return m == mat.name} ) == undefined){
				allow = false;
				return false;
			}
			
			if(!isFabricName(mat.name))
				gather_type ++;
			
			if(mat.name == '铜条') {
                gather_type++;
            }
		})
				
		if(allow == false)
			continue;
		
		if(gather_type < minGatherType){
			minGatherType = gather_type;
			item = thisobj.craftItemList[i];
		}
	}
	
	return item;
}

var forgetAndLearn = (teacher, cb)=>{
	cga.travel.falan.toTeleRoom('圣拉鲁卡村', ()=>{
		cga.walkList(teacher.path, ()=>{
			cga.turnTo(teacher.pos[0], teacher.pos[1]);
			
			var dialogHandler = (err, dialog)=>{
				if(dialog){
					var hasSkill = cga.findPlayerSkill(teacher.skillname) ? true : false;
					if( hasSkill )
					{
						if (dialog.type == 16) {
							cga.ClickNPCDialog(-1, 1);
							cga.AsyncWaitNPCDialog(dialogHandler);
							return;
						}
						if (dialog.type == 18) {
							const skillIndex = cga.GetSkillsInfo().sort((a,b) => a.pos - b.pos).findIndex(s => s.name == teacher.skillname);
							if (skillIndex > -1) {
								cga.ClickNPCDialog(0, skillIndex);
								cga.AsyncWaitNPCDialog(dialogHandler);
								return;
							}
						}
					}
					if (dialog.options == 12) {
						cga.ClickNPCDialog(4, -1);
						cga.AsyncWaitNPCDialog(dialogHandler);
						return;
					}
					if (dialog.message.indexOf('已经删除') >= 0 || !hasSkill) {
						setTimeout(()=>{
							cga.TurnTo(teacher.pos[0], teacher.pos[1]);
							cga.AsyncWaitNPCDialog((dlg)=>{
								cga.ClickNPCDialog(0, 0);
								cga.AsyncWaitNPCDialog((dlg2)=>{
									cga.ClickNPCDialog(0, 0);
									setTimeout(cb, 1000);
								});
							});
						}, 1000);
						return;
					}
				}
			}
			cga.AsyncWaitNPCDialog(dialogHandler);
		});
	});
}

var dropUseless = (cb)=>{
	if(cga.getInventoryItems().find((inv)=>{
		return inv.name == '木棉布';
	}) != undefined && craft_target.materials.find((mat)=>{
		return mat.name == '木棉布';
	}) == undefined){
		var itempos = cga.findItem('木棉布');
		if(itempos != -1){
			cga.DropItem(itempos);
			setTimeout(dropUseless, 500, cb);
			return;
		}
	}
	
	if(cga.getInventoryItems().find((inv)=>{
		return inv.name == '毛毡';
	}) != undefined && craft_target.materials.find((mat)=>{
		return mat.name == '毛毡';
	}) == undefined){
		var itempos = cga.findItem('毛毡');
		if(itempos != -1){
			cga.DropItem(itempos);
			setTimeout(dropUseless, 500, cb);
			return;
		}
	}
	
	cb(null);
}

var cleanUseless = (cb)=>{
	cga.travel.falan.toStone('B1', ()=>{
		cga.turnTo(150, 122);
		var sellarray = cga.findItemArray((item)=>{
			if ( thisobj.craftItemList.find((craftItem)=>{
				return item.name == craftItem.name;
			}) !== undefined){
				return true;
			}
		});
		cga.sellArray(sellarray, ()=>{
			cga.walkList([
			[153, 129]//扔布点
			], ()=>{
				dropUseless(cb);
			});
		});
	});
}

var loop = ()=>{

	var craftSkillList = cga.GetSkillsInfo().filter((sk)=>{
		return (sk.name.indexOf('制') == 0 || sk.name.indexOf('造') == 0 || sk.name.indexOf('铸') == 0 );
	});

	for(var i in craftSkillList){
		if(craftSkillList[i].name == configTable.craftType){				
			thisobj.craftSkill = craftSkillList[i];
			thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);
			break;
		}
	}
	
	if(!thisobj.craftSkill)
	{
		var teacher = teachers.find((t)=>{
			return t.skillname == configTable.craftType;
		})
		if(teacher != undefined){
			craft_count = 0;
			forgetAndLearn(teacher, loop);
			return;
		} else {
			throw new Error('没有学习对应的制造技能!');
		}
	}

	callSubPluginsAsync('prepare', ()=>{
		
		craft_target = getBestCraftableItem();
		if(!craft_target){
			throw new Error('没有可制造的双百物品!');
			return;
		}
		
		if(thisobj.craftSkill.lv >= thisobj.forgetSkillAt){
			var teacher = teachers.find((t)=>{
				return t.skillname == thisobj.craftSkill.name;
			})
			if(teacher != undefined){
				craft_count = 0;
				forgetAndLearn(teacher, loop);
				return;
			}
		}

		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < craft_target.cost) {
			cga.travel.falan.toCastleHospital(()=>{
				setTimeout(loop, 3000);
			});
			return;
		}
		
		if(playerInfo.health > 0) {
			healObject.func(loop);
			return;
		}
		
		var inventory = cga.getInventoryItems();
		if(inventory.length >= 15){
			cleanUseless(loop);
			return;
		}
				
		io.sockets.emit('init', {
			craft_player : cga.GetPlayerInfo().name,
			craft_materials : craft_target ? craft_target.materials : [],
		});

		var lackStuffs = null;
		craft_target.materials.forEach((mat)=>{
			if(cga.getItemCount(mat.name) < mat.count){
				lackStuffs = mat;
				return false;
			}
		})

		if(lackStuffs !== null){
			waitStuffs(lackStuffs.name, craft_target.materials, loop);
			return;
		}
		
		var craft = ()=>{

			//没蓝
			var playerInfo = cga.GetPlayerInfo();
			if(playerInfo.mp < craft_target.cost){
				loop();
				return;
			}
			
			//包满
			if(cga.getInventoryItems().length >= 15){
				loop();
				return;
			}
			
			//升级?
			if(cga.findPlayerSkill(thisobj.craftSkill.name).lv != thisobj.craftSkill.lv){
				loop();
				return;
			}
			
			console.log('开始制造：'+craft_target.name);
			
			cga.craftItemEx({
				craftitem : craft_target.name,
				immediate : true
			}, (err, results)=>{

				if(results && results.success){
					craft_count ++;
					console.log('已造' + craft_count + '次');
					setTimeout(craft, 500);
				} else {
					setTimeout(loop, 500);
				}
				
			});
		}
		
		craft();		
	});
}

var thisobj = {
	getDangerLevel : ()=>{
		return 0;
	},
	translate : (pair)=>{
		
		if(pair.field == 'craftType'){
			pair.field = '制造类型';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'listenPort'){
			pair.field = '监听端口';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(pair.field == 'forgetSkillAt'){
			pair.field = '几级之后删除技能';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		if(healObject.translate(pair))
			return true;
		
		return false;
	},
	loadconfig : (obj)=>{
		
		configTable.craftType = obj.craftType;
				
		if(!configTable.craftType){
			console.error('读取配置：制造类型失败！');
			return false;
		}
		
		configTable.forgetSkillAt = obj.forgetSkillAt;
		thisobj.forgetSkillAt = obj.forgetSkillAt
		
		if(!thisobj.forgetSkillAt){
			console.error('读取配置：几级之后删除技能失败！');
			return false;
		}

		configTable.listenPort = obj.listenPort;
		thisobj.listenPort = obj.listenPort
		
		if(!thisobj.listenPort){
			console.error('读取配置：监听端口失败！');
			return false;
		}
		
		if(!healObject.loadconfig(obj))
			return false;
		
		return true;
	},
	inputcb : (cb)=>{

		var stage1 = (cb2)=>{
			var craftSkillList = cga.GetSkillsInfo().filter((sk)=>{
				return (sk.name.indexOf('制') == 0 || sk.name.indexOf('造') == 0 || sk.name.indexOf('铸') == 0 );
			});
			
			var sayString = '【双百插件】请选择刷的技能:';
			for(var i in craftSkillList){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + craftSkillList[i].name;
			}
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && craftSkillList[index - 1]){
					configTable.craftType = craftSkillList[index - 1].name;
					thisobj.craftSkill = craftSkillList[index - 1];
					thisobj.craftItemList = cga.GetCraftsInfo(thisobj.craftSkill.index);

					var sayString2 = '当前已选择:[' + thisobj.craftSkill.name + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					return false;
				}
				
				return true;
			});
		}
		
		var stage2 = (cb2)=>{
			
			var sayString = '【双百插件】请选择几级之后删除技能: (2~11) (只支持鞋子，11代表不删)';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && 2 >= 2 && 11 <= 11){
					configTable.forgetSkillAt = val;
					thisobj.forgetSkillAt = val;
					
					var sayString2 = '当前已选择:'+thisobj.forgetSkillAt+'级之后删除技。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}
		
		var stage3 = (cb2)=>{
			
			var sayString = '【双百插件】请选择服务监听端口: 1000~65535';
			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, val)=>{
				if(val !== null && val >= 1000 && val <= 65535){
					configTable.listenPort = val;
					thisobj.listenPort = val;
					
					var sayString2 = '当前已选择:监听端口='+thisobj.listenPort+'。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					cb2(null);
					
					return false;
				}
				
				return true;
			});
		}
		
		Async.series([stage1, stage2, stage3, healObject.inputcb], cb);
	},
	execute : ()=>{
	
		io.listen(thisobj.listenPort);
		callSubPlugins('init');
		loop();
	},
};

module.exports = thisobj;