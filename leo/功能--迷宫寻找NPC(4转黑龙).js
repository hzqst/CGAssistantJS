require('./common').then(cga=>{
	//leo.baseInfoPrint();
    var npcName = '暗黑龙';   //要寻找的NPC名字，请确保名字无误

    //是-找到NPC后自动对话选是；否-找到NPC后自动对话选否；留空则不对话
    var autoTalk = '';

    //对话完是否要走到下一层迷宫
    var autoNextLevel = false;

    if(npcName==''){
        leo.log('NPC的名字不能为空，请确认');
        return;
    }

	leo.log('红叶の迷宫寻找NPC(4转黑龙)脚本，启动~');
    var content = '要寻找的NPC是【'+npcName+'】';
    if(autoTalk=='是'||autoTalk=='否'){
        content += '，找到后自动对话选【' + autoTalk + '】';
    }
    leo.log(content);

    var targetFinder = (units) => {
        return units.find(u => u.unit_name == npcName && u.type == 1 
            && (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0);
    }

    var todo = (target) => {
        return leo.todo()
        .then(() => {
            if(autoTalk=='是'){
                return leo.talkNpc(target.xpos, target.ypos, leo.talkNpcSelectorYes);
            }else if(autoTalk=='否'){
                return leo.talkNpc(target.xpos, target.ypos, leo.talkNpcSelectorNo);
            }else{
                return leo.next();
            }
        })
        .then(() => {
            if(autoNextLevel && (autoTalk == '是' || autoTalk == '否')){
                return leo.autoWalk([target.entry.x, target.entry.y, '*'],undefined,undefined,{compress: false});
            }else{
                return leo.next();
            }
        })
        .then(() => console.log('已找到NPC，脚本结束'));
    }

    leo.findOne(targetFinder, todo, true)
    .catch(()=>console.log('未找到NPC，脚本结束'));

});