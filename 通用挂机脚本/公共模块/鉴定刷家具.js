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
		level : 2,
		name :'刷家具',
		func : (cb) =>{
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
		},
		workManager : (cb)=>{
			
			thisobj.object.skill = cga.findPlayerSkill('鉴定');
			cga.turnTo(12, 10);
			cga.AsyncWaitNPCDialog((err, dlg)=>{
				if(dlg && dlg.message.indexOf('要的话就拿走吧') > 0)
				{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog((err, dlg)=>{
						if(dlg && dlg.message.indexOf('谢谢你的帮忙') > 0)
						{
							cga.ClickNPCDialog(1, 0);
							setTimeout(()=>{
								cga.assessAllItems(cb);
							}, 500);
						}
						else
						{
							cga.assessAllItems(cb);
							return;
						}
					});
				}
				else
				{
					cga.assessAllItems(cb);
					return;
				}
			});
		},
		doneManager : (cb)=>{
			cb(null);
		},
		extra_dropping : (item)=>{
			if(skill.lv < 5 && item.itemid == 14670)
				return true;
			return item.assessed && (item.itemid == 14668 || item.itemid == 14669 || item.itemid == 14670);
		},
		skill : null,
	},
	check_done : ()=>{
		return (cga.getItemCount('家具？') > 0 && cga.findAssessableItem() == null) ? true : false;
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

	}
}

module.exports = thisobj;