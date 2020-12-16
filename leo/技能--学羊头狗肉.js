require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.log('红叶の学羊头狗肉技能脚本，启动~');
	if(cga.getItemCount('烧鸡')==0){
        leo.log('身上没有【烧鸡】，请先提前准备，脚本结束');
        return;
    }

	var task = async () => {
        await leo.checkHealth()
        await leo.autoWalk([165,153])
        await leo.talkNpc(2,leo.talkNpcSelectorYes,'利夏岛')
        await leo.autoWalk([90,99,'国民会馆'])
        await leo.autoWalkList([
			[108,39,'雪拉威森塔１层'],[73,56],
			[72,56,'雪拉威森塔４０层'],
			[117,96,'雪拉威森塔４１层'],
			[108,101,'雪拉威森塔４２层']
		])
        await leo.talkNpcAt(79,92)
        await leo.autoWalkList([
			[92,23,'雪拉威森塔４３层']
		])
        await leo.talkNpcAt(89,42)
        await leo.talkNpcAt(117,49)
        await leo.talkNpcAt(117,49)
        await leo.autoWalk([132,58])

        console.log('到达目标地点！请自行手动学习技能~~')
    }

    task();


});