require('./common').then(cga=>{
    leo.log('红叶の去哥拉尔城脚本，启动~');
    leo.goto(n=>n.grahl.c)
    .then(()=>leo.log('已经到达哥拉尔'));
});