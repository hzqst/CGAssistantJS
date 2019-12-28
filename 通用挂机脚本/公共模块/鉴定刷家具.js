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
			
			var dialogHandler = (err, dlg)=>{
				if(dlg && (dlg.options & 4) == 4)
				{
					cga.ClickNPCDialog(4, 0);
					cga.AsyncWaitNPCDialog(dialogHandler);
				}
				if(dlg && (dlg.options & 32) == 32)
				{
					cga.ClickNPCDialog(32, 0);
					cga.AsyncWaitNPCDialog(dialogHandler);
				}
				else if(dlg && dlg.options == 1)
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
			}
			
			cga.AsyncWaitNPCDialog(dialogHandler);
		},
		doneManager : (cb)=>{
			cb(null);
		},
		extra_dropping : (item)=>{
			if(thisobj.object.skill && thisobj.object.skill.lv < 5 && item.itemid == 14670)
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