require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
	//leo.baseInfoPrint();
    var autoBoss = false; 	//自动打BOSS梅兹
    var getJob = false;		//true-就职忍者，false-仅做任务

	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };
    var teammates = [];
	leo.log('红叶の忍者就职脚本，启动~');

	cga.EnableFlags(cga.ENABLE_FLAG_TEAMCHAT, false); //关闭队聊
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, false); //关闭组队
	var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = true;

    var talkNpcSay = (x,y,words,yesOrNo = true) => {
    	var talkNpcSelectorYesOrNo;
    	if(yesOrNo){
    		talkNpcSelectorYesOrNo = leo.talkNpcSelectorYes;
    	}else{
    		talkNpcSelectorYesOrNo = leo.talkNpcSelectorNo;
    	}

    	return leo.turnTo(x,y)
    	.then(()=>leo.say(words))
		.then(()=>leo.talkNpc(-1,-1,talkNpcSelectorYesOrNo))
		.then(()=>leo.delay(500));
    }

	leo.logBack()
	.then(()=>leo.checkHealth())
	.then(()=>leo.goto(n=>n.falan.w2))
	.then(()=>leo.autoWalkList([[102,131,'安其摩酒吧'],[20,9]]))
	.then(()=>leo.talkNpc(21,9,leo.talkNpcSelectorYes))
	.then(()=>leo.autoWalkList([[16,23,'法兰城'],[219,136,'科特利亚酒吧'],[17,17]]))
	.then(()=>talkNpcSay(17,18,'亚尔科尔...'))
	.then(()=>leo.autoWalkList([[10,16,'法兰城'],[196,33,'别室'],[8,6]]))
	.then(()=>talkNpcSay(9,5,'毒...'))
	.then(()=>leo.goto(n=>n.castle.x))
	.then(()=>leo.autoWalkList([[41,50,'里谢里雅堡 1楼'],[74,19,'里谢里雅堡 2楼'],[0,74,'图书室'],[18,28]]))
	.then(()=>talkNpcSay(18,29,'毒...'))
	.then(()=>leo.autoWalkList([[29,18,'里谢里雅堡 2楼'],[49,80,'里谢里雅堡 1楼'],[45,20,'启程之间'],[43,44]]))
	.then(()=>leo.talkNpc(7,leo.talkNpcSelectorYes,'圣拉鲁卡村的传送点'))
	.then(()=>leo.autoWalkList([[7,3,'村长的家'],[2,9,'圣拉鲁卡村'],[37,50,'医院'],[10,13]]))
	.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
	.then(()=>leo.goto(n=>n.teleport.yer))
	.then(()=>leo.autoWalkList([[32,65,'旧金山酒吧'],[21,3]]))
	.then(()=>talkNpcSay(22,3,'心美...'))
	.then(()=>leo.goto(n=>n.falan.w2))
	.then(()=>leo.autoWalkList([[72,104,'陶欧食品店'],[12,11]]))
	.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
	.then(()=>leo.goto(n=>n.falan.eout))
	.then(()=>leo.autoWalk([530,250]))
	.then(()=>talkNpcSay(531,250,'亚尔科尔...'))
	.then(()=>leo.goto(n=>n.teleport.yer))
	.then(()=>leo.autoWalkList([[32,65,'旧金山酒吧'],[21,3]]))
	.then(()=>leo.talkNpc(22,3,leo.talkNpcSelectorYes))
	.then(()=>leo.goto(n=>n.teleport.vinoy))
	.then(()=>leo.autoWalk([49,63]))
	.then(()=>talkNpcSay(50,64,'心美...'))
	.then(()=>leo.autoWalkList([[37,52,'民家'],[13,6]]))
	.then(()=>talkNpcSay(14,5,'心美...'))
	.then(()=>leo.autoWalk([8,10]))
	.then(()=>leo.talkNpc(9,10,leo.talkNpcSelectorYes))
	.then(()=>leo.talkNpc(9,10,leo.talkNpcSelectorYes))
	.then(()=>leo.autoWalkList([[4,9,'民家'],[3,9,'维诺亚村'],[67,47,'芙蕾雅'],[351,382]]))
	.then(()=>talkNpcSay(352,381,'乌克兰...'))
	.then(()=>leo.autoWalkList([
		[354,367,'小路'],[46,23,'忍者的隐居地'],
		[19,9,'忍者之家'],[24,32],[22,16],
		[14,21],[13,20]
	]))
	.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes,'忍者之家2楼'))
	.then(()=>leo.autoWalkList([
		[15,29],[21,28],[32,12],[38,18],[37,19,'忍者之家'],
		[39,21],[44,33],[49,38],[63,38]
	]))
	.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'井的底部'))
	.then(()=>leo.autoWalkList([
		[7,4,'通路'],[22,26,'*'],[5,15,'乌克兰'],[77,47,'民家'],[8,7]
	]))
	.then(()=>talkNpcSay(9,6,'毒...'))
	.then(()=>leo.autoWalkList([
		[1,10,'乌克兰'],[69,28,'村长的家'],[16,9,'族长的家地下室'],[10,11]
	]))
	.then(()=>talkNpcSay(11,11,'毒...',false))
	.then(()=>{
		if(autoBoss){
			return leo.talkNpc(11,11,leo.talkNpcSelectorYes)
			.then(()=>leo.waitAfterBattle())
		}else{
			return leo.log('请手动点击梅兹进入战斗，战斗胜利后输入3个1继续')
			.then(()=>leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('111') >= 0) {
					return true;
				}
			}))
			.then(()=>leo.waitAfterBattle());
		}
	})
	.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
	.then(()=>{
		if(getJob){
			var sayType = 0;//0-白天,1-夜晚
			var sayTypeWords = [
				['柿...','影...','松...','绿...','五...','子...','笔...','三...','八...','梅...',],
				['十...','八...','红...','蓝...','后...','桃...','忍...','三...','五...','白...',]
			];
			return leo.autoWalkList([[7,8,'村长的家'],[12,7]])
			.then(()=>talkNpcSay(11,6,'忍者...'))
			.then(()=>leo.autoWalkList([[2,22,'乌克兰'],[46,22,'小助的家'],[7,6]]))
			.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalk([7,6]))
			.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalk([7,6]))
			.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalk([7,8]))
			.then(()=>leo.talkNpc(6, (dialog) => {
				if(dialog && dialog.message && dialog.message.indexOf('1') >= 0){
					sayType = 1;
					return false;
				}
				return false;
			}))
			.then(()=>{
				var index = 0;
				return leo.loop(()=>{
					if(index<sayTypeWords[sayType].length){
						var words = sayTypeWords[sayType][index];
						index++;
						return leo.autoWalk([7,4])
						.then(()=>talkNpcSay(7,3,words))
						.then(()=>leo.delay(1000));
					}else{
						return leo.reject();
					}
				})
			})
			.then(()=>leo.log('请自行选择就职或转职，完成后输入3个2继续'))
			.then(()=>leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('222') >= 0) {
					return true;
				}
			}))
			.then(()=>leo.autoWalkList([[6,15,'乌克兰'],[90,84,'通路'],[22,26,'*'],[45,43,'井的底部'],[19,12,'忍者之家'],[74,37],[74,5],[59,5]]))
			.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalkList([[69,7],[69,30],[60,30],[60,26],[64,26],[64,19],[59,19],[59,15],[61,15],[61,13],[62,13]]))
			.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'忍者之家2楼'))
			.then(()=>leo.autoWalkList([[64,14],[61,17],[66,17],[66,25],[70,25]]))
			.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes,'忍者之家  隐藏道路'))
			.then(()=>leo.autoWalk([8,10,'忍者之家三楼']))
			.then(()=>leo.autoWalkList([[8,8],[8,19],[5,19]]))
			.then(()=>leo.talkNpc(4,leo.talkNpcSelectorYes))
			.then(()=>leo.autoWalk([12,17]))
			.then(()=>leo.log('请自行学习暗杀技能，完成后输入3个3继续'))
			.then(()=>leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('333') >= 0) {
					return true;
				}
			}))
			.then(()=>leo.goto(n=>n.teleport.vinoy))
			.then(()=>leo.autoWalkList([[37,52,'民家'],[13,6]]))
			.then(()=>leo.talkNpc(14,5,leo.talkNpcSelectorYes))
			.then(()=>leo.goto(n=>n.falan.w1))
			.then(()=>leo.autoWalk([144,19]))
			.then(()=>leo.talkNpc(144,18,leo.talkNpcSelectorYes))
			.then(()=>{
				leo.log('任务完结');
				leo.log('可与法兰城南门外秋刀奈（409.295）对话，选“是”传送至小路（27.73）处');
				leo.log('通过（46.23）处楼梯抵达忍者的隐居地，按行走或战斗路线最终抵达乌克兰村');
			})
		}else{
			return leo.goto(n=>n.teleport.vinoy)
			.then(()=>leo.autoWalkList([[37,52,'民家'],[13,6]]))
			.then(()=>leo.talkNpc(14,5,leo.talkNpcSelectorYes))
			.then(()=>leo.goto(n=>n.falan.w2))
			.then(()=>leo.autoWalkList([[102,131,'安其摩酒吧'],[20,9]]))
			.then(()=>leo.talkNpc(21,9,leo.talkNpcSelectorYes))
			.then(()=>leo.goto(n=>n.falan.w1))
			.then(()=>leo.autoWalk([144,19]))
			.then(()=>leo.talkNpc(144,18,leo.talkNpcSelectorYes))
			.then(()=>{
				leo.log('任务完结');
				leo.log('可与法兰城南门外秋刀奈（409.295）对话，选“是”传送至小路（27.73）处');
				leo.log('通过（46.23）处楼梯抵达忍者的隐居地，按行走或战斗路线最终抵达乌克兰村');
			});
		}
	});
});