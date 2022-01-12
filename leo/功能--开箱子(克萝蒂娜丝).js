require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	
	const minMoney = 20000;
	let bank = true;
	const dropCount = 3;
	const savaU = true;
	const change = true;
    const dropList = [
                '克萝蒂娜丝的卡片「Ｌ」',
                '克萝蒂娜丝的卡片「Ｒ」',
                '克萝蒂娜丝的卡片「Ｅ」',
                //'克萝蒂娜丝的卡片「Ｕ」',
                '克萝蒂娜丝的卡片「？」',
                '奇怪的乐器',
                '#450390','#450391','#450392','#450393',
                '#450395','#450396','#450397','#450398',
                '#450400','#450401','#450402','#450403',
                '#450405','#450406','#450407','#450408',
                '#450410','#450411','#450412','#450413',
                '#450415','#450416','#450417','#450418',
                '#450420','#450421','#450422','#450423',
                '#450425','#450426','#450427','#450428',
                '#450430','#450431','#450432','#450433',
                '#450435','#450436','#450437','#450438',
                '#450440','#450441','#450442','#450443',
                '#450445','#450446','#450447','#450448',
                '#450450','#450451','#450452','#450453',
                '#450455','#450456','#450457','#450458',
                '#450460','#450461','#450462','#450463',
                '#450465','#450466','#450467','#450468',
                '#450470','#450471','#450472','#450473',
                '#450475','#450476',
                '#450480','#450481',
    ]
    const changeList = ['克萝蒂娜丝的卡片「Ｋ」'];
    const itemList = ['奇迹矿条','奇迹之布','虎头蜂的刺','海底龟的壳','格利芬的羽毛','水晶怪的眼球','果冻史莱姆的核心','天祈之羽','天赐之羽','地祈之羽','地赐之羽','黑色神秘水晶矿','黄色神秘水晶矿','琥珀色神秘水晶矿','绿色神秘水晶矿','蓝色神秘水晶矿','红色神秘水晶矿','古代树的叶子','涌动之泉的结晶','奇怪的乐器'];
    const saveList = [450394,450399,450404,450409,450414,450419,450424,450429,450434,450439,450444,450449,450454,450459,450464,450469,450474,450479,450484,450478,450483,450477,450482];
    if(!savaU){
    	dropList.push('克萝蒂娜丝的卡片「Ｕ」');
    }else{
    	changeList.push('克萝蒂娜丝的卡片「Ｕ」');
    }
    await leo.log('红叶の开箱子(克萝蒂娜丝)脚本，启动~');
	await leo.log('当前身上魔币：' + cga.GetPlayerInfo().gold)
    var count = 0;//开箱子数
    const gotoE2 = async () => {
		if(leo.getMapInfo().name == '艾尔莎岛' || leo.getMapInfo().name == '银行'){
			await leo.goto(n => n.falan.e2)
		}
	    if(leo.getMapInfo().name == '里谢里雅堡'){
			await leo.autoWalk([41,98,'法兰城'])
		}
		if(leo.getMapInfo().name == '法兰城' 
			&& leo.getMapInfo().x == 153 && leo.getMapInfo().y == 103){
			await leo.autoWalk([162,130])
		}
		if(leo.getMapInfo().name == '法兰城' 
			&& leo.getMapInfo().x == 162 && leo.getMapInfo().y == 130){
			await leo.loop(async ()=>{
				if(cga.getMapInfo().x!=162 && cga.getMapInfo().y!=130){
					return leo.reject();
				}
				await leo.turnDir(0)
				await leo.delay(1000)
			})
		}
		if(leo.getMapInfo().name == '法兰城' 
			&& leo.getMapInfo().x == 72 && leo.getMapInfo().y == 123){
			await leo.loop(async ()=>{
				if(cga.getMapInfo().x!=72 && cga.getMapInfo().y!=123){
					return leo.reject();
				}
				await leo.turnDir(0)
				await leo.delay(1000)
			})
		}
		if(leo.getMapInfo().name == '法兰城' 
			&& leo.getMapInfo().x == 141 && leo.getMapInfo().y == 148){
			await leo.loop(async ()=>{
				if(cga.getMapInfo().x!=141 && cga.getMapInfo().y!=148){
					return leo.reject();
				}
				await leo.turnDir(6)
				await leo.delay(1000)
			})
		}
		if(leo.getMapInfo().name == '法兰城' 
			&& leo.getMapInfo().x == 63 && leo.getMapInfo().y == 79){
			await leo.loop(async ()=>{
				if(cga.getMapInfo().x!=63 && cga.getMapInfo().y!=79){
					return leo.reject();
				}
				await leo.turnDir(6)
				await leo.delay(1000)
			})
		}
		if(leo.getMapInfo().name == '法兰城' 
			&& leo.getMapInfo().x == 242 && leo.getMapInfo().y == 100){
			await leo.autoWalk([233, 78])
		}
	}

    const doDrop = async () => {
    	await leo.panel.itemdroplist(dropList);
    	await leo.logBack()
    	await gotoE2()
    	var locations = [
	        [181,84],[185,84],[188,84],[191,84],[194,84],[197,84],[200,84],[203,84],[206,84],[209,84],[212,84],[215,84],[218,84],[221,84],[224,84],[227,84],[230,84],[233,84],[236,84],[239,84],[242,84],[245,84],[247,84],
	        [181,87],[185,87],[188,87],[191,87],[194,87],[197,87],[200,87],[203,87],[206,87],[209,87],[212,87],[215,87],[218,87],[221,87],[224,87],[227,87],[230,87],[233,87],[236,87],[239,87],[242,87],[245,87],[247,87],
	        [181,90],[185,90],[188,90],[191,90],[194,90],[197,90],[200,90],[203,90],[206,90],[209,90],[212,90],[215,90],[218,90],[221,90],[224,90],[227,90],[230,90],[233,90],[236,90],[239,90],[242,90],[245,90],[247,90],
	        [181,93],[185,93],[188,93],[191,93],[194,93],[197,93],[200,93],[203,93],[206,93],[209,93],[212,93],[215,93],[218,93],[221,93],[224,93],[227,93],[230,93],[233,93],[236,93],[239,93],[242,93],[245,93],[247,93],
	    ]
	    var times = 30;
	    while(true){
	    	const emptyIndexes = leo.getEmptyBagIndexes();
	    	const dropItems = cga.getInventoryItems().filter(i => dropList.includes(i.name));
	    	if(dropItems.length>0){
	    		var index = Math.floor(Math.random()*locations.length);
                await leo.autoWalk(locations[index])
                await leo.delay(1500) //停止，等待丢弃物品
                times--;
                if(times<0){
                    break;
                }
	    	}else{
	    		break;
	    	}
	    }
    }

    const clickBag = async () => {
    	while(true){
            var bags = cga.getInventoryItems().filter(i => i.name == '克萝蒂娜丝的抽奖袋');
            if(bags.length>0){
                var bag = bags[0];
                cga.UseItem(bag.pos)
                await leo.delay(300)
            }else{
                break;
            }
        }
    }

    const doChange = async () => {
    	if(change){
    		await leo.loop(async ()=>{
    			const needChangeList = cga.getInventoryItems().filter(i=>changeList.includes(i.name));
		    	if(needChangeList.length>0){
		            if(cga.GetMapName()!='冒险者旅馆') {
				        await gotoE2()
				        await leo.autoWalk([238, 64, '冒险者旅馆'])
				    }
				    await leo.autoWalk([43,23])
				    await leo.talkNpc(44,24,leo.talkYes)
		    	}else{
		    		return leo.reject();
		    	}
		    	await leo.delay(1000)
    		})
    		var items = cga.getInventoryItems().filter(i=>itemList.includes(i.name));
    		if(items.length>0){
    			let saveBank = false;
    			for (var i = 0; i < items.length; i++) {
    				const item = items[i];
    				if(item.name == '奇怪的乐器'){
    					await leo.useItemEx('奇怪的乐器')
    					await leo.delay(1000)
    				}
    				if(saveList.includes(item.itemid)){
    					await leo.log('恭喜！获得【'+item.name+'】(#'+item.itemid+')')
    					await leo.logServer('宝箱','恭喜！获得【'+item.name+'】(#'+item.itemid+')')
    					saveBank = true;
    				}else{
    					await leo.log('可惜，获得了【'+item.name+'】(#'+item.itemid+')，扔~')
    				}
    			}
    			if(saveBank){
    				await leo.panel.itemdroplist(dropList);
					await leo.loop(async()=>{
						if(leo.getMapInfo().name == '银行') {
							return leo.reject();
						}
						try{
							await leo.goto(n => n.falan.bank)
						}catch(e){
							console.log(leo.logTime()+'出错，e:' + e);
						}
						await leo.delay(1000)
					})
					await leo.autoWalk([11,8])
					await leo.turnDir(0)
		    		await leo.saveToBankAll(i=>saveList.includes(i.itemid))
		    		await leo.syncInfo(cga,true)
		    		console.log(leo.logTime()+'已存') 
    			}
    		}
    	}
    }

    await leo.loop(async ()=>{
    	if(cga.GetPlayerInfo().gold<minMoney) {
    		console.log(leo.logTime()+'身上魔币低于：'+minMoney)
    		if(bank){
    			await leo.panel.itemdroplist(dropList);
    			console.log(leo.logTime()+'去银行取魔币')
    			await leo.getMoneyFromBank(500000);
    		}
    		if(cga.GetPlayerInfo().gold<minMoney) {
    			return leo.reject();
    		}
    	}
    	if(leo.has('克萝蒂娜丝的卡片「Ｋ」')){
    		if(change){
    			await doChange()
    		}else{
    			await leo.panel.itemdroplist(dropList);
				await leo.loop(async()=>{
					if(leo.getMapInfo().name == '银行') {
						return leo.reject();
					}
					try{
						await leo.goto(n => n.falan.bank)
					}catch(e){
						console.log(leo.logTime()+'出错，e:' + e);
					}
					await leo.delay(1000)
				})
				await leo.autoWalk([11,8])
				await leo.turnDir(0)
	    		await leo.saveToBankAll(450485)
	    		await leo.syncInfo(cga,true)
	    		console.log(leo.logTime()+'已存') 
    		}
    	}
    	if(leo.has('克萝蒂娜丝的卡片「Ｕ」')){
    		if(savaU){
    			if(change){
    				await doChange()
    			}else{
    				await leo.panel.itemdroplist(dropList);
	    			await leo.loop(async()=>{
						if(leo.getMapInfo().name == '银行') {
							return leo.reject();
						}
						try{
							await leo.goto(n => n.falan.bank)
						}catch(e){
							console.log(leo.logTime()+'出错，e:' + e);
						}
						await leo.delay(1000)
					})
					await leo.autoWalk([11,8])
					await leo.turnDir(0)
		    		await leo.saveToBankAll('克萝蒂娜丝的卡片「Ｕ」')
		    		await leo.syncInfo(cga,true)
		    		console.log(leo.logTime()+'已存') 
    			}
    		}
    	}
    	const emptyIndexes = leo.getEmptyBagIndexes();
        if(leo.has('克萝蒂娜丝的抽奖袋') || emptyIndexes.length >= dropCount){
        	await leo.panel.itemdroplist(['克萝蒂娜丝的卡片「？」']);
            if(cga.GetMapName()!='冒险者旅馆') {
		        await gotoE2()
		        await leo.autoWalk([238, 64, '冒险者旅馆'])
		    }
		    await leo.autoWalk([43,23])
		    var dir = 0;    //方向0-东2-南4-西6北
		    var buyItem = [
		        {index: 0,count:emptyIndexes.length},
		    ];
		    await leo.buy(dir,buyItem)
		    await leo.delay(2000)
		    if(leo.has('克萝蒂娜丝的抽奖袋')){
		    	await leo.loop(async ()=>{
			    	if(leo.has('克萝蒂娜丝的抽奖袋')){
			    		//await leo.useItemEx('克萝蒂娜丝的抽奖袋')
			    		await clickBag()
			    	}
			    	if(leo.has('克萝蒂娜丝的卡片「？」')){
			    		//await leo.dropItemEx('克萝蒂娜丝的卡片「？」')
			    		return leo.delay(1000)
			    	}
			    	if(leo.has('克萝蒂娜丝的卡片「Ｋ」')){
			    		await leo.log('恭喜！获得Ｋ奖')
			    		//await leo.logServer('宝箱','恭喜！获得克萝蒂娜丝的Ｋ奖')
			    	}
			    	if(leo.has('克萝蒂娜丝的卡片「Ｕ」') && savaU){
			    		await leo.log('恭喜！获得Ｕ奖')
			    		//await leo.logServer('宝箱','恭喜！获得克萝蒂娜丝的Ｕ奖')
			    	}
			    	await leo.delay(500)
		    		return leo.reject();
			    })
			    count += emptyIndexes.length;
			    await leo.log('红叶の开箱子(克萝蒂娜丝)脚本，已开奖次数：' + count)
		    }
        }else{
        	console.log(leo.logTime()+'身上没有足够的位置了，先扔一会')
        	await doDrop()
        	await leo.autoWalk([238, 64, '冒险者旅馆'])
        	//return leo.delay(2000);
        }
        return leo.delay(1000);
    })

    await leo.log('脚本结束')
    await leo.delay(10000)
    await leo.exit()
});