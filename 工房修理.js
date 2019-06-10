var cga = require('./cgaapi')(function(){
	
	console.log('自动修理，起始点：任意 前往法兰工房修耐久小于50%的装备')
	
	var doRepair = function(){
		
		cga.travel.falan.toMineStore(null, ()=>{
			cga.walkList([
			[8, 9],
			], (r)=>{
				var items = cga.getInventoryItems();
				var needRepair = [];

				for(var i in items){
					var endurance = cga.getEquipEndurance(items[i]);
					if(endurance != null && endurance[0] < endurance[1] ){
						needRepair.push({
							itemid : items[i].itemid,
							itempos : items[i].pos,
							count : 1
						});
					}
				}
				
				cga.TurnTo(6, 7);
				cga.AsyncWaitNPCDialog(function(dlg){
					console.log(needRepair);
					cga.SellNPCStore(needRepair)
					cga.AsyncWaitNPCDialog(function(dlg3){
						cga.SayWords('修理完毕...', 0, 3, 1);
					});
				});
			});			
		});
	}
	
	doRepair();
});