require('./common').then(cga=>{
	//leo.baseInfoPrint();
	var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1,
        doctorName: '医道之殇'
    };

	leo.log('红叶の森罗万象(树海)脚本，启动~');

	var goto = 0;//0-状态技能，1-物理技能，2-魔法技能

	var goto0 = ()=>{
		return leo.autoWalk([66, 52])
		.then(()=>leo.talkNpc(67, 52, leo.talkNpcSelectorYes))
		.then(()=>leo.delay(2000))
		.then(()=>leo.autoWalk([97, 392]))
		.then(()=>leo.log('已到达状态技能学习地点，学习完后，输入3个1继续前往物理技能学习地点'))
		.then(()=>{
			return leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('111') >= 0) {
					return true;
				}
			});
		})
		.then(()=>goto1());
	}

	var goto1 = ()=>{
		return leo.autoWalk([216, 260])
		.then(()=>leo.log('已到达物理技能学习地点，学习完后，输入3个2继续前往魔法技能学习地点'))
		.then(()=>{
			return leo.waitMessageUntil((chat) => {
				if (chat.msg && chat.msg.indexOf('222') >= 0) {
					return true;
				}
			});
		})
		.then(()=>goto2());
	}

	var goto2 = ()=>{
		return leo.autoWalk([280, 357])
		.then(()=>leo.talkNpc(280, 356, leo.talkNpcSelectorYes))
		.then(()=>leo.delay(2000))
		.then(()=>leo.autoWalk([393, 392]))
		.then(()=>leo.talkNpc(394, 392, leo.talkNpcSelectorYes))
		.then(()=>leo.delay(2000))
		.then(()=>leo.autoWalk([337, 164]))
		.then(()=>leo.talkNpc(337, 163, leo.talkNpcSelectorYes))
		.then(()=>leo.delay(2000))
		.then(()=>leo.autoWalk([360, 18]))
		.then(()=>leo.log('已到达魔法技能学习地点，请学习技能，脚本结束'))
		.then(()=>leo.done());
	}

	leo.todo()
	.then(()=>{
		var currentMap = cga.GetMapName();
		if (currentMap == '树海') {
			return leo.log('已经在树海了！')
			.then(()=>leo.log('输入3个0前往状态技能学习地点'))
			.then(()=>leo.log('输入3个1前往物理技能学习地点'))
			.then(()=>leo.log('输入3个2前往魔法技能学习地点'))
			.then(()=>{
				return leo.waitMessageUntil((chat) => {
					if (chat.msg && chat.msg.indexOf('000') >= 0) {
						goto = 0;
						return goto0();
					}else if (chat.msg && chat.msg.indexOf('111') >= 0) {
						goto = 1;
						return goto1();
					}else if (chat.msg && chat.msg.indexOf('222') >= 0) {
						goto = 2;
						return goto2();
					}
				});
			});
		}

		return leo.logBack()
		.then(()=>leo.prepare(prepareOptions))
		.then(()=>leo.goto(n => n.falan.eout))
		.then(()=>leo.autoWalk([583,172,'土之洞窟']))
		.then(()=>leo.autoWalk([16, 17]))
		.then(()=>leo.talkNpc(17, 17, leo.talkNpcSelectorYes, '树海'))
		.then(()=>goto0())
		.then(()=>leo.done());
	});
	
});