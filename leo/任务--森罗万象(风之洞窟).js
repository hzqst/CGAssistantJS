require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var isLogBackFirst = true;
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };

	leo.log('红叶の森罗万象(风之洞窟)脚本，启动~');

	var pifengCount = cga.getItemCount('狐皮披风');
	if(pifengCount<=0){
		leo.log('必须带上狐皮披风，请检查配置');
		return;
	}

	leo.todo().then(()=>{
		if(isLogBackFirst){
			return leo.logBack();
		}else{
			return leo.next();
		}
	})
	.then(()=>{
		return leo.prepare(prepareOptions)	//招魂、治疗、补血、卖石
		.then(()=>leo.goto(n => n.teleport.kili))
		.then(()=>leo.autoWalkList([[79, 76, '索奇亚'],[369, 351,'风之洞窟'],[18, 9]]))
		.then(()=>leo.talkNpc(0, leo.talkNpcSelectorYes))
		.then(()=>leo.delay(1000))
		.then(()=>leo.autoWalk([23, 5, '风之洞窟1楼']))
		.then(()=>leo.walkRandomMazeUntil(() => {
				const mn = cga.GetMapName();
				if (mn == '风之洞窟 10楼') {
					return true;
				}
				return false;
		},false))
		.then(()=>leo.autoWalk([15, 10]))
		.then(()=>{
			//10楼，打黄蜂的蜜*6
			var protect = {
				checker : ()=>{
					var count = cga.getItemCount('黄蜂的蜜');
					if(count>=6){
						return true;
					}
				}
			}
			return leo.encounterTeamLeader(protect);
        })
		.then(()=>leo.autoWalk([15,6]))
		.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
		.then(()=>leo.delay(1000))
		.then(()=>leo.autoWalk([10,8,'风之洞窟11楼']))
		.then(()=>leo.walkRandomMazeUntil(() => {
				const mn = cga.GetMapName();
				if (mn == '风之洞窟 20楼') {
					return true;
				}
				return false;
		},false))
		.then(()=>leo.autoWalk([8, 8]))
		.then(()=>{
			//20楼，如果有米摩沙的弦乐器，直接通过，没有则打风蜘蛛丝*6
			if(cga.getItemCount('米摩沙的弦乐器')<0){
				var protect = {
					checker : ()=>{
						var count = cga.getItemCount('风蜘蛛丝');
						if(count>=6){
							return true;
						}
					}
				}
				return leo.encounterTeamLeader(protect);
			}
        })
		.then(()=>{
			//20楼，没有米摩沙的弦乐器，打到风蜘蛛丝*6后，交给NPC换米摩沙的弦乐器
			//注意身上要有 风蜘蛛的丝*6、黄月木*4、赤松*4、铜条*1
			if(cga.getItemCount('米摩沙的弦乐器')<0){
				return leo.autoWalk([14, 7])
				.then(()=>leo.talkNpc(6 , leo.talkNpcSelectorYes))
				.then(()=>leo.delay(1000));
			}
		})
		.then(()=>leo.autoWalk([27, 13]))
		.then(()=>leo.talkNpc(6,leo.talkNpcSelectorYes))
		.then(()=>leo.delay(1000))
		.then(()=>leo.autoWalk([46, 11,'大风穴山顶']))
		.then(()=>leo.autoWalk([39, 41]))
		.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
		.then(()=>leo.delay(1000))
		.then(()=>leo.autoWalk([39,62]))
		.then(()=>leo.talkNpc(2,leo.talkNpcSelectorYes))
		.then(()=>leo.delay(1000))
		.then(()=>leo.autoWalk([19,19]))
		.then(()=>leo.talkNpc(0,leo.talkNpcSelectorYes))
		.then(()=>leo.waitAfterBattle())
		.then(()=>leo.waitUntil(()=>{
			var mapInfo = cga.getMapInfo();
			if (mapInfo.x == 22 && mapInfo.y == 21) {
				return true;
			}
			return false;
		}))
		.then(()=>leo.autoWalk([25,21,'充满谜的房间']))
		.then(()=>leo.autoWalk([7,3]))
		.then(()=>leo.talkNpc(7,2, (dialog) => {
			if(dialog && dialog.message && dialog.message.indexOf('要把乐谱带走吗') >= 0){
				cga.ClickNPCDialog(4, -1);
				cga.ClickNPCDialog(4, -1);
				cga.ClickNPCDialog(4, -1);
				cga.ClickNPCDialog(4, -1);
				return false;
			}
			return false;
		}))
		.then(()=>leo.log('已拿到风之乐谱*4'));
	});
});