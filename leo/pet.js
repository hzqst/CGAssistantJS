const version = '3.0';
const doctorName = ['医道之殇','⌒雪医师∨'];
const globalTeamPlayerCount = 5;
const globalMinTeamNumber = 3;
const globalTeamLeaders = ['猎人仓库C','Bonn打猎师'];
const petConfig = {
    '水龙蜥': {
        name: '水龙蜥',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 128 - 3,
        minMp: 76 - 3 ,
        minAttack: 46,
        minDefensive: 46,
        minAgility: 29,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚海底洞窟 地下2楼') {
                await leo.autoWalkList([[49, 6],[49, 8]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.vinoy)
                await leo.autoWalkList([
                    [67, 46, '芙蕾雅'],
                    [343, 497, '索奇亚海底洞窟 地下1楼'],
                    [18, 34, '索奇亚海底洞窟 地下2楼'],
                    [49, 8]
                ])
            }
        }
    },
    '风龙蜥': {
        name: '风龙蜥',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 123 - 3,
        minMp: 82 - 3,
        minAttack: 44,
        minDefensive: 44,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[147, 523],[145, 523]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [24, 40, '莎莲娜'],
                    [145, 523]
                ])
            }
        }
    },
    '地龙蜥': {
        name: '地龙蜥',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 117 - 3,
        minMp: 81 - 3 ,
        minAttack: 44,
        minDefensive: 46,
        minAgility: 30,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '鲶鱼洞窟  地下3楼') {
                await leo.autoWalkList([[22, 37],[20, 37]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [48, 77, '索奇亚'],
                    [626, 209, '鲶鱼洞窟  地下1楼'],
                    [9, 23, '鲶鱼洞窟  地下2楼'],
                    [40, 32, '鲶鱼洞窟  地下3楼'],
                    [20, 37]
                ])
            }
        }
    },
    '黄蜂': {
        name: '黄蜂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 93 - 3,
        minMp: 78 - 3,
        minAttack: 45,
        minDefensive: 34,
        minAgility: 40,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[670, 310],[668, 310]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.yer)
                await leo.autoWalkList([
                    [45, 31, '芙蕾雅'],
                    [668, 310]
                ])
            }
        }
    },
    '死亡蜂': {
        name: '死亡蜂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 88 - 3,
        minMp: 82 - 3,
        minAttack: 46,
        minDefensive: 36,
        minAgility: 39,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[286, 372],[284, 372]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 18, '莎莲娜'],
                    [284, 372]
                ])
            }
        }
    },
    '异型蜂': {
        name: '异型蜂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 93 - 3,
        minMp: 93 - 3,
        minAttack: 43,
        minDefensive: 33,
        minAgility: 37,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[430, 400],[428, 400]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.vinoy)
                await leo.autoWalkList([
                    [67, 46, '芙蕾雅'],
                    [428, 400]
                ])
            }
        }
    },
    '螳螂': {
        name: '螳螂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 101 - 3,
        minMp: 89 - 3,
        minAttack: 49,
        minDefensive: 40,
        minAgility: 35,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[290, 216],[292, 214]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.kili)
                await leo.autoWalkList([
                    [60, 45, '索奇亚'],
                    [292, 214]
                ])
            }
        }
    },
    '致命螳螂': {
        name: '致命螳螂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 105 - 3,
        minMp: 88 - 3,
        minAttack: 49,
        minDefensive: 37,
        minAgility: 35,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            if (cga.getMapInfo().indexes.index3 == 21025) {
                await leo.autoWalkList([[44, 5],[44, 4]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.sout)
                await leo.autoWalk([409, 294])
                await leo.talkNpc(2,leo.talkYes)
                await leo.delay(2000)
                await leo.autoWalkList([
                    [46,23,'忍者的隐居地'],[19,9,'忍者之家'],
                    [24,32],[22,16],[14,21],[13,20]
                ])
                await leo.talkNpc(6,leo.talkYes,'忍者之家2楼')
                await leo.autoWalkList([
                    [15,29],[21,28],[32,12],[38,18],[37,19,'忍者之家'],
                    [39,21],[44,33],[49,38],[63,38]
                ])
                await leo.talkNpc(0,leo.talkYes,'井的底部')
                await leo.autoWalkList([
                    [7,4,'通路'],[33,3,21025],[44,4]
                ])
            }
        }
    },
    '赤目螳螂': {
        name: '赤目螳螂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 94 - 3,
        minAttack: 49,
        minDefensive: 38,
        minAgility: 35,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '角笛大风穴') {
                await leo.autoWalkList([[127, 31],[127, 29]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.kili)
                await leo.autoWalkList([
                    [60, 45, '索奇亚'],
                    [356, 334, '角笛大风穴'],
                    [127, 29]
                ])
            }
        }
    },
    '死灰螳螂': {
        name: '死灰螳螂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 99 - 3,
        minMp: 95 - 3,
        minAttack: 47,
        minDefensive: 37,
        minAgility: 37,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[460, 330],[457, 329]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 18, '莎莲娜'],
                    [457, 329]
                ])
            }
        }
    },
    '杀人螳螂': {
        name: '杀人螳螂',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 95 - 3,
        minMp: 99 - 3,
        minAttack: 49,
        minDefensive: 39,
        minAgility: 34,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地') {
                await leo.autoWalkList([[248, 136],[248, 134]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([248, 134])
            }
        }
    },
    '穴熊': {
        name: '穴熊',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 120 - 3,
        minMp: 90 - 3,
        minAttack: 44,
        minDefensive: 37,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '维诺亚洞穴 地下1楼') {

            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.sout)
                await leo.autoWalk([473,316])
                await leo.talkNpc(4,leo.talkYes)
                await leo.moveAround()
            }
        }
    },
    '北极熊': {
        name: '北极熊',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 122 - 3,
        minMp: 87 - 3,
        minAttack: 44,
        minDefensive: 40,
        minAgility: 30,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[257, 180],[255, 180]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [38, 71,'莎莲娜'],[255, 180]
                ])
            }
        }
    },
    '赤熊': {
        name: '赤熊',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 120 - 5,
        minMp: 89 - 5,
        minAttack: 44,
        minDefensive: 35,
        minAgility: 32,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地') {
                await leo.autoWalkList([[184, 104],[182, 104]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([182, 104])
            }
        }
    },
    '大地鼠': {
        name: '大地鼠',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 76 - 3,
        minMp: 121 - 3,
        minAttack: 32,
        minDefensive: 37,
        minAgility: 33,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[237,203],[235,203]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.wout)
                await leo.autoWalkList([
                    [235,203]
                ])
            }
        }
    },
    '火焰鼠': {
        name: '火焰鼠',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 78 - 3,
        minMp: 116 - 3,
        minAttack: 32,
        minDefensive: 34,
        minAgility: 36,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[237,326],[235,326]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.kili)
                await leo.autoWalkList([
                    [60, 45, '索奇亚'],
                    [235,326]
                ])
            }
        }
    },
    '宝石鼠': {
        name: '宝石鼠',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 77 - 3,
        minMp: 124 - 3,
        minAttack: 29,
        minDefensive: 38,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //判断身上是否有【咒器·红念珠】
            if(cga.getItemCount('咒器·红念珠') == 0){
                await leo.log('没有【咒器·红念珠】，先去咒术师的秘密住处拿取')
                await leo.goto(n => n.falan.w1)
                await leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]])
                await leo.talkNpc(201, 165,leo.talkYes,'莎莲娜海底洞窟 地下1楼')
                await leo.autoWalkList([[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]])
                await leo.turnTo(31, 22)
                await leo.say('咒术')
                await leo.waitNPCDialog(dialog => {
                    cga.ClickNPCDialog(1, -1);
                    return leo.delay(2000);
                })
                await leo.autoWalkList([[38, 37 ,'咒术师的秘密住处'],[12, 7]])
                await leo.talkNpc(14,7,leo.talkYes)
                if(cga.getItemCount('咒器·红念珠') == 0){
                    await leo.log('无法拿到【咒器·红念珠】，请检查')
                    await leo.delay(1000*60*60*24)
                    return leo.reject();
                }
            }
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '镜中的豪宅') {
                await leo.autoWalkList([[22,8],[24,8]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.w2)
                await leo.autoWalkList([
                    [96, 149, '豪宅'],
                    [33, 22, '豪宅  地下'],
                    [9, 5, '豪宅'],
                    [33, 10, '镜中的豪宅'],
                    [35, 2]
                ])
                await leo.talkNpc(35,1,leo.talkYes)
                await leo.autoWalkList([[36,9]])
                await leo.talkNpc(36,10,leo.talkYes)
                await leo.autoWalkList([
                    [27, 67, '豪宅'],
                    [58, 66, '豪宅  地下'],
                    [41, 23, '豪宅'],
                    [59, 6, '豪宅  2楼'],
                    [16, 9, '镜中的豪宅  2楼'],
                    [40, 10]
                ])
                await leo.talkNpc(41,10,leo.talkYes)
                await leo.autoWalkList([[40,16]])
                await leo.talkNpc(40,17,leo.talkYes)
                await leo.autoWalkList([
                    [6, 5, '镜中的豪宅'],
                    [24, 8]
                ])
            }
        }
    },
    '小石像怪': {
        name: '小石像怪',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 91 - 3,
        minMp: 107 - 3,
        minAttack: 37,
        minDefensive: 33,
        minAgility: 35,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '灵堂') {
                await leo.autoWalkList([[30,51],[30,49]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.x)
                await leo.autoWalkList([
                    [47,85,'召唤之间'],[27,8,'回廊'],[23,19,'灵堂'],[30,49]
                ])
            }
        }
    },
    '水蓝鸟魔': {
        name: '水蓝鸟魔',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 104 - 3,
        minAttack: 37,
        minDefensive: 32,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //判断身上是否有【咒器·红念珠】
            if(cga.getItemCount('咒器·红念珠') == 0){
                await leo.log('没有【咒器·红念珠】，先去咒术师的秘密住处拿取')
                await leo.goto(n => n.falan.w1)
                await leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]])
                await leo.talkNpc(201, 165,leo.talkYes,'莎莲娜海底洞窟 地下1楼')
                await leo.autoWalkList([[20, 8 ,'莎莲娜海底洞窟 地下2楼'],[32, 21]])
                await leo.turnTo(31, 22)
                await leo.say('咒术')
                await leo.waitNPCDialog(dialog => {
                    cga.ClickNPCDialog(1, -1);
                    return leo.delay(2000);
                })
                await leo.autoWalkList([[38, 37 ,'咒术师的秘密住处'],[12, 7]])
                await leo.talkNpc(14,7,leo.talkYes)
                if(cga.getItemCount('咒器·红念珠') == 0){
                    await leo.log('无法拿到【咒器·红念珠】，请检查')
                    await leo.delay(1000*60*60*24)
                    return leo.reject();
                }
            }
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '镜中的豪宅  2楼') {
                await leo.autoWalkList([[42,25],[40,25]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.w2)
                await leo.autoWalkList([
                    [96, 149, '豪宅'],
                    [33, 22, '豪宅  地下'],
                    [9, 5, '豪宅'],
                    [33, 10, '镜中的豪宅'],
                    [35, 2]
                ])
                await leo.talkNpc(35,1,leo.talkYes)
                await leo.autoWalkList([[36,9]])
                await leo.talkNpc(36,10,leo.talkYes)
                await leo.autoWalkList([
                    [27, 67, '豪宅'],
                    [58, 66, '豪宅  地下'],
                    [41, 23, '豪宅'],
                    [59, 6, '豪宅  2楼'],
                    [16, 9, '镜中的豪宅  2楼'],
                    [40, 10]
                ])
                await leo.talkNpc(41,10,leo.talkYes)
                await leo.autoWalkList([[40,16]])
                await leo.talkNpc(40,17,leo.talkYes)
                await leo.autoWalkList([
                    [5, 63, '豪宅  2楼'],
                    [5, 23, '豪宅  阁楼'],
                    [14,30, '镜中的豪宅  阁楼'],
                    [28,21, '镜中的豪宅  2楼'],[40,25]
                ])
            }
        }
    },
    '迷你石像怪': {
        name: '迷你石像怪',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 110 - 3,
        minAttack: 35,
        minDefensive: 32,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
    },
    '大地翼龙': {
        name: '大地翼龙',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 117 - 3,
        minMp: 86 - 3,
        minAttack: 41,
        minDefensive: 45,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '诅咒的迷宫 地下7楼') {
                await leo.autoWalkList([[18,20],[16,20]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='阿巴尼斯村的传送点'){
                        return leo.reject();
                    }else{
                        await leo.talkNpc(0,leo.talkYes)
                    }
                    await leo.delay(2000)
                })
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村']
                ])
                if(!leo.has('刀刃的碎片')){
                    await leo.autoWalk([40, 30, '民家'])
                    await leo.autoWalk([13, 10])
                    await leo.loop(async ()=>{
                        if(!leo.has('野草莓')){
                            await leo.talkNpc(14, 10,leo.talkYes)
                        }else{
                            return leo.reject();
                        }
                        await leo.delay(1000)
                    })
                    console.log(leo.logTime()+'拿到了【野草莓】');
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3 == 4331){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(9, 4)
                        }
                        await leo.delay(2000)
                    })
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3 == 4332){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(15, 7)
                        }
                        await leo.delay(2000)
                    })
                    await leo.loop(async ()=>{
                        if(leo.has('刀刃的碎片')){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(15, 7)
                        }
                        await leo.delay(2000)
                    })
                    console.log(leo.logTime()+'拿到了【刀刃的碎片】');
                    await leo.autoWalkList([
                        [5, 3, 4333], [9, 4, 4334]
                    ])
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3 == 4335){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(15, 10)
                        }
                        await leo.delay(2000)
                    })
                    await leo.autoWalkList([
                        [7, 3, 4320],[12, 17, '阿巴尼斯村'],[37,71,'莎莲娜'],[54,162]
                    ])
                }
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='诅咒的迷宫'){
                        return leo.reject();
                    }else{
                        await leo.talkNpc(54, 161, leo.talkYes)
                    }
                    await leo.delay(2000)
                })
                await leo.autoWalkList([
                    [35,9,'诅咒的迷宫 地下1楼'],[25,13,'诅咒的迷宫 地下2楼'],
                    [17,4,'诅咒的迷宫 地下3楼'],[23,20,'诅咒的迷宫 地下4楼'],
                    [16,10,'诅咒的迷宫 地下5楼'],[6,3,'诅咒的迷宫 地下6楼'],
                    [15,3,'诅咒的迷宫 地下7楼'],
                    [16,20]
                ])
            }
        }
    },
    '寒冰翼龙': {
        name: '寒冰翼龙',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 3,
        minMp: 88 - 3,
        minAttack: 42,
        minDefensive: 44,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '青龙的洞窟 4楼') {
                await leo.autoWalkList([[11, 25],[11, 23]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [38, 71,'莎莲娜'],[118, 100 ,'魔法大学'],[106, 54, '青龙的洞窟 1楼'],
                    [27,38]
                ])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [26, 10, '青龙的洞窟 2楼'],[21, 45, '青龙的洞窟 3楼'],[45, 43, '青龙的洞窟 4楼'],[11, 23]
                ])
            }
        }
    },
    '烈风翼龙': {
        name: '烈风翼龙',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 3,
        minMp: 92 - 3,
        minAttack: 42,
        minDefensive: 40,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '星咏宫殿·地下１层') {
                await leo.autoWalkList([[97, 91],[98, 91]])
            } else {
                //检查进“星咏的宫殿”的任务道具
                if(cga.getItemCount('王冠')==0){
                    await leo.log('身上没有【王冠】，去银行获取')
                    await leo.goto(n => n.falan.bank)
                    await leo.turnDir(0)
                    await leo.getOneFromBank('王冠')
                    if(cga.getItemCount('王冠')==0){
                        await leo.log('身上和银行都没有【王冠】，脚本结束')
                        return leo.delay(1000*60*60*2);
                    }
                }
                if(cga.getItemCount('王冠')>1){
                    await leo.log('身上的【王冠】只能带1个，多余的请先存银行，脚本结束')
                    return leo.delay(1000*60*60*2);
                }
                if(cga.getItemCount('青之证明')==0){
                    await leo.log('身上没有【青之证明】，去银行获取')
                    await leo.goto(n => n.falan.bank)
                    await leo.turnDir(0)
                    await leo.getOneFromBank('青之证明')
                    if(cga.getItemCount('青之证明')==0){
                        await leo.log('身上和银行都没有【青之证明】，脚本结束')
                        return leo.delay(1000*60*60*2);
                    }
                }
                if(cga.getItemCount('赤之证明')==0){
                    await leo.log('身上没有【赤之证明】，去银行获取')
                    await leo.goto(n => n.falan.bank)
                    await leo.turnDir(0)
                    await leo.getOneFromBank('赤之证明')
                    if(cga.getItemCount('赤之证明')==0){
                        await leo.log('身上和银行都没有【赤之证明】，脚本结束')
                        return leo.delay(1000*60*60*2);
                    }
                }

                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalk([34,95])
                await leo.talkNpc(0,leo.talkYes,'辛梅尔')
                await leo.autoWalk([207,91,'光之路'])
                await leo.autoWalk([161,118])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [98,59,'星咏宫殿·地下４层'],[98,87,'星咏宫殿·地下３层'],
                    [90,69,'星咏宫殿·地下２层'],[97,98,'星咏宫殿·地下１层'],
                    [98, 91]
                ])
            }
        }
    },
    '地狱猎犬': {
        name: '地狱猎犬',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 106 - 3,
        minMp: 91 - 3,
        minAttack: 44,
        minDefensive: 37,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '诅咒的迷宫 地下4楼') {
                await leo.autoWalkList([[15,11],[13,11]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [40, 30,'民家'],[13, 11]
                ])
                await leo.talkNpc(7,leo.talkYes)
                await leo.autoWalk([9,5])
                await leo.talkNpc(6,leo.talkYes)
                await leo.autoWalk([14,7])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalk([14,7])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalk([5,3,4333])
                await leo.autoWalk([9,5])
                await leo.autoWalk([9,4,4334])
                await leo.autoWalk([14,10])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalk([7,3,4320])
                await leo.autoWalkList([
                    [11,17,'阿巴尼斯村'],[37,71,'莎莲娜'],[54,162]
                ])
                await leo.turnDir(6)
                await leo.autoWalkList([
                    [35,9,'诅咒的迷宫 地下1楼'],[25,13,'诅咒的迷宫 地下2楼'],
                    [17,4,'诅咒的迷宫 地下3楼'],[23,20,'诅咒的迷宫 地下4楼'],
                    [13,11]
                ])
            }
        }
    },
    '地狱妖犬': {
        name: '地狱妖犬',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 97 - 3,
        minAttack: 46,
        minDefensive: 34,
        minAgility: 32,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[117, 324],[119, 320]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [24, 40, '莎莲娜'],
                    [119, 320]
                ])
            }
        }
    },
    '巨狼': {
        name: '巨狼',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 102 - 3,
        minMp: 100 - 3,
        minAttack: 45,
        minDefensive: 33,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪拉威森塔７７层') {
                await leo.autoWalkList([[89, 26]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [24,44,'雪拉威森塔７５层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [133,133],[133,140],[120,140],[120,149],[109,149],
                    [109,157],[91,157],[91,151],[91,150,'雪拉威森塔７６层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [93,148],[116,148],[116,132],[140,132],[140,125],
                    [122,125],[121,125,'雪拉威森塔７５层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106,125]
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106,52],[104,52],[104,19],[93,19],[93,18,'雪拉威森塔７６层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [95,17],[95,16,'雪拉威森塔７７层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([[89, 26]])
            }
        }
    },
    '恶魔猫': {
        name: '恶魔猫',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 99 - 3,
        minAttack: 37,
        minDefensive: 33,
        minAgility: 34,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜西方洞窟') {
                await leo.autoWalkList([[13, 15],[15, 15]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [24, 40, '莎莲娜'],
                    [235,338,'莎莲娜西方洞窟'],
                    [15,15]
                ])
            }
        }
    },
    '罗刹': {
        name: '罗刹',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 99 - 3,
        minAttack: 37,
        minDefensive: 33,
        minAgility: 34,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '诅咒的迷宫 地下13楼') {
                await leo.autoWalkList([[23,5],[25,5]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [40, 30,'民家'],[13, 11]
                ])
                await leo.talkNpc(7,leo.talkYes)
                await leo.autoWalk([9,5])
                await leo.talkNpc(6,leo.talkYes)
                await leo.autoWalk([14,7])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalk([14,7])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalk([5,3,4333])
                await leo.autoWalk([9,5])
                await leo.autoWalk([9,4,4334])
                await leo.autoWalk([14,10])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalk([7,3,4320])
                await leo.autoWalkList([
                    [11,17,'阿巴尼斯村'],[37,71,'莎莲娜'],[54,162]
                ])
                await leo.turnDir(6)
                await leo.autoWalkList([
                    [35,9,'诅咒的迷宫 地下1楼'],[25,13,'诅咒的迷宫 地下2楼'],
                    [17,4,'诅咒的迷宫 地下3楼'],[23,20,'诅咒的迷宫 地下4楼'],
                    [16,10,'诅咒的迷宫 地下5楼'],[6,3,'诅咒的迷宫 地下6楼'],
                    [15,3,'诅咒的迷宫 地下7楼'],[25,18,'诅咒的迷宫 地下8楼'],
                    [14,18,'诅咒的迷宫 地下9楼'],[24,4,'第一个难关'],
                    [22,15]
                ])
                await leo.talkNpc(22, 14,leo.talkYes,'诅咒的迷宫 地下11楼')
                await leo.autoWalkList([
                    [15,4,'诅咒的迷宫 地下12楼'],[24,15,'诅咒的迷宫 地下13楼'],
                    [25,5]
                ])
            }
        }
    },
    '妖狐': {
        name: '妖狐',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 94 - 5,
        minMp: 108 - 5,
        minAttack: 41,
        minDefensive: 33,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
    },
    '猫人': {
        name: '猫人',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 101 - 3,
        minMp: 86 - 3,
        minAttack: 40,
        minDefensive: 35,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜东方洞窟 地下2楼') {
                await leo.autoWalkList([[14, 16],[12, 16]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [527, 209]
                ])
                await leo.talkNpc(0,leo.talkYes,'莎莲娜东方洞窟 地下1楼')
                await leo.autoWalkList([
                    [18,5,'莎莲娜东方洞窟 地下2楼'],[12,16]
                ])
            }
        }
    },
    '哥布林': {
        name: '哥布林',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 108 - 3,
        minMp: 74 - 3,
        minAttack: 40,
        minDefensive: 41,
        minAgility: 30,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[484, 170],[482, 170]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.eout)
                await leo.autoWalkList([
                    [482, 170]
                ])
            }
        }
    },
    '红帽哥布林': {
        name: '红帽哥布林',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 106 - 3,
        minMp: 73 - 3,
        minAttack: 41,
        minDefensive: 43,
        minAgility: 31,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        autoBattle: [{
            user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬'),
            type: '攻击',
            targets: context => [context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬').pos]
        },{
            user: 2, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬'),
            skillName: '攻击',
            targets: context => [context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬').pos]
        }],
        async walk(cga,protect){
            const leo = cga.emogua;
            const targetFinder = (units) => {
                return units.find(u => u.unit_name == '冒险者金德其' && u.type == 1 
            && (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0);
            }
            const todo = async (target) => {
                const positions = leo.getMovablePositionsAround({x: target.xpos, y: target.ypos});
                await leo.autoWalk([positions[0].x, positions[0].y],undefined,undefined,{compress: false})
                await leo.loop(async ()=>{
                    if(leo.has('牛鬼杀')){
                        console.log(leo.logTime()+'拿到了牛鬼杀');
                        return leo.reject();
                    }
                    if(leo.has('酒？')){
                        console.log(leo.logTime()+'拿到了酒？');
                        return leo.reject();
                    }
                    await leo.talkNpc(target.xpos, target.ypos, leo.talkYes)
                })
            }
            await leo.loop(async ()=>{
                if(leo.checkStopEncounter(protect)){
                    console.log(leo.logTime() + "触发回补");
                    await leo.logBack()
                    return leo.reject();
                }
                try{
                    if(['艾尔莎岛','里谢里雅堡','法兰城','银行','达美姊妹的店'].includes(cga.GetMapName())){
                        await leo.goto(n => n.falan.eout)
                    }
                    if(cga.GetMapName() == '芙蕾雅'){
                        await leo.autoWalk([665,184,'*']);
                    }
                    if(cga.GetMapName() == '牛鬼的洞穴'){
                        await leo.autoWalk([16,10,'*']);
                    }
                    if(cga.GetMapName() == '洞窟'){
                        await leo.log('现在是白天，进不了牛鬼的洞穴，等待3分钟')
                        await leo.delay(180000)
                        await leo.autoWalk([16,19,'芙蕾雅'])
                        await leo.delay(5000)
                    }
                    if(cga.GetMapName().includes('牛鬼的洞窟')){
                        if(leo.has('牛鬼杀') || leo.has('酒？')){
                            console.log(leo.logTime()+'已有【牛鬼杀】或者【酒？】，直接走迷宫');
                            await leo.walkRandomMazeUntil(() => {
                                var mapInfo = leo.getMapInfo();
                                if (mapInfo.indexes.index3 == 11019) {
                                    return true;
                                }
                                return false;
                            },false)
                        }else{
                            console.log('开始找冒险者金德其');
                            await leo.lookForNpc(targetFinder, todo, true);
                        }
                    }
                    let mapInfo = cga.getMapInfo();
                    if(mapInfo.indexes.index3 == 11019 && mapInfo.y >= 32){
                        await leo.autoWalk([25,34])
                        await leo.talkNpc(25,33,leo.talkYes)
                        await leo.delay(1000)
                        await leo.waitAfterBattle()
                        mapInfo = cga.getMapInfo();
                    }
                    if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 32 & mapInfo.y > 14)){
                        await leo.autoWalkList([[27,16],[27,15]])
                        return leo.reject();
                    }
                    if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 14)){
                        await leo.autoWalkList([[27,12],[27,13]])
                        return leo.reject();
                    }
                }catch(e){
                    console.log(leo.logTime()+'出错，可能是迷宫刷新：'+e);
                    if(cga.GetMapName() != '牛鬼的洞穴'){
                        await leo.logBack()
                    }
                    await leo.delay(1000*5)
                }
                await leo.delay(500)
            })
            console.log(leo.logTime()+'到达位置，开始抓宠，请注意是否开启了自动扔宠物。')
            await leo.loop(async ()=> {
                if(leo.checkStopEncounter(protect)){
                    console.log(leo.logTime() + "触发回补");
                    await leo.logBack()
                    return leo.reject();
                }
                await leo.waitAfterBattle()
                await leo.turnTo(27,14)
                await leo.delay(2000)
                await leo.waitAfterBattle()
                let mapInfo = cga.getMapInfo();
                if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 13)){
                    await leo.autoWalkList([[27,12],[27,13]])
                }
                if(mapInfo.indexes.index3 == 11019 && (mapInfo.y > 15)){
                    await leo.autoWalkList([[27,16],[27,15]])
                }
                protect.checker();
                await leo.delay(1000)
            })
        }
    },
    '烈风哥布林': {
        name: '烈风哥布林',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 114 - 3,
        minMp: 70 - 3,
        minAttack: 39,
        minDefensive: 40,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '地下水脉') {
                await leo.autoWalkList([[46, 57],[44, 55]])
            } else {
                if(leo.oldLine && leo.oldLine > 0) {
                    //如果之前已经回补过，则需要换线抓
                    let newLine = leo.oldLine + 1;
                    if(newLine>10){
                        newLine = 1;
                    }
                    return leo.changeLine(newLine);
                }
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 18, '莎莲娜']
                ])
                if(cga.GetMapName() == '莎莲娜' && !leo.has('塔比欧的细胞') && !leo.has('月之锄头')){
                    await leo.loop(async ()=>{
                        if(leo.has('塔比欧的细胞')){
                            return leo.reject();
                        }
                        await leo.autoWalk([281, 371])
                        await leo.turnDir(6)
                        await leo.delay(1000)
                        await leo.waitAfterBattle()
                        await leo.delay(1000)
                    })
                }
                if(cga.GetMapName() == '莎莲娜' && leo.has('塔比欧的细胞') && !leo.has('月之锄头')){
                    await leo.loop(async ()=>{
                        if(leo.has('月之锄头')){
                            return leo.reject();
                        }
                        await leo.autoWalk([314,432])
                        await leo.talkNpc(313, 432,leo.talkYes)
                        await leo.delay(2000)
                    })
                }
                if(cga.GetMapName() == '莎莲娜' && leo.has('月之锄头')){
                    await leo.loop(async ()=>{
                        if(leo.has('月之锄头')){
                            return leo.reject();
                        }
                        await leo.autoWalk([314,432])
                        await leo.talkNpc(313, 432,leo.talkYes)
                        await leo.delay(2000)
                    })
                }
                console.log(leo.logTime()+'到达莎莲娜，开始寻找迷宫入口');
                await leo.loop(async ()=>{
                    try{
                        if(cga.GetMapName() == '莎莲娜'){
                            var gotoTarget = () => {
                                var targetEntryArr = {
                                    '奇怪的坑道' : [[365,354],[365,362],[364,370],[354,384],[351,398],[361,408],
                                       [359,453],[375,457],[387,459],
                                       [395,447],[395,431],[388,421],[378,414],
                                       [373,390],[361,420],[360,434],[374,433],
                                    ]
                                }
                                var index = -1;
                                var targetEntryAreaArr = targetEntryArr['奇怪的坑道'];
                                if(leo.oldEntry){
                                    targetEntryAreaArr.unshift(leo.oldEntry);
                                }
                                var tempEntry = null;
                                var findHoleEntry = ()=>{
                                    var mapInfo = leo.getMapInfo();
                                    if(mapInfo.name == '奇怪的坑道地下1楼'){
                                        console.log(leo.logTime()+'找到迷宫入口：'+tempEntry);
                                        leo.oldEntry = tempEntry;
                                        return leo.next();
                                    }
                                    index++;
                                    if(index >= targetEntryAreaArr.length){
                                        return leo.log('没有找到迷宫入口');
                                    }
                                    if (mapInfo.name == '莎莲娜') {
                                        console.log(leo.logTime()+targetEntryAreaArr[index])
                                        return leo.moveNearest(targetEntryAreaArr[index])
                                        .then(()=>{
                                            var npcExcept = ['附近的NPC'];
                                            var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & leo.UnitFlags.NpcEntry) && u.model_id > 0 && !npcExcept.includes(u.unit_name));
                                            if(mazeEntry && mazeEntry.length>0){
                                                tempEntry = [mazeEntry[0].xpos,mazeEntry[0].ypos];
                                                return leo.autoWalk([mazeEntry[0].xpos,mazeEntry[0].ypos,'*'])
                                                .then(()=>findHoleEntry());
                                            }else{
                                                return findHoleEntry();
                                            }
                                        })
                                    }
                                }
                                return findHoleEntry();
                            }
                            await gotoTarget()
                        }
                        if(cga.GetMapName().includes('奇怪的坑道')) {
                            return leo.reject();
                        }
                        await leo.delay(1000)
                    }catch(e){
                        await leo.log('迷宫刷新，e:' + e)
                        await leo.delay(60000)
                    }
                })
                if(cga.GetMapName().includes('奇怪的坑道') && !leo.has('红色三菱镜')){
                    var targetFinder = (units) =>{ //发现NPC
                        return units.find(u =>u.unit_name == '挖掘的迪太' && u.type == 1);
                    }
                    var todo = async (target) =>{　 //走向NPC对话
                        const positions = leo.getMovablePositionsAround({x: target.xpos, y: target.ypos});
                        await leo.autoWalk([positions[0].x, positions[0].y],undefined,undefined,{compress: false})
                        await leo.loop(async ()=>{
                            if(leo.has('红色三菱镜')){
                                return leo.reject();
                            }
                            await leo.talkNpc(target.xpos, target.ypos, leo.talkYes)
                        })
                        if(leo.has('红色三菱镜')){
                            console.log(leo.logTime()+'获取了道具【红色三菱镜】');
                        }
                    }
                    await leo.lookForNpc(targetFinder, todo, false)
                }
                if(cga.GetMapName().includes('奇怪的坑道') && leo.has('红色三菱镜')){
                    await leo.walkRandomMazeUntil(() => {
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.name.indexOf('奇怪的坑道地下1')!=-1 && mapInfo.x == 10 && mapInfo.y == 19) {
                            return true;
                        }
                        return false;
                    },false)
                    await leo.autoWalkList([
                        [10,15,[12, 7]],[8,5]
                    ])
                    await leo.turnDir(0)
                    await leo.delay(2000)
                    await leo.waitAfterBattle()
                    await leo.delay(5000)
                    await leo.waitUntil(()=>{
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.x == 2 && mapInfo.y == 5) {
                            return true;
                        }
                        return false;
                    })
                    await leo.autoWalk([4,5])
                    await leo.turnDir(0)
                    await leo.waitUntil(()=>{
                        var mapInfo = leo.getMapInfo();
                        if (mapInfo.name == '地下水脉' && mapInfo.indexes.index3 == 15531) {
                            return true;
                        }
                        return false;
                    })
                    await leo.autoWalkList([[46, 57],[44, 55]])
                }
            }
        }
    },
    '火焰哥布林': {
        name: '火焰哥布林',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 100 - 3,
        minMp: 86 - 3,
        minAttack: 40,
        minDefensive: 41,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[255, 593],[257, 593]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [257, 593]
                ])
            }
        }
    },
    '亚特拉斯巨神': {
        name: '亚特拉斯巨神',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 123 - 3,
        minMp: 86 - 3,
        minAttack: 45,
        minDefensive: 37,
        minAgility: 30,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '风鸣之塔 10楼') {
                await leo.autoWalkList([[62, 64],[60, 64]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [462, 404, '索奇亚']
                ])
                await leo.turnTo(462, 404)
                await leo.say('以军神之名开启海路')
                await leo.talkNpc(-1,-1,leo.talkYes)
                await leo.autoWalkList([
                    [17, 13, '契约的海道'],
                    [17, 12, '阿卡斯'],
                    [45, 69, 20301], 
                    [50, 15, 20302],
                    [50, 62, 20303],    
                    [66, 81, 20304],
                    [72, 81, 20303],
                    [88, 29, 20304],
                    [94, 74, 20305],
                    [89, 30, 20306],
                    [50, 90, 20307],
                    [50, 85, 20308],
                    [93, 65, 20309],
                    [90, 63, 20310],
                    [60, 64]    
                ])
            }
        }
    },
    '巨人': {
        name: '巨人',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 124 - 3,
        minMp: 89 - 3,
        minAttack: 44,
        minDefensive: 40,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '风鸣之塔 10楼') {
                await leo.autoWalkList([[15, 62],[14, 62]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [462, 404, '索奇亚']
                ])
                await leo.turnTo(462, 404)
                await leo.say('以军神之名开启海路')
                await leo.talkNpc(-1,-1,leo.talkYes)
                await leo.autoWalkList([
                    [17, 13, '契约的海道'],
                    [17, 12, '阿卡斯'],
                    [45, 69, 20301], 
                    [50, 15, 20302],
                    [50, 62, 20303],    
                    [66, 81, 20304],
                    [72, 81, 20303],
                    [88, 29, 20304],
                    [94, 74, 20305],
                    [89, 30, 20306],
                    [50, 90, 20307],
                    [50, 85, 20308],
                    [93, 65, 20309],
                    [90, 63, 20310],
                    [14, 62]  
                ])
            }
        }
    },
    '单眼巨人': {
        name: '单眼巨人',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 3,
        minMp: 100 - 3,
        minAttack: 43,
        minDefensive: 38,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if(currentMap=='雪拉威森塔９２层'){
                await leo.autoWalkList([[106, 96]])
            }else{
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [18, 44, '雪拉威森塔９０层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [43, 26, '雪拉威森塔９１层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [44, 109, '雪拉威森塔９２层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106, 96]
                ])
            }
        }
    },
    '蔓陀罗草': {
        name: '蔓陀罗草',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 124 - 3,
        minAttack: 32,
        minDefensive: 34,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[282, 488],[280, 488]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [280, 488]
                ])
            }
        }
    },
    '妖草': {
        name: '妖草',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 99 - 3,
        minMp: 121 - 3,
        minAttack: 31,
        minDefensive: 35,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[471, 393],[471, 395]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.vinoy)
                await leo.autoWalkList([
                    [67, 46, '芙蕾雅'],
                    [471, 395]
                ])
            }
        }
    },
    '迷你蝙蝠': {
        name: '迷你蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 86 - 3,
        minMp: 90 - 3,
        minAttack: 39,
        minDefensive: 37,
        minAgility: 34,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[478, 193],[478, 194]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.eout)
                await leo.autoWalkList([
                    [478, 194]
                ])
            }
        }
    },
    '扫把蝙蝠': {
        name: '扫把蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 87 - 3,
        minMp: 93 - 3,
        minAttack: 40,
        minDefensive: 33,
        minAgility: 34,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜东方洞窟 地下2楼') {
                await leo.autoWalkList([[20,25],[18,25]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [527, 209]
                ])
                await leo.talkNpc(0,leo.talkYes,'莎莲娜东方洞窟 地下1楼')
                await leo.autoWalkList([
                    [18,5,'莎莲娜东方洞窟 地下2楼'],[32,9,'莎莲娜东方洞窟 地下3楼'],[9,17,'莎莲娜东方洞窟 地下2楼'],[18,25]
                ])
            }
        }
    },
    '大蝙蝠': {
        name: '大蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 108 - 3,
        minMp: 89 - 3,
        minAttack: 41,
        minDefensive: 40,
        minAgility: 35,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '试炼之洞窟 第1层') {
                await leo.autoWalkList([[41, 35],[40, 35]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                if(!leo.has('试炼洞穴通行证')){
                    if(!leo.has('止痛药（特价品）')){
                        await leo.goto(n => n.falan.e1)
                        await leo.autoWalkList([[221, 83, '医院'],[15 ,35]])
                        var buyItem = [{index:1, count:1}];     
                        await leo.buy(0,buyItem)
                    }
                    await leo.goto(n => n.falan.w1)
                    await leo.autoWalkList([[73, 60, '职业公会'],[8, 6]])
                    await leo.talkNpc(0,leo.talkYes)
                }
                await leo.goto(n => n.falan.wout)
                await leo.autoWalkList([[351, 145, '国营第24坑道 地下1楼'],[9, 15]])
                await leo.talkNpc(9, 13, leo.talkYes)
                await leo.autoWalkList([[9, 5, '试炼之洞窟 第1层'],[40, 35]])
            }
        }
    },
    '胖蝙蝠': {
        name: '胖蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 108 - 3,
        minMp: 99 - 3,
        minAttack: 39,
        minDefensive: 38,
        minAgility: 34,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜西方洞窟') {
                await leo.autoWalkList([[28, 46],[30, 46]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [24, 40, '莎莲娜'],
                    [235,338,'莎莲娜西方洞窟'],
                    [45, 9, 14001],[57, 13, 14002],[30, 46]
                ])
            }
        }
    },
    '巨蝙蝠': {
        name: '巨蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 112 - 3,
        minMp: 86 - 3,
        minAttack: 42,
        minDefensive: 39,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '青龙的洞窟 4楼') {
                await leo.autoWalkList([[70, 66],[72, 66]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [38, 71,'莎莲娜'],[118, 100 ,'魔法大学'],[106, 54, '青龙的洞窟 1楼'],
                    [27,38]
                ])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [26, 10, '青龙的洞窟 2楼'],[21, 45, '青龙的洞窟 3楼'],[45, 43, '青龙的洞窟 4楼'],[72, 66]
                ])
            }
        }
    },
    '海蝙蝠': {
        name: '海蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 86 - 3,
        minAttack: 41,
        minDefensive: 42,
        minAgility: 35,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if(currentMap=='地底湖 地下2楼'){
                await leo.autoWalkList([[40,60],[42,60]])
            }else{
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [38, 71,'莎莲娜'],[118, 100 ,'魔法大学'],[36,31]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='地底湖 地下1楼'){
                        return leo.reject();
                    }
                    await leo.autoWalk([36,31])
                    await leo.talkNpc(6,leo.talkYes)
                    await leo.delay(1000)
                })
                await leo.autoWalkList([[6,23,'地底湖 地下2楼'],[42,60]])
            }
        }
    },
    '兔耳蝙蝠': {
        name: '兔耳蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 89 - 3,
        minAttack: 39,
        minDefensive: 37,
        minAgility: 35,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[479, 255],[481, 255]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [481, 255]
                ])
            }
        }
    },
    '火蜘蛛': {
        name: '火蜘蛛',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 99 - 3,
        minMp: 96 - 3,
        minAttack: 37,
        minDefensive: 35,
        minAgility: 33,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '试炼之洞窟 第5层') {
                await leo.autoWalkList([[22,14]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                if(!leo.has('试炼洞穴通行证')){
                    if(!leo.has('止痛药（特价品）')){
                        await leo.goto(n => n.falan.e1)
                        await leo.autoWalkList([[221, 83, '医院'],[15 ,35]])
                        var buyItem = [{index:1, count:1}];     
                        await leo.buy(0,buyItem)
                    }
                    await leo.goto(n => n.falan.w1)
                    await leo.autoWalkList([[73, 60, '职业公会'],[8, 6]])
                    await leo.talkNpc(0,leo.talkYes)
                }
                await leo.goto(n => n.falan.wout)
                await leo.autoWalkList([[351, 145, '国营第24坑道 地下1楼'],[9, 15]])
                await leo.talkNpc(9, 13, leo.talkYes)
                await leo.autoWalkList([
                    [9, 5, '试炼之洞窟 第1层'],
                    [33, 31, '试炼之洞窟 第2层'],
                    [22, 42, '试炼之洞窟 第3层'],
                    [42, 34, '试炼之洞窟 第4层'],
                    [27, 12, '试炼之洞窟 第5层'],
                    [22, 14]
                ])
            }
        }
    },
    '土蜘蛛': {
        name: '土蜘蛛',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 100 - 3,
        minAttack: 34,
        minDefensive: 36,
        minAgility: 32,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        autoBattle: [{
            user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬'),
            type: '攻击',
            targets: context => [context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬').pos]
        },{
            user: 2, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬'),
            skillName: '攻击',
            targets: context => [context.enemies.find(e => e.name == '小鬼' || e.name == '星雄' || e.name == '鬼犬').pos]
        }],
        async walk(cga,protect){
            const leo = cga.emogua;
            const targetFinder = (units) => {
                return units.find(u => u.unit_name == '冒险者金德其' && u.type == 1 
            && (u.flags & cga.emogua.UnitFlags.NpcEntry) && u.model_id > 0);
            }
            const todo = async (target) => {
                const positions = leo.getMovablePositionsAround({x: target.xpos, y: target.ypos});
                await leo.autoWalk([positions[0].x, positions[0].y],undefined,undefined,{compress: false})
                await leo.loop(async ()=>{
                    if(leo.has('牛鬼杀')){
                        console.log(leo.logTime()+'拿到了牛鬼杀');
                        return leo.reject();
                    }
                    if(leo.has('酒？')){
                        console.log(leo.logTime()+'拿到了酒？');
                        return leo.reject();
                    }
                    await leo.talkNpc(target.xpos, target.ypos, leo.talkYes)
                })
            }
            await leo.loop(async ()=>{
                if(leo.checkStopEncounter(protect)){
                    console.log(leo.logTime() + "触发回补");
                    await leo.logBack()
                    return leo.reject();
                }
                try{
                    if(['艾尔莎岛','里谢里雅堡','法兰城','银行','达美姊妹的店'].includes(cga.GetMapName())){
                        await leo.goto(n => n.falan.eout)
                    }
                    if(cga.GetMapName() == '芙蕾雅'){
                        await leo.autoWalk([665,184,'*']);
                    }
                    if(cga.GetMapName() == '牛鬼的洞穴'){
                        await leo.autoWalk([16,10,'*']);
                    }
                    if(cga.GetMapName() == '洞窟'){
                        await leo.log('现在是白天，进不了牛鬼的洞穴，等待3分钟')
                        await leo.delay(180000)
                        await leo.autoWalk([16,19,'芙蕾雅'])
                        await leo.delay(5000)
                    }
                    if(cga.GetMapName().includes('牛鬼的洞窟')){
                        if(leo.has('牛鬼杀') || leo.has('酒？')){
                            console.log(leo.logTime()+'已有【牛鬼杀】或者【酒？】，直接走迷宫');
                            await leo.walkRandomMazeUntil(() => {
                                var mapInfo = leo.getMapInfo();
                                if (mapInfo.indexes.index3 == 11019) {
                                    return true;
                                }
                                return false;
                            },false)
                        }else{
                            console.log('开始找冒险者金德其');
                            await leo.lookForNpc(targetFinder, todo, true);
                        }
                    }
                    let mapInfo = cga.getMapInfo();
                    if(mapInfo.indexes.index3 == 11019 && mapInfo.y >= 32){
                        await leo.autoWalk([25,34])
                        await leo.talkNpc(25,33,leo.talkYes)
                        await leo.delay(1000)
                        await leo.waitAfterBattle()
                        mapInfo = cga.getMapInfo();
                    }
                    if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 32 & mapInfo.y > 14)){
                        await leo.autoWalkList([[27,16],[27,15]])
                        return leo.reject();
                    }
                    if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 14)){
                        await leo.autoWalkList([[27,12],[27,13]])
                        return leo.reject();
                    }
                }catch(e){
                    console.log(leo.logTime()+'出错，可能是迷宫刷新：'+e);
                    if(cga.GetMapName() != '牛鬼的洞穴'){
                        await leo.logBack()
                    }
                    await leo.delay(1000*5)
                }
                await leo.delay(500)
            })
            console.log(leo.logTime()+'到达位置，开始抓宠，请注意是否开启了自动扔宠物。')
            await leo.loop(async ()=> {
                if(leo.checkStopEncounter(protect)){
                    console.log(leo.logTime() + "触发回补");
                    await leo.logBack()
                    return leo.reject();
                }
                await leo.waitAfterBattle()
                await leo.turnTo(27,14)
                await leo.delay(2000)
                await leo.waitAfterBattle()
                let mapInfo = cga.getMapInfo();
                if(mapInfo.indexes.index3 == 11019 && (mapInfo.y < 13)){
                    await leo.autoWalkList([[27,12],[27,13]])
                }
                if(mapInfo.indexes.index3 == 11019 && (mapInfo.y > 15)){
                    await leo.autoWalkList([[27,16],[27,15]])
                }
                protect.checker();
                await leo.delay(1000)
            })
        }
    },
    '水蜘蛛': {
        name: '水蜘蛛',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 99 - 3,
        minMp: 108 - 3,
        minAttack: 34,
        minDefensive: 36,
        minAgility: 31,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '角笛大风穴') {
                await leo.autoWalkList([[9, 31],[10, 33]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.kili)
                await leo.autoWalkList([
                    [60, 45, '索奇亚'],
                    [356, 334, '角笛大风穴'],
                    [10, 33]
                ])
            }
        }
    },
    '风蜘蛛': {
        name: '风蜘蛛',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 102 - 5,
        minMp: 92 - 5,
        minAttack: 40,
        minDefensive: 35,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if(currentMap=='雪拉威森塔６５层'){
                await leo.autoWalkList([[72,111],[70,111]])
            }else{
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [23,55,'雪拉威森塔６５层'],[70,111]
                ])
            }
        }
    },
    '树精': {
        name: '树精',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 114 - 3,
        minMp: 91 - 3,
        minAttack: 35,
        minDefensive: 44,
        minAgility: 28,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[565,200],[563,200]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.eout)
                await leo.autoWalkList([
                    [563,200]
                ])
            }
        }
    },
    '惨白树精': {
        name: '惨白树精',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 110 - 3,
        minMp: 97 - 3,
        minAttack: 34,
        minDefensive: 42,
        minAgility: 30,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[570, 242],[570, 240]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [570, 240]
                ])
            }
        }
    },
    '冰冷树精': {
        name: '冰冷树精',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 111 - 3,
        minMp: 100 - 3,
        minAttack: 34,
        minDefensive: 41,
        minAgility: 30,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[588, 46],[590, 46]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.aleut)
                await leo.autoWalkList([
                    [58, 31, '芙蕾雅'],
                    [590, 46]
                ])
            }
        }
    },
    '死亡树精': {
        name: '死亡树精',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 110 - 3,
        minMp: 90 - 3 ,
        minAttack: 36,
        minDefensive: 47,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[361, 339]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 18, '莎莲娜'],
                    [361, 339]
                ])
            }
        }
    },
    '水晶螃蟹': {
        name: '水晶螃蟹',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 81 - 3,
        minAttack: 42,
        minDefensive: 46,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[517, 236],[517, 238]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [517, 238]
                ])
            }
        }
    },
    '铁剪螃蟹': {
        name: '铁剪螃蟹',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 93 - 3,
        minMp: 78 - 3,
        minAttack: 43,
        minDefensive: 47,
        minAgility: 29,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[483, 217],[485, 217]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [485, 217]
                ])
            }
        }
    },
    '黄金螃蟹': {
        name: '黄金螃蟹',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 101 - 3,
        minMp: 83 - 3,
        minAttack: 41,
        minDefensive: 45,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            if (cga.getMapInfo().indexes.index3 == 21025) {
                await leo.autoWalkList([[22,29]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.sout)
                await leo.autoWalk([409, 294])
                await leo.talkNpc(2,leo.talkYes)
                await leo.delay(2000)
                await leo.autoWalkList([
                    [46,23,'忍者的隐居地'],[19,9,'忍者之家'],
                    [24,32],[22,16],[14,21],[13,20]
                ])
                await leo.talkNpc(6,leo.talkYes,'忍者之家2楼')
                await leo.autoWalkList([
                    [15,29],[21,28],[32,12],[38,18],[37,19,'忍者之家'],
                    [39,21],[44,33],[49,38],[63,38]
                ])
                await leo.talkNpc(0,leo.talkYes,'井的底部')
                await leo.autoWalkList([
                    [7,4,'通路'],[22,26,21025],[22,29]
                ])
            }
        }
    },
    '恶魔螃蟹': {
        name: '恶魔螃蟹',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 95 - 3,
        minMp: 83 - 3,
        minAttack: 42,
        minDefensive: 46,
        minAgility: 28,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '维诺亚洞穴 地下1楼') {

            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.sout)
                await leo.autoWalk([473,316])
                await leo.talkNpc(4,leo.talkYes)
                await leo.moveAround()
            }
        }
    },
    '死灵': {
        name: '死灵',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 89 - 30,
        minMp: 115 - 30,
        minAttack: 41,
        minDefensive: 45,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            await leo.log('当前时间是【'+leo.getSysTimeEx()+'】')
            if (leo.getMapInfo().name == '蒂娜村'
                && leo.getMapInfo().indexes.index3 == 4201) {
                await leo.autoWalkList([
                    [32, 25],
                    [34, 25]
                ]);
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 18, '莎莲娜'],
                    [570, 274]
                ])
                await leo.loop(async ()=>{
                    if(leo.getSysTimeEx()=='黄昏'||leo.getSysTimeEx()=='夜晚'){
                        await leo.autoWalkList([
                            [570,275,'蒂娜村'],[32,25]
                        ])
                        if(leo.getMapInfo().indexes.index3 != 4201){
                            //不是夜晚的地图，出去，重新进
                            await leo.autoWalkList([
                                [29,21,'莎莲娜']
                            ])
                            await leo.delay(10000)
                        }else{
                            await leo.autoWalk([34, 25])
                            return leo.reject();
                        }
                    }
                    await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【黄昏】或【夜晚】')
                    await leo.delay(120000)
                })
            }
        }
    },
    '幽灵': {
        name: '幽灵',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 100 - 3,
        minMp: 112 - 3,
        minAttack: 36,
        minDefensive: 44,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
    },
    '小恶魔': {
        name: '小恶魔',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 94 - 3,
        minMp: 112 - 3,
        minAttack: 36,
        minDefensive: 31,
        minAgility: 33,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[282, 400],[280, 400]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.kili)
                await leo.autoWalkList([
                    [60, 45, '索奇亚'],
                    [280, 400]
                ])
            }
        }
    },
    '血腥之刃': {
        name: '血腥之刃',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 90 - 3,
        minMp: 111 - 3,
        minAttack: 46,
        minDefensive: 46,
        minAgility: 30,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '诅咒的迷宫 地下18楼') {
                await leo.autoWalkList([[23,13],[21,13]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='阿巴尼斯村的传送点'){
                        return leo.reject();
                    }else{
                        await leo.talkNpc(0,leo.talkYes)
                    }
                    await leo.delay(2000)
                })
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村']
                ])
                if(!leo.has('刀刃的碎片')){
                    await leo.autoWalk([40, 30, '民家'])
                    await leo.autoWalk([13, 10])
                    await leo.loop(async ()=>{
                        if(!leo.has('野草莓')){
                            await leo.talkNpc(14, 10,leo.talkYes)
                        }else{
                            return leo.reject();
                        }
                        await leo.delay(1000)
                    })
                    console.log(leo.logTime()+'拿到了【野草莓】');
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3 == 4331){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(9, 4)
                        }
                        await leo.delay(2000)
                    })
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3 == 4332){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(15, 7)
                        }
                        await leo.delay(2000)
                    })
                    await leo.loop(async ()=>{
                        if(leo.has('刀刃的碎片')){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(15, 7)
                        }
                        await leo.delay(2000)
                    })
                    console.log(leo.logTime()+'拿到了【刀刃的碎片】');
                    await leo.autoWalkList([
                        [5, 3, 4333], [9, 4, 4334]
                    ])
                    await leo.loop(async ()=>{
                        if(cga.getMapInfo().indexes.index3 == 4335){
                            return leo.reject();
                        }else{
                            await leo.talkNpcAt(15, 10)
                        }
                        await leo.delay(2000)
                    })
                    await leo.autoWalkList([
                        [7, 3, 4320],[12, 17, '阿巴尼斯村'],[37,71,'莎莲娜'],[54,162]
                    ])
                }
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='诅咒的迷宫'){
                        return leo.reject();
                    }else{
                        await leo.talkNpc(54, 161, leo.talkYes)
                    }
                    await leo.delay(2000)
                })
                await leo.autoWalkList([
                    [35,9,'诅咒的迷宫 地下1楼'],[25,13,'诅咒的迷宫 地下2楼'],
                    [17,4,'诅咒的迷宫 地下3楼'],[23,20,'诅咒的迷宫 地下4楼'],
                    [16,10,'诅咒的迷宫 地下5楼'],[6,3,'诅咒的迷宫 地下6楼'],
                    [15,3,'诅咒的迷宫 地下7楼'],[25,18,'诅咒的迷宫 地下8楼'],
                    [14,18,'诅咒的迷宫 地下9楼'],[24,4,'第一个难关'],
                    [22,15]
                ])
                await leo.talkNpc(22, 14,leo.talkYes,'诅咒的迷宫 地下11楼')
                await leo.autoWalkList([
                    [15,4,'诅咒的迷宫 地下12楼'],[24,15,'诅咒的迷宫 地下13楼'],
                    [16,3,'诅咒的迷宫 地下14楼'],[25,12,'诅咒的迷宫 地下15楼'],
                    [22,5,'诅咒的迷宫 地下16楼'],[17,18,'诅咒的迷宫 地下15楼'],
                    [25,21,'诅咒的迷宫 地下16楼'],[22,18,'诅咒的迷宫 地下17楼'],
                    [23,4,'诅咒的迷宫 地下18楼'],
                    [21,13]
                ])
            }
        }
    },
    '影岩': {
        name: '影岩',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 112 - 3,
        minMp: 96 - 3,
        minAttack: 34,
        minDefensive: 44,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪拉威森塔３９层') {
                await leo.autoWalkList([[286, 186],[282, 186]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([[73,56],[72,56,'雪拉威森塔４０层']])
                await leo.autoWalk([96,83,'雪拉威森塔３９层'])
                await leo.autoWalkList([
                    [239,176],[257,176],[257,224],[262,224],[262,235],
                    [266,235],[266,224],[270,224],[270,236],[277,236],
                    [277,218],[274,218],[274,204],[281,204],[281,212],
                    [285,212],[285,208],[289,208],[289,192],[301,192],
                    [301,196],[305,196],[305,193],[310,193],[310,196],
                    [317,196],[317,186],[282,186]
                ])
            }
        }
    },
    '丧尸': {
        name: '丧尸',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 112 - 3,
        minMp: 84 - 3,
        minAttack: 43,
        minDefensive: 30,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪山之顶') {
                await leo.autoWalkList([[18, 16],[21, 16]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [38, 71,'莎莲娜'],
                    [84, 193,'积雪的山路海拔100M']
                ])
                await leo.loop(async ()=>{
                    try{
                        if(cga.GetMapName() == '莎莲娜') {
                            await leo.autoWalk([84, 193,'积雪的山路海拔100M'])
                        }
                        if(cga.GetMapName() == '雪山之顶') {
                            return leo.reject();
                        }
                        if(cga.GetMapName().includes('积雪的山路海拔')){
                            await leo.walkRandomMazeUntil(() => {
                                if (!cga.GetMapName().includes('积雪的山路海拔')) {
                                    return true;
                                }
                                return false;
                            },false)
                        }
                    }catch(e){
                        await leo.log('迷宫刷新，e:' + e)
                        await leo.delay(60000)
                    }
                })
                await leo.autoWalk([21, 16])
            }
        }
    },
    '僵尸': {
        name: '僵尸',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 115 - 3,
        minMp: 80 - 3,
        minAttack: 42,
        minDefensive: 33,
        minAgility: 28,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            const mapInfo = leo.getMapInfo();
            if(mapInfo.name=='阿鲁巴斯的研究所' 
                && mapInfo.indexes.index3 == 15519
                && mapInfo.x >= 20 && mapInfo.x <= 26
                && mapInfo.y >= 32 && mapInfo.y <= 40) {
                await leo.autoWalkList([
                    [23, 34],[23,36]
                ])
            }else{
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='阿鲁巴斯的研究所') {
                        return leo.reject();
                    }
                    if(cga.GetMapName()!='索奇亚' && cga.GetMapName()!='森林小路' && !cga.GetMapName().includes('阿鲁巴斯的洞窟') && cga.GetMapName()!='阿鲁巴斯的研究所') {
                        await leo.logBack()
                        //await leo.sellCastle()
                        await leo.checkHealth(doctorName)
                        await leo.checkCrystal(this.crystalName)
                        await leo.goto(n => n.teleport.kili)
                        if(!leo.has(18338)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】1');
                            await leo.autoWalk([50,54,'老夫妇的家'])
                            await leo.autoWalk([5,5])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([10,8])
                            await leo.loop(async ()=>{
                                if(leo.has(18338)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([10,15,'奇利村'])
                        }
                        if(!leo.has(18339)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】2');
                            await leo.autoWalk([64,56,'医院'])
                            await leo.autoWalk([7,2])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([13,16])
                            await leo.loop(async ()=>{
                                if(leo.has(18339)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([3,9,'奇利村'])
                        }
                        if(!leo.has(18340)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】3');
                            await leo.autoWalk([50,63,'村长的家'])
                            await leo.autoWalk([10,5])
                            await leo.loop(async ()=>{
                                if(leo.getSysTimeEx()=='夜晚'){
                                    await leo.autoWalk([10,2,'*'])
                                    if(leo.getMapInfo().indexes.index3 == 15514){
                                        return leo.reject();
                                    }else{
                                        //不是夜晚的地图，出去，重新进
                                        await leo.autoWalk([7,13,'*'])
                                        await leo.autoWalk([10,5])
                                    }
                                }
                                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【夜晚】')
                                await leo.moveAround()
                                await leo.delay(120000)
                            })
                            leo.battleSetting.attack()
                            await leo.autoWalk([7,6])
                            await leo.turnDir(2)
                            await leo.loop(async ()=>{
                                if(cga.findNPC('黑暗医师阿鲁巴斯')){
                                    await leo.talkNpc(8, 6,leo.talkYes)
                                    return leo.reject();//退出循环
                                }else{
                                    await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待夜晚【黑暗医师阿鲁巴斯】出现')

                                    await leo.delay(30000);
                                }
                            })
                            await leo.waitAfterBattle()
                            await leo.autoWalk([6,3])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([7,13,15516])
                            await leo.autoWalk([10,7])
                            await leo.loop(async ()=>{
                                if(leo.has(18340)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([1,8,'奇利村'])
                            leo.battleSetting.escape()
                        }
                        if(!leo.has('双亲的信')){
                            console.log(leo.logTime()+'拿【双亲的信】');
                            await leo.autoWalk([71,63,'民家'])
                            await leo.autoWalk([10,10])
                            await leo.loop(async ()=>{
                                if(leo.has('双亲的信')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([3,9,'奇利村'])
                        }
                        await leo.autoWalk([79,76,'索奇亚'])
                    }
                    if(cga.GetMapName()=='索奇亚') {
                        await leo.autoWalk([217,222])
                        leo.monitor.config.autoExit = false; //关闭5分钟不动结束脚本
                        leo.monitor.config.keepAlive = true; //开启防掉线
                        await leo.loop(async ()=>{
                            if(cga.GetMapName()=='森林小路'){
                                return leo.reject();
                            }
                            if(cga.findNPC('守门的腐尸')){
                                await leo.talkNpc(216, 222,leo.talkYes)
                            }else{
                                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待夜晚【守门的腐尸】出现');
                                await leo.delay(30000);
                            }
                            await leo.delay(2000)
                        })
                        leo.monitor.config.autoExitMemory = {}; //重置x分钟不动缓存
                        leo.monitor.config.autoExit = true; //开启5分钟不动结束脚本
                        leo.monitor.config.keepAlive = false; //关闭防掉线
                    }
                    if(cga.GetMapName()=='森林小路') {
                        await leo.autoWalk([8,38,'阿鲁巴斯的洞窟1楼'])
                    }
                    if(cga.GetMapName().includes('阿鲁巴斯的洞窟')){
                        try{
                            await leo.walkRandomMazeUntil(() => {
                                if (cga.GetMapName() == '阿鲁巴斯的研究所') {
                                    return true; //15518
                                }
                                if (cga.GetMapName() == '森林小路') {
                                    console.log(leo.logTime()+'迷宫刷新');
                                    return true;
                                }
                                return false;
                            },true);
                        }catch(e){
                            console.log(leo.logTime()+'迷宫刷新:' + e);
                        }
                    }
                    await leo.delay(2000)
                })
                if(cga.GetMapName() == '阿鲁巴斯的研究所'){
                    if(leo.getMapInfo().indexes.index3 == 15518
                        && (leo.getMapInfo().x<=48 
                        || leo.getMapInfo().y>=26)) {
                        await leo.autoWalk([17,18,15519])
                    }
                    if(leo.getMapInfo().indexes.index3 == 15519
                        && leo.getMapInfo().x<16) {
                        await leo.autoWalk([37,10,15518])
                    }
                    if(leo.getMapInfo().indexes.index3 == 15518
                        && leo.getMapInfo().x>48 
                        && leo.getMapInfo().y<26) {
                        await leo.autoWalk([49,19,15519])
                    }
                    await leo.autoWalk([23,36])
                }
            }
        }
    },
    '腐尸': {
        name: '腐尸',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 121 - 3,
        minMp: 71 - 3,
        minAttack: 44,
        minDefensive: 33,
        minAgility: 26,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            const mapInfo = leo.getMapInfo();
            if(mapInfo.name=='阿鲁巴斯的研究所' 
                && mapInfo.indexes.index3 == 15519
                && mapInfo.x >= 20 && mapInfo.x <= 26
                && mapInfo.y >= 32 && mapInfo.y <= 40) {
                await leo.autoWalkList([
                    [23, 34],[23,36]
                ])
            }else{
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='阿鲁巴斯的研究所') {
                        return leo.reject();
                    }
                    if(cga.GetMapName()!='索奇亚' && cga.GetMapName()!='森林小路' && !cga.GetMapName().includes('阿鲁巴斯的洞窟') && cga.GetMapName()!='阿鲁巴斯的研究所') {
                        await leo.logBack()
                        //await leo.sellCastle()
                        await leo.checkHealth(doctorName)
                        await leo.checkCrystal(this.crystalName)
                        await leo.goto(n => n.teleport.kili)
                        if(!leo.has(18338)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】1');
                            await leo.autoWalk([50,54,'老夫妇的家'])
                            await leo.autoWalk([5,5])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([10,8])
                            await leo.loop(async ()=>{
                                if(leo.has(18338)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([10,15,'奇利村'])
                        }
                        if(!leo.has(18339)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】2');
                            await leo.autoWalk([64,56,'医院'])
                            await leo.autoWalk([7,2])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([13,16])
                            await leo.loop(async ()=>{
                                if(leo.has(18339)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([3,9,'奇利村'])
                        }
                        if(!leo.has(18340)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】3');
                            await leo.autoWalk([50,63,'村长的家'])
                            await leo.autoWalk([10,5])
                            await leo.loop(async ()=>{
                                if(leo.getSysTimeEx()=='夜晚'){
                                    await leo.autoWalk([10,2,'*'])
                                    if(leo.getMapInfo().indexes.index3 == 15514){
                                        return leo.reject();
                                    }else{
                                        //不是夜晚的地图，出去，重新进
                                        await leo.autoWalk([7,13,'*'])
                                        await leo.autoWalk([10,5])
                                    }
                                }
                                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【夜晚】')
                                await leo.moveAround()
                                await leo.delay(120000)
                            })
                            leo.battleSetting.attack()
                            await leo.autoWalk([7,6])
                            await leo.turnDir(2)
                            await leo.loop(async ()=>{
                                if(cga.findNPC('黑暗医师阿鲁巴斯')){
                                    await leo.talkNpc(8, 6,leo.talkYes)
                                    return leo.reject();//退出循环
                                }else{
                                    await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待夜晚【黑暗医师阿鲁巴斯】出现')

                                    await leo.delay(30000);
                                }
                            })
                            await leo.waitAfterBattle()
                            await leo.autoWalk([6,3])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([7,13,15516])
                            await leo.autoWalk([10,7])
                            await leo.loop(async ()=>{
                                if(leo.has(18340)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([1,8,'奇利村'])
                            leo.battleSetting.escape()
                        }
                        if(!leo.has('双亲的信')){
                            console.log(leo.logTime()+'拿【双亲的信】');
                            await leo.autoWalk([71,63,'民家'])
                            await leo.autoWalk([10,10])
                            await leo.loop(async ()=>{
                                if(leo.has('双亲的信')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([3,9,'奇利村'])
                        }
                        await leo.autoWalk([79,76,'索奇亚'])
                    }
                    if(cga.GetMapName()=='索奇亚') {
                        await leo.autoWalk([217,222])
                        leo.monitor.config.autoExit = false; //关闭5分钟不动结束脚本
                        leo.monitor.config.keepAlive = true; //开启防掉线
                        await leo.loop(async ()=>{
                            if(cga.GetMapName()=='森林小路'){
                                return leo.reject();
                            }
                            if(cga.findNPC('守门的腐尸')){
                                await leo.talkNpc(216, 222,leo.talkYes)
                            }else{
                                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待夜晚【守门的腐尸】出现');
                                await leo.delay(30000);
                            }
                            await leo.delay(2000)
                        })
                        leo.monitor.config.autoExitMemory = {}; //重置x分钟不动缓存
                        leo.monitor.config.autoExit = true; //开启5分钟不动结束脚本
                        leo.monitor.config.keepAlive = false; //关闭防掉线
                    }
                    if(cga.GetMapName()=='森林小路') {
                        await leo.autoWalk([8,38,'阿鲁巴斯的洞窟1楼'])
                    }
                    if(cga.GetMapName().includes('阿鲁巴斯的洞窟')){
                        try{
                            await leo.walkRandomMazeUntil(() => {
                                if (cga.GetMapName() == '阿鲁巴斯的研究所') {
                                    return true; //15518
                                }
                                if (cga.GetMapName() == '森林小路') {
                                    console.log(leo.logTime()+'迷宫刷新');
                                    return true;
                                }
                                return false;
                            },true);
                        }catch(e){
                            console.log(leo.logTime()+'迷宫刷新:' + e);
                        }
                    }
                    await leo.delay(2000)
                })
                if(cga.GetMapName() == '阿鲁巴斯的研究所'){
                    if(leo.getMapInfo().indexes.index3 == 15518
                        && (leo.getMapInfo().x<=48 
                        || leo.getMapInfo().y>=26)) {
                        await leo.autoWalk([17,18,15519])
                    }
                    if(leo.getMapInfo().indexes.index3 == 15519
                        && leo.getMapInfo().x<16) {
                        await leo.autoWalk([37,10,15518])
                    }
                    if(leo.getMapInfo().indexes.index3 == 15518
                        && leo.getMapInfo().x>48 
                        && leo.getMapInfo().y<26) {
                        await leo.autoWalk([49,19,15519])
                    }
                    await leo.autoWalk([23,36])
                }
            }
        }
    },
    '食尸鬼': {
        name: '食尸鬼',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 108 - 3,
        minMp: 89 - 3,
        minAttack: 42,
        minDefensive: 36,
        minAgility: 26,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            const mapInfo = leo.getMapInfo();
            if(mapInfo.name=='阿鲁巴斯的研究所' 
                && mapInfo.indexes.index3 == 15519
                && mapInfo.x >= 20 && mapInfo.x <= 26
                && mapInfo.y >= 32 && mapInfo.y <= 40) {
                await leo.autoWalkList([
                    [23, 34],[23,36]
                ])
            }else{
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='阿鲁巴斯的研究所') {
                        return leo.reject();
                    }
                    if(cga.GetMapName()!='索奇亚' && cga.GetMapName()!='森林小路' && !cga.GetMapName().includes('阿鲁巴斯的洞窟') && cga.GetMapName()!='阿鲁巴斯的研究所') {
                        await leo.logBack()
                        //await leo.sellCastle()
                        await leo.checkHealth(doctorName)
                        await leo.checkCrystal(this.crystalName)
                        await leo.goto(n => n.teleport.kili)
                        if(!leo.has(18338)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】1');
                            await leo.autoWalk([50,54,'老夫妇的家'])
                            await leo.autoWalk([5,5])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([10,8])
                            await leo.loop(async ()=>{
                                if(leo.has(18338)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([10,15,'奇利村'])
                        }
                        if(!leo.has(18339)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】2');
                            await leo.autoWalk([64,56,'医院'])
                            await leo.autoWalk([7,2])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([13,16])
                            await leo.loop(async ()=>{
                                if(leo.has(18339)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([3,9,'奇利村'])
                        }
                        if(!leo.has(18340)){
                            console.log(leo.logTime()+'拿【调查诱拐事件的委托信】3');
                            await leo.autoWalk([50,63,'村长的家'])
                            await leo.autoWalk([10,5])
                            await leo.loop(async ()=>{
                                if(leo.getSysTimeEx()=='夜晚'){
                                    await leo.autoWalk([10,2,'*'])
                                    if(leo.getMapInfo().indexes.index3 == 15514){
                                        return leo.reject();
                                    }else{
                                        //不是夜晚的地图，出去，重新进
                                        await leo.autoWalk([7,13,'*'])
                                        await leo.autoWalk([10,5])
                                    }
                                }
                                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待【夜晚】')
                                await leo.moveAround()
                                await leo.delay(120000)
                            })
                            leo.battleSetting.attack()
                            await leo.autoWalk([7,6])
                            await leo.turnDir(2)
                            await leo.loop(async ()=>{
                                if(cga.findNPC('黑暗医师阿鲁巴斯')){
                                    await leo.talkNpc(8, 6,leo.talkYes)
                                    return leo.reject();//退出循环
                                }else{
                                    await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待夜晚【黑暗医师阿鲁巴斯】出现')

                                    await leo.delay(30000);
                                }
                            })
                            await leo.waitAfterBattle()
                            await leo.autoWalk([6,3])
                            await leo.loop(async ()=>{
                                if(leo.has('记载罪行的纸条')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([7,13,15516])
                            await leo.autoWalk([10,7])
                            await leo.loop(async ()=>{
                                if(leo.has(18340)){ //调查诱拐事件的委托信
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([1,8,'奇利村'])
                            leo.battleSetting.escape()
                        }
                        if(!leo.has('双亲的信')){
                            console.log(leo.logTime()+'拿【双亲的信】');
                            await leo.autoWalk([71,63,'民家'])
                            await leo.autoWalk([10,10])
                            await leo.loop(async ()=>{
                                if(leo.has('双亲的信')){
                                    return leo.reject();
                                }
                                await leo.talkNpc(0,leo.talkYes)
                                await leo.delay(1000)
                            })
                            await leo.autoWalk([3,9,'奇利村'])
                        }
                        await leo.autoWalk([79,76,'索奇亚'])
                    }
                    if(cga.GetMapName()=='索奇亚') {
                        await leo.autoWalk([217,222])
                        leo.monitor.config.autoExit = false; //关闭5分钟不动结束脚本
                        leo.monitor.config.keepAlive = true; //开启防掉线
                        await leo.loop(async ()=>{
                            if(cga.GetMapName()=='森林小路'){
                                return leo.reject();
                            }
                            if(cga.findNPC('守门的腐尸')){
                                await leo.talkNpc(216, 222,leo.talkYes)
                            }else{
                                await leo.log('当前时间是【'+leo.getSysTimeEx()+'】，等待夜晚【守门的腐尸】出现');
                                await leo.delay(30000);
                            }
                            await leo.delay(2000)
                        })
                        leo.monitor.config.autoExitMemory = {}; //重置x分钟不动缓存
                        leo.monitor.config.autoExit = true; //开启5分钟不动结束脚本
                        leo.monitor.config.keepAlive = false; //关闭防掉线
                    }
                    if(cga.GetMapName()=='森林小路') {
                        await leo.autoWalk([8,38,'阿鲁巴斯的洞窟1楼'])
                    }
                    if(cga.GetMapName().includes('阿鲁巴斯的洞窟')){
                        try{
                            await leo.walkRandomMazeUntil(() => {
                                if (cga.GetMapName() == '阿鲁巴斯的研究所') {
                                    return true; //15518
                                }
                                if (cga.GetMapName() == '森林小路') {
                                    console.log(leo.logTime()+'迷宫刷新');
                                    return true;
                                }
                                return false;
                            },true);
                        }catch(e){
                            console.log(leo.logTime()+'迷宫刷新:' + e);
                        }
                    }
                    await leo.delay(2000)
                })
                if(cga.GetMapName() == '阿鲁巴斯的研究所'){
                    if(leo.getMapInfo().indexes.index3 == 15518
                        && (leo.getMapInfo().x<=48 
                        || leo.getMapInfo().y>=26)) {
                        await leo.autoWalk([17,18,15519])
                    }
                    if(leo.getMapInfo().indexes.index3 == 15519
                        && leo.getMapInfo().x<16) {
                        await leo.autoWalk([37,10,15518])
                    }
                    if(leo.getMapInfo().indexes.index3 == 15518
                        && leo.getMapInfo().x>48 
                        && leo.getMapInfo().y<26) {
                        await leo.autoWalk([49,19,15519])
                    }
                    await leo.autoWalk([23,36])
                }
            }
        }
    },
    '木乃伊': {
        name: '木乃伊',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 3,
        minMp: 90 - 3,
        minAttack: 42,
        minDefensive: 34,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
    },
    '红蝎': {
        name: '红蝎',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 106 - 3,
        minMp: 80 - 3 ,
        minAttack: 40,
        minDefensive: 49,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '鲶鱼洞窟  地下3楼') {
                await leo.autoWalkList([[26, 18],[26, 17]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [48, 77, '索奇亚'],
                    [626, 209, '鲶鱼洞窟  地下1楼'],
                    [9, 23, '鲶鱼洞窟  地下2楼'],
                    [40, 32, '鲶鱼洞窟  地下3楼'],
                    [26, 17]
                ])
            }
        }
    },
    '蓝蝎': {
        name: '蓝蝎',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 107 - 3,
        minMp: 81 - 3 ,
        minAttack: 40,
        minDefensive: 53,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[580, 328],[582, 328]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [582, 328]
                ])
            }
        }
    },
    '黄蝎': {
        name: '黄蝎',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 105 - 3,
        minMp: 84 - 3 ,
        minAttack: 42,
        minDefensive: 51,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[539, 348],[539, 346]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [539, 346]
                ])
            }
        }
    },
    '杀手蝎': {
        name: '杀手蝎',
        sealCardName: '封印卡（昆虫系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 117 - 3,
        minMp: 78 - 3,
        minAttack: 41,
        minDefensive: 48,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
    },
    '武术仙人掌': {
        name: '武术仙人掌',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 93 - 3 ,
        minAttack: 41,
        minDefensive: 41,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[552, 398],[552, 400]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [552, 400]
                ])
            }
        }
    },
    '兔耳仙人掌': {
        name: '兔耳仙人掌',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 108 - 3,
        minMp: 87 - 3 ,
        minAttack: 43,
        minDefensive: 36,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[627, 295],[627, 302]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [627, 302]
                ])
            }
        }
    },
    '凶暴仙人掌': {
        name: '凶暴仙人掌',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 106 - 3,
        minMp: 97 - 3 ,
        minAttack: 41,
        minDefensive: 39,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
    },
    '印地安仙人掌': {
        name: '印地安仙人掌',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 105 - 3,
        minMp: 89 - 3 ,
        minAttack: 44,
        minDefensive: 40,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[339, 316],[341, 316]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.kili)
                await leo.autoWalkList([
                    [60, 45, '索奇亚'],
                    [341, 316]
                ])
            }
        }
    },
    '口袋龙': {
        name: '口袋龙',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 94 - 3,
        minMp: 109 - 3 ,
        minAttack: 42,
        minDefensive: 37,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '库鲁克斯岛') {
                await leo.autoWalkList([[293, 819],[292, 819]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n=>n.grahl.c)
                await leo.autoWalkList([
                    [176, 105,'库鲁克斯岛'],
                    [477, 525]
                ])
                await leo.talkNpc(477, 526,leo.talkYes,[476, 528])
                await leo.autoWalk([292, 819])
            }
        }
    },
    '穴龙': {
        name: '穴龙',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 89 - 3,
        minMp: 115 - 3 ,
        minAttack: 41,
        minDefensive: 37,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '库鲁克斯岛') {
                await leo.autoWalkList([[402, 346],[402, 345]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n=>n.grahl.c)
                await leo.autoWalkList([
                    [176, 105,'库鲁克斯岛'],
                    [402, 345]
                ])
            }
        }
    },
    '鸟人': {
        name: '鸟人',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 102 - 3 ,
        minAttack: 35,
        minDefensive: 36,
        minAgility: 37,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[618, 65],[620, 65]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.aleut)
                await leo.autoWalkList([
                    [58, 31, '芙蕾雅'],
                    [620, 65]
                ])
            }
        }
    },
    '狠毒鸟人': {
        name: '狠毒鸟人',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 99 - 3,
        minMp: 99 - 3 ,
        minAttack: 36,
        minDefensive: 35,
        minAgility: 38,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[470, 389],[472, 387]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [472, 387]
                ])
            }
        }
    },
    '烈风鸟人': {
        name: '烈风鸟人',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 92 - 3,
        minMp: 105 - 3 ,
        minAttack: 36,
        minDefensive: 33,
        minAgility: 39,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[54, 163],[56, 163]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.teleport)
                await leo.autoWalk([37,4])
                await leo.talkNpc(0,leo.talkYes)
                await leo.autoWalkList([
                    [5, 4, 4313],[6, 13, 4312],[6, 13, '阿巴尼斯村'],
                    [38, 71,'莎莲娜'],[56, 163]
                ])
            }
        }
    },
    '幻歌妖': {
        name: '幻歌妖',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 96 - 3,
        minMp: 98 - 3 ,
        minAttack: 36,
        minDefensive: 38,
        minAgility: 38,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[78, 346],[80, 346]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [24, 40, '莎莲娜'],
                    [80, 346]
                ])
            }
        }
    },
    '黑暗鸟人': {
        name: '黑暗鸟人',
        sealCardName: '封印卡（人形系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 100 - 5,
        minMp: 118 - 5,
        minAttack: 32,
        minDefensive: 33,
        minAgility: 40,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
    },
    '绿色口臭鬼': {
        name: '绿色口臭鬼',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 120 - 3,
        minMp: 102 - 3 ,
        minAttack: 38,
        minDefensive: 35,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜海底洞窟 地下1楼') {
                await leo.autoWalkList([[10, 13],[10, 10]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.w1)
                await leo.autoWalkList([[22, 88, '芙蕾雅'],[200, 165]])
                await leo.talkNpc(201, 165,leo.talkYes,'莎莲娜海底洞窟 地下1楼')
                await leo.autoWalkList([
                    [10, 10]
                ])
            }
        }
    },
    '黄色口臭鬼': {
        name: '黄色口臭鬼',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 3,
        minMp: 100 - 3 ,
        minAttack: 40,
        minDefensive: 37,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '芙蕾雅') {
                await leo.autoWalkList([[414, 564],[416, 564]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.vinoy)
                await leo.autoWalkList([
                    [67, 46, '芙蕾雅'],
                    [416, 564]
                ])
            }
        }
    },
    '蓝色口臭鬼': {
        name: '蓝色口臭鬼',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 118 - 5,
        minMp: 111 - 5,
        minAttack: 39,
        minDefensive: 35,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
    },
    '史莱姆': {
        name: '史莱姆',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 124 - 3,
        minMp: 85 - 3 ,
        minAttack: 39,
        minDefensive: 32,
        minAgility: 26,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '龟裂的地下道地下1楼') {
                await leo.moveAround()
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.w1)
                await leo.autoWalkList([
                    [95, 49, '修理工波利的家'],
                    [9, 2, '地下道'],
                    [7, 23, '龟裂的地下道地下1楼']
                ])
                await leo.moveAround()
            }
        }
    },
    '液态史莱姆': {
        name: '液态史莱姆',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 129 - 3,
        minMp: 78 - 3 ,
        minAttack: 38,
        minDefensive: 34,
        minAgility: 25,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        isNameOnly: true,
    },
    '果冻史莱姆': {
        name: '果冻史莱姆',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 123 - 3,
        minMp: 80 - 3 ,
        minAttack: 41,
        minDefensive: 29,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜海底洞窟 地下1楼') {
                await leo.autoWalkList([[6, 8],[7, 8]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [24, 40, '莎莲娜'],
                    [196, 443, '莎莲娜海底洞窟 地下1楼'],
                    [7, 8]
                ])
            }
        }
    },
    '布丁史莱姆': {
        name: '布丁史莱姆',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 116 - 5,
        minMp: 92 - 5,
        minAttack: 38,
        minDefensive: 33,
        minAgility: 26,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
    },
    '蜥蜴战士': {
        name: '蜥蜴战士',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 85 - 3 ,
        minAttack: 42,
        minDefensive: 44,
        minAgility: 29,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚海底洞窟 地下2楼') {
                await leo.autoWalkList([[6, 47],[8, 47]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.vinoy)
                await leo.autoWalkList([
                    [67, 46, '芙蕾雅'],
                    [343, 497, '索奇亚海底洞窟 地下1楼'],
                    [18, 34, '索奇亚海底洞窟 地下2楼'],
                    [8, 47]
                ])
            }
        }
    },
    '蜥蜴斗士': {
        name: '蜥蜴斗士',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 99 - 3,
        minMp: 83 - 3 ,
        minAttack: 45,
        minDefensive: 47,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
    },
    '猎豹蜥蜴': {
        name: '猎豹蜥蜴',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 103 - 3,
        minMp: 87 - 3 ,
        minAttack: 44,
        minDefensive: 42,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
    },
    '水晶怪': {
        name: '水晶怪',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 90 - 3,
        minMp: 135 - 3 ,
        minAttack: 30,
        minDefensive: 44,
        minAgility: 26,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '肯吉罗岛') {
                await leo.autoWalkList([[546, 327],[546, 325]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.camp.x)
                await leo.autoWalkList([
                    [36, 87, '肯吉罗岛'],
                    [546, 325]
                ])
            }
        }
    },
    '走路花妖': {
        name: '走路花妖',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 81 - 3,
        minMp: 96 - 3 ,
        minAttack: 45,
        minDefensive: 40,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '布拉基姆高地') {
                await leo.autoWalkList([[165, 243]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([[165, 153]])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='梅布尔隘地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(2, leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalkList([[256, 166, '布拉基姆高地'], [165, 243]])
            }
        }
    },
    '绿烟': {
        name: '绿烟',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 126 - 3 ,
        minAttack: 36,
        minDefensive: 34,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地') {
                await leo.autoWalkList([[221,165],[219,165]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([219,165])
            }
        }
    },
    '骷髅海盗': {
        name: '骷髅海盗',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 95 - 3,
        minMp: 96 - 3,
        minAttack: 41,
        minDefensive: 52,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        autoBattle: [{
            user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e=>e.name=='赤熊'&&e.level>1),
            type: '攻击',
            targets: context => context.enemies.filter(e=>e.name=='赤熊'&&e.level>1).map(e=>e.pos)
        },{
            user: 2, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e=>e.name=='赤熊'&&e.level>1),
            skillName: '攻击',
            targets: context => context.enemies.filter(e=>e.name=='赤熊'&&e.level>1).map(e=>e.pos)
        }],
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地') {
                await leo.autoWalkList([[184, 104],[182, 104]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([182, 104])
            }
        }
    },
    '马优尔': {
        name: '马优尔',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 108 - 3,
        minMp: 107 - 3 ,
        minAttack: 43,
        minDefensive: 40,
        minAgility: 34,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·南') {
                await leo.autoWalkList([[178,109],[176,109]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([228,178,'方堡盆地·南'])
                await leo.autoWalk([176,109])
            }
        }
    },
    '葡萄酒粉怪': {
        name: '葡萄酒粉怪',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 91 - 3,
        minMp: 83 - 3 ,
        minAttack: 49,
        minDefensive: 36,
        minAgility: 35,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·南') {
                await leo.autoWalkList([[237,152],[235,152]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([228,178,'方堡盆地·南'])
                await leo.autoWalk([235,152])
            }
        }
    },
    '猫脸女神巴斯铁特': {
        name: '猫脸女神巴斯铁特',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 99 - 3,
        minMp: 109 - 3 ,
        minAttack: 38,
        minDefensive: 41,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        autoBattle: [{
            user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e=>e.name=='马优尔'&&e.level>1),
            type: '攻击',
            targets: context => context.enemies.filter(e=>e.name=='马优尔'&&e.level>1).map(e=>e.pos)
        },{
            user: 2, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e=>e.name=='马优尔'&&e.level>1),
            skillName: '攻击',
            targets: context => context.enemies.filter(e=>e.name=='马优尔'&&e.level>1).map(e=>e.pos)
        }],
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·南') {
                await leo.autoWalkList([[178,109],[176,109]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([228,178,'方堡盆地·南'])
                await leo.autoWalk([176,109])
            }
        }
    },
    '亭登': {
        name: '亭登',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 107 - 3,
        minMp: 101 - 3 ,
        minAttack: 33,
        minDefensive: 49,
        minAgility: 31,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·南') {
                await leo.autoWalkList([[215,136],[217,136]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([228,178,'方堡盆地·南'])
                await leo.autoWalk([217,136])
            }
        }
    },
    '剑鸵鸟': {
        name: '剑鸵鸟',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 106 - 3,
        minMp: 88 - 3 ,
        minAttack: 36,
        minDefensive: 36,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·西') {
                await leo.autoWalkList([[144,155],[142,155]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([163,77,'方堡盆地·西'])
                await leo.autoWalk([142,155])
            }
        }
    },
    '丘陵鲨': {
        name: '丘陵鲨',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 102 - 3,
        minMp: 75 - 3 ,
        minAttack: 40,
        minDefensive: 31,
        minAgility: 37,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·西') {
                await leo.autoWalkList([[230,123],[231,125]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([163,77,'方堡盆地·西'])
                await leo.autoWalk([231,125])
            }
        }
    },
    '毒蜥蜴': {
        name: '毒蜥蜴',
        sealCardName: '封印卡（龙系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 119 - 3,
        minMp: 97 - 3 ,
        minAttack: 43,
        minDefensive: 34,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·西') {
                await leo.autoWalkList([[183,173],[181,173]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([163,77,'方堡盆地·西'])
                await leo.autoWalk([181,173])
            }
        }
    },
    '毒龙骨': {
        name: '毒龙骨',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 76 - 3,
        minMp: 118 - 3 ,
        minAttack: 42,
        minDefensive: 33,
        minAgility: 32,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        autoBattle: [{
            user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e=>e.name=='剑鸵鸟'&&e.level>1),
            type: '攻击',
            targets: context => context.enemies.filter(e=>e.name=='剑鸵鸟'&&e.level>1).map(e=>e.pos)
        },{
            user: 2, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
            check: context => context.enemies.find(e=>e.name=='剑鸵鸟'&&e.level>1),
            skillName: '攻击',
            targets: context => context.enemies.filter(e=>e.name=='剑鸵鸟'&&e.level>1).map(e=>e.pos)
        }],
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '方堡盆地·西') {
                await leo.autoWalkList([[144,155],[142,155]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.loop(async ()=>{
                    if(cga.GetMapName()=='方堡盆地') {
                        return leo.reject();
                    }
                    await leo.talkNpc(0,leo.talkNo)
                    await leo.delay(2000)
                })
                await leo.autoWalk([163,77,'方堡盆地·西'])
                await leo.autoWalk([142,155])
            }
        }
    },
    '银狮': {
        name: '银狮',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 98 - 3,
        minMp: 74 - 3 ,
        minAttack: 47,
        minDefensive: 32,
        minAgility: 36,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '布拉基姆高地') {
                await leo.autoWalkList([[173,117],[171,117]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([157, 93])
                await leo.turnDir(0)
                await leo.delay(2000)
                await leo.autoWalkList([
                    [190, 116, '盖雷布伦森林'],
                    [231, 222, '布拉基姆高地'],[171,117]
                ])
            }
        }
    },
    '大炸弹': {
        name: '大炸弹',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 78 - 3,
        minMp: 128 - 3,
        minAttack: 36,
        minDefensive: 34,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪拉威森塔３９层') {
                await leo.autoWalkList([[100, 127],[96, 127]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([[73,56],[72,56,'雪拉威森塔４０层']])
                await leo.autoWalk([96,83,'雪拉威森塔３９层'])
                await leo.autoWalkList([
                    [239,176],[257,176],[257,224],[262,224],[262,235],
                    [266,235],[266,224],[270,224],[270,236],[277,236],
                    [277,218],[274,218],[274,204],[281,204],[281,212],
                    [285,212],[285,208],[289,208],[289,192],[301,192],
                    [301,196],[305,196],[305,193],[310,193],[310,196],
                    [317,196],[317,186],[313,186],[313,180],[329,180],
                    [329,164],[311,164],[311,175],[287,175],[287,180],
                    [273,180],[273,135],[265,135],[265,115],[252,115],
                    [252,124],[237,124],[237,120],[242,120],[242,111],
                    [249,111],[249,80],[233,80],[233,92],[225,92],
                    [225,88],[229,88],[229,56],[225,56],[225,68],
                    [221,68],[221,93],[217,93],[217,96],[233,96],
                    [233,136],[221,136],[221,120],[217,120],[217,108],
                    [185,108],[185,88],[169,88],[169,84],[165,84],
                    [165,80],[157,80],[157,84],[153,84],[153,88],
                    [145,88],[145,92],[141,92],[141,88],[137,88],
                    [137,121],[113,121],[113,144],[100,144],[100,127],
                    [96,127]
                ])
            }
        }
    },
    '宝贝炸弹': {
        name: '宝贝炸弹',
        sealCardName: '封印卡（特殊系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 80 - 3,
        minMp: 131 - 3,
        minAttack: 34,
        minDefensive: 32,
        minAgility: 29,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
    },
    '地底龟': {
        name: '地底龟',
        sealCardName: '封印卡（野兽系)',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 102 - 3,
        minMp: 96 - 3,
        minAttack: 37,
        minDefensive: 47,
        minAgility: 28,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪拉威森塔３９层') {
                await leo.autoWalkList([[250,245]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([[73,56],[72,56,'雪拉威森塔４０层']])
                await leo.autoWalk([96,83,'雪拉威森塔３９层'])
                await leo.autoWalkList([
                    [250,245]
                ])
            }
        }
    },
    '颚牙': {
        name: '颚牙',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 4,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 117 - 3,
        minMp: 72 - 3,
        minAttack: 41,
        minDefensive: 47,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪拉威森塔３９层') {
                await leo.autoWalkList([[148,302]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([[73,56],[72,56,'雪拉威森塔４０层']])
                await leo.autoWalk([96,83,'雪拉威森塔３９层'])
                await leo.autoWalkList([
                    [148,302]
                ])
            }
        }
    },
    '刀鸡': {
        name: '刀鸡',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 78 - 3,
        minMp: 90 - 3,
        minAttack: 42,
        minDefensive: 33,
        minAgility: 37,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪拉威森塔７６层') {
                await leo.autoWalkList([[56, 110]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [24,44,'雪拉威森塔７５层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [133,133],[133,140],[120,140],[120,149],[109,149],
                    [109,157],[91,157],[91,151],[91,150,'雪拉威森塔７６层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [93,148],[116,148],[116,132],[140,132],[140,125],
                    [122,125],[121,125,'雪拉威森塔７５层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106,125]
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106,52],[104,52],[104,19],[93,19],[93,18,'雪拉威森塔７６层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [56, 110]
                ])
            }
        }
    },
    '魔术机甲': {
        name: '魔术机甲',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 110 - 3,
        minMp: 87 - 3,
        minAttack: 38,
        minDefensive: 45,
        minAgility: 33,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if(currentMap=='雪拉威森塔９３层'){
                await leo.autoWalkList([[164, 105]])
            }else{
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [16,44,'雪拉威森塔９５层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [99,44,'雪拉威森塔９４层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [89,134,'雪拉威森塔９３层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [164, 105]
                ])
            }
        }
    },
    '碎碎地雷': {
        name: '碎碎地雷',
        sealCardName: '封印卡（金属系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 94 - 3,
        minMp: 90 - 3,
        minAttack: 40,
        minDefensive: 47,
        minAgility: 27,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if(currentMap=='雪拉威森塔９４层'){
                await leo.autoWalkList([[99, 62]])
            }else{
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [16,44,'雪拉威森塔９５层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [99,44,'雪拉威森塔９４层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [99, 62]
                ])
            }
        }
    },
    '红鬼': {
        name: '红鬼',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 95 - 3,
        minMp: 98 - 3,
        minAttack: 50,
        minDefensive: 36,
        minAgility: 36,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if(currentMap=='雪拉威森塔９２层'){
                await leo.autoWalkList([[106, 96]])
            }else{
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [18, 44, '雪拉威森塔９０层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [43, 26, '雪拉威森塔９１层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [44, 109, '雪拉威森塔９２层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106, 96]
                ])
            }
        }
    },
    '巫师之鬼': {
        name: '巫师之鬼',
        sealCardName: '封印卡（不死系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 102 - 3,
        minMp: 97 - 3,
        minAttack: 42,
        minDefensive: 37,
        minAgility: 39,
        index: 1,
        gradeMin: 1,    //高于该档次的宠判断丢弃
        gradeMax:20,    //低于该档次的宠判断丢弃
        gradeType: 0,   //扔宠类型 0-gradeMin，2-gradeMax，7-both
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '强力火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '雪拉威森塔７７层') {
                await leo.autoWalkList([[89, 26]])
            } else {
                await leo.logBack()
                //await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalk([165,153])
                await leo.talkNpc(2,leo.talkYes,'利夏岛')
                await leo.autoWalk([90,99,'国民会馆'])
                await leo.autoWalk([107,52])
                await leo.supply(108, 52)
                await leo.autoWalk([108,39,'雪拉威森塔１层'])
                await leo.autoWalkList([
                    [73,56],[75,50,'雪拉威森塔５０层'],
                    [24,44,'雪拉威森塔７５层'],
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [133,133],[133,140],[120,140],[120,149],[109,149],
                    [109,157],[91,157],[91,151],[91,150,'雪拉威森塔７６层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [93,148],[116,148],[116,132],[140,132],[140,125],
                    [122,125],[121,125,'雪拉威森塔７５层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106,125]
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [106,52],[104,52],[104,19],[93,19],[93,18,'雪拉威森塔７６层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([
                    [95,17],[95,16,'雪拉威森塔７７层']
                ])
                await leo.checkHealth(doctorName)
                await leo.autoWalkList([[89, 26]])
            }
        }
    },
} 
const getPetConfig = (petName) => {
    return petConfig[petName];
}
const list = () => {
    return Object.entries(petConfig).map(x=>x[0]);
}
const getVersion = () => {
    return version;
}
const tips = async (cga) => {
    const leo = cga.emogua;
    await leo.log('已成功加载封印师常规合集抓宠插件，插件版本['+version+']')
    let petList = list();
    await leo.log('当前版本支持抓取'+petList.length+'种常规宠物：')
    let content = '';
    for (var i = 0; i < petList.length; i++) {
        const index = i+1;
        let petName = (index.toString().padStart(3, '0') + '-' + petList[i]).toString().padEnd(10, 'ㅤ');
        content += petName;
        if(index%5==0 || index == petList.length){
            console.log(content)
            content = '';
        }
    }
}
module.exports = {
    getPetConfig,
    list,
    getVersion,
    tips
}
