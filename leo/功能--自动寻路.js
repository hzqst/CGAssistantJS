require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
    var position = '10,20';       //要去的坐标，例如 10,20 或者 10.20
    var des = false;                //是否要切图，true-切图，false-不切图

    var pos = position.split(/[,. ]/,2);
    if(pos.length<2){
        leo.log('坐标有误，请确认');
        return;
    }
    var desc = des?'切图':'不切图';

    leo.log('红叶の自动寻路脚本，目的坐标为：('+pos[0]+','+pos[1]+')，'+desc)
    .then(()=>leo.autoWalk([pos[0],pos[1],des?'*':undefined]))
    .then(()=>leo.log('已到达位置'));
	
});