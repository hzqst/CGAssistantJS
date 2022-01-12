require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    //leo.baseInfoPrint();
    leo.log('红叶の捉迷藏和接字游戏任务脚本，启动~');

    var task = async () => {
        await leo.logBack()
        await leo.checkHealth()
        //先去魔法大学
        await leo.goto(n => n.castle.teleport)
        await leo.autoWalk([37,4])
        await leo.talkNpc(0,leo.talkNpcSelectorYes)
        await leo.autoWalkList([
            [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
            [38, 71,'莎莲娜'],[118,100,'魔法大学']
        ])
        //侦探考试官处接任务
        await leo.autoWalk([74,93,'魔法大学内部'])
        await leo.autoWalk([4,30,'教师室'])
        await leo.talkNpcAt(22,3)   
        //棺木
        console.log(leo.logTime()+'(1/15)去找【棺木】')
        await leo.talkNpcAt(5,4)
        //木乃伊
        console.log(leo.logTime()+'(2/15)去找【木乃伊】')
        await leo.talkNpcAt(7,3)
        //医生
        console.log(leo.logTime()+'(3/15)去找【医生】')
        await leo.autoWalk([15,25,'魔法大学内部'])
        await leo.autoWalk([14,43,'调理室'])
        await leo.talkNpcAt(17,6)
        //生命之花
        console.log(leo.logTime()+'(4/15)去找【生命之花】')
        await leo.autoWalk([12,18,'魔法大学内部'])
        await leo.talkNpcAt(43,14)
        //花生油
        console.log(leo.logTime()+'(5/15)去找【花生油】')
        await leo.autoWalk([40,59,'魔法大学'])
        await leo.talkNpcAt(66,89)
        //犹大
        console.log(leo.logTime()+'(6/15)去找【犹大】')
        await leo.talkNpcAt(106,158)
        //大地鼠
        console.log(leo.logTime()+'(7/15)去找【大地鼠】')
        await leo.talkNpcAt(102,56)
        //鼠王
        console.log(leo.logTime()+'(8/15)去找【鼠王】')
        await leo.autoWalk([74,93,'魔法大学内部'])
        await leo.talkNpcAt(35,44)
        //王冠
        console.log(leo.logTime()+'(9/15)去找【王冠】')
        await leo.autoWalk([40,59,'魔法大学'])
        await leo.autoWalk([117,156,'仓库内部'])
        await leo.talkNpcAt(16,8)
        //冠军之戒
        console.log(leo.logTime()+'(10/15)去找【冠军之戒】')
        await leo.autoWalk([6,14,'魔法大学'])
        await leo.autoWalk([116,132])
        await leo.autoWalk([117,132,'仓库内部'])
        await leo.talkNpcAt(14,9)
        //芥末
        console.log(leo.logTime()+'(11/15)去找【芥末】')
        await leo.autoWalk([6,14,'魔法大学'])
        await leo.talkNpcAt(46,155)
        //茉莉花茶
        console.log(leo.logTime()+'(12/15)去找【茉莉花茶】')
        await leo.autoWalk([74,93,'魔法大学内部'])
        await leo.autoWalk([44,17,'礼堂'])
        await leo.autoWalk([4,10,'学长室'])
        await leo.talkNpcAt(15,12)
        //茶壶
        console.log(leo.logTime()+'(13/15)去找【茶壶】')
        await leo.autoWalk([17,5,'礼堂'])
        await leo.autoWalk([24,10,'保健室'])
        await leo.talkNpcAt(12,8)
        //狐仙
        console.log(leo.logTime()+'(14/15)去找【狐仙】')
        await leo.autoWalk([3,5,'礼堂'])
        await leo.autoWalk([14,32,'魔法大学内部'])
        await leo.autoWalk([50,43,'技术室'])
        await leo.talkNpcAt(6,8)
        //仙人考试官
        console.log(leo.logTime()+'(15/15)去找【仙人考试官】')
        await leo.autoWalk([7,18,'魔法大学内部'])
        await leo.autoWalk([4,30,'教师室'])
        await leo.talkNpcAt(21,3)

        await leo.log('红叶の捉迷藏和接字游戏任务完成')
        await leo.log('恭喜！！！可以去晋级了')
    }

    task();
    
});