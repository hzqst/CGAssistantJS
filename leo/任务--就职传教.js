require('./common').then(async (cga) => {
	
	await leo.log('红叶の就职传教脚本，启动~')

	await leo.goto(n => n.castle.x)
	await leo.autoWalkList([
        [41, 14, '法兰城'],
        [154, 29, '大圣堂的入口'],
        [14, 7, '礼拜堂'],
        [23, 0,'大圣堂里面'],
		[15, 11]
    ])
	await leo.talkNpc(16, 11,leo.talkNpcSelectorYes)
	await leo.autoWalk([16, 9])
	await leo.turnTo(17, 9)
	await leo.talkNpc(0, (dialog) => {
		if(dialog && dialog.message && dialog.message.indexOf('我想就职') >= 0){
			cga.ClickNPCDialog(0, 0);
			return true;
		}
		return false;
	})
	await leo.autoWalk([13, 6])
	await leo.talkNpc(0,leo.talkNpcSelectorYes)
	await leo.autoWalk([13, 10])
	await leo.log('脚本结束')
	
});