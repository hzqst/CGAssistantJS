require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
	leo.log('红叶の森罗万象(自动拿4乐谱)脚本，需要在充满谜的房间启动，身上没有该属性的乐谱~');

	if (leo.isInTeam()) {
    	leo.leaveTeam();
    }

	var mapInfo = cga.getMapInfo();
	if (mapInfo.name == '充满谜的房间') {
		leo.autoWalk([7,3])
		.then(()=>leo.talkNpc(7,2, (dialog) => {
			if(dialog && dialog.message && dialog.message.indexOf('要把乐谱带走吗') >= 0){
				cga.ClickNPCDialog(4, -1);
				cga.ClickNPCDialog(4, -1);
				cga.ClickNPCDialog(4, -1);
				cga.ClickNPCDialog(4, -1);
				return false;
			}
			return false;
		}))
		.then(()=>leo.log('已拿到炎之乐谱*4'));
	}else{
		leo.log('不在充满谜的房间，无法继续，脚本结束');
	}

});