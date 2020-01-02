var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	func : (cb)=>{
		var skill_heal = cga.findPlayerSkill('治疗');
		if(!skill_heal){
			throw new Error('你没有治疗技能');
			return;
		}
		var requiremp = 25 + skill_heal.lv * 5;
		
		var playerinfo = cga.GetPlayerInfo();
		
		if (playerinfo.mp < requiremp){
			cb(new Error('治疗蓝量不足'));
			return;
		}

		cga.StartWork(skill_heal.index, skill_heal.lv-1);
		cga.AsyncWaitPlayerMenu((err, players)=>{
			cga.PlayerMenuSelect(0);
			cga.AsyncWaitUnitMenu((err, units)=>{
				cga.UnitMenuSelect(0);
				cga.AsyncWaitWorkingResult((err, r)=>{
					if(playerinfo.health != 0)
						thisobj.func(cb);
					else
						cb(null);
				});
			});
		});
	},
	translate : (pair)=>{
		return false;
	},
	loadconfig : (obj, cb)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}	
}

module.exports = thisobj;