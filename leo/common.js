module.exports = require('./wrapper').then(cga => {
    global.leo = cga.emogua;
    leo.version = '4.1';
    leo.qq = '158583461'
    leo.copyright = '红叶散落';
    leo.FORMAT_DATE = 'yyyy-MM-dd';
    leo.FORMAT_DATETIME = 'yyyy-MM-dd hh:mm:ss';
    leo.FORMAT_TIME = 'hh:mm:ss';
    leo.fs = require('fs');
    leo.splitter = '\\';
    leo.rootPath = __dirname;
    //日期格式化 var dateStr = leo.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
    leo.formatDate = (date, fmt) => {
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            'S': date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        return fmt;
    }
    leo.now = () => {
        return new Date();
    }
    leo.nowStr = (fmt = leo.FORMAT_TIME) => {
        return leo.formatDate(leo.now(), fmt);
    }
    //当前时间
    leo.logTime = () => {
        return '[' + leo.nowStr() + ']';
    }
    //计算比率，保留两位小数
    leo.getRatio = (a, b) => {
        if (b == 0) {
            return 0;
        } else {
            return (a / b).toFixed(2);
        }
    }
    //人物卡时信息
    leo.getPunchClockStr = (a, b) => {
        a = a / 1000;
        var h = Math.floor(a / 3600) < 10 ? '0' + Math.floor(a / 3600) : Math.floor(a / 3600);
        var m = Math.floor((a / 60 % 60)) < 10 ? '0' + Math.floor((a / 60 % 60)) : Math.floor((a / 60 % 60));
        var s = Math.floor((a % 60)) < 10 ? '0' + Math.floor((a % 60)) : Math.floor((a % 60));
        var str = `${h}:${m}:${s}`;
        if (b) {
            str += ' (已打卡)';
        } else {
            str += ' (未打卡)';
        }
        return str;
    }
    //控制台基础信息打印
    leo.baseInfoPrint = () => {
        //人物信息
        var playerinfo = cga.GetPlayerInfo();
        console.log('人物信息： LV' + playerinfo.level + ' 【 ' + playerinfo.name + ' 】【 ' + playerinfo.job + ' 】');
        console.log('生命：' + playerinfo.hp + '/' + playerinfo.maxhp + ' (' + leo.getRatio(playerinfo.hp, playerinfo.maxhp) + ')');
        console.log('魔法： ' + playerinfo.mp + '/' + playerinfo.maxmp + ' (' + leo.getRatio(playerinfo.mp, playerinfo.maxmp) + ')');
        console.log('健康： ' + playerinfo.health + '  掉魂： ' + playerinfo.souls);
        console.log('金钱： ' + playerinfo.gold + '  卡时： ' + leo.getPunchClockStr(playerinfo.punchclock, playerinfo.usingpunchclock));
        //装备信息
        console.log('装备信息： ');
        var items = cga.getEquipItems();
        for (var i in items) {
            var item = items[i];
            var index = parseInt(i) + 1;
            var arr = cga.getEquipEndurance(item);
            var lv = item.level < 10 ? (item.level + ' ') : item.level;
            console.log(index + '： LV' + lv + ' ' + item.name + '  (' + arr[0] + '/' + arr[1] + ')');
        }
        //出战宠物
        var petinfo = cga.GetPetInfo(playerinfo.petid);
        console.log('出战宠物： LV' + petinfo.level + ' ' + petinfo.realname + '  (' + petinfo.name + ')');
        console.log('生命： ' + petinfo.hp + '/' + petinfo.maxhp + ' (' + leo.getRatio(petinfo.hp, petinfo.maxhp) + ')');
        console.log('魔法： ' + petinfo.mp + '/' + petinfo.maxmp + ' (' + leo.getRatio(petinfo.mp, petinfo.maxmp) + ')');
        console.log('健康： ' + petinfo.health);
        //宠物信息
        console.log('宠物信息： ');
        leo.petInfoPrint();
    }
    //打印宠物信息
    leo.petInfoPrint = (pets = cga.GetPetsInfo()) => {
        for (var i in pets) {
            var pet = pets[i];
            var index = parseInt(pet.index) + 1;
            console.log(index + '： LV' + pet.level + ' ' + pet.realname + '  (' + pet.name + ')');
        }
    }
    //练级统计信息打印
    leo.statistics = (beginTime = leo.beginTime,oldXp = leo.oldXp) => {
    	var playerinfo = cga.GetPlayerInfo();
	    var nowTime = leo.now();
		var time = parseInt((nowTime - beginTime)/1000/60);//已持续练级时间
		time = time==0?1:time;
		var nowLevel = playerinfo.level;
	    var nowXp = playerinfo.xp;
	    var nowMaxXp = playerinfo.maxxp;
	    var getXp = parseInt((nowXp - oldXp)/10000);
	    var avgXp = parseInt(60 * getXp/time);
	    var nextXp = nowLevel==160?0:parseInt((nowMaxXp-nowXp)/10000);
	    var levelUpTime = parseInt(60 * nextXp/(avgXp==0?1:avgXp));

	    var content = `已持续练级【${time}】分钟，共获得【${getXp}万】经验，平均每小时【${avgXp}万】经验，当前等级【${nowLevel}】，距离下一级还差【${nextXp}万】经验，大约需要【${levelUpTime}】分钟`;
	    if(nowLevel==160){
	    	return leo.done();//满级不打印信息
	    }else{
	    	 return leo.log(content);
	    }
    }
    leo.resolve = (result) => {
        return Promise.resolve(result);
    }
    leo.reject = (err) => {
        return Promise.reject(err);
    }
    //人物说话
    leo.say = (words = '', color = 1, range = 3, size = 1) => {
        cga.SayWords(words, color, range, size);
        return leo.resolve();
    }
    //人物说话和控制台都打印内容
    leo.log = (words = '') => {
        console.log(leo.logTime() + words);
        return leo.say(leo.logTime() + words);;
    }
    //流程控制辅助函数，无实际功能
    leo.todo = leo.next = leo.done = leo.end = (result) => {
        return leo.resolve(result);
    }
    //循环体，参数为function，返回true则继续循环，返回false退出循环
    leo.loop = leo.recursion;
    //右键转向(0-东，2-南，4-西，6-北)
    leo.turnDir = leo.turnOrientation;
    leo.clickTo = (x,y) => {
        cga.TurnTo(x,y);
        return leo.delay(1000);
    };
    leo.pickup = (x,y) => {
        var movablePos = leo.getMovablePositionAround({x,y});
        if(movablePos){
            return leo.autoWalk([movablePos.x,movablePos.y])
            .then(()=>leo.clickTo(x,y));
        }
    }
    leo.isInTeam = () => {
        var teamplayers = cga.getTeamPlayers();
        return teamplayers.length > 1;
    }
    leo.getTeamPlayerAll = () => {
        var teamPlayers = cga.getTeamPlayers();
        if(teamPlayers.length == 0){
            var playerinfo = cga.GetPlayerInfo();
            var teamPlayer = {
                name : playerinfo.name,
                level : playerinfo.level,
                injury : playerinfo.health > 0 ? 1 : 0,
                is_me : true
            }
            teamPlayers.push(teamPlayer);
        }
        return teamPlayers;
    }
    //队长创建队伍
    leo.buildTeam = (teamPlayerCount, teammates) => {
        if (teammates && teammates.length > 0) {
            teamPlayerCount = teammates.length;
        }
        cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
        if (teamPlayerCount <= 1) {
            return leo.next(); //单人队伍，直接下一步
        }
        return leo.todo().then(() => {
            var teamplayers = cga.getTeamPlayers();
            if (teamplayers.length == teamPlayerCount) {
                //检查是否是预设的队员
                if (teammates && teammates.length > 0) {
                    for (var i = 0; i < teamplayers.length; ++i) {
                        if (!is_array_contain(teammates, teamplayers[i].name)) {
                            //踢出不在预设队伍成员的未知队员
                            return leo.todo().then(() => cga.DoRequest(cga.REQUEST_TYPE_KICKTEAM)).then(
                                () => leo.waitNPCDialog(dlg => {
                                    var stripper = '你要把谁踢出队伍？';
                                    if (dlg && dlg.message && dlg.message.indexOf(stripper) >= 0) {
                                        var strip = dlg.message.substr(dlg.message.indexOf(stripper) + stripper.length);
                                        strip = strip.replace(/\\z/g, '|');
                                        strip = strip.replace(/\\n/g, '|');
                                        //console.log(strip);
                                        var reg = new RegExp(/([^|\n]+)/g)
                                        var match = strip.match(reg);
                                        //console.log(match);
                                        for (var j = 0; j < match.length; ++j) {
                                            if (match[j] == teamplayers[i].name) {
                                                cga.ClickNPCDialog(0, j / 2);
                                                break;
                                            }
                                        }
                                        return leo.delay(1000);
                                    }
                                })).then(() => leo.buildTeam(teamPlayerCount, teammates));
                        }
                    }
                }
                return leo.done();
            } else {
                return leo.delay(3000).then(
                    () => leo.buildTeam(teamPlayerCount, teammates));
            }
        });
    }
    leo.buildTeamBlock = (teamPlayerCount,teammates = [])=>{
        return leo.buildTeam(teamPlayerCount)
        .then(() => {
            var teamplayers = cga.getTeamPlayers();
            //console.log(teamplayers);
            if (teamplayers && teamplayers.length == teamPlayerCount) {
                for (var i in teamplayers) {
                    teammates[i] = teamplayers[i].name;
                }
            }
            return leo.log('组队完成，队员[' + teammates.toString() + ']');
        });
    }
    //队员进入队伍，参数为队长名字
    leo.enterTeam = (teamLeader) => {
        var teamplayers = cga.getTeamPlayers();
        if (teamplayers.length > 0 && teamplayers[0].name == teamLeader) {
            return leo.done();
        } else if (teamplayers.length > 1) {
            return leo.leaveTeam().then(() => leo.enterTeam(teamLeader));
        } else {
            return leo.todo().then(() => {
                var leaderInfo = cga.findPlayerUnit(teamLeader);
                var mypos = cga.GetMapXY();
                if (leaderInfo == null || !cga.isDistanceClose(leaderInfo.xpos, leaderInfo.ypos, mypos.x, mypos.y) || (leaderInfo.xpos == mypos.x && leaderInfo.ypos == mypos.y)) {
                    return leo.delay(1000).then(() => leo.enterTeam(teamLeader));
                } else {
                    return leo.turnTo(leaderInfo.xpos, leaderInfo.ypos).then(
                        () => cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM)).then(
                        () => leo.waitNPCDialog(dialog => {
                            if (dialog.type === 2) {
                                cga.ClickNPCDialog(-1, dialog.message.split('\n').findIndex(e => e === teamLeader) - 2);
                                return leo.delay(1000);
                            }
                        })).then(() => leo.enterTeam(teamLeader));
                }
            });
        }
    }
    leo.enterTeamBlock = (teamLeader)=>{
        return leo.enterTeam(teamLeader)
        .then(() => {
            return leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
        });
    }

    //招魂
    leo.getBackSoul = () => {
        var playerinfo = cga.GetPlayerInfo();
        if (playerinfo.souls > 0) {
            return leo.log('触发登出补给:人物掉魂')
            .then(()=>leo.goto(n => n.castle.x))
            .then(() => leo.autoWalkList([
                    [41, 14, '法兰城'],
                    [154, 29, '大圣堂的入口'],
                    [14, 7, '礼拜堂'],
                    [12, 19]
            ]))
            .then(() => leo.talkNpc(6, leo.talkNpcSelectorYes))
            .then(() => leo.delay(1000))
            .then(() => leo.done());
        }else{
            return leo.done();
        }
    }
    //飞碟治疗人物，优先找指定名字的医生，如果找不到，则找随机的医生
    leo.healPlayer = (doctorName) => {
        var playerinfo = cga.GetPlayerInfo();
        if (playerinfo.health > 0) {
            return leo.log('触发登出补给:人物受伤')
            .then(()=>leo.goto(n => n.castle.x))
            .then(() => {
                const units = cga.GetMapUnits();
                let doctor;
                if (doctorName) {
                    doctor = units.find(u => (u.flags & leo.UnitFlags.Player) && u.unit_name == doctorName);
                }
                if (!doctor) {
                    doctor = units.find(u => (u.flags & leo.UnitFlags.Player) && (u.nick_name.indexOf('治疗') >= 0 || u.nick_name.indexOf('医') >= 0 || u.title_name.indexOf('医') >= 0));
                }
                if (doctor) {
                    return leo.walkTo(cga.getRandomSpace(doctor.xpos, doctor.ypos)).then(
                        () => leo.enterTeam(doctor.unit_name)).then(
                        () => leo.delay(8000)).then(leo.leaveTeam).then(() => {
                        playerinfo = cga.GetPlayerInfo();
                        if (playerinfo.health > 0) {
                            return leo.healPlayer(doctorName);
                        } else {
                            return leo.done();
                        }
                    });
                }
                return leo.delay(10000).then(() => leo.healPlayer(doctorName));
            });
        }else{
            return leo.done();
        }
    }
    //治疗宠物
    leo.healPet = () => {
        var pets = cga.GetPetsInfo();
        var petHurt = pets.findIndex(e => e.health > 0) > -1;
        if (petHurt) {
            return leo.log('触发登出补给:宠物受伤')
            .then(()=>leo.goto(n => n.falan.e2))
            .then(() => leo.autoWalkList([
                [221, 83, '医院'],
                [12, 18]
            ]))
            .then(() => leo.talkNpc(10, 18, (dialog) => {
                cga.ClickNPCDialog(-1, 6);
                return false;
            }))
            .then(() => leo.logBack());
        }else{
            return leo.done();
        }
    }
    //护士补血魔，方向(0-东，2-南，4-西，6-北)
    leo.supplyDir = leo.recharge;
    //护士补血魔，x,y为护士坐标
    leo.supply = (x, y) => {
        return leo.turnTo(x, y).then(() => leo.delay(5000));
    }
    leo.supplyCastle = () => {
        var needSupply = false;
        var playerinfo = cga.GetPlayerInfo();
        if(playerinfo.hp < playerinfo.maxhp || playerinfo.mp < playerinfo.maxmp){
            needSupply = true;
        }
        var pets = cga.GetPetsInfo();
        if(pets && pets.length > 0){
            for(var i in pets){
                if(pets[i].hp < pets[i].maxhp || pets[i].mp < pets[i].maxmp){
                    needSupply = true;
                }
            }
        }
        if(needSupply){
            var currentMap = cga.GetMapName();
            if(currentMap=='艾尔莎岛' || currentMap=='里谢里雅堡' || currentMap=='法兰城'){
                return leo.goto(n => n.castle.nurse)
                .then(()=>leo.supply(35,88))
                .then(()=>leo.logBack());
            }
        }
    }
    leo.sellCastle = (options) => {
        var needSell = false;
        var filter = (item) => {
            if (item.name == '魔石' || item.name.indexOf('卡片') >= 0 || item.name == '锥形水晶') return true;
            else if (options && typeof options.sellFilter == 'function') {
                return options.sellFilter(item);
            }
            return false;
        };
        if (cga.getInventoryItems().filter(filter).length > 0) {
            needSell = true;
        }
        if(needSell){
            var currentMap = cga.GetMapName();
            if(currentMap=='艾尔莎岛' || currentMap=='里谢里雅堡' || currentMap=='法兰城'){
                return leo.goto(n => n.castle.x)
                .then(()=>leo.autoWalk([31,77]))
                .then(()=>leo.sell(4))
                .then(()=>leo.logBack());
            }
        }
    }
    leo.checkHealth = (doctorName,needSupply = true) => {
        var playerinfo = cga.GetPlayerInfo();
        var petinfo = cga.GetPetInfo(playerinfo.petid);
        return leo.todo()
        .then(()=>{
            if(playerinfo.souls>0 || playerinfo.health>0 
                || (petinfo && petinfo.health>0)){
                return leo.logBack()
                .then(()=>leo.getBackSoul())
                .then(()=>leo.healPlayer(doctorName))
                .then(()=>leo.healPet())
                .then(()=>leo.supplyCastle());
            }else{
                if(needSupply){
                    return leo.supplyCastle();
                }else{
                    return leo.next();
                }
            }
        });
    }
    leo.checkCrystal = (crystalName, equipsProtectValue = 100) => {
        if (!crystalName) {
            crystalName = '水火的水晶（5：5）';
        }
        //检查水晶的耐久
        var crystal = cga.GetItemsInfo().find(i => i.pos == 7);
        if(crystal && crystal.name == crystalName && cga.getEquipEndurance(crystal)[0] > equipsProtectValue){
            return leo.next();
        }else{
            //检查身上是否有备用水晶
            var items = cga.getInventoryItems();
            crystal = null;
            for (var i = 0; i < items.length; i++) {
                if(items[i].name == crystalName && cga.getEquipEndurance(items[i])[0] > equipsProtectValue){
                    crystal = items[i];
                }
            }
            if(crystal){
                cga.MoveItem(crystal.pos, 7, -1);
                return leo.next();
            }else{
                //登回城买、换水晶
                return leo.buyCrystal(crystalName,1)
                //.then(()=>leo.autoWalk([16,13]))
                .then(()=>leo.useItemEx(crystalName))
                .then(()=>leo.dropItemEx(crystalName))
                .then(()=>leo.logBack());
            }
        }
    }
    //自动购买和换平民装
    //装备栏顺序 0 头 1 衣服 2 左手 3 右手 4 鞋 5 左饰品 6 右饰品 7 水晶
    leo.autoEquipLv1 = (weaponName) => {
        var protectValue = 50;
        return leo.todo()
        .then(()=>{
            //检查头的耐久，未装备或者装备的耐久低于protectValue，则去更换
            var equipName = '平民帽';
            var equip = cga.GetItemsInfo().find(i => i.pos == 0);
            if(equip && cga.getEquipEndurance(equip)[0] > protectValue){
                return leo.next();
            }else{
                var equip2 = cga.GetItemsInfo().find(i => i.pos >= 8 && i.name == equipName && cga.getEquipEndurance(i)[0] == 150);
                if(equip2){
                    return leo.useItemEx(equip2.pos)
                    .then(()=>leo.dropItemEx(equipName));
                }else{
                    return leo.buyEquipProtectLv1(equipName)
                    .then(()=>leo.useItemEx(equipName))
                    .then(()=>leo.dropItemEx(equipName));
                }
            }
        })
        .then(()=>{
            //检查衣服的耐久，未装备或者装备的耐久低于protectValue，则去更换
            var equipName = '平民衣';
            var equip = cga.GetItemsInfo().find(i => i.pos == 1);
            if(equip && cga.getEquipEndurance(equip)[0] > protectValue){
                return leo.next();
            }else{
                var equip2 = cga.GetItemsInfo().find(i => i.pos >= 8 && i.name == equipName && cga.getEquipEndurance(i)[0] == 150);
                if(equip2){
                    return leo.useItemEx(equip2.pos)
                    .then(()=>leo.dropItemEx(equipName));
                }else{
                    return leo.buyEquipProtectLv1(equipName)
                    .then(()=>leo.useItemEx(equipName))
                    .then(()=>leo.dropItemEx(equipName));
                }
            }
        })
        .then(()=>{
            //检查鞋的耐久，未装备或者装备的耐久低于protectValue，则去更换
            var equipName = '平民鞋';
            var equip = cga.GetItemsInfo().find(i => i.pos == 4);
            if(equip && cga.getEquipEndurance(equip)[0] > protectValue){
                return leo.next();
            }else{
                var equip2 = cga.GetItemsInfo().find(i => i.pos >= 8 && i.name == equipName && cga.getEquipEndurance(i)[0] == 150);
                if(equip2){
                    return leo.useItemEx(equip2.pos)
                    .then(()=>leo.dropItemEx(equipName));
                }else{
                    return leo.buyEquipProtectLv1(equipName)
                    .then(()=>leo.useItemEx(equipName))
                    .then(()=>leo.dropItemEx(equipName));
                }
            }
        })
        .then(()=>{
            //检查武器的耐久，未装备或者装备的耐久低于protectValue，则去更换
            if(weaponName){
                var equipName = weaponName;
                var equip = cga.GetItemsInfo().find(i => (i.pos == 2 || i.pos == 3) && i.name == equipName);
                if(equip && cga.getEquipEndurance(equip)[0] > protectValue){
                    return leo.next();
                }else{
                    var equip2 = cga.GetItemsInfo().find(i => i.pos >= 8 && i.name == equipName && cga.getEquipEndurance(i)[0] == 150);
                    if(equip2){
                        return leo.useItemEx(equip2.pos)
                        .then(()=>leo.dropItemEx(equipName));
                    }else{
                        return leo.buyEquipWeaponLv1(equipName)
                        .then(()=>leo.useItemEx(equipName))
                        .then(()=>leo.dropItemEx(equipName));
                    }
                }
            }
        });
    }

    //魔币操作： cga.MOVE_GOLD_TOBANK = 1;cga.MOVE_GOLD_FROMBANK =  2;cga.MOVE_GOLD_DROP = 3
    leo.moveGold = (money, type) => {
        if (!type) {
            type = cga.MOVE_GOLD_TOBANK;
        }
        if(type == 3){
            cga.MoveGold(money, type);
            return leo.delay(1000);
        }else{
            return leo.turnDir(0).then(() => {
                cga.MoveGold(money, type);
                return leo.delay(1000);
            });
        }
    }
    //宠物操作： cga.MovePet(srcPos,dstPos);//0~4人物身上位置，100~104银行位置
    leo.movePet = (srcPos, dstPos) => {
        return leo.turnDir(0).then(() => {
            var r = cga.MovePet(srcPos, dstPos);
            //console.log(r)
            return leo.next();
        }).then(() => leo.delay(300));
    }
    //银行全存
    leo.saveToBankAll = (filter) => {
        return leo.saveToBank(filter);
    }
    //银行全取
    leo.getFormBankAll = (filter) => {
        // var items = cga.GetBankItemsInfo().map(i=>i.name);
        // let result = Promise.resolve();
        // if (items.length > 0) {
        // 	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        // 		result = result.then(() => {
        // 			return leo.getFromBank(items[itemIndex]).then(()=>leo.delay(1000));
        // 		});
        // 	}
        // }
        return leo.getFromBank(filter);
    }
    leo.getOneFromBank = (filter,log = true) => {
        const bankList = cga.GetBankItemsInfo().filter(e => {
            if (typeof filter == 'string') return e.name == filter || e.itemid == filter;
            else if (typeof filter == 'function') return filter(e);
            else return !filter;
        });
        if(bankList && bankList.length>0){
            var emptyIndexes = leo.getEmptyBagIndexes();
            if(emptyIndexes && emptyIndexes.length > 0){
                cga.MoveItem(bankList[0].pos, emptyIndexes[0], -1);
                if(log){
                    console.log('已从银行获取到物品');
                }
                return leo.delay(500); 
            }else{
                if(log){
                    console.log('身上没有空位，无法获取');
                }
                return leo.delay(500);
            }
        }else{
            if(log){
                console.log('银行里没有对应的物品，无法获取');
            }
            return leo.delay(500);
        }
    }
    //购买封印卡(只买1~4级卡)
    leo.buySealCard = (sealCardName, count = 20, level = 1) => {
        if (level <= 1 || level > 4) {
            level = 1;
        }
        if (level == 1) {
            return leo.goto(n => n.falan.w1).then(() => leo.autoWalkList([
                [94, 78, '达美姊妹的店'],
                [17, 18]
            ])).then(() => {
                return leo.talkNpc(0, dialog => {
                    if (dialog.type == 5) {
                        cga.ClickNPCDialog(-1, 0);
                        return true;
                    }
                    if (dialog.type == 6) {
                        var store = cga.parseBuyStoreMsg(dialog);
                        if (!store) return leo.reject('商店内容解析失败');
                        var buyitem = [];
                        var buyCount = 0;
                        var emptySlotCount = cga.getInventoryEmptySlotCount();
                        store.items.forEach((it) => {
                            if (it.name.indexOf(sealCardName) >= 0 && buyCount < emptySlotCount) {
                                buyitem.push({
                                    index: it.index,
                                    count: count
                                });
                                buyCount++;
                            }
                        });
                        if(emptySlotCount==0){
                            return leo.reject('背包没空间');
                        }
                        if (!buyitem.length){
                            return leo.log('法兰城的封印卡已被买完了，去新城买')
                            .then(()=>leo.logBack())
                            .then(()=>leo.autoWalk([157, 93]))
                            .then(()=>leo.turnDir(0))
                            .then(()=>leo.delay(500))
                            .then(()=>leo.autoWalk([150,125,'克罗利的店']))
                            .then(()=>leo.autoWalk([40,23]))
                            .then(()=>{
                                return leo.talkNpc(0, dialog => {
                                    if (dialog.type == 5) {
                                        cga.ClickNPCDialog(-1, 0);
                                        return true;
                                    }
                                    if (dialog.type == 6) {
                                        var store = cga.parseBuyStoreMsg(dialog);
                                        if (!store) return leo.reject('商店内容解析失败');
                                        var buyitem = [];
                                        var buyCount = 0;
                                        var emptySlotCount = cga.getInventoryEmptySlotCount();
                                        store.items.forEach((it) => {
                                            if (it.name.indexOf(sealCardName) >= 0 && buyCount < emptySlotCount) {
                                                buyitem.push({
                                                    index: it.index,
                                                    count: count
                                                });
                                                buyCount++;
                                            }
                                        });
                                        if(emptySlotCount==0){
                                            return leo.reject('背包没空间');
                                        }
                                        if (!buyitem.length) return leo.reject('商店没有封印卡出售，可能已被买完或者背包没空间');
                                        cga.BuyNPCStore(buyitem);
                                    }
                                }).then(() => leo.pile(true)).then(()=>leo.delay(1000)).then(()=>leo.logBack());
                            });
                        } 
                        cga.BuyNPCStore(buyitem);
                    }
                }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
            });
        } else if (level == 2) {
            return leo.goto(n => n.teleport.vinoy).then(() => leo.autoWalkList([
                [61, 53, '医院'],[6, 14, '医院2楼'],
                [14, 7]
            ])).then(() => {
                return leo.talkNpc(6, dialog => {
                    if (dialog.type == 5) {
                        cga.ClickNPCDialog(-1, 0);
                        return true;
                    }
                    if (dialog.type == 6) {
                        var store = cga.parseBuyStoreMsg(dialog);
                        if (!store) return leo.reject('商店内容解析失败');
                        var buyitem = [];
                        var buyCount = 0;
                        var emptySlotCount = cga.getInventoryEmptySlotCount();
                        store.items.forEach((it) => {
                            if (it.name.indexOf(sealCardName) >= 0 && buyCount < emptySlotCount) {
                                buyitem.push({
                                    index: it.index,
                                    count: count
                                });
                                buyCount++;
                            }
                        });
                        if (!buyitem.length) return leo.reject('商店没有封印卡出售，可能已被买完或者背包没空间');
                        cga.BuyNPCStore(buyitem);
                    }
                }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
            });
        }  else if (level == 3) {
            return leo.goto(n => n.teleport.kili).then(() => leo.autoWalkList([
                [66, 77, '装备品店'],[23, 14, '杂货店'],
                [9, 5]
            ])).then(() => {
                return leo.talkNpc(0, dialog => {
                    if (dialog.type == 5) {
                        cga.ClickNPCDialog(-1, 0);
                        return true;
                    }
                    if (dialog.type == 6) {
                        var store = cga.parseBuyStoreMsg(dialog);
                        if (!store) return leo.reject('商店内容解析失败');
                        var buyitem = [];
                        var buyCount = 0;
                        var emptySlotCount = cga.getInventoryEmptySlotCount();
                        store.items.forEach((it) => {
                            if (it.name.indexOf(sealCardName) >= 0 && buyCount < emptySlotCount) {
                                buyitem.push({
                                    index: it.index,
                                    count: count
                                });
                                buyCount++;
                            }
                        });
                        if (!buyitem.length) return leo.reject('商店没有封印卡出售，可能已被买完或者背包没空间');
                        cga.BuyNPCStore(buyitem);
                    }
                }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
            });
        } else if (level == 4) {
            return leo.goto(n => n.teleport.jenova).then(() => leo.autoWalkList([
                [43, 23, '杂货店'],
                [11, 12]
            ])).then(() => {
                return leo.talkNpc(0, dialog => {
                    if (dialog.type == 5) {
                        cga.ClickNPCDialog(-1, 0);
                        return true;
                    }
                    if (dialog.type == 6) {
                        var store = cga.parseBuyStoreMsg(dialog);
                        if (!store) return leo.reject('商店内容解析失败');
                        var buyitem = [];
                        var buyCount = 0;
                        var emptySlotCount = cga.getInventoryEmptySlotCount();
                        store.items.forEach((it) => {
                            if (it.name.indexOf(sealCardName) >= 0 && buyCount < emptySlotCount) {
                                buyitem.push({
                                    index: it.index,
                                    count: count
                                });
                                buyCount++;
                            }
                        });
                        if (!buyitem.length) return leo.reject('商店没有封印卡出售，可能已被买完或者背包没空间');
                        cga.BuyNPCStore(buyitem);
                    }
                }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
            });
        }
        return leo.reject('购买失败');
    }
    //购买水晶
    leo.buyCrystal = (crystalName, count = 1) => {
        if (!crystalName) {
            crystalName = '水火的水晶（5：5）';
        }
        return leo.goto(n => n.falan.w1).then(() => leo.autoWalkList([
            [94, 78, '达美姊妹的店'],
            [17, 18]
        ])).then(() => {
            return leo.talkNpc(0, dialog => {
                if (dialog.type == 5) {
                    cga.ClickNPCDialog(-1, 0);
                    return true;
                }
                if (dialog.type == 6) {
                    var store = cga.parseBuyStoreMsg(dialog);
                    if (!store) return leo.reject('商店内容解析失败');
                    var buyitem = [];
                    var buyCount = 0;
                    var emptySlotCount = cga.getInventoryEmptySlotCount();
                    store.items.forEach((it) => {
                        if (it.name.indexOf(crystalName) >= 0 && buyCount < emptySlotCount) {
                            buyitem.push({
                                index: it.index,
                                count: count
                            });
                            buyCount++;
                        }
                    });
                    if(emptySlotCount==0){
                        return leo.reject('背包没空间');
                    }
                    if (!buyitem.length){
                        return leo.log('法兰城的水晶已被买完了，去新城买')
                        .then(()=>leo.logBack())
                        .then(()=>leo.autoWalk([157, 93]))
                        .then(()=>leo.turnDir(0))
                        .then(()=>leo.delay(500))
                        .then(()=>leo.autoWalk([150,125,'克罗利的店']))
                        .then(()=>leo.autoWalk([40,23]))
                        .then(()=>{
                            return leo.talkNpc(0, dialog => {
                                if (dialog.type == 5) {
                                    cga.ClickNPCDialog(-1, 0);
                                    return true;
                                }
                                if (dialog.type == 6) {
                                    var store = cga.parseBuyStoreMsg(dialog);
                                    if (!store) return leo.reject('商店内容解析失败');
                                    var buyitem = [];
                                    var buyCount = 0;
                                    var emptySlotCount = cga.getInventoryEmptySlotCount();
                                    store.items.forEach((it) => {
                                        if (it.name.indexOf(crystalName) >= 0 && buyCount < emptySlotCount) {
                                            buyitem.push({
                                                index: it.index,
                                                count: count
                                            });
                                            buyCount++;
                                        }
                                    });
                                    if(emptySlotCount==0){
                                        return leo.reject('背包没空间');
                                    }
                                    if (!buyitem.length) return leo.reject('商店没有水晶出售，可能已被买完或者背包没空间');
                                    cga.BuyNPCStore(buyitem);
                                }
                            }).then(() => leo.pile(true)).then(()=>leo.delay(1000)).then(()=>leo.logBack());
                        });
                    } 
                    cga.BuyNPCStore(buyitem);
                }
            }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
        });
        return leo.reject('购买失败');
    }
    //购买平民装(武器)
    leo.buyEquipWeaponLv1 = (equipName, count = 1) => {
        if (!equipName) {
            return leo.reject('购买失败，未指定装备名');
        }
        return leo.goto(n => n.falan.sell)
        .then(() => leo.autoWalk([150,123]))
        .then(() => {
            return leo.talkNpc(6, dialog => {
                if (dialog.type == 5) {
                    cga.ClickNPCDialog(-1, 0);
                    return true;
                }
                if (dialog.type == 6) {
                    var store = cga.parseBuyStoreMsg(dialog);
                    if (!store) return leo.reject('商店内容解析失败');
                    var buyitem = [];
                    var buyCount = 0;
                    var emptySlotCount = cga.getInventoryEmptySlotCount();
                    store.items.forEach((it) => {
                        if (it.name.indexOf(equipName) >= 0 && buyCount < emptySlotCount) {
                            buyitem.push({
                                index: it.index,
                                count: count
                            });
                            buyCount++;
                        }
                    });
                    if (!buyitem.length) return leo.reject('商店没有装备出售，可能已被买完或者背包没空间');
                    cga.BuyNPCStore(buyitem);
                }
            }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
        });
        return leo.reject('购买失败');
    }
    //购买平民装(防具)
    leo.buyEquipProtectLv1 = (equipName, count = 1) => {
        if (!equipName) {
            return leo.reject('购买失败，未指定装备名');
        }
        return leo.goto(n => n.falan.sell)
        .then(() => {
            return leo.talkNpc(6, dialog => {
                if (dialog.type == 5) {
                    cga.ClickNPCDialog(-1, 0);
                    return true;
                }
                if (dialog.type == 6) {
                    var store = cga.parseBuyStoreMsg(dialog);
                    if (!store) return leo.reject('商店内容解析失败');
                    var buyitem = [];
                    var buyCount = 0;
                    var emptySlotCount = cga.getInventoryEmptySlotCount();
                    store.items.forEach((it) => {
                        if (it.name.indexOf(equipName) >= 0 && buyCount < emptySlotCount) {
                            buyitem.push({
                                index: it.index,
                                count: count
                            });
                            buyCount++;
                        }
                    });
                    if (!buyitem.length) return leo.reject('商店没有装备出售，可能已被买完或者背包没空间');
                    cga.BuyNPCStore(buyitem);
                }
            }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
        });
        return leo.reject('购买失败');
    }
    
    //是否要扔宠，info为不达标的项
    leo.isDropPet = (pet, option) => {
        var isDrop = {
            flag: false,
            hp: false,
            mp: false,
            attack: false,
            defensive: false,
            agility: false,
            info: ''
        };
        if (option.autoDropPet) {
            if (option.minHp && option.minHp > 0 && pet.maxhp < option.minHp) {
                isDrop.flag = true;
                isDrop.hp = true;
                isDrop.info += '血';
            }
            if (option.minMp && option.minMp > 0 && pet.maxmp < option.minMp) {
                isDrop.flag = true;
                isDrop.mp = true;
                isDrop.info += '魔';
            }
            if (option.minAttack && option.minAttack > 0 && pet.detail.value_attack < option.minAttack) {
                isDrop.flag = true;
                isDrop.attack = true;
                isDrop.info += '攻';
            }
            if (option.minDefensive && option.minDefensive > 0 && pet.detail.value_defensive < option.minDefensive) {
                isDrop.flag = true;
                isDrop.defensive = true;
                isDrop.info += '防';
            }
            if (option.minAgility && option.minAgility > 0 && pet.detail.value_agility < option.minAgility) {
                isDrop.flag = true;
                isDrop.agility = true;
                isDrop.info += '敏';
            }
            if (isDrop.info != '') {
                isDrop.info += '不达标';
            }
        }
        return isDrop;
    }
    //返回用于算档的宠物数据(五维：血魔攻防敏)
    leo.getPetCalcInfo = (pet, split = 'x') => {
        return '【LV' + pet.level + '】【' + pet.realname + '】【 ' + pet.maxhp + split + pet.maxmp + split + pet.detail.value_attack + split + pet.detail.value_defensive + split + pet.detail.value_agility + ' 】';
    }
    //打印遇敌的1级宠信息，用于自动战斗抓宠过滤
    leo.isCatchPet = (enemies, petOptions,isNameOnly = false) => {
        enemies.forEach(e => {
            let isPrint = true;
            if(isNameOnly){
                isPrint = e.name == petOptions.name;
            }
            if(isPrint){
                let flag = (e.maxhp >= petOptions.minHp && e.maxmp >= petOptions.minMp)

                if(!flag){
                    //如果实际的血+魔总和也大于等于过滤的血+魔总和
                    flag = (e.maxhp + e.maxmp) >= (petOptions.minHp + petOptions.minMp);
                }

                let flagStr = flag?'，抓！':'';
                console.log(leo.logTime()+'第【'+(petOptions.index++)+'】只1级怪:【' + e.name + '】【' + e.maxhp + '('+petOptions.minHp+')/' + e.maxmp + '('+petOptions.minMp+')】'+flagStr);
            }
        });
    }
    //查找需要抓的1级宠信息
    leo.findCatchPet = (enemies, petOptions,isFullHp = false) => {
        return enemies.find(e => {
            let isCatch = false;
            if(isFullHp){
                if(e.curhp < e.maxhp){
                    return isCatch;
                }
            }
            if(e.level == 1 && e.name == petOptions.name 
            && (
                (e.maxhp >= petOptions.minHp && e.maxmp >= petOptions.minMp) 
                || ((e.maxhp + e.maxmp) >= (petOptions.minHp + petOptions.minMp))
            )){
                isCatch = true;
            }
            return isCatch;
        });
    }

    //随机遇敌(队长用)
    leo.encounterTeamLeader = leo.encounter;
    //随机遇敌(队员用)
    leo.encounterTeammate = (protect, endLoopCheck) => {
        if (leo.checkStopEncounter(protect, true)) {
            console.log(leo.logTime() + '触发回补，取消监听');
            return leo.todo().then(() => {
                var tempLoop = () => leo.delay(2000)
                    .then(() => leo.waitAfterBattle())
                    .then(() => {
                        if(!leo.isInTeam()){
                            return leo.reject();
                        }
                        if(endLoopCheck && typeof endLoopCheck == 'function'){
                            if(endLoopCheck()){     //函数返回true则退出循环
                                return leo.reject(); 
                            }
                        }
                        if(endLoopCheck && typeof endLoopCheck == 'string'){
                            var currentMap = cga.GetMapName();
                            if (currentMap.indexOf(endLoopCheck)==-1) {
                                return leo.reject();
                            }
                        }
                        return leo.resolve();
                    })
                    .then(() => tempLoop());
                return tempLoop().
                catch (() => console.log(leo.logTime() + '恢复监听'));
            });
        } else {
            return leo.delay(5000);
        }
    }
    //获取人物的声望称号
    leo.getPlayerSysTitle = (titles) => {
		var sysTitles = ['恶人','受忌讳的人','受挫折的人','无名的旅人','树旁的落叶','水面上的小草','呢喃的歌声','地上的月影','奔跑的春风','苍之风云','摇曳的金星','欢喜的慈雨','蕴含的太阳','敬畏的寂静','无尽星空','迈步前进者','追求技巧的人','刻于新月之铭','掌上的明珠','敬虔的技巧','踏入神的领域','贤者','神匠','摘星的技巧','万物创造者','持石之贤者'];
		for(var i in titles){
			for(var j in sysTitles){
				if(titles[i] == sysTitles[j]){
					return titles[i];
				}
			}
		}
	}
    //获取人物的声望称号进度
    leo.getPlayerSysTitleRange = (content) => {
        //console.log(content);
        if(content.indexOf('一点兴趣都没有')>-1){
            return 0;
        }
        if(content.indexOf('要拿到新称号还久')>-1){
            return 0;
        }
        if(content.indexOf('只有四分之一')>-1){
            return 1;
        }
        if(content.indexOf('过一半了吧')>-1){
            return 2;
        }
        if(content.indexOf('爱谄媚的勇者')>-1){
            return 3;
        }
        if(content.indexOf('应该能得到新称号')>-1){
            return 4;
        }
        if(content.indexOf('天天找小孩子问称号的呆子')>-1){
            return 9;
        }
    }

    //获取指定物品
    leo.getItems = (itemName) => {
        var items = cga.getInventoryItems().filter(item => {
            return item.name == itemName || item.itemid == itemName;
        });
        return items;
    }
    leo.useItems = (itemName,times = 1) => {
        var items = leo.getItems(itemName);
        if(items && items.length >0 ){
            for(var i in items){
                if(times-->0){
                    cga.UseItem(items[i].pos);
                }
            }
        }
        return leo.delay(1000);
    }
    leo.dropItem = (itemName,minCount) => {
        var items = leo.getItems(itemName);
        if(items && items.length >0 ){
            for(var i in items){
                var isDrop = true;
                if(minCount && items[i].count >= minCount){
                    isDrop = false;
                }
                if(isDrop){
                    cga.DropItem(items[i].pos);
                }
            }
        }
        return leo.delay(1000);
    }

    leo.getItemEx = (item) => {
        if(typeof item == 'number' && item < 30){
            return cga.getInventoryItems().find(i => {
                return i.pos == item;
            });
        }else if(typeof item == 'string' || (typeof item =='number' && item >= 30)){
            return cga.getInventoryItems().find(i => {
                return i.name == item || i.itemid == item;
            });
        }else if(typeof item == 'function'){
            return cga.getInventoryItems().find(item);
        }
    }
    leo.getItemsEx = (item) => {
        if(typeof item == 'number' && item < 30){
            return cga.getInventoryItems().filter(i => {
                return i.pos == item;
            });
        }else if(typeof item == 'string' || (typeof item =='number' && item >= 30)){
            return cga.getInventoryItems().filter(i => {
                return i.name == item || i.itemid == item;
            });
        }else if(typeof item == 'function'){
            return cga.getInventoryItems().filter(item);
        }
    }
    leo.useItemEx = (item) => {
        var realItem = leo.getItemEx(item);
        if(realItem){
            cga.UseItem(realItem.pos);
            return leo.delay(1000);
        }
    }
    leo.dropItemEx = (item) => {
        var realItem = leo.getItemEx(item);
        if(realItem){
            if (cga.isInNormalState() && !leo.isMoving()) {
                cga.DropItem(realItem.pos);
                return leo.delay(1000);
            }
        }
    }
    //随机往旁边移动1格（队长使用，方便队员进组）
    leo.moveAround = (mapInfo = leo.getMapInfo()) => {
        var movablePos = leo.getMovablePositionsAround(mapInfo);
        if(movablePos && movablePos.length > 0){
            return leo.autoWalk([movablePos[0].x,movablePos[0].y]);
        }else{
            return leo.autoWalk([mapInfo.x+1,mapInfo.y]);
        }
    }

    //地图搜索范围
    leo.getMovablePoints = (map, start) => {
        const foundedPoints = {};
        foundedPoints[start.x + '-' + start.y] = start;
        const findByNextPoints = (centre) => {
            const nextPoints = [];
            const push = (p) => {
                if (p.x > map.x_bottom && p.x < map.x_size && p.y > map.y_bottom && p.y < map.y_size) {
                    if (map.matrix[p.y][p.x] === 0) {
                        const key = p.x + '-' + p.y;
                        if (!foundedPoints[key]) {
                            foundedPoints[key] = p;
                            nextPoints.push(p);
                        }
                    }
                }
            };
            push({x: centre.x + 1, y: centre.y});
            // push({x: centre.x + 1, y: centre.y + 1});
            push({x: centre.x, y: centre.y + 1});
            // push({x: centre.x - 1, y: centre.y + 1});
            push({x: centre.x - 1, y: centre.y});
            // push({x: centre.x - 1, y: centre.y - 1});
            push({x: centre.x, y: centre.y - 1});
            // push({x: centre.x + 1, y: centre.y - 1});
            nextPoints.forEach(findByNextPoints);
        };
        findByNextPoints(start);
        return foundedPoints;
    }
    const getMazeEntries = (up = true, mapObjects = cga.getMapObjects(), current = cga.GetMapXY()) => {
        const entryIcons = cga.buildMapCollisionRawMatrix().matrix;
        return mapObjects.filter(o => {
            const match = o.cell == 3;
            if (match) {
                o.icon = entryIcons[o.y][o.x];
                if (o.icon == 0 && up) {
                    o.icon = Number.MAX_VALUE;
                }
            }
            return match;
        }).sort((a,b) => {
            //if (a.x == current.x && a.y == current.y) return 1;
            //if (b.x == current.x && b.y == current.y) return 0;
            return up ? (a.icon - b.icon) : (b.icon - a.icon);
        });
    };
    //迷宫搜索
    leo.searchInMaze = (targetFinder, recursion = true, up = true, parameters = {}) => leo.downloadMap().then(walls => {
        //console.log('up:'+up);
        var entries = getMazeEntries(up);
        var entry = entries&&entries.length>0?entries[0]:null;
        //console.log(entry);
        const getTarget = () => {
            const target = targetFinder(cga.GetMapUnits());
            if (typeof target == 'object') {
                target.entry = entry;
                target.found = true;
                const walkTo = leo.getMovablePositionAround({x: target.xpos,y: target.ypos});
                if (walkTo) {
                    return leo.autoWalk([walkTo.x,walkTo.y],undefined,undefined,{compress: false}).then(() => Promise.reject(target));
                }
            }
            if (target === true) return Promise.reject({found: true, entry: entry});
            return Promise.resolve();
        };
        const toNextPoint = (points, centre) => {
            const remain = points.filter(p => {
                const xd = Math.abs(p.x - centre.x);
                const yd = Math.abs(p.y - centre.y);
                p.d = xd + yd;
                return !(xd < 12 && yd < 12);
            }).sort((a,b) => a.d - b.d);
            const next = remain.shift();
            if (next) {
                return leo.autoWalk([next.x,next.y],undefined,undefined,{compress: false}).then(
                    () => getTarget()
                ).then(() => toNextPoint(remain,next))
            }
            return Promise.resolve();
        };
        if (parameters.diagonal && parameters.diagonal.length > 1) {
            const [minX,maxX] = [parameters.diagonal[0][0],parameters.diagonal[1][0]].sort();
            const [minY,maxY] = [parameters.diagonal[0][1],parameters.diagonal[1][1]].sort();
            for (let y = 0; y < walls.matrix.length; y++) {
                for (let x = 0; x < walls.matrix[y].length; x ++) {
                    if (!(x <= maxX && x >= minX && y <= maxY && y >= minY) && walls.matrix[y][x] == 0) {
                        walls.matrix[y][x] = 1;
                    }
                }
            }
        }
        return getTarget().then(() => {
            const current = cga.GetMapXY();
            return toNextPoint(Object.values(leo.getMovablePoints(walls, current)), current);
        }).then(
            () => {
                var xy = entry?('，坐标('+entry.x+','+entry.y+')'):'';
                console.log('当前地图：'+cga.GetMapName()+'，寻找下一层迷宫'+xy);
                //console.log(entry);
                if (entry && recursion) {
                    return leo.autoWalk([entry.x, entry.y, '*'], undefined, undefined, {compress: false})
                    .then(()=>leo.searchInMaze(targetFinder, recursion, up));
                }
                console.log('寻找下一层迷宫失败(searchInMaze):1');
                return leo.reject();
            },
            t => {
                //console.log(t);
                if (t && t.found) return t;
                console.log('寻找下一层迷宫失败(searchInMaze):2');
                return leo.reject();
            }
        );
    });
    //迷宫寻找指定NPC或物品
    leo.findOne = (targetFinder, todo = leo.next() , up = false)=>{
        var position;
        if (!leo.isMapDownloaded(cga.buildMapCollisionMatrix())) {
            position = null;
        }
        const gotoOne = (one) => {
            //console.log(one);
            var oneName = (one.flags & cga.emogua.UnitFlags.NpcEntry)?one.unit_name:one.item_name;
            console.log(leo.logTime()+'发现：【'+oneName+'】，坐标('+one.xpos+','+one.ypos+')');
            const positions = leo.getMovablePositionsAround({x: one.xpos, y: one.ypos});
            return leo.autoWalk([positions[0].x, positions[0].y],undefined,undefined,{compress: false})
            //.then(() => leo.turnTo(one.xpos, one.ypos))
            .then(() => todo(one));
        };
        if (position) {
            return leo.walkRandomMazeUntil(() => cga.GetMapName() == position.mapName, false)
            .then(() => gotoOne(position));
        }
        return leo.searchInMaze(targetFinder, true, up)
        .then(unit => {
            //console.log(unit);
            position = unit;
            position.mapName = cga.GetMapName();
            return gotoOne(position);
        })
        .catch(()=>{
            console.log('寻找迷宫出错(findOne)');
        });
    }

    //哥拉尔镇定居登出
    leo.logBackG = async ()=>{
        await leo.loop(async ()=>{
            if(cga.getMapInfo().name=='哥拉尔镇' && cga.getMapInfo().x == 120 ){
                return leo.reject()
            }else{
                await leo.logBack()
            }
            return leo.delay(1000)
        })
    }
    //新城、法兰到哥拉尔镇
    leo.gotoGrahl = ()=>{
        if(cga.GetMapName() == '哥拉尔镇'){
            return leo.done();
        }else{
            return leo.goto(n=>n.grahl.c)
            .then(()=>leo.done());
        }
    }
    //哥拉尔镇到新城
    leo.gotoElsaFromGrahl = async (dingju = false,falan = false)=>{
        await leo.logBackG()
        await leo.autoWalk([120,107])
        await leo.turnDir(6)
        await leo.delay(1000)
        await leo.autoWalkList([
            [96,211,'哥拉尔镇 港湾管理处'],[8,5]
        ])
        await leo.talkNpc(6,leo.talkYes)
        await leo.autoWalk([51,50])
        await leo.loop(
            ()=>leo.talkNpc(0,leo.talkNpcSelectorYes)
            .then(()=>{
                if(cga.GetMapName() == '铁达尼号'){
                    return leo.reject();
                }
                return leo.delay(10000);
            })
        )
        await leo.autoWalk([70,26])
        await leo.delay(300000)
        await leo.loop(
            ()=>leo.talkNpc(0,leo.talkNpcSelectorYes)
            .then(()=>{
                if(cga.GetMapName() == '往哥拉尔栈桥'){
                    return leo.reject();
                }
                return leo.delay(10000);
            })
        )
        await leo.autoWalk([20,54])
        await leo.talkNpc(4,leo.talkNpcSelectorYes,'港湾管理处')
        await leo.autoWalk([9,22,'伊尔'])
        await leo.autoWalk([24,19])
        await leo.talkNpc(6,leo.talkNpcSelectorYes,'伊尔村')
        await leo.autoWalk([47,83,'村长的家'])
        await leo.autoWalk([14,17,'伊尔村的传送点'])
        await leo.autoWalk([20,10])
        await leo.talkNpc(0,leo.talkNpcSelectorYes,'启程之间')
        await leo.autoWalkList([
            [25,24,'里谢里雅堡 1楼'],[74,40,'里谢里雅堡']
        ])
        if(falan){
            await leo.autoWalkList([
                [65,52,'法兰城'],[231,77]
            ])
            if(dingju){
                await leo.talkNpc(6,leo.talkNpcSelectorYes)
            }
        }else{
            await leo.autoWalk([28,88])
            await leo.delay(1000)
            await leo.talkNpc(leo.talkNpcSelectorYes)
            await leo.autoWalkList([
                [19, 21, '法兰城遗迹'],
                [96, 138, '盖雷布伦森林'],
                [124, 168, '温迪尔平原'],
                [264, 108, '艾尔莎岛'],
                [141, 105]
            ])
            if(dingju){
                await leo.talkNpc(0,leo.talkNpcSelectorYes)
            }
        }
        return leo.done()
    }
    //新城、法兰到阿凯鲁法村
    leo.gotoAKLF = ()=>{
        if(cga.GetMapName() == '阿凯鲁法村'){
            return leo.done();
        }else{
            return leo.goto(n => n.teleport.yer)
            .then(()=>leo.autoWalk([57,71]))
            .then(()=>leo.talkNpc(0, leo.talkNpcSelectorYes, '伊尔'))
            .then(()=>leo.autoWalkList([[30,21,'港湾管理处'], [23,25]]))
            .then(()=>leo.talkNpc(6, leo.talkNpcSelectorYes, '往阿凯鲁法栈桥'))
            .then(()=>leo.autoWalk([51,50]))
            .then(()=>leo.loop(
                ()=>leo.talkNpc(0,leo.talkNpcSelectorYes)
                .then(()=>{
                    if(cga.GetMapName() == '艾欧奇亚号'){
                        return leo.reject();
                    }
                    return leo.delay(10000);
                })
            ))
            .then(()=>leo.autoWalk([70,26]))
            .then(()=>leo.delay(300000))
            .then(()=>leo.loop(
                ()=>leo.talkNpc(0,leo.talkNpcSelectorYes)
                .then(()=>{
                    if(cga.GetMapName() == '往伊尔栈桥'){
                        return leo.reject();
                    }
                    return leo.delay(10000);
                })
            ))
            .then(()=>leo.autoWalk([19,54]))
            .then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes,'港湾管理处'))
            .then(()=>leo.autoWalkList([[22,31,'阿凯鲁法'],[28,30]]))
            .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'阿凯鲁法村'))
            .then(()=>leo.autoWalk([99,164]))
            .then(()=>leo.done());
        }
    }
    //从阿凯鲁法村到路霸
    leo.gotoLuBa = ()=>{
        if(cga.GetMapName() == '阿凯鲁法村'){
            return leo.autoWalkList([
                [178,227,'米内葛尔岛'],
                [283,457,'南恰拉山第1通路'],[10,61,34001],
                [11,2,34000],[37,5,'米内葛尔岛'],[314,399,'南恰拉山第2通路'],
                [45,37,34003],[27,2,34002],[23,3,'米内葛尔岛'],[308,349]
            ]);
        }
    }
    //从阿凯鲁法村去砍村
    leo.gotoKan = ()=>{
        if(cga.GetMapName() == '阿凯鲁法村'){
            return leo.autoWalk([166,107])
            .then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'坎那贝拉村'));
        }
    }
    //切图，带战斗检测
    leo.forceMoveEx = (orientation, times = 1) => {
        if  (times > 0) {
            cga.ForceMove(orientation, true);
            return leo.delay(500)
            .then(() => leo.waitAfterBattle())
            .then(() => leo.forceMoveEx(orientation, times - 1));
        }
        return leo.done();
    }
    //退出脚本
    leo.exit = () => {
        return leo.log('脚本即将结束')
        .then(()=>leo.delay(2000))
        .then(()=>process.abort());
    }
    //判断身上是否有指定物品
    leo.has = (name) => {
        return cga.getItemCount(name) > 0;
    }
    //获取游戏里的时间
    leo.getSysTimeEx = () => {
        var stages = ['黎明','白天','黄昏','夜晚'];
        var sysTime = cga.GetSysTime();
        if(!sysTime){
            return stages[1];
        }
        //console.log(sysTime.hours+':'+sysTime.mins);
        if(sysTime.hours < 4){
            return stages[3];
        }else if(sysTime.hours <= 6){
            return stages[0];
        }else if(sysTime.hours < 16){
            return stages[1];
        }else if(sysTime.hours <= 18){
            return stages[2];
        }else{
            return stages[3];
        }
    }
    leo.talkYes = leo.talkNpcSelectorYes;
    leo.talkNo = leo.talkNpcSelectorNo;
    leo.moveAndTalkNpc = (x1,y1,x2,y2,select = leo.talkYes, dest) => {
        return leo.autoWalk([x1,y1])
        .then(()=>leo.talkNpc(x2,y2,select,dest));
    }
    leo.moveAndDot = (x1,y1,dir,words,select = leo.talkYes,dest) => {
        return leo.autoWalk([x1,y1])
        .then(()=>leo.turnDir(dir))
        .then(()=>leo.say(words+'...'))
        .then(()=>leo.talkNpc(-1,-1,select,dest));
    }
    leo.talkNpcAt = (x,y,select = leo.talkYes, dest) => {
        const walkTo = leo.getMovablePositionAround({x:x,y:y});
        if (walkTo) {
            return leo.autoWalk([walkTo.x,walkTo.y])
            .then(()=>leo.talkNpc(x,y,select,dest));
        }else{
            return leo.log('无法到达位置['+x+','+y+']');
        }
    }
    leo.dotAt = (x,y,words,select = leo.talkYes, dest) => {
        const walkTo = leo.getMovablePositionAround({x:x,y:y});
        if (walkTo) {
            return leo.autoWalk([walkTo.x,walkTo.y])
            .then(()=>leo.turnTo(x,y))
            .then(()=>leo.say(words+'...'))
            .then(()=>leo.talkNpc(-1,-1,select,dest));
        }else{
            return leo.log('无法到达位置['+x+','+y+']');
        }
    }

    //读取配置文件
    leo.loadConfig = () => {
        var prev = '个人配置--';
        var configFileName = prev + cga.GetPlayerInfo().name + '.config';
        var filePath = leo.rootPath + leo.splitter + configFileName;
        try{
            var configStr = leo.fs.readFileSync(filePath,'utf-8');
            return JSON.parse(configStr);
        }catch (e) {
            return {};
        }
    }
    leo.saveConfig = (config) => {
        var prev = '个人配置--';
        var configFileName = prev + cga.GetPlayerInfo().name + '.config';
        var filePath = leo.rootPath + leo.splitter + configFileName;
        if(!config){
            config = {};
        }
        config.time = leo.formatDate(leo.now(), leo.FORMAT_DATETIME);
        if(!config.jsCode){
            config.jsCode = {};
        }
        var configStr = JSON.stringify(config);
        var option = { encoding: 'utf-8'};
        leo.fs.writeFileSync(filePath,configStr,option);
        //console.log(leo.logTime()+'已保存配置，内容：');
        //console.log(config);
        return config;
    }
    leo.loadFile = (filePath) => {
        try{
            if(filePath.indexOf(leo.splitter)==-1){
                filePath = leo.rootPath + leo.splitter + filePath;
            }
            var configStr = leo.fs.readFileSync(filePath,'utf-8');
            return JSON.parse(configStr);
        }catch (e) {
            return {};
        }
    }
    leo.saveFile = (filePath,config) => {
        if(filePath.indexOf(leo.splitter)==-1){
            filePath = leo.rootPath + leo.splitter + filePath;
        }
        if(!config){
            config = {};
        }
        config.time = leo.formatDate(leo.now(), leo.FORMAT_DATETIME);
        var configStr = JSON.stringify(config);
        var option = { encoding: 'utf-8'};
        leo.fs.writeFileSync(filePath,configStr,option);
        console.log(leo.logTime()+'已保存配置，内容：');
        console.log(config);
        return config;
    }

    //职业声望表
    leo.table = {};
    leo.table.lingtang = {
        '无名的旅人' : [1000,1000,1000,1000],
        '路旁的落叶' : [1000,1375,1750,2125],
        '水面上的小草' : [2500,3125,3750,4375],
        '呢喃的歌声' : [5000,6250,7500,8750],
        '地上的月影' : [10000,11625,13250,14875],
        '奔跑的春风' : [16500,18625,20750,22875],
        '苍之风云' : [25000,27500,30000,32500],
        '摇曳的金星' : [35000,38750,42500,46250],
        '欢喜的慈雨' : [50000,53750,57500,61250],
        '蕴含的太阳' : [65000,68750,72500,76250],
        '敬畏的寂静' : [85000,0,0,0],
        '无尽星空' : [0,0,0,0]
    }

    //合并属性（深层合并）
    leo.deepMerge = (target, source) => {
      for (let key in source) {
        // 如果target(也就是target[key])存在，且是对象的话再去调用deepMerge，否则就是target[key]里面没这个对象，需要与source[key]合并
        target[key] = target[key] && target[key].toString() === "[object Object]"
          ? leo.deepMerge(target[key], source[key])
          : (target[key] = source[key]);
      }
      return target;
    }

    //获取面板设置
    leo.getSettings = (attribute) => new Promise((resolve, reject) => {
        if(cga.gui){
            cga.gui.GetSettings((err, result)=>{
                if(attribute){
                    resolve(result[attribute]);
                }else{
                    resolve(result);
                }
            })
        }else{
            resolve({});
        }
    });
    //更新面板设置
    leo.loadSettings = (config) => new Promise( async (resolve, reject) => {
        if(cga.gui){
            var settings = await leo.getSettings()
            leo.deepMerge(settings, config);
            cga.gui.LoadSettings(settings, (err, result)=>{
                resolve(result);
            })
        }else{
            resolve();
        }
    });

    //CGA面板快捷控制
    leo.panel = {
        default : ()=>{
            var configFile = '~默认.json';
            var config = leo.loadFile(configFile);
            return leo.loadSettings(config);
        },
        escape : ()=>{
            var configFile = '逃跑.json';
            var config = leo.loadFile(configFile);
            return leo.loadSettings(config);
        },
        loadFromFile : (configFile)=>{
            if(configFile){
                var config = leo.loadFile(configFile);
                return leo.loadSettings(config);
            }
        },
        battle : (setting)=>{
            /*"battle": {
                "autobattle": true,
                "bossprot": false,
                "delayfrom": 4000,
                "delayto": 4500,
                "highspeed": true,
                "list": [
                    {
                        "condition": 0,
                        "condition2": 0,
                        "condition2rel": 0,
                        "condition2val": "",
                        "conditionrel": 0,
                        "conditionval": "",
                        "index": 0,
                        "petaction": 100,
                        "petskillname": "攻击",
                        "pettarget": 0,
                        "pettargetsel": 4,
                        "playeraction": 1,
                        "playertarget": 0,
                        "playertargetsel": 0
                    }
                ],
                "lockcd": false,
                "lv1prot": false,
                "pet2action": true,
                "playerforceaction": false,
                "r1nodelay": true,
                "showhpmp": false
            }*/
            if(cga.gui){
                var config = {
                    battle : setting
                };
                return leo.loadSettings(config);
            }
        },
        autoBattle : (enable)=>{
            if(cga.gui){
                var config = {
                    battle : {
                        autobattle : enable
                    }
                };
                return leo.loadSettings(config);
            }
        },
        highspeed : (enable)=>{
            if(cga.gui){
                var config = {
                    battle : {
                        highspeed : enable
                    }
                };
                return leo.loadSettings(config);
            }
        },
        pet2action : (enable)=>{
            if(cga.gui){
                var config = {
                    battle : {
                        pet2action : enable
                    }
                };
                return leo.loadSettings(config);
            }
        },
        player : (setting)=>{
            /*"player": {
                "autosupply": true,
                "movespd": 130,
                "noswitchanim": false,
                "petfood": false,
                "petfoodat": "",
                "petmed": false,
                "petmedat": "",
                "usefood": false,
                "usefoodat": "",
                "usemed": false,
                "usemedat": "",
                "workacc": 100,
                "workdelay": 6500
            }*/
            if(cga.gui){
                var config = {
                    player : setting
                };
                return leo.loadSettings(config);
            }
        },
        autosupply : (enable)=>{
            if(cga.gui){
                var config = {
                    player : {
                        autosupply : enable
                    }
                };
                return leo.loadSettings(config);
            }
        },
        movespd : (number)=>{
            if(cga.gui){
                var config = {
                    player : {
                        movespd : number
                    }
                };
                return leo.loadSettings(config);
            }
        },
        noswitchanim : (enable)=>{
            if(cga.gui){
                var config = {
                    player : {
                        noswitchanim : enable
                    }
                };
                return leo.loadSettings(config);
            }
        },
        workacc : (number)=>{
            if(cga.gui){
                var config = {
                    player : {
                        workacc : number
                    }
                };
                return leo.loadSettings(config);
            }
        },
        workdelay : (number)=>{
            if(cga.gui){
                var config = {
                    player : {
                        workdelay : number
                    }
                };
                return leo.loadSettings(config);
            }
        },
        itemdroplist : (arr)=>{
            /*"itemdroplist": [
                "魔石",
                "地的水晶碎片",
                "水的水晶碎片",
                "火的水晶碎片",
                "风的水晶碎片",
                "卡片？",
                "巨石",
                "绿头盔",
                "星之砂",
                "秘文之皮",
                "奇香木",
                "坚硬的鳞片"
            ]*/
            if(cga.gui){
                var config = {
                    itemdroplist : arr
                };
                return leo.loadSettings(config);
            }
        },
        itemdroplistAdd : async (obj)=>{
            var itemdroplist = await leo.getSettings('itemdroplist') || [];
            if (obj instanceof Array && obj.length>0){
                for (var i = 0; i < obj.length; i++) {
                    if(!is_array_contain(itemdroplist,obj[i])){
                        itemdroplist.push(obj[i]);
                    }
                }
            }else{
                if(!is_array_contain(itemdroplist,obj)){
                    itemdroplist.push(obj);
                }
            }
            return leo.panel.itemdroplist(itemdroplist);
        },
        itemdroplistDel : async (obj)=>{
            var itemdroplist = await leo.getSettings('itemdroplist') || [];
            if (obj instanceof Array && obj.length>0){
                for (var i = 0; i < obj.length; i++) {
                    for(index in itemdroplist)
                    {
                        if(itemdroplist[index] == obj[i]){
                            delete itemdroplist[index];
                            break;
                        }
                    }
                }
            }else{
                for(index in itemdroplist)
                {
                    if(itemdroplist[index] == obj){
                        delete itemdroplist[index];
                        break;
                    }
                }
            }
            return leo.panel.itemdroplist(itemdroplist);
        },
        itemtweaklist : (arr)=>{
            /*"itemtweaklist": [
                "地的水晶碎片|999",
                "水的水晶碎片|999",
                "火的水晶碎片|999",
                "风的水晶碎片|999",
                "神之金|20",
                "龙角|20",
                "隐秘的徽记（地）|20",
                "隐秘的徽记（水）|20",
                "隐秘的徽记（火）|20",
                "隐秘的徽记（风）|20",
                "阿尔卡迪亚古钱|999",
                "魔族的水晶|5",
                "钢骑之矿|5",
                "德特家的布|5",
                "誓言之证|5",
                "能量结晶|99",
                "巨石|20",
                "长老之证|7"
            ]*/
            if(cga.gui){
                var config = {
                    itemtweaklist : arr
                };
                return leo.loadSettings(config);
            }
        },
        itemtweaklistAdd : async (obj)=>{
            var itemtweaklist = await leo.getSettings('itemtweaklist') || [];
            if (obj instanceof Array && obj.length>0){
                for (var i = 0; i < obj.length; i++) {
                    if(!is_array_contain(itemtweaklist,obj[i])){
                        itemtweaklist.push(obj[i]);
                    }
                }
            }else{
                if(!is_array_contain(itemtweaklist,obj)){
                    itemtweaklist.push(obj);
                }
            }
            return leo.panel.itemtweaklist(itemtweaklist);
        },
        itemtweaklistDel : async (obj)=>{
            var itemtweaklist = await leo.getSettings('itemtweaklist') || [];
            if (obj instanceof Array && obj.length>0){
                for (var i = 0; i < obj.length; i++) {
                    for(index in itemtweaklist)
                    {
                        if(itemtweaklist[index] == obj[i]){
                            delete itemtweaklist[index];
                            break;
                        }
                    }
                }
            }else{
                for(index in itemtweaklist)
                {
                    if(itemtweaklist[index] == obj){
                        delete itemtweaklist[index];
                        break;
                    }
                }
            }
            return leo.panel.itemtweaklist(itemtweaklist);
        },
        //修改遇敌速度延时，单位毫秒
        fightspd : (number)=>{
            leo.moveTimeout = number;
        }
    }

    //自动战斗设置 
    //user: 1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
    //技能设置
    //参数check 如果
    //context.round_count === 0 第一回合
    //context.enemies.length 敌人数量
    //context.enemies.front.length 敌人前排数量
    //context.enemies.back.length 敌人后排数量
    //context.enemies.find(e => e.curhp > 0 && e.maxhp >= 15000) 还活着的血上限大于15000
    //e.name 怪物种类名称
    //e.pos 怪物的位置
    //参数targets 对象
    //targets: context => context.enemies.sort((a, b) => b.curhp - a.curhp).map(u => u.pos) 当前血多优先
    leo.battleSetting = {
        clear: ()=>{
            //技能设置
            const sets = [];
            var firstRoundDelay = 1;    //首回合延迟
            var roundDelay = 4000          //每回合延迟
            var force = false ;          //是否强制启用战斗配置
            leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
            leo.log('已清除自动战斗设置')
            leo.panel.autoBattle(true);
        },
        escape: ()=>{
            //技能设置
            const sets = [];
            sets.push({
                user: 1,
                check: context => true,
                type: '逃跑',
                targets: context => [context.player_pos]
            });
            sets.push({
                user: 4,
                check: context => true,
                type: '防御',
                targets: context => [context.player_pos]
            });
            sets.push({
                user: 2,
                check: context => true,
                skillName: '防御',
                targets: context => [context.petUnit.pos]
            });
            var firstRoundDelay = 1;    //首回合延迟
            var roundDelay = 1          //每回合延迟
            var force = true ;          //是否强制启用战斗配置
            leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
            leo.log('已加载自动战斗：逃跑')
            leo.panel.autoBattle(false);
        },
        attack: ()=>{
            //技能设置
            const sets = [];
            sets.push({
                user: 1,
                check: context => true,
                type: '攻击',
                targets: context => context.enemies.map(e => e.pos)
            });
            sets.push({
                user: 4,
                check: context => true,
                type: '攻击',
                targets: context => context.enemies.map(e => e.pos)
            });
            sets.push({
                user: 2,
                check: context => true,
                skillName: '攻击',
                targets: context => context.enemies.map(e => e.pos)
            });
            var firstRoundDelay = 1;    //首回合延迟
            var roundDelay = 4000          //每回合延迟
            var force = true ;          //是否强制启用战斗配置
            leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
            leo.log('已加载自动战斗：攻击')
            leo.panel.autoBattle(false);
        },
        custom: ()=>{
            const needHealChecker = (unit) => unit && unit.curhp > 0 && unit.hpRatio <= 0.6;
            //技能设置
            const sets = [];
            sets.push({
                user: 1,
                check: context => [context.playerUnit, context.petUnit].filter(needHealChecker).length > 0,
                type: '技能', skillName: '补血魔法', skillLevel: 6,
                targets: context => [context.playerUnit, context.petUnit].filter(needHealChecker).sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
            });
            sets.push({
                user: 1,
                check: context => true,
                type: '攻击',
                targets: context => context.enemies.map(e => e.pos)
            });
            sets.push({
                user: 4,
                check: context => true,
                type: '攻击',
                targets: context => context.enemies.map(e => e.pos)
            });
            sets.push({
                user: 2,
                check: context => context.petUnit.hpRatio <= 0.7,
                skillName: '明镜止水',
                targets: context => [context.petUnit.pos]
            });
            sets.push({
                user: 2,
                check: context => true,
                skillName: '攻击',
                targets: context => context.enemies.map(e => e.pos)
            });
            var firstRoundDelay = 1;    //首回合延迟
            var roundDelay = 4000          //每回合延迟
            var force = true ;          //是否强制启用战斗配置
            leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
            leo.log('已加载自动战斗：custom')
            leo.panel.autoBattle(false);
        }
    }

    ///////////////////////脚本默认执行内容///////////////////////////////
    //leo.keepAlive(true); //启用防掉线功能
    leo.panel.autosupply(true);//勾选CGA面板的“自动补给”
    leo.beginTime = leo.now(); //脚本启动时间(Date类型，用于时间计算)
    leo.beginTimeStr = leo.formatDate(leo.now(), leo.FORMAT_DATETIME); //脚本启动时间(字符串类型，用于时间显示)
    leo.log('欢迎使用红叶の脚本，版本['+leo.version+']，请注意是否已经开启防掉线功能');
    //统计信息
    leo.oldXp = cga.GetPlayerInfo().xp; //脚本启动时的经验值
    leo.keepAliveStatus = null; //防掉线状态
    leo.moveTimeout = 250;//遇敌速度延时，单位毫秒
    leo.monitor = {};
    leo.monitor.keepAlive = () => {
        if(leo.keepAliveStatus != leo.monitor.config.keepAlive){
            leo.keepAliveStatus = leo.monitor.config.keepAlive;
            console.log(leo.logTime()+'防掉线功能已' + (leo.keepAliveStatus?'【开启】':'【关闭】'));
        }
        if(leo.keepAliveStatus){
            leo.sayWords();
        }
        setTimeout(leo.monitor.keepAlive, 60000);//每60秒循环调用
    }
    leo.monitor.config = {
        keepAlive: true,    //防掉线
        status: '正常状态', //战斗状态
        logStatus: false,   //是否要实时打印人物状态
        equipsProtect: true,    //装备耐久保护开关
        equipsProtectValue: 10, //装备耐久保护阈值
        autoHp: false,   //自动吃血瓶
        autoHpValue: 600, 
        autoHpItem: '小护士家庭号',
        autoMp: false,   //自动吃料理
        autoMpValue: 100,
        autoMpItem: '魔力之泉',
        healSelf: false,   //自动治疗自己
        monitorLoop: () =>{
            //战斗状态监控
            if (cga.isInBattle() && leo.monitor.config.status != '战斗状态') {
                leo.monitor.config.status = '战斗状态';
                if (leo.monitor.config.logStatus) {
                    console.log(leo.logTime() + '遇敌，进入战斗状态');
                }
            }
            if (!cga.isInBattle() && leo.monitor.config.status != '正常状态') {
                leo.monitor.config.status = '正常状态';
                if (leo.monitor.config.logStatus) {
                    console.log(leo.logTime() + '战斗结束，恢复正常状态');
                }
            }

            //装备耐久保护
            if(cga.isInNormalState() && leo.monitor.config.equipsProtect){
                var protectEquips = cga.getEquipItems().filter(equip => {
                    //避免双偷被取下
                    if(['王者守护神','猫头鹰头盔'].includes(equip.name)){
                        return false;
                    }
                    //完美水晶不取下
                    if(equip.name.indexOf('完美水晶')!=-1){
                        return false;
                    }
                    //水晶不取下
                    if(equip.name.indexOf('的水晶（')!=-1){
                        return false;
                    }
                    //console.log(equip);
                    var endurance = cga.getEquipEndurance(equip);
                    return endurance && endurance[0] <= leo.monitor.config.equipsProtectValue;
                });
                //console.log(protectEquips);
                for(var i in protectEquips){
                    var changeEquips = cga.getInventoryItems().filter(equip => {
                        var endurance = cga.getEquipEndurance(equip);
                        return endurance && endurance[0] > leo.monitor.config.equipsProtectValue && protectEquips[i].name == equip.name;
                    });
                    if(changeEquips && changeEquips.length > 0){
                        if(cga.isInNormalState()){
                            cga.UseItem(changeEquips[0].pos);
                        }
                    }else{
                        var emptyIndexes = leo.getEmptyBagIndexes();
                        if(emptyIndexes && emptyIndexes.length > 0 && cga.isInNormalState()){
                            cga.MoveItem(protectEquips[i].pos, emptyIndexes[0], -1);
                        }
                    }
                }
            }

            //自动吃血瓶
            if(!cga.isInBattle() && leo.monitor.config.autoHp
                && cga.GetPlayerInfo().hp < leo.monitor.config.autoHpValue
                && cga.GetPlayerInfo().hp < cga.GetPlayerInfo().maxhp){
                var items = cga.getInventoryItems().filter(item => {
                    return item.name == leo.monitor.config.autoHpItem;
                });
                if(items && items.length>0){
                    cga.UseItem(items[0].pos);
                    cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => {
                        if (players && players.length > 0) {
                            const index = players.findIndex(p => p.name == cga.GetPlayerInfo().name);
                            if (typeof index == 'number') {
                                cga.PlayerMenuSelect(index);
                                cga.AsyncWaitUnitMenu((error, units) => setTimeout(() => {
                                    if (error) {
                                        leo.resolve();
                                    } else {
                                        cga.UnitMenuSelect(0);
                                    }
                                }, 0));
                            } else leo.resolve();
                        } else leo.resolve();
                    }, 0), 2000);
                }
            }

            //自动吃料理
            if(!cga.isInBattle() && leo.monitor.config.autoMp
                && cga.GetPlayerInfo().mp < leo.monitor.config.autoMpValue
                && cga.GetPlayerInfo().mp < cga.GetPlayerInfo().maxmp){
                var items = cga.getInventoryItems().filter(item => {
                    return item.name == leo.monitor.config.autoMpItem;
                });
                if(items && items.length>0){
                    cga.UseItem(items[0].pos);
                    cga.AsyncWaitPlayerMenu((error, players) => setTimeout(() => {
                        if (players && players.length > 0) {
                            const index = players.findIndex(p => p.name == cga.GetPlayerInfo().name);
                            if (typeof index == 'number') {
                                cga.PlayerMenuSelect(index);
                                cga.AsyncWaitUnitMenu((error, units) => setTimeout(() => {
                                    if (error) {
                                        leo.resolve();
                                    } else {
                                        cga.UnitMenuSelect(0);
                                    }
                                }, 0));
                            } else leo.resolve();
                        } else leo.resolve();
                    }, 0), 2000);
                }
            }

            //自动治疗自己
            if(!cga.isInBattle() && leo.monitor.config.healSelf
                && cga.GetPlayerInfo().health > 0){
                var skill = cga.findPlayerSkill('治疗');
                if(skill){
                    leo.healSelf();
                }
            }

            setTimeout(leo.monitor.config.monitorLoop, 2000);//每秒循环调用
        }
    };
    leo.monitor.keepAlive();    //启动防掉线循环
    setTimeout(leo.monitor.config.monitorLoop, 5000);//启动监控
    return cga;
});