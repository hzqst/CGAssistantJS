require('./common').then(cga=>{
	//leo.baseInfoPrint();
	leo.log('红叶の前往驯兽晋级地点脚本，启动~');
	leo.todo().then(()=>leo.goto(n => n.falan.w1))
	.then(()=>leo.autoWalkList([[73, 60,'职业公会'] , [13 , 10]]))
	.then(()=>leo.turnDir(6))
	.then(()=>leo.log('已到达'));
});