require('./common').then(cga=>{
    //leo.baseInfoPrint();
    leo.log('红叶の烧骑乘脚本，启动~');

    var pos = [40, 85];
    var minMp = 100;

    var autoPetRiding = ()=>{
        var petriding = cga.GetPlayerInfo().petriding;
        if(!petriding){
            var skill = cga.GetSkillsInfo().find(s => s.name == '骑乘');
            if(skill && cga.GetPlayerInfo().mp >= minMp){
                cga.StartWork(skill.index, skill.lv-1);
            }
        }
        setTimeout(autoPetRiding, 1000);
    }

    var autoMove = ()=>{
        return leo.loop(()=>{
            var direction = Math.floor((Math.random()*8)); //返回0-7的整数
            if(cga.GetPlayerInfo().mp >= minMp){
                return move(direction).then(()=>move((direction + 4) % 8));
            }else{
                return leo.reject();
            }
        });
    }
    var move = (direction)=>{
        cga.ForceMove(direction, false);
        return leo.delay(leo.moveTimeout||300);
    }
    
    if(!cga.findPlayerSkill('骑乘')){
        console.error('提示：没有骑乘技能！');
    }else{
        autoPetRiding();
        cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //关闭队聊
        cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
        var currentMap = cga.GetMapName();
        
        leo.todo().then(()=>{
            if (currentMap != '里谢里雅堡') {
                return leo.goto(n => n.castle.x);
            }
        })
        .then(()=>leo.autoWalk([pos[0]+1,pos[1]]))
        .then(()=>leo.autoWalk(pos))
        .then(()=>{
            return leo.loop(
                ()=>leo.todo()
                .then(()=>{
                    if(cga.GetPlayerInfo().mp < minMp){
                        return leo.autoWalk([34, 89])
                        .then(()=>leo.supply(35, 88))
                        .then(()=>leo.autoWalk(pos));
                    }
                })
                .then(()=>autoMove())
                .then(()=>leo.delay(1000))
            );
        });
    }

    var i = 0;
    var autoTalk = ()=>{
        leo.say('红叶の烧骑乘脚本，说话防掉线',i);
        ++i > 4 ? (i = 0) : 0;
        setTimeout(autoTalk, 60000);
    }
    autoTalk();

    
});