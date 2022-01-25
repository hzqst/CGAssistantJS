require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    const autoLearnEgg2 = true;
    const index = 1; //出战宠物待学蛋2的技能栏序号，从1开始
    //！！！注意，会覆盖掉宠物该位置的原有技能，一定要注意，无法还原

    const messageMonitor = () => {
        console.log(leo.logTime()+'已开启消息监听')
        return leo.waitMessageUntil((chat) => {
            if (chat.msg) {
                console.log(leo.logTime()+'检测到聊天内容：'+chat.msg);
            }
        })
    }

    const petSkillIndex = index - 1;
    const skillIndex = 8;
    const petIndex = cga.GetPlayerInfo().petid;

    if(autoLearnEgg2 && petIndex != -1){
        const petInfo = cga.GetPetInfo(petIndex);
        //console.log(petInfo);
        if(leo.has(450769) && petInfo.race == 0 && petInfo.level >= 40){ 
            //450769 - 蛋2券
            //race 种族，0=人形系，1=龙系，2=不死系，3=飞行系，4=昆虫系，5=植物系，6=野兽系，7=特殊系，8=金属系，9=邪魔系
            await leo.log('为宠物【'+petInfo.realname+'】学习技能【蛋2】')
            if(cga.GetMapName()!='魔力宝贝服务中心'){
                await leo.goto(n=>n.falan.e2)
                await leo.autoWalk([241,78])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='魔力宝贝服务中心'){
                        return leo.reject();
                    }
                    await leo.turnDir(6)
                    await leo.delay(2000)
                })
            }
            
            messageMonitor();

            let egg2Count = cga.getItemCount(450769);
            await leo.loop(async ()=>{
                await leo.autoWalk([19, 8])
                await leo.learnPetSkill([20, 8], skillIndex, petIndex, petSkillIndex)
                await leo.delay(2000)
                if(!leo.has(450769) || cga.getItemCount(450769) < egg2Count) {
                    return leo.reject();
                }
            })
            await leo.delay(5000)
            console.log(leo.logTime()+'宠物【'+petInfo.realname+'】已学到蛋2技能')
        }else{
            console.log(leo.logTime()+'宠物等级不到40，或者不是人形系，或者没有蛋2技能券')
        }
    }
    console.log(leo.logTime()+'脚本结束')
});