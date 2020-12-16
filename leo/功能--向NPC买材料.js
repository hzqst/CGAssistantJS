require('./common').then(async (cga) => {
	leo.log('红叶の向NPC买材料脚本，启动~');

	var dir = 0;	//方向0-东2-南4-西6北

    var buyItem = [
    	{
    		index: 3,	//要购买的材料的序号，从0开始
    		count:20	//要购买的材料的数量
    	}
    ]; 	

    await leo.buy(dir,buyItem)
    await leo.log('已完成')
});