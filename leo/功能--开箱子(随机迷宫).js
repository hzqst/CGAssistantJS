require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	leo.log('红叶の开箱子(随机迷宫)脚本，启动~');

    var count = 0;//开箱子数

    var targetFinder = (units) => {
        return units.find(u => {
    		return (u.flags & leo.UnitFlags.Item) 
    		&& 
    		( (u.item_name == '宝箱' && cga.getItemCount('铜钥匙')>0)  
    		|| (u.item_name == '黑色宝箱' && cga.getItemCount('黑钥匙')>0 )
    		|| (u.item_name == '白色宝箱' && cga.getItemCount('白钥匙')>0 )
    		)
    	});
    }

    var todo = (target) => {
        return leo.todo()
        .then(() => leo.turnTo(target.xpos, target.ypos))
        .then(() =>{
        	if(target.item_name == '黑色宝箱' && cga.getItemCount('黑钥匙')>0){
        		return leo.useItemEx('黑钥匙');
        	}else if(target.item_name == '白色宝箱' && cga.getItemCount('白钥匙')>0){
        		return leo.useItemEx('白钥匙');
        	}else if(target.item_name == '宝箱' && cga.getItemCount('铜钥匙')>0){
        		return leo.useItemEx('铜钥匙');
        	}else{
        		return leo.log('没有钥匙');
        	}
        })
        .then(() => leo.waitAfterBattle())
        .then(() => {
	    	count++;
	    	return leo.log('已开箱子数：【'+count+'】');
	    });
    }

    leo.loop(()=>{
		return leo.lookForNpc(targetFinder, todo);
	});

});