module.exports = require('./wrapper').then( async (cga) => {
    global.cga = cga;
    global.leo = cga.emogua;
    leo.messageServer = false;
    leo.appId = '';
    leo.appSecret = '';
    leo.version = '9.12';
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
    leo.kickoff = async (name)=>{
        if(leo.isInTeam()){
            await cga.DoRequest(cga.REQUEST_TYPE_KICKTEAM)
            await leo.waitNPCDialog(dlg => {
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
                        if (match[j] == name) {
                            cga.ClickNPCDialog(0, j / 2);
                            break;
                        }
                    }
                    return leo.delay(1000);
                }
            })
        }
    }
    //队长创建队伍
    leo.buildTeam = (teamPlayerCount, teammates) => {
        if (teammates && teammates.length > 0) {
            if(!is_array_contain(teammates, cga.GetPlayerInfo().name)){
                teammates.push(cga.GetPlayerInfo().name);
            }
            //teamPlayerCount = teammates.length;
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
                        if (!is_array_contain(teammates, teamplayers[i].name) && teamplayers[i].name != '' ) {
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
        return leo.buildTeam(teamPlayerCount,teammates)
        .then(() => {
            var teamplayers = cga.getTeamPlayers().map(v=>v.name);
            //console.log(teamplayers);
            if(!is_array_contain(teamplayers, cga.GetPlayerInfo().name)){
                teamplayers.push(cga.GetPlayerInfo().name);
            }
            return leo.log('组队完成，队员[' + teamplayers.toString() + ']');
        });
    }
    //队员进入队伍，参数为队长名字
    leo.enterTeam = async (teamLeader,waitPos = cga.GetMapXY()) => {
        return leo.loop(async ()=>{
            const teamplayers = cga.getTeamPlayers();
            if(teamplayers.length > 1) {
                //console.log(leo.logTime()+'队长：' + teamplayers[0].name);
                if(teamplayers[0].name == teamLeader 
                    || teamplayers[0].name == '' //新增特殊判断：因为看不见队长导致的获取不到队长名字的BUG
                ){
                    return leo.reject();
                }else{
                    console.log(leo.logTime()+'进错队伍了，预期的队长【'+teamLeader+'】，当前队长【'+teamplayers[0].name+'】');
                    await leo.leaveTeam()
                    await leo.delay(2000)
                    await leo.autoWalk([waitPos.x,waitPos.y])
                }
            }
            const leaderInfo = cga.findPlayerUnit(teamLeader);
            const mypos = cga.GetMapXY();
            if (leaderInfo == null || !cga.isDistanceClose(leaderInfo.xpos, leaderInfo.ypos, mypos.x, mypos.y) || (leaderInfo.xpos == mypos.x && leaderInfo.ypos == mypos.y)) {
                //等待
                //console.log(leo.logTime()+'leo.enterTeam:'+teamLeader);
                await leo.delay(1000)
            }else{
                await leo.turnTo(leaderInfo.xpos, leaderInfo.ypos)
                cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM)
                await leo.waitNPCDialog(dialog => {
                    if (dialog.type === 2) {
                        cga.ClickNPCDialog(-1, dialog.message.split('\n').findIndex(e => e === teamLeader) - 2);
                        return leo.delay(1000);
                    }
                })
            }
            await leo.delay(1000)
        });
    }
    leo.enterTeamBlock = async (teamLeader)=>{
        if(leo.monitor.config.autoChangeLineForLeader) {
            await leo.changeLineForLeader(teamLeader)
        }
        return leo.enterTeam(teamLeader)
        .then(() => {
            return leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
        });
    }
    leo.enterTeamOnce = async (teamLeader)=>{
        const leaderInfo = cga.findPlayerUnit(teamLeader);
        if(leaderInfo){
            await leo.turnTo(leaderInfo.xpos,leaderInfo.ypos)
            cga.DoRequest(cga.REQUEST_TYPE_JOINTEAM)
            await leo.waitNPCDialog(dialog => {
                if (dialog.type === 2) {
                    cga.ClickNPCDialog(-1, dialog.message.split('\n').findIndex(e => e === teamLeader) - 2);
                    return leo.delay(1000);
                }
            })
            if(leo.isInTeam()){
                await leo.log('已进入队伍，队长[' + cga.getTeamPlayers()[0].name + ']');
            }
        }
    }

    leo.checkNearPos = (x1,y1,x2,y2,distance) => {
        let dx = Math.abs(x1-x2);
        let dy = Math.abs(y1-y2);
        if(dx <= distance && dy <= distance){
            return true;
        }
        return false;
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
    //飞碟治疗人物，优先找指定名字的医生，如果找不到，其次找认证的医生，仍找不到，则找随机的医生
    const sysDoctors = ['医道之殇','⌒雪医师∨','Me丶医生'];
    const blackDoctors = ['黑名单医生'];
    leo.healPlayer = async (doctorName) => {
        let doctorNames = [];
        if(doctorName == undefined) {

        }else if(typeof doctorName == 'string') {
            doctorNames.push(doctorName);
        }else if(doctorName instanceof Array) {
            doctorNames = doctorName;
        }

        if(cga.GetPlayerInfo().health !== 0 ){
            let thanks = '';
            await leo.loop(async ()=>{
                if(cga.GetPlayerInfo().health === 0 ){
                    return leo.reject();
                }
                await leo.log('触发登出补给:人物受伤')
                let mapInfo = cga.getMapInfo();
                if(mapInfo.name!='里谢里雅堡'){
                    await leo.goto(n=>n.castle.x)
                    mapInfo = cga.getMapInfo();
                }
                const location = [27,82];
                const distance = 10;
                if(!leo.checkNearPos(mapInfo.x,mapInfo.y,location[0],location[1],distance)) {
                    await leo.autoWalk(location)
                }
                const units = cga.GetMapUnits();
                let doctor;
                if (doctorNames.length>0) {
                    doctor = units.find(u => (u.flags & leo.UnitFlags.Player)
                        && doctorNames.includes(u.unit_name));
                }
                if (!doctor) {
                    doctor = units.find(u => (u.flags & leo.UnitFlags.Player) 
                        && sysDoctors.includes(u.unit_name));
                }
                if (!doctor) {
                    doctor = units.find(u => (u.flags & leo.UnitFlags.Player) 
                        && ( u.nick_name.includes('治疗') 
                            || u.nick_name.includes('医') 
                            || u.title_name.includes('医') 
                            || u.unit_name.includes('医生')
                        ) 
                        && !blackDoctors.includes(u.unit_name));
                }
                if (doctor) {
                    thanks = doctor.unit_name;
                    console.log(leo.logTime()+'发现医生：【'+doctor.unit_name+'】，坐标('+doctor.xpos+','+doctor.ypos+')');
                    const waitPos = cga.getRandomSpace(doctor.xpos, doctor.ypos);
                    await leo.autoWalk(waitPos)
                    await leo.enterTeamOnce(doctor.unit_name)
                    await leo.delay(1000*10)
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                }else{
                    await leo.delay(1000*10)
                }
            })
            await leo.log('已完成人物治疗，感谢医生【'+thanks+'】')
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
    let supplyFailureTimes = 0;
    leo.supply = (x, y) => {
        return leo.turnTo(x, y)
        .then(() => leo.delay(5000))
        .then(()=>{
            var playerinfo = cga.GetPlayerInfo();
            if(playerinfo.hp < playerinfo.maxhp || playerinfo.mp < playerinfo.maxmp){
                supplyFailureTimes++;
                if(supplyFailureTimes<10){
                    console.log('护士补给失败，重新进行补给');
                    return leo.todo()
                    .then(()=>{
                        leo.panel.autosupply(false);
                        return leo.delay(1000);
                    })
                    .then(()=>{
                        leo.panel.autosupply(true);
                        return leo.delay(1000);
                    })
                    .then(()=>leo.supply(x, y));
                }else{
                    cga.LogOut();
                    return leo.delay(1000*60*60*24);
                }
            }
        });
    }
    leo.supplyCastle = async (isLogBack = false) => {
        if(isLogBack){
            await leo.logBack()
        }
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
            if(currentMap=='艾尔莎岛' || currentMap=='里谢里雅堡'){
                return leo.goto(n => n.castle.nurse)
                .then(()=>leo.supply(35,88))
                .then(()=>leo.logBack());
            }
            if(currentMap=='法兰城'){
                return leo.logBack()
                .then(()=>leo.goto(n => n.castle.nurse))
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
                .then(()=>leo.sell(4,filter))
                .then(()=>leo.logBack());
            }
        }
    }
    leo.assessNpc = async (name) => {
        if(leo.has(name)){
            if(cga.GetPlayerInfo().gold<10000){
                await leo.getMoneyFromBank(500000)
            }
            if(cga.GetMapName()!='凯蒂夫人的店'){
                await leo.goto(n=>n.falan.s2)
                await leo.autoWalk([196,78,'凯蒂夫人的店'])
            }
            await leo.autoWalk([15,12])
            await leo.assessRepairFromNpc(0,i=>i.name==name)
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
    leo.autoEquipLv1 = async (weaponName, protectValue = 50) => {
        const equipCheckArr = [
            {name:'平民帽',pos:0},
            {name:'平民衣',pos:1},
            {name:'平民鞋',pos:4},
        ];
        for (var i = 0; i < equipCheckArr.length; i++) {
            const equipCheck = equipCheckArr[i];
            await leo.loop(async ()=>{
                //1.检查身上是否已经装备有高耐久的装备
                const equip = cga.GetItemsInfo().find(i => i.pos == equipCheck.pos);
                if(equip && cga.getEquipEndurance(equip)[0] > protectValue){
                    return leo.reject();
                }
                //2.检查包里是否已经有可更换的备用装备（以前是要满耐久，现在改成高耐久就行）
                const equip2 = cga.GetItemsInfo().find(i => i.pos >= 8 && i.name == equipCheck.name && cga.getEquipEndurance(i)[0] > protectValue);
                if(equip2){
                    //3.1找到了，装备到身上
                    await leo.waitAfterBattle()
                    await leo.useItemEx(equip2.pos)
                    await leo.delay(2000)
                    //丢弃，建议注释，改成用定时检测自动丢弃
                    //await leo.dropItemEx(equipCheck.name) 
                }else{
                    //3.2没找到，去桥头购买
                    console.log(leo.logTime()+'桥头购买装备【' + equipCheck.name + '】');
                    await leo.buyEquipProtectLv1(equipCheck.name)
                }
                await leo.delay(1000)
            })
        }
        if(weaponName) {
            await leo.loop(async ()=>{
                //1.检查身上是否已经装备该武器
                const equip = cga.GetItemsInfo().find(i => (i.pos == 2 || i.pos == 3) && i.name == weaponName);
                if(equip && cga.getEquipEndurance(equip)[0] > protectValue){
                    return leo.reject();
                }
                //2.检查包里是否已经有可更换的备用武器
                const equip2 = cga.GetItemsInfo().find(i => i.pos >= 8 && i.name == weaponName && cga.getEquipEndurance(i)[0] > protectValue);
                if(equip2){
                    //3.1找到了，装备到身上
                    await leo.waitAfterBattle()
                    await leo.useItemEx(equip2.pos)
                    await leo.delay(2000)
                    //丢弃，建议注释，改成用定时检测自动丢弃
                    //await leo.dropItemEx(weaponName) 
                }else{
                    //3.2没找到，去桥头购买
                    console.log(leo.logTime()+'桥头购买武器【' + weaponName + '】');
                    await leo.buyEquipWeaponLv1(weaponName)
                }
                await leo.delay(1000)
            })
        }
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
    leo.getPetEmptyIndex = async (bank = false) => {
        if(bank){
            if(cga.GetMapName()!='银行') {
                await leo.goto(n => n.falan.bank)
            }
            await leo.turnDir(0)
            const pos = [100,101,102,103,104];
            return pos.find(i=>!cga.IsPetValid(i));
        }else{
            const pos = [0,1,2,3,4];
            return pos.find(i=>!cga.IsPetValid(i));
        }
    }
    //银行全存
    leo.saveToBankAll = (filter) => {
        return leo.saveToBank(filter);
    }
    //银行全取
    leo.getFromBankAll = (filter) => {
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
	leo.getFormBankAll = leo.getFromBankAll;
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
    leo.buySealCard = async (sealCardName, count = 20, level = 1) => {
        if (level <= 1 || level > 4) {
            level = 1;
        }
        if(leo.isInTeam()){
            await leo.leaveTeam()
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
    leo.buyCrystal = async (crystalName, count = 1) => {
        if (!crystalName) {
            crystalName = '水火的水晶（5：5）';
        }
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        var emptyIndexes = leo.getEmptyBagIndexes();
        if(emptyIndexes && emptyIndexes.length == 0){
            await leo.logBack()
            await leo.sellCastle()
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
                    if(emptySlotCount==0){
                        //return leo.reject('背包没空间');
                        leo.log('背包没空间，尝试扔魔石')
                        leo.dropItemEx('魔石');
                        emptySlotCount = 1;
                    }
                    store.items.forEach((it) => {
                        if (it.name.indexOf(crystalName) >= 0 && buyCount < emptySlotCount) {
                            buyitem.push({
                                index: it.index,
                                count: count
                            });
                            buyCount++;
                        }
                    });
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
                                    if(emptySlotCount==0){
                                        //return leo.reject('背包没空间');
                                        leo.log('背包没空间，尝试扔魔石')
                                        leo.dropItemEx('魔石');
                                        emptySlotCount = 1;
                                    }
                                    store.items.forEach((it) => {
                                        if (it.name.indexOf(crystalName) >= 0 && buyCount < emptySlotCount) {
                                            buyitem.push({
                                                index: it.index,
                                                count: count
                                            });
                                            buyCount++;
                                        }
                                    });
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
    leo.buyEquipWeaponLv1 = async (equipName, count = 1) => {
        if (!equipName) {
            return leo.reject('购买失败，未指定装备名');
        }
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        if(cga.GetMapName()!='法兰城'){
            await leo.goto(n => n.falan.sell)
        }
        return leo.autoWalk([150,123])
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
    leo.buyEquipProtectLv1 = async (equipName, count = 1) => {
        if (!equipName) {
            return leo.reject('购买失败，未指定装备名');
        }
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        if(cga.GetMapName()!='法兰城'){
            await leo.goto(n => n.falan.sell)
        }
        return leo.autoWalk([156,123])
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
    //返回用于显示的宠物数据(五维：血魔攻防敏)
    leo.getPetCalcInfo = (pet, split = 'x') => {
        return '【LV' + pet.level + '】【' + pet.realname + '】【 ' + pet.maxhp + split + pet.maxmp + split + pet.detail.value_attack + split + pet.detail.value_defensive + split + pet.detail.value_agility + ' 】，BP【 ' + pet.detail.points_endurance + split + pet.detail.points_strength + split + pet.detail.points_defense + split + pet.detail.points_agility + split + pet.detail.points_magical + split + pet.detail.value_recovery + split + pet.detail.value_spirit + ' 】';
    }
    //返回用于算档的宠物数据(五维：血魔攻防敏)
    leo.getPetCalcAttribute = (pet, split = 'x') => {
        return pet.maxhp + split + pet.maxmp + split + pet.detail.value_attack + split + pet.detail.value_defensive + split + pet.detail.value_agility;
    }
    //返回用于算档的宠物数据(BP：血攻防敏魔回复精神)
    leo.getPetCalcBp = (pet, split = 'x') => {
        return pet.detail.points_endurance + split + pet.detail.points_strength + split + pet.detail.points_defense + split + pet.detail.points_agility + split + pet.detail.points_magical + split + pet.detail.value_recovery + split + pet.detail.value_spirit;
    }
    //打印遇敌的1级宠信息，用于自动战斗抓宠过滤
    leo.isCatchPet = (enemies, petOptions,isNameOnly = false) => {
        enemies.forEach(e => {
            let isPrint = true;
            if(isNameOnly){
                isPrint = e.name == petOptions.name;
            }
            if(isPrint){
                let flag = (e.maxhp >= petOptions.minHp && e.maxmp >= petOptions.minMp) && e.name == petOptions.name;

                if(!flag){
                    //如果实际的血+魔总和也大于等于过滤的血+魔总和
                    flag = (e.maxhp + e.maxmp) >= (petOptions.minHp + petOptions.minMp) && e.name == petOptions.name;
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

    leo.getDir = (x,y,fromX,fromY) => {
        const xy = Math.max(-1, Math.min(1, x - fromX)).toString() + Math.max(-1, Math.min(1, y - fromY)).toString();
        switch (xy) {
            case '10':
                return 0;
            case '11':
                return 1;
            case '01':
                return 2;
            case '-11':
                return 3;
            case '-10':
                return 4;
            case '-1-1':
                return 5;
            case '0-1':
                return 6;
            case '1-1':
                return 7;
            default:
        }
        return -1;
    }
    //获取遇敌的可移动坐标列表
    leo.getContactMovePos = (mapInfo,contactType = 0) => {
        //contactType遇敌类型：0-按地图自适应，1-东西移动，2-南北移动，3-随机移动，
        //4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        let result = [];
        const target = {x:mapInfo.x,y:mapInfo.y};
        const walls = cga.buildMapCollisionMatrix();
        const entries = cga.getMapObjects().filter(e => e.cell === 3 || e.cell === 10);
        const isPositionMovable = (x, y) => {
            return walls.matrix[y][x] == 0 && entries.findIndex(e => e.mapx == x && e.mapy == y) < 0;
        };
        var index = 0;
        result.push({
            index: index++,
            orientation: -1,
            x: target.x,
            y: target.y
        });
        if(contactType==1){
            if (isPositionMovable(target.x + 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 0,
                    x: target.x + 1,
                    y: target.y
                });
            }else if (isPositionMovable(target.x - 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 4,
                    x: target.x - 1,
                    y: target.y
                });
            }
        }else if(contactType==2){
            if (isPositionMovable(target.x, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 2,
                    x: target.x,
                    y: target.y + 1
                });
            }else if (isPositionMovable(target.x, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 6,
                    x: target.x,
                    y: target.y - 1
                });
            }
        }else if(contactType==3){
            if (isPositionMovable(target.x + 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 0,
                    x: target.x + 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x + 1, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 1,
                    x: target.x + 1,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 2,
                    x: target.x,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x - 1, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 3,
                    x: target.x - 1,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x - 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 4,
                    x: target.x - 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x - 1, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 5,
                    x: target.x - 1,
                    y: target.y - 1
                });
            }
            if (isPositionMovable(target.x, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 6,
                    x: target.x,
                    y: target.y - 1
                });
            }
            if (isPositionMovable(target.x + 1, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 7,
                    x: target.x + 1,
                    y: target.y - 1
                });
            }
        }else if(contactType==4){ //小圈圈
            if (isPositionMovable(target.x + 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 0,
                    x: target.x + 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x + 1, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 1,
                    x: target.x + 1,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 2,
                    x: target.x,
                    y: target.y + 1
                });
            }
        }else if(contactType==5){ //中圈圈
            result = [];
            if (isPositionMovable(target.x + 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 0,
                    x: target.x + 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 2,
                    x: target.x,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x - 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 4,
                    x: target.x - 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 6,
                    x: target.x,
                    y: target.y - 1
                });
            }
        }else if(contactType==6){ //大圈圈
            result = [];
            if (isPositionMovable(target.x + 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 0,
                    x: target.x + 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x + 1, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 1,
                    x: target.x + 1,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 2,
                    x: target.x,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x - 1, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 3,
                    x: target.x - 1,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x - 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 4,
                    x: target.x - 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x - 1, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 5,
                    x: target.x - 1,
                    y: target.y - 1
                });
            }
            if (isPositionMovable(target.x, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 6,
                    x: target.x,
                    y: target.y - 1
                });
            }
            if (isPositionMovable(target.x + 1, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 7,
                    x: target.x + 1,
                    y: target.y - 1
                });
            }
        }else if(contactType==7){ //十字
            if (isPositionMovable(target.x + 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 0,
                    x: target.x + 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 6,
                    x: target.x,
                    y: target.y - 1
                });
            }
            result.push({
                index: index++,
                orientation: -1,
                x: target.x,
                y: target.y
            });
            if (isPositionMovable(target.x, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 2,
                    x: target.x,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x - 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 4,
                    x: target.x - 1,
                    y: target.y
                });
            }
        }else if(contactType==8){ //画8字
            if (isPositionMovable(target.x + 1, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 1,
                    x: target.x + 1,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x + 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 0,
                    x: target.x + 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x + 1, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 7,
                    x: target.x + 1,
                    y: target.y - 1
                });
            }
            result.push({
                index: index++,
                orientation: -1,
                x: target.x,
                y: target.y
            });
            if (isPositionMovable(target.x - 1, target.y + 1)) {
                result.push({
                    index: index++,
                    orientation: 3,
                    x: target.x - 1,
                    y: target.y + 1
                });
            }
            if (isPositionMovable(target.x - 1, target.y)) {
                result.push({
                    index: index++,
                    orientation: 4,
                    x: target.x - 1,
                    y: target.y
                });
            }
            if (isPositionMovable(target.x - 1, target.y - 1)) {
                result.push({
                    index: index++,
                    orientation: 5,
                    x: target.x - 1,
                    y: target.y - 1
                });
            }
        }else{
            var pos = leo.getMovablePositionAround(target);
            pos.index = index++;
            result.push(pos);
        }
        return result;
    }
    //停止遇敌检测
    leo.contactCheck = async (protect, talk = false, checkTeam = false) => {
        if (!cga.isInNormalState()) {
            return false;
        }
        const playerInfo = cga.GetPlayerInfo();
        const pets = cga.GetPetsInfo();
        const minHp = (protect && protect.minHp) ? protect.minHp : 100;
        const minMp = (protect && protect.minMp) ? protect.minMp : 60;
        const minPetHp = (protect && protect.minPetHp) ? protect.minPetHp : 100;
        const minPetMp = (protect && protect.minPetMp) ? protect.minPetMp : 0;
        const maxPetNumber = (protect && protect.maxPetNumber) ? protect.maxPetNumber : 5;
        const maxItemNumber = (protect && protect.maxItemNumber) ? protect.maxItemNumber : 20;
        const checker = await (protect && typeof protect.checker == 'function') ? protect.checker : null;
        const minTeamNumber = (protect && protect.minTeamNumber) ? protect.minTeamNumber : 1;
        if (
            playerInfo.hp < minHp || playerInfo.mp < minMp || cga.getInventoryItems().length > maxItemNumber ||
            pets.length > maxPetNumber || pets.filter(e => e.battle_flags == 2).find(p => p.hp < minPetHp || p.mp < minPetMp) ||
            (
                checkTeam &&
                (leo.getTeamNumber() < minTeamNumber)
            ) ||
            (checker && await checker())
        ) {
            if (talk) {
                await leo.say('触发战斗保护');
            }
            return true;
        }
        return false;
    }
    leo.checkBattle = async (waitTime = 0) => {
        const world = cga.GetWorldStatus();
        const game = cga.GetGameStatus();
        if (world == 9 && game == 3) {
            return leo.next();
        }
        await leo.waitAfterBattle()
        if(leo.highspeed){
            const seconds = parseInt(waitTime / 1000);
            //console.log(leo.logTime()+'战斗结束，等待'+seconds+'秒');
            await leo.delay(waitTime)
            //console.log(leo.logTime()+'等待完毕，继续移动');
        }
    }
    leo.contactStatus = false;
    //队长遇敌程序
    leo.contactTeamLeader = async (protect) => {
        //contactType遇敌类型：-1-旧遇敌(高效)，0-按地图自适应，1-东西移动，2-南北移动，3-随机移动，
        //4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        var contactType = protect.contactType || 0;
        if(contactType == -1){
            return leo.encounter(protect);
        }
        if (leo.contactStatus){
            console.log(leo.logTime()+'遇敌程序错误：重复启动遇敌程序，等待30秒进行重启')
            leo.contactStatus = false;
            await leo.delay(1000*30)
            //return leo.reject('遇敌程序错误：重复启动遇敌程序');
        }
        //await leo.downloadMap();
        var currentMapInfo = cga.getMapInfo();
        var contactMovePos = leo.getContactMovePos(currentMapInfo,contactType);
        //console.log(contactMovePos)
        if(contactMovePos && contactMovePos.length<2){
            return leo.reject('遇敌程序错误：附近没有可移动的坐标点');
        }
        leo.contactStatus = true; //标记遇敌程序开始
        let curPos = {
            index: 0,
            orientation: -1,
            x: cga.GetMapXY().x,
            y: cga.GetMapXY().y
        };
        //先往返移动一格位置，避免因为刚切了图，导致的遇敌无效
        let checkPos = contactMovePos.find((v)=>v.index!=curPos.index);
        await leo.walkTo([checkPos.x,checkPos.y])
        await leo.delay(1000)
        await leo.walkTo([curPos.x,curPos.y])
        leo.waitMessageUntil((chat) => {
            if (chat.msg && chat.msg.indexOf('触发战斗保护') >= 0) {
                if (leo.getTeammates().find(t => t.unit_id == chat.unitid)) {
                    leo.contactStatus = false; //标记遇敌程序停止
                    return true;
                }
            }
        });
        await leo.loop(async () => {
            let afterBattleWaitTime = leo.contactBattleWaitTime || 5000;
            await leo.checkBattle(afterBattleWaitTime)
            if(!leo.contactStatus){
                await leo.delay(2000)
                return leo.reject();
            }
            const isStop = await leo.contactCheck(protect, false, true);
            if(isStop || currentMapInfo.name != cga.GetMapName()){
                leo.contactStatus = false; //标记遇敌程序停止
                await leo.delay(2000)
                return leo.reject();
            }
            if (cga.isInNormalState()) {
                //console.log(curPos)
                try{
                    let movePos;
                    if(contactType<3){
                        let movePosArr = contactMovePos.filter((v)=>v.index!=curPos.index);
                        if(movePosArr.length==1){
                            movePos = movePosArr[0];
                        }else{
                            //随机获取移动坐标
                            let i = Math.floor(Math.random()*movePosArr.length);
                            movePos = movePosArr[i];
                        }
                    }
                    if(contactType==3){
                        let movePosArr = contactMovePos.filter((v)=>v.index!=curPos.index
                            && cga.isDistanceClose(curPos.x, curPos.y, v.x, v.y)
                            );
                        if(movePosArr.length==1){
                            movePos = movePosArr[0];
                        }else{
                            //随机获取移动坐标
                            let i = Math.floor(Math.random()*movePosArr.length);
                            movePos = movePosArr[i];
                        }
                    }
                    if(contactType>=4 && contactType<=8){
                        //按顺序执行 -> 转圈圈/十字/8字
                        let movePosArr = contactMovePos.filter((v)=>v.index>curPos.index);
                        if(movePosArr && movePosArr.length>0){
                            movePos = movePosArr[0];
                        }else{
                            movePos = contactMovePos[0];
                        }
                    }
                    //console.log('moveto',movePos.index)
                    //let dir = leo.getDir(movePos.x,movePos.y,curPos.x,curPos.y);
                    let visible = protect.visible || false;
                    //cga.ForceMove(dir, visible);
                    cga.ForceMoveTo(movePos.x, movePos.y, visible);
                    curPos = movePos;
                    const speedFix = 100;
                    const realTimeout = leo.moveTimeout - speedFix;
                    await leo.delay(realTimeout)
                    return leo.next();
                } catch(e) {
                    console.log(leo.logTime()+'遇敌程序错误：移动失败', e);
                }
            }
            await leo.delay(1000)
        })
    }

    //随机遇敌(队长用)
    leo.encounterTeamLeader = leo.contactTeamLeader;
	//leo.encounterTeamLeader = leo.encounter;
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
		var sysTitles = ['恶人','忌讳的人','受挫折的人','无名的旅人','路旁的落叶','水面上的小草','呢喃的歌声','地上的月影','奔跑的春风','苍之风云','摇曳的金星','欢喜的慈雨','蕴含的太阳','敬畏的寂静','无尽星空','迈步前进者','追求技巧的人','刻于新月之铭','掌上的明珠','敬虔的技巧','踏入神的领域','贤者','神匠','摘星的技巧','万物创造者','持石之贤者'];
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
    leo.useItems = async (itemName,times = 1) => {
        var items = leo.getItems(itemName);
        if(items && items.length >0 ){
            for(var i in items){
                if(times-->0){
                    cga.UseItem(items[i].pos);
                }
            }
        }
        await leo.delay(1000);
    }
    leo.dropItem = async (itemName,minCount) => {
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
        await leo.delay(1000);
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
    leo.useItemEx = async (item) => {
        var realItem = leo.getItemEx(item);
        if(realItem){
            cga.UseItem(realItem.pos);
            await leo.delay(1000);
        }
    }
    leo.dropItemEx = async (item) => {
        var realItem = leo.getItemEx(item);
        if(realItem){
            if (cga.isInNormalState() && !leo.isMoving()) {
                cga.DropItem(realItem.pos);
                await leo.delay(1000);
            }
        }
    }
    //随机往旁边移动1格（队长使用，方便队员进组）
    leo.moveAround = async (mapInfo = leo.getMapInfo()) => {
        var movablePos = leo.getMovablePositionsAround(mapInfo);
        if(movablePos && movablePos.length > 0){
            await leo.loop(async()=>{
                for (var i = 0; i < movablePos.length; i++) {
                    try{
                        await leo.autoWalk([movablePos[i].x,movablePos[i].y])
                    }catch(e){
                        //do nothing
                    }
                    let newPos = cga.getMapXY();
                    if(newPos.x != mapInfo.x || newPos.y != mapInfo.y){
                        return leo.reject();
                    }
                }
            })
        }else{
            return leo.autoWalk([mapInfo.x+1,mapInfo.y]);
        }
    }
    leo.moveNearest = async ([x,y]) => {
        const walls = cga.buildMapCollisionMatrix();
        const isPositionMovable = (x, y) => {
            return walls.matrix[y][x] == 0;
        }
        if (isPositionMovable(x, y)) {
            return leo.autoWalk([x,y]);
        }
        if (isPositionMovable(x + 1, y)) {
            return leo.autoWalk([x + 1,y]);
        }
        if (isPositionMovable(x + 1, y + 1)) {
            return leo.autoWalk([x + 1,y + 1]);
        }
        if (isPositionMovable(x, y + 1)) {
            return leo.autoWalk([x,y + 1]);
        }
        if (isPositionMovable(x - 1, y)) {
            return leo.autoWalk([x - 1,y]);
        }
        if (isPositionMovable(x - 1, y - 1)) {
            return leo.autoWalk([x - 1,y - 1]);
        }
        if (isPositionMovable(x, y - 1)) {
            return leo.autoWalk([x,y - 1]);
        }
        if (isPositionMovable(x - 1, y + 1)) {
            return leo.autoWalk([x - 1,y + 1]);
        }
        if (isPositionMovable(x + 1, y - 1)) {
            return leo.autoWalk([x + 1,y - 1]);
        }
        return leo.reject('没有可以到达的坐标');
    }

    //地图搜索范围
    leo.getMovablePoints = (map, start,all=false) => {
        const foundedPoints = {};
        foundedPoints[start.x + '-' + start.y] = start;
        const findByNextPoints = (centre) => {
            const nextPoints = [];
            const push = (p) => {
                if (p.x > map.x_bottom && p.x < map.x_size && p.y > map.y_bottom && p.y < map.y_size) {
                    if ( (map.matrix[p.y][p.x] === 0) || all ) {
                        const key = p.x + '-' + p.y;
                        if (!foundedPoints[key]) {
                            foundedPoints[key] = p;
                            nextPoints.push(p);
                        }
                    }
                }
            };
            push({x: centre.x + 1, y: centre.y});
            //push({x: centre.x + 1, y: centre.y + 1});
            push({x: centre.x, y: centre.y + 1});
            //push({x: centre.x - 1, y: centre.y + 1});
            push({x: centre.x - 1, y: centre.y});
            //push({x: centre.x - 1, y: centre.y - 1});
            push({x: centre.x, y: centre.y - 1});
            //push({x: centre.x + 1, y: centre.y - 1});
            nextPoints.forEach(findByNextPoints);
        };
        findByNextPoints(start);
        return foundedPoints;
    }
    leo.getMazeEntry = () => {
        const mapObjects = cga.getMapObjects();
        const current = cga.GetMapXY();
        const entryIcons = cga.buildMapCollisionRawMatrix().matrix;
        const entries = mapObjects.filter(o => {
            if (o.cell == 3) {
                o.icon = entryIcons[o.y][o.x];
                return true;
            }
            return false;
        }).sort((a,b) => {
            const aDistance = Math.abs(a.x - current.x) + Math.abs(a.y - current.y);
            const bDistance = Math.abs(b.x - current.x) + Math.abs(b.y - current.y);
            return bDistance - aDistance;
        });
        if(entries.length==0){
            throw '没有找到迷宫出入口或上下楼梯：' + entries;
        }
        if(entries.length==1){
            return entries[0];
        }
        let entry0 = entries.find(entry=>entry.icon==0);
        if(entry0){
            return entry0;
        }else{
            return entries[0];
        }
    }
    leo.getEntry = (entries,up = true) => {
        /**
         * icon
         *   小 down, 大 up (不全是)
         *   12002 down 12000 up (狗洞)
         *   17967 down 17966 up (海底墓场-保证书)
         *   13273 down 13272 up (虫洞)
         *   17981 down 17980 up (黑色方舟)
         *   17975 down 17974 up (黑色的祈祷)
         *   13997 down 13996 up (半山)
         *   17965 down 19764 up (布满青苔的洞窟)
         *   0 迷宫出入口
         * return [最远，最近]
         */
        // entries:
        //  [
        //   {
        //     x: 24,
        //     y: 17,
        //     mapx: 24,
        //     mapy: 17,
        //     cell: 3,
        //     rawcell: -16381,
        //     icon: 17966
        //   },
        //   {
        //     x: 10,
        //     y: 19,
        //     mapx: 10,
        //     mapy: 19,
        //     cell: 3,
        //     rawcell: -16381,
        //     icon: 17967
        //   }
        // ]
        if(entries.length==0){
            throw '没有找到迷宫出入口或上下楼梯：' + entries;
        }
        if(entries.length==1){
            return entries[0];
        }
        if(entries.length>2){
            //超出2个迷宫入口，随机返回
            const index = Math.floor((Math.random()*entries.length));
            return entries[index];
        }
        //两个楼梯的icon一样的，无法正确地判断，只能选取离入口最远的
        if(entries[0].icon == entries[1].icon){
            //console.log('两个楼梯的icon一样的，无法正确地判断：')
            //console.log(entries)
            return entries[0];
        }
        //特殊的迷宫地图
        const mazeSpecial = [17966,17967,13272,13273,17980,17981,17974,17975,13996,13997,17964,17965];
        const mazeSpecialFlag = entries.find(entry=>mazeSpecial.includes(entry.icon));
        const entrySpecial = [17966,17967,13272,13273,17980,17981,17974,17975];
        const entrySpecialFlag = entries.find(entry=>entrySpecial.includes(entry.icon));
        const entryFlag = entries.find(entry=>entry.icon===0);

        //特定的迷宫：
        const mazeEntryOptions = [ 
            //[迷宫名字,爬楼方向,[1楼up,1楼down],[顶楼up,顶楼down],[中间楼up,中间楼down]]
            ['奇怪的洞窟',false,[0,12002],[12000,12000],[12000,12002]],//狗洞
            ['黑龙沼泽',false,[0,12002],[12000,0],[12000,12002]],//黑龙
            ['通往山顶的路',true,[13996,0],[0,13997],[13996,13997]],//半山
            ['蜥蜴洞穴',false,[0,12002],[12000,0],[12000,12002]],//蜥蜴
            ['布满青苔的洞窟',true,[17964,0],[0,17965],[17964,17965]],//1转树精
            ['贝兹雷姆的迷宫',true,[12000,0],[0,12002],[12000,12002]],//2转神兽
            ['隐秘山道上层',false,[0,17973],[17972,0],[17972,17973]],//探险专家(贝爷)
            ['隐秘山道中层',false,[0,17991],[17990,0],[17990,17991]],//探险专家(贝爷)
            ['隐秘山道下层',false,[0,17975],[17974,0],[17974,17975]],//探险专家(贝爷)
            ['积雪的山路海拔',true,[17956,0],[0,17957],[17956,17957]],//雪山
            ['废墟地下',false,[0,17955],[17954,0],[17954,17955]],//承认之戒
            ['隐秘之洞地下',false,[0,[17971,17967,17983,17991]],[[17970,17966,17982,17990],0],[[17970,17966,17982,17990],[17971,17967,17983,17991]]],//五转
            ['虫洞地下',false,[0,13273],[13272,0],[13272,13273]],//卵3
            ['砂漠之祠地下',false,[0,13999],[13998,0],[13998,13999]],//抓木乃伊
            ['海底墓场外苑',false,[0,17967],[17966,0],[17966,17967]],//卵4
            ['土之迷宫',true,[17970,0],[0,17971],[17970,17971]],//土洞
            ['水之洞窟地下',false,[0,17967],[17966,0],[17966,17967]],//水洞
            ['水之迷宫地下',false,[0,17967],[17966,0],[17966,17967]],//水洞
            ['炎之洞窟',false,[0,17983],[17982,0],[17982,17983]],//炎洞
            ['风之洞窟',true,[17990,0],[0,17991],[17990,17991]],//风洞
            ['旧日迷宫',false,[0,13275],[13274,0],[13274,13275]],//旧日迷宫
            ['旧日之塔',true,[13996,0],[0,13997],[13996,13997]],//旧日之塔
            ['牛鬼的洞窟',true,[13996,0],[0,13997],[13996,13997]],//偷狗粮
            ['奇怪的坑道',false,[0,17955],[17954,0],[17954,17955]],//抓烈风哥布林
            ['阿鲁巴斯的洞窟',true,[13996,0],[0,13997],[13996,13997]],//抓僵尸
            ['迷宫222',true,[0,120],[120,0],[120,120]],//人神
            ['达尔文海海底地下',false,[0,17967],[17966,0],[17966,17967]],//半山2
            ['通往地狱的道路',false,[0,17957],[17956,0],[17956,17957]],//半山6
            ['黑色方舟',true,[17980,0],[0,17981],[17980,17981]],//四转
            ['秘密回廊',false,[0,12002],[12000,0],[12000,12002]],//天界2
            ['通向顶端的阶梯',true,[13996,0],[0,13997],[13996,13997]],//天界3
            ['未知',true,[0,120],[120,0],[120,120]],
        ];
        //特定的迷宫起始楼层
        const floorStart = ['隐秘之洞地下11层','通往山顶的路100M','通往山顶的路1100M','隐秘山道上层B1','隐秘山道中层B1','隐秘山道下层B1','水之迷宫地下21楼'];
        const mapName = cga.GetMapName();
        const mazeEntryOption = mazeEntryOptions.find(option=>mapName.startsWith(option[0]));
        let elist;
        if(mazeEntryOption) {
            //console.log('指定的迷宫')
            elist = entries.map((v,i,arr)=>{
                if(entryFlag) {
                    const regStr = '([^0-9]+1[^0-9]+)|([^0-9]+100[^0-9]+)|([^0-9]+1100[^0-9]+)|([^0-9]+B1$)';
                    const reg = new RegExp(regStr,"g");
                    let isMatch = reg.test(mapName);
                    if(floorStart.includes(mapName)){
                        isMatch = true;
                    }
                    //console.log('isMatch:'+isMatch);
                    if(isMatch){
                        //1楼，100，1100
                        const es = mazeEntryOption[2][0];
                        if(es instanceof Array) {
                            v.up = es.includes(v.icon);
                        }else{
                            v.up = v.icon === es;
                        }
                    }else{
                        //顶楼
                        const es = mazeEntryOption[3][0];
                        if(es instanceof Array) {
                            v.up = es.includes(v.icon);
                        }else{
                            v.up = v.icon === es;
                        }
                    }
                }else{
                    //中间楼
                    const es = mazeEntryOption[4][0];
                    if(es instanceof Array) {
                        v.up = es.includes(v.icon);
                    }else{
                        v.up = v.icon === es;
                    }
                }
                return v;
            })
        }else{
            //console.log('非指定的迷宫')
            elist = entries.map((v,i,arr)=>{
                if(entryFlag) {
                    const regStr = '([^0-9]+1[^0-9]+)|([^0-9]+100[^0-9]+)|([^0-9]+1100[^0-9]+)|([^0-9]+B1$)';
                    const reg = new RegExp(regStr,"g");
                    let isMatch = reg.test(mapName);
                    if(floorStart.includes(mapName)){
                        isMatch = true;
                    }
                    //console.log('isMatch:'+isMatch);
                    if(isMatch){
                        if(v.icon === 0){
                            v.up = false;
                        }else{
                            v.up = true;
                        }
                    }else{
                        if(v.icon === 0){
                            v.up = true;
                        }else{
                            v.up = false;
                        }
                    }
                    if(entrySpecialFlag){
                        v.up = !v.up;
                    }
                }else{
                    const e1 = v;
                    const e2 = arr.find((v2,i2)=>i!=i2);
                    if(e1.icon > e2.icon){
                        v.up = true;
                    }else{
                        v.up = false;
                    }
                    if(mazeSpecialFlag){
                        v.up = !v.up;
                    }
                }
                return v;
            })
        }
        //console.log(elist);
        return elist.find(e=>e.up === up);
    }
    //迷宫搜索
    leo.searchInMaze = (targetFinder, recursion = true, up = true, parameters = {}) => leo.downloadMap().then(async walls => {
        //console.log('up:'+up);
        const entries = await leo.getMazeEntries();
        var entry = leo.getEntry(entries,up);
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
                if(cga.isPathAvailable(centre.x, centre.y, next.x, next.y)){
                    return leo.autoWalk([next.x,next.y],undefined,undefined,{compress: false})
                    .then(() => getTarget())
                    .then(() => toNextPoint(remain,next))
                } else {
                    return getTarget().then(() => toNextPoint(remain,next))
                }
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
    leo.findOne = (targetFinder, todo = leo.next(), up = false)=>{
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
        .catch(error=>{
            console.log('寻找迷宫出错(findOne),error:'+error);
        });
    }
    const PF = require('pathfinding');
    leo.findPathList = ([curX,curY],[targetX,targetY,destination],compress = true) => {
        const walls = cga.buildMapCollisionMatrix();
        const matrix = walls.matrix;
        const grid = new PF.Grid(matrix);
        const finder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });
        let path = finder.findPath(curX, curY, targetX, targetY, grid);
        let list = compress ? PF.Util.compressPath(path) : path;
        if(list.length>0 && destination) {
            list[list.length - 1][2] = destination;
        }
        return list;
    }
    leo.autoWalkEx = async ([x,y,destination],compress = true) => {
        const mapInfo = cga.getMapInfo();
        const list = leo.findPathList([mapInfo.x,mapInfo.y],[x,y,destination],compress);
        //console.log(list)
        if(list && list.length>0) {
            try{
                await leo.walkList(list)
            }catch(e) {
                const world = cga.GetWorldStatus();
                const game = cga.GetGameStatus();
                if (world == 10) {
                    //console.log(leo.logTime()+'自动寻路中，进入战斗')
                }
                let afterBattleWaitTime = leo.autoWalkBattleWaitTime || 5000;
                await leo.checkBattle(afterBattleWaitTime)
                if(cga.GetMapName()==mapInfo.name){
                    return leo.autoWalkEx([x,y,destination],compress);
                }else{
                    if(destination && (destination === '*' || destination === cga.GetMapName())){
                        return leo.done();
                    }
                    return leo.reject('迷宫刷新');
                }
            }
        }else{
            return leo.reject('leo.autoWalkEx()无法到达的坐标：['+destination+'] ['+x+','+y+']');
        }
    }
    leo.autoWalk = async (target, walls = cga.buildMapCollisionMatrix(), mapInfo = leo.getMapInfo(), options = {compress: true}) => {
        if (
            (target[2] && leo.arrived(target[2], mapInfo, mapInfo)) ||
            (!target[2] && mapInfo.x == target[0] && mapInfo.y == target[1])
        ) {
            return leo.done();
        } else if (target[2] && mapInfo.x == target[0] && mapInfo.y == target[1]) {
            return leo.walkTo(target, mapInfo);
        }
        return leo.autoWalkEx(target,options.compress);
    }
    leo.walkRandomMaze = async (up = true, walkProtect = ()=>{}, fixPoint = 6) => {
        let excludePoints = [];
        let pointList = [];
        const checkEntry = async (up) => {
            let targetEntry = null;
            const entries = await leo.getMazeEntries(false);
            if(entries.length>1) {
                targetEntry = leo.getEntry(entries, up);
            }
            if(targetEntry) {
                //找到出口
                const current = cga.GetMapXY();
                const list = leo.findPathList([current.x,current.y],[targetEntry.x, targetEntry.y, '*']);
                if(list.length>0) {
                    //找到通路
                    return true;
                }
            }
            return false;
        }

        const addExclude = (pathList) => {
            //console.log('pathList');
            //console.log(pathList);
            const current = cga.GetMapXY();
            const walls = cga.buildMapCollisionMatrix();
            const points = Object.values(leo.getMovablePoints(walls, current))
            .filter(p=>{
                p.key = p.x + '-' + p.y;
                return !excludePoints.includes(p.key);
            });

            for (let i = 0; i < pathList.length; i++) {
                const position = pathList[i];
                points.forEach(p=>{
                    let xd = p.x - position[0];
                    let yd = p.y - position[1];
                    let distance = Math.abs(xd) + Math.abs(yd);
                    let key = p.x + '-' + p.y;
                    if(distance<=fixPoint && !excludePoints.includes(key)){
                        //console.log('新增排除点：' + p.key);
                        excludePoints.push(p.key);
                    }
                })
            }
            //console.log('排除点数量：' + excludePoints.length);
        }

        const toNextPoint = async (points, centre, up) => {
            const allPoint = points
            .map(p=>{
                let xd = p.x - centre.x;
                let yd = p.y - centre.y;
                let distance = Math.abs(xd) + Math.abs(yd);
                p.distance = distance;
                if(xd>=0&&yd<0){
                    p.quadrant = 0; 
                }else if(xd>0&&yd>=0){
                    p.quadrant = 1;
                }else if(xd<=0&&yd>0){
                    p.quadrant = 2;
                }else if(xd<0&&yd<=0){
                    p.quadrant = 3;
                }
                p.key = p.x + '-' + p.y;
                return p;
            })
            .filter(p=>{
                p.key = p.x + '-' + p.y;
                return !excludePoints.includes(p.key);
            });
            const randomMazeAlgorithm = leo.randomMazeAlgorithm || 'DepthFirst';
            if(randomMazeAlgorithm == 'DepthFirst') {
                for (var i = 0; i < 4; i++) {
                    const quadrantList = allPoint.filter(p=>p.quadrant===i);
                    const maxDistance = Math.max(...quadrantList.map(p=>p.distance),-1);
                    const furthestList = quadrantList.filter(p=>p.distance===maxDistance);
                    if(furthestList.length>0) {
                        const index = Math.floor((Math.random()*furthestList.length));
                        const next = furthestList[index];
                        pointList.push(next);
                    }
                }
                //console.log('坐标点列表：')
                //console.log(pointList);

                await leo.loop(async ()=>{
                    if(pointList.length===0) {
                        return leo.reject();
                    }
                    const check = await checkEntry(up)
                    if(check){
                        return leo.reject();
                    }
                    const current = cga.GetMapXY();
                    const next = pointList.shift();
                    //console.log('当前目标：')
                    //console.log(next);
                    const pathList = leo.findPathList([current.x,current.y],[next.x,next.y],false);
                    if(pathList.length>0) {
                        await leo.autoWalkEx([next.x,next.y],false)
                        addExclude(pathList)
                        if(walkProtect && walkProtect()) {
                            return leo.reject('触发保护');
                        }
                        //检查是否因为走到新的坐标点，同象限有新的可移动坐标出现
                        await leo.loop(async ()=>{
                            const check = await checkEntry(up)
                            if(check){
                                return leo.reject();
                            }
                            const current2 = cga.GetMapXY();
                            const walls = cga.buildMapCollisionMatrix();
                            const newPoints = Object.values(leo.getMovablePoints(walls, current2))
                            .filter(p=>{
                                p.key = p.x + '-' + p.y;
                                return !excludePoints.includes(p.key);
                            })
                            .map(p=>{
                                let xd = p.x - current2.x;
                                let yd = p.y - current2.y;
                                let distance = Math.abs(xd) + Math.abs(yd);
                                p.distance = distance;
                                if(xd>=0&&yd<0){
                                    p.quadrant = 0; 
                                }else if(xd>0&&yd>=0){
                                    p.quadrant = 1;
                                }else if(xd<=0&&yd>0){
                                    p.quadrant = 2;
                                }else if(xd<0&&yd<=0){
                                    p.quadrant = 3;
                                }
                                p.key = p.x + '-' + p.y;
                                return p;
                            })
                            .filter(p=>p.quadrant===next.quadrant&&p.distance>0);
                            if(newPoints.length==0) {
                                return leo.reject();
                            }
                            //继续往前开图
                            const index2 = Math.floor((Math.random()*newPoints.length));
                            const next2 = newPoints[index2];
                            //console.log(leo.logTime()+'继续往前开图，坐标：['+next2.x+','+next2.y+']')
                            const pathList2 = leo.findPathList([current2.x,current2.y],[next2.x,next2.y],false);
                            if(pathList2.length>0){
                                await leo.autoWalkEx([next2.x,next2.y],false)
                                addExclude(pathList2);
                                if(walkProtect && walkProtect()) {
                                    return leo.reject('触发保护');
                                }
                            }
                        })
                    }else{
                        addExclude([next]);
                    }
                    await leo.delay(1000)
                })
            }else {
                console.log(leo.logTime()+'迷宫开图算法异常:'+randomMazeAlgorithm);
                return leo.reject();
            }

            const check = await checkEntry(up)
            if(check){
                return leo.done();
            }

            const current = cga.GetMapXY();
            await leo.loop(async ()=>{
                //等待加载周围的地图块
                if(cga.getRandomSpace(current.x, current.y) != null){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
            const walls = cga.buildMapCollisionMatrix();
            //console.log(leo.logTime()+'重新寻找，当前坐标：['+cga.GetMapName()+'] ['+current.x+','+current.y+']');
            points = leo.getMovablePoints(walls, current);
            return toNextPoint(Object.values(points), current,up);
            //return Promise.resolve();
        }

        const walkMaze = async (up = true) => {
            //console.log('开始寻路...');
            const entries = await leo.getMazeEntries(false);
            let targetEntry = null;
            if(entries && entries.length>1) {
                targetEntry = leo.getEntry(entries, up)
            }
            if(targetEntry) {
                const current = cga.GetMapXY();
                //找到出口
                const list = leo.findPathList([current.x,current.y],[targetEntry.x, targetEntry.y, '*']);
                if(list.length>0) {
                    //找到通路
                    //console.log(leo.logTime()+'找到出口坐标：['+targetEntry.x+','+targetEntry.y+']')
                    await leo.autoWalkEx([targetEntry.x, targetEntry.y, '*'])
                    const mazeChangeWaitTime = leo.mazeChangeWaitTime || 5000;
                    return leo.delay(mazeChangeWaitTime);
                }else{
                    //没有通路，继续开图
                }
            }else{
                //没有找到出口，继续开图
            }
            //开图逻辑，以原始坐标为中心，向四周逐步寻找可移动的坐标点（顺时针方向）
            const current = cga.GetMapXY();
            await leo.loop(async ()=>{
                //等待加载周围的地图块
                if(cga.getRandomSpace(current.x, current.y) != null){
                    return leo.reject();
                }
                await leo.delay(2000)
            })
            const walls = cga.buildMapCollisionMatrix();
            console.log(leo.logTime()+'开始寻找，当前坐标：['+cga.GetMapName()+'] ['+current.x+','+current.y+']');
            const points = leo.getMovablePoints(walls, current);
            //console.log(points)
            await toNextPoint(Object.values(points), current,up)
            return leo.walkRandomMaze(up,walkProtect);
        }
        return walkMaze(up);
    }
    leo.walkRandomMazeUntil = async (check, entryFilter, walkProtect = ()=>{}, fixPoint) => {
        let times = 0;
        //console.log(entryFilter)
        while (times <= 101 && !check()) {
            times++;
            await leo.walkRandomMaze(entryFilter,walkProtect,fixPoint);
        }
    }
    leo.lookForNpc = async (targetFinder, todo = leo.next(), up = true, 
        walkProtect = ()=>{}, recursion = true, fixPoint = 6, saveAndLoad = true) => {
        if(leo.plugins.searchRandomMaze.enable) {
            const options = {
                targetFinder,
                todo,
                up,
                walkProtect,
                recursion,
                fixPoint,
                saveAndLoad
            }
            return leo.plugins.searchRandomMaze.lookForNpc(cga,options);
        }else if(leo.searchRandomMaze && typeof leo.searchRandomMaze === 'function') {
            console.log(leo.logTime()+'已成功加载自动寻找迷宫NPC插件(集成版)')
            return leo.searchRandomMaze(targetFinder,todo,up,walkProtect,recursion,fixPoint,saveAndLoad);
        }else{
            return leo.findOne(targetFinder,todo,up);
        }
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
    leo.gotoAKLF = async ()=>{
        if(cga.GetMapName() == '阿凯鲁法村'){
            return leo.done();
        }else{
            if(cga.GetMapName() != '伊尔村'){
                await leo.goto(n => n.teleport.yer)
            }
            await leo.autoWalk([57,71])
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
    //阿凯鲁法村定居登出
    leo.logBackA = async ()=>{
        await leo.loop(async ()=>{
            if(cga.getMapInfo().name=='阿凯鲁法村' && cga.getMapInfo().x == 99 ){
                return leo.reject()
            }else{
                await leo.logBack()
            }
            return leo.delay(1000)
        })
    }
    //去阿凯鲁法村银行
    leo.gotoBankA = () => {
        return leo.logBackA()
        .then(()=>leo.autoWalkList([
            [139, 136,'银行'],
            [20, 17]
        ]))
        .then(()=>leo.turnDir(0));
    }
    leo.supplyA = () => {
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
            return leo.logBackA()
            .then(()=>leo.autoWalkList([[117,155,'夏姆吉诊所'],[22,17]]))
            .then(()=>leo.supplyDir(6))
            .then(()=>leo.delay(2000))
            .then(()=>{
                playerinfo = cga.GetPlayerInfo();
                if(playerinfo.hp < playerinfo.maxhp || playerinfo.mp < playerinfo.maxmp){
                    supplyFailureTimes++;
                    if(supplyFailureTimes<10){
                        console.log('护士补给失败，重新进行补给');
                        return leo.todo()
                        .then(()=>{
                            leo.panel.autosupply(false);
                            return leo.delay(1000);
                        })
                        .then(()=>{
                            leo.panel.autosupply(true);
                            return leo.delay(1000);
                        })
                        .then(()=>leo.supplyA());
                    }else{
                        cga.LogOut();
                        return leo.delay(1000*60*60*24);
                    }
                }
            });
        }
    }
    leo.checkHealthA = (doctorName,needSupply = true) => {
        var playerinfo = cga.GetPlayerInfo();
        var petinfo = cga.GetPetInfo(playerinfo.petid);
        return leo.todo()
        .then(()=>{
            if(playerinfo.souls>0 || playerinfo.health>0 
                || (petinfo && petinfo.health>0)){
                return leo.logBackA()
                //.then(()=>leo.getBackSoul())
                //.then(()=>leo.healPlayer(doctorName))
                //.then(()=>leo.healPet())
                .then(()=>leo.supplyA());
            }else{
                if(needSupply){
                    return leo.supplyA();
                }else{
                    return leo.next();
                }
            }
        });
    }
    //购买水晶
    leo.buyCrystalA = async (crystalName, count = 1) => {
        if (!crystalName) {
            crystalName = '水火的水晶（5：5）';
        }
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        return leo.logBackA()
        .then(() => leo.autoWalkList([
            [161, 156, '比比卡片屋'],
            [16, 18]
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
                    if(emptySlotCount==0){
                        //return leo.reject('背包没空间');
                        leo.log('背包没空间，尝试扔魔石')
                        leo.dropItemEx('魔石');
                        emptySlotCount = 1;
                    }
                    store.items.forEach((it) => {
                        if (it.name.indexOf(crystalName) >= 0 && buyCount < emptySlotCount) {
                            buyitem.push({
                                index: it.index,
                                count: count
                            });
                            buyCount++;
                        }
                    });
                    if (!buyitem.length) return leo.reject('商店没有水晶出售，可能已被买完或者背包没空间');
                    cga.BuyNPCStore(buyitem);
                }
            }).then(() => leo.pile(true)).then(()=>leo.delay(1000));
        });
        return leo.reject('购买失败');
    }
    leo.checkCrystalA = (crystalName, equipsProtectValue = 100) => {
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
                return leo.buyCrystalA(crystalName,1)
                //.then(()=>leo.autoWalk([16,13]))
                .then(()=>leo.useItemEx(crystalName))
                .then(()=>leo.dropItemEx(crystalName))
                .then(()=>leo.logBackA());
            }
        }
    }
    leo.buySealCardA = async (sealCardName, count = 20, level = 1)=>{
        if (level != 5) {
            level = 1;
        }
        if(leo.isInTeam()){
            await leo.leaveTeam()
        }
        if (level == 1) {
            return leo.logBackA()
            .then(() => leo.autoWalkList([
                [161, 156, '比比卡片屋'],
                [16, 18]
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
        }else if (level == 5) {
            return leo.logBackA()
            .then(() => leo.gotoKan())
            .then(() => leo.autoWalkList([
                [35, 86, '贝德莉奴卡片屋'],
                [19, 6]
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
    leo.exit = async (time = 2000) => {
        await leo.log('脚本即将结束')
        await leo.delay(time)
        process.abort();
    }
    //判断身上是否有指定物品
    leo.has = (name) => {
        return cga.getItemCount(name) > 0;
    }
    //判断是否有指定称号
    leo.hasTitle = (title) => {
        var flag = false;
        var titles = cga.GetPlayerInfo().titles;
        for(var i in titles){
            if(titles[i] == title){
                flag = true;
                break;
            }
        }
        return flag;
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
        var configStr = JSON.stringify(config,'','\t');
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
        var configStr = JSON.stringify(config,'','\t');
        var option = { encoding: 'utf-8'};
        leo.fs.writeFileSync(filePath,configStr,option);
        console.log(leo.logTime()+'已保存配置，内容：');
        console.log(config);
        return config;
    }
    leo.saveLog = (filePath,text) => {
        if(filePath.indexOf(leo.splitter)==-1){
            filePath = leo.rootPath + leo.splitter + filePath;
        }
        var content = leo.logTime() + text + '\n';
        var option = { encoding: 'utf-8'};
        leo.fs.appendFileSync(filePath,content,option);
    }
    leo.loadMap = (name = cga.GetMapName()) => {
        const line = leo.getLine();
        let folder = leo.rootPath + leo.splitter + 'map' + leo.splitter;
        let filePath = folder + leo.gametype + '-' + line + '线-' + name + '.json';
        try{
            if (!leo.fs.existsSync(folder)) {
                leo.fs.mkdirSync(folder);
            }
            var dataStr = leo.fs.readFileSync(filePath,'utf-8');
            return JSON.parse(dataStr);
        }catch (e) {
            return {};
        }
    }
    leo.saveMap = (data) => {
        const line = leo.getLine();
        const name = data.name;
        let folder = leo.rootPath + leo.splitter + 'map' + leo.splitter;
        let filePath = folder + leo.gametype + '-' + line + '线-' + name + '.json';
        if (!leo.fs.existsSync(folder)) {
            leo.fs.mkdirSync(folder);
        }
        if(!data){
            data = {};
        }
        data.time = leo.formatDate(leo.now(), leo.FORMAT_DATETIME);
        var dataStr = JSON.stringify(data,'','\t');
        var option = { encoding: 'utf-8'};
        leo.fs.writeFileSync(filePath,dataStr,option);
        //console.log(leo.logTime()+'已保存地图，内容：');
        //console.log(data);
        return data;
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
    leo.getSubSettings = async (attribute,subAttr) => {
        const settings = await leo.getSettings(attribute)
        return settings[subAttr];
    }
    
    //更新面板设置
    leo.loadSettings = (config) => new Promise( async (resolve, reject) => {
        if(cga.gui){
            var settings = await leo.getSettings()
            if(settings){
                //console.log(settings,config);
                leo.deepMerge(settings, config);
                //console.log(settings);
                cga.gui.LoadSettings(settings, (err, result)=>{
                    resolve(result);
                })
            }
        }else{
            resolve();
        }
    });

    //CGA面板快捷控制
    leo.panel = {
        load : (configFile)=>{
            if(!configFile){
                configFile = '~默认.json';
            }
            var config = leo.loadFile(configFile);
            return leo.loadSettings(config);
        },
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
        egg : ()=>{
            var configFile = '蛋2.json';
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
            //leo.panel.autoBattle(true);
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
            sets.push({
                user: 2,
                check: context => true,
                skillName: '护卫-Ⅰ',
                targets: context => [context.player_pos]
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
        seal: (options)=>{
            let petOptions = [];
            if(options === undefined) {
                console.log('加载自动战斗：封印(过滤)发生异常：缺少配置参数')
            }else if(options instanceof Array) {
                petOptions = options;
            }else {
                petOptions.push(options);
            }
            const sets = [];
            for (let i = 0; i < petOptions.length; i++) {
                const petOption = petOptions[i];
                const set = {
                    user: 1, //1-人 2-宠 3-人宠 4-人二动 5-人一动和二动
                    check: context => {
                        if ((context.isFirstBattleAction || context.secondary)
                            && context.enemies.lv1 && context.enemies.lv1.length > 0){
                            leo.isCatchPet(context.enemies.lv1,petOption,(petOptions.length>1)||(petOption.isNameOnly===true));
                        }
                        return leo.findCatchPet(context.enemies.lv1,petOption) && cga.getInventoryItems().find(i => i.name == petOption.sealCardName);
                    },
                    type: '物品',
                    item: context => cga.getInventoryItems().find(i => i.name == petOption.sealCardName).pos,
                    targets: context => [leo.findCatchPet(context.enemies.lv1,petOption).pos]
                };
                sets.push(set);
            }
            for (let i = 0; i < petOptions.length; i++) {
                const petOption = petOptions[i];
                const autoBattleSets = petOption.autoBattle;
                if(autoBattleSets && autoBattleSets.length>0){
                    for (let j = 0; j < autoBattleSets.length; j++) {
                        const autoBattleSet = autoBattleSets[j];
                        sets.push(autoBattleSet);
                    }
                }
            }
            sets.push({
                user: 1,
                check: context => true,
                type: '逃跑',
                targets: context => [context.player_pos]
            });
            for (let i = 0; i < petOptions.length; i++) {
                const petOption = petOptions[i];
                const set = {
                    user: 2,
                    check: context => leo.findCatchPet(context.enemies.lv1,petOption,true) && cga.getInventoryItems().find(i => i.name == petOption.sealCardName),
                    skillName: petOption.petSkillName || '强力陨石魔法-Ⅰ',
                    targets: context => [leo.findCatchPet(context.enemies.lv1,petOption,true).pos]
                };
                sets.push(set);
            }
            sets.push({
                user: 2,
                check: context => true,
                skillName: '防御',
                targets: context => [context.petUnit.pos]
            });

            let firstRoundDelay = 1;    //首回合延迟
            let roundDelay = 1       //每回合延迟
            let force = true ;          //是否强制启用战斗配置
            leo.setBattlePet2(false);   //关闭宠物二动
            leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
            leo.log('已加载自动战斗：封印(过滤)')
            leo.panel.autoBattle(false);//关闭CGA面板的自动战斗
        },
        stolen: (enemieName,supplyRate = 0.6)=>{
            let enemieNames = [];
            if(enemieName == undefined) {
                console.log('加载自动战斗：偷窃卡片发生异常：缺少配置参数')
            }else if(typeof enemieName == 'string') {
                enemieNames.push(enemieName);
            }else if(doctorName instanceof Array) {
                enemieNames = enemieName;
            }
            //自动战斗设置部分
            var stolenPos = [];
            const needHealChecker = (unit) => unit && unit.curhp > 0 && unit.hpRatio <= supplyRate;
            const enemieCheck = (context) => {
                let check = false;
                if(context.round_count == 0){
                    //第一回合，重置战斗信息
                    stolenPos = [];
                }
                if (context.isFirstBattleAction && context.enemies.lv1 && context.enemies.lv1.length > 0){
                    context.enemies.lv1.forEach(e => {
                        console.log(leo.logTime()+'1级怪:【' + e.name + '】【' + e.maxhp + '/' + e.maxmp + '】');
                    });
                }
                let enemies = context.enemies.filter(e=>enemieNames.includes(e.name));
                if(enemies && enemies.length>0){
                    var enemieFound = enemies.find(e=>!stolenPos.includes(e.pos));
                    if(enemieFound && enemieFound.pos>-1){
                        check = true;
                    }
                }
                return check;
            }
            const enemieTarget = (context) => {
                let target = [];
                let enemies = context.enemies.filter(e=>enemieNames.includes(e.name));
                if(enemies && enemies.length>0){
                    var enemieFound = enemies.find(e=>!stolenPos.includes(e.pos));
                    if(enemieFound && enemieFound.pos>-1){
                        target.push(enemieFound.pos);
                        stolenPos.push(enemieFound.pos);
                        //console.log(enemies,stolenPos);
                    }
                }
                return target;
            }

            //技能设置
            const sets = [];
            sets.push({
                user: 1,
                check: context => !enemieCheck(context),
                type: '逃跑',
                targets: context => [context.player_pos]
            });
            sets.push({
                user: 1,
                check: context => [context.playerUnit, context.petUnit].filter(needHealChecker).length > 0,
                type: '技能', skillName: '补血魔法', 
                targets: context => [context.playerUnit, context.petUnit].filter(needHealChecker).sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
            });
            sets.push({
                user: 1,
                check: context => [context.playerUnit, context.petUnit].filter(needHealChecker).length > 0,
                type: '技能', skillName: '明镜止水', 
                targets: context => [context.player_pos]
            });
            sets.push({
                user: 1,
                check: context => [context.playerUnit, context.petUnit].filter(needHealChecker).length > 0,
                type: '技能', skillName: '恢复魔法', 
                targets: context => [context.playerUnit, context.petUnit].filter(needHealChecker).sort((a, b) => a.hpRatio - b.hpRatio).map(t => t.pos)
            });
            sets.push({
                user: 1,
                check: context => enemieCheck(context),
                type: '技能', skillName: '窃盗', skillLevel: 10,
                targets: context => enemieTarget(context)
            });
            sets.push({
                user: 4,
                check: context => true,
                type: '防御',
                targets: context => context.enemies.map(e => e.pos)
            });
            sets.push({
                user: 1,
                check: context => true,
                type: '逃跑',
                targets: context => [context.player_pos]
            });
            sets.push({
                user: 2,
                check: context => context.petUnit.hpRatio <= supplyRate,
                skillName: '明镜止水',
                targets: context => [context.petUnit.pos]
            });
            sets.push({
                user: 2,
                check: context => true,
                skillName: '防御',
                targets: context => context.enemies.map(e => e.pos)
            });
            sets.push({
                user: 2,
                check: context => true,
                skillName: '圣盾',
                targets: context => context.enemies.map(e => e.pos)
            });
            var firstRoundDelay = 1;    //首回合延迟
            var roundDelay = 1          //每回合延迟
            var force = true ;          //是否强制启用战斗配置
            leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
            leo.log('已加载自动战斗：偷窃卡片')
            leo.panel.autoBattle(false);
            leo.panel.itemdroplistDel('卡片？')
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
        },
        zhanglaozheng: ()=>{
            const needHealChecker = (unit) => unit && unit.curhp > 0 && unit.hpRatio <= 0.7;
            //技能设置
            const sets = [];
            sets.push({
                user: 1,
                check: context => [context.playerUnit, context.petUnit].filter(needHealChecker).length > 0,
                type: '技能', skillName: '补血魔法', 
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
                check: context => context.isFirstBattleAction,
                skillName: '气功弹',
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
            leo.log('已加载自动战斗：长老证')
            leo.panel.autoBattle(false);
        },
        repairPK: ()=>{
            //技能设置
            const sets = [];
            sets.push({
                user: 5,
                check: context => context.round_count > 2,
                type: '逃跑',
                targets: context => [context.player_pos]
            });
            sets.push({
                user: 7,
                check: context => true,
                type: '攻击',
                targets: context => context.enemies.map(e => e.pos)
            });
            var firstRoundDelay = 1;    //首回合延迟
            var roundDelay = 4000          //每回合延迟
            var force = true ;          //是否强制启用战斗配置
            leo.autoBattle(sets,firstRoundDelay,roundDelay,force);
            leo.log('已加载自动战斗：修理PK攻击')
            leo.panel.autoBattle(false);
        }
    }

    leo.getPlayerPoints = (attr) => {
        var detail = cga.GetPlayerInfo().detail;
        switch (attr) {
            case 0: return detail.points_endurance;
            case 1: return detail.points_strength;
            case 2: return detail.points_defense;
            case 3: return detail.points_agility;
            case 4: return detail.points_magical;
        }
        return -1;
    }
    //获取人物剩余加点数
    leo.checkUpgradePlayer = () => {
        return cga.GetPlayerInfo().detail.points_remain;
    }
    //人物自动加点：0-体力，1-力量，2-防御，3-敏捷，4-魔法
    leo.upgradePlayer = async (attr) => {
        var remainPoints = cga.GetPlayerInfo().detail.points_remain;
        if(remainPoints>0){
            await cga.UpgradePlayer(attr)
            await leo.done()
        }
    }
    //获取宠物剩余加点数
    leo.checkUpgradePet = (index) => {
        var pet = cga.GetPetInfo(index);
        if(pet){
            var remainPoints = pet.detail.points_remain;
            return remainPoints;
        }else{
            return 0;
        }
    }
    //宠物自动加点：0-体力，1-力量，2-防御，3-敏捷，4-魔法
    leo.upgradePet = async (index,attr) => {
        var pet = cga.GetPetInfo(index);
        if(pet){
            var remainPoints = pet.detail.points_remain;
            if(remainPoints>0){
                await cga.UpgradePet(index,attr)
                await leo.done()
            }
        }
    }
    leo.upgrade = async () => {
        if(!cga.isInBattle() && leo.monitor.config.autoUpgradePoint && leo.pointSetting){
            //先检查宠物是否可以加点
            var playerInfo = cga.GetPlayerInfo();
            if(playerInfo.petid!=-1 && leo.checkUpgradePet(playerInfo.petid)>0){
                var pet = cga.GetPetInfo(playerInfo.petid);
                if(leo.pointSetting.pet && leo.pointSetting.pet[pet.realname]){
                    var setting = leo.pointSetting.pet[pet.realname];
                    var attr = -1;
                    if(typeof setting == 'number'){
                        attr = setting;
                    }else if(setting.attr !== undefined){
                        attr = setting.attr;
                    }
                    if(attr>=0 && attr<=4){
                        leo.upgradePet(pet.index,attr);
                    }
                }
            }
            //再检查人物是否可以加点
            if(leo.checkUpgradePlayer()>0){
                if(leo.pointSetting.player && leo.pointSetting.player[playerInfo.name]){
                    var setting = leo.pointSetting.player[playerInfo.name];
                    // setting = [
                    //     {attr:1,max:333,maxTo:0},
                    //     {attr:1,max:333,maxTo:0},
                    //     {attr:0},
                    //     {attr:3,max:120,maxTo:0}
                    // ]
                    var points = leo.checkUpgradePlayer();
                    var index = (4 - (points % 4)) % 4;
                    var obj = setting[index];
                    var attr = -1;
                    if(obj && typeof obj.attr == 'number'){
                        var maxPoint = 15 + (playerInfo.level - 1) * 2;
                        var currentPoint = leo.getPlayerPoints(obj.attr);
                        if(currentPoint < maxPoint){
                            if(obj.max && currentPoint >= obj.max){
                                //大于等于设定值
                                if(obj.maxTo === undefined){
                                    console.log('人物加点配置有误，请检查' + obj);
                                }else{
                                    attr = obj.maxTo;
                                }
                            }else{
                                attr = obj.attr;
                            }
                        }else{
                            //大于等于等级最大加点值
                            if(obj.maxTo === undefined){
                                console.log('人物加点配置有误，请检查' + obj);
                            }else{
                                attr = obj.maxTo;
                            }
                        }
                        if(attr>=0 && attr<=4){
                            leo.upgradePlayer(attr);
                        }
                    }
                }else{
                    //有默认加点设置的话，按默认加点方案
                    if(leo.pointSetting.player && leo.pointSetting.player['默认']){
                        var setting = leo.pointSetting.player['默认'];
                        // setting = [
                        //     {attr:1,max:333,maxTo:0},
                        //     {attr:1,max:333,maxTo:0},
                        //     {attr:0},
                        //     {attr:3,max:120,maxTo:0}
                        // ]
                        var points = leo.checkUpgradePlayer();
                        var index = (4 - (points % 4)) % 4;
                        var obj = setting[index];
                        var attr = -1;
                        if(obj && typeof obj.attr == 'number'){
                            var maxPoint = 15 + (playerInfo.level - 1) * 2;
                            var currentPoint = leo.getPlayerPoints(obj.attr);
                            if(currentPoint < maxPoint){
                                if(obj.max && currentPoint >= obj.max){
                                    //大于等于设定值
                                    if(obj.maxTo === undefined){
                                        console.log('人物加点配置有误，请检查' + obj);
                                    }else{
                                        attr = obj.maxTo;
                                    }
                                }else{
                                    attr = obj.attr;
                                }
                            }else{
                                //大于等于等级最大加点值
                                if(obj.maxTo === undefined){
                                    console.log('人物加点配置有误，请检查' + obj);
                                }else{
                                    attr = obj.maxTo;
                                }
                            }
                            if(attr>=0 && attr<=4){
                                leo.upgradePlayer(attr);
                            }
                        }
                    }
                }
            }
        }
    }
    //获取物品属性
    leo.getItemAttr = (item) => {
        var attr = null;
        if (item && item.attr) {
            attr = {
                itemid : item.itemid,
                name : item.name
            };
            var tempAttr = item.attr.replace(/\s+/g, '');
            //console.log(tempAttr)
            var regexHp = tempAttr.match(/生命(.\d+)/);
            if(regexHp && regexHp.length >= 2){
                attr.hp = parseInt(regexHp[1]);
            }
            var regexMp = tempAttr.match(/魔力(.\d+)/);
            if(regexMp && regexMp.length >= 2){
                attr.mp = parseInt(regexMp[1]);
            }
            var regexAttack = tempAttr.match(/攻击(.\d+)/);
            if(regexAttack && regexAttack.length >= 2){
                attr.attack = parseInt(regexAttack[1]);
            }
            var regexDefensive = tempAttr.match(/防御(.\d+)/);
            if(regexDefensive && regexDefensive.length >= 2){
                attr.defensive = parseInt(regexDefensive[1]);
            }
            var regexAgility = tempAttr.match(/敏捷(.\d+)/);
            if(regexAgility && regexAgility.length >= 2){
                attr.agility = parseInt(regexAgility[1]);
            }
            var regexMagicalAttack = tempAttr.match(/魔攻(.\d+)/);
            if(regexMagicalAttack && regexMagicalAttack.length >= 2){
                attr.magicalAttack = parseInt(regexMagicalAttack[1]);
            }
            var regexRecovery = tempAttr.match(/回复(.\d+)/);
            if(regexRecovery && regexRecovery.length >= 2){
                attr.recovery = parseInt(regexRecovery[1]);
            }
            var regexSpirit = tempAttr.match(/精神(.\d+)/);
            if(regexSpirit && regexSpirit.length >= 2){
                attr.spirit = parseInt(regexSpirit[1]);
            }
            var regexCritical = tempAttr.match(/必杀(.\d+)/);
            if(regexCritical && regexCritical.length >= 2){
                attr.critical = parseInt(regexCritical[1]);
            }
            var regexStrikeback = tempAttr.match(/反击(.\d+)/);
            if(regexStrikeback && regexStrikeback.length >= 2){
                attr.strikeback = parseInt(regexStrikeback[1]);
            }
            var regexAccurancy = tempAttr.match(/命中(.\d+)/);
            if(regexAccurancy && regexAccurancy.length >= 2){
                attr.accurancy = parseInt(regexAccurancy[1]);
            }
            var regexDodge = tempAttr.match(/闪躲(.\d+)/);
            if(regexDodge && regexDodge.length >= 2){
                attr.dodge = parseInt(regexDodge[1]);
            }
            var regexLevel = tempAttr.match(/等级(\d+)/);
            if(regexLevel && regexLevel.length >= 2){
                attr.level = parseInt(regexLevel[1]);
            }
            var regexEndurance = tempAttr.match(/耐久(\d+)\/(\d+)/);
            if(regexEndurance && regexEndurance.length >= 3){
                attr.endurance = [parseInt(regexEndurance[1]), parseInt(regexEndurance[2])];
            }
        }
        return attr;
    }

    leo.getMoneyFromBank = async (money)=>{
        try{
            await leo.waitAfterBattle()
            if(leo.isInTeam()){
                await leo.leaveTeam()
            }
            if(cga.GetMapName()!='银行'){
                try{
                    await leo.goto(n => n.falan.bank)
                }catch(e){
                    console.log(leo.logTime()+'出错，e:' + e);
                }
            }
            if(cga.GetMapName()=='银行'){
                await leo.autoWalk([11,8])
                await leo.turnDir(0)
                var bankGold = cga.GetBankGold();
                if(bankGold < money){
                    money = bankGold;
                }
                await leo.moveGold(money,cga.MOVE_GOLD_FROMBANK)
            }
        }catch(e){
            console.log('出错，e：' + e);
            await leo.logBack()
            return leo.getMoneyFromBank(money);
        }
    }

    leo.autoForgetSkill = async (skillName) => {
        var skill = cga.findPlayerSkill(skillName);
        if(skill){
            await leo.log('去删除技能【'+skillName+'】');
            if(leo.isInTeam()){
                await leo.leaveTeam()
            }
            if(cga.GetMapName()!='法兰城') {
                await leo.goto(n => n.castle.x)
                await leo.autoWalkList([[17, 54, '法兰城']])
            }
            await leo.loop(async ()=>{
                await leo.autoWalk([120, 65])
                await leo.forgetPlayerSkill(120, 64, skillName)
                await leo.delay(2000)
                if(!cga.findPlayerSkill(skillName)){
                    await leo.log('已经删除技能【'+skillName+'】')
                    return leo.reject();
                } else{
                    await leo.log('未能删除技能【'+skillName+'】，请检查！')
                }
                await leo.delay(1000)
            })
        }else{
            await leo.log('人物没有学习技能【'+skillName+'】');
        }
    }

    leo.autoLearnSkill = async (skillName) => {
        try{
            if(skillName=='气功弹'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    await leo.goto(n=>n.falan.s1)
                    await leo.autoWalk([124, 161])
                    await leo.loop(async ()=>{
                        if(cga.GetMapName()=='竞技场的入口'){
                            return leo.reject();
                        }
                        await leo.turnDir(4)
                    })
                    await leo.autoWalk([15,6,'*'])
                    await leo.loop(async ()=>{
                        await leo.autoWalk([15,57])
                        await leo.learnPlayerSkill(15, 56)
                        await leo.delay(2000)
                        if(cga.findPlayerSkill(skillName)){
                            await leo.log('已经完成技能【'+skillName+'】的学习')
                            return leo.reject();
                        } else{
                            await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                        }
                        await leo.delay(1000)
                    })
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
            if(skillName=='乾坤一掷'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    await leo.goto(n=>n.falan.w2)
                    await leo.autoWalkList([[102,131,'安其摩酒吧']])
                    await leo.loop(async ()=>{
                        await leo.autoWalk([10,13])
                        await leo.learnPlayerSkill(11, 13)
                        await leo.delay(2000)
                        if(cga.findPlayerSkill(skillName)){
                            await leo.log('已经完成技能【'+skillName+'】的学习')
                            return leo.reject();
                        } else{
                            await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                        }
                        await leo.delay(1000)
                    })
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
            if(skillName=='调教'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    await leo.goto(n=>n.falan.e1)
                    await leo.autoWalkList([[219,136,'科特利亚酒吧'],[27,20,'酒吧里面'],[10,6,'客房']])
                    await leo.loop(async ()=>{
                        await leo.autoWalk([10,5])
                        await leo.learnPlayerSkill(11, 5)
                        await leo.delay(2000)
                        if(cga.findPlayerSkill(skillName)){
                            await leo.log('已经完成技能【'+skillName+'】的学习')
                            return leo.reject();
                        } else{
                            await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                        }
                        await leo.delay(1000)
                    })
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
            if(skillName=='宠物强化'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    await leo.goto(n => n.castle.x)
                    await leo.autoWalkList([[41, 14, '法兰城'],[122, 36, '饲养师之家']])
                    await leo.loop(async ()=>{
                        await leo.autoWalk([13,4])
                        await leo.learnPlayerSkill(14, 4)
                        await leo.delay(2000)
                        if(cga.findPlayerSkill(skillName)){
                            await leo.log('已经完成技能【'+skillName+'】的学习')
                            return leo.reject();
                        } else{
                            await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                        }
                        await leo.delay(1000)
                    })
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
            if(skillName=='石化魔法'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    await leo.goto(n => n.castle.x)
                    await leo.autoWalkList([[17, 54, '法兰城']])
                    await leo.loop(async ()=>{
                        await leo.autoWalk([120, 65])
                        await leo.learnPlayerSkill(120, 64)
                        await leo.delay(2000)
                        if(cga.findPlayerSkill(skillName)){
                            await leo.log('已经完成技能【'+skillName+'】的学习')
                            return leo.reject();
                        } else{
                            await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                        }
                        await leo.delay(1000)
                    })
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
            if(skillName=='补血魔法'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    if(cga.getMapInfo().indexes.index3!=1208){
                        await leo.goto(n => n.castle.x)
                        await leo.autoWalkList([
                            [41, 14, '法兰城'],
                            [154, 29, '大圣堂的入口'],
                            [14, 7, '礼拜堂'],
                            [23, 0,'大圣堂里面'],
                            [13, 6]
                        ])
                        await leo.talkNpc(0,leo.talkNpcSelectorYes)
                    }
                    await leo.loop(async ()=>{
                        await leo.autoWalk([13, 10])
                        await leo.learnPlayerSkill(14, 10)
                        await leo.delay(2000)
                        if(cga.findPlayerSkill(skillName)){
                            await leo.log('已经完成技能【'+skillName+'】的学习')
                            return leo.reject();
                        } else{
                            await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                        }
                        await leo.delay(1000)
                    })
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
            if(skillName=='强力补血魔法'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    if(cga.getMapInfo().indexes.index3!=1208){
                        await leo.goto(n => n.castle.x)
                        await leo.autoWalkList([
                            [41, 14, '法兰城'],
                            [154, 29, '大圣堂的入口'],
                            [14, 7, '礼拜堂'],
                            [23, 0,'大圣堂里面'],
                            [13, 6]
                        ])
                        await leo.talkNpc(0,leo.talkNpcSelectorYes)
                    }
                    await leo.loop(async ()=>{
                        await leo.autoWalk([18, 12])
                        await leo.learnPlayerSkill(19, 12)
                        await leo.delay(2000)
                        if(cga.findPlayerSkill(skillName)){
                            await leo.log('已经完成技能【'+skillName+'】的学习')
                            return leo.reject();
                        } else{
                            await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                        }
                        await leo.delay(1000)
                    })
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
            if(skillName=='气绝回复'){
                var skill = cga.findPlayerSkill(skillName);
                if(!skill){
                    await leo.log('去学习技能【'+skillName+'】');
                    if(leo.isInTeam()){
                        await leo.leaveTeam()
                    }
                    if(cga.GetPlayerInfo().gold<100){
                        await leo.getMoneyFromBank(1000)
                    }
                    try{
                        await leo.goto(n => n.teleport.aleut)
                    }catch(e){
                        await leo.log('无法到达【亚留特村】，请确认传送是否开启')
                    }
                    if(cga.GetMapName()=='亚留特村'){
                        await leo.loop(async ()=>{
                            await leo.autoWalk([47,72])
                            await leo.learnPlayerSkill(48, 72)
                            await leo.delay(2000)
                            if(cga.findPlayerSkill(skillName)){
                                await leo.log('已经完成技能【'+skillName+'】的学习')
                                return leo.reject();
                            } else{
                                await leo.log('未能完成技能【'+skillName+'】的学习，请检查！')
                            }
                            await leo.delay(1000)
                        })
                    }
                }else{
                    await leo.log('已经存在技能【'+skillName+'】');
                }
            }
        }catch(e){
            console.log(leo.logTime()+'autoLearnSkill出现异常：' + e);
            await leo.delay(5000)
            return leo.autoLearnSkill(skillName);
        }
    }

    //调用await leo.learnPetSkill([0],0,1,2)
    leo.learnPetSkill = async ([x, y], skillIndex, petIndex, petSkillIndex) => {
        await leo.talkNpc(x, y, async (dialog) => {
            //console.log(dialog)
            if (dialog.type == 24) {
                cga.ClickNPCDialog(0, skillIndex)
                await leo.delay(1000)
            }
            if (dialog.type == 25) {
                cga.ClickNPCDialog(0, petIndex)
                await leo.delay(1000)
            }
            if (dialog.type == 26) {
                cga.ClickNPCDialog(0, petSkillIndex)
                await leo.delay(1000)
                return false;
            }
            return true;
        })
    }

    leo.getRoleIndex = (roleName) => {
        const roleMap = {
            '巴乌':1,
            '卡兹':2,
            '辛':3,
            '托布':4,
            '凯':5,
            '菲特':6,
            '伯克':7,
            '乌噜':8,
            '萌子':9,
            '阿咪':10,
            '梅古':11,
            '丽':12,
            '卡伊':13,
            '艾露':14,
            '谢堤':15,
            '彼特':16,
            '左藏':17,
            '尼尔森':18,
            '贝堤特':19,
            '兰斯洛特':20,
            '威斯凯尔':21,
            '莎拉':22,
            '绫女':23,
            '福尔蒂雅':24,
            '夏菈':25,
            '萍萍':26,
            '葛蕾丝':27,
            '荷蜜':28
        }
        return roleMap[roleName];
    }

    //发送网络请求
    leo.request = require('request');
    leo.sendPost = (url,param) => new Promise((resolve, reject) => { 
        leo.request.post({url:url,form: param}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }else{
                resolve('{"status":"N","message":"statusCode='+response.statusCode+'"}');
            }
        });
    });

    leo.logServer = async (type, message) => {
        if (leo['\x6d\x65\x73\x73\x61\x67\x65\x53\x65\x72\x76\x65\x72']) {
            if (leo['\x61\x70\x70\x49\x64'] == '')
                return leo['\x6c\x6f\x67']('\u6d88\u606f\u8bb0\u5f55\u51fa\u9519\uff1a\x6c\x65\x6f\x2e\x61\x70\x70\x49\x64\u4e0d\u80fd\u4e3a\u7a7a');
            if (leo['\x61\x70\x70\x53\x65\x63\x72\x65\x74'] == '')
                return leo['\x6c\x6f\x67']('\u6d88\u606f\u8bb0\u5f55\u51fa\u9519\uff1a\x6c\x65\x6f\x2e\x61\x70\x70\x53\x65\x63\x72\x65\x74\u4e0d\u80fd\u4e3a\u7a7a');
            if (type == '')
                return leo['\x6c\x6f\x67']('\u6d88\u606f\u8bb0\u5f55\u51fa\u9519\uff1a\x74\x79\x70\x65\u4e0d\u80fd\u4e3a\u7a7a');
            var _0x69a47c = [
                '\u6d4b\u8bd5',
                '\u6293\u5ba0',
                '\u767e\u4eba',
                '\u9c81\u6751',
                '\u9500\u552e',
                '\u72e9\u730e',
                '\u5341\u5e74',
                '\u5b9d\u7bb1',
                '\u5237\u5237',
                '\u81ea\u5b9a\u4e49'
            ];
            if (!_0x69a47c['\x69\x6e\x63\x6c\x75\x64\x65\x73'](type))
                return leo['\x6c\x6f\x67']('\u6d88\u606f\u8bb0\u5f55\u51fa\u9519\uff1a\x74\x79\x70\x65\u53ea\u80fd\u662f\u6307\u5b9a\u7684\u3010' + _0x69a47c['\x6a\x6f\x69\x6e']() + '\u3011\u5176\u4e2d\u7684\u4e00\u79cd');
            if (message == '')
                return leo['\x6c\x6f\x67']('\u6d88\u606f\u8bb0\u5f55\u51fa\u9519\uff1a\x6d\x65\x73\x73\x61\x67\x65\u4e0d\u80fd\u4e3a\u7a7a');
            if (message['\x6c\x65\x6e\x67\x74\x68'] > 0x1f4)
                return leo['\x6c\x6f\x67']('\u6d88\u606f\u8bb0\u5f55\u51fa\u9519\uff1a\x6d\x65\x73\x73\x61\x67\x65\u4e0d\u80fd\u8d85\u8fc7\x35\x30\x30\u4e2a\u5b57\u7b26');
            var _0x102892 = '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x6c\x65\x6f\x78\x2e\x63\x63\x2f\x6c\x65\x6f\x2f\x63\x6f\x6d\x6d\x6f\x6e\x2f\x6d\x65\x73\x73\x61\x67\x65\x2e\x64\x6f', _0x2fd582 = cga['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x6e\x61\x6d\x65'], _0x4100da = {
                    '\x61\x70\x70\x49\x64': leo['\x61\x70\x70\x49\x64'],
                    '\x61\x70\x70\x53\x65\x63\x72\x65\x74': leo['\x61\x70\x70\x53\x65\x63\x72\x65\x74'],
                    '\x6e\x61\x6d\x65': _0x2fd582,
                    '\x74\x79\x70\x65': type,
                    '\x6d\x65\x73\x73\x61\x67\x65': message
                }, _0x23aa6a = { '\x64\x61\x74\x61': JSON['\x73\x74\x72\x69\x6e\x67\x69\x66\x79'](_0x4100da) }, _0x2a9c92 = await leo['\x73\x65\x6e\x64\x50\x6f\x73\x74'](_0x102892, _0x23aa6a), _0x26ee98 = JSON['\x70\x61\x72\x73\x65'](_0x2a9c92);
            if (_0x26ee98 && _0x26ee98['\x73\x74\x61\x74\x75\x73'] == '\x59') {
            } else
                return _0x26ee98['\x6d\x65\x73\x73\x61\x67\x65']['\x69\x6e\x63\x6c\x75\x64\x65\x73']('\u6d88\u606f\u6d88\u8d39\u6b21\u6570\u5df2\u7ecf\u5230\u8fbe\u672c\u6708\u9650\u5236\u503c') && (leo['\x6d\x65\x73\x73\x61\x67\x65\x53\x65\x72\x76\x65\x72'] = ![]), leo['\x6c\x6f\x67']('\u6d88\u606f\u8bb0\u5f55\u51fa\u9519\uff1a' + _0x26ee98['\x6d\x65\x73\x73\x61\x67\x65']);
        }
    }

    //播放某个动作（表情），index允许的值是0~17
    leo.gesture = (index) => new Promise( async (resolve, reject) => {
        if(cga.PlayGesture && cga.isInNormalState()){
            cga.PlayGesture(index);
        }
        resolve();
    });

    //获取主机名
    leo.host = (upperCase = true) => {
        let hostname = require("os").hostname();
        return upperCase?hostname.toUpperCase():hostname;
    }
    //获取MAC地址，可能获取不正确
    leo.mac = (upperCase = true) => {
        let networkInterfaces = require("os").networkInterfaces();
        //console.info(networkInterfaces);
        let ips = [];
        for(let m in networkInterfaces){
            ips.push(...networkInterfaces[m]);
        }
        let ip = {};
        ips.forEach(v=>{
            if(v.family.toUpperCase() == 'IPV4' && !v.cidr.includes('127.0.0.1')){
                ip = v;
            }
        })
        if(ip.mac){
            return upperCase?ip.mac.toUpperCase():ip.mac;
        }
    }
	
	//获取服务器信息
	leo.serverInfo = (type) => {
		//电信服务器列表
		const serverTelecom = ['221.122.119.111','221.122.119.112','221.122.119.113','221.122.119.114','221.122.119.115'];
		//网通服务器列表
		const serverNetcom = ['221.122.119.117','221.122.119.119','221.122.119.120','221.122.119.166','221.122.119.167'];
		let info = cga.GetGameServerInfo();
		if(serverNetcom.includes(info.ip)) {
			info.serverType = '网通';
		} else {
			info.serverType = '电信';
		}
		if(type == 'ip') {
			return info.ip;
		}
		if(type == 'port') {
			return info.port;
		}
		if(type == 'type') {
			return info.serverType;
		}
		return info;
	}

    //宠物图鉴卡
    leo.getPetCard = (petName) => {
        let ret;
        if(cga.GetPicBooksInfo){
            ret = cga.GetPicBooksInfo().find(v=>v.name==petName);
        }
        return ret;
    }
    leo.checkPetCard = (petName) => {
        if(cga.GetPicBooksInfo){
            return cga.GetPicBooksInfo().find(v=>v.name==petName) !== undefined;
        }else{
            console.log(leo.logTime()+'CGA版本太低，跳过检测。此功能需CGA版本大于2021-06-26')
            return true;
        }
    }

    //获取自己所在游戏线路
    leo.getLine = () => {
        return cga.getMapInfo().indexes.index2;
    }
    //通过好友名片，获取队长所在的游戏线路
    leo.getLeaderLine = (teamLeader) => {
        const cards = cga.GetCardsInfo();
        const leaderCard = cards.find(i=>i.name==teamLeader);
        if(leaderCard){
            return leaderCard.server; //0-离线，1-10具体的线路
        }else{
            return -1;//-1-没有队长名片
        }
    }
    //切换游戏线路
    leo.changeLine = async (line) => {
        cga.gui.LoadAccount({
            server : line
        }, (err, result)=>{
            console.log('切换到'+line+'线',err,result);
            cga.LogOut();
        })
        return leo.delay(1000*60*5);
    }
    //切换到队长所在游戏线路
    leo.changeLineForLeader = async (teamLeader) => {
        if(teamLeader==''){
            await leo.log('未指定队长')
            return leo.delay(1000*60*60*2);
        }
        const line = leo.getLine();
        await leo.loop(async()=>{
            let leaderLine = leo.getLeaderLine(teamLeader);
            if(leaderLine==-1){
                await leo.log('没有与队长【'+teamLeader+'】交换名片')
                return leo.delay(1000*60*60*2);
            }
            if(leaderLine == line) {
                return leo.reject();
            }
            if(leaderLine == 0) {
                console.log(leo.logTime()+'队长【'+teamLeader+'】处于离线状态，等待...');
            }else{
                return leo.changeLine(leaderLine);
            }
            await leo.delay(1000*30)
        })
    }

    leo.findMyTeam = (teams = [[]]) => {
        const playerName = cga.GetPlayerInfo().name;
        for(let i in teams){
            for(let j in teams[i]){
                if(playerName == teams[i][j]){
                    return teams[i];
                }
            }
        }
        return null;
    }

    leo.setPetBattle = (index = 0) => {
        const pet = cga.GetPetsInfo().find(p => p.index == index);
        if(pet && pet.state!=2){
            cga.ChangePetState(pet.index, cga.PET_STATE_BATTLE);
        }
    }

    leo.setKeepAlive = (keepAlive = true) => {
        leo.monitor.config.keepAlive = keepAlive;
    }

    leo.setAutoExit = (status = false, value, reset, preHook) => {
        if(value !== undefined) {
            leo.monitor.config.autoExitValue = value; 
        }
        if(reset === true) {
            leo.monitor.config.autoExitMemory = {};
        }
        if(preHook !== undefined) {
            leo.monitor.config.autoExitPreHook = preHook;
        }
        leo.monitor.config.autoExit = status;
    }

    leo.setAutoExitWithKeepAlive = (keepAlive = true, status = false, value, reset, preHook) => {
        leo.setAutoExit(status,value,reset,preHook);
        leo.setKeepAlive(keepAlive);
    }
	
	leo.setShowPets = (enable = true) => {
		if(enable === true){
			cga.EnableFlags(cga.ENABLE_FLAG_SHOWPETS, enable);
			leo.log('红叶の温馨提示：已设置【显示放出的宠物】');
		}else{
			cga.EnableFlags(cga.ENABLE_FLAG_SHOWPETS, false);
			leo.log('红叶の温馨提示：已设置【隐藏放出的宠物】');
		}
	}

    ///////////////////////插件加载系列///////////////////////////////////
    leo.plugins = {};
    //插件：战斗状态监控
    try{
        leo.battleMonitor = require('./battle-status');
    }catch(e){
        leo.battleMonitor = {
            start:()=>{},
            stop:()=>{},
        }
    }
    leo.plugins.battleMonitor = leo.battleMonitor;

    //插件：宠物自动算档服务
    try{
        leo.calcGrade = require('./grade'); 
    }catch(e){
        //console.log(e)
        leo.calcGrade = () => {
            return {status:false,error:'没有自动算档插件，跳过自动算档功能'}
        };
    }
    leo.plugins.calcGrade = leo.calcGrade;

    //插件：信息同步服务
    try{
        const {sendInfo,syncInfo} = require('./syncInfo');
        const syncMonitor = () => {
            if(leo.monitor.config.syncInfo && leo.appId != '' && leo.appSecret != ''){
                sendInfo(cga);
            }
            setTimeout(()=>syncMonitor(),1000*60*5);
            return;
        }
        setTimeout(()=>syncMonitor(),1000*30);
        leo.syncInfo = syncInfo;
    }catch(e){
        leo.syncInfo = (cga,isbank,silently,logback) => {
            console.log('没有信息同步插件，跳过信息同步功能');
        }
    }
    leo.plugins.syncInfo = leo.syncInfo;

    //插件：魔币收银员/出纳员插件
    try{
        leo.cashier = require('./cashier');
    }catch(e){
        leo.cashier = {
            getMoney:()=>{},
            saveMoney:()=>{},
        }
    }
    leo.plugins.cashier = leo.cashier;

    //插件：领物品(十周年纪念戒指)
    try{
        leo.plugins.ring = require('./plugin_ring');
    }catch(e){
        leo.plugins.ring = {
            getRing:()=>{
                console.log('没有领物品(十周年纪念戒指)插件，跳过该功能');
            }
        }
    }

    //插件：封印师常规合集抓宠插件
    leo.plugins.petPlugins = () => {
        try{
            return require('./pet');
        }catch(e){
            return null;
        }
    }

    //插件：封印师常规合集抓宠插件(拓展)
    leo.plugins.petExtPlugins = () => {
        try{
            return require('./plugin_pet');
        }catch(e){
            return null;
        }
    }

    //插件：领取图鉴
    try{
        leo.plugins.petCard = require('./plugin_petCard');
    }catch(e){
        leo.plugins.petCard = {
            getPetCard:()=>{
                console.log('没有领取图鉴插件，跳过该功能');
            }
        }
    }

    //插件：过滤封印宠物
    try{
        leo.plugins.petFilter = require('./plugin_petFilter');
    }catch(e){
        leo.plugins.petFilter = {
            checker:()=>{
                console.log('没有过滤封印宠物插件，跳过该功能');
            }
        }
    }

    //插件：保存封印宠物
    try{
        leo.plugins.petSealSave = require('./plugin_petSealSave');
    }catch(e){
        leo.plugins.petSealSave = {
            savePet:()=>{
                console.log('没有保存封印宠物插件，跳过该功能');
            }
        }
    }

    //插件：保存物品【圣鸟之羽】
    try{
        leo.plugins.featherSave = require('./plugin_featherSave');
    }catch(e){
        leo.plugins.featherSave = {
            saveItem:()=>{
                console.log('没有保存物品【圣鸟之羽】插件，跳过该功能');
            }
        }
    }

    //插件：保存物品【王冠/公主王冠/小猫帽】
    try{
        leo.plugins.crownSave = require('./plugin_crownSave');
    }catch(e){
        leo.plugins.crownSave = {
            saveItem:()=>{
                console.log('没有保存物品【王冠/公主王冠/小猫帽】插件，跳过该功能');
            }
        }
    }

    //插件：自动寻找迷宫NPC
    try{
        leo.plugins.searchRandomMaze = require('./plugin_searchRandomMaze');
    }catch(e){
        leo.plugins.searchRandomMaze = {
            findNpc:()=>{
                console.log('没有自动寻找迷宫NPC插件，跳过该功能');
            }
        }
    }

    //插件：加载脚本
    try{
        leo.plugins.load = require('./plugin_load');
    }catch(e){
        leo.plugins.load = {
            start:()=>{
                console.log('没有加载脚本插件，跳过该功能');
            }
        }
    }


    ///////////////////////脚本默认执行内容///////////////////////////////
    //leo.keepAlive(true); //启用防掉线功能
    await leo.panel.autosupply(true);//勾选CGA面板的“自动补给”
    leo.beginTime = leo.now(); //脚本启动时间(Date类型，用于时间计算)
    leo.beginTimeStr = leo.formatDate(leo.now(), leo.FORMAT_DATETIME); //脚本启动时间(字符串类型，用于时间显示)
    leo.log('欢迎使用红叶の脚本，版本['+leo.version+']，当前线路['+leo.getLine()+'线]');
    //统计信息
    leo.oldXp = cga.GetPlayerInfo().xp; //脚本启动时的经验值
    leo.keepAliveStatus = null; //防掉线状态
    leo.moveTimeout = 20;//遇敌速度延时，单位毫秒
    leo.autoWalkBattleWaitTime = 10000;//自动寻路中，战斗后等待时长，单位毫秒
    leo.contactBattleWaitTime = 10000;//原地遇敌时，战斗后等待时长，单位毫秒
    leo.mazeChangeWaitTime = 10000;//迷宫切图时，切换后等待时长，单位毫秒
    leo.highspeed = false; //是否开启了高速战斗
    leo.gametype = '电信'; //区服
    leo.randomMazeAlgorithm = 'DepthFirst'; //迷宫开图算法
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
	leo.setShowPets(false); //隐藏放出的宠物
    leo.talkNpcRetryTimes = 20; //对话NPC无法切图时，失败登出次数
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
        autoShenLan: false, //自动吃深蓝
        autoShenLanListener: null,  //深蓝监听系统信息
        autoDrop: true, //自动丢弃低耐久装备
        autoDropItem: ['十周年纪念戒指|150','平民衣|50','平民鞋|50',,'平民帽|50','平民斧|50','平民弓|50','平民杖|50','ㄑ型手里剑|10','ㄟ型手里剑|10','地水的水晶（5：5）|100','水火的水晶（5：5）|100','火风的水晶（5：5）|100','风地的水晶（5：5）|100'], //自动丢弃物品栏物品（不包括装备栏）： '十周年纪念戒指|150','平民衣|50' 等
        healSelf: false,   //自动治疗自己
        autoUpgradePoint: false,    //是否升级自动加点
        petLoyalProtect: true,  //是否开启宠物忠诚保护
        petLoyalProtectValue: 40,   //宠物忠诚保护值，出战宠物忠诚低于该值，会自动设置宠物待命
        autoExit: false, //是否开启自动结束脚本
        autoExitValue: 5, //x分钟不动自动结束脚本
        autoExitPreHook: 'logBack', //x分钟不动自动结束脚本前置操作
        autoExitMemory:{}, //缓存上一次检查的战斗状态和坐标值
        syncInfo: false, //是否开启角色信息同步功能
        autoChangeLineForLeader: false, //自动跟随队长换线
        autoSetPetBattle: -1, //自动出战宠物-1不设置，0~4为宠物栏1~5
        monitorLoop: async () =>{
            leo.highspeed = await leo.getSubSettings('battle','highspeed');

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

            if(leo.monitor.config.autoExit){
                let autoExitValue = leo.monitor.config.autoExitValue;
                let lastTime = leo.monitor.config.autoExitMemory.lastTime || leo.now();
                let checkTime = leo.now();
                let keepTime = checkTime.getTime() - lastTime.getTime();
                if(keepTime > 1000*60*autoExitValue){
                    await leo.log('【重要提示】 '+autoExitValue+'分钟不动自动结束脚本')
                    if(leo.monitor.config.autoExitPreHook){
                        if(leo.monitor.config.autoExitPreHook === 'logOut') {
                            return cga.LogOut();
                        }
                        if(leo.monitor.config.autoExitPreHook === 'logBack') {
                            await leo.logBack()
                        }
                        if(leo.monitor.config.autoExitPreHook === 'leaveTeam') {
                            await leo.leaveTeam()
                        }
                    }else{
                        await leo.logBack()
                    }
                    return leo.exit(); //超出指定时长，结束脚本
                }

                let lastStatus = leo.monitor.config.autoExitMemory.lastStatus;
                let checkStatus = leo.monitor.config.status;
                if(checkStatus != lastStatus){
                    //战斗状态发生变化，重置时间
                    //console.log('战斗状态发生变化，重置时间')
                    leo.monitor.config.autoExitMemory.lastStatus = checkStatus;
                    leo.monitor.config.autoExitMemory.lastTime = leo.now();
                }
                let lastPos = leo.monitor.config.autoExitMemory.lastPos;
                let mapXY = cga.GetMapXY();
                let checkPos = mapXY.x + ',' + mapXY.y;
                if(checkPos != lastPos){
                    //坐标发生变化，重置时间
                    //console.log('坐标发生变化，重置时间')
                    leo.monitor.config.autoExitMemory.lastPos = checkPos;
                    leo.monitor.config.autoExitMemory.lastTime = leo.now();
                }
                let lastHPMP = leo.monitor.config.autoExitMemory.lastHPMP;
                let playerinfo = cga.GetPlayerInfo();
                let checkHPMP = playerinfo.hp + ',' + mapXY.mp;
                if(checkHPMP != lastHPMP){
                    //玩家HP或者MP发生变化，重置时间
                    //console.log('玩家HP或者MP发生变化，重置时间')
                    leo.monitor.config.autoExitMemory.lastHPMP = checkHPMP;
                    leo.monitor.config.autoExitMemory.lastTime = leo.now();
                }
            }

            //装备耐久保护
            if(!cga.isInBattle() && leo.monitor.config.equipsProtect){
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

            //自动丢弃低耐久装备
            if(!cga.isInBattle() && leo.monitor.config.autoDrop){
                var dropEquips = cga.getInventoryItems().filter(equip => {
                    if(leo.monitor.config.autoDropItem.length>0){
                        var autoDropItemArr = leo.monitor.config.autoDropItem.map(x=>x.split('|')[0]);
                        for (var i = 0; i < autoDropItemArr.length; i++) {
                            if(autoDropItemArr[i] == equip.name){
                                var endurance = cga.getEquipEndurance(equip);
                                var minValue = leo.monitor.config.autoDropItem[i].split('|')[1] || 0;
                                return endurance && endurance[0] <= minValue;
                            }
                        }
                    }
                    return false;
                });
                if(dropEquips.length>0){
                    cga.DropItem(dropEquips[0].pos);
                }
            }

            //宠物忠诚保护
            if(!cga.isInBattle() && leo.monitor.config.petLoyalProtect
                 && leo.monitor.config.petLoyalProtectValue > 0){
                var playerInfo = cga.GetPlayerInfo();
                if(playerInfo.petid!=-1){
                    var pet = cga.GetPetInfo(playerInfo.petid);
                    if(pet && pet.loyality < leo.monitor.config.petLoyalProtectValue){
                        cga.ChangePetState(pet.index, cga.PET_STATE_READY);
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

            //自动吃深蓝
            if(!cga.isInBattle()){
                if(leo.monitor.config.autoShenLan){
                    if(leo.monitor.config.autoShenLanListener === null){
                        leo.monitor.config.autoShenLanListener = () => {
                            console.log(leo.logTime()+'【开启】深蓝监听');
                            leo.loop( async ()=>{
                                if(!leo.monitor.config.autoShenLan){
                                    return leo.reject();
                                }
                                await leo.waitMessageUntil((chat) => {
                                    if(!leo.monitor.config.autoShenLan){
                                        return true;
                                    }
                                    if (chat.unitid == -1 && chat.msg && chat.msg.indexOf('道具的效果消失了') >= 0 ) {
                                        console.log(leo.logTime()+'【深蓝监听】道具的效果消失了');
                                        if(leo.has(18526)){
                                            leo.useItemEx(18526);//开光深蓝18526
                                            console.log(leo.logTime()+'【深蓝监听】使用了【香水·深蓝九号】');
                                        }else{
                                            console.log(leo.logTime()+'【深蓝监听】已没有道具【香水·深蓝九号】');
                                        }
                                    }
                                    if (chat.unitid == cga.GetPlayerInfo().unitid && chat.msg && chat.msg.indexOf('道具的效果消失了') >= 0 ) {
                                        console.log(leo.logTime()+'【深蓝监听】道具的效果消失了');
                                        if(leo.has(18526)){
                                            leo.useItemEx(18526);//开光深蓝18526
                                            console.log(leo.logTime()+'【深蓝监听】使用了【香水·深蓝九号】');
                                        }else{
                                            console.log(leo.logTime()+'【深蓝监听】已没有道具【香水·深蓝九号】');
                                        }
                                    }
                                });
                            });
                        }
                        leo.monitor.config.autoShenLanListener();
                    }
                }else{
                    if(leo.monitor.config.autoShenLanListener !== null){
                        console.log(leo.logTime()+'【关闭】深蓝监听');
                        leo.monitor.config.autoShenLanListener = null;
                    }
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

            //自动加点
            leo.upgrade();

            //自动设置宠物出战
            if(leo.monitor.config.autoSetPetBattle > -1 && leo.monitor.config.autoSetPetBattle < 5) {
                leo.setPetBattle(leo.monitor.config.autoSetPetBattle);
            } 

            setTimeout(leo.monitor.config.monitorLoop, 2000);//每秒循环调用
        }
    };
    leo.monitor.keepAlive();    //启动防掉线循环
    setTimeout(leo.monitor.config.monitorLoop, 5000);//启动监控

    return cga;
});