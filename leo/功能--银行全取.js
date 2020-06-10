require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.log('红叶の银行全取脚本，启动~');
	leo.todo(()=>leo.turnDir(0))
	.then(()=>leo.getFormBankAll())
	.then(()=>leo.log('已完成'));
});