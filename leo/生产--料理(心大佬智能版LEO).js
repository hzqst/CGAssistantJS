/*
注意
新城启动    勾选重启角本
1.勾选 高速战斗 自动补给 切图 
2.不勾选 自动战斗

以下默认可忽略
该脚本为自动做面包法国面包卖店脚本
请注意:现在默认打帽子到四级转正.
  以下默认可忽略
2.银行大小 自己更改 
3.是否打卡 自己更改 默认为关
4.自动学习技能包括 '料理','治疗','狩猎'
5.狩猎技能会自己冲级
6.会自动一转


已测试.
/默认料理技能 1-4 为打头盔
可选技持银行取盐做法面. 默认为打盐做法面.
*/

require('./common').then(cga=>{
	var bankSize = 20; //银行大小 自己更改
	var bankgetyan =false // 是否开启银行自动取盐 (true/false)  true是开启
	var daka = false  //是否打卡(true/false) true是打卡
	var lutoukui = true //是否打绿帽冲4级技能 (绿头盔移植粽子版)
	                       //如果打开,请关闭银行自己取盐 冲到4级停止
	
	leo.monitor.config.healSelf = true;//自动治疗自己
	console.log('红叶改の超级全自动料理智能永动机脚本，启动~');
	var doctorName = '医道之殇';
	leo.monitor.config.keepAlive = false;
	var sets = [];
    sets.push({
        user: 1,
        check: context => true,
        type: '逃跑',
        targets: context => [context.player_pos]
    });
    sets.push({
        user: 2,
        check: context => true,
        skillName: '防御',
        targets: context => [context.petUnit.pos]
    });

    var firstRoundDelay = 1;    //首回合延迟
    var roundDelay = 1          //每回合延迟
    var force = true ;          //是否强制启用战斗配置
    leo.setBattlePet2(false);   //关闭宠物二动
    leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
	
	
	var shouLieSkill = cga.findPlayerSkill('狩猎');
	
	
	
	var task = cga.task.Task('料理王国开启', [
	{	
intro: '1.治疗 如果没有自动学习.',
    workFunc: function(){
	let zhiliaoskill = cga.findPlayerSkill('治疗');
		if(!zhiliaoskill){ 
	     return leo.goto(n=>n.falan.whospital)
	.then(()=>leo.autoWalk([10, 6]))
	.then(()=>leo.turnTo(10, 5))
	.then(()=>cga.ClickNPCDialog(0, 0))
	.then(()=>leo.delay(500))
	.then(()=>cga.AsyncWaitNPCDialog(()=>{cga.ClickNPCDialog(0, -1)}))
	.then(()=>leo.delay(500))
	.then(()=>cga.ClickNPCDialog(0, -1))
	.then(()=>leo.delay(500))
	.then(()=>console.log('治疗技能已学'))
	.then(()=>leo.exit());
			}		
	}		
},
{
	intro: '2.料理 如果没有自动学习.',
    workFunc: function(){
    let liaoliskill = cga.findPlayerSkill('料理');
   	if(!liaoliskill){  //料理自动学习
	     return leo.goto(n=>n.castle.x)
	.then(()=>leo.autoWalkList([[42, 50,'里谢里雅堡 1楼'],[103, 21,'厨房'],[12,7]]))
	.then(()=>leo.turnTo(12, 6))
	.then(()=>cga.ClickNPCDialog(0, 0))
	.then(()=>leo.delay(500))
	.then(()=>cga.AsyncWaitNPCDialog(()=>{cga.ClickNPCDialog(0, -1)}))
	.then(()=>leo.delay(500))
	.then(()=>cga.ClickNPCDialog(0, -1))
	.then(()=>leo.delay(500))
	.then(()=>console.log('料理技能已学'))
	.then(()=>leo.delay(500))
	.then(()=>leo.exit());
	}
}
},
{
	intro: '3.狩猎 如果没有自动学习.',
    workFunc: function(){
    var npcName = '猎人拉修'; 
    var autoTalk = '是';
	    var targetFinder = (units) => {
        return units.find(u => u.unit_name == npcName && u.type == 1 
            && (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0);
    }
	  var todo = (target) => {
        return leo.todo()
        .then(() => {
            if(autoTalk=='是'){
                return leo.talkNpc(target.xpos, target.ypos, leo.talkNpcSelectorYes);
            }else if(autoTalk=='否'){
                return leo.talkNpc(target.xpos, target.ypos, leo.talkNpcSelectorNo);
            }else{
                return leo.next();
            }
        })        
    }
	var main = async () => {
	if(!shouLieSkill){
	await leo.goto(n=>n.falan.eout);
	await leo.autoWalk([488,205]);
	await leo.findOne(targetFinder, todo)
	await leo.delay(500)
    await leo.talkNpc(0, leo.talkNpcSelectorYes)
	await cga.ClickNPCDialog(0, 0);
	await leo.delay(500);
	await cga.AsyncWaitNPCDialog(()=>{cga.ClickNPCDialog(0, -1)});
	await leo.delay(500);
	await cga.ClickNPCDialog(0, -1);
	await leo.delay(500);
	await console.log('狩猎技能已学');
	await leo.exit();
	}
	}
	main();
	}
	},
{
	intro: '4.如果一级,冲二级狩猎.',
    workFunc: function(r){
	var shouLieSkill = cga.findPlayerSkill('狩猎');
	if(shouLieSkill.lv==2){
		console.log('达到目标重启角本');
		return leo.exit();
	}
	var fullCount = 20;
	var main = async () => {
    await leo.logBack()
	await leo.checkHealth(doctorName)
	if(cga.getInventoryItems().length>=fullCount || leo.getEmptyBagIndexes().length==0){
	await leo.goto(n=>n.castle.x)
	await leo.autoWalk([31,77])
	await leo.sell(30, 77, (item)=>{return item.name == '蕃茄' && item.count == 40})
	await leo.delay(1000)
	}
	await leo.goto(n => n.falan.eout)
	await leo.autoWalk([471,160])
    await leo.log('冲二级狩猎')	
	await leo.loop(()=>{
			if(shouLieSkill.lv==2){
		      console.log('达到目标重启角本');
		          return leo.exit();
			}
			if(cga.GetPlayerInfo().mp < 1){
				return leo.log('魔力不足').then(()=>leo.reject());
			}
			var emptyIndexes = leo.getEmptyBagIndexes();
			if (emptyIndexes.length == 0) {
		       return leo.logBack().then(()=>leo.reject());
			}
	        cga.StartWork(shouLieSkill.index, 0);
			return leo.waitWorkResult()
			.then(()=>leo.pile(true))
			.then(()=>leo.delay(2000));
		   
		});	 
	}
	leo.loop(async ()=>{
	leo.waitAfterBattle()
        try{
           await main();
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })
	} 	
},
{
intro: '5.打绿头盔冲2级技能.',
    workFunc: function(){
	const sets = [];
/*		sets.push({
		user: 1,
		check: context => {if (context.isFirstBattleAction){
		console.log(context);	
			console.log(context.player_pos);
			
				console.log(context.player_pos);
			console.log(context.round_count);
			console.log(context.pet_pos);
		}
		},
		type: '防御',
		targets: context =>  [context.player_pos]
	});
*/	sets.push({
		user: 1,
		check: context =>{if (context.player_pos==5){ return context.enemies.find(e => e.name) && context.round_count == 0
		}
		} ,
		type: '防御',
		targets: context => [context.enemies.find(e => e.name ).pos]
	});

	sets.push({
		user: 2,
		check: context => {if (context.player_pos==5){ return context.enemies.find(e => e.name) && context.round_count == 0
		}
		} ,
		skillName: '防御',
		targets:context => [context.enemies.find(e => e.name ).pos]
	});

	sets.push({
		user: 1,
		check: context =>{if (context.player_pos==5){ return context.enemies.find(e => e.name) && context.round_count == 1
		}
		} ,
		type: '防御',
		targets: context => [context.enemies.find(e => e.name ).pos]
	});

	sets.push({
		user: 2,
		check: context => {if (context.player_pos==5){ return context.enemies.find(e => e.name) && context.round_count == 1
		}
		} ,
		skillName: '防御',
		targets:context => [context.enemies.find(e => e.name ).pos]
	});

	sets.push({
		user: 1,
		check: context => true,
		type: '攻击',
		targets: context => [context.player_pos]
	});
	sets.push({
		user: 2,
		check: context => true,
		skillName: '攻击',
		targets:context => [context.petUnit.pos]
	});
    var firstRoundDelay = 4000;  	//首回合延迟
    var roundDelay = 4000          //每回合延迟
    var force = true ;          //是否强制启用战斗配置
	
  
    leo.setBattlePet2(true);   //开启宠物二动
	var Flags =0
    leo.autoBattle(sets,firstRoundDelay,roundDelay,force,Flags);
	var protect = {
        minHp: 100,
        minMp: 50,
        minPetHp: 50,
        minPetMp: 50,
		maxItemNumber: 19,
        checker: () => {
            var count = cga.getItemCount('绿头盔');
            if (count > 11) {
                return true;
            }}
    };
  var itemName = '面包';	
  var countNo = 1;
  
var main = async () => {
		await leo.waitAfterBattle()
		await leo.checkHealth(doctorName)
	    //1.换绿头盔
		if(cga.getItemCount('绿头盔') != 0){
			await leo.logBack()
			await leo.goto(n=>n.castle.x)
			await leo.autoWalk([31,77])
            await leo.sell(30, 77)
			await leo.autoWalkList([[65, 53,'法兰城'],[217, 52,'拿潘食品店'],[15,6]])
			await leo.talkNpc(15,5,leo.talkNpcSelectorYes)
			await leo.loop(()=>{
				if (cga.getItemCount('全套面包招待券') == 0){
					return leo.reject();
				}
				return leo.talkNpc(15,5,leo.talkNpcSelectorYes).then(()=>leo.pile(true))
				
			})
	    }
	    //2.换面包券
		if(cga.getItemCount('全套面包招待券') != 0){
			await leo.logBack()
			await leo.goto(n=>n.castle.x)
			await leo.autoWalk([31,77])
            await leo.sell(30, 77)
			await leo.autoWalkList([[65, 53,'法兰城'],[217, 52,'拿潘食品店'],[15,6]])
			await leo.loop(()=>{
				if (cga.getItemCount('全套面包招待券') == 0){
					return leo.reject();
				}
				return leo.talkNpc(15,5,leo.talkNpcSelectorYes).then(()=>leo.pile(true))
				
			})
	    }		
		//3.打绿头盔		
		if(cga.getItemCount('小麦粉') == 0){
			await leo.logBack()
			await leo.goto(n=>n.castle.x)
			await leo.autoWalk([31,77])
            await leo.sell(30, 77)			
            await leo.autoWalkList([[42, 98,'法兰城'],[153, 241,'芙蕾雅'],[434,284]])	
            await leo.encounterTeamLeader(protect)
			await context.enemies.find(e => e.level == 1 )	
			.then(() => {console.log('地上满了');return leo.autoWalk([444,287])})
			.then(() => {return leo.encounterTeamLeader(protect)})
			.then(() => {console.log('地上满了');return leo.autoWalk([449,284])})
		    .then(() => {return leo.encounterTeamLeader(protect)})
			.then(() => {console.log('地上满了');return leo.autoWalk([455,284])})
			.then(() => {return leo.encounterTeamLeader(protect)})
			await leo.delay(500)
			await leo.logBack();
			
		}
		
	
		if(cga.getItemCount('小麦粉')!=0){
			await leo.log('材料已集齐，开始去制造面包')
			await leo.logBack()
			
			await leo.goto(n=>n.castle.x)
			if(daka){
			await leo.autoWalk([58,83])
		    await leo.talkNpc(58,84,leo.talkNpcSelectorYes)}
			
			await leo.autoWalk([31,77])
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 200){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.goto(n=>n.castle.x))
					.then(()=>leo.autoWalk([31,77]));
				}
				var count = cga.getItemCount('小麦粉');
				if (count == 0) {
					return leo.reject();
				}
				return leo.todo()
				.then(()=>leo.craft(itemName))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.pile(true)
			await leo.delay(500)
			await leo.autoWalk([31,77])
			await leo.sell(30, 77, (item)=>{return item.name == '面包' && item.count == 3})
			await leo.log('本轮采集+面包制造贩卖完成')
			await leo.log('厨师单人全自动采集制作面包贩卖商店，完成第' + (countNo++) + '次')
		}
	}

    leo.loop(async ()=>{
        try{
			await leo.dropItem('魔石','地的水晶碎片','水的水晶碎片','火的水晶碎片','风的水晶碎片','卡片？','哥布林的卡片','迷你蝙蝠的卡片')
			await leo.stopDropItems('绿头盔')
            await main();
			
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })



	}
},
{
intro: '6.技能四转正.',
workFunc: function(){
	var sets = [];
    sets.push({
        user: 1,
        check: context => true,
        type: '逃跑',
        targets: context => [context.player_pos]
    });
    sets.push({
        user: 2,
        check: context => true,
        skillName: '防御',
        targets: context => [context.petUnit.pos]
    });

    var firstRoundDelay = 1;    //首回合延迟
    var roundDelay = 1          //每回合延迟
    var force = true ;          //是否强制启用战斗配置
    leo.setBattlePet2(false);   //关闭宠物二动
    leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
	var main = async () => {
		await leo.logBack()
   		await leo.waitAfterBattle()
		await leo.checkHealth(doctorName)   	
	    await leo.logBack()	
		await leo.goto(n=>n.castle.teleport)
		await leo.autoWalk([9, 22])
		await leo.turnDir(4).then(()=>{cga.AsyncWaitNPCDialog((err, dlg)=>{
							if(dlg && dlg.message.indexOf('250') >= 0)
							{cga.ClickNPCDialog(8, -1);
						    return leo.talkNpc(4, leo.talkNpcSelectorYes,'维诺亚村的传送点')
							}
							else{leo.log('没有开传送!颠着去吧')
		.then(()=>leo.goto(n=>n.falan.sout))
	    .then(()=>leo.autoWalk([473,316]))
	    .then(()=> leo.talkNpc(4,leo.talkNpcSelectorYes,'维诺亚洞穴 地下1楼'))
	    .then(()=> leo.autoWalk([15,16]))
	    .then(()=> leo.talkNpc(4,leo.talkNpcSelectorYes,))
		.then(()=> leo.autoWalkList([[8,10,'小路'],[55,53,'维诺亚洞穴 地下3楼'],[26,64,'芙蕾雅'],[330,480,'维诺亚村'],
	          [40,36,'村长的家'],[18,10,'村长家的小房间'],[8,2,'维诺亚村的传送点'],[5,3]]))
	    .then(()=> leo.talkNpc(2,leo.talkNpcSelectorYes))
	    .then(()=> leo.log('维诺亚村开启!'))
		.then(()=> leo.next());
							}
		})
		})
		var map=cga.GetMapIndex();
		console.log(map)
		await leo.delay(1000)
		await leo.delay(1000)
		await leo.autoWalkList([[5, 1,'村长家的小房间'],[0, 6,'村长的家'],[9, 16,'维诺亚村'],[49, 58,'荷特尔咖哩店'],[11, 7]])
		await leo.talkNpc(6,leo.talkNpcSelectorYes) 
		await leo.delay(1000)
		await leo.logBack()
		await leo.next();
		
	
		await leo.goto(n=>n.falan.eout)
	    await leo.autoWalkList([[681,343,'伊尔村'],[32,65,'旧金山酒吧'],[15,12]])
		await leo.talkNpc(4,leo.talkNpcSelectorYes)
		await leo.delay(1000)
		await leo.goto(n=>n.falan.wout)
		await leo.autoWalkList([[134,219,'圣拉鲁卡村'],[50,64,'食品店'],[15,9]])
		await leo.talkNpc(0,leo.talkNpcSelectorYes) 
		await leo.autoWalkList([[1,8,'圣拉鲁卡村'],[49,81,'村长的家'],[8,10,'圣拉鲁卡村的传送点'],[14,3]])
		await leo.turnDir(0).then(()=>{cga.AsyncWaitNPCDialog((err, dlg)=>{
							if(dlg && dlg.message.indexOf('50') >= 0)
							{cga.ClickNPCDialog(8, -1);}else{
							leo.talkNpc(0,leo.talkNpcSelectorYes)
							}
		})
		})
		await leo.goto(n=>n.falan.sout)
	    await leo.autoWalk([473,316])
	    await leo.talkNpc(4,leo.talkNpcSelectorYes,'维诺亚洞穴 地下1楼')
	    await leo.autoWalk([15,16])
	    await leo.talkNpc(4,leo.talkNpcSelectorYes,)
		await leo.autoWalkList([[8,10,'小路'],[55,53,'维诺亚洞穴 地下3楼'],
		     [26,64,'芙蕾雅'],[330,480,'维诺亚村'],
	         [49, 58,'荷特尔咖哩店'],[11, 7]])
		await leo.talkNpc(6,leo.talkNpcSelectorYes) 
		await leo.delay(1000)
		await leo.logBack()
		await leo.next();	
	    await leo.goto(n=>n.teleport.yer)
	    await leo.autoWalkList([[32, 65,'旧金山酒吧'],[15, 5]])
	    await leo.turnDir(6).then(()=>cga.AsyncWaitNPCDialog(()=>{cga.ClickNPCDialog(0, 2)}))
	.then(()=>leo.delay(500))
	.then(()=>cga.ClickNPCDialog(0, -1))
	.then(()=>leo.delay(500))
	.then(()=>console.log('转正'))
	.then(()=>leo.delay(500))
	.then(()=>leo.exit());
	}
	
	leo.waitAfterBattle()
	main();
	}
},
{
	intro: '7.如果二级,冲三级狩猎.',
    workFunc: function(){
	var shouLieSkill = cga.findPlayerSkill('狩猎');
	if(shouLieSkill.lv==3){
		console.log('达到目标重启角本');
		return leo.exit();
	}
	var fullCount=20;
	var main = async () => {
	await leo.logBack()
	await leo.checkHealth(doctorName)
	if(cga.getInventoryItems().length>=fullCount || leo.getEmptyBagIndexes().length==0){
	await leo.goto(n=>n.castle.x)
	await leo.autoWalk([31,77])
	await leo.sell(30, 77, (item)=>{return item.name == '大豆' && item.count == 40})
	await leo.delay(1000)
	}
	await leo.goto(n=>n.elsa.x)
	await leo.autoWalkList([[112, 102, '温迪尔平原'],[224, 60, '盖雷布伦森林'],[108, 123, '法兰城遗迹'],[119, 65,]])
    await leo.log('冲三级狩猎')	
	await leo.loop(()=>{
		    if(shouLieSkill.lv==3){
	     	console.log('达到目标重启角本');
		    return leo.exit();
	        }
			if(cga.GetPlayerInfo().mp < 1){
				return leo.log('魔力不足').then(()=>leo.reject());
			}
			var emptyIndexes = leo.getEmptyBagIndexes();
			if (emptyIndexes.length == 0) {
		       return leo.log('魔力不足').then(()=>leo.reject());
			}
	        cga.StartWork(shouLieSkill.index, 0);
			return leo.waitWorkResult()
			.then(()=>leo.pile(true))
			.then(()=>leo.delay(2000));
		   
		});	 
	}
	leo.loop(async ()=>{
	leo.waitAfterBattle()
        try{
           await main();
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })
	} 	
},
{
intro: '8.法国面包.',
  workFunc: function(){
var shouLieSkill = cga.findPlayerSkill('狩猎');
var shouLieSkillLevel = 3;
  if(shouLieSkill.lv<shouLieSkillLevel){
		console.log('提示：狩猎技能等级不足，至少要3级技能！');
	}	   
var countNo = 1;
	var main = async () => {
		await leo.waitAfterBattle()
		await leo.checkHealth(doctorName)

		//1.牛奶蕃茄
	if(cga.getItemCount('牛奶')< 200 && (cga.getItemCount('蕃茄')< 260 || cga.getItemCount('蕃茄')< 260)){
		await leo.logBack()
		await leo.goto(n=>n.castle.x)
		await leo.autoWalk([31,77])
		await leo.sell(30, 77, (item)=>{return item.name == '法国面包' && item.count == 3}) 
		await leo.goto(n=>n.teleport.yer)
	    await leo.autoWalkList([[45, 31, '芙蕾雅'],[684, 334]])
        await console.log('到达位置，开始狩猎【牛奶】')
		await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return console.log('魔力不足')
					.then(()=>leo.reject());
				}
				var count = cga.getItemCount('牛奶');
				var count2 = cga.getItemCount('蕃茄');
				if (count >= 200 && count2 >= 260) {
					return leo.reject();
				}
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
		await leo.dropItem('牛奶',40)
		}
		 //2.小麦粉
		if(cga.getItemCount('小麦')< 200 && cga.getItemCount('蕃茄')>= 260){
		await leo.goto(n=>n.falan.sout)
	    await leo.autoWalkList([
					[513,282, '曙光骑士团营地'],
					[42, 56, '曙光营地医院'],
		            [15, 12]]);
		await cga.FixMapWarpStuck(1);
		var mapInfo = cga.getMapInfo(); 
		await leo.delay(500)
		await leo.autoWalk([96, 5]);
		let itemName = '蕃茄'
		    var exchangeCount = cga.getItemCount(itemName) / 20;
		    var list = [{index:0, count:exchangeCount}];
		await leo.exchange(6,list)
		await leo.dropItem('蕃茄',40)
		await leo.dropItem('小麦粉',40)
		}
		//3.盐
		if((shouLieSkill.lv<shouLieSkillLevel || (bankgetyan)) && (cga.getItemCount('盐')) < 200 ) {
		await console.log('狩猎技能不足或手动已开启.去银行取盐')
		await leo.goto(n=>n.falan.bank)
		await leo.turnTo(12, 8)
		await leo.getFromBank('盐',5)
		await leo.delay(500)
	}
		if(cga.getItemCount('盐')< 200 && shouLieSkill.lv>2){
			await leo.logBack()
			await leo.goto(n=>n.asha.n)
			await leo.autoWalk([190,116,'盖雷布伦森林'])
			await leo.autoWalk([203, 209])
            await console.log('到达位置，开始狩猎【盐】')
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 1){
					return console.log('魔力不足')
					.then(()=>leo.reject());
				}
				if (cga.getItemCount('盐') >= 200) {
					return leo.reject();
				}		
				cga.StartWork(shouLieSkill.index, 0);
				return leo.waitWorkResult()
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})			
			await leo.dropItem('盐',40)
		}
		if(cga.getItemCount('小麦粉')>=200
			&& cga.getItemCount('牛奶')>=200
			&& cga.getItemCount('盐')>=200){
			await console.log('材料已集齐，开始去制造法国面包')
			await leo.logBack()
			await leo.goto(n=>n.castle.x)
			await leo.checkHealth(doctorName)
			if(daka){
			await leo.autoWalk([58,83])
		    await leo.talkNpc(58,84,leo.talkNpcSelectorYes)}
			await leo.autoWalk([31,76])
			await leo.loop(()=>{
				if(cga.GetPlayerInfo().mp < 70){
					console.log('魔力不足');
					return leo.logBack()
					.then(()=>leo.checkHealth(doctorName))
					.then(()=>leo.goto(n=>n.castle.x))
					.then(()=>leo.autoWalk([31,76]));
				}
				var count = cga.getItemCount('小麦粉');
				if (count < 20) {
					return leo.reject();
				}
				return leo.todo()
				.then(()=>leo.craft('法国面包'))
				.then(()=>leo.pile(true))
				.then(()=>leo.delay(500));
			})
			await leo.pile(true)
			await leo.delay(500)
			await leo.autoWalk([31,77])
			await leo.sell(30, 77, (item)=>{return item.name == '法国面包' && item.count == 3})
			await leo.sell(30, 77, (item)=>{return item.name == '牛奶' && item.count == 40})
			await console.log('本轮采集+法国面包制造贩卖完成')
			await console.log('完成第' + (countNo++) + '次')
				var map=cga.GetMapIndex();
		console.log(map)
		}
	}
	leo.loop(async ()=>{
        try{
            await main();
        }catch(e){
            console.log(leo.logTime()+'出错，重新开始：', e);
        }
    })
}	
}
],

[
function(){//1.学习治疗
			return (cga.findPlayerSkill('治疗')) ? true : false;
},
function(){//2.学习料理
			return (cga.findPlayerSkill('料理')
			&&(cga.findPlayerSkill('治疗'))) ? true : false;			
},
function(){//3.学习狩猎
			return (cga.findPlayerSkill('狩猎')
			&& cga.findPlayerSkill('料理')
			&&cga.findPlayerSkill('治疗')) ? true : false;			
},



function(){//4.狩猎2级
	let skill = (cga.findPlayerSkill('狩猎'))
       var r=((cga.findPlayerSkill('狩猎')
			&& cga.findPlayerSkill('料理'))
			&&cga.findPlayerSkill('治疗'))
			if(r) return(skill.lv>1)	? true : false;
},



function(){//5.料理4级绿头盔
	var skill = (cga.findPlayerSkill('料理'))
	var r=(cga.findPlayerSkill('狩猎')
			&& cga.findPlayerSkill('料理')
			&&cga.findPlayerSkill('治疗')) 
			if(r) return(((skill.lv==2) && (!lutoukui))||(skill.lv==4))	? true : false;
},

function(){//6.去一转
var playerinfo = cga.GetPlayerInfo();
     
			 return( playerinfo.job=='厨师') ? true : false;
},

function(){//4.狩猎3级
	let skill = (cga.findPlayerSkill('狩猎'))
       var r=((cga.findPlayerSkill('狩猎')
			&& cga.findPlayerSkill('料理'))
			&&cga.findPlayerSkill('治疗'))
			if(r) return(skill.lv>2)	? true : false;
},

function(){//料理10级
	let skill = (cga.findPlayerSkill('料理'))
	var r=(cga.findPlayerSkill('狩猎')
			&& cga.findPlayerSkill('料理')
			&&cga.findPlayerSkill('治疗'))
	if(r) return(((skill.lv==10) && (!lutoukui))||(skill.lv==10))	? true : false;
},
]);
task.doTask();
});




