require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	var autoSupply = true; //true-自动城堡补蓝，false-原地鉴定，没蓝不去补给
	var minMp = 200;
	await leo.log('红叶の自动鉴定背包脚本，启动~');

	await leo.loop(async ()=>{
		if(cga.GetPlayerInfo().mp < minMp){
			if(autoSupply){
				var mapName = cga.GetMapName();
				await leo.logBack()
				await leo.supplyCastle()
				if(mapName=='艾尔莎岛'){
					await leo.logBack()
					await leo.autoWalk([138,109])
				}else if(mapName=='银行'){
					await leo.goto(n => n.falan.bank)
				}else{
					await leo.autoWalk([32,91])
				}
			}
		}
		if(cga.getInventoryItems().find(i=>!i.assessed)){
			await leo.assessAll()
		}else{
			return leo.reject();
		}
		await leo.delay(2000)
	})
	await leo.log('红叶の自动鉴定背包脚本，已完成')
	
});