require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	
	const minMoney = 50000;
	await leo.log('红叶の开箱子(黄金哥布林)脚本，启动~');
	await leo.log('当前身上魔币：' + cga.GetPlayerInfo().gold)
    var count = 0;//开箱子数

    const doDrop = async () => {
    	var locations = [
	        [221,84],[224,84],[227,84],[230,84],[233,84],[236,84],[239,84],
	        [221,87],[224,87],[227,87],[230,87],[233,87],[236,87],[239,87],
	        [221,90],[224,90],[227,90],[230,90],[233,90],[236,90],[239,90],
	        [221,93],[224,93],[227,93],[230,93],[233,93],[236,93],[239,93],
	    ]
	    var times = 20;
	    while(true){
	    	const emptyIndexes = leo.getEmptyBagIndexes();
	    	if(emptyIndexes<10){
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

    await leo.loop(async ()=>{
    	if(cga.GetPlayerInfo().gold<minMoney) {
    		console.log(leo.logTime()+'身上魔币低于：'+minMoney)
    		return leo.reject();
    	}
    	const emptyIndexes = leo.getEmptyBagIndexes();
        if(emptyIndexes && emptyIndexes.length >= 2){
            if(cga.GetMapName()!='法兰城') {
		        await leo.goto(n => n.falan.e2)
		    }
		    await leo.autoWalk([228, 78])
		    var dir = 0;    //方向0-东2-南4-西6北
		    var buyItem = [
		        {index: 0,count:1},
		        {index: 1,count:1},
		    ];
		    await leo.buy(dir,buyItem)
		    await leo.delay(1000)
		    await leo.useItemEx('黄金哥布林专属钥匙')
		    count++;
		    await leo.log('已开箱子数量：' + count)
        }else{
        	console.log(leo.logTime()+'身上没有足够的位置了，先扔一会')
        	await doDrop()
        	return leo.delay(5000);
        }
        return leo.delay(1000);
    })

    await leo.log('脚本结束')
});