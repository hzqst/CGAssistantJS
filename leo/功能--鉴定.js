require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.log('红叶の自动鉴定背包脚本，启动~');

	leo.todo().then(()=>leo.assessAll())
	.then(()=>leo.log('已完成'));
	
});