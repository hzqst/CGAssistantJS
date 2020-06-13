module.exports = require('./wrapper').then(cga => {
    global.leo = cga.emogua;
    leo.version = '2.3';
    leo.qq = '158583461'
    leo.copyright = '红叶散落';
    leo.FORMAT_DATE = 'yyyy-MM-dd';
    leo.FORMAT_DATETIME = 'yyyy-MM-dd hh:mm:ss';
    leo.FORMAT_TIME = 'hh:mm:ss';
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
        var pets = cga.GetPetsInfo();
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
        leo.say(leo.logTime() + words);
        return leo.resolve();
    }
    //流程控制辅助函数，无实际功能
    leo.todo = leo.next = leo.done = (result) => {
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
            leo.log('组队完成，队员[' + teammates.toString() + ']');
            return leo.done();
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
            leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
            return leo.next();
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
            .then(() => leo.done());
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
            //登回城买、换水晶
            return leo.buyCrystal(crystalName,1)
            //.then(()=>leo.autoWalk([16,13]))
            .then(()=>leo.useItemEx(crystalName))
            .then(()=>leo.dropItemEx(crystalName))
            .then(()=>leo.logBack());
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
            cga.MovePet(srcPos, dstPos);
            return leo.next();
        }).then(() => leo.delay(1000));
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
    leo.getOneFromBank = (filter) => {
        const bankList = cga.GetBankItemsInfo().filter(e => {
            if (typeof filter == 'string') return e.name == filter || e.itemid == filter;
            else if (typeof filter == 'function') return filter(e);
            else return !filter;
        });
        if(bankList && bankList.length>0){
            var emptyIndexes = leo.getEmptyBagIndexes();
            if(emptyIndexes && emptyIndexes.length > 0){
                cga.MoveItem(bankList[0].pos, emptyIndexes[0], -1);
                console.log('已从银行获取到物品');
                return leo.delay(500); 
            }else{
                console.log('身上没有空位，无法获取');
                return leo.delay(500);
            }
        }else{
            console.log('银行里没有对应的物品，无法获取');
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
		var sysTitles = ['无名的旅人','树旁的落叶','水面上的小草','呢喃的歌声','地上的月影','奔跑的春风','苍之风云','摇曳的金星','欢喜的慈雨','蕴含的太阳','敬畏的寂静','无尽星空'];
		for(var i in titles){
			for(var j in sysTitles){
				if(titles[i] == sysTitles[j]){
					return titles[i];
				}
			}
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
    leo.dropItem = (itemName) => {
        var items = leo.getItems(itemName);
        if(items && items.length >0 ){
            for(var i in items){
                cga.DropItem(items[i].pos);
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

    ///////////////////////脚本默认执行内容///////////////////////////////
    //leo.keepAlive(true); //启用防掉线功能
    leo.beginTime = leo.now(); //脚本启动时间(Date类型，用于时间计算)
    leo.beginTimeStr = leo.formatDate(leo.now(), leo.FORMAT_DATETIME); //脚本启动时间(字符串类型，用于时间显示)
    leo.log('欢迎使用红叶の脚本，版本['+leo.version+']，请注意是否已经开启防掉线功能');
    //统计信息
    leo.oldXp = cga.GetPlayerInfo().xp; //脚本启动时的经验值
    leo.keepAliveStatus = null; //防掉线状态
    leo.monitor = {};
    leo.monitor.keepAlive = () => {
        if(leo.keepAliveStatus != leo.monitor.config.keepAlive){
            leo.keepAliveStatus = leo.monitor.config.keepAlive;
            leo.log('防掉线功能已' + (leo.keepAliveStatus?'【开启】':'【关闭】'));
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
                    if(['王者之风','猫头鹰头盔'].includes(equip.name)){
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
    leo.monitor.config.monitorLoop(); //启动监控
    return cga;
});