require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.log('红叶の银行全存脚本，启动~');
	leo.todo(()=>leo.turnDir(0))
	.then(()=>leo.saveToBankAll())
	.then(()=>leo.log('已完成'));
});