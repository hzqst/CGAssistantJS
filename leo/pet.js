const version = '1.2';
const doctorName = '医道之殇';
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[670, 310],[668, 310]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        autoDropPet: false, //是否自动扔宠，true扔/false不扔
        minHp: 88 - 3,
        minMp: 82 - 3,
        minAttack: 46,
        minDefensive: 36,
        minAgility: 39,
        index: 1,
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[286, 372],[284, 372]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[430, 400],[428, 400]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[290, 216],[292, 214]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            if (cga.getMapInfo().indexes.index3 == 21025) {
                await leo.autoWalkList([[44, 5],[44, 4]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '角笛大风穴') {
                await leo.autoWalkList([[127, 31],[127, 29]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[460, 330],[457, 329]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.talkNpc(0,leo.talkNo,'方堡盆地')
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        minHp: 120 - 3,
        minMp: 89 - 3,
        minAttack: 44,
        minDefensive: 35,
        minAgility: 32,
        index: 1,
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.elsa.x)
                await leo.autoWalkList([
                    [130, 50, '盖雷布伦森林'],
                    [215, 43]
                ])
                await leo.talkNpc(0,leo.talkNo,'方堡盆地')
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[237,203],[235,203]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[237,326],[235,326]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '灵堂') {
                await leo.autoWalkList([[30,51],[30,49]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.castle.x)
                await leo.autoWalkList([
                    [47,85,'召唤之间'],[27,8,'回廊'],[23,19,'灵堂'],[30,49]
                ])
            }
        }
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
                    [15,3,'诅咒的迷宫 地下7楼'],
                    [16,20]
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[117, 324],[119, 320]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[13, 15],[15, 15]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        autoDropPet: false, //是否自动扔宠，true扔/false不扔
        minHp: 97 - 3,
        minMp: 99 - 3,
        minAttack: 37,
        minDefensive: 33,
        minAgility: 34,
        index: 1,
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '诅咒的迷宫 地下13楼') {
                await leo.autoWalkList([[23,5],[25,5]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
                await leo.talkNpc(6,leo.talkYes,'诅咒的迷宫 地下11楼')
                await leo.autoWalkList([
                    [15,4,'诅咒的迷宫 地下12楼'],[24,15,'诅咒的迷宫 地下13楼'],
                    [25,5]
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
                await leo.autoWalkList([[484, 170],[482, 170]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.eout)
                await leo.autoWalkList([
                    [482, 170]
                ])
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '莎莲娜') {
                await leo.autoWalkList([[255, 593],[257, 593]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[282, 488],[280, 488]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[420, 357],[422, 357]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.vinoy)
                await leo.autoWalkList([
                    [67, 46, '芙蕾雅'],
                    [422, 357]
                ])
            }
        }
    },
    '迷你蝙蝠': {
        name: '迷你蝙蝠',
        sealCardName: '封印卡（飞行系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 78 - 3,
        minMp: 80 - 3,
        minAttack: 39,
        minDefensive: 37,
        minAgility: 34,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[478, 193],[478, 194]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.falan.eout)
                await leo.autoWalkList([
                    [478, 194]
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 1,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '地水的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '角笛大风穴') {
                await leo.autoWalkList([[9, 31],[10, 33]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        minHp: 103 - 3,
        minMp: 84 - 3 ,
        minAttack: 35,
        minDefensive: 45,
        minAgility: 26,
        index: 1,
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[527, 333],[529, 333]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [71, 19, '莎莲娜'],
                    [529, 333]
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[483, 217],[485, 217]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            if (cga.getMapInfo().indexes.index3 == 21025) {
                await leo.autoWalkList([[22,29]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
                    [7,4,'通路'],[33,3,21025],[22,29]
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '水火的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '维诺亚洞穴 地下1楼') {

            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        minHp: 89 - 3,
        minMp: 115 - 3,
        minAttack: 41,
        minDefensive: 45,
        minAgility: 31,
        index: 1,
        gradeMin: 0,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚') {
                await leo.autoWalkList([[282, 400],[280, 400]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '诅咒的迷宫 地下18楼') {
                await leo.autoWalkList([[23,13],[21,13]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
                await leo.talkNpc(6,leo.talkYes,'诅咒的迷宫 地下11楼')
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
        minMp: 99 - 3,
        minAttack: 33,
        minDefensive: 45,
        minAgility: 27,
        index: 1,
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
                        if(cga.GetMapName().name == '莎莲娜') {
                            await leo.autoWalk([84, 193,'积雪的山路海拔100M'])
                        }
                        if(cga.GetMapName().name == '雪山之顶') {
                            return leo.reject();
                        }
                        if(cga.GetMapName().name.includes('积雪的山路海拔')){
                            await leo.walkRandomMazeUntil(() => {
                                if (!cga.GetMapName().name.includes('积雪的山路海拔')) {
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '风地的水晶（5：5）',
        petSkillName: '强力陨石魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var mapInfo = cga.getMapInfo();
            if (mapInfo.name == '沙漠之庙' && mapInfo.indexes.index3 == 13021) {
                await leo.autoWalkList([[18,31],[18,34]])
            } else {
                if(mapInfo.name != '索奇亚') {
                    await leo.logBack()
                    await leo.sellCastle()
                    await leo.checkHealth(doctorName)
                    await leo.checkCrystal(this.crystalName)
                    await leo.goto(n => n.teleport.ghana)
                    await leo.autoWalk([48,77, '索奇亚'])
                }
                console.log(leo.logTime()+'到达索奇亚，开始寻找迷宫入口');
                await leo.loop(async ()=>{
                    try{
                        if(cga.GetMapName() == '索奇亚'){
                            var gotoTarget = () => {
                                var targetEntryArr = {
                                    '砂漠之祠' : [
                        [660,290],[640,290],[620,290],[600,290],[580,290],[560,290],[540,290],
                        [540,310],[560,310],[580,310],[600,310],[620,310],[640,310],[660,310],
                        [660,330],[640,330],[620,330],[600,330],[580,330],[560,330],[540,330],
                        [540,350],[560,350],[580,350],[600,350],[620,350],[640,350],[600,350],
                        [660,370],[640,370],[620,370],[600,370],[580,370],[560,370],[540,370]
                                    ]
                                }
                                var index = -1;
                                var targetEntryAreaArr = targetEntryArr['砂漠之祠'];
                                var findHoleEntry = ()=>{
                                    var mapInfo = leo.getMapInfo();
                                    if(mapInfo.name == '砂漠之祠地下1楼'){
                                        return leo.next();
                                    }
                                    index++;
                                    if(index >= targetEntryAreaArr.length){
                                        return leo.log('没有找到迷宫入口');
                                    }
                                    if (mapInfo.name == '索奇亚') {
                                        console.log(leo.logTime()+targetEntryAreaArr[index])
                                        return leo.moveNearest(targetEntryAreaArr[index])
                                        .then(()=>{
                                            var npcExcept = ['部下葛霸','部下葛克','甘卡佐','夏瓦特','古代石碑','地之石碑'];
                                            var mazeEntry = cga.GetMapUnits().filter(u => (u.flags & leo.UnitFlags.NpcEntry) && u.model_id > 0 && !npcExcept.includes(u.unit_name));
                                            if(mazeEntry && mazeEntry.length>0){
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
                        if(cga.GetMapName().includes('砂漠之祠地下')){
                            await leo.walkRandomMazeUntil(() => {
                                if (cga.GetMapName() == '索奇亚') {
                                    return true;
                                }
                                if (cga.GetMapName() == '沙漠之庙  地下6楼') {
                                    return true;
                                }
                                return false;
                            },false)
                        }
                        if(cga.GetMapName() == '沙漠之庙  地下6楼') {
                            return leo.reject();
                        }
                        await leo.delay(1000)
                    }catch(e){
                        await leo.log('迷宫刷新，e:' + e)
                        await leo.delay(60000)
                    }
                })
                // 沙漠之庙  地下6楼
                await leo.autoWalkList([
                    [14, 13, '沙漠之庙'],
                    [43, 19]
                ])
                await leo.talkNpc(4, leo.talkYes)   //拿到古代王族的血壶
                await leo.autoWalk([12,31])
                await leo.talkNpc(2, leo.talkYes, '*')  //13020
                await leo.autoWalk([10,37, 13017])
                await leo.autoWalk([10,8])
                await leo.talkNpc(0, leo.talkYes)   //拿到古代莎草制绷带
                await leo.autoWalk([10,11, 13020])
                await leo.autoWalk([12,33])
                await leo.talkNpc(6, leo.talkYes, '*')  //13016
                await leo.autoWalk([66,23])
                await leo.talkNpc(2, leo.talkYes, '*')  //13020
                await leo.autoWalk([73,30, 13019])
                await leo.autoWalk([15,4])
                await leo.talkNpc(0, leo.talkYes)   //拿到红光的古代石
                await leo.autoWalk([7,6, 13020])
                await leo.autoWalk([66,33, 13018])
                await leo.autoWalk([19,18])
                await leo.talkNpc(2, leo.talkYes, '*')  //13021
                await leo.autoWalk([18,34])
            }
        }
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[523, 348],[525, 348]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [525, 348]
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
    '印第安仙人掌 ': {
        name: '印第安仙人掌 ',
        sealCardName: '封印卡（植物系）',
        sealCardLevel: 1,
        autoDropPet: true, //是否自动扔宠，true扔/false不扔
        minHp: 105 - 3,
        minMp: 89 - 3 ,
        minAttack: 44,
        minDefensive: 40,
        minAgility: 27,
        index: 1,
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[339, 316],[341, 316]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[453, 389],[451, 389]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.ghana)
                await leo.autoWalkList([
                    [47, 77, '索奇亚'],
                    [451, 389]
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[54, 163],[56, 163]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[78, 346],[80, 346]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
                await leo.checkHealth(doctorName)
                await leo.checkCrystal(this.crystalName)
                await leo.goto(n => n.teleport.jenova)
                await leo.autoWalkList([
                    [24, 40, '莎莲娜'],
                    [196, 443, '莎莲娜海底洞窟 地下1楼'],
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.autoWalkList([[414, 564],[416, 564]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
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
                await leo.sellCastle()
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
        gradeMin: 2,    //高于该档次的宠判断丢弃
        gradeFirst: false, //true-启用快速算档，只返回第一个命中的档次，注意该档次有可能不是最低的档次
        gradeLog: true, //打印算档日志
        gradeLogMax: 5, //最多显示多少行日志
        crystalName: '火风的水晶（5：5）',
        petSkillName: '火焰魔法-Ⅰ',
        async walk(cga){
            const leo = cga.emogua;
            //地图判断，如果已经在1级宠捕捉点，则继续捕捉
            var currentMap = cga.GetMapName();
            if (currentMap == '索奇亚海底洞窟 地下2楼') {
                await leo.autoWalkList([[6, 47],[8, 47]])
            } else {
                await leo.logBack()
                await leo.sellCastle()
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
        let petName = (index.toString().padStart(2, '0') + '-' + petList[i]) + '\t';
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
