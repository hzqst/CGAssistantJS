var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb) =>{
		thisobj.object.func(cb);
	},
	workManager : (cb)=>{
		thisobj.object.workManager(cb);
	},
	doneManager : (cb)=>{
		thisobj.object.doneManager(cb);
	},
	object : {
		level : 1,
		name :'刷鱼刷家具',
		func : (cb) =>{
			if(thisobj.object.skill.lv == 1){
				
				if(cga.GetMapName() != '拿潘食品店')
				{
					cga.travel.falan.toStone('E2', ()=>{
						cga.walkList([
						[217, 53, '拿潘食品店'],
						[10, 14],
						], cb);
					});
				} else {
					cga.walkList([
					[10, 14],
					], cb);
				}
			}
			else
			{
				if(cga.GetMapName() != '哈丝塔的家')
				{
					cga.travel.newisland.toStone('D', ()=>{
						cga.walkList([
							[167, 102, '哈丝塔的家'],
							[11, 10],
						], cb)
					});
				}
				else
				{
					cga.walkList([
						[11, 10],
					], cb)
				}
			}
		},
		workManager : (cb)=>{
			
			cga.turnDir(0);
			
			var dialogHandler = (err, dlg)=>{
				if(dlg && (dlg.options & 4) == 4)
				{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog(dialogHandler);
					return;
				}
				if(dlg && (dlg.options & 32) == 32)
				{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(dialogHandler);
					return;
				}
				else if(dlg && dlg.options == 1)
				{
					cga.ClickNPCDialog(1, 0);
					setTimeout(()=>{
						cga.assessAllItems(cb);
					}, 500);
					return;
				}
				else
				{
					cga.assessAllItems(cb);
					return;
				}
			}
			
			cga.AsyncWaitNPCDialog(dialogHandler);
		},
		doneManager : (cb)=>{
			//更新技能等级
			thisobj.object.skill = cga.findPlayerSkill('鉴定');
			cb(null);
		},
		extra_dropping : (item)=>{

			if(thisobj.object.skill.lv < 6 && item.itemid == 14670)
				return true;
			
			return item.assessed && (item.itemid == 14668 || item.itemid == 14669 || item.itemid == 14670 || item.itemid == 18184);
		},
		skill : null,
	},
	check_done : ()=>{
		return (cga.getItemCount((it)=>{
			return it.name == '抓猫用的鱼？' || it.name == '家具？';
		}) > 0 && cga.findAssessableItem() == null) ? true : false;
	},
	translate : (pair)=>{
		return false;
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	},
	init : ()=>{
		thisobj.object.skill = cga.findPlayerSkill('鉴定');
		if(!thisobj.object.skill)
			throw new Error('需要鉴定技能!');
	}
}

module.exports = thisobj;