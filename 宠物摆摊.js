//修改这里的地图名、坐标、朝向和宠物名字
//地图只支持艾尔莎岛、里谢里雅堡和法兰城
//坐标是人物站的坐标
//朝向0代表正东2代表正南4代表正西6代表正北 有效值0~7
/*
如果只是单纯挂机站街，只需要把

['艾尔莎岛', [146, 108], 0, '爱莉西雅'],
['里谢里雅堡', [32, 82], 0, '多拉姆糖'],

这两行删除即可
*/

var petList = [
	['艾尔莎岛', [146, 108], 0, '爱莉西雅'],
	['里谢里雅堡', [32, 82], 0, '多拉姆糖'],
];


var Async = require('Async')
var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	
	var loop = function(){
		//说话防掉线
		cga.SayWords("", 0, 3, 1);

		setTimeout(loop, 30000);
	}
	
	Async.eachSeries(petList, (data, cb)=>{
		
		switch(data[0]){
			case '艾尔莎岛':
			{
				var pets = cga.GetPetsInfo();
				
				var pet = pets.find((p)=>{
					return (p.name == data[3] || p.realname == data[3])
				});
				
				if(pet == undefined || pet.battle_flags == 3)
				{
					cb();
					return;
				}
				
				var go = ()=>{

					cga.walkList([ data[1] ], ()=>{
						cga.turnOrientation(data[2]);
						setTimeout(()=>{
							cga.ChangePetState(pet.index, cga.PET_STATE_REST);
							setTimeout(cb, 500);
						}, 500);
					});
				}
				
				if(cga.GetMapName() == '艾尔莎岛'){
					go();
				} else {
					cga.travel.newisland.toStone('X', go);
				}
				break;
			}
			case '里谢里雅堡':
			{
				var pets = cga.GetPetsInfo();
				
				var pet = pets.find((p)=>{
					return (p.name == data[3] || p.realname == data[3])
				});
				
				if(pet == undefined || pet.battle_flags == 3)
				{
					cb();
					return;
				}
				
				var go = ()=>{

					cga.walkList([ data[1] ], ()=>{
						cga.turnOrientation(data[2]);
						setTimeout(()=>{
							cga.ChangePetState(pet.index, cga.PET_STATE_REST);
							setTimeout(cb, 500);
						}, 500);
					});
				}
				
				if(cga.GetMapName() == '里谢里雅堡'){
					go();
				} else {
					cga.travel.falan.toStone('C', go);
				}
				break;
			}
			case '法兰城':
			{
				var pets = cga.GetPetsInfo();
				
				var pet = pets.find((p)=>{
					return (p.name == data[3] || p.realname == data[3])
				});
				
				if(pet == undefined || pet.battle_flags == 3)
				{
					cb();
					return;
				}
				
				var go = ()=>{

					cga.walkList([ data[1] ], ()=>{
						cga.turnOrientation(data[2]);
						setTimeout(()=>{
							cga.ChangePetState(pet.index, cga.PET_STATE_REST);
							setTimeout(cb, 500);
						}, 500);
					});
				}
				
				if(cga.GetMapName() == '法兰城'){
					go();
				} else {
					cga.travel.falan.toStone('S2', go);
				}
				break;
			}
		}
	}, ()=>{
		cga.LogBack();
		loop();
	});
});